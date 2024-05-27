/// <reference path="./declarations.d.ts" />

"use strict";

//#region Number
/**
 * Imports a number from a source.
 * @param {unknown} source The source value to import.
 * @param {string} name The name of the source value.
 * @returns {number} The imported number value.
 * @throws {ReferenceError} If the source is undefined.
 * @throws {TypeError} If the source is not a number.
 */
Number.import = function (source, name = `source`) {
	if (source === undefined) {
		throw new ReferenceError(`${name.replace(/^\w/, part => part.toUpperCase())} is not defined`);
	}
	if (typeof (source) !== `number`) {
		throw new TypeError(`Unable to import ${(name)} due its ${typename(source)} type`);
	}
	return source.valueOf();
};

/**
 * Exports the number value.
 * @returns {number} The exported number value.
 */
Number.prototype.export = function () {
	return this.valueOf();
};

/**
 * Interpolates the number from one range to another.
 * @param {number} min1 The minimum value of the original range.
 * @param {number} max1 The maximum value of the original range.
 * @param {number} min2 The minimum value of the target range.
 * @param {number} max2 The maximum value of the target range.
 * @returns {number} The interpolated value within the target range.
 * @throws {EvalError} If the minimum and maximum values of either range are equal.
 */
Number.prototype.interpolate = function (min1, max1, min2 = 0, max2 = 1) {
	if (min1 === max1) throw new EvalError(`Minimum and maximum of the original range cant be equal`);
	if (min2 === max2) throw new EvalError(`Minimum and maximum of the target range cant be equal`);
	return min2 + (max2 - min2) * ((this.valueOf() - min1) / (max1 - min1));
};
//#endregion
//#region Boolean
/**
 * Imports a boolean value from a source.
 * @param {unknown} source The source value to import.
 * @param {string} name The name of the source value.
 * @returns {boolean} The imported boolean value.
 * @throws {ReferenceError} If the source is undefined.
 * @throws {TypeError} If the source is not a boolean.
 */
Boolean.import = function (source, name = `source`) {
	if (source === undefined) {
		throw new ReferenceError(`${name.replace(/^\w/, part => part.toUpperCase())} is not defined`);
	}
	if (typeof (source) !== `boolean`) {
		throw new TypeError(`Unable to import ${(name)} due its ${typename(source)} type`);
	}
	return source.valueOf();
};

/**
 * Exports the boolean value.
 * @returns {boolean} The exported boolean value.
 */
Boolean.prototype.export = function () {
	return this.valueOf();
};
//#endregion
//#region String
/**
 * Imports a string from a source.
 * @param {unknown} source The source value to import.
 * @param {string} name The name of the source value.
 * @returns {string} The imported string value.
 * @throws {ReferenceError} If the source is undefined.
 * @throws {TypeError} If the source is not a string.
 */
String.import = function (source, name = `source`) {
	if (source === undefined) {
		throw new ReferenceError(`${name.replace(/^\w/, part => part.toUpperCase())} is not defined`);
	}
	if (typeof (source) !== `string`) {
		throw new TypeError(`Unable to import ${(name)} due its ${typename(source)} type`);
	}
	return source.valueOf();
};

/**
 * Checks if a string is empty.
 * @param {string} text The string to check.
 * @returns {boolean} True if the string is empty, otherwise false.
 */
String.isEmpty = function (text) {
	return (text.length === 0);
};

/**
 * Exports the string value.
 * @returns {string} The exported string value.
 */
String.prototype.export = function () {
	return this.valueOf();
};

/**
 * Replaces the string with another if it's empty.
 * @param {string} text The replacement text.
 * @returns {string} The original string if not empty, otherwise the replacement text.
 */
String.prototype.replaceVoid = function (text) {
	return (this.length > 0 ? this.valueOf() : text);
};
//#endregion
//#region Function
/**
 * Abstract method for importing.
 * @abstract
 * @param {unknown} source The source to import.
 * @param {string} name The name of the source.
 * @returns {any} The imported value.
 * @throws {ReferenceError} If not implemented.
 */
Function.prototype.import = function (source, name = `source`) {
	throw new ReferenceError(`Not implemented function`);
};

/**
 * Abstract method for exporting.
 * @abstract
 * @returns {any} The exported value.
 * @throws {ReferenceError} If not implemented.
 */
Function.prototype.export = function () {
	throw new ReferenceError(`Not implemented function`);
};
//#endregion
//#region Object
/**
 * Maps a non-null value using a callback function.
 * @template T
 * @template U
 * @param {NonNullable<T>?} value The value to map.
 * @param {(object: NonNullable<T>) => U} callback The callback function.
 * @returns {U?} The result of the callback or null if the value is null.
 */
Object.map = function (value, callback) {
	if (value === null) return value;
	else return callback(value);
};

/**
 * Imports an object from a source.
 * @param {unknown} source The source to import from.
 * @param {string} name The name of the source.
 * @returns {Object} The imported object.
 * @throws {ReferenceError} Throws a ReferenceError if the source is undefined.
 * @throws {TypeError} Throws a TypeError if the source is not an object or null.
 */
Object.import = function (source, name = `source`) {
	if (source === undefined) {
		throw new ReferenceError(`${name.replace(/^\w/, part => part.toUpperCase())} is not defined`);
	}
	if (typeof (source) !== `object`) {
		throw new TypeError(`Unable to import ${(name)} due its ${typename(source)} type`);
	}
	if (source === null) {
		throw new TypeError(`Unable to import ${(name)} due its ${typename(null)} type`);
	}
	return source.valueOf();
};

/**
 * Exports the object.
 * @returns {Object} The exported object.
 */
Object.prototype.export = function () {
	return this.valueOf();
};
//#endregion
//#region Array
/**
 * Imports an array from a source.
 * @param {unknown} source The source to import from.
 * @param {string} name The name of the source.
 * @returns {any[]} The imported array.
 * @throws {ReferenceError} Throws a ReferenceError if the source is undefined.
 * @throws {TypeError} Throws a TypeError if the source is not an array.
 */
Array.import = function (source, name = `source`) {
	if (source === undefined) {
		throw new ReferenceError(`${name.replace(/^\w/, part => part.toUpperCase())} is not defined`);
	}
	if (!(source instanceof Array)) {
		throw new TypeError(`Unable to import ${name} due its ${typename(source)} type`);
	}
	return Array.from(source);
};

/**
 * Exports the array.
 * @returns {this[]} The exported array.
 */
Array.prototype.export = function () {
	return Array.from(this);
};
//#endregion
//#region Stack
/**
 * Represents a stack data structure.
 * @template T The type of elements in the stack.
 */
class Stack {
	/**
	 * @param {T[]} items The initial items to add to the stack.
	 */
	constructor(...items) {
		this.#array = items;
	}
	/** @type {T[]} */
	#array;
	/**
	 * Pushes an item onto the top of the stack.
	 * @param {T} item The item to push onto the stack.
	 * @returns {void}
	 */
	push(item) {
		this.#array.push(item);
	}
	/**
	 * Returns the item at the top of the stack without removing it.
	 * @readonly
	 * @returns {T} The item at the top of the stack.
	 * @throws {EvalError} If the stack is empty.
	 */
	get peek() {
		const value = this.#array.at(-1);
		if (value === undefined) throw new EvalError(`Stack is empty`);
		return value;
	}
	/**
	 * Removes and returns the item at the top of the stack.
	 * @returns {T} The item that was removed from the top of the stack.
	 * @throws {EvalError} If the stack is empty.
	 */
	pop() {
		const value = this.#array.pop();
		if (value === undefined) throw new EvalError(`Stack is empty`);
		return value;
	}
	/**
	 * Removes all items from the stack.
	 * @returns {T[]} An array containing the removed items.
	 */
	clear() {
		return this.#array.splice(0, this.#array.length);
	}
	/**
	 * Gets the number of items in the stack.
	 * @readonly
	 * @returns {number} The number of items in the stack.
	 */
	get size() {
		return this.#array.length;
	}
	/**
	 * Returns an iterator that yields the keys of the stack.
	 * @returns {IterableIterator<number>} An iterator for the keys of the stack.
	 */
	keys() {
		return this.#array.keys();
	}
	/**
	 * Returns an iterator that yields the values of the stack.
	 * @returns {IterableIterator<T>} An iterator for the values of the stack.
	 */
	values() {
		return this.#array.values();
	}
	/**
	 * Returns an iterator that yields the entries [index, value] of the stack.
	 * @returns {IterableIterator<[number, T]>} An iterator for the entries of the stack.
	 */
	entries() {
		return this.#array.entries();
	}
	/**
	 * Returns an iterator that yields the values of the stack.
	 * @returns {IterableIterator<T>} An iterator for the values of the stack.
	 */
	*[Symbol.iterator]() {
		for (const item of this.#array) {
			yield item;
		}
	}
}
//#endregion
//#region Queue
/**
 * Represents a queue data structure.
 * @template T The type of elements in the queue.
 */
class Queue {
	/**
	 * @param {T[]} items The initial items to add to the queue.
	 */
	constructor(...items) {
		this.#array = items;
	}
	/** @type {T[]} */
	#array;
	/**
	 * Adds an item to the end of the queue.
	 * @param {T} item The item to add to the queue.
	 * @returns {void}
	 */
	push(item) {
		this.#array.push(item);
	}
	/**
	 * Returns the item at the front of the queue without removing it.
	 * @readonly
	 * @returns {T} The item at the front of the queue.
	 * @throws {EvalError} If the queue is empty.
	 */
	get peek() {
		const value = this.#array.at(0);
		if (value === undefined) throw new EvalError(`Queue is empty`);
		return value;
	}
	/**
	 * Removes and returns the item at the front of the queue.
	 * @returns {T} The item that was removed from the front of the queue.
	 * @throws {EvalError} If the queue is empty.
	 */
	shift() {
		const value = this.#array.shift();
		if (value === undefined) throw new EvalError(`Queue is empty`);
		return value;
	}
	/**
	 * Removes all items from the queue.
	 * @returns {T[]} An array containing the removed items.
	 */
	clear() {
		return this.#array.splice(0, this.#array.length);
	}
	/**
	 * Gets the number of items in the queue.
	 * @readonly
	 * @returns {number} The number of items in the queue.
	 */
	get size() {
		return this.#array.length;
	}
	/**
	 * Returns an iterator that yields the keys of the queue.
	 * @returns {IterableIterator<number>} An iterator for the keys of the queue.
	 */
	keys() {
		return this.#array.keys();
	}
	/**
	 * Returns an iterator that yields the values of the queue.
	 * @returns {IterableIterator<T>} An iterator for the values of the queue.
	 */
	values() {
		return this.#array.values();
	}
	/**
	 * Returns an iterator that yields the entries [index, value] of the queue.
	 * @returns {IterableIterator<[number, T]>} An iterator for the entries of the queue.
	 */
	entries() {
		return this.#array.entries();
	}
	/**
	 * Returns an iterator that yields the values of the queue.
	 * @returns {IterableIterator<T>} An iterator for the values of the queue.
	 */
	*[Symbol.iterator]() {
		for (const item of this.#array) {
			yield item;
		}
	}
}
//#endregion
//#region Data pair
/**
 * Represents a key-value pair of data.
 * @template K The type of the key.
 * @template V The type of the value.
 */
class DataPair {
	/**
	 * Creates a DataPair instance from an array containing a key-value pair.
	 * @template K The type of the key.
	 * @template V The type of the value.
	 * @param {Readonly<[NonNullable<K>, V]>} source The source array containing the key-value pair.
	 * @returns {DataPair<K, V>} A new DataPair instance.
	 */
	static fromArray(source) {
		const [key, value] = source;
		return new DataPair(key, value);
	}
	/**
	 * Converts the DataPair instance to an array containing the key-value pair.
	 * @returns {[NonNullable<K>, V]} The key-value pair as an array.
	 */
	toArray() {
		return [this.#key, this.#value];
	}
	/**
	 * @param {NonNullable<K>} key The key of the data pair.
	 * @param {V} value The value of the data pair.
	 */
	constructor(key, value) {
		this.#key = key;
		this.#value = value;
	}
	/** @type {NonNullable<K>} */
	#key;
	/**
	 * Gets the key of the data pair.
	 * @readonly
	 * @returns {NonNullable<K>} The key of the data pair.
	 */
	get key() {
		return this.#key;
	}
	/** @type {V} */
	#value;
	/**
	 * Gets the value of the data pair.
	 * @returns {V} The value of the data pair.
	 */
	get value() {
		return this.#value;
	}
	/**
	 * Sets the value of the data pair.
	 * @param {V} value The new value of the data pair.
	 * @returns {void}
	 */
	set value(value) {
		this.#value = value;
	}
}
//#endregion
//#region Strict map
/**
 * Represents a strict map data structure.
 * @template K The type of keys in the map.
 * @template V The type of values in the map.
 */
class StrictMap {
	/**
	 * @param {Readonly<[NonNullable<K>, V]>[]} items The initial key-value pairs to add to the map.
	 */
	constructor(...items) {
		this.#map = new Map(items);
	}
	/** @type {Map<NonNullable<K>, V>} */
	#map;
	/**
	 * Gets the value associated with the specified key.
	 * @param {NonNullable<K>} key The key to look up in the map.
	 * @returns {V} The value associated with the specified key.
	 * @throws {EvalError} If the key is missing in the map.
	 */
	get(key) {
		const value = this.#map.get(key);
		if (value === undefined) throw new EvalError(`Value for key '${key}' is missing`);
		return value;
	}
	/**
	 * Gets the value associated with the specified key, or null if the key is missing.
	 * @param {NonNullable<K>} key The key to look up in the map.
	 * @returns {V | null} The value associated with the specified key, or null if the key is missing.
	 */
	ask(key) {
		const value = this.#map.get(key);
		return (value === undefined ? null : value);
	}
	/**
	 * Adds a new key-value pair to the map.
	 * @param {NonNullable<K>} key The key to add to the map.
	 * @param {V} value The value associated with the key.
	 * @returns {void}
	 * @throws {EvalError} If the key already exists in the map.
	 */
	add(key, value) {
		if (this.#map.has(key)) throw new EvalError(`Value for key '${key}' already exists`);
		this.#map.set(key, value);
	}
	/**
	 * Sets the value associated with the specified key.
	 * @param {NonNullable<K>} key The key to set the value for.
	 * @param {V} value The new value associated with the key.
	 * @returns {void}
	 */
	set(key, value) {
		this.#map.set(key, value);
	}
	/**
	 * Checks whether the map contains the specified key.
	 * @param {NonNullable<K>} key The key to check for in the map.
	 * @returns {boolean} true if the map contains the key, otherwise false.
	 */
	has(key) {
		return this.#map.has(key);
	}
	/**
	 * Deletes the key-value pair associated with the specified key from the map.
	 * @param {NonNullable<K>} key The key to delete from the map.
	 * @returns {void}
	 * @throws {EvalError} If the key is missing in the map.
	 */
	delete(key) {
		if (!this.#map.delete(key)) throw new EvalError(`Value for key '${key}' is missing`);
	}
	/**
	 * Removes all key-value pairs from the map.
	 * @returns {void}
	 */
	clear() {
		this.#map.clear();
	}
	/**
	 * Gets the number of key-value pairs in the map.
	 * @readonly
	 * @returns {number} The number of key-value pairs in the map.
	 */
	get size() {
		return this.#map.size;
	}
	/**
	 * Returns an iterator that yields the keys of the map.
	 * @returns {IterableIterator<NonNullable<K>>} An iterator for the keys of the map.
	 */
	keys() {
		return this.#map.keys();
	}
	/**
	 * Returns an iterator that yields the values of the map.
	 * @returns {IterableIterator<V>} An iterator for the values of the map.
	 */
	values() {
		return this.#map.values();
	}
	/**
	 * Returns an iterator that yields the key-value pairs of the map.
	 * @returns {IterableIterator<[NonNullable<K>, V]>} An iterator for the entries of the map.
	 */
	entries() {
		return this.#map.entries();
	}
	/**
	 * Returns an iterator that yields the key-value pairs of the map.
	 * @returns {IterableIterator<[NonNullable<K>, V]>} An iterator for the entries of the map.
	 */
	*[Symbol.iterator]() {
		for (const item of this.#map) {
			yield item;
		}
	}
}
//#endregion
//#region Math
/**
 * Calculates the square of a number.
 * @param {number} x The number to square.
 * @returns {number} The square of the input number.
 */
Math.sqpw = function (x) {
	return x * x;
};

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} value The value to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} The clamped value.
 */
Math.between = function (value, min, max) {
	return Math.min(Math.max(min, value), max);
};

const toDegreeFactor = 180 / Math.PI;
/**
 * Converts radians to degrees.
 * @param {number} radians The angle in radians.
 * @returns {number} The angle in degrees.
 */
Math.toDegrees = function (radians) {
	return radians * toDegreeFactor;
};

const toRadianFactor = Math.PI / 180;
/**
 * Converts degrees to radians.
 * @param {number} degrees The angle in degrees.
 * @returns {number} The angle in radians.
 */
Math.toRadians = function (degrees) {
	return degrees * toRadianFactor;
};
//#endregion
//#region Promise
/**
 * Creates a promise that fulfills with the result of calling the provided action.
 * @template T
 * @param {() => T | PromiseLike<T>} action The action to execute.
 * @returns {Promise<T>} A promise that fulfills with the result of the action.
 */
Promise.fulfill = function (action) {
	return new Promise((resolve, reject) => {
		try {
			resolve(action());
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * Creates a promise that can be controlled with an abort signal.
 * @template T
 * @param {(signal: AbortSignal, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void} callback The callback to execute with an abort signal, resolve, and reject functions.
 * @returns {Promise<T>} A promise that can be controlled with an abort signal.
 */
Promise.withSignal = function (callback) {
	const abortController = new AbortController();
	const promise = new Promise((resolve, reject) => {
		callback(abortController.signal, resolve, reject);
	});
	promise.finally(() => {
		abortController.abort();
	});
	return promise;
};
//#endregion
//#region Error
/**
 * Generates an Error object from the provided input.
 * @param {any} error The error input.
 * @returns {Error} An Error object representing the input.
 */
Error.generate = function (error) {
	return error instanceof Error ? error : new Error(`Undefined error type`);
};

/**
 * Returns a string representation of the Error object.
 * @returns {string} A string representation of the Error object.
 */
Error.prototype.toString = function () {
	let text = this.stack ?? `${this.name}: ${this.message}`;
	if (this.cause !== undefined) {
		text += ` cause of:\n\r${Error.generate(this.cause)}`;
	}
	return text;
};
//#endregion

//#region Parent node
/**
 * Retrieves an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @returns {InstanceType<T>} The element instance.
 * @throws {TypeError} If the element is missing or has an invalid type.
 */
Element.prototype.getElement = function (type, selectors) {
	const element = this.querySelector(selectors);
	if (element instanceof type) {
		return (/** @type {InstanceType<T>} */ (element));
	} else throw new TypeError(`Element ${selectors} is missing or has invalid type`);
};

/**
 * Tries to retrieve an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @param {boolean} strict Whether to reject if the element is missing or has an invalid type.
 * @returns {Promise<InstanceType<T>>} A promise that resolves to the element instance.
 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
 */
Element.prototype.tryGetElement = function (type, selectors, strict = false) {
	return new Promise((resolve, reject) => {
		const element = this.querySelector(selectors);
		if (element instanceof type) {
			resolve(/** @type {InstanceType<T>} */(element));
		} else if (strict) {
			reject(new TypeError(`Element ${selectors} is missing or has invalid type`));
		}
	});
};

/**
 * Retrieves elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @returns {NodeListOf<InstanceType<T>>} The NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type.
 */
Element.prototype.getElements = function (type, selectors) {
	const elements = this.querySelectorAll(selectors);
	if (Array.from(elements).every(element => element instanceof type)) {
		return (/** @type {NodeListOf<InstanceType<T>>} */ (elements));
	} else throw new TypeError(`Element ${selectors} is missing or has invalid type`);
};

/**
 * Tries to retrieve elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @param {boolean} strict Whether to reject if any element is missing or has an invalid type.
 * @returns {Promise<NodeListOf<InstanceType<T>>>} A promise that resolves to the NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
 */
Element.prototype.tryGetElements = function (type, selectors, strict = false) {
	return new Promise((resolve, reject) => {
		const elements = this.querySelectorAll(selectors);
		if (Array.from(elements).every(element => element instanceof type)) {
			resolve(/** @type {NodeListOf<InstanceType<T>>} */(elements));
		} else if (strict) {
			reject(new TypeError(`Element ${selectors} is missing or has invalid type`));
		}
	});
};

/**
 * Retrieves an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @returns {InstanceType<T>} The element instance.
 * @throws {TypeError} If the element is missing or has an invalid type.
 */
Document.prototype.getElement = function (type, selectors) {
	return this.documentElement.getElement(type, selectors);
};

/**
 * Tries to retrieve an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @param {boolean} strict Whether to reject if the element is missing or has an invalid type.
 * @returns {Promise<InstanceType<T>>} A promise that resolves to the element instance.
 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
 */
Document.prototype.tryGetElement = function (type, selectors, strict = false) {
	return this.documentElement.tryGetElement(type, selectors, strict);
};

/**
 * Retrieves elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @returns {NodeListOf<InstanceType<T>>} The NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type.
 */
Document.prototype.getElements = function (type, selectors) {
	return this.documentElement.getElements(type, selectors);
};

/**
 * Tries to retrieve elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @param {boolean} strict Whether to reject if any element is missing or has an invalid type.
 * @returns {Promise<NodeListOf<InstanceType<T>>>} A promise that resolves to the NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
 */
Document.prototype.tryGetElements = function (type, selectors, strict = false) {
	return this.documentElement.tryGetElements(type, selectors, strict);
};

/**
 * Retrieves an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @returns {InstanceType<T>} The element instance.
 * @throws {TypeError} If the element is missing or has an invalid type.
 */
DocumentFragment.prototype.getElement = function (type, selectors) {
	const element = this.querySelector(selectors);
	if (element instanceof type) {
		return (/** @type {InstanceType<T>} */ (element));
	} else throw new TypeError(`Element ${selectors} is missing or has invalid type`);
};

/**
 * Tries to retrieve an element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @param {boolean} strict Whether to reject if the element is missing or has an invalid type.
 * @returns {Promise<InstanceType<T>>} A promise that resolves to the element instance.
 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
 */
DocumentFragment.prototype.tryGetElement = function (type, selectors, strict = false) {
	return new Promise((resolve, reject) => {
		const element = this.querySelector(selectors);
		if (element instanceof type) {
			resolve(/** @type {InstanceType<T>} */(element));
		} else if (strict) {
			reject(new TypeError(`Element ${selectors} is missing or has invalid type`));
		}
	});
};

/**
 * Retrieves elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @returns {NodeListOf<InstanceType<T>>} The NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type.
 */
DocumentFragment.prototype.getElements = function (type, selectors) {
	const elements = this.querySelectorAll(selectors);
	if (Array.from(elements).every(element => element instanceof type)) {
		return (/** @type {NodeListOf<InstanceType<T>>} */ (elements));
	} else throw new TypeError(`Element ${selectors} is missing or has invalid type`);
};

/**
 * Tries to retrieve elements of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of elements to retrieve.
 * @param {string} selectors The selectors to search for the elements.
 * @param {boolean} strict Whether to reject if any element is missing or has an invalid type.
 * @returns {Promise<NodeListOf<InstanceType<T>>>} A promise that resolves to the NodeList of element instances.
 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
 */
DocumentFragment.prototype.tryGetElements = function (type, selectors, strict = false) {
	return new Promise((resolve, reject) => {
		const elements = this.querySelectorAll(selectors);
		if (Array.from(elements).every(element => element instanceof type)) {
			resolve(/** @type {NodeListOf<InstanceType<T>>} */(elements));
		} else if (strict) {
			reject(new TypeError(`Element ${selectors} is missing or has invalid type`));
		}
	});
};
//#endregion
//#region Element
/**
 * Retrieves the closest ancestor element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @returns {InstanceType<T>} The element instance.
 * @throws {TypeError} If the element is missing or has an invalid type.
 */
Element.prototype.getClosest = function (type, selectors) {
	const element = this.closest(selectors);
	if (element instanceof type) {
		return (/** @type {InstanceType<T>} */ (element));
	} else throw new TypeError(`Element ${selectors} is missing or has invalid type`);
};

/**
 * Tries to retrieve the closest ancestor element of the specified type and selectors.
 * @template {typeof Element} T
 * @param {T} type The type of element to retrieve.
 * @param {string} selectors The selectors to search for the element.
 * @param {boolean} strict Whether to reject if the element is missing or has an invalid type.
 * @returns {Promise<InstanceType<T>>} A promise that resolves to the element instance.
 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
 */
Element.prototype.tryGetClosest = function (type, selectors, strict = false) {
	return new Promise((resolve, reject) => {
		const element = this.closest(selectors);
		if (element instanceof type) {
			resolve(/** @type {InstanceType<T>} */(element));
		} else if (strict) {
			reject(new TypeError(`Element ${selectors} is missing or has invalid type`));
		}
	});
};
//#endregion
//#region Window
/**
 * Gets the type name of a value.
 * @param {unknown} value The value to get the type name of.
 * @returns {string} The type name of the value.
 */
Window.prototype.typename = function (value) {
	if (value === undefined) return `Undefined`;
	else if (value === null) return `Null`;
	else return value.constructor.name;
};

const dialogAlert = document.getElement(HTMLDialogElement, `dialog.pop-up.alert`);
dialogAlert.addEventListener(`click`, (event) => {
	if (event.target === dialogAlert) {
		dialogAlert.close();
	}
});

/**
 * Asynchronously displays an alert message.
 * @param {any} message The message to display.
 * @param {string} title The title of the alert.
 * @returns {Promise<void>} A promise that resolves when the alert is closed.
 */
Window.prototype.alertAsync = function (message = ``, title = `Message`) {
	dialogAlert.showModal();
	//#region Header
	const htmlHeader = dialogAlert.getElement(HTMLElement, `*.header`);
	//#region Title
	const h3Title = htmlHeader.getElement(HTMLHeadingElement, `h3`);
	switch (title) {
		case `Error`: {
			h3Title.classList.add(`invalid`);
		} break;
		case `Warning`: {
			h3Title.classList.add(`warn`);
		} break;
		default: {
			h3Title.classList.add(`highlight`);
		} break;
	}
	h3Title.innerText = title;
	//#endregion
	//#endregion
	//#region Container
	const htmlContainer = dialogAlert.getElement(HTMLElement, `*.container`);
	htmlContainer.innerText = `${message}`;
	//#endregion
	const controller = new AbortController();
	const promise = ( /** @type {Promise<void>} */(new Promise((resolve) => {
		dialogAlert.addEventListener(`close`, (event) => {
			resolve();
		}, { signal: controller.signal });
	})));
	promise.finally(() => {
		controller.abort();
		dialogAlert.close();
	});
	return promise;
};

const dialogConfirm = document.getElement(HTMLDialogElement, `dialog.pop-up.confirm`);
dialogConfirm.addEventListener(`click`, (event) => {
	if (event.target === dialogConfirm) {
		dialogConfirm.close();
	}
});

/**
 * Asynchronously displays a confirmation dialog.
 * @param {string} message The message to display.
 * @param {string} title The title of the confirmation dialog.
 * @returns {Promise<boolean>} A promise that resolves to true if the user confirms, and false otherwise.
 */
Window.prototype.confirmAsync = function (message = ``, title = `Message`) {
	dialogConfirm.showModal();
	//#region Header
	const htmlHeader = dialogConfirm.getElement(HTMLElement, `*.header`);
	//#region Title
	const h3Title = htmlHeader.getElement(HTMLHeadingElement, `h3`);
	switch (title) {
		case `Error`: {
			h3Title.classList.add(`invalid`);
		} break;
		case `Warning`: {
			h3Title.classList.add(`warn`);
		} break;
		default: {
			h3Title.classList.add(`highlight`);
		} break;
	}
	h3Title.innerText = title;
	//#endregion
	//#endregion
	//#region Container
	const htmlContainer = dialogConfirm.getElement(HTMLElement, `*.container`);
	htmlContainer.innerText = message;
	//#endregion
	//#region Footer
	const htmlFooter = dialogConfirm.getElement(HTMLElement, `*.footer`);
	//#region Button Accept
	const buttonAccept = htmlFooter.getElement(HTMLButtonElement, `button.highlight`);
	//#endregion
	//#region Button Decline
	const buttonDecline = htmlFooter.getElement(HTMLButtonElement, `button.invalid`);
	//#endregion
	//#endregion
	const controller = new AbortController();
	const promise = (/** @type {Promise<boolean>} */(new Promise((resolve) => {
		dialogConfirm.addEventListener(`close`, (event) => {
			resolve(false);
		}, { signal: controller.signal });
		buttonAccept.addEventListener(`click`, (event) => {
			resolve(true);
		}, { signal: controller.signal });
		buttonDecline.addEventListener(`click`, (event) => {
			resolve(false);
		}, { signal: controller.signal });
	})));
	promise.finally(() => {
		controller.abort();
		dialogConfirm.close();
	});
	return promise;
};

const dialogPrompt = document.getElement(HTMLDialogElement, `dialog.pop-up.prompt`);
dialogPrompt.addEventListener(`click`, (event) => {
	if (event.target === dialogPrompt) {
		dialogPrompt.close();
	}
});

/**
 * Asynchronously displays a prompt dialog.
 * @param {string} message The message to display.
 * @param {string} title The title of the prompt dialog.
 * @returns {Promise<string?>} A promise that resolves to the user's input value if accepted, or null if canceled.
 */
Window.prototype.promptAsync = function (message = ``, _default = ``, title = `Message`) {
	dialogPrompt.showModal();
	//#region Header
	const htmlHeader = dialogPrompt.getElement(HTMLElement, `*.header`);
	//#region Title
	const h3Title = htmlHeader.getElement(HTMLHeadingElement, `h3`);
	switch (title) {
		case `Error`: {
			h3Title.classList.add(`invalid`);
		} break;
		case `Warning`: {
			h3Title.classList.add(`warn`);
		} break;
		default: {
			h3Title.classList.add(`highlight`);
		} break;
	}
	h3Title.innerText = title;
	//#endregion
	//#endregion
	//#region Container
	const htmlContainer = dialogPrompt.getElement(HTMLElement, `*.container`);
	htmlContainer.innerText = message;
	//#endregion
	//#region Footer
	const htmlFooter = dialogPrompt.getElement(HTMLElement, `*.footer`);
	//#region Button Accept
	const buttonAccept = htmlFooter.getElement(HTMLButtonElement, `button.highlight`);
	//#endregion
	//#region Input Prompt
	const inputPrompt = htmlFooter.getElement(HTMLInputElement, `input[type="text"]`);
	inputPrompt.value = _default;
	//#endregion
	//#endregion
	const controller = new AbortController();
	const promise = (/** @type {Promise<string?>} */(new Promise((resolve) => {
		dialogPrompt.addEventListener(`close`, (event) => {
			resolve(null);
		}, { signal: controller.signal });
		buttonAccept.addEventListener(`click`, (event) => {
			resolve(inputPrompt.value);
		}, { signal: controller.signal });
	})));
	promise.finally(() => {
		controller.abort();
		dialogPrompt.close();
	});
	return promise;
};

/**
 * Issues a warning message.
 * @param {any} message The warning message to be issued.
 * @returns {Promise<void>} A Promise that resolves when the warning is displayed.
 */
Window.prototype.warn = async function (message = ``) {
	await this.alertAsync(message, `Warning`);
};

/**
 * Throws an error message.
 * @param {any} message The error message to be thrown.
 * @returns {Promise<void>} A Promise that resolves when the error is displayed.
 */
Window.prototype.throw = async function (message = ``) {
	await this.alertAsync(message, `Error`);
};

/**
 * Asynchronously handles an error, displaying it in an alert.
 * @param {Error} error The error to handle.
 * @param {boolean} reload Indicates whether the application should be reloaded after displaying the error.
 * @returns {Promise<void>} A promise that resolves once the error handling is complete.
 */
Window.prototype.catch = async function (error, reload = true) {
	await window.throw(error);
	if (reload) {
		location.reload();
	}
};

/**
 * Ensures the execution of an action or stops the program if errors occur.
 * @template T
 * @param {() => T | PromiseLike<T>} action The action to execute.
 * @param {boolean} reload Indicates whether the application should be reloaded after an error.
 * @returns {Promise<T>} A Promise that resolves with the result of the action or rejects with the error.
 * @throws {Error} If the action throws an error.
 */
Window.prototype.ensure = async function (action, reload = true) {
	try {
		return await action();
	} catch (error) {
		await window.catch(Error.generate(error), reload);
		throw error;
	}
};

/**
 * Insures that no errors occur when executing an action.
 * @template T
 * @param {() => T | PromiseLike<T>} action The action to execute.
 * @param {() => unknown} eventually The callback to execute after the action is complete.
 * @returns {Promise<T | void>} A Promise that resolves with the result of the action, or void if it fails.
 */
Window.prototype.insure = async function (action, eventually = () => { }) {
	try {
		return await action();
	} catch (error) {
		await window.catch(Error.generate(error), false);
	} finally {
		await eventually();
	}
};

/**
 * Asynchronously loads a promise with a loading animation.
 * @template T
 * @param {Promise<T>} promise The promise to load.
 * @param {number} duration The duration of the loading animation.
 * @param {number} delay The delay before the loading animation starts.
 * @returns {Promise<T>} A promise that resolves to the result of the input promise.
 */
Window.prototype.load = async function (promise, duration = 200, delay = 0) {
	const dialogLoader = document.getElement(HTMLDialogElement, `dialog.loader`);
	try {
		dialogLoader.showModal();
		await dialogLoader.animate([
			{ opacity: `0` },
			{ opacity: `1` },
		], { duration: duration, fill: `both` }).finished;
		return await promise;
	} finally {
		await dialogLoader.animate([
			{ opacity: `1` },
			{ opacity: `0` },
		], { duration: duration, fill: `both`, delay: delay }).finished;
		dialogLoader.close();
	}
};
//#endregion
//#region Version manager
/**
 * Represents a version manager for parsing and comparing version numbers.
 */
class VersionManager {
	/**
	 * Parses a version number from the given text.
	 * @param {string} text The text representing the version number.
	 * @returns {VersionManager} A VersionManager instance representing the parsed version.
	 * @throws {SyntaxError} If the version syntax is invalid.
	 */
	static parse(text) {
		const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(text);
		if (match === null) throw new SyntaxError(`Invalid version '${text}' syntax. Version must have <number>.<number>.<number> syntax`);
		const [, major, minor, patch] = match.map(part => Number.parseInt(part));
		const version = new VersionManager();
		version.#major = major;
		version.#minor = minor;
		version.#patch = patch;
		return version;
	}
	/** @type {number} */
	#major = 1;
	/** @type {number} */
	#minor = 0;
	/** @type {number} */
	#patch = 0;
	/**
	 * Checks if this version is higher than the specified version.
	 * @param {VersionManager} other The other version to compare against.
	 * @returns {boolean} True if this version is higher; otherwise, false.
	 */
	isHigherThen(other) {
		if (this.#major > other.#major) return true;
		else if (this.#minor > other.#minor) return true;
		else if (this.#patch > other.#patch) return true;
		else return false;
	}
	/**
	 * Converts the version to a string representation.
	 * @returns {string} The string representation of the version.
	 */
	toString() {
		return `${this.#major}.${this.#minor}.${this.#patch}`;
	}
}
//#endregion
//#region Navigator
Object.defineProperty(Navigator.prototype, `dataPath`, {
	get() {
		const developer = document.getElement(HTMLMetaElement, `meta[name="author"]`).content;
		const title = document.getElement(HTMLMetaElement, `meta[name="title"]`).content;
		return `${developer}.${title}`;
	}
});

Object.defineProperty(Navigator.prototype, `version`, {
	get() {
		const metaVersion = document.getElement(HTMLMetaElement, `meta[name="generator"]`).content;
		return VersionManager.parse(metaVersion);
	}
});

Object.defineProperty(Navigator.prototype, `colorScheme`, {
	get() {
		return document.getElement(HTMLMetaElement, `meta[name="color-scheme"]`).content;
	},
	set(value) {
		document.getElement(HTMLMetaElement, `meta[name="color-scheme"]`).content = String(value);
	}
});

/**
 * Downloads the specified file.
 * @param {File} file The file to download.
 * @returns {void}
 */
Navigator.prototype.download = function (file) {
	const aLink = document.createElement(`a`);
	aLink.download = file.name;
	aLink.href = URL.createObjectURL(file);
	aLink.click();
	URL.revokeObjectURL(aLink.href);
	aLink.remove();
};
//#endregion
//#region Location
/**
 * Parses the search part of the URL and returns it as a map.
 * @returns {Map<string, string>} A map containing the search parameters.
 */
Object.defineProperty(Location.prototype, `mapSearch`, {
	get() {
		return new Map(window.decodeURI(location.search.replace(/^\??/, ``)).split(`&`).filter(item => item).map((item) => {
			const [key, value] = item.split(`=`, 2);
			return [key, value];
		}));
	}
});
//#endregion

export { Stack, Queue, DataPair, StrictMap };