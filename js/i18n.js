/*
 * 中英双语切换
 * - 首次访问:按浏览器语言自动判定(主语言是中文 → 中文，否则英文)
 * - 用户手动切换后:记忆选择(localStorage)，之后始终以该选择为准(优先于浏览器判定)
 * - 中文是 index.html 内联的默认文案，命中中文时无需请求、无闪烁;命中英文时按需 fetch en.json
 * - data-i18n            : 文本(默认 textContent；元素加 data-i18n-html 才按 innerHTML 注入)
 * - data-i18n + data-i18n-attr : 翻译某个属性(如 aria-label)
 * 注意:用 fetch 读取 JSON，需经 HTTP 访问(本地用 `python3 -m http.server`，不能 file://)
 */

const DEFAULT_LANG = 'zh';            // 与 index.html 内联文案一致
const SUPPORTED = ['zh', 'en'];
const STORAGE_KEY = 'preferred-language';
const dictCache = {};

let currentLang = DEFAULT_LANG;

// 按浏览器主语言猜测首选语言
function detectLanguage() {
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  return primary.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

// 决定首屏语言:已记住的手动选择优先，否则按浏览器语言
function resolveInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  return detectLanguage();
}

async function loadDict(lang) {
  if (dictCache[lang]) return dictCache[lang];
  const res = await fetch(`js/i18n/${lang}.json`);
  if (!res.ok) throw new Error(`load ${lang}.json failed: ${res.status}`);
  dictCache[lang] = await res.json();
  return dictCache[lang];
}

function applyDict(lang, dict) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n')];
    if (value == null) return;

    const attr = el.getAttribute('data-i18n-attr');
    if (attr) {
      el.setAttribute(attr, value);
    } else if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  if (dict.title) document.title = dict.title;

  const btn = document.querySelector('.lang');
  if (btn) btn.textContent = lang === 'zh' ? '中 / EN' : 'EN / 中';

  currentLang = lang;
}

// persist=true 时把选择写入存储(仅用于用户手动切换)
async function setLanguage(lang, persist) {
  try {
    const dict = await loadDict(lang);
    applyDict(lang, dict);
    if (persist) localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    console.error('i18n:', err);
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'zh' ? 'en' : 'zh', true); // 手动切换 → 记忆
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.lang');
  if (btn) btn.addEventListener('click', toggleLanguage);

  const initial = resolveInitialLanguage();
  if (initial === DEFAULT_LANG) {
    // 页面内联的就是默认语言(中文)，只校正按钮与 <html lang>，不发请求、不写存储
    currentLang = DEFAULT_LANG;
    document.documentElement.lang = 'zh-CN';
    if (btn) btn.textContent = '中 / EN';
  } else {
    // 首屏自动判定(或记住)的非默认语言:应用之，但自动判定不写入存储(persist=false)
    setLanguage(initial, false);
  }
});
