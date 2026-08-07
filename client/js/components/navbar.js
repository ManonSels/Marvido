import { t, getCurrentLang } from "../utils/i18n.js";

export function Navbar() {
    const currentLang = getCurrentLang();

    const languages = { en: "EN", es: "ES", nl: "NL" };
    const otherLangs = Object.keys(languages).filter(l => l !== currentLang);

    return `
        <nav class="navbar">

            <div class="navbar-left">
                <a href="/" class="logo" data-link>
                    Marvido
                </a>

                <ul class="nav-links">
                    <li><a href="/" data-link>${t("nav.home")}</a></li>
                    <li><a href="/gallery" data-link>${t("nav.gallery")}</a></li>
                    <li><a href="/availability" data-link>${t("nav.availability")}</a></li>
                    <li><a href="/location" data-link>${t("nav.location")}</a></li>
                    <li><a href="/contact" data-link>${t("nav.contact")}</a></li>
                </ul>
            </div>

            <div class="language-selector">
                <button class="language-toggle" aria-label="Select language" aria-haspopup="true">${languages[currentLang]} ▼</button>
                <ul class="language-dropdown">
                    ${otherLangs.map(lang => `
                        <li><button data-lang="${lang}">${t(`langLabels.${lang}`)}</button></li>
                    `).join("")}
                </ul>
            </div>

            <button class="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </nav>
    `;
}