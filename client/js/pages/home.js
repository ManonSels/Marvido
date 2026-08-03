import { Hero } from "../components/hero.js";
import { t } from "../utils/i18n.js";

export function Home() {
    return `
        ${Hero()}

        <section class="about container section">

            <div class="about-intro">
                <span class="about-eyebrow">${t("home.aboutEyebrow")}</span>
                <h2>${t("home.aboutTitle")}</h2>
                <p>${t("home.aboutIntro")}</p>
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
                    <h3>${t("home.feature1Title")}</h3>
                    <p>${t("home.feature1Text")}</p>
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">02</span>
                    <h3>${t("home.feature2Title")}</h3>
                    <p>${t("home.feature2Text")}</p>
                </div>

                <div class="about-image about-image-small">
                    <img src="/assets/images/10.png" alt="Balcony">
                </div>

                <div class="about-feature">
                    <span class="about-feature-number">03</span>
                    <h3>${t("home.feature3Title")}</h3>
                    <p>${t("home.feature3Text")}</p>
                </div>

            </div>

        </section>
    `;
}