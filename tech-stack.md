# NutriMatch Projesi Teknoloji Yığını (Tech Stack)

Bu belgede NutriMatch projesinin geliştirilmesinde kullanılan teknolojiler ve bu teknolojilerin neden tercih edildiği detaylandırılmaktadır. Uygulama, kronik rahatsızlığı olan kullanıcıların yiyecek içeriklerini hızlıca analiz edebilmesi adına hafif, esnek ve akıllı bir altyapı üzerine kurulmuştur.

## Kullanılan Teknolojiler

### 1. HTML5
- **Rolü:** Uygulamanın temel yapı taşı ve iskeleti.
- **Neden Seçildi?** Modern web standartlarına tam uyum sağlamak, erişilebilirliği (accessibility) yüksek bir Single Page Application (SPA) arayüzü sunmak ve karmaşık framework'lerden kaçınarak **basitliği** en üst düzeye çıkarmak için kullanıldı.

### 2. Tailwind CSS
- **Rolü:** Stil ve kullanıcı arayüzü (UI) tasarımı.
- **Neden Seçildi?** Önceden tanımlanmış utility (fayda) sınıfları sayesinde **hızla** prototip oluşturmaya ve modern tasarımlar ortaya çıkarmaya olanak tanır. CSS dosyalarında kaybolmadan, doğrudan HTML üzerinden responsif (mobil uyumlu) bileşenleri çok daha pratik bir şekilde geliştirebilmek için tercih edildi.

### 3. JavaScript (Vanilla JS)
- **Rolü:** Etkileşimler, DOM manipülasyonu ve uygulama mantığı.
- **Neden Seçildi?** Harici bir paketleyiciye (bundler) veya geniş bir kütüphaneye (React, Vue vb.) ihtiyaç duymadan, doğrudan tarayıcı üzerinde yüksek performanslı ve gecikmesiz çalışacak **hafif (lightweight)** bir mantık kurgulamak istendiğinden temel JavaScript (Vanilla JS) kullanıldı.

### 4. Google AI Studio (Gemini API) - *gemini-1.5-flash* modeli
- **Rolü:** Menü/İçerik analizi ve hastalık uyumluluk raporunun üretilmesi (Yapay Zeka Motoru).
- **Neden Seçildi?** Karışık yemek menülerini, karmaşık diyet kıstaslarına (Diyabet, Çölyak, Hipertansiyon) göre sınıflandırmak geleneksel algoritmalarla son derece zordur. Gemini, sunduğu **güçlü AI desteği** ile doğal dil işleme yeteneklerini uygulamamıza kazandırır. `flash` modelinin seçilme sebebi ise yanıt sürelerini önemli ölçüde kısaltarak **hızlı** sonuç alınmasını sağlamaktır.

## Özet: Mimari Yaklaşım ve Genel Seçim Kriterleri

NutriMatch'i hayata geçirirken benimsediğimiz ana felsefe **"Sunucusuz, Hızlı ve Akıllı"** olmaktır:
- **Hız:** Geleneksel backend sunucularına veri gidip gelmesini beklemek yerine, kullanıcı istemcisi (browser) üzerinden doğrudan Google AI Studio'ya bağlanılarak gecikmeler en aza indirgenmiştir.
- **Basitlik:** Bağımlılık (dependency) karmaşasını ve bakım maliyetlerini sıfıra indirmek adına sadece standart web teknolojileri ekosistemi (HTML/CSS/JS) tercih edilmiştir.
- **Güçlü AI Desteği:** MVP (Minimum Viable Product) aşamasında anında değer üretmek ve esnek kısıtlama senaryolarına saniyeler içinde cevap vermek için Gemini API altyapısı tercih edilmiştir.
