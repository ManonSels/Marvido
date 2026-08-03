let currentLang = localStorage.getItem("lang") || "en";
let translations = {};

export async function loadLanguage(lang) {
    try {
        const res = await fetch(`/lang/${lang}.json`);
        if (!res.ok) throw new Error(`Failed to fetch /lang/${lang}.json — status ${res.status}`);
        translations = await res.json();
        currentLang = lang;
        localStorage.setItem("lang", lang);
    } catch (err) {
        console.error("loadLanguage error:", err);
    }
}

export function t(key) {
    return key.split(".").reduce((obj, k) => obj?.[k], translations) ?? key;
}

export function getCurrentLang() {
    return currentLang;
}