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
    const clientsCarouselSpeed = 80;
    let firstClone = null;
    let loopWidth = 0;
    let frameId = null;
    let isRunning = false;
    let lastFrameTime = 0;
    let scrollDirection = 1;
    let scrollPosition = clientsCarousel.scrollLeft;

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
        scrollPosition = clientsCarousel.scrollLeft;
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

        scrollPosition += secondsPassed * clientsCarouselSpeed * scrollDirection;
        lastFrameTime = time;

        if (loopWidth && scrollDirection > 0 && scrollPosition >= loopWidth) {
            scrollPosition -= loopWidth;
        }

        if (loopWidth && scrollDirection < 0 && scrollPosition <= 0) {
            scrollPosition += loopWidth;
        }

        clientsCarousel.scrollLeft = scrollPosition;
        frameId = requestAnimationFrame(animateCarousel);
    };

    const updateDirection = (event) => {
        if (!event || typeof event.clientX !== "number") {
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
        scrollPosition = clientsCarousel.scrollLeft;
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
    clientsCarousel.addEventListener("mouseenter", updateDirection);
    clientsCarousel.addEventListener("mousemove", updateDirection);

    if ("IntersectionObserver" in window) {
        const clientsObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startCarousel();
                } else {
                    stopCarousel();
                }
            },
            { threshold: 0.25 },
        );

        clientsObserver.observe(clientsCarousel);
    } else {
        startCarousel();
    }
}

const contactForm = document.querySelector(".contact__form");

if (contactForm) {
    const contactFields = contactForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
    const toggleFieldLabel = (field) => {
        field.closest("label")?.classList.toggle("is-filled", Boolean(field.value.trim()));
    };

    contactFields.forEach((field) => {
        toggleFieldLabel(field);
        field.addEventListener("input", () => toggleFieldLabel(field));
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

const langSwitcher = document.querySelector("[data-lang-switcher]");

if (langSwitcher) {
    const trigger = langSwitcher.querySelector(".lang-switcher__btn");
    const currentLabel = langSwitcher.querySelector("[data-lang-current]");
    const options = [...langSwitcher.querySelectorAll(".lang-switcher__option")];

    const open = () => {
        langSwitcher.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
    };

    const close = () => {
        langSwitcher.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
    };

    const toggle = () => {
        if (langSwitcher.classList.contains("is-open")) {
            close();
        } else {
            open();
        }
    };

    langSwitcher.addEventListener("click", (event) => {
        if (event.target.closest(".lang-switcher__option")) {
            return;
        }

        toggle();
    });

    options.forEach((option) => {
        option.addEventListener("click", (event) => {
            event.stopPropagation();

            const selectedLang = option.dataset.lang;

            options.forEach((item) => {
                const isCurrent = item.dataset.lang === selectedLang;

                item.classList.toggle("is-current", isCurrent);
                item.setAttribute("aria-selected", String(isCurrent));
            });

            if (currentLabel) {
                currentLabel.textContent = selectedLang;
            }

            close();
        });
    });

    document.addEventListener("click", (event) => {
        if (langSwitcher.classList.contains("is-open") && !langSwitcher.contains(event.target)) {
            close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && langSwitcher.classList.contains("is-open")) {
            close();
            trigger.focus();
        }
    });
}
