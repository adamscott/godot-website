/**
 * Adds `target="_blank"` to element links. This will open links in a new window.
 */
function addBlankTargetToElementLinks() {
	for (const anchor of document.querySelectorAll(".element-content a")) {
		if (!(anchor instanceof HTMLAnchorElement)) {
			continue;
		}
		anchor.target = "_blank";
	}
}

/**
 * Main function.
 */
function main() {
	addBlankTargetToElementLinks();
}
main();
