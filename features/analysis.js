// features/analysis.js
// NutriMatch Frontend İstek Yöneticisi Katmanı (Vercel Serverless Function'a Bağlıdır)

// Front-end API Proxy Bağlantı Noktası (Vercel Backend)
const INTERNAL_ENDPOINT = "/api/analyze";

/**
 * Sunucusuz API'mize (Vercel Backend) bağlanıp içerikleri analiz ettirir.
 * Bu sayfada hiçbir API Anahtarı veya model promtu bulunmaz. Hepsi arka planda gizlidir.
 * @param {string} textContent Kullanıcının yazdığı menü/veriler
 * @param {Array<string>} selectedDiseases Kullanıcının seçtiği hastalıklar listesi
 * @returns {string} Modelden gelen json_object string
 */
async function analyzeWithGroq(textContent, selectedDiseases) {
    try {
        const response = await fetch(INTERNAL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                textContent: textContent,
                selectedDiseases: selectedDiseases
            })
        });

        const data = await response.json();

        // Serverless fonksiyondan hata (örneğin quota limiti vb.) geldiyse yönet
        if (!response.ok) {
            if (response.status === 429 || data.error === "QUOTA_ERROR") {
                throw new Error("QUOTA_ERROR");
            }
            throw new Error(data.error || "Sunucu API Hatası");
        }

        // Backend "result" nesnesi ile JSON string dönüyor
        if (data.result) {
            return data.result; // app.js'in beklediği saf JSON dizesi
        } else {
            throw new Error("API'den geçersiz bir yanıt geldi.");
        }
    } catch (error) {
        console.error("Frontend analyze Hatası:", error);
        throw error;
    }
}
