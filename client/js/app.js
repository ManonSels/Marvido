import { Navbar } from "./components/navbar.js";
import { Footer } from "./components/footer.js";
import { Router, navigateTo } from "./router.js";


document.querySelector("#navbar").innerHTML = Navbar();
document.querySelector("#footer").innerHTML = Footer();

Router();


document.addEventListener("click", e => {

    const link = e.target.closest("[data-link]");

    if (!link) return;

    e.preventDefault();

    navigateTo(link.href);

});