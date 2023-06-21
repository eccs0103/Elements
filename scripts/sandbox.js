// @ts-ignore
/** @typedef {import("./structure.js")} */
// @ts-ignore
/** @typedef {import("./modules/engine.js")} */
// @ts-ignore
/** @typedef {import("./modules/animator.js")} */

"use strict";

try {
	//#region Initialize
	/**
	 * Board in scene.
	 * @readonly
	 */
	var board = new Board(new Coordinate(settings.size, settings.size));
	Object.defineProperty(window, `board`, {
		value: board,
		writable: false,
	});
	const canvas = (/** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`)));
	const tableElementsCounter = (/** @type {HTMLTableElement} */ (document.querySelector(`table#elements-counter`)));
	const tbodyInformation = tableElementsCounter.tBodies[0];
	const animator = new Animator(canvas);
	animator.FPSLimit = settings.FPSLimit;
	window.addEventListener(`beforeunload`, (event) => {
		if (animator.wasLaunched) {
			event.returnValue = `Board will be reseted.`;
		}
	});
	const divCounterFPS = (/** @type {HTMLDivElement} */ (document.querySelector(`div#counter-fps`)));
	divCounterFPS.hidden = !settings.FPS;
	tableElementsCounter.hidden = !settings.counter;
	//#endregion
	//#region Listeners
	const inputTogglePlay = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`)));
	inputTogglePlay.checked = animator.launched;
	inputTogglePlay.addEventListener(`change`, (event) => {
		animator.launched = inputTogglePlay.checked;
	});
	const buttonReloadBoard = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reload-board`)));
	buttonReloadBoard.addEventListener(`click`, (event) => {
		board.generate();
		animator.wasLaunched = false;
		animator.invoke();
	});
	const buttonCaptureCanvas = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#capture-canvas`)));
	buttonCaptureCanvas.addEventListener(`click`, (event) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				throw new ReferenceError(`Can't convert canvase to blob.`);
			}
			Application.download(new File([blob], `${Date.now()}.png`));
		});
	});
	//#endregion
	//#region Elements
	board.cases.clear();
	const scriptElements = document.head.appendChild(document.createElement(`script`));
	scriptElements.defer = true;
	scriptElements.src = `../scripts/elements.js`;
	scriptElements.addEventListener(`load`, (event) => {
		board.generate();
		//#region Render
		for (const [element, coeffincent] of board.cases) {
			const row = tbodyInformation.insertRow();
			{
				// const cellCoefficent = row.insertCell();
				// cellCoefficent.innerText = `${coeffincent}%`;
				// { }
				const cellView = row.insertCell();
				{
					const divView = cellView.appendChild(document.createElement(`div`));
					divView.classList.add(`-view`);
					divView.style.backgroundColor = `${element.color.toString()}`;
				}
				const cellElement = row.insertCell();
				cellElement.innerText = `${element.title}`;
				{ }
				const cellAmount = row.insertCell();
				{ }
			}
		}
		//#endregion
		//#region Update
		animator.renderer(async (context) => {
			divCounterFPS.innerText = animator.FPS.toFixed(0);
			divCounterFPS.style.borderColor = Color.viaHSL(120 * (Math.min(Math.max(0, animator.FPS / animator.FPSLimit), 1)), 100, 50).toString();
			const moves = board.execute();
			//#region Draw
			const information = new Map(Array.from(board.cases).map(([type]) => [type, 0]));
			const size = new Coordinate(canvas.width / board.size.x, canvas.height / board.size.y);
			for (let y = 0; y < board.size.y; y++) {
				for (let x = 0; x < board.size.x; x++) {
					const position = new Coordinate(x, y);
					const element = board.get(position);
					if (element) {
						for (const [type, count] of information) {
							if (element instanceof type) {
								information.set(type, count + 1);
							}
						}
						context.fillStyle = element.color.toString();
						context.fillRect(position.x * size.x - canvas.width / 2, position.y * size.y - canvas.height / 2, size.x, size.y);
					}
				}
			}
			Array.from(information).forEach(([element, count], index) => {
				const row = tbodyInformation.rows[index];
				const isDisabled = (!settings.nullables && count == 0);
				row.hidden = isDisabled;
				if (!isDisabled) {
					row.cells[2].innerText = `${count}`;
				}
			});
			//#endregion
			if (animator.wasLaunched && !moves) {
				animator.launched = false;
				const repeat = await (async () => {
					switch (settings.cycle) {
						case CycleType.break: return false;
						case CycleType.ask: return (await Application.confirm(`Elements have no more moves. Do you want to reload the board?`));
						case CycleType.loop: return true;
						default: throw new TypeError(`Invalid cycle type: '${settings.cycle}'.`);
					}
				})();
				if (repeat) {
					board.generate();
					animator.wasLaunched = false;
					animator.launched = true;
				}
				inputTogglePlay.checked = animator.launched;
			}
		});
		//#endregion
	}, { once: true });
	//#endregion
} catch (exception) {
	Application.prevent(exception);
}
