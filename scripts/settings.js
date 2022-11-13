//#region Initialize
const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
linkTheme.href = `../styles/themes/${archiveSettings.data.theme}.css`;
//#endregion
//#region Theme
const selectTheme = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-theme`)));
for (const group of Settings.groups) {
	const optgroup = selectTheme.appendChild(document.createElement(`optgroup`));
	optgroup.label = `${group[0].toUpperCase()}${group.substring(1)} themes`;
}
for (const theme of Settings.themes) {
	/** @typedef {{ readonly title: String, readonly group: String }} ThemeData */
	const data = (() => {
		const matches = new RegExp(`-(${Settings.groups.join(`|`)})`, `g`).exec(theme);
		if (matches) {
			const index = matches.index;
			return (/** @type {ThemeData} */ ({ title: theme.substring(0, index), group: theme.substring(index + 1) }));
		} else {
			throw new SyntaxError(`Invalid theme pattern.`);
		}
	})();
	const optgroup = (() => {
		const result = (/** @type {HTMLOptGroupElement | undefined} */ (selectTheme.querySelector(`optgroup[label ^="${data.group[0].toUpperCase()}${data.group.substring(1)}"]`)));
		if (Settings.groups.includes(data.group) && result) {
			return result;
		} else {
			throw new ReferenceError(`Can't reach any of the groups.`);
		}
	})();
	const option = optgroup.appendChild(document.createElement(`option`));
	option.value = theme;
	option.innerText = `${data.group[0].toUpperCase()}${data.group.substring(1)} - ${data.title[0].toUpperCase()}${data.title.substring(1)}`;
}
selectTheme.value = archiveSettings.data.theme;
selectTheme.addEventListener(`change`, (event) => {
	archiveSettings.data = (() => {
		const settings = Settings.import(archiveSettings.data);
		settings.theme = selectTheme.value;
		return Settings.export(settings);
	})();
	linkTheme.href = `../styles/themes/${archiveSettings.data.theme}.css`;
});
//#endregion
//#region Counter FPS
const inputCounterFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-counter-fps`)));
inputCounterFPS.checked = archiveSettings.data.counterFPS;
inputCounterFPS.addEventListener(`change`, (event) => {
	archiveSettings.data = (() => {
		const settings = Settings.import(archiveSettings.data);
		settings.counterFPS = inputCounterFPS.checked;
		return Settings.export(settings);
	})();
});
//#endregion
//#region Elements Counter
const inputToggleElementsCounter = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-elements-counter`)));
inputToggleElementsCounter.checked = archiveSettings.data.elementsCounter;
inputToggleElementsCounter.addEventListener(`change`, (event) => {
	archiveSettings.data = (() => {
		const settings = Settings.import(archiveSettings.data);
		settings.elementsCounter = inputToggleElementsCounter.checked;
		return Settings.export(settings);
	})();
});
//#region Hide Nullables
const inputToggleHideNullables = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-hide-nullables`)));
inputToggleHideNullables.checked = archiveSettings.data.hideNullables;
inputToggleHideNullables.addEventListener(`change`, (event) => {
	archiveSettings.data = (() => {
		const settings = Settings.import(archiveSettings.data);
		settings.hideNullables = inputToggleHideNullables.checked;
		return Settings.export(settings);
	})();
});
//#endregion
//#endregion
//#region Board Size
const inputBoardSize = (/** @type {HTMLInputElement} */ (document.querySelector(`input#board-size`)));
inputBoardSize.min = `${Settings.minBoardSize}`;
inputBoardSize.max = `${Settings.maxBoardSize}`;
inputBoardSize.placeholder = `[${Settings.minBoardSize} - ${Settings.maxBoardSize}]`;
inputBoardSize.value = `${archiveSettings.data.boardSize}`;
inputBoardSize.addEventListener(`change`, (event) => {
	if (inputBoardSize.checkValidity()) {
		archiveSettings.data = (() => {
			const settings = Settings.import(archiveSettings.data);
			const number = Number.parseInt(inputBoardSize.value);
			if (!Number.isNaN(number)) {
				if (Settings.minBoardSize <= number && number <= Settings.maxBoardSize) {
					settings.boardSize = number;
				} else {
					throw new RangeError(`Input must be from ${Settings.minBoardSize} to ${Settings.maxBoardSize} inclusive.`);
				}
			} else {
				throw new TypeError(`Can't convert input to a integer number.`);
			}
			return Settings.export(settings);
		})();
	}
});
//#endregion
//#region Reset Settings
const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
buttonResetSettings.addEventListener(`click`, (event) => {
	if (window.confirm(`The settings will be reset to factory defaults, after which the page will be reloaded. Are you sure?`)) {
		archiveSettings.data = Settings.export(new Settings());
		location.reload();
	}
});
//#endregion