"use strict";

void async function () {
	const body = document.body;
	{
		const dialogLoader = body.appendChild(document.createElement(`dialog`));
		dialogLoader.classList.add(`loader`, `layer`, `rounded`, `with-padding`, `large-padding`);
		dialogLoader.style.maxWidth = `60vmin`;
		dialogLoader.style.display = `grid`;
		dialogLoader.style.gridTemplateRows = `1fr auto auto`;
		dialogLoader.style.placeItems = `center`;
		{
			const imgLogo = dialogLoader.appendChild(document.createElement(`img`));
			imgLogo.src = `../resources/loading.gif`;
			imgLogo.alt = `Logo`;
			{ }
			const h2Heading = dialogLoader.appendChild(document.createElement(`h2`));
			let counter = 0;
			const count = 4;
			function animate() {
				h2Heading.textContent = `Loading${`.`.repeat(counter)}`;
				counter = (counter + 1) % count;
			}
			{
				animate();
				setInterval(animate, 1000 / count);
			}
			const h3Hint = dialogLoader.appendChild(document.createElement(`b`));
			h3Hint.innerText = `Please wait`;
			{ }
		}
	}

	Array.from(document.getElementsByTagName(`script`)).at(-1)?.remove();
}();
