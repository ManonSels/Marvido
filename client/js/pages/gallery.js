import { t } from "../utils/i18n.js";

const images = [
    { src: "/assets/images/1.webp", caption: "Food&Drinks" },
    { src: "/assets/images/23.webp", caption: "Bedroom" },
    { src: "/assets/images/2.webp", caption: "LivingRoom" },
    { src: "/assets/images/3.webp", caption: "LivingRoom" },
    { src: "/assets/images/4.webp", caption: "Kitchen" },
    { src: "/assets/images/5.webp", caption: "Kitchen" },
    { src: "/assets/images/6.webp", caption: "LivingRoom" },
    { src: "/assets/images/7.webp", caption: "LivingRoom" },
    { src: "/assets/images/8.webp", caption: "LivingRoom" },
    { src: "/assets/images/9.webp", caption: "LivingRoom" },
    { src: "/assets/images/10.webp", caption: "Balcony" },
    { src: "/assets/images/11.webp", caption: "Balcony" },
    { src: "/assets/images/12.webp", caption: "Balcony" },
    { src: "/assets/images/13.webp", caption: "Balcony" },
    { src: "/assets/images/14.webp", caption: "Kitchen" },
    { src: "/assets/images/19.webp", caption: "Bathroom" },
    { src: "/assets/images/15.webp", caption: "Bathroom" },
    { src: "/assets/images/16.webp", caption: "LivingRoom" },
    { src: "/assets/images/17.webp", caption: "LivingRoom" },
    { src: "/assets/images/18.webp", caption: "LivingRoom" },
    { src: "/assets/images/20.webp", caption: "LivingRoom" },
    { src: "/assets/images/21.webp", caption: "LivingRoom" },
    { src: "/assets/images/22.webp", caption: "Bedroom" },
];

export function Gallery() {
    return `
        <section class="gallery container section">

            <div class="gallery-intro">
                <span class="about-eyebrow">${t("gallery.eyebrow")}</span>
                <h1>${t("gallery.title")}</h1>
            </div>

            <div class="gallery-grid">
                ${images.map((img, i) => `
                    <div class="gallery-item" data-index="${i}">
                        <img src="${img.src}" alt="${img.caption}" loading="lazy">
                    </div>
                `).join("")}
            </div>

        </section>

        <div class="lightbox" id="lightbox">
            <button class="lightbox-close" id="lightbox-close">&times;</button>
            <button class="lightbox-prev" id="lightbox-prev">&#8592;</button>

            <div class="lightbox-content">
                <img src="" alt="" id="lightbox-image">
                <span class="lightbox-counter" id="lightbox-counter"></span>
            </div>

            <button class="lightbox-next" id="lightbox-next">&#8594;</button>
        </div>
    `;
}

export function initGallery() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCounter = document.getElementById("lightbox-counter");

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
    }

    function updateLightbox() {
        const img = images[currentIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.caption;
        lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    grid.querySelectorAll(".gallery-item").forEach(item => {
        item.addEventListener("click", () => {
            openLightbox(parseInt(item.dataset.index));
        });
    });

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-next").addEventListener("click", showNext);
    document.getElementById("lightbox-prev").addEventListener("click", showPrev);

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("open")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    });
}