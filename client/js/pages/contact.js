const contactMethods = [
    {
        label: "Email",
        value: "info@marvido.com",
        href: "mailto:info@marvido.com",
        note: "We usually reply within a day."
    },
    {
        label: "WhatsApp",
        value: "+34 600 123 456",
        href: "https://wa.me/34600123456",
        note: "Fastest way to reach us."
    },
    {
        label: "Phone",
        value: "+34 600 123 456",
        href: "tel:+34600123456",
        note: "Available 9am - 8pm CET."
    }
];

export function Contact() {
    return `
        <section class="contact container section">

            <div class="contact-intro">
                <span class="about-eyebrow">Contact</span>
                <h1>Let's get in touch</h1>
                <p>
                    Questions about the apartment, your stay, or availability?
                    Reach out however suits you best — we're happy to help.
                </p>
            </div>

            <div class="contact-grid">
                ${contactMethods.map((method, i) => `
                    <a href="${method.href}" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <span class="contact-card-number">0${i + 1}</span>
                        <span class="contact-card-label">${method.label}</span>
                        <span class="contact-card-value">${method.value}</span>
                        <span class="contact-card-note">${method.note}</span>
                        <span class="contact-card-arrow">→</span>
                    </a>
                `).join("")}
            </div>

        </section>
    `;
}