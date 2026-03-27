# NutriMatch — Product Requirements Document (PRD)

## 1. Ürün Özeti

NutriMatch, diyabet, çölyak veya hipertansiyon gibi kronik hastalığı olan bireylerin dışarıda yemek yerken veya alışveriş yaparken yaşadığı içerik analiz sorununa çözüm sunan yapay zeka destekli bir asistan uygulamasıdır.

Kullanıcılar, karmaşık restoran menülerini veya ürün içeriklerini sisteme yapıştırdığında; **Gemini AI**, bu verileri hastanın özel sağlık kısıtlamalarına ve çoklu hastalık kombinasyonlarına göre saniyeler içinde analiz eder.

---

## 2. Kullanıcı Hedefleri

| Hedef | Açıklama |
|---|---|
| **Hızlı Analiz** | Karmaşık içerik listelerini saniyeler içinde anlamlandırmak |
| **Güvenli Seçim** | Çoklu hastalık kombinasyonlarına göre "yenebilir" onayı almak |
| **Eğitici Alternatifler** | Riskli gıdalar yerine sağlıklı pişirme veya içerik önerileri sunmak |

---

## 3. Ekranlar ve Kullanıcı Akışı

Uygulama, karmaşıklığı önlemek ve 404 hatalarını minimize etmek için **Tek Sayfa (SPA)** yapısında olacaktır.

### 3.1 Bileşenler

**Giriş Paneli (Header)**
- Uygulama adı: `NutriMatch`
- Kısa slogan

**Hastalık Seçim Alanı**
- Kullanıcının kronik hastalıklarını seçeceği çoklu checkbox alanı
- Desteklenen hastalıklar: Diyabet, Çölyak, Hipertansiyon (genişletilebilir)

**Veri Giriş Alanı**
- Restoran menüsü, tarif veya içerik listesinin yapıştırılacağı geniş metin kutusu

**Analiz Butonu**
- Etiket: `Gemini ile Analiz Et`

**Sonuç Ekranı — Trafik Işığı Sistemi**

| Renk | Anlam | İçerik |
|---|---|---|
| 🟢 Yeşil Kart | Güvenli | Tüketilebilir içerikler |
| 🟡 Sarı Kart | Dikkatli | Miktar kontrolü gereken içerikler |
| 🔴 Kırmızı Kart | Riskli | Kaçınılması gerekenler + Gemini'nin ürettiği güvenli alternatif tarif |

### 3.2 Kullanıcı Akışı

```
Hastalık seç → İçerik yapıştır → Analiz Et → Trafik Işığı Raporu → Alternatif Tarif (gerekirse)
```

---

## 4. Teknik Gereksinimler

### Tech Stack

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| **Frontend** | HTML5 + Tailwind CSS | Modern, hızlı, mobil uyumlu arayüz |
| **AI / Intelligence** | Gemini API (Google AI Studio) | Ücretsiz erişim, güçlü metin analizi |
| **Deployment** | Lovable veya Netlify | Hızlı internete çıkış, anlık güncellemeler |

### Mimari Notlar

- Sunucu tarafı gerekmez; tüm AI çağrıları doğrudan istemciden yapılır
- API anahtarı yönetimi için environment variable kullanılmalıdır
- Tek HTML dosyası veya minimal SPA yapısı yeterlidir

---

## 5. Başarı Kriterleri (MVP)

- [ ] Uygulama **30 saniye** altında yanıt verir
- [ ] En az **3 farklı kronik hastalık kombinasyonu** hatasız analiz edilir
- [ ] Mobil cihazlarda butonlar ve metinler tam okunur olur
- [ ] Kırmızı kategorideki her içerik için en az 1 alternatif öneri üretilir

---

## 6. Kapsam Dışı (Bu MVP'de Yok)

- Kullanıcı girişi / hesap sistemi
- Geçmiş analiz kaydı
- Barkod tarama
- Çoklu dil desteği

---

> **Not:** Bu belge MVP kapsamını tanımlar. İleride eklenecek özellikler için ayrı bir backlog belgesi oluşturulacaktır.
