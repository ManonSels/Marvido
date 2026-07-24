import { Hero } from "../components/hero.js";

export function Home() {
    return `
        ${Hero()}

        <section class="about container section">

            <div class="about-intro">
                <span class="about-eyebrow">The Apartment</span>
                <h2>A quiet retreat on the Costa Blanca</h2>
                <p>
                    Marvido is a sun-filled apartment designed for slow mornings
                    and long evenings. Every room opens toward the coast, with
                    calm, uncluttered interiors that let the view do the talking.
                </p>
            </div>

            <div class="about-grid">

                <div class="about-image about-image-large">
                    <img src="/assets/images/living-room.jpg" alt="Living room">
                </div>

                <div class="about-image about-image-small">
                    <img src="/assets/images/kitchen.jpg" alt="Kitchen">
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">01</span>
                    <h3>Space</h3>
                    <p>Two bedrooms, a full kitchen, and a private terrace facing the sea.</p>
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">02</span>
                    <h3>Location</h3>
                    <p>Five minutes from the beach, walking distance to the old town.</p>
                </div>

                <div class="about-image about-image-small">
                    <img src="/assets/images/balcony.jpg" alt="Balcony">
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">03</span>
                    <h3>Comfort</h3>
                    <p>Air conditioning, high-speed WiFi, and everything you need to feel at home.</p>
                </div>

            </div>

        </section>
    `;
}