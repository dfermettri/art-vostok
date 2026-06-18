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

const clientsCarousel = document.querySelector(".clients__carousel");

if (clientsCarousel) {
    const clientsList = clientsCarousel.querySelector(".clients__list");
    const clientsItems = [...clientsList.children];
    let firstClone = null;
    let loopWidth = 0;
    let frameId = null;
    let isRunning = false;
    let lastFrameTime = 0;
    let scrollDirection = 1;

    clientsItems.forEach((item, index) => {
        const clone = item.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach((image) => {
            image.alt = "";
        });

        if (index === 0) {
            firstClone = clone;
        }

        clientsList.append(clone);
    });

    const updateLoopWidth = () => {
        if (!firstClone || !clientsList.firstElementChild) {
            loopWidth = 0;
            return;
        }

        loopWidth = firstClone.offsetLeft - clientsList.firstElementChild.offsetLeft;
    };

    const animateCarousel = (time) => {
        if (!isRunning) {
            return;
        }

        if (!loopWidth) {
            updateLoopWidth();
        }

        if (!lastFrameTime) {
            lastFrameTime = time;
        }

        const secondsPassed = (time - lastFrameTime) / 1000;

        clientsCarousel.scrollLeft += secondsPassed * 250 * scrollDirection;
        lastFrameTime = time;

        if (loopWidth && scrollDirection > 0 && clientsCarousel.scrollLeft >= loopWidth) {
            clientsCarousel.scrollLeft -= loopWidth;
        }

        if (loopWidth && scrollDirection < 0 && clientsCarousel.scrollLeft <= 0) {
            clientsCarousel.scrollLeft += loopWidth;
        }

        frameId = requestAnimationFrame(animateCarousel);
    };

    const updateDirection = (event) => {
        if (typeof event.clientX !== "number") {
            return;
        }

        scrollDirection = event.clientX >= window.innerWidth / 2 ? 1 : -1;
    };

    const startCarousel = (event) => {
        updateDirection(event);

        if (isRunning) {
            return;
        }

        isRunning = true;
        lastFrameTime = 0;
        clientsCarousel.classList.add("is-running");
        frameId = requestAnimationFrame(animateCarousel);
    };

    const stopCarousel = () => {
        isRunning = false;
        lastFrameTime = 0;
        clientsCarousel.classList.remove("is-running");

        if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    };

    updateLoopWidth();
    window.addEventListener("resize", updateLoopWidth);
    clientsCarousel.addEventListener("mouseenter", startCarousel);
    clientsCarousel.addEventListener("mousemove", updateDirection);
    clientsCarousel.addEventListener("mouseleave", stopCarousel);
    clientsCarousel.addEventListener("focusin", startCarousel);
    clientsCarousel.addEventListener("focusout", stopCarousel);
}

document.querySelector(".contact__form")?.addEventListener("submit", (event) => {
    event.preventDefault();
});
