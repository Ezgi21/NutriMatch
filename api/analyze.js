export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { textContent, selectedDiseases } = req.body;

    if (!textContent || !selectedDiseases || !Array.isArray(selectedDiseases)) {
        return res.status(400).json({ error: 'Eksik parametre tespit edildi (textContent veya selectedDiseases)' });
    }

    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Sunucuda API_KEY tanımlı değil (Environment Variable bulunamadı).' });
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
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // Kota dolumu kontrolü
            if (response.status === 429) {
                return res.status(429).json({ error: 'QUOTA_ERROR' });
            }
            return res.status(response.status).json({ 
                error: 'Groq API Server Hatası', 
                details: errorData 
            });
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            // Frontend'e beklenen json_object stringini geri yolluyoruz
            return res.status(200).json({ result: data.choices[0].message.content });
        } else {
            return res.status(500).json({ error: "Groq'tan yapılandırılmış yanıt gelmedi." });
        }
    } catch (error) {
        console.error("Vercel Serverless Fonksiyon Hatası:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
