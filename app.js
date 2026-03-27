// app.js
// NutriMatch Ana Uygulama Mantığı - Arayüz ve DOM Yönetimi

document.addEventListener("DOMContentLoaded", () => {
    // Arama, Giriş ve Sonuç Komponentleri
    const btnAnalyze = document.getElementById("analyze-btn");
    const inputIngredients = document.getElementById("ingredients-input");
    
    // Checkbox'lar
    const chkDiyabet = document.getElementById("chk-diyabet");
    const chkColyak = document.getElementById("chk-colyak");
    const chkHipertansiyon = document.getElementById("chk-hipertansiyon");

    // Yükleniyor ve Sonuç Alanları
    const loadingIndicator = document.getElementById("loading-indicator");
    const resultsSection = document.getElementById("results-section");
    const resultGreen = document.getElementById("result-green");
    const resultYellow = document.getElementById("result-yellow");
    const resultRed = document.getElementById("result-red");
    const resultAlternative = document.getElementById("result-alternative");

    // Geçmiş Aramalar (Son 5 Analiz) DOM
    const historyContainer = document.getElementById("history-container");
    const historyList = document.getElementById("history-list");
    const historyCount = document.getElementById("history-count"); 
    let searchHistory = JSON.parse(localStorage.getItem("nutrimatch_history")) || [];

    // Güvenli Alışveriş Listesi DOM 
    const safeListContainer = document.getElementById("safe-list-container");
    const safeListEl = document.getElementById("safe-list");
    const clearSafeListBtn = document.getElementById("clear-safe-list-btn");
    const safeListCount = document.getElementById("safe-list-count"); 
    const safeListEmptyMsg = document.getElementById("safe-list-empty"); 
    let safeItemsHistory = JSON.parse(localStorage.getItem("nutrimatch_safe_items")) || [];

    // Modal İşlemleri
    const btnHowItWorks = document.getElementById("how-it-works-btn");
    const modalHowItWorks = document.getElementById("how-it-works-modal");
    const btnCloseModal = document.getElementById("close-modal-btn");
    const modalBackdrop = document.getElementById("modal-backdrop");
    
    if(btnHowItWorks && modalHowItWorks) {
        btnHowItWorks.addEventListener("click", () => {
            modalHowItWorks.classList.remove("hidden");
            setTimeout(() => modalHowItWorks.classList.add("active"), 10);
        });

        const closeModal = () => {
            modalHowItWorks.classList.remove("active");
            setTimeout(() => modalHowItWorks.classList.add("hidden"), 300);
        };

        btnCloseModal.addEventListener("click", closeModal);
        modalBackdrop.addEventListener("click", closeModal);
    }

    // Alışveriş Listesi Görüntüleme
    function renderSafeList() {
        if (!safeListEl) return;
        safeListEl.innerHTML = "";
        
        if (safeItemsHistory.length > 0) {
            safeListCount.textContent = safeItemsHistory.length; 
            safeListEmptyMsg.classList.add("hidden"); 
            clearSafeListBtn.classList.remove("hidden"); 
            
            safeItemsHistory.forEach((item) => {
                const card = document.createElement("div");
                card.className = "safe-item-card";
                card.innerHTML = `<span>✅ ${item}</span>`;
                safeListEl.appendChild(card);
            });
        } else {
            safeListCount.textContent = "0"; 
            safeListEmptyMsg.classList.remove("hidden"); 
            clearSafeListBtn.classList.add("hidden"); 
        }
    }

    function addToSafeList(greenItemsArray) {
        if (!greenItemsArray || greenItemsArray.length === 0) return;
        
        greenItemsArray.forEach(item => {
            // Yiyecek string veya obje (yeni JSON yapısı) olabilir, esnek yakala
            const textValue = typeof item === 'string' ? item : (item.food || "");
            const cleanItem = textValue.trim();
            
            if (cleanItem.length === 0) return;
            
            const exists = safeItemsHistory.some(existing => existing.toLowerCase() === cleanItem.toLowerCase());
            
            if (!exists) {
                safeItemsHistory.unshift(cleanItem);
            }
        });
        
        localStorage.setItem("nutrimatch_safe_items", JSON.stringify(safeItemsHistory));
        renderSafeList();
    }

    if (clearSafeListBtn) {
        clearSafeListBtn.addEventListener("click", () => {
            if (confirm("Güvenli alışveriş listenizi tamamen temizlemek istediğinize emin misiniz?")) {
                safeItemsHistory = [];
                localStorage.setItem("nutrimatch_safe_items", JSON.stringify(safeItemsHistory));
                renderSafeList();
            }
        });
    }

    // Geçmiş Arama Yönetimi 
    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = "";
        
        if (searchHistory.length > 0) {
            historyContainer.classList.remove("hidden");
            historyCount.textContent = searchHistory.length; 
            searchHistory.forEach((item) => {
                const card = document.createElement("div");
                card.className = "history-card";
                card.title = `${item.text} (${item.diseases.join(", ")})`;
                
                let shortText = item.text.length > 18 ? item.text.substring(0, 18) + "..." : item.text;
                card.innerHTML = `<span>🕒 ${shortText}</span>`;
                
                card.addEventListener("click", () => {
                    inputIngredients.value = item.text;
                    chkDiyabet.checked = item.diseases.includes("Diyabet");
                    chkColyak.checked = item.diseases.includes("Çölyak (Glutensiz diyet)");
                    chkHipertansiyon.checked = item.diseases.includes("Hipertansiyon (Düşük sodyum/tuzlu)");
                    
                    showResultsUI(item.parsedData);
                });
                
                historyList.appendChild(card);
            });
        } else {
            historyContainer.classList.add("hidden");
            historyCount.textContent = "0"; 
        }
    }

    function saveToHistory(text, diseases, parsedData) {
        const existingIndex = searchHistory.findIndex(h => h.text.toLowerCase().trim() === text.toLowerCase().trim());
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1);
        }
        
        searchHistory.unshift({
            text: text,
            diseases: diseases,
            parsedData: parsedData,
            date: new Date().toISOString()
        });
        
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        
        localStorage.setItem("nutrimatch_history", JSON.stringify(searchHistory));
        renderHistory();
    }

    // Arayüz Sonuç Yansıtma Modülü
    function showResultsUI(parsedData) {
        // Obje veya eski versiyondan kalma stringleri güvenle basmak için map fonksiyonları:
        
        if (parsedData.green && parsedData.green.length > 0) {
            resultGreen.innerHTML = `<ul class="list-none space-y-2">` + 
                parsedData.green.map(item => {
                    if (typeof item === 'string') return `<li class="mb-1">✅ ${item}</li>`;
                    return `<li class="mb-1 bg-green-50/50 p-2 rounded-lg border border-green-100"><strong class="text-green-900 block md:inline">${item.food}:</strong> <span class="text-green-800">${item.advice}</span></li>`;
                }).join('') + `</ul>`;
        } else {
            resultGreen.innerHTML = `<p class="italic text-gray-500">Bu test için güvenli onaylanan yiyecek bulunamadı.</p>`;
        }

        if (parsedData.yellow && parsedData.yellow.length > 0) {
            resultYellow.innerHTML = `<ul class="list-none space-y-2">` + 
                parsedData.yellow.map(item => {
                    if (typeof item === 'string') return `<li class="mb-1">⚠️ ${item}</li>`;
                    return `<li class="mb-1 bg-yellow-50/50 p-2 rounded-lg border border-yellow-100"><strong class="text-yellow-900 block md:inline">${item.food}:</strong> <span class="text-yellow-800">${item.advice}</span></li>`;
                }).join('') + `</ul>`;
        } else {
            resultYellow.innerHTML = `<p class="italic text-gray-500">Bu test için dikkat sekmesinde yiyecek bulunamadı.</p>`;
        }

        if (parsedData.red && parsedData.red.length > 0) {
            resultRed.innerHTML = `<ul class="list-none space-y-2">` + 
                parsedData.red.map(item => {
                    if (typeof item === 'string') return `<li class="mb-1">🚫 ${item}</li>`;
                    return `<li class="mb-1 bg-red-50/50 p-2 rounded-lg border border-red-100"><strong class="text-red-900 block text-lg mb-1">${item.food}</strong><span class="text-red-800 block">${item.advice}</span></li>`;
                }).join('') + `</ul>`;
        } else {
            resultRed.innerHTML = `<p class="italic text-gray-500">Bu test için riskli kabul edilen yiyecek bulunmamaktadır.</p>`;
        }

        // Genel "Alternatif" blokunu artık kullanmıyoruz çünkü gıdaların içerisine (advice içine) gömülü geliyor.
        const altContainer = resultAlternative?.parentElement;
        if (altContainer) altContainer.classList.add("hidden");

        resultsSection.classList.remove("hidden");
        // Optimizasyonlu Scroll:
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    function getSelectedDiseases() {
        const diseases = [];
        if (chkDiyabet.checked) diseases.push("Diyabet");
        if (chkColyak.checked) diseases.push("Çölyak (Glutensiz diyet)");
        if (chkHipertansiyon.checked) diseases.push("Hipertansiyon (Düşük sodyum/tuzlu)");
        return diseases;
    }

    btnAnalyze.addEventListener("click", async () => {
        const oldWarning = document.getElementById("quota-warning");
        if (oldWarning) oldWarning.remove();

        const textContent = inputIngredients.value.trim();
        const selectedDiseases = getSelectedDiseases();

        if (textContent.length === 0) {
            alert("Lütfen analiz edilmesi için bir menü veya gıda içeriği girin.");
            return;
        }

        if (selectedDiseases.length === 0) {
            alert("Lütfen en az bir kronik rahatsızlık kısıtlaması seçin.");
            return;
        }

        resultsSection.classList.add("hidden");
        loadingIndicator.classList.remove("hidden");
        
        inputIngredients.disabled = true;
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = `⚡ Analiz Ediliyor...`;

        try {
            // features/analysis.js üzerinden yönlendirmeli analiz başlat
            let rawResponse = await analyzeWithGroq(textContent, selectedDiseases);
            rawResponse = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
            
            const parsedData = JSON.parse(rawResponse);
            
            showResultsUI(parsedData);
            saveToHistory(textContent, selectedDiseases, parsedData);

            if (parsedData.green && parsedData.green.length > 0) {
                addToSafeList(parsedData.green);
            }

        } catch (error) {
            console.error("DOM Olayı veya API Hatası:", error);
            
            if (error.message === "QUOTA_ERROR" || error.message.includes("429")) {
                const quotaWarning = document.createElement("div");
                quotaWarning.id = "quota-warning";
                quotaWarning.className = "bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded-xl shadow-md mb-5 flex items-center gap-3 animate-pulse";
                quotaWarning.innerHTML = `
                    <svg class="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <div>
                        <strong class="font-bold block text-sm">Kota Sınırı (429)</strong>
                        <span class="text-sm">Lütfen kısa bir süre bekleyip tekrar deneyiniz.</span>
                    </div>
                `;
                btnAnalyze.parentElement.parentElement.insertBefore(quotaWarning, btnAnalyze.parentElement);
            } else {
                alert(`Analiz veya ekrana yansıtma sırasında bir hata oluştu:\n${error.message}`);
            }

        } finally {
            loadingIndicator.classList.add("hidden");
            inputIngredients.disabled = false;
            
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = `
                <svg class="w-5 h-5 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Yapay Zeka ile Analiz Et
            `;
        }
    });

    renderHistory();
    renderSafeList();
});
