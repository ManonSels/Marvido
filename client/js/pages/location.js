import { t } from "../utils/i18n.js";

export function Location() {
    return `
        <section class="location container section">

            <div class="location-grid">

                <div class="location-text">
                    <span class="about-eyebrow">${t("location.eyebrow")}</span>
                    <h1>${t("location.title")}</h1>
                    <p>${t("location.intro")}</p>

                    <ul class="location-details">
                        <li>
                            <strong>${t("location.addressLabel")}</strong>
                            <span>${t("location.addressValue")}</span>
                        </li>
                        <li>
                            <strong>${t("location.beachLabel")}</strong>
                            <span>${t("location.beachValue")}</span>
                        </li>
                        <li>
                            <strong>${t("location.airportLabel")}</strong>
                            <span>${t("location.airportValue")}</span>
                        </li>
                    </ul>

                    <a
                        href="https://maps.app.goo.gl/crS2QcAMJs5NQnKH9"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="location-directions"
                    >
                        ${t("location.directions")}
                    </a>
                </div>

                <div class="location-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d777.4026941701164!2d0.18106536970994222!3d38.79555629823411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129e0fb6a2aa10fd%3A0xc0dc7a47a60f3504!2zQy4gUMOtbyBYLCAxLCAwMzczMCBKw6F2ZWEsIEFsaWNhbnRl!5e0!3m2!1sen!2ses!4v1784900127291!5m2!1sen!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                </div>

            </div>

        </section>
    `;
}