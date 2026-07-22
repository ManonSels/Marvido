import { Navbar } from "./components/navbar.js";
import { Footer } from "./components/footer.js";
import { Router, navigateTo } from "./router.js";

let currentLang = "en";

function renderNavbar() {
    document.querySelector("#navbar").innerHTML = Navbar(currentLang);
}

renderNavbar();
document.querySelector("#footer").innerHTML = Footer();

Router();


document.addEventListener("click", e => {

    // SPA navigation
    const link = e.target.closest("[data-link]");

    if (link) {
        e.preventDefault();
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
        currentLang = langOption.dataset.lang;
        renderNavbar();
        // later: swap JSON translations here based on currentLang
    }

});