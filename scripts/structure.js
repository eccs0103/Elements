// @ts-ignore
/** @typedef {import("./modules/archive.js")} */
// @ts-ignore
/** @typedef {import("./modules/application.js")} */
// @ts-ignore
/** @typedef {import("./modules/color.js")} */
// @ts-ignore
/** @typedef {import("./modules/coordinate.js")} */
// @ts-ignore
/** @typedef {import("./modules/random.js")} */

"use strict";

//#region Matrix
/**
 * Class representing two-dimensional matrix.
 * @template Item The type of matrix items.
 */
class Matrix {
	/**
	 * @param {Coordinate} size Matrix dimensions.
	 */
	constructor(size) {
		this.#size = size;
		this.#data = [];
		for (let y = 0; y < size.y; y++) {
			this.#data[y] = [];
			for (let x = 0; x < size.x; x++) {
				this.#data[y][x];
			}
		}
	}
	/** @type {Coordinate} */ #size;
	/**
	 * Matrix dimensions.
	 * @readonly
	*/
	get size() {
		return this.#size;
	}
	/**
	 * A function to get values from a matrix.
	 * @param {Coordinate} position Item position.
	 * @returns The value.
	 */
	get(position) {
		return this.#data[position.y] ? this.#data[position.y][position.x] : undefined;
	}
	/** @type {Array<Array<Item>>} */ #data;
	/**
	 * A function to set values to a matrix.
	 * @param {Coordinate} position Item position.
	 * @param {Item} value The value.
	 */
	set(position, value) {
		this.#data[position.y][position.x] = value;
	}
}
//#endregion
//#region Ability
/**
 * A class that describes the element's ability.
 */
class Ability {
	/**
	 * @param {String} title Ability's title.
	 * @param {() => Boolean} action The action to be taken when the progress is filled. The return value determines whether progress should be reset or an action should be invoked.
	 * @param {Number} countdown Ability's countdown value.
	 * @param {Number} progress Ability's progress value.
	 */
	constructor(title, action, countdown, progress = 0) {
		this.#title = title;
		this.#action = action;
		this.#countdown = countdown;
		this.progress = progress;
	}
	/** @type {String} */ #title;
	/**
	 * The title property.
	 * @readonly
	 */
	get title() {
		return this.#title;
	}
	/** @type {() => Boolean} */ #action;
	/**
	 * The action.
	 * @readonly
	 */
	get action() {
		return this.#action;
	}
	/** @type {Number} */ #countdown;
	/**
	 * The countdown property.
	 * @readonly
	 */
	get countdown() {
		return this.#countdown;
	}
	/**
	 * The progress property.
	 * @type {Number}
	 */
	progress;
}
//#endregion
//#region Elemental
/**
 * Base class for all elements
 */
class Elemental {
	/**
	 * Element base color.
	 */
	static color = Color.viaRGB(0, 0, 0);
	/**
	 * Element base title.
	 */
	static title = `Element`;
	constructor() {
		this._title = Elemental.title;
		this._color = Elemental.color;
		this.#abilities = [];
	}
	/** @protected @type {String} */ _title;
	/**
	 * Element title property.
	 * @readonly
	 */
	get title() {
		return this._title;
	}
	/**
	 * Element position.
	 * @type {Coordinate}
	 */
	position;
	/** @protected @type {Color} */ _color;
	/**
	 * Element color property.
	 * @readonly
	 */
	get color() {
		return this._color;
	}
	/** @type {Array<Ability>} */ #abilities;
	/**
	 * Element abilities.
	 * @readonly
	 */
	get abilities() {
		return this.#abilities;
	}
	/**
	 * A function that executes frame for element.
	 * @returns Have element available actions or not?
	 */
	execute() {
		let moves = false;
		for (const ability of this.#abilities) {
			if (ability.progress > ability.countdown) {
				throw new RangeError(`Invalid progress value - ${ability.progress}, at ability - ${ability.title}, at element ${Object.getPrototypeOf(this)}, in position - ${this.position.toString()}`);
			} else if (ability.progress == ability.countdown) {
				const reset = ability.action();
				if (reset) {
					ability.progress = 0;
					moves = true;
				}
			} else {
				ability.progress++;
				moves = true;
			}
		}
		return moves;
	}
}
//#endregion
//#region Factory
/**
 * A class for random matrix generations.
 * @template Case Type for cases.
 * @template Item The type of matrix items.
 * @extends {Matrix<Item>}
 */
class Factory extends Matrix {
	/**
	* @param {Coordinate} size Matrix dimensions.
	* @param {(value: Case) => Item} modifier A function that transforms case type to matrix type.
	*/
	constructor(size, modifier) {
		super(size);
		this.#modifier = modifier;
	}
	/** @type {(value: Case) => Item} */ #modifier;
	#cases = (/** @type {Map<Case, Number>} */ (new Map()));
	/**
	 * The cases map.
	 * @readonly
	 */
	get cases() {
		return this.#cases;
	}
	/**
	 * A function that fills matrix cells with random variant from cases.
	 * @param {Coordinate} from From which cell to fill.
	 * @param {Coordinate} to To which cell to fill.
	 */
	generate(from = new Coordinate(0, 0), to = new Coordinate(this.size.x, this.size.y)) {
		const start = new Coordinate(Math.min(from.x, to.x), Math.min(from.y, to.y));
		const end = new Coordinate(Math.max(from.x, to.x), Math.max(from.y, to.y));
		for (let y = start.y; y < end.y; y++) {
			for (let x = start.x; x < end.x; x++) {
				const position = new Coordinate(x, y);
				this.set(position, this.#modifier(Random.case(this.#cases)));
			}
		}
	}
}
//#endregion
//#region Board
/**
 * Class that groups all board properties.
 * @extends {Factory<typeof Elemental, Elemental>} 
 */
class Board extends Factory {
	/**
	 * @param {Coordinate} size Matrix dimensions.
	 */
	constructor(size) {
		super(size, (element) => new element());
	}
	/**
	 * A function to set values to a matrix.
	 * @param {Coordinate} position Item position.
	 * @param {Elemental} value The value.
	 */
	set(position, value) {
		value.position = position;
		super.set(position, value);
	}
	/**
	 * Searches elements of given type in given positions.
	 * @template {typeof Elemental} Item
	 * @param {Array<Coordinate>} positions Positions to search.
	 * @param {Item} type Elements type.
	 */
	getElementsOfType(positions, type) {
		const result = [];
		for (const position of positions) {
			const datul = this.get(position);
			if (datul && datul instanceof type) {
				result.push((/** @type {InstanceType<Item>} */ (datul)));
			}
		}
		return result;
	}
	/**
	 * Executes a frame for all elements in board.
	 * @returns A value, indicating, whether the elements have available actions, or not.
	 */
	execute() {
		let moves = false;
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Coordinate(x, y);
				const element = this.get(position);
				if (element && element.execute()) {
					moves = true;
				}
			}
		}
		return moves;
	}
}
//#endregion
//#region Settings
/** @enum {String} */ const CycleType = {
	/** @readonly */ break: `break`,
	/** @readonly */ ask: `ask`,
	/** @readonly */ loop: `loop`,
};
/** 
 * @typedef SettingsNotation
 * @property {String | undefined} theme
 * @property {Boolean | undefined} FPS
 * @property {Number | undefined} FPSLimit
 * @property {Boolean | undefined} counter
 * @property {Boolean | undefined} nullables
 * @property {Number | undefined} size
 * @property {CycleType | undefined} cycle
 */
class Settings {
	static import(/** @type {SettingsNotation} */ object) {
		const value = new Settings();
		if (object.theme !== undefined) value.#theme = object.theme;
		if (object.FPS !== undefined) value.FPS = object.FPS;
		if (object.FPSLimit !== undefined) value.#FPSLimit = object.FPSLimit;
		if (object.counter !== undefined) value.counter = object.counter;
		if (object.nullables !== undefined) value.nullables = object.nullables;
		if (object.size !== undefined) value.#size = object.size;
		if (object.cycle !== undefined) value.cycle = object.cycle;
		return value;
	}
	static export(/** @type {Settings} */ object) {
		const value = (/** @type {SettingsNotation} */ ({}));
		value.theme = object.#theme;
		value.FPS = object.FPS;
		value.FPSLimit = object.#FPSLimit;
		value.counter = object.counter;
		value.nullables = object.nullables;
		value.size = object.#size;
		value.cycle = object.cycle;
		return value;
	}
	/** @type {Array<String>} */ static #themes = [`system`, `light`, `dark`];
	/** @readonly */ static get themes() {
		return Settings.#themes;
	}
	/** @type {Number} */ static #minFPSLimit = 1;
	/** @readonly */ static get minFPSLimit() {
		return this.#minFPSLimit;
	}
	/** @type {Number} */ static #maxFPSLimit = 240;
	/** @readonly */ static get maxFPSLimit() {
		return this.#maxFPSLimit;
	}
	/** @type {Number} */ static #minSize = 20;
	/** @readonly */ static get minSize() {
		return this.#minSize;
	}
	/** @type {Number} */ static #maxSize = 200;
	/** @readonly */ static get maxSize() {
		return this.#maxSize;
	}
	constructor() {
		this.theme = Settings.#themes[0];
		this.FPS = false;
		this.FPSLimit = 60;
		this.counter = false;
		this.nullables = true;
		this.size = 50;
		this.cycle = CycleType.ask;
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
	/** @type {Boolean} */ FPS;
	/** @type {Number} */ #FPSLimit;
	get FPSLimit() {
		return this.#FPSLimit;
	}
	set FPSLimit(value) {
		if (Settings.#minFPSLimit <= value && value <= Settings.#maxFPSLimit) {
			this.#FPSLimit = value;
		} else {
			throw new RangeError(`Value ${value} is out of range. It must be from ${Settings.#minFPSLimit} to ${Settings.#maxFPSLimit} inclusive.`);
		}
	}
	/** @type {Boolean} */ counter;
	/** @type {Boolean} */ nullables;
	/** @type {Number} */ #size;
	get size() {
		return this.#size;
	}
	set size(value) {
		if (Settings.#minSize <= value && value <= Settings.#maxSize) {
			this.#size = value;
		} else {
			throw new RangeError(`Value ${value} is out of range. It must be from ${Settings.#minSize} to ${Settings.#maxSize} inclusive.`);
		}
	}
	/** @type {CycleType} */ cycle;
}
//#endregion
//#region Metadata
const archiveSettings = new Archive(`${Application.developer}\\${Application.title}`, Settings.export(new Settings()));
archiveSettings.change((data) => {
	if (data.theme == `material`) {
		data.theme = Settings.themes[0];
	}
	return data;
});
let settings = Settings.import(archiveSettings.data);
document.documentElement.dataset[`theme`] = settings.theme;
//#endregion
