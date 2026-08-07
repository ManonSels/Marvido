import { t } from "../utils/i18n.js";

const contactMethods = [
    {
        key: "email",
        value: "bookmarvido@gmail.com",
        href: "mailto:bookmarvido@gmail.com"
    },
    {
        key: "whatsapp",
        value: "+34 695 098 636",
        href: "https://wa.me/695098636"
    },
    {
        key: "telegram",
        value: "+34 695 098 636",
        href: "tel:+34695098636"
    }
];

export function Contact() {
    document.title = "Marvido Apartment - Contact";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute(
            "content",
            "Get in touch with Marvido Apartment in Jávea, Costa Blanca, Spain."
        );
    }

    return `
        <section class="contact container section">

            <div class="contact-intro">
                <span class="about-eyebrow">${t("contact.eyebrow")}</span>
                <h1>${t("contact.title")}</h1>
                <p>${t("contact.intro")}</p>
            </div>

            <div class="contact-grid">
                ${contactMethods.map((method, i) => `
                    <a href="${method.href}" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <span class="contact-card-number">0${i + 1}</span>
                        <span class="contact-card-label">${t(`contact.methods.${method.key}.label`)}</span>
                        <span class="contact-card-value">${method.value}</span>
                        <span class="contact-card-note">${t(`contact.methods.${method.key}.note`)}</span>
                        <span class="contact-card-arrow">→</span>
                    </a>
                `).join("")}
            </div>

        </section>
    `;
}