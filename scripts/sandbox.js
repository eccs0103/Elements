const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
linkTheme.href = `../styles/themes/${archiveSettings.read().theme}.css`;
///
const canvasView = (/** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`)));
const contextView = (() => {
	const context = canvasView.getContext(`2d`);
	if (context) {
		return context;
	} else {
		throw new ReferenceError(`Can't reach the texture.`);
	}
})();
///
const settings = Settings.import(archiveSettings.read());
const board = new Board(new Vector(settings.boardSize, settings.boardSize), contextView);
///
board.setCase(Dirt, 90);
board.setCase(Grass, 4);
board.setCase(Fire, 2);
board.setCase(Water, 2);
board.setCase(Lava, 1);
board.setCase(Ice, 1);
board.fill();
///
const inputTogglePlay = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`)));
board.execute = inputTogglePlay.checked;
inputTogglePlay.addEventListener(`change`, (event) => {
	board.execute = inputTogglePlay.checked;
});
window.addEventListener(`beforeunload`, (event) => {
	if (board.wasExecuted) {
		event.returnValue = `Board will be reseted.`;
	}
});
const buttonReloadBoard = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reload-board`)));
buttonReloadBoard.addEventListener(`click`, (event) => {
	board.fill();
});
///
const divCounterFPS = (/** @type {HTMLDivElement} */ (document.querySelector(`div#counter-fps`)));
divCounterFPS.hidden = !settings.counterFPS;
const countRefreshPerSecond = 4;
setInterval(() => {
	divCounterFPS.innerText = board.FPS.toFixed(0);
	divCounterFPS.style.borderColor = Color.viaHSV(120 * (Math.min(Math.max(0, board.FPS / board.MFC), 1)), 100, 100).toString();
}, 1000 / countRefreshPerSecond);
///
const tableElementsCounter = (/** @type {HTMLDivElement} */ (document.querySelector(`table#elements-counter`)));
tableElementsCounter.hidden = !settings.elementsCounter;
