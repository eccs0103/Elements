//#region Vector
/**
 * Class for storing two-dimensional coordinates.
 */
class Vector {
	/**
	 * @param {Number} x The x value.
	 * @param {Number} y The y value.
	 */
	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}
	/** @type {Number} */ #x;
	/**
	 * The x property.
	 * @readonly 
	 */
	get x() {
		return this.#x;
	}
	/** @type {Number} */ #y;
	/**
	 * The y property.
	 * @readonly 
	 */
	get y() {
		return this.#y;
	}
	/**
	 * Converting to a string (x, y) of the form.
	 * @returns The result.
	 */
	toString() {
		return `(${this.#x}, ${this.#y})`;
	}
}
//#endregion
//#region Matrix
/**
 * Class representing two-dimensional matrix.
 * @template Item The type of matrix items.
 */
class Matrix {
	/**
	 * @param {Vector} size Matrix dimensions.
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
	/** @type {Vector} */ #size;
	/**
	 * Matrix dimensions.
	 * @readonly
	*/
	get size() {
		return this.#size;
	}
	/**
	 * A function to get values from a matrix.
	 * @param {Vector} position Item position.
	 * @returns The value.
	 */
	get(position) {
		return this.#data[position.y] ? this.#data[position.y][position.x] : undefined;
	}
	/** @type {Array<Array<Item>>} */ #data;
	/**
	 * A function to set values to a matrix.
	 * @param {Vector} position Item position.
	 * @param {Item} value The value.
	 */
	set(position, value) {
		this.#data[position.y][position.x] = value;
	}
}
//#endregion
//#region Color
/**
 * A class that represents RGB colors.
 */
class Color {
	/**
	 * Instantiating a color via HSV colors.
	 * @param {Number} hue The hue parameter.
	 * @param {Number} saturation The saturation parameter.
	 * @param {Number} value The value parameter.
	 * @returns Color instance.
	 */
	static viaHSV(hue, saturation, value) {
		/**
		 * 
		 * @param {Number} n 
		 * @param {Number} k 
		 * @returns 
		 */
		function f(n, k = (n + hue / 60) % 6) {
			return (value / 100) - (value / 100) * (saturation / 100) * Math.max(Math.min(k, 4 - k, 1), 0);
		};
		return new Color(f(5) * 255, f(3) * 255, f(1) * 255);
	}
	/**
	 * Instance of a white color.
	 * @readonly
	 */
	static get white() {
		return new Color(255, 255, 255);
	}
	/**
	 * Instance of a black color.
	 * @readonly 
	 */
	static get black() {
		return new Color(0, 0, 0);
	}
	/**
	 * @param {Number} red The red parameter.
	 * @param {Number} green The green parameter.
	 * @param {Number} blue The blue parameter.
	 * @param {Number} transparence The transparence parameter.
	 */
	constructor(red, green, blue, transparence = 1) {
		this.#red = red;
		this.#green = green;
		this.#blue = blue;
		this.#transparence = transparence;
	}
	/** @type {Number} */ #red;
	/**
	 * The red property.
	 * @readonly
	 */
	get red() {
		return this.#red;
	}
	/** @type {Number} */ #green;
	/**
	 * The green property.
	 * @readonly
	 */
	get green() {
		return this.#green;
	}
	/** @type {Number} */ #blue;
	/**
	 * The blue property.
	 * @readonly
	 */
	get blue() {
		return this.#blue;
	}
	/** @type {Number} */ #transparence;
	/**
	 * The transparence property.
	 * @readonly
	 */
	get transparence() {
		return this.#transparence;
	}
	/**
	 * Converting to a string rgba(red, green, blue, transparence) of the form.
	 * @returns The result.
	 */
	toString() {
		return `rgba(${this.#red}, ${this.#green}, ${this.#blue}, ${this.#transparence})`;
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
	static color = new Color(0, 0, 0);
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
	 * @type {Vector}
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
	* @param {Vector} size Matrix dimensions.
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
	 * @param {Vector} from From which cell to fill.
	 * @param {Vector} to To which cell to fill.
	 */
	generate(from = new Vector(0, 0), to = new Vector(this.size.x, this.size.y)) {
		const start = new Vector(Math.min(from.x, to.x), Math.min(from.y, to.y));
		const end = new Vector(Math.max(from.x, to.x), Math.max(from.y, to.y));
		for (let y = start.y; y < end.y; y++) {
			for (let x = start.x; x < end.x; x++) {
				const position = new Vector(x, y);
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
	 * @param {Vector} size Matrix dimensions.
	 */
	constructor(size) {
		super(size, (element) => new element());
	}
	/**
	 * A function to set values to a matrix.
	 * @param {Vector} position Item position.
	 * @param {Elemental} value The value.
	 */
	set(position, value) {
		value.position = position;
		super.set(position, value);
	}
	/**
	 * Searches elements of given type in given positions.
	 * @template {typeof Elemental} Item
	 * @param {Array<Vector>} positions Positions to search.
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
				const position = new Vector(x, y);
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
//#region Engine
/**
 * Class that launches the frame execution.
 */
class Engine {
	/**
	 * @param {() => void} handler Function that must be repeated in every frame.
	 * @param {Number} AFPS Absolute frame rate per second. Default rate is 60.
	 * @param {Boolean} launch Launch engine initially? In default, it'll be launched.
	 */
	constructor(handler, AFPS = 60, launch = true) {
		this.#handler = handler;
		this.#AFPS = AFPS;
		this.#handlerIndex = this.#setHandler();
		this.#launch = launch;
	}
	#handler;
	/** @type {Number} */ #handlerIndex;
	/** @type {Number} */ #FPS;
	/**
	 * Count of frames per second.
	 * @readonly
	 */
	get FPS() {
		return this.#FPS;
	}
	#setHandler() {
		let previousFrame = Date.now();
		return setInterval(() => {
			let currentFrame = Date.now();
			this.#FPS = (1000 / (currentFrame - previousFrame));
			previousFrame = currentFrame;
			if (this.#launch) {
				this.#handler();
			}
		}, 1000 / this.#AFPS);
	}
	/** @type {Number} */ #AFPS;
	/**
	 * Count of absolute frames per second. Controls the average value of FPS.
	 */
	get AFPS() {
		return this.#AFPS;
	}
	/**
	 * Count of absolute frames per second. Controls the average value of FPS.
	 */
	set AFPS(value) {
		this.#AFPS = value;
		clearInterval(this.#handlerIndex);
		this.#handlerIndex = this.#setHandler();
	}
	/** @type {Boolean} */ #launch = false;
	/**
	 * Is engine launched?
	 */
	get launch() {
		return this.#launch;
	}
	/**
	 * Is engine launched?
	 */
	set launch(value) {
		this.#launch = value;
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
 * @property {String | undefined} mode
 * @property {String | undefined} theme
 * @property {Boolean | undefined} FPS
 * @property {Number | undefined} AFPS
 * @property {Boolean | undefined} counter
 * @property {Boolean | undefined} nullables
 * @property {Number | undefined} size
 * @property {CycleType | undefined} cycle
 */
class Settings {
	static import(/** @type {SettingsNotation} */ object) {
		const value = new Settings();
		if (object.mode !== undefined) value.#mode = object.mode;
		if (object.theme !== undefined) value.#theme = object.theme;
		if (object.FPS !== undefined) value.FPS = object.FPS;
		if (object.AFPS !== undefined) value.#AFPS = object.AFPS;
		if (object.counter !== undefined) value.counter = object.counter;
		if (object.nullables !== undefined) value.nullables = object.nullables;
		if (object.size !== undefined) value.#size = object.size;
		if (object.cycle !== undefined) value.cycle = object.cycle;
		return value;
	}
	static export(/** @type {Settings} */ object) {
		const value = (/** @type {SettingsNotation} */ ({}));
		value.mode = object.#mode;
		value.theme = object.#theme;
		value.FPS = object.FPS;
		value.AFPS = object.#AFPS;
		value.counter = object.counter;
		value.nullables = object.nullables;
		value.size = object.#size;
		value.cycle = object.cycle;
		return value;
	}
	/** @type {Array<String>} */ static #modes = [`light`, `dark`];
	/** @readonly */ static get modes() {
		return Settings.#modes;
	}
	/** @type {Array<String>} */ static #themes = [`material`];
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
	/** @type {Number} */ static #minSize = 20;
	/** @readonly */ static get minSize() {
		return this.#minSize;
	}
	/** @type {Number} */ static #maxSize = 200;
	/** @readonly */ static get maxSize() {
		return this.#maxSize;
	}
	constructor() {
		this.mode = Settings.#modes[0];
		this.theme = Settings.#themes[0];
		this.FPS = false;
		this.AFPS = 60;
		this.counter = false;
		this.nullables = true;
		this.size = 50;
		this.cycle = CycleType.ask;
	}
	/** @type {String} */ #mode;
	get mode() {
		return this.#mode;
	}
	set mode(value) {
		if (Settings.#modes.includes(value)) {
			this.#mode = value;
		} else {
			throw new Error(`Can't reach ${value} mode in modes list.`);
		}
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
const nameDeveloper = `Adaptive Core`;
const nameProject = `Elements`;
const archiveSettings = new Archive(`${nameDeveloper}\\${nameProject}`, Settings.export(new Settings()));
const locked = false;
//#endregion
