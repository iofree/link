let translations = {};
let currentLang = localStorage.getItem('preferred-language') || 'zh';

// 加载语言文件
async function loadTranslations(lang) {
    try {
        const response = await fetch(`js/i18n/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        console.log(`Loaded translations for ${lang}:`, translations[lang]);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// 切换语言函数
async function toggleLanguage() {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    const langBtn = document.querySelector('.lang-switch');
    
    await changeLanguage(newLang);
    currentLang = newLang;
    localStorage.setItem('preferred-language', newLang);
    
    // 更新按钮文本
    if (langBtn) {
        langBtn.textContent = newLang === 'zh' ? '中/En' : 'En/中';
    }
}

// 更改语言
async function changeLanguage(lang) {
    try {
        if (!translations[lang]) {
            await loadTranslations(lang);
        }
        
        if (!translations[lang]) {
            console.error(`Translations for ${lang} not loaded`);
            return;
        }
        
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName.toLowerCase() === 'a') {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        currentLang = lang;
    } catch (error) {
        console.error('Error during language change:', error);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    const langBtn = document.querySelector('.lang-switch');
    await changeLanguage(currentLang);
    if (langBtn) {
        langBtn.textContent = currentLang === 'zh' ? '中/En' : 'En/中';
    }
});