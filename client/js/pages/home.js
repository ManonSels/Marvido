import { Hero } from "../components/hero.js";

export function Home() {
    return `
        ${Hero()}
        <section class="container section">
           Welcome to marvido. 
        </section>
    `;
}