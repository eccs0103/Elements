"use strict";

const { random, round, trunc } = Math;

//#region Engine
/**
 * @typedef UncomposedEngineEventMap
 * @property {Event} start
 * @property {Event} update
 * @property {Event} launch
 * @property {Event} change
 * 
 * @typedef {EventListener & UncomposedEngineEventMap} EngineEventMap
 */

/**
 * Base class for engines.
 * @abstract
 */
class Engine extends EventTarget {
	/**
	 * Gets the launch status of the engine.
	 * @abstract
	 * @returns {boolean}
	 */
	get launched() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Sets the launch status of the engine.
	 * @abstract
	 * @param {boolean} value
	 * @returns {void}
	 */
	set launched(value) {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the FPS limit of the engine.
	 * @abstract
	 * @returns {number}
	 */
	get limit() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Sets the FPS limit of the engine.
	 * @abstract
	 * @param {number} value
	 * @returns {void}
	 */
	set limit(value) {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the Frames Per Second (FPS) of the engine.
	 * @abstract
	 * @returns {number}
	 */
	get FPS() {
		throw new ReferenceError(`Not implemented function`);
	}
	/**
	 * Gets the time delta between frames.
	 * @abstract
	 * @readonly
	 * @returns {number}
	 */
	get delta() {
		throw new ReferenceError(`Not implemented function`);
	}
}
//#endregion
//#region Fast engine
/**
 * @typedef {{}} UncomposedFastEngineEventMap
 * 
 * @typedef {EngineEventMap & UncomposedFastEngineEventMap} FastEngineEventMap
 */

/**
 * Constructs a fast type engine.
 */
class FastEngine extends Engine {
	/**
	 * @param {boolean} launch Whether the engine should be launched initially. Default is false.
	 */
	constructor(launch = false) {
		super();

		const controller = new AbortController();
		this.addEventListener(`update`, (event) => {
			this.dispatchEvent(new Event(`start`));
			controller.abort();
		}, { signal: controller.signal });

		let previous = 0;
		const callback = (/** @type {number} */ current) => {
			const difference = current - previous;
			if (difference > this.#gap) {
				if (this.launched) {
					this.#FPS = (1000 / difference);
					this.dispatchEvent(new Event(`update`));
				} else {
					this.#FPS = 0;
				}
				previous = current;
			}
			requestAnimationFrame(callback);
		};
		requestAnimationFrame(callback);

		this.launched = launch;
	}
	/**
	 * @template {keyof FastEngineEventMap} K
	 * @param {K} type
	 * @param {(this: FastEngine, ev: FastEngineEventMap[K]) => any} listener
	 * @param {boolean | AddEventListenerOptions} options
	 * @returns {void}
	 */
	addEventListener(type, listener, options = false) {
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @template {keyof FastEngineEventMap} K
	 * @param {K} type
	 * @param {(this: FastEngine, ev: FastEngineEventMap[K]) => any} listener
	 * @param {boolean | EventListenerOptions} options
	 * @returns {void}
	 */
	removeEventListener(type, listener, options = false) {
		return super.addEventListener(type, listener, options);
	}
	/** @type {boolean} */
	#launched;
	/**
	 * Gets the launch status of the engine.
	 * @returns {boolean}
	 */
	get launched() {
		return this.#launched;
	}
	/**
	 * Sets the launch status of the engine.
	 * @param {boolean} value 
	 * @returns {void}
	 */
	set launched(value) {
		const previous = this.#launched;
		this.#launched = value;
		if (previous !== value) {
			this.dispatchEvent(new Event(`change`));
		}
		if (value) {
			this.dispatchEvent(new Event(`launch`));
		}
	}
	/** @type {number} */
	#gap = 0;
	/**
	 * Gets the FPS limit of the engine.
	 * @returns {number}
	 */
	get limit() {
		return 1000 / this.#gap;
	}
	/**
	 * Sets the FPS limit of the engine.
	 * @param {number} value 
	 * @returns {void}
	 * @throws {RangeError} If the FPS limit is not higher than 0.
	 */
	set limit(value) {
		if (value <= 0) {
			throw new RangeError(`FPS limit must be higher than 0`);
		}
		this.#gap = 1000 / value;
	}
	/** @type {number} */
	#FPS = 0;
	/**
	 * Gets the current FPS of the engine.
	 * @readonly
	 * @returns {number}
	 */
	get FPS() {
		return this.#FPS;
	}
	/**
	 * Gets the time delta between frames.
	 * @readonly
	 * @returns {number}
	 */
	get delta() {
		return 1 / this.#FPS;
	}
}
//#endregion
//#region Precise engine
/**
 * @typedef {{}} UncomposedPreciseEngineEventMap
 * 
 * @typedef {EngineEventMap & UncomposedPreciseEngineEventMap} PreciseEngineEventMap
 */

/**
 * Constructs a precise type engine.
 */
class PreciseEngine extends Engine {
	/**
	 * @param {boolean} launch Whether the engine should be launched initially. Default is false.
	 */
	constructor(launch = false) {
		super();

		const controller = new AbortController();
		this.addEventListener(`update`, (event) => {
			this.dispatchEvent(new Event(`start`));
			controller.abort();
		}, { signal: controller.signal });

		let previous = performance.now();
		const callback = (/** @type {number} */ current) => {
			const difference = current - previous;
			if (this.launched) {
				this.#FPS = (1000 / difference);
				this.dispatchEvent(new Event(`update`));
			} else {
				this.#FPS = 0;
			}
			previous = current;
			setTimeout(callback, this.#gap, performance.now());
		};
		setTimeout(callback, this.#gap, performance.now());

		this.launched = launch;
	};
	/**
	 * @template {keyof PreciseEngineEventMap} K
	 * @param {K} type
	 * @param {(this: PreciseEngine, ev: PreciseEngineEventMap[K]) => any} listener
	 * @param {boolean | AddEventListenerOptions} options
	 * @returns {void}
	 */
	addEventListener(type, listener, options = false) {
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @template {keyof PreciseEngineEventMap} K
	 * @param {K} type
	 * @param {(this: PreciseEngine, ev: PreciseEngineEventMap[K]) => any} listener
	 * @param {boolean | EventListenerOptions} options
	 * @returns {void}
	 */
	removeEventListener(type, listener, options = false) {
		return super.addEventListener(type, listener, options);
	}
	/** @type {boolean} */
	#launched;
	/**
	 * Gets the launch status of the engine.
	 * @returns {boolean}
	 */
	get launched() {
		return this.#launched;
	}
	/**
	 * Sets the launch status of the engine.
	 * @param {boolean} value 
	 * @returns {void}
	 */
	set launched(value) {
		const previous = this.#launched;
		this.#launched = value;
		if (previous !== value) {
			this.dispatchEvent(new Event(`change`));
		}
		if (value) {
			this.dispatchEvent(new Event(`launch`));
		}
	}
	/** @type {number} */
	#gap = 0;
	/**
	 * Gets the FPS limit of the engine.
	 * @returns {number}
	 */
	get limit() {
		return 1000 / this.#gap;
	}
	/**
	 * Sets the FPS limit of the engine.
	 * @param {number} value 
	 * @returns {void}
	 * @throws {RangeError} If the FPS limit is not higher than 0.
	 */
	set limit(value) {
		if (value <= 0) {
			throw new RangeError(`FPS limit must be higher than 0`);
		}
		this.#gap = 1000 / value;
	}
	/** @type {number} */
	#FPS = 0;
	/**
	 * Gets the current FPS of the engine.
	 * @readonly
	 * @returns {number}
	 */
	get FPS() {
		return this.#FPS;
	}
	/**
	 * Gets the time delta between frames.
	 * @readonly
	 * @returns {number}
	 */
	get delta() {
		return 1 / this.#FPS;
	}
}
//#endregion

//#region Random
/**
 * Random values generator.
 */
class Random {
	/**
	 * Generates a random boolean value.
	 * @returns {boolean} A random boolean value.
	 */
	boolean() {
		return Boolean(round(random()));
	}
	/**
	 * Returns a random number between the specified values.
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @returns {number} A random number.
	 */
	number(min, max) {
		return random() * (max - min) + min;
	}
	/**
	 * Returns a random integer between the specified values.
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @returns {number} A random integer.
	 */
	integer(min, max) {
		return trunc(this.number(min, max));
	}
	/**
	 * Returns a random element from an array.
	 * @template T
	 * @param {T[]} array The array of elements.
	 * @returns {T} A random element.
	 */
	item(array) {
		return array[this.integer(0, array.length)];
	}
	/**
	 * Selects a random element from a list according to their weights.
	 * @template T
	 * @param {Map<T, number>} cases The map with elements and their weights.
	 * @returns {T} A random element.
	 * @throws {RangeError} If the map is empty.
	 */
	case(cases) {
		const summary = [...cases].reduce((previous, [, percentage]) => previous + percentage, 0);
		const random = this.number(0, summary);
		let begin = 0;
		for (const [item, percentage] of cases) {
			const end = begin + percentage;
			if (begin <= random && random < end) {
				return item;
			}
			begin = end;
		}
		throw new RangeError(`Unable to select value. Most likely the map is empty.`);
	}
	/**
	 * Generates a random GUID identifier.
	 * @returns {string} A random GUID identifier.
	 */
	GUID() {
		return `${crypto.randomUUID()}`;
	}
}
//#endregion

export { Engine, FastEngine, PreciseEngine, Random };
