const contactMethods = [
    {
        label: "Email",
        value: "bookmarvido@gmail.com",
        href: "mailto:bookmarvido@gmail.com",
        note: "We usually reply within 24 hours."
    },
    {
        label: "WhatsApp",
        value: "+34 695 098 636",
        href: "https://wa.me/695098636",
        note: "Fastest way to reach us."
    },
    {
        label: "Telegram",
        value: "+34 695 098 636",
        href: "tel:+34695098636",
        note: "Alternative way to reach us."
    }
];

export function Contact() {
    return `
        <section class="contact container section">

            <div class="contact-intro">
                <span class="about-eyebrow">Contact</span>
                <h1>Get in touch</h1>
                <p>
                    Questions about the apartment, your stay, or availability?
                    Reach out to us, we're happy to help.
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