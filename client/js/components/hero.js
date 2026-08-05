import { t } from "../utils/i18n.js";

let heroEl = null;

function createHeroVideoElement() {
    const video = document.createElement("video");
    video.className = "hero-video";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const webmSource = document.createElement("source");
    webmSource.src = "/assets/videos/BannerMarvido.webm";
    webmSource.type = "video/webm";

    video.appendChild(webmSource);

    video.addEventListener("error", () => {
        console.error("Hero video failed to load:", video.error);
    });

    return video;
}

function getHeroVideoElement() {
    if (!heroEl) heroEl = createHeroVideoElement();
    return heroEl;
}

export function mountHero() {
    const mount = document.getElementById("hero-video-mount");
    if (mount) mount.appendChild(getHeroVideoElement());
}

export function stashHero() {
    const holder = document.getElementById("hero-holder");
    if (holder && heroEl && heroEl.parentNode !== holder) {
        holder.appendChild(heroEl);
    }
}

export function Hero() {
    return `
        <section class="hero">

            <div id="hero-video-mount"></div>

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