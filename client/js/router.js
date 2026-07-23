import { Home } from "./pages/home.js";
import { Gallery } from "./pages/gallery.js";
import { Availability } from "./pages/availability.js";
import { Location } from "./pages/location.js";
import { Contact } from "./pages/contact.js";


const routes = {
    "/": Home,
    "/gallery": Gallery,
    "/availability": Availability,
    "/location": Location,
    "/contact": Contact
};


export function Router() {

    const path = window.location.pathname;

    const page = routes[path] || Home;

    document.querySelector("#app").innerHTML = page();

}


export function navigateTo(url) {
    history.pushState(null, null, url);
    Router();
}