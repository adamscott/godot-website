import { gsap } from "./modules/gsap@3.12.5.min.mjs";

// If we need to add a search bar, use this next line:
// import Fuse from "./modules/fuse.js@7.0.0.min.mjs";

// =====================
// Blank target to links
// =====================

/**
 * Adds `target="_blank"` to element links. This will open links in a new window.
 * @returns {void}
 */
function addBlankTargetToElementLinks() {
	for (const anchor of document.querySelectorAll(".element-content a")) {
		if (!(anchor instanceof HTMLAnchorElement)) {
			continue;
		}
		anchor.target = "_blank";
	}
}

// =============
// Scroll to top
// =============

/**
 * Setups scroll to top functionality.
 * @returns {void}
 */
function setupScrollToTop() {
	const navElement = document.querySelector("#priorities-navigation");
	const scrollToTopElement = document.querySelector("#scroll-to-top");
	let scrollToTopTween = null;
	let scrollState = "";
	const showScrollToTop = () => {
		if (scrollState === "show") {
			return;
		}
		scrollState = "show";
		if (scrollToTopTween != null) {
			scrollToTopTween.kill();
		}
		scrollToTopElement.style.display = "block";
		scrollToTopTween = gsap.to(scrollToTopElement, {
			opacity: 1,
			duration: 0.5,
		});
	};
	const hideScrollToTop = () => {
		if (scrollState === "hide") {
			return;
		}
		scrollState = "hide";
		if (scrollToTopTween != null) {
			scrollToTopTween.kill();
		}
		scrollToTopTween = gsap.to(scrollToTopElement, {
			opacity: 0,
			duration: 0.5,
			onComplete: () => {
				scrollToTopElement.style.display = "none";
			}
		});
	};
	const scrollToTopObserver = new IntersectionObserver((entries, observer) => {
		const entry = entries[0];
		if (entry.isIntersecting) {
			hideScrollToTop();
		} else {
			const rect = navElement.getBoundingClientRect();
			if (rect.y > window.innerHeight) {
				hideScrollToTop();
			} else {
				showScrollToTop();
			}
		}
	});
	scrollToTopObserver.observe(navElement);
}

// ============================
// Open details selected in URL
// ============================
/**
 * If there's a hash to the URL, make sure that the appropritate details tag is open.
 * @returns {void}
 */
function openDetailsSelectedInUrl() {
	if (window.location.hash === "") {
		return;
	}

	/** @type {HTMLDetailsElement | null} */
	const element = document.querySelector(`${window.location.hash} details.element-main`);
	if (element == null) {
		return;
	}
	element.open = true;
}

// ========================
// Handle navigation events
// ========================
/**
 * Opens the current hash when the navigation changes.
 * The API is still quite new, not supported by some browsers. (2024-11-21)
 * @returns {void}
 */
function handleNavigateEvent() {
	// The API is not yet supported by all browsers.
	if (!("Navigation" in window)) {
		//openOnHandleClick();
		handleHashChangeEvent();
		return;
	}

	/**
	 * @param {NavigateEvent} event
	 */
	navigation.addEventListener("navigate", (event) => {
		const url = new URL(event.destination.url);
		/** @type {HTMLDetailsElement | null} */
		const element = document.querySelector(`${url.hash} details.element-main`);
		if (element == null) {
			return;
		}
		element.open = true;
	});
}

/**
 * More common API, listens to "hashchange" event.
 * @returns {void}
 */
function handleHashChangeEvent() {
	window.addEventListener("hashchange", () => {
		/** @type {HTMLDetailsElement | null} */
		const element = document.querySelector(`${window.location.hash} details.element-main`);
		if (element == null) {
			return;
		}
		element.open = true;
	});
}

// ====
// Main
// ====

/**
 * Main function.
 */
function main() {
	addBlankTargetToElementLinks();
	setupScrollToTop();
	openDetailsSelectedInUrl();
	handleNavigateEvent();
}
main();
