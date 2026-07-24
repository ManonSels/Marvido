const images = [
    { src: "/assets/images/gallery/1.jpg", caption: "Living room" },
    { src: "/assets/images/gallery/2.jpg", caption: "Terrace view" },
    { src: "/assets/images/gallery/3.jpg", caption: "Kitchen" },
    { src: "/assets/images/gallery/4.jpg", caption: "Master bedroom" },
    { src: "/assets/images/gallery/5.jpg", caption: "Bathroom" },
    { src: "/assets/images/gallery/6.jpg", caption: "Sea view" },
    { src: "/assets/images/gallery/7.jpg", caption: "Dining area" },
    { src: "/assets/images/gallery/8.jpg", caption: "Second bedroom" },
    { src: "/assets/images/gallery/9.jpg", caption: "Balcony" },
    { src: "/assets/images/gallery/10.jpg", caption: "Pool area" }
];

export function Gallery() {
    return `
        <section class="gallery container section">

            <div class="gallery-intro">
                <span class="about-eyebrow">The Gallery</span>
                <h1>A closer look</h1>
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