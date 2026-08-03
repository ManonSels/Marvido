import { Hero } from "../components/hero.js";

export function Home() {
    return `
        ${Hero()}

        <section class="about container section">

            <div class="about-intro">
                <span class="about-eyebrow">The Apartment</span>
                <h2>Feel at home in Javea</h2>
                <p>Marvido is a sun-filled apartment designed for slow mornings and long evenings. 
                Both the living room and bedroom open towards the coast, while the calm, 
                uncluttered interiors let the view do the talking.</p>
            </div>

            <div class="about-grid">

                <div class="about-image about-image-large">
                    <img src="/assets/images/6.png" alt="Living room">
                </div>

                <div class="about-image about-image-small">
                    <img src="/assets/images/5.png" alt="Kitchen">
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">01</span>
                    <h3>Space</h3>
                    <p>One bedroom, a fully equipped open-plan kitchen, and a sea-facing terrace.</p>
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">02</span>
                    <h3>Location</h3>
                    <p>Situated by the sea, in the centre of the harbour, with the Old Town just a few minutes away.</p>
                </div>

                <div class="about-image about-image-small">
                    <img src="/assets/images/10.png" alt="Balcony">
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">03</span>
                    <h3>Comfort</h3>
                    <p>Air conditioning, fibre WiFi, beach chairs and parasols, a comfortable shower room, Smart TV, dishwasher, and all the essentials.</p>
                </div>

            </div>

        </section>
    `;
}