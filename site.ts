const navToggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
const navbar = document.querySelector<HTMLElement>(".navbar");

navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("is-open");
    navbar?.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll<HTMLAnchorElement>(".navbar a").forEach((link) => {
    if (new URL(link.href).pathname === window.location.pathname) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", () => {
        navToggle?.classList.remove("is-open");
        navbar?.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
        navToggle?.setAttribute("aria-label", "Open navigation");
    });
});

const lightbox = document.createElement("div");
lightbox.className = "gallery-lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Gallery preview");
lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close gallery preview">&times;</button>
    <div class="lightbox-content"></div>
`;
document.body.appendChild(lightbox);

const closeLightbox = () => {
    const content = lightbox.querySelector<HTMLElement>(".lightbox-content");
    content?.replaceChildren();
    lightbox.hidden = true;
    lastFocusedCard?.focus();
    lastFocusedCard = null;
};

lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
    }
});

const previewCards = document.querySelectorAll<HTMLElement>(
    ".gallery-card, .latest-posts .card, .looks .card, .beauty-picks .card"
);
let lastFocusedCard: HTMLElement | null = null;

previewCards.forEach((card) => {
    const media = card.querySelector<HTMLImageElement | HTMLVideoElement>("img, video");
    if (!media) {
        return;
    }

    const heading = card.querySelector<HTMLElement>("h3")?.textContent?.trim();
    const mediaLabel = media instanceof HTMLImageElement ? media.alt : "";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open ${heading || mediaLabel || "gallery item"} preview`);

    const openCard = () => {
        lastFocusedCard = card;
        const preview = media.cloneNode(true) as HTMLImageElement | HTMLVideoElement;
        if (preview instanceof HTMLVideoElement) {
            preview.controls = true;
            preview.autoplay = true;
        }

        lightbox.querySelector(".lightbox-content")?.replaceChildren(preview);
        lightbox.hidden = false;
        lightbox.querySelector<HTMLButtonElement>(".lightbox-close")?.focus();
    };

    card.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a, button")) {
            return;
        }
        openCard();
    });
    card.addEventListener("keydown", (event) => {
        if (event.target === card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openCard();
        }
    });
});

const contactForm = document.querySelector<HTMLFormElement>("#contact-form");
const formStatus = document.querySelector<HTMLElement>("#form-status");

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) {
        formStatus.textContent =
            "Your message is ready, but this demo form does not send messages yet. Connect a form service to enable delivery.";
    }
});
