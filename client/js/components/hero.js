export function Hero() {
    return `
        <section class="hero">

            <video class="hero-video" autoplay muted loop playsinline>
                <source src="/assets/videos/BannerMarvido.mp4" type="video/mp4">
            </video>

            <div class="hero-overlay"></div>

            <div class="hero-content">

                <div class="hero-text">
                    <h1>Marvido</h1>
                    <p>Start your morning with sea blue</p>
                </div>

                <div class="hero-bar"></div>

                <div class="hero-buttons">
                    <a href="/availability" class="btn btn-primary" data-link>Check Availability</a>
                    <a href="/contact" class="btn btn-secondary" data-link>Contact Us</a>
                </div>

            </div>

            <div class="hero-scroll">↓ Scroll Down</div>

        </section>
    `;
}