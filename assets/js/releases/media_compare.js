(() => {
	function clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}

	const compareBlocks = document.querySelectorAll(".media-compare");

	for (const compareBlock of compareBlocks) {
		const slider = compareBlock.querySelector(".slider");
		const beforeBlock = compareBlock.querySelector(".before");

		const onPointerEvent = (pEventName, pEvent) => {
			const mousePressed = pEvent.buttons == 1;
			if (!mousePressed) {
				return;
			}

			pEvent.stopPropagation();
			pEvent.preventDefault();

			switch (pEventName) {
				case "pointermove":
					compareBlock.classList.add("pointer-moving");
					break;
				case "pointerup":
					compareBlock.classList.remove("pointer-moving");
					break;
			}

			let percent =
				clamp(pEvent.layerX / compareBlock.clientWidth, 0.0, 1.0) * 100.0;

			if (percent < 10) {
				percent = 0;
				compareBlock.classList.add("transition");
			} else if (percent > 90) {
				percent = 100;
				compareBlock.classList.add("transition");
			} else {
				compareBlock.classList.remove("transition");
			}

			slider.style.left = `${percent}%`;
			beforeBlock.style.clipPath = `inset(0 ${100.0 - percent}% 0 0)`;
		};

		for (const eventName of ["pointerdown", "pointerup", "pointermove"]) {
			compareBlock.addEventListener(
				eventName,
				onPointerEvent.bind(null, eventName),
			);
		}
	}
})();
