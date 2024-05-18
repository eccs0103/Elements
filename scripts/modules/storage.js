"use strict";

import { } from "./extensions.js";

//#region Archive
/**
 * Represents an archive that stores data in localStorage.
 * @template T
 */
class Archive {
	/**
	 * @param {string} key The key to use for storing the data in localStorage.
	 * @param {T} initial The initial data to be stored if no data exists with the provided key.
	 */
	constructor(key, initial) {
		this.#key = key;
		this.#initial = initial;

		if (localStorage.getItem(this.#key) === null) {
			this.data = this.#initial;
		}
	}
	/** @type {string} */
	#key;
	/** @type {T} */
	#initial;
	/**
	 * Gets the data stored in the archive.
	 * @returns {T} The data stored in the archive.
	 */
	get data() {
		const item = localStorage.getItem(this.#key) ?? (() => {
			throw new ReferenceError(`Key '${this.#key}' isn't defined`);
		})();
		return (/** @type {T} */ (JSON.parse(item)));
	}
	/**
	 * Sets the data in the archive.
	 * @param {T} value The data to be stored in the archive.
	 */
	set data(value) {
		localStorage.setItem(this.#key, JSON.stringify(value, undefined, `\t`));
	}
	/**
	 * Resets the data in the archive to its initial value.
	 * @returns {void}
	 */
	reset() {
		this.data = this.#initial;
	}
	/**
	 * Modifies the data in the archive using the provided action.
	 * @param {(value: T) => T} action The action to be applied to the data.
	 */
	change(action) {
		this.data = action(this.data);
	}
}
//#endregion
//#region Archive manager
/**
 * Manages the archive data and provides methods for construction, reconstruction, and accessing data.
 * @template N The type of data exported by the archive.
 * @template {{ export(): N }} O The type of object that can export the data.
 */
class ArchiveManager {
	static #locked = true;
	/**
	 * @template N The type of data exported by the archive.
	 * @template {{ export(): N }} O The type of object that can export the data.
	 * @template {readonly any[]} A The type of arguments for the constructor of the prototype object.
	 * @param {string} path The path of the archive.
	 * @param {{ import(source: unknown, name?: string): O, new(...args: A): O }} prototype The prototype object.
	 * @param {A} args The arguments for the constructor of the prototype object.
	 * @returns {Promise<ArchiveManager<N, O>>} A promise that resolves to the constructed ArchiveManager instance.
	 */
	static async construct(path, prototype, ...args) {
		ArchiveManager.#locked = false;
		/** @type {ArchiveManager<N, O>} */
		const self = new ArchiveManager();
		ArchiveManager.#locked = true;

		self.#construct = () => Reflect.construct(prototype, args);
		/** @type {Archive<N>} */
		const archive = new Archive(path, self.#construct().export());
		while (true) {
			try {
				const data = prototype.import(archive.data, `archive data`);
				if (!(data instanceof prototype)) {
					throw new TypeError(`Imported data ${(data)} type does not match ${(prototype)}`);
				}
				self.#data = data;
				break;
			} catch (error) {
				if (await window.confirmAsync(`An error occurred during initialization. This type error cannot be fixed by reloading. Would you like to reset the data from archive '${path}' to restore the program's functionality?`)) {
					archive.reset();
					continue;
				} else throw error;
			}
		}
		window.addEventListener(`beforeunload`, (event) => {
			archive.data = self.#data.export();
		});

		return self;
	}
	constructor() {
		if (ArchiveManager.#locked) throw new TypeError(`Illegal constructor`);
	}
	/** @type {() => O} */
	#construct;
	/** @type {O} */
	#data;
	/**
	 * Gets the archive data.
	 * @returns {O} The archive data.
	 */
	get data() {
		return this.#data;
	}
	/**
	 * Reconstructs the archive data.
	 * @returns {void}
	 */
	reconstruct() {
		this.#data = this.#construct();
	}
}
//#endregion

//#region Store
class Store {
	/**
	 * @param {string} database
	 * @param {string} store
	 */
	constructor(database, store) {
		this.#store = store;
		const promiseOpenDatabase = this.#createOpenDatabasePromise(database);
		this.#promiseGetStore = Promise.fulfill(async () => {
			const database = await promiseOpenDatabase;
			const transaction = database.transaction([this.#store], `readwrite`);
			return transaction.objectStore(this.#store);
		});
		// requestDatabaseOpen.addEventListener(`upgradeneeded`, (event) => {
		// 	const database = requestDatabaseOpen.result;
		// 	if (!database.objectStoreNames.contains(this.#store)) {
		// 		database.createObjectStore(this.#store);
		// 	}
		// });
	}
	/** @type {string} */
	#store;
	/**
	 * @param {string} name 
	 * @returns {Promise<IDBDatabase>}
	 */
	#createOpenDatabasePromise(name) {
		const request = indexedDB.open(name);
		const controller = new AbortController();
		/** @type {Promise<IDBDatabase>} */
		const promise = new Promise((resolve, reject) => {
			request.addEventListener(`success`, (event) => {
				resolve(request.result);
			}, { signal: controller.signal });
			request.addEventListener(`error`, (event) => {
				reject(request.error);
			}, { signal: controller.signal });
		});
		promise.finally(() => {
			controller.abort();
		});
		return promise;
	}
	/** @type {Promise<IDBObjectStore>} */
	#promiseGetStore;
	/**
	 * @param {string} key
	 * @returns {Promise<any>}
	 */
	async get(key) {
		// const database = await this.#promiseOpenDatabase;
		// const transaction = database.transaction([this.#store], `readwrite`);
		// const store = transaction.objectStore(this.#store);
		const store = await this.#promiseGetStore;
		const requestGetValue = store.get(key);
		const controller = new AbortController();
		try {
			return await new Promise((resolve, reject) => {
				requestGetValue.addEventListener(`success`, () => resolve(requestGetValue.result), { signal: controller.signal });
				requestGetValue.addEventListener(`error`, () => reject(requestGetValue.error), { signal: controller.signal });
			});
		} finally {
			controller.abort();
		}
	}
	/**
	 * @param {string} key
	 * @param {any} value
	 * @returns {Promise<void>}
	 */
	async set(key, value) {
		// const database = await this.#promiseOpenDatabase;
		// const transaction = database.transaction([this.#store], `readwrite`);
		// const store = transaction.objectStore(this.#store);
		const store = await this.#promiseGetStore;
		const requestPutValue = store.put(value, key);
		const controller = new AbortController();
		try {
			return await new Promise((resolve, reject) => {
				requestPutValue.addEventListener(`success`, () => resolve(), { signal: controller.signal });
				requestPutValue.addEventListener(`error`, () => reject(requestPutValue.error), { signal: controller.signal });
			});
		} finally {
			controller.abort();
		}
	}
}
//#endregion
//#region Locker
/**
 * @template T
 */
class Locker extends Store {
	/**
	 * @param {string} database
	 * @param {string} store
	 * @param {string} key
	 */
	constructor(database, store, key) {
		super(database, store);
		this.#key = key;
	}
	/** @type {string} */
	#key;
	/**
	 * @returns {Promise<T>}
	 */
	async get() {
		return await super.get(this.#key);
	}
	/**
	 * @param {T} value
	 * @returns {Promise<void>}
	 */
	// @ts-ignore
	async set(value) {
		await super.set(this.#key, value);
	}
}
//#endregion

export { Archive, ArchiveManager };