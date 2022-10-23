//#region Initialize
const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
linkTheme.href = `../styles/themes/${archiveSettings.read().theme}.css`;
//#endregion
//#region Theme
const selectTheme = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-theme`)));
for (const group of Settings.groups) {
	const optgroup = selectTheme.appendChild(document.createElement(`optgroup`));
	optgroup.title = group;
	optgroup.label = `${group[0].toUpperCase()}${group.substring(1)} themes`;
}
for (const theme of Settings.themes) {
	/** @typedef {{ title: String, group: String }} ThemeData */
	const data = (() => {
		const result = (/** @type {ThemeData} */ ({}));
		const matches = new RegExp(`-(${Settings.groups.join(`|`)})`, `g`).exec(theme);
		if (matches) {
			const index = matches.index;
			result.title = theme.substring(0, index);
			result.group = theme.substring(index + 1);
			return result;
		} else {
			throw new SyntaxError(`Invalid theme pattern.`);
		}
	})();
	const optgroup = (() => {
		if (Settings.groups.includes(data.group)) {
			const result = (/** @type {HTMLOptGroupElement | undefined} */ (selectTheme.querySelector(`optgroup[title="${data.group}"]`)));
			if (result) {
				return result;
			} else {
				throw new ReferenceError(`Can't reach any of the groups.`);
			}
		} else {
			throw new ReferenceError(`Can't reach any of the groups.`);
		}
	})();
	const option = optgroup.appendChild(document.createElement(`option`));
	option.value = theme;
	option.innerText = `${data.group[0].toUpperCase()}${data.group.substring(1)} - ${data.title[0].toUpperCase()}${data.title.substring(1)}`;
}
selectTheme.value = archiveSettings.read().theme;
selectTheme.addEventListener(`change`, (event) => {
	archiveSettings.write((() => {
		const settings = Settings.import(archiveSettings.read());
		settings.theme = selectTheme.value;
		return Settings.export(settings);
	})());
	linkTheme.href = `../styles/themes/${archiveSettings.read().theme}.css`;
});
//#endregion
//#region Counter FPS
const inputCounterFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-counter-fps`)));
inputCounterFPS.checked = archiveSettings.read().counterFPS;
inputCounterFPS.addEventListener(`change`, (event) => {
	archiveSettings.write((() => {
		const settings = Settings.import(archiveSettings.read());
		settings.counterFPS = inputCounterFPS.checked;
		return Settings.export(settings);
	})());
});
//#endregion
//#region Elements Counter
const inputToggleElementsCounter = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-elements-counter`)));
inputToggleElementsCounter.checked = archiveSettings.read().elementsCounter;
inputToggleElementsCounter.addEventListener(`change`, (event) => {
	archiveSettings.write((() => {
		const settings = Settings.import(archiveSettings.read());
		settings.elementsCounter = inputToggleElementsCounter.checked;
		return Settings.export(settings);
	})());
});
//#endregion
//#region Board Size
const inputBoardSize = (/** @type {HTMLInputElement} */ (document.querySelector(`input#board-size`)));
inputBoardSize.min = `${Settings.minBoardSize}`;
inputBoardSize.max = `${Settings.maxBoardSize}`;
inputBoardSize.placeholder = `[${Settings.minBoardSize} - ${Settings.maxBoardSize}]`;
inputBoardSize.value = `${archiveSettings.read().boardSize}`;
inputBoardSize.addEventListener(`change`, (event) => {
	if (inputBoardSize.checkValidity()) {
		archiveSettings.write((() => {
			const settings = Settings.import(archiveSettings.read());
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
		})());
	}
});
//#endregion