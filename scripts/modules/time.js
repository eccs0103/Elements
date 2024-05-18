"use strict";

const { abs, trunc } = Math;

//#region Timespan
/**
 * Represents a duration of time.
 */
class Timespan {
	//#region Converters
	/**
	 * @param {number} duration
	 * @returns {[boolean, number, number, number, number]}
	 */
	static #toTime(duration) {
		const negativity = duration < 0;
		duration = abs(duration);
		const milliseconds = duration % 1000;
		duration = trunc(duration / 1000);
		const seconds = duration % 60;
		duration = trunc(duration / 60);
		const minutes = duration % 60;
		duration = trunc(duration / 60);
		const hours = duration;
		return [negativity, hours, minutes, seconds, milliseconds];
	}
	/**
	 * @param {boolean} negativity
	 * @param {number} hours
	 * @param {number} minutes
	 * @param {number} seconds
	 * @param {number} milliseconds
	 * @returns {number}
	 */
	static #toDuration(negativity, hours, minutes, seconds, milliseconds) {
		return (negativity ? -1 : 1) * ((((hours) * 60 + minutes) * 60 + seconds) * 1000 + milliseconds);
	}
	/**
	 * Converts a timespan to a string representation.
	 * @param {Timespan} timespan The timespan to stringify.
	 * @param {boolean} full Whether to include all time components.
	 * @returns {string} The string representation of the timespan.
	 */
	static stringify(timespan, full = true) {
		const { negativity, hours, minutes, seconds, milliseconds } = timespan;
		let result = seconds.toFixed().padStart(2, `0`);
		if (full || milliseconds > 0) {
			result = `${result}.${milliseconds.toFixed().padStart(3, `0`)}`;
		}
		if (full || hours > 0) {
			result = `${minutes.toFixed().padStart(2, `0`)}:${result}`;
			result = `${hours.toFixed().padStart(2, `0`)}:${result}`;
		} else if (minutes > 0) {
			result = `${minutes.toFixed().padStart(2, `0`)}:${result}`;
		}
		if (negativity) {
			result = `-${result}`;
		}
		return result;
	}
	/**
	 * Parses a string representation into a Timespan object.
	 * @param {string} string The string to parse.
	 * @returns {Timespan} The parsed Timespan object.
	 * @throws {SyntaxError} If the string has invalid syntax.
	 */
	static parse(string) {
		const match = /(-)?(?:(?:(\d+):)?(\d+):)?(\d+)(?:\.(\d+))?/.exec(string);
		if (!match) {
			throw new SyntaxError(`Invalid moment syntax: ${string}`);
		}
		const negativity = (match[1] !== undefined);
		const [, , hours, minutes, seconds, milliseconds] = match.map(part => Number.parseInt(part ?? 0));
		if (0 > hours) throw new RangeError(`Invalid hours value: ${hours}`);
		if (0 > minutes || minutes > 59) throw new RangeError(`Invalid minutes value: ${minutes}`);
		if (0 > seconds || seconds > 59) throw new RangeError(`Invalid seconds value: ${seconds}`);
		if (0 > milliseconds || milliseconds > 999) throw new RangeError(`Invalid milliseconds value: ${milliseconds}`);
		return Timespan.viaTime(negativity, hours, minutes, seconds, milliseconds);
	}
	//#endregion
	//#region Constructors
	/**
	 * Creates a Timespan object from a duration.
	 * @param {number} duration The duration in milliseconds.
	 * @returns {Timespan} The Timespan object.
	 */
	static viaDuration(duration = 0) {
		const result = new Timespan();
		result.#duration = trunc(duration);
		[result.#negativity, result.#hours, result.#minutes, result.#seconds, result.#milliseconds] = Timespan.#toTime(result.#duration);
		return result;
	}
	/**
	 * Creates a Timespan object from individual time components.
	 * @param {boolean} negativity Whether the timespan is negative.
	 * @param {number} hours The hours component.
	 * @param {number} minutes The minutes component.
	 * @param {number} seconds The seconds component.
	 * @param {number} milliseconds The milliseconds component.
	 * @returns {Timespan} The Timespan object.
	 * @throws {RangeError} If any component is out of range.
	 */
	static viaTime(negativity = false, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
		if (0 > hours) throw new RangeError(`Property 'hours' out of range: ${hours}`);
		if (0 > minutes || minutes > 59) throw new RangeError(`Property 'minutes' out of range: ${minutes}`);
		if (0 > seconds || seconds > 59) throw new RangeError(`Property 'seconds' out of range: ${seconds}`);
		if (0 > milliseconds || milliseconds > 999) throw new RangeError(`Property 'milliseconds' out of range: ${milliseconds}`);
		const result = new Timespan();
		result.#negativity = negativity;
		result.#hours = trunc(hours);
		result.#minutes = trunc(minutes);
		result.#seconds = trunc(seconds);
		result.#milliseconds = trunc(milliseconds);
		result.#duration = Timespan.#toDuration(result.#negativity, result.#hours, result.#minutes, result.#seconds, result.#milliseconds);
		return result;
	}
	/**
	 * Clones a Timespan object.
	 * @param {Timespan} source The source Timespan object.
	 * @returns {Timespan} The cloned Timespan object.
	 */
	static clone(source) {
		const result = new Timespan();
		result.#duration = source.#duration;
		result.#negativity = source.#negativity;
		result.#hours = source.#hours;
		result.#minutes = source.#minutes;
		result.#seconds = source.#seconds;
		result.#milliseconds = source.#milliseconds;
		return result;
	}
	//#endregion
	//#region Presets
	/**
	 * Represents a zero timespan.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get ZERO() { return Timespan.viaTime(false, 0, 0, 0, 0); };
	/**
	 * Represents a timespan of one millisecond.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get MILLISECOND() { return Timespan.viaTime(false, 0, 0, 0, 1); };
	/**
	 * Represents a timespan of one second.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get SECOND() { return Timespan.viaTime(false, 0, 0, 1, 0); };
	/**
	 * Represents a timespan of one minute.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get MINUTE() { return Timespan.viaTime(false, 0, 1, 0, 0); };
	/**
	 * Represents a timespan of one hour.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get HOUR() { return Timespan.viaTime(false, 1, 0, 0, 0); };
	/**
	 * Represents a timespan of one day.
	 * @readonly
	 * @returns {Timespan}
	 */
	static get DAY() { return Timespan.viaTime(false, 24, 0, 0, 0); };
	//#endregion
	//#region Modifiers
	/**
	 * Adds two timespans together.
	 * @param {Timespan} first The first timespan.
	 * @param {Timespan} second The second timespan.
	 * @returns {Timespan} The result of the addition.
	 */
	static [`+`](first, second) {
		return Timespan.viaDuration(first.#duration + second.#duration);
	}
	/**
	 * Subtracts one timespan from another.
	 * @param {Timespan} first The first timespan.
	 * @param {Timespan} second The second timespan.
	 * @returns {Timespan} The result of the subtraction.
	 */
	static [`-`](first, second) {
		return Timespan.viaDuration(first.#duration - second.#duration);
	}
	/**
	 * Multiplies a timespan by a factor.
	 * @param {Timespan} timespan The timespan to multiply.
	 * @param {number} factor The factor to multiply by.
	 * @returns {Timespan} The result of the multiplication.
	 */
	static [`*`](timespan, factor) {
		return Timespan.viaDuration(timespan.#duration * factor);
	}
	/**
	 * Divides a timespan by a factor.
	 * @param {Timespan} timespan The timespan to divide.
	 * @param {number} factor The factor to divide by.
	 * @returns {Timespan} The result of the division.
	 */
	static [`/`](timespan, factor) {
		return Timespan.viaDuration(timespan.#duration / factor);
	}
	/**
	 * Inverts the sign of a timespan.
	 * @param {Timespan} timespan The timespan to invert.
	 * @returns {Timespan} The inverted timespan.
	 */
	static invert(timespan) {
		return Timespan.viaDuration(-1 * timespan.#duration);
	}
	//#endregion
	//#region Properties
	/** @type {number} */
	#duration = 0;
	/**
	 * Gets the duration of the timespan in milliseconds.
	 * @type {number}
	 */
	get duration() {
		return this.#duration;
	}
	/**
	 * Sets the duration of the timespan in milliseconds.
	 * @param {number} value The duration value to set.
	 */
	set duration(value) {
		if (value < 0) throw new RangeError(`Property 'duration' out of range: ${value}`);
		this.#duration = trunc(value);
		[this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds] = Timespan.#toTime(this.#duration);
	}
	/** @type {boolean} */
	#negativity = false;
	/**
	 * Gets whether the timespan is negative.
	 * @type {boolean}
	 */
	get negativity() {
		return this.#negativity;
	}
	/**
	 * Sets whether the timespan is negative.
	 * @param {boolean} value The negativity value to set.
	 */
	set negativity(value) {
		this.#negativity = value;
		this.#duration = Timespan.#toDuration(this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds);
	}
	/** @type {number} */
	#hours = 0;
	/**
	 * Gets the hours component of the timespan.
	 * @type {number}
	 */
	get hours() {
		return this.#hours;
	}
	/**
	 * Sets the hours component of the timespan.
	 * @param {number} value The hours value to set.
	 */
	set hours(value) {
		if (value < 0) throw new RangeError(`Property 'hours' out of range: ${value}`);
		this.#hours = trunc(value);
		this.#duration = Timespan.#toDuration(this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds);
	}
	/** @type {number} */
	#minutes = 0;
	/**
	 * Gets the minutes component of the timespan.
	 * @type {number}
	 */
	get minutes() {
		return this.#minutes;
	}
	/**
	 * Sets the minutes component of the timespan.
	 * @param {number} value The minutes value to set.
	 */
	set minutes(value) {
		if (value < 0 || value > 59) throw new RangeError(`Property 'minutes' out of range: ${value}`);
		this.#minutes = trunc(value);
		this.#duration = Timespan.#toDuration(this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds);
	}
	/** @type {number} */
	#seconds = 0;
	/**
	 * Gets the seconds component of the timespan.
	 * @type {number}
	 */
	get seconds() {
		return this.#seconds;
	}
	/**
	 * Sets the seconds component of the timespan.
	 * @param {number} value The seconds value to set.
	 */
	set seconds(value) {
		if (value < 0 || value > 59) throw new RangeError(`Property 'seconds' out of range: ${value}`);
		this.#seconds = trunc(value);
		this.#duration = Timespan.#toDuration(this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds);
	}
	/** @type {number} */
	#milliseconds = 0;
	/**
	 * Gets the milliseconds component of the timespan.
	 * @type {number}
	 */
	get milliseconds() {
		return this.#milliseconds;
	}
	/**
	 * Sets the milliseconds component of the timespan.
	 * @param {number} value The milliseconds value to set.
	 */
	set milliseconds(value) {
		if (value < 0 || value > 999) throw new RangeError(`Property 'milliseconds' out of range: ${value}`);
		this.#milliseconds = trunc(value);
		this.#duration = Timespan.#toDuration(this.#negativity, this.#hours, this.#minutes, this.#seconds, this.#milliseconds);
	}
	//#endregion
	//#region Methods
	/**
	 * Converts the timespan to a string representation.
	 * @param {boolean} full Determines whether to include all time components or not. Default is true.
	 * @returns {string} The string representation of the timespan.
	 */
	toString(full = true) {
		return Timespan.stringify(this, full);
	}
	/**
	 * Converts the timespan to its primitive value, which is its duration in milliseconds.
	 * @returns {number} The duration of the timespan in milliseconds.
	 */
	[Symbol.toPrimitive]() {
		return this.#duration;
	}
	/**
	 * Creates a shallow copy of the timespan.
	 * @returns {Timespan} A new timespan instance that is a clone of the current one.
	 */
	clone() {
		return Timespan.clone(this);
	}
	/**
	 * Adds another timespan to the current timespan.
	 * @param {Timespan} other The timespan to add.
	 * @returns {Timespan} A new timespan representing the sum of the current timespan and the other timespan.
	 */
	[`+`](other) {
		return Timespan[`+`](this, other);
	}
	/**
	 * Subtracts another timespan from the current timespan.
	 * @param {Timespan} other The timespan to subtract.
	 * @returns {Timespan} A new timespan representing the difference between the current timespan and the other timespan.
	 */
	[`-`](other) {
		return Timespan[`-`](this, other);
	}
	/**
	 * Multiplies the duration of the timespan by a factor.
	 * @param {number} factor The factor by which to multiply the duration.
	 * @returns {Timespan} A new timespan representing the duration multiplied by the factor.
	 */
	[`*`](factor) {
		return Timespan[`*`](this, factor);
	}
	/**
	 * Divides the duration of the timespan by a factor.
	 * @param {number} factor The factor by which to divide the duration.
	 * @returns {Timespan} A new timespan representing the duration divided by the factor.
	 */
	[`/`](factor) {
		return Timespan[`/`](this, factor);
	}
	/**
	 * Inverts the timespan, changing its sign.
	 * @returns {Timespan} A new timespan representing the negation of the current timespan.
	 */
	invert() {
		return Timespan.invert(this);
	}
	//#endregion
}
//#endregion

export { Timespan };
