// ==================== 
// Peach Translator - content.js
// ====================

// 1️⃣ Crear tooltip con estilos modernos
const tooltip = document.createElement('div');
tooltip.id = 'peach-tooltip';
Object.assign(tooltip.style, {
    position: 'fixed',
    zIndex: '2147483647',
    pointerEvents: 'none',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#ffffff',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 16px',
    maxWidth: '300px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4), 0 2px 10px rgba(0, 0, 0, 0.1)',
    opacity: '0',
    transform: 'translateY(5px) scale(0.98)',
    transition: 'opacity 0.2s ease, transform 0.2s ease'
});
document.body.appendChild(tooltip);

// 2️⃣ Variables
const cache = new Map();
let debounceTimer = null;
let lastWord = '';
let targetLang = 'es'; // Idioma por defecto

// 3️⃣ Cargar idioma guardado
chrome.storage?.sync?.get(['targetLang'], (result) => {
    if (result.targetLang) targetLang = result.targetLang;
});

// 4️⃣ Escuchar cambios de idioma desde el popup
chrome.storage?.onChanged?.addListener((changes) => {
    if (changes.targetLang) {
        targetLang = changes.targetLang.newValue;
        cache.clear();
    }
});

// 5️⃣ Detectar palabra bajo el cursor
function getWordUnderCursor(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return null;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
        return null;
    }

    let range;
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos?.offsetNode) {
            range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
        }
    }

    if (!range?.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
        return null;
    }

    const text = range.startContainer.textContent;
    const offset = range.startOffset;
    if (!text || offset < 0 || offset > text.length) return null;

    let start = offset, end = offset;
    while (start > 0 && /\w/.test(text[start - 1])) start--;
    while (end < text.length && /\w/.test(text[end])) end++;

    const word = text.slice(start, end).trim();
    if (word.length < 2 || !/^[a-zA-Z]+$/.test(word)) return null;

    return word.toLowerCase();
}

// 6️⃣ Traducir palabra
async function translate(word) {
    if (!word) return '';

    const cacheKey = `${word}_${targetLang}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLang}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.responseStatus !== 200) throw new Error('API Error');

        const translated = data.responseData?.translatedText || '';

        if (translated && translated.toLowerCase() !== word.toLowerCase()) {
            cache.set(cacheKey, translated);
            return translated;
        }
        return '';
    } catch (e) {
        console.error('[Peach] Error:', e);
        return '';
    }
}

// 7️⃣ Mostrar tooltip
function showTooltip(original, translated, x, y, loading = false) {
    if (loading) {
        tooltip.innerHTML = `<span style="opacity:0.8">Traduciendo...</span>`;
        tooltip.style.background = 'linear-gradient(135deg, rgba(80, 80, 80, 0.95) 0%, rgba(60, 60, 60, 0.95) 100%)';
    } else {
        tooltip.innerHTML = `
      <span style="color:rgba(255,255,255,0.6);font-size:12px">${original}</span>
      <span style="color:rgba(255,255,255,0.4);margin:0 6px">→</span>
      <span style="font-weight:600;font-size:15px">${translated}</span>
    `;
        tooltip.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
    }

    let posX = x + 15, posY = y + 15;
    if (posX + 200 > window.innerWidth) posX = x - 200;
    if (posY + 60 > window.innerHeight) posY = y - 60;

    tooltip.style.left = `${posX}px`;
    tooltip.style.top = `${posY}px`;
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0) scale(1)';
}

function hideTooltip() {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(5px) scale(0.98)';
}

// 8️⃣ Event listeners
document.addEventListener('mousemove', (e) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        const word = getWordUnderCursor(e);

        if (!word) {
            hideTooltip();
            lastWord = '';
            return;
        }

        if (word === lastWord) return;
        lastWord = word;

        showTooltip(word, '', e.clientX, e.clientY, true);

        const translated = await translate(word);

        if (translated) {
            showTooltip(word, translated, e.clientX, e.clientY);
        } else {
            hideTooltip();
        }
    }, 200);
});

document.addEventListener('mouseleave', hideTooltip);

console.log('[Peach] 🍑 Translator activo');