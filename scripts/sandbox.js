try {
	//#region Initialize
	const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
	const settings = Settings.import(archiveSettings.data);
	document.documentElement.dataset[`mode`] = settings.mode;
	linkTheme.href = `../styles/themes/${settings.theme}.css`;
	/**
	 * Board in scene.
	 */
	var board = new Board(new Vector(settings.size, settings.size));
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
				const position = new Vector(x, y);
				const element = board.get(position);
				if (element) {
					for (const [type, count] of information) {
						if (element instanceof type) {
							information.set(type, count + 1);
						}
					}
					contextView.fillStyle = element.color.toString();
					const cellSize = new Vector(contextView.canvas.width / board.size.x, contextView.canvas.height / board.size.y);
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
	var engine = new Engine(() => {
		const moves = board.execute();
		if (!wasLaunched && engine.launch) {
			wasLaunched = true;
		}
		update();
		if (!moves) {
			engine.launch = false;
			const inputTogglePlay = /** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`));
			if (window.confirm(`Elements have no more moves. Do you want to reload the board?`)) {
				board.generate();
				wasLaunched = false;
				engine.launch = true;
			}
			inputTogglePlay.checked = engine.launch;
		}
	}, settings.AFPS, false);
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
		divCounterFPS.style.borderColor = Color.viaHSV(120 * (Math.min(Math.max(0, engine.FPS / engine.AFPS), 1)), 100, 100).toString();
	}, 1000 / countRefreshPerSecond);
	tableElementsCounter.hidden = !settings.counter;
	//#endregion
	//#endregion
	//#region Listeners
	const inputTogglePlay = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`)));
	inputTogglePlay.checked = engine.launch;
	inputTogglePlay.addEventListener(`change`, (event) => {
		engine.launch = inputTogglePlay.checked;
	});
	const buttonReloadBoard = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reload-board`)));
	buttonReloadBoard.addEventListener(`click`, (event) => {
		board.generate();
		wasLaunched = false;
		update();
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
} catch (error) {
	if (locked) {
		window.alert(error instanceof Error ? error.stack ?? `${error.name}: ${error.message}` : `Invalid exception type.`);
		location.reload();
	} else console.error(error);
}
