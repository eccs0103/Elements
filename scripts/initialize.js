//#region Settings
/** @typedef {{ theme: String, counterFPS: Boolean, elementsCounter: Boolean, hideNullables: Boolean, AFPS: Number, boardSize: Number, cases: Array<Case> }} SettingsNotation */
class Settings {
	static import(/** @type {SettingsNotation} */ object) {
		const value = new Settings();
		value.#theme = object.theme;
		value.counterFPS = object.counterFPS;
		value.elementsCounter = object.elementsCounter;
		value.hideNullables = object.hideNullables;
		value.#AFPS = object.AFPS;
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
		value.AFPS = object.#AFPS;
		value.boardSize = object.#boardSize;
		// value.cases = object.#cases;
		return value;
	}
	/** @type {Array<String>} */ static #groups = [`light`, `dark`];
	/** @readonly */ static get groups() {
		return Settings.#groups;
	}
	/** @type {Array<String>} */ static #themes = [`material-light`, `material-dark`];
	/** @readonly */ static get themes() {
		return Settings.#themes;
	}
	/** @type {Number} */ static #minAFPS = 1;
	/** @readonly */ static get minAFPS() {
		return this.#minAFPS;
	}
	/** @type {Number} */ static #maxAFPS = 240;
	/** @readonly */ static get maxAFPS() {
		return this.#maxAFPS;
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
		this.AFPS = 60;
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
	/** @type {Number} */ #AFPS;
	get AFPS() {
		return this.#AFPS;
	}
	set AFPS(value) {
		if (Settings.#minAFPS <= value && value <= Settings.#maxAFPS) {
			this.#AFPS = value;
		} else {
			throw new RangeError(`Value ${value} is out of range. It must be from ${Settings.#minAFPS} to ${Settings.#maxAFPS} inclusive.`);
		}
	}
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
/** @typedef {{ global: Number, partial: Number , local: Number }} VersionNotation */
const versionProject = (/** @type {VersionNotation} */ ({ "global": 2, "partial": 1, "local": 8 }));
const archiveSettings = new Archive(`${nameDeveloper}\\${nameProject}`, Settings.export(new Settings()));
const safeMode = true;
//#endregion
