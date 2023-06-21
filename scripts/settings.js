// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

try {
	//#region Initialize
	window.addEventListener(`beforeunload`, (event) => {
		archiveSettings.data = Settings.export(settings);
	});
	//#endregion
	//#region Theme
	const selectDropdownTheme = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-theme`)));
	for (const theme of Settings.themes) {
		const option = selectDropdownTheme.appendChild(document.createElement(`option`));
		option.value = `${theme}`;
		option.innerText = `${theme.replace(/\b\w/, (letter) => letter.toUpperCase())}`;
	}
	selectDropdownTheme.value = settings.theme;
	selectDropdownTheme.addEventListener(`change`, (event) => {
		settings.theme = selectDropdownTheme.value;
		document.documentElement.dataset[`theme`] = settings.theme;
	});
	//#endregion
	//#region Counter FPS
	const inputToggleFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-fps`)));
	inputToggleFPS.checked = settings.FPS;
	inputToggleFPS.addEventListener(`change`, (event) => {
		settings.FPS = inputToggleFPS.checked;
	});
	//#endregion
	//#region FPS limit
	const inputTextboxFPSLimit = (/** @type {HTMLInputElement} */ (document.querySelector(`input#textbox-fps-limit`)));
	inputTextboxFPSLimit.min = `${Settings.minFPSLimit}`;
	inputTextboxFPSLimit.max = `${Settings.maxFPSLimit}`;
	inputTextboxFPSLimit.placeholder = `[${Settings.minFPSLimit} - ${Settings.maxFPSLimit}]`;
	inputTextboxFPSLimit.value = `${settings.FPSLimit}`;
	inputTextboxFPSLimit.addEventListener(`change`, (event) => {
		if (inputTextboxFPSLimit.checkValidity()) {
			const number = Number.parseInt(inputTextboxFPSLimit.value);
			if (!Number.isNaN(number)) {
				if (Settings.minFPSLimit <= number && number <= Settings.maxFPSLimit) {
					settings.FPSLimit = number;
				} else {
					throw new RangeError(`Input must be from ${Settings.minFPSLimit} to ${Settings.maxFPSLimit} inclusive.`);
				}
			} else {
				throw new TypeError(`Can't convert input to a integer number.`);
			}
		}
	});
	//#endregion
	//#region Elements counter
	const inputToggleCounter = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-counter`)));
	inputToggleCounter.checked = settings.counter;
	inputToggleCounter.addEventListener(`change`, (event) => {
		settings.counter = inputToggleCounter.checked;
	});
	//#region Hide Nullables
	const inputToggleNullables = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-nullables`)));
	inputToggleNullables.checked = !settings.nullables;
	inputToggleNullables.addEventListener(`change`, (event) => {
		settings.nullables = !inputToggleNullables.checked;
	});
	//#endregion
	//#endregion
	//#region Board size
	const inputTextboxSize = (/** @type {HTMLInputElement} */ (document.querySelector(`input#textbox-size`)));
	inputTextboxSize.min = `${Settings.minSize}`;
	inputTextboxSize.max = `${Settings.maxSize}`;
	inputTextboxSize.placeholder = `[${Settings.minSize} - ${Settings.maxSize}]`;
	inputTextboxSize.value = `${settings.size}`;
	inputTextboxSize.addEventListener(`change`, (event) => {
		if (inputTextboxSize.checkValidity()) {
			const number = Number.parseInt(inputTextboxSize.value);
			if (!Number.isNaN(number)) {
				if (Settings.minSize <= number && number <= Settings.maxSize) {
					settings.size = number;
				} else {
					throw new RangeError(`Input must be from ${Settings.maxSize} to ${Settings.minSize} inclusive.`);
				}
			} else {
				throw new TypeError(`Can't convert input to a integer number.`);
			}
		}
	});
	//#endregion
	//#region Cycle type
	const selectDropdownCycle = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-cycle`)));
	for (const property in CycleType) {
		const option = selectDropdownCycle.appendChild(document.createElement(`option`));
		option.value = CycleType[property];
		option.innerText = `${String(CycleType[property]).replace(/\b\w/, (letter) => letter.toUpperCase())}`;
	}
	selectDropdownCycle.value = settings.cycle;
	selectDropdownCycle.addEventListener(`change`, (event) => {
		settings.cycle = selectDropdownCycle.value;
	});
	//#endregion
	//#region Reset settings
	const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
	buttonResetSettings.addEventListener(`click`, async (event) => {
		if (await Application.confirm(`The settings will be reset to factory defaults, after which the page will be reloaded. Are you sure?`)) {
			settings = new Settings();
			location.reload();
		}
	});
	//#endregion
} catch (exception) {
	Application.prevent(exception);
}