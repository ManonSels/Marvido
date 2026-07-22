export function Navbar(currentLang = "en") {
    const languages = {
        en: "🌐 EN",
        es: "🌐 ES",
        nl: "🌐 NL"
    };

    const labels = {
        en: "English (EN)",
        es: "Español (ES)",
        nl: "Nederlands (NL)"
    };

    const otherLangs = Object.keys(languages).filter(l => l !== currentLang);

    return `
        <nav class="navbar">

            <div class="navbar-left">
                <a href="/" class="logo" data-link>
                    Marvido
                </a>

                <ul class="nav-links">
                    <li><a href="/" data-link>Home</a></li>
                    <li><a href="/gallery" data-link>Gallery</a></li>
                    <li><a href="/availability" data-link>Availability</a></li>
                    <li><a href="/location" data-link>Location</a></li>
                    <li><a href="/contact" data-link>Contact</a></li>
                </ul>
            </div>

            <div class="language-selector">
                <button class="language-toggle">${languages[currentLang]} ▼</button>
                <ul class="language-dropdown">
                    ${otherLangs.map(lang => `
                        <li><button data-lang="${lang}">${labels[lang]}</button></li>
                    `).join("")}
                </ul>
            </div>

            <button class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </nav>
    `;
}