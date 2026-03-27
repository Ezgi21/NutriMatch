# NutriMatch - Geliştirme Görev Listesi (tasks.md)

Bu görev listesi, [prd.md](prd.md) dosyasına dayanarak NutriMatch uygulamasının MVP sürümünün adım adım geliştirilmesi için oluşturulmuştur.

## Aşama 1: Proje Kurulumu ve Arayüz (Frontend) Hazırlığı
- [ ] **1.1.** Proje dizin yapısını oluştur (ör. `index.html`, `style.css`, `app.js`).
- [ ] **1.2.** Tailwind CSS'i projeye dahil et (CDN üzerinden veya npm paketi olarak).
- [ ] **1.3.** Temel Single Page Application (SPA) yapısını HTML içerisinde kurgula.
    - [ ] **Header:** "NutriMatch" uygulama adı ve kısa sloganı ekle.
    - [ ] **Hastalık Seçim Alanı:** Diyabet, Çölyak ve Hipertansiyon için çoklu seçim yapılabilen checkbox bileşenleri oluştur.
    - [ ] **Veri Giriş Alanı:** Restoran menüsü, tarif veya içerik listesinin yapıştırılacağı geniş ve kullanışlı bir `textarea` ekle.
    - [ ] **Analiz Butonu:** "Gemini ile Analiz Et" etiketli ana eylem butonunu oluştur.
    - [ ] **Sonuç Ekranı İskeleti:** Trafik Işığı Sistemi (Yeşil: Güvenli, Sarı: Dikkatli, Kırmızı: Riskli) çıktılarına uygun UI bileşenlerini (kartlar vb.) hazırla.
- [ ] **1.4.** Arayüzün mobil cihazlarda tam uyumlu ve butonların/metinlerin okunaklı olduğunu test et (Responsive Design).

## Aşama 2: Uygulama Mantığı ve Etkileşim (JavaScript)
- [ ] **2.1.** DOM bileşenlerini JavaScript tarafında seç (checkbox'lar, metin kutusu, buton ve sonuç alanları).
- [ ] **2.2.** "Gemini ile Analiz Et" butonuna tıklanma (click) olay dinleyicisini ekle.
- [ ] **2.3.** Kullanıcının seçtiği hastalıkları ve girdiği metni toplayan, veriyi doğrulayan (boş olup olmadığını kontrol eden) yardımcı fonksiyonları yaz.
- [ ] **2.4.** Yüklenme (loading) durumlarını ekrana yansıt (analiz sürecinde kullanıcıya geri bildirim ver).

## Aşama 3: Gemini API Entegrasyonu
- [ ] **3.1.** Google AI Studio'dan alınan Gemini API anahtarını güvenli veya uygun bir şekilde projeye dahil et (örn. environment variable).
- [ ] **3.2.** Gemini API'ye gönderilecek **sistematik prompt'u (istem)** oluştur.
    - Seçilen hastalık kısıtlamalarını içeren dinamik yapı.
    - Girilen gıda içeriğini analiz ederek kategorize eden yönerge (Yeşil, Sarı, Kırmızı).
    - Kırmızı kategori için "alternatif tarif/içerik" üretilmesini emreden yönerge.
- [ ] **3.3.** JavaScript `fetch` veya Gemini SDK kullanarak doğrudan istemciden (client-side) API çağrısını gerçekleştir.

## Aşama 4: Sonuçların İşlenmesi ve UI Güncellemesi
- [ ] **4.1.** Gemini API'den dönen yanıtı (tercihen JSON formatında parse ederek) yapılandır.
- [ ] **4.2.** Sonuçları Trafik Işığı Sistemine göre UI'a yansıt.
    - 🟢 Yenebilir/Güvenli listesini Yeşil Kartta göster.
    - 🟡 Miktar kontrolü gerekenleri Sarı Kartta göster.
    - 🔴 Kaçınılması gerekenleri (Riskli) Kırmızı Kartta göster.
- [ ] **4.3.** Kırmızı kategorideki içerikler için API tarafından sunulan sağlıklı alternatif içerik veya pişirme önerisini sonuç ekranına ekle.

## Aşama 5: Test ve MVP Doğrulaması (Başarı Kriterleri)
- [ ] **5.1.** Uygulama yanıt süresinin **30 saniye altında** olduğunu test et.
- [ ] **5.2.** En az **3 farklı hastalık kombinasyonu** (örn: Hem Diyabet hem Çölyak) ile senaryo testleri yap.
- [ ] **5.3.** Riskli bulunan her bir içerik için sistemin en az 1 alternatif öneri ürettiğini doğrula.
- [ ] **5.4.** Son mobil uyumluluk ve performans kontrollerini gerçekleştir.
