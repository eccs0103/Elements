try {
	//#region Initialize
	const linkTheme = (/** @type {HTMLLinkElement} */ (document.head.querySelector(`link#theme`)));
	let settings = Settings.import(archiveSettings.data);
	document.documentElement.dataset[`mode`] = settings.mode;
	linkTheme.href = `../styles/themes/${settings.theme}.css`;
	window.addEventListener(`beforeunload`, (event) => {
		archiveSettings.data = Settings.export(settings);
	});
	//#endregion
	//#region Theme
	const selectDropdownTheme = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-theme`)));
	for (const mode of Settings.modes) {
		const optgroup = selectDropdownTheme.appendChild(document.createElement(`optgroup`));
		optgroup.label = `${mode.replace(/\b\w/, (letter) => letter.toUpperCase())}`;
		for (const theme of Settings.themes) {
			const option = optgroup.appendChild(document.createElement(`option`));
			option.value = `${theme}-${mode}`;
			option.innerText = `${theme.replace(/\b\w/, (letter) => letter.toUpperCase())}`;
		}
	}
	selectDropdownTheme.value = `${settings.theme}-${settings.mode}`;
	selectDropdownTheme.addEventListener(`change`, (event) => {
		const [theme, mode] = selectDropdownTheme.value.split(`-`);
		settings.mode = mode;
		settings.theme = theme;
		document.documentElement.dataset[`mode`] = settings.mode;
		linkTheme.href = `../styles/themes/${settings.theme}.css`;
	});
	//#endregion
	//#region Counter FPS
	const inputToggleFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-fps`)));
	inputToggleFPS.checked = settings.FPS;
	inputToggleFPS.addEventListener(`change`, (event) => {
		settings.FPS = inputToggleFPS.checked;
	});
	//#endregion
	//#region Absolute frames per second
	const inputTextboxAFPS = (/** @type {HTMLInputElement} */ (document.querySelector(`input#textbox-afps`)));
	inputTextboxAFPS.min = `${Settings.minAFPS}`;
	inputTextboxAFPS.max = `${Settings.maxAFPS}`;
	inputTextboxAFPS.placeholder = `[${Settings.minAFPS} - ${Settings.maxAFPS}]`;
	inputTextboxAFPS.value = `${settings.AFPS}`;
	inputTextboxAFPS.addEventListener(`change`, (event) => {
		if (inputTextboxAFPS.checkValidity()) {
			const number = Number.parseInt(inputTextboxAFPS.value);
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
	//#region Board Size
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
	//#region Reset Settings
	const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
	buttonResetSettings.addEventListener(`click`, (event) => {
		if (window.confirm(`The settings will be reset to factory defaults, after which the page will be reloaded. Are you sure?`)) {
			settings = new Settings();
			location.reload();
		}
	});
	//#endregion
} catch (error) {
	if (locked) {
		window.alert(error instanceof Error ? error.stack ?? `${error.name}: ${error.message}` : `Invalid exception type.`);
		location.reload();
	} else console.error(error);
}