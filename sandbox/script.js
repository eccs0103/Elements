"use strict";

import { FastEngine, PreciseEngine } from "../scripts/modules/generators.js";
import { Color } from "../scripts/modules/palette.js";
import { ArchiveManager } from "../scripts/modules/storage.js";
import { Ability, CycleTypes, Elemental, RenderEvent, Settings } from "../scripts/structure.js";

//#region Initialize
const canvas = await window.ensure(() => document.getElement(HTMLCanvasElement, `canvas#display`));
const context = await window.ensure(() => canvas.getContext(`2d`) ?? (() => {
	throw new EvalError(`Unable to get context`);
})());
const board = Elemental.Board.self;
const inputTogglePlay = await window.ensure(() => document.getElement(HTMLInputElement, `input#toggle-play`));
const buttonReloadBoard = await window.ensure(() => document.getElement(HTMLButtonElement, `button#reload-board`));
const buttonCaptureCanvas = await window.ensure(() => document.getElement(HTMLButtonElement, `button#capture-canvas`));
const engine = new PreciseEngine(false);
const engineController = new FastEngine(true);
engineController.limit = 4;
const divFPSCounter = await window.ensure(() => document.getElement(HTMLDivElement, `div#fps-counter`));
const settings = (await ArchiveManager.construct(`${navigator.dataPath}.Elements`, Settings)).data;
navigator.colorScheme = settings.colorScheme;
//#endregion
//#region Player
window.addEventListener(`resize`, (event) => {
	const { width, height } = canvas.getBoundingClientRect();
	canvas.width = width;
	canvas.height = height;
});
window.dispatchEvent(new UIEvent(`resize`));

await window.load(Promise.withSignal((signal, resolve, reject) => window.ensure(() => {
	const scriptElements = document.createElement(`script`);
	scriptElements.type = `module`;
	scriptElements.src = `../scripts/elements.js`;
	scriptElements.addEventListener(`load`, (event) => resolve(undefined), { signal });
	scriptElements.addEventListener(`error`, (event) => reject(event.error), { signal });
	document.head.appendChild(scriptElements);
})));

engine.limit = settings.FPSLimit;
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
engine.addEventListener(`update`, (event) => window.ensure(async () => {
	const invoker = new Ability.Invoker();
	invoker.observe();
	board.execute(invoker);
	if (invoker.summarize()) return;
	engine.launched = false;
	const repeat = await (async () => {
		switch (settings.cycleType) {
			case CycleTypes.terminate: return false;
			case CycleTypes.ask: return await window.confirmAsync(`Elements have no more moves. Do you want to reload the board?`);
			case CycleTypes.repeat: return true;
			default: throw new EvalError(`Invalid '${settings.cycleType}' cycle type`);
		}
	})();
	if (repeat) {
		board.dispatchEvent(new Event(`generate`));
		engine.launched = true;
	}
	inputTogglePlay.checked = engine.launched;
}));

inputTogglePlay.addEventListener(`change`, (event) => {
	engine.launched = inputTogglePlay.checked;
});
buttonReloadBoard.addEventListener(`click`, (event) => {
	board.dispatchEvent(new Event(`generate`));
});

buttonCaptureCanvas.addEventListener(`click`, (event) => window.insure(() => {
	canvas.toBlob((blob) => {
		if (blob === null) throw new EvalError(`Unable to convert canvas for capture`);
		navigator.download(new File([blob], `${Date.now()}.png`, { type: `png` }));
	});
}));
//#endregion
//#region Aside
divFPSCounter.hidden = !settings.showFPS;
engineController.addEventListener(`update`, (event) => {
	const factor = engine.FPS / engine.limit;
	divFPSCounter.style.setProperty(`--color-fps-indicator`, (factor > 0
		? Color.viaHSL(factor * 120, 100, 50).toString()
		: null
	));
	divFPSCounter.textContent = `${engine.FPS.toFixed()}`;
});
//#endregion
