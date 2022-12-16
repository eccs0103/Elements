try {
	//#region Initialize
	const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
	linkTheme.href = `../styles/themes/${archiveSettings.data.theme}.css`;
	let settings = Settings.import(archiveSettings.data);
	window.addEventListener(`beforeunload`, (event) => {
		archiveSettings.data = Settings.export(settings);
	});
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
		option.innerText = /* `${data.title[0].toUpperCase()}${data.title.substring(1)}`; // */`${data.group[0].toUpperCase()}${data.group.substring(1)} - ${data.title[0].toUpperCase()}${data.title.substring(1)}`;
	}
	selectTheme.value = archiveSettings.data.theme;
	selectTheme.addEventListener(`change`, (event) => {
		settings.theme = selectTheme.value;
		linkTheme.href = `../styles/themes/${settings.theme}.css`;
	});
	//#endregion
	//#region Counter FPS
	const inputCounterFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-counter-fps`)));
	inputCounterFPS.checked = archiveSettings.data.counterFPS;
	inputCounterFPS.addEventListener(`change`, (event) => {
		settings.counterFPS = inputCounterFPS.checked;
	});
	//#endregion
	//#region Elements Counter
	const inputToggleElementsCounter = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-elements-counter`)));
	inputToggleElementsCounter.checked = archiveSettings.data.elementsCounter;
	inputToggleElementsCounter.addEventListener(`change`, (event) => {
		settings.elementsCounter = inputToggleElementsCounter.checked;
	});
	//#region Hide Nullables
	const inputToggleHideNullables = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-hide-nullables`)));
	inputToggleHideNullables.checked = archiveSettings.data.hideNullables;
	inputToggleHideNullables.addEventListener(`change`, (event) => {
		settings.hideNullables = inputToggleHideNullables.checked;
	});
	//#endregion
	//#endregion
	//#region Absolute Frames Per Second
	const inputAFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#afps`)));
	inputAFPS.min = `${Settings.minAFPS}`;
	inputAFPS.max = `${Settings.maxAFPS}`;
	inputAFPS.placeholder = `[${Settings.minAFPS} - ${Settings.maxAFPS}]`;
	inputAFPS.value = `${archiveSettings.data.AFPS}`;
	inputAFPS.addEventListener(`change`, (event) => {
		if (inputAFPS.checkValidity()) {
			const number = Number.parseInt(inputAFPS.value);
			if (!Number.isNaN(number)) {
				if (Settings.minAFPS <= number && number <= Settings.maxAFPS) {
					settings.AFPS = number;
				} else {
					throw new RangeError(`Input must be from ${Settings.minAFPS} to ${Settings.maxAFPS} inclusive.`);
				}
			} else {
				throw new TypeError(`Can't convert input to a integer number.`);
			}
		}
	});
	//#endregion
	//#region Board Size
	const inputBoardSize = (/** @type {HTMLInputElement} */ (document.querySelector(`input#board-size`)));
	inputBoardSize.min = `${Settings.minBoardSize}`;
	inputBoardSize.max = `${Settings.maxBoardSize}`;
	inputBoardSize.placeholder = `[${Settings.minBoardSize} - ${Settings.maxBoardSize}]`;
	inputBoardSize.value = `${archiveSettings.data.boardSize}`;
	inputBoardSize.addEventListener(`change`, (event) => {
		if (inputBoardSize.checkValidity()) {
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
		}
	});
	//#endregion
	//#region Reset Settings
	const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
	buttonResetSettings.addEventListener(`click`, (event) => {
		if (window.confirm(`The settings will be reset to factory defaults, after which the page will be reloaded. Are you sure?`)) {
			settings = new Settings();
			location.reload();
		}
	});
	//#endregion
	//#region New Version
	const sectionNewVersion = (/** @type {HTMLElement} */ (document.querySelector(`section#new-version`)));
	const link = `https://raw.githubusercontent.com/eccs0103/Elements/master/scripts/initialize.js`;
	Manager.queryText(link).then((text) => {
		const availableVersionProject = (() => {
			const match = /{ "global": \d+, "partial": \d+, "local": \d+ }/.exec(text);
			if (match) {
				return (/** @type {VersionNotation} */ (JSON.parse(match[0])));
			} else {
				return null;
			}
		})();
		if ((availableVersionProject != null && (
			(versionProject == null) ||
			(availableVersionProject.global > versionProject.global) ||
			(availableVersionProject.global == versionProject.global && availableVersionProject.partial > versionProject.partial) ||
			(availableVersionProject.global == versionProject.global && availableVersionProject.partial == versionProject.partial && availableVersionProject.local > versionProject.local)
		))) {
			sectionNewVersion.hidden = false;
			console.log(`The new version is available.`);
		} else {
			sectionNewVersion.hidden = true;
			console.log(`Last update is already installed.`);
		}
	}).catch((reason) => {
		console.log(reason);
	});
	//#endregion
} catch (error) {
	if (safeMode) {
		if (error instanceof Error) {
			window.alert(`'${error.name}' detected - ${error.message}\n${error.stack ?? ``}`);
		} else {
			window.alert(`Invalid exception type.`);
		}
		location.reload();
	}
	console.error(error);
}