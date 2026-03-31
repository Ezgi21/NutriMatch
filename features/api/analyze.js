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
Kullanıcının seçtiği hastalıklara (${selectedDiseases.join(", ")}) göre gönderilen içerikleri "gıda ismine" göre detaylıca parçalayarak analiz et.
Yanıtın KESİNLİKLE Türkçe olmalı ve her gıda için açıklamalar 2 cümleyi geçmemelidir.
Riskli (kırmızı) olan her gıda için muhakkak sağlıklı bir "alternative" (alternatif yiyecek) önerisi de sun. Önerilen alternatifleri hastalığa göre özelleştir; örneğin Diyabet hastasıysa düşük glisemik indeksli, Çölyak hastasıysa glutensiz alternatifler sun.
Çıktıyı tam olarak aşağıdaki JSON formatında yapılandır. Her gıdayı ayrı bir obje olarak kendi risk kategorisine ekle:
{
  "green": [
    { "food": "Elma", "advice": "Güvenle yiyebilirsiniz." }
  ],
  "yellow": [
    { "food": "Köfte", "advice": "Yağ içeriği yüksek olabilir. Porsiyon kontrolüne dikkat edin." }
  ],
  "red": [
    { "food": "Baklava", "advice": "Aşırı şeker içerir.", "alternative": "Fırında elma veya porsiyon kontrollü sütlü tatlı" }
  ]
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
                temperature: 0.2, // Mantıksal format uyumu için düşük sıcaklık
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
