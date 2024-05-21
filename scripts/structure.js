"use strict";

import { } from "./modules/extensions.js";
import { Random } from "./modules/generators.js";
import { Matrix, Point2D } from "./modules/measures.js";
import { Color } from "./modules/palette.js";
import { } from "./modules/storage.js";
import { } from "./modules/time.js";

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
 * @typedef {Object} UncomposedAbilityEventMap
 * @property {Event} execute
 * 
 * @typedef {EventListener & UncomposedAbilityEventMap} AbilityEventMap
 */

/**
 * Represents an element ability.
 */
class Ability extends EventTarget {
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

	/**
	 * @param {AbilityMetadata} metadata Metadata for the ability.
	 * @param {number} progress The initial progress of the ability.
	 */
	constructor(metadata, progress = 0) {
		super();
		this.#preparation = metadata.preparation;
		this.#progress = progress;
	}
	/**
	 * @template {keyof AbilityEventMap} K
	 * @param {K} type
	 * @param {(this: Ability, ev: AbilityEventMap[K]) => any} listener
	 * @param {boolean | AddEventListenerOptions} options
	 * @returns {void}
	 */
	addEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @template {keyof AbilityEventMap} K
	 * @param {K} type
	 * @param {(this: Ability, ev: AbilityEventMap[K]) => any} listener
	 * @param {boolean | EventListenerOptions} options
	 * @returns {void}
	 */
	removeEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @param {Event} event 
	 * @returns {boolean}
	 */
	dispatchEvent(event) {
		if (event.type === `execute`) {
			let moves = true;
			if (this.#progress < this.#preparation) {
				this.#progress++;
			} else if (super.dispatchEvent(event)) {
				this.#progress = 0;
			} else {
				moves = false;
			}
			return moves;
		} else return super.dispatchEvent(event);
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
 * @property {Event} execute
 * @property {RenderEvent} render
 * 
 * @typedef {EventListener & UncomposedElementalBoardEventMap} ElementalBoardEventMap
 */

/**
 * @typedef {Object} UncomposedElementalEventMap
 * @property {Event} spawn
 * @property {Event} execute
 * 
 * @typedef {EventListener & UncomposedElementalEventMap} ElementalEventMap
 */

/**
 * Base class for all elements in board.
 * @abstract
 */
class Elemental extends EventTarget {
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
	 * @returns {Color}
	 */
	static get color() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the abilities metadata of the element.
	 * @abstract
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		throw new ReferenceError(`Not implemented function`);
	}

	//#region Board
	/**
	 * Represents board for the elements.
	 */
	static Board = class ElementalBoard extends EventTarget {
		/**
		 * @param {Readonly<Point2D>} size The size of the board.
		 */
		constructor(size) {
			super();
			this.#matrix = new Matrix(size, null);
			const matrix = this.#matrix;
			const mapSearch = location.mapSearch;

			this.addEventListener(`generate`, (event) => window.ensure(() => {
				if (this.#cases.size === 0) throw new EvalError(`Unable to generate board. Cases map is empty`);
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						const position = new Point2D(x, y);
						const type = Random.global.case(this.#cases);
						this.spawnElementOfType(position, type);
					}
				}
			}));

			this.addEventListener(`execute`, (event) => window.ensure(() => {
				let moves = false;
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						const position = new Point2D(x, y);
						const element = matrix.get(position);
						if (element !== null && element.dispatchEvent(new Event(`execute`, { cancelable: true }))) {
							moves = true;
						}
					}
				}
				if (!moves) event.preventDefault();
			}));

			const isRender = mapSearch.has(`render`);
			this.addEventListener(`render`, ({ context }) => window.ensure(() => {
				const canvas = context.canvas;
				if (isRender) {
					context.fillStyle = Color.viaRGB(0, 0, 0, 0.1).toString(true);
					context.beginPath();
					context.rect(0, 0, canvas.width, canvas.height);
					context.fill();
				}
				const scale = new Point2D(canvas.width / size.x, canvas.height / size.y);
				/** @type {Map<string, Set<Point2D>>} */
				const blueprint = new Map();
				for (let y = 0; y < size.y; y++) {
					for (let x = 0; x < size.x; x++) {
						const position = new Point2D(x, y);
						const element = this.#getElementAt(position);
						const bluing = element.color.toString(true);
						if (element.#isRepainted) {
							const area = blueprint.get(bluing) ?? (() => new Set())();
							area.add(position);
							blueprint.set(bluing, area);
							element.#isRepainted = false;
						}
					}
				}
				for (const [bluing, area] of blueprint) {
					context.fillStyle = bluing;
					context.beginPath();
					for (const position of area) {
						context.rect(position.x * scale.x, position.y * scale.y, scale.x, scale.y);
					}
					context.fill();
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
		 * @param {Point2D} position 
		 * @returns {boolean}
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 */
		#outOfBounds(position) {
			const { x, y } = position;
			const { x: xSize, y: ySize } = this.#matrix.size;
			if (!Number.isInteger(x)) throw new TypeError(`The x-coordinate of position ${position} must be finite integer number`);
			if (!Number.isInteger(y)) throw new TypeError(`The y-coordinate of position ${position} must be finite integer number`);
			return (0 > x || x >= xSize || 0 > y || y >= ySize);
		}
		/**
		 * @param {Point2D} position 
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
		 * @param {Point2D} position 
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
		 * @param {Point2D} position The position to get the element from.
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
		 * @param {Readonly<Point2D[]>} positions The positions to get the elements from.
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
		 * @param {Readonly<Point2D[]>} positions The positions to get the elements from.
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
		 * @param {Point2D} position The position to spawn the element at.
		 * @param {T} type The type of element to spawn.
		 * @returns {InstanceType<T>} The spawned element.
		 * @throws {TypeError} If the coordinates of the position are not finite integer numbers.
		 * @throws {RangeError} If the coordinates of the position is out of bounds.
		 */
		spawnElementOfType(position, type) {
			const element = Reflect.construct(type, []);
			this.#setElementAt(position, element);
			element.#position = position;
			element.#board = this;
			element.#color = type.color;
			element.dispatchEvent(new Event(`spawn`));
			return (/** @type {InstanceType<T>} */ (element));
		}
		/**
		 * Sets the element at the specified position.
		 * @template {Elemental} T
		 * @param {Point2D} position The position to set the element at.
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
		 * @param {Point2D} position1 The first position.
		 * @param {Point2D} position2 The second position.
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
	};
	//#endregion

	/**
	 * @template {keyof ElementalEventMap} K
	 * @param {K} type
	 * @param {(this: Elemental, ev: ElementalEventMap[K]) => any} listener
	 * @param {boolean | AddEventListenerOptions} options
	 * @returns {void}
	 */
	addEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @template {keyof ElementalEventMap} K
	 * @param {K} type
	 * @param {(this: Elemental, ev: ElementalEventMap[K]) => any} listener
	 * @param {boolean | EventListenerOptions} options
	 * @returns {void}
	 */
	removeEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @param {Event} event 
	 * @returns {boolean}
	 */
	dispatchEvent(event) {
		let result = false;
		if (event.type === `execute`) {
			for (const ability of this.abilities) {
				if (ability.dispatchEvent(new Event(`execute`, { cancelable: true }))) {
					result = true;
				}
			}
		}
		return (super.dispatchEvent(event) && result);
	}
	/** @type {Point2D?} */
	#position = null;
	/**
	 * Gets the position of the element.
	 * @readonly
	 * @returns {Point2D}
	 * @throws {EvalError} If the element has not been spawned yet.
	 */
	get position() {
		if (this.#position === null) throw new EvalError(`Element not spawned yet. Use it after 'spawn' event dispatched`);
		return this.#position;
	}
	/** @type {ElementalBoard?} */
	#board = null;
	/**
	 * Gets the board the element is on.
	 * @readonly
	 * @returns {ElementalBoard}
	 * @throws {EvalError} If the element has not been spawned yet.
	 */
	get board() {
		if (this.#board === null) throw new EvalError(`Element not spawned yet. Use it after 'spawn' event dispatched`);
		return this.#board;
	}
	/** @type {Color?} */
	#color = null;
	/**
	 * Gets the color of the element.
	 * @returns {Color}
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
	 * @param {Color} value
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
}
//#endregion

/**
 * Current board object.
 */
const board = new Elemental.Board(Point2D.repeat(25));

export { RenderEvent, Ability, Elemental, board };