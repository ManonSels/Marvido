export function Footer() {
    return `
        <footer class="footer">

            <div class="footer-bar">

                <div class="footer-brand">
                    <span class="footer-logo">M</span>
                    <span>All rights reserved.</span>
                </div>

                <ul class="footer-links">
                    <li><a href="/" data-link>Home</a></li>
                    <li><a href="/gallery" data-link>Gallery</a></li>
                    <li><a href="/availability" data-link>Availability</a></li>
                    <li><a href="/location" data-link>Location</a></li>
                    <li><a href="/contact" data-link>Contact</a></li>
                </ul>

                <div class="footer-socials">
                    <a href="mailto:info@marvido.com" aria-label="Email">✉</a>
                    <a href="#" aria-label="Booking">B</a>
                </div>

            </div>

            <div class="footer-hero">
                <span>Get in touch</span>
            </div>

        </footer>
    `;
}