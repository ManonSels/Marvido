import { t } from "../utils/i18n.js";

let heroEl = null;
let isCurrentlyCompact = null; // tracks which version is currently loaded

const COMPACT_BREAKPOINT = 1024;

function getVideoPath(isCompact) {
    return isCompact
        ? "/assets/videos/BannerMarvido-mobile.webm"
        : "/assets/videos/BannerMarvido.webm";
}

function createHeroVideoElement() {
    const video = document.createElement("video");
    video.className = "hero-video";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    isCurrentlyCompact = window.innerWidth <= COMPACT_BREAKPOINT;

    const webmSource = document.createElement("source");
    webmSource.src = getVideoPath(isCurrentlyCompact);
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

// Re-checks whether we should be showing the square/mobile version or the
// widescreen/desktop version, and swaps the source if the answer changed —
// e.g. rotating a tablet, or resizing across the breakpoint without a
// full page reload.
function refreshHeroSource() {
    if (!heroEl) return;

    const shouldBeCompact = window.innerWidth <= COMPACT_BREAKPOINT;
    if (shouldBeCompact === isCurrentlyCompact) return; // no change needed

    isCurrentlyCompact = shouldBeCompact;

    const source = heroEl.querySelector("source");
    source.src = getVideoPath(isCurrentlyCompact);

    heroEl.load();
    heroEl.play().catch(() => {}); // autoplay can be blocked in some cases; ignore silently
}

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshHeroSource, 250); // debounced, so it doesn't fire constantly while dragging
});

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