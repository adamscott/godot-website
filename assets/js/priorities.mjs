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

// ========================================
// Convert absolute dates to relative dates
// ========================================
function convertAbsoluteDatesToRelativeDates() {
	const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { style: 'long' });
	/** @type {Record<String, Date>} */
	const dates = {
		now: new Date()
	};
	dates["yesterday"] = new Date(dates.now).setDate(dates.now.getDate() - 1);
	dates["oneWeekAgo"] = new Date(dates.now).setDate(dates.now.getDate() - 7);
	dates["oneMonthAgo"] = new Date(dates.now).setMonth(dates.now.getMonth() - 1);
	dates["oneYearAgo"] = new Date(dates.now).setFullYear(dates.now.getFullYear() - 1);

	/** @type {Record<String, Number>} */
	const durations = {
		day: 1000 /* milliseconds in one second */ * 60 /* seconds in one minute */ * 60 /* minutes in one hour */ * 24 /* hours in one day */,
	};
	durations["week"] = durations["day"] * 7;
	durations["month"] = durations["day"] * 30;
	durations["year"] = durations["day"] * 365;

	/** @type {Record<String, Number>} */
	const timeDiffs = {
		oneDayAgo: dates["now"] - dates["yesterday"],
		oneWeekAgo: dates["now"] - dates["oneWeekAgo"],
		oneMonthAgo: dates["now"] - dates["oneMonthAgo"],
		oneYearAgo: dates["now"] - dates["oneYearAgo"],
	};

	const timeElements = Array.from(document.querySelectorAll("time"));
	for (const timeElement of timeElements) {
		if (timeElement.dateTime === "") {
			return;
		}

		const timeDate = new Date(timeElement.dateTime);
		const diff = dates["now"] - timeDate;

		if (diff > timeDiffs["oneYearAgo"]) {
			const years = diff / durations["year"];
			const value = -Math.max(Math.floor(years), 1);
			if (value === -1) {
				timeElement.textContent = "last year";
			} else {
				timeElement.textContent = relativeTimeFormat.format(value, "years");
			}
		} else if (diff > timeDiffs["oneMonthAgo"]) {
			const months = diff / durations["month"];
			const value = -Math.max(Math.floor(months), 1);
			if (value === -1) {
				timeElement.textContent = "last month";
			} else {
				timeElement.textContent = relativeTimeFormat.format(value, "months");
			}
		} else if (diff > timeDiffs["oneWeekAgo"]) {
			const weeks = diff / durations["week"];
			const value = -Math.max(Math.floor(weeks), 1);
			if (value === -1) {
				timeElement.textContent = "last week";
			} else {
				timeElement.textContent = relativeTimeFormat.format(value, "weeks");
			}
		} else if (diff > timeDiffs["oneDayAgo"]) {
			const days = diff / durations["day"];
			const value = -Math.max(Math.floor(days), 1);
			if (value === -1) {
				timeElement.textContent = "yesterday";
			} else {
				console.log(diff, durations["day"], days, value);
				timeElement.textContent = relativeTimeFormat.format(value, "days");
			}
		} else {
			timeElement.textContent = "today";
		}

		// Add non-breaking space in between the number and the rest.
		timeElement.textContent = timeElement.textContent.replace(/^(\d+?) (.+)$/, "$1 $2");

		timeElement.title = timeElement.dateTime;
	}
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
	convertAbsoluteDatesToRelativeDates();
}
main();
