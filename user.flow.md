# NutriMatch — Kullanıcı Akışı (User Flow)

## Genel Bakış

```
[Profil Seç] → [İçerik Gir] → [Analiz Et] → [Raporu Gör] → [Alternatif Al]
```

---

## Adım 1 — Karşılama ve Profil Seçimi

**Ne görür?**
- Temiz ve modern bir başlık: `NutriMatch`
- Alt başlık: *"Hangi kronik rahatsızlıklarınız var?"*
- Çoklu seçim (checkbox) listesi

**Seçenekler:**
- [ ] Diyabet
- [ ] Çölyak
- [ ] Hipertansiyon
- [ ] *(Genişletilebilir)*

**Ne yapar?**
Kendine uygun hastalıkları işaretler. Birden fazla seçim yapılabilir.

---

## Adım 2 — Veri Girişi

**Ne görür?**
- `Menü veya İçerik Metni Yapıştırın` etiketli geniş bir metin kutusu
- Altında `Analiz Et` butonu

**Ne yapar?**
Elindeki kaynaklardan birini metin kutusuna yapıştırır:
- Restoran menüsü
- Yemek tarifi
- Paketli gıda — içindekiler bölümü

---

## Adım 3 — AI Analiz Süreci

**Ne görür?**
- `Analiz Et` butonuna basıldığında ekranda `Yükleniyor...` animasyonu belirir

**Arka planda ne olur?**
- Gemini API, seçilen hastalık profili ile girilen metni karşılaştırır
- Her içerik maddesi tıbbi kısıtlamalarla eşleştirilir
- Sonuç kategorilere ayrılır

**Süre hedefi:** < 30 saniye

---

## Adım 4 — Sonuç ve Trafik Işığı Raporu

**Ne görür?**
Ekranın altında üç bölümlü bir panel açılır:

| Renk | Kategori | Açıklama |
|---|---|---|
| 🟢 **Yeşil** | Güvenli | Rahatlıkla tüketilebilir maddeler |
| 🟡 **Sarı** | Dikkatli | Sınırlı veya koşullu tüketilebilir maddeler |
| 🔴 **Kırmızı** | Riskli | Kesinlikle kaçınılması gereken içerikler |

**Ne yapar?**
Çıkan sonuçları inceler, hangi maddelerin neden riskli olduğunu anlar.

---

## Adım 5 — Alternatif ve Çözüm Önerisi

**Ne görür?**
Kırmızı kategorisinde bir gıda varsa, Gemini'nin o gıda için ürettiği:
- Güvenli pişirme reçetesi, veya
- Alternatif gıda önerisi

**Sonuç:**
Kullanıcı uygulamadan şunları öğrenmiş olarak ayrılır:
- Neyi yiyip yiyemeyeceğini
- Riskli gıdaların sağlıklı ve uygulanabilir alternatiflerini

---

## Akış Özeti

```
Başla
  │
  ▼
Hastalık profili seç (Checkbox — çoklu seçim)
  │
  ▼
Menü / tarif / içerik metnini yapıştır
  │
  ▼
"Analiz Et" butonuna bas
  │
  ▼
Gemini API işliyor... (Yükleniyor animasyonu)
  │
  ▼
Trafik Işığı Raporu görüntülenir
  ├── 🟢 Yeşil Liste
  ├── 🟡 Sarı Liste
  └── 🔴 Kırmızı Liste
        │
        ▼
    Alternatif tarif / güvenli öneri üretilir
  │
  ▼
Kullanıcı kararını verir
```
