/// <reference path="./extensions.js" />

interface NumberConstructor {
	/**
	 * Imports a number from a source.
	 * @param source The source value to import.
	 * @param name The name of the source value.
	 * @returns The imported number value.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a number.
	 */
	import(source: unknown, name?: string): number;
}

interface Number {
	/**
	 * Exports the number value.
	 * @returns The exported number value.
	 */
	export(): number;
}

interface BooleanConstructor {
	/**
	 * Imports a boolean value from a source.
	 * @param source The source value to import.
	 * @param name The name of the source value.
	 * @returns The imported boolean value.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a boolean.
	 */
	import(source: unknown, name?: string): boolean;
}

interface Boolean {
	/**
	 * Exports the boolean value.
	 * @returns The exported boolean value.
	 */
	export(): boolean;
}

interface StringConstructor {
	/**
	 * Imports a string from a source.
	 * @param source The source value to import.
	 * @param name The name of the source value.
	 * @returns The imported string value.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a string.
	 */
	import(source: unknown, name?: string): string;
	/**
	 * Checks if a string is empty.
	 * @param text The string to check.
	 * @returns True if the string is empty, otherwise false.
	 */
	isEmpty(text: string): boolean;
}

interface String {
	/**
	 * Exports the string value.
	 * @returns The exported string value.
	 */
	export(): string;
	/**
	 * Replaces the string with another if it's empty.
	 * @param text The replacement text.
	 * @returns The original string if not empty, otherwise the replacement text.
	 */
	replaceVoid(text: string): string;
}

interface Function {
	/**
	 * Abstract method for importing.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported value.
	 * @throws {ReferenceError} If not implemented.
	 */
	abstract import(source: unknown, name?: string): any;
	/**
	 * Abstract method for exporting.
	 * @returns The exported value.
	 * @throws {ReferenceError} If not implemented.
	 */
	abstract export(): any;
}

interface ObjectConstructor {
	/**
	 * Maps a non-null value using a callback function.
	 * @template T
	 * @template U
	 * @param value The value to map.
	 * @param callback The callback function.
	 * @returns The result of the callback or null if the value is null.
	 */
	map<T, U>(value: NonNullable<T> | null, callback: (object: NonNullable<T>) => U): U | null;
	/**
	 * Imports an object from a source.
	 * @param source The source to import from.
	 * @param name The name of the source.
	 * @returns The imported object.
	 * @throws {ReferenceError} Throws a ReferenceError if the source is undefined.
	 * @throws {TypeError} Throws a TypeError if the source is not an object or null.
	 */
	import(source: unknown, name?: string): Object;
}

interface Object {
	/**
	 * Exports the object.
	 * @returns The exported object.
	 */
	export(): Object;
}

interface ArrayConstructor {
	/**
	 * Imports an array from a source.
	 * @param source The source to import from.
	 * @param name The name of the source.
	 * @returns The imported array.
	 * @throws {ReferenceError} Throws a ReferenceError if the source is undefined.
	 * @throws {TypeError} Throws a TypeError if the source is not an array.
	 */
	import(source: unknown, name?: string): any[];
}

interface Array<T extends Function> {
	/**
	 * Exports the array.
	 * @returns The exported array.
	 */
	export(): T[];
}

interface Math {
	/**
	 * Calculates the square of a number.
	 * @param x The number to square.
	 * @returns The square of the input number.
	 */
	sqpw(x: number): number;
	/**
	 * Clamps a value between a minimum and maximum.
	 * @param value The value to clamp.
	 * @param min The minimum value.
	 * @param max The maximum value.
	 * @returns The clamped value.
	 */
	between(value: number, min: number, max: number): number;
	/**
	 * Converts radians to degrees.
	 * @param radians The angle in radians.
	 * @returns The angle in degrees.
	 */
	toDegrees(radians: number): number;
	/**
	 * Converts degrees to radians.
	 * @param degrees The angle in degrees.
	 * @returns The angle in radians.
	 */
	toRadians(degrees: number): number;
	/**
	 * Maps a value to the range [0, 1).
	 * @param value The value to map.
	 * @param period The period of the mapping.
	 * @returns The mapped value.
	 */
	toFactor(value: number, period: number): number;
	/**
	 * Maps a value to the range [-1, 1).
	 * @param value The value to map.
	 * @param period The period of the mapping.
	 * @returns The mapped value.
	 */
	toSignedFactor(value: number, period: number): number;
}

interface PromiseConstructor {
	/**
	 * Creates a promise that fulfills with the result of calling the provided action.
	 * @template T
	 * @param action The action to execute.
	 * @returns A promise that fulfills with the result of the action.
	 */
	fulfill<T>(action: () => T | PromiseLike<T>): Promise<T>;
}

interface ErrorConstructor {
	/**
	 * Generates an Error object from the provided input.
	 * @param error The error input.
	 * @returns An Error object representing the input.
	 */
	generate(error: any): Error;
}

interface Error {
	/**
	 * Returns a string representation of the Error object.
	 * @returns A string representation of the Error object.
	 */
	toString(): string;
}

interface Element {
	/**
	 * Retrieves an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getElement<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElement<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves the closest ancestor element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getClosest<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve the closest ancestor element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetClosest<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @returns The NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type.
	 */
	getElements<T extends typeof Element>(type: T, selectors: string): NodeListOf<InstanceType<T>>;
	/**
	 * Tries to retrieve elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @param strict Whether to reject if any element is missing or has an invalid type.
	 * @returns A promise that resolves to the NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElements<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<NodeListOf<InstanceType<T>>>;
}

interface Document {
	/**
	 * Retrieves an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getElement<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElement<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @returns The NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type.
	 */
	getElements<T extends typeof Element>(type: T, selectors: string): NodeListOf<InstanceType<T>>;
	/**
	 * Tries to retrieve elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @param strict Whether to reject if any element is missing or has an invalid type.
	 * @returns A promise that resolves to the NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElements<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<NodeListOf<InstanceType<T>>>;
}

interface Window {
	/**
	 * Gets the type name of a value.
	 * @param value The value to get the type name of.
	 * @returns The type name of the value.
	 */
	typename(value: unknown): string;
	/**
	 * Asynchronously displays an alert message.
	 * @param message The message to display.
	 * @param title The title of the alert.
	 * @returns A promise that resolves when the alert is closed.
	 */
	alertAsync(message?: any, title?: string): Promise<void>;
	/**
	 * Asynchronously displays a confirmation dialog.
	 * @param message The message to display.
	 * @param title The title of the confirmation dialog.
	 * @returns A promise that resolves to true if the user confirms, and false otherwise.
	 */
	confirmAsync(message?: string, title?: string): Promise<boolean>;
	/**
	 * Asynchronously displays a prompt dialog.
	 * @param message The message to display.
	 * @param title The title of the prompt dialog.
	 * @returns A promise that resolves to the user's input value if accepted, or null if canceled.
	 */
	promptAsync(message?: string, _default?: string, title?: string): Promise<string?>;
	/**
	 * Issues a warning message.
	 * @param message The warning message to be issued.
	 * @returns A Promise that resolves when the warning is displayed.
	 */
	warn(message?: any): Promise<void>;
	/**
	 * Throws an error message.
	 * @param message The error message to be thrown.
	 * @returns A Promise that resolves when the error is displayed.
	 */
	throw(message?: any): Promise<void>;
	/**
	 * Asynchronously handles an error, displaying it in an alert.
	 * @param error The error to handle.
	 * @param reload Indicates whether the application should be reloaded after displaying the error.
	 * @returns A promise that resolves once the error handling is complete.
	 */
	catch(error: Error, reload?: boolean): Promise<void>;
	/**
	 * Executes a callback and handles any errors that occur.
	 * @template T
	 * @param callback The callback function to execute.
	 * @param reload Indicates whether the application should be reloaded after an error.
	 * @returns A Promise that resolves with the result of the callback or rejects with the error.
	 */
	ensure<T>(callback: () => T, reload?: boolean): Promise<T>;
	/**
	 * Asynchronously loads a promise with a loading animation.
	 * @template T
	 * @param promise The promise to load.
	 * @param duration The duration of the loading animation.
	 * @param delay The delay before the loading animation starts.
	 * @returns A promise that resolves to the result of the input promise.
	 */
	load<T>(promise: Promise<T>, duration?: number, delay?: number): Promise<T>;
}

/**
 * Gets the type name of a value.
 * @param value The value to get the type name of.
 * @returns The type name of the value.
 */
declare function typename(value: unknown): string;
/**
 * Asynchronously displays an alert message.
 * @param message The message to display.
 * @param title The title of the alert.
 * @returns A promise that resolves when the alert is closed.
 */
declare function alertAsync(message?: any, title?: string): Promise<void>;
/**
 * Asynchronously displays a confirmation dialog.
 * @param message The message to display.
 * @param title The title of the confirmation dialog.
 * @returns A promise that resolves to true if the user confirms, and false otherwise.
 */
declare function confirmAsync(message?: string, title?: string): Promise<boolean>;
/**
 * Asynchronously displays a prompt dialog.
 * @param message The message to display.
 * @param title The title of the prompt dialog.
 * @returns A promise that resolves to the user's input value if accepted, or null if canceled.
 */
declare function promptAsync(message?: string, _default?: string, title?: string): Promise<string?>;
/**
 * Issues a warning message.
 * @param message The warning message to be issued.
 * @returns A Promise that resolves when the warning is displayed.
 */
declare function warn(message?: any): Promise<void>;
/**
 * Executes a callback and handles any errors that occur.
 * @template T
 * @param callback The callback function to execute.
 * @param reload Indicates whether the application should be reloaded after an error.
 * @returns A Promise that resolves with the result of the callback or rejects with the error.
 */
declare function ensure<T>(callback: () => T, reload?: boolean): Promise<T>;
/**
 * Asynchronously loads a promise with a loading animation.
 * @template T
 * @param promise The promise to load.
 * @param duration The duration of the loading animation.
 * @param delay The delay before the loading animation starts.
 * @returns A promise that resolves to the result of the input promise.
 */
declare function load<T>(promise: Promise<T>, duration?: number, delay?: number): Promise<T>;

interface Navigator {
	/**
	 * Retrieves the data path based on developer and application name metadata.
	 * @returns The data path.
	 */
	readonly dataPath: string;
	/**
	 * Retrieves the version information from the metadata.
	 * @returns An instance representing the version.
	 */
	readonly version: VersionManager;
	/**
	 * А property to interact with the color scheme in webpage.
	 */
	colorScheme: string;
	/**
	 * Downloads the specified file.
	 * @param file The file to download.
	 */
	download(file: File): void;
}

interface Location {
	/**
	 * Parses the search part of the URL and returns it as a map.
	 * @returns A map containing the search parameters.
	 */
	readonly mapSearch: Map<string, string>;
};
