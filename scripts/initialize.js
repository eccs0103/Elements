//#region Settings
/** @typedef {{ theme: String, counterFPS: Boolean, elementsCounter: Boolean, hideNullables: Boolean, boardSize: Number, cases: Array<Case> }} SettingsNotation */
class Settings {
	static import(/** @type {SettingsNotation} */ object) {
		const value = new Settings();
		value.#theme = object.theme;
		value.counterFPS = object.counterFPS;
		value.elementsCounter = object.elementsCounter;
		value.hideNullables = object.hideNullables;
		value.#boardSize = object.boardSize;
		// value.#cases = object.cases;
		return value;
	}
	static export(/** @type {Settings} */ object) {
		const value = (/** @type {SettingsNotation} */ ({}));
		value.theme = object.#theme;
		value.counterFPS = object.counterFPS;
		value.elementsCounter = object.elementsCounter;
		value.hideNullables = object.hideNullables;
		value.boardSize = object.#boardSize;
		// value.cases = object.#cases;
		return value;
	}
	/** @type {Array<String>} */ static #groups = [`light`, `dark`];
	/** @readonly */ static get groups() {
		return Settings.#groups;
	}
	/** @type {Array<String>} */ static #themes = [`standart-light`, `standart-dark`];
	/** @readonly */ static get themes() {
		return Settings.#themes;
	}
	/** @type {Number} */ static #minBoardSize = 20;
	/** @readonly */ static get minBoardSize() {
		return this.#minBoardSize;
	}
	/** @type {Number} */ static #maxBoardSize = 200;
	/** @readonly */ static get maxBoardSize() {
		return this.#maxBoardSize;
	}
	constructor() {
		this.theme = Settings.#themes[0];
		this.counterFPS = false;
		this.elementsCounter = false;
		this.hideNullables = false;
		this.boardSize = 50;
		// this.#cases = [
		// 	{ value: Dirt, coefficient: 90 },
		// 	{ value: Grass, coefficient: 4 },
		// 	{ value: Fire, coefficient: 2 },
		// 	{ value: Water, coefficient: 2 },
		// 	{ value: Ice, coefficient: 1 },
		// 	{ value: Lava, coefficient: 1 },
		// ];
	}
	/** @type {String} */ #theme;
	get theme() {
		return this.#theme;
	}
	set theme(value) {
		if (Settings.#themes.includes(value)) {
			this.#theme = value;
		} else {
			throw new Error(`Can't reach ${value} theme in themes list.`);
		}
	}
	/** @type {Boolean} */ counterFPS;
	/** @type {Boolean} */ elementsCounter;
	/** @type {Boolean} */ hideNullables;
	/** @type {Number} */ #boardSize;
	get boardSize() {
		return this.#boardSize;
	}
	set boardSize(value) {
		if (Settings.#minBoardSize <= value && value <= Settings.#maxBoardSize) {
			this.#boardSize = value;
		} else {
			throw new RangeError(`Value ${value} is out of range. It must be from ${Settings.#minBoardSize} to ${Settings.#maxBoardSize} inclusive.`);
		}
	}
	// /** @type {Array<Case>} */ #cases;
	// /** @readonly */ get cases() {
	// 	return this.#cases;
	// }
}
//#endregion
//#region Metadata
const nameDeveloper = `Adaptive Core`;
const nameProject = `Elements`;
const archiveSettings = new Archive(`${nameDeveloper}\\${nameProject}`, Settings.export(new Settings()));
//#endregion
