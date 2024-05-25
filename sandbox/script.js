"use strict";

import { FastEngine, PreciseEngine } from "../scripts/modules/generators.js";
import { RenderEvent, board } from "../scripts/structure.js";

//#region Initialize
const canvas = await window.ensure(() => document.getElement(HTMLCanvasElement, `canvas#display`));
const context = await window.ensure(() => canvas.getContext(`2d`) ?? (() => {
	throw new EvalError(`Unable to get context`);
})());
const inputTogglePlay = await window.ensure(() => document.getElement(HTMLInputElement, `input#toggle-play`));
const buttonReloadBoard = await window.ensure(() => document.getElement(HTMLButtonElement, `button#reload-board`));
const buttonCaptureCanvas = await window.ensure(() => document.getElement(HTMLButtonElement, `button#capture-canvas`));
const engine = new FastEngine(false);
//#endregion
//#region Player
window.addEventListener(`resize`, (event) => {
	const { width, height } = canvas.getBoundingClientRect();
	canvas.width = width;
	canvas.height = height;
});
window.dispatchEvent(new UIEvent(`resize`));

await window.ensure(() => Promise.withSignal((signal, resolve, reject) => {
	const scriptElements = document.createElement(`script`);
	scriptElements.type = `module`;
	scriptElements.src = `../scripts/elements.js`;
	scriptElements.addEventListener(`load`, (event) => resolve(undefined), { signal });
	scriptElements.addEventListener(`error`, (event) => reject(event.error), { signal });
	document.head.appendChild(scriptElements);
}));

engine.limit = 60;
board.addEventListener(`generate`, (event) => {
	board.dispatchEvent(new RenderEvent(`repaint`, { context }));
});
board.dispatchEvent(new Event(`generate`));

window.addEventListener(`resize`, (event) => {
	board.dispatchEvent(new RenderEvent(`repaint`, { context }));
});
engine.addEventListener(`update`, (event) => {
	board.dispatchEvent(new RenderEvent(`render`, { context }));
});
engine.addEventListener(`update`, async (event) => {
	if (!board.dispatchEvent(new Event(`execute`, { cancelable: true }))) {
		engine.launched = false;
		if (await window.confirmAsync(`Elements have no more moves. Do you want to reload the board?`)) {
			board.dispatchEvent(new Event(`generate`));
			engine.launched = true;
		}
		inputTogglePlay.checked = engine.launched;
	}
});

inputTogglePlay.addEventListener(`change`, (event) => {
	engine.launched = inputTogglePlay.checked;
});
buttonReloadBoard.addEventListener(`click`, (event) => {
	board.dispatchEvent(new Event(`generate`));
});

buttonCaptureCanvas.addEventListener(`click`, (event) => {
	canvas.toBlob((blob) => {
		if (blob === null) throw new EvalError(`Unable to convert canvas for capture`);
		navigator.download(new File([blob], `${Date.now()}.png`, { type: `png` }));
	});
});
//#endregion
