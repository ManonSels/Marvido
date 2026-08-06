import { Navbar } from "./components/navbar.js";
import { Footer } from "./components/footer.js";
import { Router, navigateTo } from "./router.js";
import { loadLanguage, getCurrentLang } from "./utils/i18n.js";

function renderNavbar() {
    document.querySelector("#navbar").innerHTML = Navbar();
}

function closeMobileMenu() {
    const navbar = document.querySelector(".navbar");
    const menuButton = document.querySelector(".menu-toggle");
    if (navbar) navbar.classList.remove("mobile-open");
    if (menuButton) menuButton.classList.remove("active");
}

async function init() {
    // Load saved/default language BEFORE first render so text is correct from the start
    await loadLanguage(getCurrentLang());

    renderNavbar();
    document.querySelector("#footer").innerHTML = Footer();

    Router();
}

init();

// Close the mobile menu the instant scrolling starts, so it can't be left
// open (with its gap/overlap issues) while browsing the page underneath.
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar && navbar.classList.contains("mobile-open")) {
        closeMobileMenu();
    }
}, { passive: true });


document.addEventListener("click", async e => {

    // SPA navigation
    const link = e.target.closest("[data-link]");

    if (link) {
        e.preventDefault();
        closeMobileMenu(); // slide the menu shut before/while navigating
        navigateTo(link.href);
    }


    // Mobile menu toggle
    const menuButton = e.target.closest(".menu-toggle");

    if (menuButton) {
        const navbar = document.querySelector(".navbar");
        navbar.classList.toggle("mobile-open");
        menuButton.classList.toggle("active");
    }


    // Language dropdown toggle
    const langToggle = e.target.closest(".language-toggle");

    if (langToggle) {
        const selector = langToggle.closest(".language-selector");
        selector.classList.toggle("open");
    } else if (!e.target.closest(".language-dropdown")) {
        document.querySelectorAll(".language-selector.open")
            .forEach(el => el.classList.remove("open"));
    }


    // Language option selected
    const langOption = e.target.closest("[data-lang]");

    if (langOption) {
        await loadLanguage(langOption.dataset.lang);
        renderNavbar();
        document.querySelector("#footer").innerHTML = Footer();
        Router(); // re-render current page in the new language
    }

});