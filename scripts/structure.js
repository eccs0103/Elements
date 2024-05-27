"use strict";

import { } from "./modules/extensions.js";
import { Random } from "./modules/generators.js";
import { Matrix, Point2D } from "./modules/measures.js";
import { Color } from "./modules/palette.js";
import { ArchiveManager } from "./modules/storage.js";
import { } from "./modules/time.js";

const { ceil } = Math;

//#region Render event
/**
 * @typedef {Object} UncomposedRenderEventInit
 * @property {CanvasRenderingContext2D} context
 * 
 * @typedef {EventInit & UncomposedRenderEventInit} RenderEventInit
 */

/**
 * Represents a event for rendering.
 */
class RenderEvent extends Event {
	/**
	 * @param {string} type The type of the event.
	 * @param {RenderEventInit} dict An object containing event initialization properties.
	 */
	constructor(type, dict) {
		super(type, dict);
		this.#context = dict.context;
	}
	/** @type {CanvasRenderingContext2D} */
	#context;
	/**
	 * The context in which the rendering should occur.
	 * @readonly
	 * @returns {CanvasRenderingContext2D}
	 */
	get context() {
		return this.#context;
	}
}
//#endregion
//#region Ability
/**
 * @typedef {InstanceType<Ability.Metadata>} AbilityMetadata
 */

/**
 * @typedef {InstanceType<Ability.Invoker>} AbilityInvoker
 */

/**
 * @callback AbilityAction
 * @param {AbilityInvoker} invoker
 * @returns {void} 
 */

/**
 * Represents an element ability.
 */
class Ability {
	//#region Metadata
	/**
	 * Contains metadata about an ability.
	 */
	static Metadata = class AbilityMetadata {
		/**
		 * @param {string} name The name of the ability.
		 * @param {string} description The description of the ability.
		 * @param {number} preparation The preparation time required for the ability.
		 * @throws {TypeError} If the preparation time is not a finite integer.
		 * @throws {RangeError} If the preparation time is less than or equal to 0.
		 */
		constructor(name, description, preparation) {
			this.#name = name;
			this.#description = description;
			if (!Number.isInteger(preparation)) throw new TypeError(`The preparation ${preparation} must be finite integer number`);
			if (preparation <= 0) new RangeError(`The preparation ${preparation} is out of range (0 - +∞)`);
			this.#preparation = preparation;
		}
		/** @type {string} */
		#name;
		/**
		 * The name of the ability.
		 * @readonly
		 * @returns {string}
		 */
		get name() {
			return this.#name;
		}
		/** @type {string} */
		#description;
		/**
		 * The description of the ability.
		 * @readonly
		 * @returns {string}
		 */
		get description() {
			return this.#description;
		}
		/** @type {number} */
		#preparation;
		/**
		 * The preparation time required for the ability.
		 * @readonly
		 * @returns {number}
		 */
		get preparation() {
			return this.#preparation;
		}
	};
	//#endregion
	//#region Invoker
	/**
	 * Representing an ability invoker.
	 */
	static Invoker = class AbilityInvoker {
		/** @type {boolean[]} */
		#stack = [];
		/**
		 * Creates a new observation.
		 * @returns {void}
		 */
		observe() {
			this.#stack.push(false);
		}
		/**
		 * Marks that changes have occurred to the last observation.
		 * @returns {void}
		 */
		change() {
			for (let index = this.#stack.length - 1; index >= 0; index--) {
				this.#stack[index] = true;
			}
		}
		/**
		 * Summarizes changes of the last observation and removes it.
		 * @returns {boolean} Indicates whether any changes have occurred.
		 * @throws {EvalError} If there are no observable items.
		 */
		summarize() {
			const observation = this.#stack.pop();
			if (observation === undefined) throw new EvalError(`There are no observable items`);
			return observation;
		}
	};
	//#endregion

	/**
	 * @param {AbilityMetadata} metadata Metadata for the ability.
	 * @param {AbilityAction} action Action of the ability.
	 * @param {number} progress The initial progress of the ability.
	 */
	constructor(metadata, action, progress = 0) {
		this.#preparation = metadata.preparation;
		this.#action = action;
		this.#progress = progress;
	}
	/** @type {AbilityAction} */
	#action;
	/**
	 * Executes one frame for the ability.
	 * @param {AbilityInvoker} invoker The invoker that executes the ability.
	 * @returns {void}
	 */
	execute(invoker) {
		if (this.#progress < this.#preparation) {
			this.#progress++;
			invoker.change();
		} else {
			invoker.observe();
			this.#action(invoker);
			if (!invoker.summarize()) return;
			this.#progress = 0;
		}
	}
	/** @type {number} */
	#progress;
	/**
	 * Gets the current progress of the ability.
	 * @returns {number}
	 */
	get progress() {
		return this.#progress;
	}
	/**
	 * Sets the current progress of the ability.
	 * @param {number} value 
	 * @returns {void}
	 * @throws {RangeError} If the progress value is less than 0 or greater than preparation.
	 */
	set progress(value) {
		if (value < 0 || value > this.#preparation) throw new RangeError(`The progress ${value} is out of range [0 - ${this.#preparation})`);
		this.#progress = value;
	}
	/** @type {number} */
	#preparation;
	/**
	 * The preparation time required for the ability.
	 * @readonly
	 * @returns {number}
	 */
	get preparation() {
		return this.#preparation;
	}
}
//#endregion
//#region Elemental
/**
 * @typedef {InstanceType<Elemental.Board>} ElementalBoard
 */

/**
 * @typedef {Object} UncomposedElementalBoardEventMap
 * @property {Event} generate
 * @property {RenderEvent} render
 * @property {RenderEvent} repaint
 * 
 * @typedef {EventListener & UncomposedElementalBoardEventMap} ElementalBoardEventMap
 */

/**
 * Base class for all elements in board.
 * @abstract
 */
class Elemental {
	/**
	 * Gets the name of the element.
	 * @abstract
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the color of the element.
	 * @abstract
	 * @readonly
	 * @returns {Readonly<Color>}
	 */
	static get color() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the abilities metaset of the element.
	 * @abstract
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get metaset() {
		throw new ReferenceError(`Not implemented function`);
	}

	//#region Board
	/**
	 * Represents board for the elements.
	 */
	static Board = class ElementalBoard extends EventTarget {
		/** @type {ElementalBoard?} */
		static #self = null;
		/**
		 * Gets the singleton instance of board.
		 * @readonly
		 * @returns {ElementalBoard}
		 * @throws {EvalError} If board isn't constructed yet.
		 */
		static get self() {
			if (ElementalBoard.#self === null) throw new EvalError(`Board isn't constructed yet`);
			return ElementalBoard.#self;
		}
		/**
		 * @param {Readonly<Point2D>} size The size of the board.
		 * @returns {void}
		 * @throws {EvalError} If board is already constructed.
		 */
		static construct(size) {
			if (this.#self !== null) throw new EvalError(`Board is already constructed`);
			ElementalBoard.#locked = false;
			ElementalBoard.#self = new ElementalBoard(size);
			ElementalBoard.#locked = true;
		}
		/** @type {boolean} */
		static #locked = true;
		/**
		 * @param {Readonly<Point2D>} size The size of the board.
		 * @throws {TypeError} If the constructor is called directly.
		 */
		constructor(size) {
			super();
			if (ElementalBoard.#locked) throw new TypeError(`Illegal constructor`);
			this.#matrix = new Matrix(size, null);
			const mapSearch = location.mapSearch;

			this.addEventListener(`generate`, (event) => window.ensure(() => {
				if (this.#cases.size === 0) throw new EvalError(`Unable to generate board. Cases map is empty`);
				const random = Random.global;
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						this.spawnElementOfType(new Point2D(x, y), random.case(this.#cases));
					}
				}
			}));

			this.addEventListener(`repaint`, ({ context }) => window.ensure(() => {
				const canvas = context.canvas;
				const scale = new Point2D(canvas.width / size.x, canvas.height / size.y);
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						const position = new Point2D(x, y);
						const element = this.#getElementAt(position);
						context.fillStyle = element.color.toString(true);
						context.fillRect(ceil(position.x * scale.x), ceil(position.y * scale.y), ceil(scale.x), ceil(scale.y));
					}
				}
			}));

			if (mapSearch.has(`render`)) {
				this.addEventListener(`render`, ({ context }) => {
					const canvas = context.canvas;
					context.fillStyle = Color.viaRGB(0, 0, 0, 0.1).toString(true);
					context.beginPath();
					context.rect(0, 0, canvas.width, canvas.height);
					context.fill();
				});
			}

			this.addEventListener(`render`, ({ context }) => window.ensure(() => {
				const canvas = context.canvas;
				const scale = new Point2D(canvas.width / size.x, canvas.height / size.y);
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						const position = new Point2D(x, y);
						const element = this.#getElementAt(position);
						if (element.#isRepainted) {
							context.fillStyle = element.color.toString(true);
							context.fillRect(ceil(position.x * scale.x), ceil(position.y * scale.y), ceil(scale.x), ceil(scale.y));
							element.#isRepainted = false;
						}
					}
				}
			}));
		}
		/**
		 * @template {keyof ElementalBoardEventMap} K
		 * @param {K} type
		 * @param {(this: ElementalBoard, ev: ElementalBoardEventMap[K]) => any} listener
		 * @param {boolean | AddEventListenerOptions} options
		 * @returns {void}
		 */
		addEventListener(type, listener, options = false) {
			// @ts-ignore
			return super.addEventListener(type, listener, options);
		}
		/**
		 * @template {keyof ElementalBoardEventMap} K
		 * @param {K} type
		 * @param {(this: ElementalBoard, ev: ElementalBoardEventMap[K]) => any} listener
		 * @param {boolean | EventListenerOptions} options
		 * @returns {void}
		 */
		removeEventListener(type, listener, options = false) {
			// @ts-ignore
			return super.addEventListener(type, listener, options);
		}
		/** @type {Matrix<Elemental?>} */
		#matrix;
		/**
		 * @param {Readonly<Point2D>} position 
		 * @returns {boolean}
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 */
		#outOfBounds(position) {
			const { x, y } = position;
			if (!Number.isInteger(x)) throw new TypeError(`The x-coordinate of position ${position} must be finite integer number`);
			if (!Number.isInteger(y)) throw new TypeError(`The y-coordinate of position ${position} must be finite integer number`);
			const { x: xSize, y: ySize } = this.#matrix.size;
			return (0 > x || x >= xSize || 0 > y || y >= ySize);
		}
		/**
		 * @param {Readonly<Point2D>} position 
		 * @returns {Elemental}
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 * @throws {EvalError} If there is no element at the specified position.
		 */
		#getElementAt(position) {
			const element = this.#matrix.get(position);
			if (element === null) throw new EvalError(`Element at position ${position} is missing`);
			return element;
		}
		/**
		 * @param {Readonly<Point2D>} position 
		 * @param {Elemental} element
		 * @returns {void}
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 */
		#setElementAt(position, element) {
			this.#matrix.set(position, element);
		}
		/**
		 * Method to get the element at the specified position.
		 * @param {Readonly<Point2D>} position The position to get the element from.
		 * @returns {Elemental} The element at the specified position.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 * @throws {EvalError} If there is no element at the specified position.
		 */
		getElementAt(position) {
			return this.#getElementAt(position);
		}
		/**
		 * Gets the elements at the specified positions.
		 * @param {Readonly<Point2D>[]} positions The positions to get the elements from.
		 * @returns {Elemental[]} The elements at the specified positions.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {EvalError} If there is no element at the specified position.
		 */
		getElementsAt(positions) {
			const results = [];
			for (const position of positions) {
				if (this.#outOfBounds(position)) continue;
				results.push(this.#getElementAt(position));
			}
			return results;
		}
		/**
		 * Gets the elements of the specified type at the specified positions.
		 * @template {typeof Elemental} T
		 * @param {Readonly<Point2D>[]} positions The positions to get the elements from.
		 * @param {T} type The type of elements to get.
		 * @returns {InstanceType<T>[]} The elements of the specified type at the specified positions.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {EvalError} If there is no element at the specified position.
		 */
		getElementsOfType(positions, type) {
			const results = [];
			for (const position of positions) {
				if (this.#outOfBounds(position)) continue;
				const element = this.#getElementAt(position);
				if (element instanceof type) {
					results.push(/** @type {InstanceType<T>} */(element));
				}
			}
			return results;
		}
		/**
		 * Spawns an element of the specified type at the specified position.
		 * @template {typeof Elemental} T
		 * @param {Readonly<Point2D>} position The position to spawn the element at.
		 * @param {T} type The type of element to spawn.
		 * @returns {InstanceType<T>} The spawned element.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 */
		spawnElementOfType(position, type) {
			const element = Reflect.construct(type, []);
			this.#setElementAt(position, element);
			element.#position = position;
			element.#color = type.color;
			return (/** @type {InstanceType<T>} */ (element));
		}
		/**
		 * Sets the element at the specified position.
		 * @template {Elemental} T
		 * @param {Readonly<Point2D>} position The position to set the element at.
		 * @param {T} element The element to set.
		 * @returns {T} The set element.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 */
		setElementAt(position, element) {
			this.#setElementAt(position, element);
			element.#position = position;
			return element;
		}
		/**
		 * Swaps the elements at the specified positions.
		 * @param {Readonly<Point2D>} position1 The first position.
		 * @param {Readonly<Point2D>} position2 The second position.
		 * @returns {void}
		 * @throws {TypeError} If the coordinates of the positions are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the positions is out of bounds.
		 * @throws {EvalError} If there is no elements at the specified positions.
		 */
		swapElementsAt(position1, position2) {
			const element1 = this.#getElementAt(position1);
			const element2 = this.#getElementAt(position2);
			this.#setElementAt(position1, element2);
			this.#setElementAt(position2, element1);
		}
		/** @type {Map<typeof Elemental, number>} */
		#cases = new Map();
		/**
		 * The cases map.
		 * @readonly
		 * @returns {Map<typeof Elemental, number>} 
		 */
		get cases() {
			return this.#cases;
		}
		/**
		 * Executes one frame for the board.
		 * @param {AbilityInvoker} invoker The invoker that executes the board.
		 * @returns {void}
		 */
		execute(invoker) {
			const size = this.#matrix.size;
			for (let y = 0; y < size.y; y++) {
				for (let x = 0; x < size.x; x++) {
					const position = new Point2D(x, y);
					const element = this.#matrix.get(position);
					if (element === null) continue;
					element.execute(invoker);
				}
			}
		}
	};
	//#endregion

	/** @type {Readonly<Point2D>?} */
	#position = null;
	/**
	 * Gets the position of the element.
	 * @readonly
	 * @returns {Readonly<Point2D>}
	 * @throws {EvalError} If the element has not been spawned yet.
	 */
	get position() {
		if (this.#position === null) throw new EvalError(`Element not spawned yet. Use it after 'spawn' event dispatched`);
		return this.#position;
	}
	/** @type {Readonly<Color>?} */
	#color = null;
	/**
	 * Gets the color of the element.
	 * @returns {Readonly<Color>}
	 * @throws {EvalError} If the element has not been spawned yet.
	 */
	get color() {
		if (this.#color === null) throw new EvalError(`Element not spawned yet. Use it after 'spawn' event dispatched`);
		return this.#color;
	}
	/** @type {boolean} */
	#isRepainted = true;
	/**
	 * Sets the color of the element.
	 * @param {Readonly<Color>} value
	 * @returns {void}
	 */
	set color(value) {
		if (this.color.toString(true) === value.toString(true)) return;
		this.#color = value;
		this.#isRepainted = true;
	}
	/**
	 * Gets the abilities of the element.
	 * @abstract
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 * @throws {ReferenceError} If the method is not implemented.
	 */
	get abilities() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Executes one frame for the element.
	 * @param {AbilityInvoker} invoker The invoker that executes the element.
	 * @returns {void}
	 */
	execute(invoker) {
		for (const ability of this.abilities) {
			ability.execute(invoker);
		}
	}
}
//#endregion
//#region Settings
/**
 * @enum {string}
 */
const CycleTypes = {
	/** @readonly */ terminate: `terminate`,
	/** @readonly */ ask: `ask`,
	/** @readonly */ repeat: `repeat`,
};
Object.freeze(CycleTypes);

/** 
 * @typedef SettingsNotation
 * @property {string} [colorScheme]
 * @property {number} [boardSize]
 * @property {CycleTypes} [cycleType]
 * @property {number} [FPSLimit]
 * @property {boolean} [showFPS]
 * @property {boolean} [showCounter]
 * @property {boolean} [showNullables]
 */

class Settings {
	/**
	 * @param {unknown} source 
	 * @returns {Settings}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const destination = new Settings();
			destination.colorScheme = String.import(shell[`colorScheme`], `property colorScheme`);
			destination.boardSize = Number.import(shell[`boardSize`], `property boardSize`);
			destination.cycleType = String.import(shell[`cycleType`], `property cycleType`);
			destination.FPSLimit = Number.import(shell[`FPSLimit`], `property FPSLimit`);
			destination.showFPS = Boolean.import(shell[`showFPS`], `property showFPS`);
			destination.showCounter = Boolean.import(shell[`showCounter`], `property showCounter`);
			destination.showNullables = Boolean.import(shell[`showNullables`], `property showNullables`);
			return destination;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due its ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {SettingsNotation}
	 */
	export() {
		return {
			colorScheme: this.#colorScheme,
			boardSize: this.#boardSize,
			cycleType: this.#cycleType,
			FPSLimit: this.#FPSLimit,
			showFPS: this.#showFPS,
			showCounter: this.#showCounter,
			showNullables: this.#showNullables,
		};
	}
	/** @type {string[]} */
	static #colorSchemes = [`system`, `light`, `dark`];
	/**
	 * Gets the available color schemes.
	 * @readonly
	 * @returns {string[]}
	 */
	static get colorSchemes() {
		return Settings.#colorSchemes;
	}
	/** @type {number} */
	static #minBoardSize = 20;
	/**
	 * Gets the minimum board size.
	 * @readonly
	 * @returns {number}
	 */
	static get minBoardSize() {
		return Settings.#minBoardSize;
	}
	/** @type {number} */
	static #maxBoardSize = 200;
	/**
	 * Gets the maximum board size.
	 * @readonly
	 * @returns {number}
	 */
	static get maxBoardSize() {
		return Settings.#maxBoardSize;
	}
	/** @type {number} */
	static #minFPSLimit = 1;
	/**
	 * Gets the minimum FPS limit.
	 * @readonly
	 * @returns {number}
	 */
	static get minFPSLimit() {
		return Settings.#minFPSLimit;
	}
	/** @type {number} */
	static #maxFPSLimit = 240;
	/**
	 * Gets the maximum FPS limit.
	 * @readonly
	 * @returns {number}
	 */
	static get maxFPSLimit() {
		return Settings.#maxFPSLimit;
	}
	/** @type {string} */
	#colorScheme = Settings.#colorSchemes[0];
	/**
	 * Gets the current color scheme.
	 * @returns {string}
	 */
	get colorScheme() {
		return this.#colorScheme;
	}
	/**
	 * Sets the color scheme.
	 * @param {string} value 
	 * @returns {void}
	 * @throws {TypeError} If the color scheme is invalid.
	 */
	set colorScheme(value) {
		if (!Settings.#colorSchemes.includes(value)) throw new TypeError(`Invalid '${value}' color scheme type`);
		this.#colorScheme = value;
	}
	/** @type {number} */
	#boardSize = 50;
	/**
	 * Gets the current board size.
	 * @returns {number}
	 */
	get boardSize() {
		return this.#boardSize;
	}
	/**
	 * Sets the board size.
	 * @param {number} value 
	 * @returns {void}
	 * @throws {TypeError} If the value is not a finite integer.
	 * @throws {RangeError} If the board size is out of range.
	 */
	set boardSize(value) {
		if (!Number.isInteger(value)) throw new TypeError(`The board size ${value} must be finite integer number`);
		if (Settings.#minBoardSize > value || value > Settings.#maxBoardSize) throw new RangeError(`Board ${value} size is out of range [${Settings.#minBoardSize} - ${Settings.#maxBoardSize}]`);
		this.#boardSize = value;
	}
	/** @type {CycleTypes} */
	#cycleType = CycleTypes.ask;
	/**
	 * Gets the current cycle type.
	 * @returns {CycleTypes}
	 */
	get cycleType() {
		return this.#cycleType;
	}
	/**
	 * Sets the cycle type.
	 * @param {CycleTypes} value 
	 * @returns {void}
	 * @throws {TypeError} Iif the cycle type is invalid.
	 */
	set cycleType(value) {
		if (!Object.values(CycleTypes).includes(value)) throw new TypeError(`Invalid '${value}' cycle type type`);
		this.#cycleType = value;
	}
	/** @type {number} */
	#FPSLimit = 60;
	/**
	 * Gets the current FPS limit.
	 * @returns {number}
	 */
	get FPSLimit() {
		return this.#FPSLimit;
	}
	/**
	 * Sets the FPS limit.
	 * @param {number} value 
	 * @returns {void}
	 * @throws {TypeError} If the value is not a finite integer.
	 * @throws {RangeError} If the FPS limit is out of range.
	 */
	set FPSLimit(value) {
		if (!Number.isInteger(value)) throw new TypeError(`The FPS limit ${value} must be finite integer number`);
		if (Settings.#minFPSLimit > value || value > Settings.#maxFPSLimit) throw new RangeError(`FPS ${value} limit is out of range [${Settings.#minFPSLimit} - ${Settings.#maxFPSLimit}]`);
		this.#FPSLimit = value;
	}
	/** @type {boolean} */
	#showFPS = false;
	/**
	 * Gets whether the FPS is shown.
	 * @returns {boolean}
	 */
	get showFPS() {
		return this.#showFPS;
	}
	/**
	 * Sets whether to show the FPS.
	 * @param {boolean} value 
	 * @returns {void}
	 */
	set showFPS(value) {
		this.#showFPS = value;
	}
	/** @type {boolean} */
	#showCounter = false;
	/**
	 * Gets whether the counter is shown.
	 * @returns {boolean}
	 */
	get showCounter() {
		return this.#showCounter;
	}
	/**
	 * Sets whether to show the counter.
	 * @param {boolean} value 
	 * @returns {void}
	 */
	set showCounter(value) {
		this.#showCounter = value;
	}
	/** @type {boolean} */
	#showNullables = true;
	/**
	 * Gets whether nullables are shown.
	 * @returns {boolean}
	 */
	get showNullables() {
		return this.#showNullables;
	}
	/**
	 * Sets whether to show nullables.
	 * @param {boolean} value 
	 * @returns {void}
	 */
	set showNullables(value) {
		this.#showNullables = value;
	}
}
//#endregion

const settings = (await ArchiveManager.construct(`${navigator.dataPath}.Elements`, Settings)).data;
Elemental.Board.construct(Point2D.repeat(settings.boardSize));

export { RenderEvent, Ability, Elemental, CycleTypes, Settings };