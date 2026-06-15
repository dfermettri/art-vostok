const hero = document.querySelector(".hero");

if (hero) {
    const slides = [...hero.querySelectorAll(".hero__slide")];
    const prevButton = hero.querySelector("[data-hero-prev]");
    const nextButton = hero.querySelector("[data-hero-next]");
    let activeSlideIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (activeSlideIndex < 0) {
        activeSlideIndex = 0;
    }

    const setActiveSlide = (slideIndex) => {
        activeSlideIndex = (slideIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
            const isActive = index === activeSlideIndex;

            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
    };

    prevButton?.addEventListener("click", () => {
        setActiveSlide(activeSlideIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        setActiveSlide(activeSlideIndex + 1);
    });

    setActiveSlide(activeSlideIndex);
}
