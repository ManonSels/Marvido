import { t } from "../utils/i18n.js";

export function Hero() {
    return `
        <section class="hero">

            <video class="hero-video" autoplay muted loop playsinline>
                <source src="/assets/videos/BannerMarvido.mp4" type="video/mp4">
            </video>

            <div class="hero-overlay"></div>

            <div class="hero-content">

                <div class="hero-text">
                    <h1>${t("hero.title")}</h1>
                    <p>${t("hero.subtitle")}</p>
                </div>

                <div class="hero-bar"></div>

                <div class="hero-buttons">
                    <a href="/availability" class="btn btn-primary" data-link>${t("hero.ctaAvailability")}</a>
                    <a href="/contact" class="btn btn-secondary" data-link>${t("hero.ctaContact")}</a>
                </div>

            </div>

            <div class="hero-scroll">${t("hero.scroll")}</div>

        </section>
    `;
}