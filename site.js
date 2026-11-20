var navToggle = document.querySelector(".nav-toggle");
var navbar = document.querySelector(".navbar");

if (navToggle) {
    navToggle.addEventListener("click", function () {
        var isOpen = navToggle.classList.toggle("is-open");
        if (navbar) {
            navbar.classList.toggle("is-open", isOpen);
        }
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
}

document.querySelectorAll(".navbar a").forEach(function (link) {
    if (new URL(link.href).pathname === window.location.pathname) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", function () {
        if (navToggle) {
            navToggle.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open navigation");
        }
        if (navbar) {
            navbar.classList.remove("is-open");
        }
    });
});

var lightbox = document.createElement("div");
lightbox.className = "gallery-lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Gallery preview");
lightbox.innerHTML = '\n    <button class="lightbox-close" type="button" aria-label="Close gallery preview">&times;</button>\n    <div class="lightbox-content"></div>\n';
document.body.appendChild(lightbox);

var closeLightbox = function () {
    var content = lightbox.querySelector(".lightbox-content");
    if (content) {
        content.replaceChildren();
    }
    lightbox.hidden = true;
    if (lastFocusedCard) {
        lastFocusedCard.focus();
        lastFocusedCard = null;
    }
};

var lightboxCloseButton = lightbox.querySelector(".lightbox-close");
if (lightboxCloseButton) {
    lightboxCloseButton.addEventListener("click", closeLightbox);
}

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
    }
});

var lastFocusedCard = null;
document.querySelectorAll(".gallery-card, .latest-posts .card, .looks .card, .beauty-picks .card").forEach(function (card) {
    var media = card.querySelector("img, video");
    if (!media) {
        return;
    }

    var heading = card.querySelector("h3");
    var mediaLabel = media instanceof HTMLImageElement ? media.alt : "";
    var label = heading ? heading.textContent.trim() : (mediaLabel || "gallery item");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Open " + label + " preview");

    var openCard = function () {
        lastFocusedCard = card;
        var preview = media.cloneNode(true);
        if (preview instanceof HTMLVideoElement) {
            preview.controls = true;
            preview.autoplay = true;
        }

        var content = lightbox.querySelector(".lightbox-content");
        if (content) {
            content.replaceChildren(preview);
        }
        lightbox.hidden = false;
        var closeButton = lightbox.querySelector(".lightbox-close");
        if (closeButton) {
            closeButton.focus();
        }
    };

    card.addEventListener("click", function (event) {
        if (event.target instanceof Element && event.target.closest("a, button")) {
            return;
        }
        openCard();
    });
    card.addEventListener("keydown", function (event) {
        if (event.target === card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openCard();
        }
    });
});

var contactForm = document.querySelector("#contact-form");
var formStatus = document.querySelector("#form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (formStatus) {
            formStatus.textContent =
                "Your message is ready, but this demo form does not send messages yet. Connect a form service to enable delivery.";
        }
    });
}
