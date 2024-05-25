"use strict";

import { ArchiveManager } from "../scripts/modules/storage.js";
import { CycleTypes, Settings } from "../scripts/structure.js";

//#region Initialize
const managerSettings = await ArchiveManager.construct(`${navigator.dataPath}.Elements`, Settings);
const selectColorScheme = await window.ensure(() => document.getElement(HTMLSelectElement, `select#color-scheme`));
const inputFPSLimit = await window.ensure(() => document.getElement(HTMLInputElement, `input#fps-limit`));
const inputBoardSize = await window.ensure(() => document.getElement(HTMLInputElement, `input#board-size`));
const selectCycleType = await window.ensure(() => document.getElement(HTMLSelectElement, `select#cycle-type`));
const buttonResetSettings = await window.ensure(() => document.getElement(HTMLButtonElement, `button#reset-settings`));
//#endregion
//#region Color scheme
for (const theme of Settings.colorSchemes) {
	const option = selectColorScheme.appendChild(document.createElement(`option`));
	option.value = `${theme}`;
	option.innerText = `${theme.replace(/\b\w/, (letter) => letter.toUpperCase())}`;
}
selectColorScheme.value = managerSettings.data.colorScheme;
navigator.colorScheme = managerSettings.data.colorScheme;
selectColorScheme.addEventListener(`change`, (event) => window.insure(() => {
	managerSettings.data.colorScheme = selectColorScheme.value;
	navigator.colorScheme = managerSettings.data.colorScheme;
}));
//#endregion
//#region Show FPS
const inputToggleFPS = await window.ensure(() => document.getElement(HTMLInputElement, `input#toggle-fps`));
inputToggleFPS.checked = managerSettings.data.showFPS;
inputToggleFPS.addEventListener(`change`, (event) => {
	managerSettings.data.showFPS = inputToggleFPS.checked;
});
//#endregion
//#region FPS limit
inputFPSLimit.min = `${Settings.minFPSLimit}`;
inputFPSLimit.max = `${Settings.maxFPSLimit}`;
inputFPSLimit.placeholder = `[${Settings.minFPSLimit} - ${Settings.maxFPSLimit}]`;
inputFPSLimit.value = `${managerSettings.data.FPSLimit}`;
inputFPSLimit.addEventListener(`change`, (event) => window.insure(() => {
	managerSettings.data.FPSLimit = Number(inputFPSLimit.value);
}));
//#endregion
//#region Board size
inputBoardSize.min = `${Settings.minBoardSize}`;
inputBoardSize.max = `${Settings.maxBoardSize}`;
inputBoardSize.placeholder = `[${Settings.minBoardSize} - ${Settings.maxBoardSize}]`;
inputBoardSize.value = `${managerSettings.data.boardSize}`;
inputBoardSize.addEventListener(`change`, (event) => window.insure(() => {
	managerSettings.data.boardSize = Number(inputBoardSize.value);
}));
//#endregion
//#region Cycle type
for (const type of Object.values(CycleTypes)) {
	const option = selectCycleType.appendChild(document.createElement(`option`));
	option.value = type;
	option.innerText = `${String(type).replace(/\b\w/, (letter) => letter.toUpperCase())}`;
}
selectCycleType.value = managerSettings.data.cycleType;
selectCycleType.addEventListener(`change`, (event) => window.insure(() => {
	managerSettings.data.cycleType = selectCycleType.value;
}));
//#endregion
//#region Reset settings
buttonResetSettings.addEventListener(`click`, (event) => window.insure(async () => {
	if (await window.confirmAsync(`The settings will be reset to factory defaults. Are you sure?`)) {
		managerSettings.reconstruct();
		selectColorScheme.value = managerSettings.data.colorScheme;
		navigator.colorScheme = managerSettings.data.colorScheme;
		inputToggleFPS.checked = managerSettings.data.showFPS;
		inputFPSLimit.value = `${managerSettings.data.FPSLimit}`;
		inputBoardSize.value = `${managerSettings.data.boardSize}`;
		selectCycleType.value = managerSettings.data.cycleType;
	}
}));
//#endregion
