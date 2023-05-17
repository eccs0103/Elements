// @ts-ignore
/** @typedef {import("./structure")} */

"use strict";

try {
	//#region Initialize
	/**
	 * Board in scene.
	 */
	var board = new Board(new Coordinate(settings.size, settings.size));
	//#endregion
	//#region Canvas
	const canvasView = (/** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`)));
	canvasView.width = Math.floor(canvasView.getBoundingClientRect().width / settings.size) * settings.size;
	canvasView.height = Math.floor(canvasView.getBoundingClientRect().height / settings.size) * settings.size;
	function draw() {
		const information = new Map(Array.from(board.cases).map(([type]) => [type, 0]));
		const contextView = canvasView.getContext(`2d`);
		if (!contextView) {
			throw new ReferenceError(`Element 'contextView' isn't defined.`);
		}
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
					contextView.fillStyle = element.color.toString();
					const cellSize = new Coordinate(contextView.canvas.width / board.size.x, contextView.canvas.height / board.size.y);
					contextView.fillRect(position.x * cellSize.x, position.y * cellSize.y, cellSize.x, cellSize.y);
				}
			}
		}
		return Promise.resolve(information);
	}
	//#endregion
	//#region Rendering
	const tableElementsCounter = (/** @type {HTMLTableElement} */ (document.querySelector(`table#elements-counter`)));
	const tbodyInformation = tableElementsCounter.tBodies[0];
	function render() {
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
	}
	function update() {
		draw().then((information) => {
			Array.from(information).forEach(([element, count], index) => {
				const row = tbodyInformation.rows[index];
				const isDisabled = (!settings.nullables && count == 0);
				row.hidden = isDisabled;
				if (!isDisabled) {
					row.cells[2].innerText = `${count}`;
				}
			});
		});
	}
	//#endregion
	//#region Engine
	let wasLaunched = false;
	/**
	 * Engine for working with frames.
	 */
	var engine = new Engine(false);
	engine.renderer(async () => {
		const moves = board.execute();
		console.log(moves);
		if (!wasLaunched && engine.launched) {
			wasLaunched = true;
		}
		update();
		if (wasLaunched && !moves) {
			engine.launched = false;
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
				wasLaunched = false;
				engine.launched = true;
			}
			inputTogglePlay.checked = engine.launched;
		}
	});
	window.addEventListener(`beforeunload`, (event) => {
		if (wasLaunched) {
			event.returnValue = `Board will be reseted.`;
		}
	});
	//#region FPS Counter
	const divCounterFPS = (/** @type {HTMLDivElement} */ (document.querySelector(`div#counter-fps`)));
	divCounterFPS.hidden = !settings.FPS;
	const countRefreshPerSecond = 4;
	setInterval(() => {
		divCounterFPS.innerText = engine.FPS.toFixed(0);
		divCounterFPS.style.borderColor = Color.viaHSL(120 * (Math.min(Math.max(0, engine.FPS / settings.AFPS), 1)), 100, 50).toString();
	}, 1000 / countRefreshPerSecond);
	tableElementsCounter.hidden = !settings.counter;
	//#endregion
	//#endregion
	//#region Listeners
	const inputTogglePlay = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`)));
	inputTogglePlay.checked = engine.launched;
	inputTogglePlay.addEventListener(`change`, (event) => {
		engine.launched = inputTogglePlay.checked;
	});
	const buttonReloadBoard = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reload-board`)));
	buttonReloadBoard.addEventListener(`click`, (event) => {
		board.generate();
		wasLaunched = false;
		update();
	});
	const buttonCaptureCanvas = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#capture-canvas`)));
	buttonCaptureCanvas.addEventListener(`click`, (event) => {
		const a = document.createElement(`a`);
		a.download = `${new Date().toLocaleString()}.png`;
		a.href = canvasView.toDataURL(`png`);
		a.click();
		URL.revokeObjectURL(a.href);
		a.remove();
	});
	//#endregion
	//#region Elements
	board.cases.clear();
	const scriptElements = document.head.appendChild(document.createElement(`script`));
	scriptElements.async = false;
	scriptElements.src = `../scripts/elements.js`;
	scriptElements.addEventListener(`load`, (event) => {
		board.generate();
		render();
		update();
	});
	//#endregion
} catch (exception) {
	Application.prevent(exception);
}
