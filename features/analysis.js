// features/analysis.js
// NutriMatch Groq API (Llama 3.3) Sağlayıcısı ve Veri Analizi Katmanı

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Çevresel değişken (Environment Variable) okuma işlemi
// Vercel üzerindeki Environment Variable okuması için doğrudan kullanım
const apiKey = process.env.API_KEY || ""; 

/**
 * Groq API'ye bağlanıp yemek içeriğini sistem kısıtlamalarına göre sınıflandırır.
 * @param {string} textContent Kullanıcının yazdığı menü/veriler
 * @param {Array<string>} selectedDiseases Kullanıcının seçtiği hastalıklar listesi
 * @returns {string} Modelden gelen json_object string
 */
async function analyzeWithGroq(textContent, selectedDiseases) {
    if (!apiKey || apiKey.trim() === "") {
        throw new Error("Geçerli bir API Anahtarı bulunamadı! Lütfen Vercel ayarlarından API_KEY ortam değişkenini kontrol edin.");
    }

    const systemInstruction = `Sen uzman bir beslenme asistanısın.
Kullanıcının seçtiği hastalıklara (${selectedDiseases.join(", ")}) göre gönderilen içerikleri analiz et.
Yanıtın KESİNLİKLE Türkçe olmalı ve açıklamaların asla 3 cümleyi geçmemelidir.
Çıktıyı tam olarak aşağıdaki JSON formatında yapılandır. Risk seviyesini, tehlikeli maddeleri ve sağlıklı alternatifleri içerecek şekilde eşleştir:
{
  "risk_level": "Düşük / Orta / Yüksek",
  "green": ["Güvenli ürünler"],
  "yellow": ["Dikkatli tüketilmesi gerekenler"],
  "red": ["Tehlikeli maddeler (uygunsuz içerikler ve nedenleri)"],
  "alternative": "Sağlıklı alternatifler ve öneriler (maksimum 3 cümle)"
}
Ürün bulunmayan kategoriyi boş dizi [] bırak. Yazılı hiçbir ek açıklama yapmadan sadece JSON döndür.`;

    const userMessage = `Analiz edilecek içerikler:\n"${textContent}"`;

    try {
        const response = await fetch(GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.2, // Mantıksal format uyumu için düşük sıcaklık
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json().catch(() => ({}));
            
            if (response.status === 429) {
                throw new Error("QUOTA_ERROR");
            }
            throw new Error(`Groq API Hatası: ${response.status} - ${errorDetails.error?.message || "Bilinmeyen Hata"}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error("Groq API'den yapılandırılmış bir yanıt gelmedi.");
        }
    } catch (error) {
        console.error("analyzeWithGroq Hatası:", error);
        throw error; // DOM işlemleri tarafından yakalanması için fırlat
    }
}
