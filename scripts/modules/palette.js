"use strict";

import { Matrix, Point2D } from "./measures.js";

const { min, max, trunc, abs } = Math;

//#region Color formats
/**
 * @enum {string}
 */
const ColorFormats = {
	/** @readonly */ RGB: `RGB`,
	/** @readonly */ HSL: `HSL`,
	/** @readonly */ HEX: `HEX`,
};
Object.freeze(ColorFormats);
//#endregion
//#region Color
class Color {
	//#region Converters
	/**
	 * @param {number} hue [0 - 360]
	 * @param {number} saturation [0 - 100]
	 * @param {number} lightness [0 - 100]
	 * @returns {[number, number, number]} red [0 - 255], green [0 - 255], blue [0 - 255]
	 */
	static #HSLtoRGB(hue, saturation, lightness) {
		hue /= 30;
		saturation /= 100;
		lightness /= 100;
		function transform(/** @type {number} */ level) {
			const sector = (level + hue) % 12;
			return lightness - (saturation * min(lightness, 1 - lightness)) * max(-1, min(sector - 3, 9 - sector, 1));
		}
		return [
			trunc(transform(0) * 255),
			trunc(transform(8) * 255),
			trunc(transform(4) * 255)
		];
	}
	/**
	 * @param {number} red [0 - 255]
	 * @param {number} green [0 - 255]
	 * @param {number} blue [0 - 255]
	 * @returns {[number, number, number]} hue [0 - 360], saturation [0 - 100], lightness [0 - 100]
	 */
	static #RGBtoHSL(red, green, blue) {
		red /= 255;
		green /= 255;
		blue /= 255;
		const
			value = max(red, green, blue),
			level = value - min(red, green, blue),
			factor = 1 - abs(value + value - level - 1),
			hue = level && (value === red ? (green - blue) / level : ((value === green) ? 2 + (blue - red) / level : 4 + (red - green) / level));
		return [
			trunc((hue < 0 ? hue + 6 : hue) * 60),
			trunc((factor ? level / factor : 0) * 100),
			trunc(((value + value - level) / 2) * 100)
		];
	}
	/**
	 * Converts a Color object to a string representation in the specified format.
	 * @param {Color} source The Color object to stringify.
	 * @param {boolean} deep Indicates whether to include alpha channel for RGBA/HSLA formats.
	 * @param {ColorFormats} format The format to stringify the color in.
	 * @returns {string} The string representation of the color.
	 * @throws {TypeError} If the provided format is invalid.
	 */
	static stringify(source, deep = false, format = ColorFormats.RGB) {
		switch (format) {
			case ColorFormats.RGB: return `rgb${deep ? `a` : ``}(${source.#red}, ${source.#green}, ${source.#blue}${deep ? `, ${source.#alpha}` : ``})`;
			case ColorFormats.HSL: return `hsl${deep ? `a` : ``}(${source.#hue}deg, ${source.#saturation}%, ${source.#lightness}%${deep ? `, ${source.#alpha}` : ``})`;
			case ColorFormats.HEX: return `#${source.#red.toString(16).replace(/^(?!.{2})/, `0`)}${source.#green.toString(16).replace(/^(?!.{2})/, `0`)}${source.#blue.toString(16).replace(/^(?!.{2})/, `0`)}${deep ? (source.#alpha * 255).toString(16).replace(/^(?!.{2})/, `0`) : ``}`;
			default: throw new TypeError(`Invalid color format: '${format}'.`);
		}
	}
	/**
	/**
	 * Parses a string representation of a color into a Color object.
	 * @param {string} source The string representation of the color.
	 * @param {boolean} deep Indicates whether the color representation includes alpha channel for RGBA/HSLA formats.
	 * @param {ColorFormats} format The format of the string representation.
	 * @returns {Color} The parsed Color object.
	 * @throws {SyntaxError} If the provided string has invalid syntax for the specified format.
	 * @throws {TypeError} If the provided format is invalid.
	 */
	static parse(source, deep = false, format = ColorFormats.RGB) {
		switch (format) {
			case ColorFormats.RGB: {
				const regex = new RegExp(`rgb${deep ? `a` : ``}\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*${deep ? `,\\s*(0(\\.\\d+)?|1(\\.0+)?)\\s*` : ``}\\)`, `i`);
				const matches = regex.exec(source);
				if (!matches) {
					throw new SyntaxError(`Invalid ${format} format color syntax: '${source}'.`);
				}
				const [, red, green, blue, alpha] = matches.map((item) => Number.parseInt(item));
				return Color.viaRGB(red, green, blue, deep ? alpha : 1);
			};
			case ColorFormats.HSL: {
				const regex = new RegExp(`hsl${deep ? `a` : ``}\\(\\s*(\\d+)(?:deg)?\\s*,\\s*(\\d+)(?:%)?\\s*,\\s*(\\d+)(?:%)?\\s*${deep ? `,\\s*(0(\\.\\d+)?|1(\\.0+)?)\\s*` : ``}\\)`, `i`);
				const matches = regex.exec(source);
				if (!matches) {
					throw new SyntaxError(`Invalid ${format} format color syntax: '${source}'.`);
				}
				const [, hue, saturation, lightness, alpha] = matches.map((item) => Number.parseInt(item));
				return Color.viaHSL(hue, saturation, lightness, deep ? alpha : 1);
			};
			case ColorFormats.HEX: {
				const regex = new RegExp(`#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})${deep ? `([0-9a-f]{2})` : ``}`, `i`);
				const matches = regex.exec(source);
				if (!matches) {
					throw new SyntaxError(`Invalid ${format} format color syntax: '${source}'.`);
				}
				const [, red, green, blue, alpha] = matches.map((item) => Number.parseInt(item, 16));
				return Color.viaRGB(red, green, blue, deep ? alpha : 1);
			};
			default: throw new TypeError(`Invalid color format: '${format}'.`);
		}
	}
	/**
	 * Attempts to parse a string representation of a color into a Color object, trying different formats.
	 * @param {string} source The string representation of the color.
	 * @returns {Color?} The parsed Color object, or null if parsing fails.
	 */
	static tryParse(source) {
		for (const [format, deep] of Object.values(ColorFormats).flatMap((format) => (/** @type {[string, boolean][]} */ ([[format, false], [format, true]])))) {
			try {
				return Color.parse(source, deep, format);
			} catch {
				continue;
			}
		}
		return null;
	}
	//#endregion
	//#region Constructors
	/**
	 * Creates a Color object from RGB values.
	 * @param {number} red The red component, ranging from 0 to 255.
	 * @param {number} green The green component, ranging from 0 to 255.
	 * @param {number} blue The blue component, ranging from 0 to 255.
	 * @param {number} alpha The alpha (opacity) value, ranging from 0 to 1. Default is 1 (fully opaque).
	 * @returns {Color} The Color object representing the specified RGB color.
	 * @throws {RangeError} If any of the provided RGB values or alpha is out of range.
	 */
	static viaRGB(red, green, blue, alpha = 1) {
		if (red < 0 || red > 255) throw new RangeError(`Property 'red' out of range: ${red}`);
		if (green < 0 || green > 255) throw new RangeError(`Property 'green' out of range: ${green}`);
		if (blue < 0 || blue > 255) throw new RangeError(`Property 'blue' out of range: ${blue}`);
		if (alpha < 0 || alpha > 1) throw new RangeError(`Property 'alpha' out of range: ${alpha}`);
		const result = new Color();
		result.#green = trunc(green);
		result.#red = trunc(red);
		result.#blue = trunc(blue);
		[result.#hue, result.#saturation, result.#lightness] = Color.#RGBtoHSL(result.#red, result.#green, result.#blue);
		result.#alpha = alpha;
		return result;
	}
	/**
	 * Creates a Color object from HSL values.
	 * @param {number} hue The hue component, ranging from 0 to 360.
	 * @param {number} saturation The saturation component, ranging from 0 to 100.
	 * @param {number} lightness The lightness component, ranging from 0 to 100.
	 * @param {number} alpha= The alpha (opacity) value, ranging from 0 to 1. Default is 1 (fully opaque).
	 * @returns {Color} The Color object representing the specified HSL color.
	 * @throws {RangeError} If any of the provided HSL values or alpha is out of range.
	 */
	static viaHSL(hue, saturation, lightness, alpha = 1) {
		if (hue < 0 || hue > 360) throw new RangeError(`Property 'hue' out of range: ${hue}`);
		if (saturation < 0 || saturation > 100) throw new RangeError(`Property 'saturation' out of range: ${saturation}`);
		if (lightness < 0 || lightness > 100) throw new RangeError(`Property 'lightness' out of range: ${lightness}`);
		if (alpha < 0 || alpha > 1) throw new RangeError(`Property 'alpha' out of range: ${alpha}`);
		const result = new Color();
		result.#hue = trunc(hue);
		result.#saturation = trunc(saturation);
		result.#lightness = trunc(lightness);
		[result.#red, result.#green, result.#blue] = Color.#HSLtoRGB(result.#hue, result.#saturation, result.#lightness);
		result.#alpha = alpha;
		return result;
	}
	/**
	 * Creates a copy of the specified Color object.
	 * @param {Color} source The Color object to clone.
	 * @returns {Color} A new Color object with the same properties as the source color.
	 */
	static clone(source) {
		const result = new Color();
		result.#red = source.#red;
		result.#green = source.#green;
		result.#blue = source.#blue;
		result.#hue = source.#hue;
		result.#saturation = source.#saturation;
		result.#lightness = source.#lightness;
		result.#alpha = source.#alpha;
		return result;
	}
	//#endregion
	//#region Presets
	/**
	 * Transparent color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get TRANSPARENT() { return Color.viaRGB(0, 0, 0, 0); };
	/**
	 * Maroon color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get MAROON() { return Color.viaRGB(128, 0, 0); };
	/**
	 * Red color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get RED() { return Color.viaRGB(255, 0, 0); };
	/**
	 * Orange color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get ORANGE() { return Color.viaRGB(255, 165, 0); };
	/**
	 * Yellow color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get YELLOW() { return Color.viaRGB(255, 255, 0); };
	/**
	 * Olive color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get OLIVE() { return Color.viaRGB(128, 128, 0); };
	/**
	 * Green color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get GREEN() { return Color.viaRGB(0, 128, 0); };
	/**
	 * Purple color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get PURPLE() { return Color.viaRGB(128, 0, 128); };
	/**
	 * Fuchsia color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get FUCHSIA() { return Color.viaRGB(255, 0, 255); };
	/**
	 * Lime color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get LIME() { return Color.viaRGB(0, 255, 0); };
	/**
	 * Teal color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get TEAL() { return Color.viaRGB(0, 128, 128); };
	/**
	 * Aqua color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get AQUA() { return Color.viaRGB(0, 255, 255); };
	/**
	 * Blue color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get BLUE() { return Color.viaRGB(0, 0, 255); };
	/**
	 * Navy color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get NAVY() { return Color.viaRGB(0, 0, 128); };
	/**
	 * Black color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get BLACK() { return Color.viaRGB(0, 0, 0); };
	/**
	 * Gray color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get GRAY() { return Color.viaRGB(128, 128, 128); };
	/**
	 * Silver color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get SILVER() { return Color.viaRGB(192, 192, 192); };
	/**
	 * White color preset.
	 * @readonly
	 * @returns {Color}
	 */
	static get WHITE() { return Color.viaRGB(255, 255, 255); };
	//#endregion
	//#region Modifiers
	/**
	 * Mixes two colors based on a given ratio.
	 * @param {Color} first The first color to mix.
	 * @param {Color} second The second color to mix.
	 * @param {number} ratio The ratio of the mix (0 to 1).
	 * @returns {Color} The mixed color.
	 * @throws {RangeError} If the ratio is out of range.
	 */
	static mix(first, second, ratio = 0.5) {
		if (ratio < 0 || ratio > 1) throw new RangeError(`Property 'ratio' out of range: ${ratio}`);
		return Color.viaRGB(
			first.#red + (second.#red - first.#red) * ratio,
			first.#green + (second.#green - first.#green) * ratio,
			first.#blue + (second.#blue - first.#blue) * ratio
		);
	}
	/**
	 * Converts a color to grayscale.
	 * @param {Color} source The color to convert to grayscale.
	 * @param {number} scale The scale of the conversion (0 to 1).
	 * @returns {Color} The grayscale color.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static grayscale(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		const grayness = (source.#red + source.#green + source.#blue) / 3;
		return Color.viaRGB(
			source.#red + (grayness - source.#red) * scale,
			source.#green + (grayness - source.#green) * scale,
			source.#blue + (grayness - source.#blue) * scale
		);
	}
	/**
	 * Inverts a color.
	 * @param {Color} source The color to invert.
	 * @param {number} scale The scale of the inversion (0 to 1).
	 * @returns {Color} The inverted color.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static invert(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		const [red, green, blue] = [255 - source.#red, 255 - source.#green, 255 - source.#blue];
		return Color.viaRGB(
			source.#red + (red - source.#red) * scale,
			source.#green + (green - source.#green) * scale,
			source.#blue + (blue - source.#blue) * scale
		);
	}
	/**
	 * Applies a sepia tone effect to a color.
	 * @param {Color} source The color to apply the sepia effect to.
	 * @param {number} scale The scale of the effect (0 to 1).
	 * @returns {Color} The color with the sepia effect applied.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static sepia(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		const
			red = max(0, min(((source.#red * 0.393) + (source.#green * 0.769) + (source.#blue * 0.189)), 255)),
			green = max(0, min(((source.#red * 0.349) + (source.#green * 0.686) + (source.#blue * 0.168)), 255)),
			blue = max(0, min(((source.#red * 0.272) + (source.#green * 0.534) + (source.#blue * 0.131)), 255));
		return Color.viaRGB(
			source.#red + (red - source.#red) * scale,
			source.#green + (green - source.#green) * scale,
			source.#blue + (blue - source.#blue) * scale
		);
	}
	/**
	 * Rotates the hue of a color.
	 * @param {Color} source The color to rotate.
	 * @param {number} angle The angle of rotation.
	 * @returns {Color} The rotated color.
	 */
	static rotate(source, angle) {
		let hue = trunc(source.#hue + angle) % 361;
		if (hue < 0) hue += 360;
		return Color.viaHSL(hue, source.#saturation, source.#lightness);
	}
	/**
	 * Saturates a color.
	 * @param {Color} source The color to saturate.
	 * @param {number} scale The scale of saturation (0 to 1).
	 * @returns {Color} The saturated color.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static saturate(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		return Color.viaHSL(source.#hue, 100 * scale, source.#lightness);
	}
	/**
	 * Illuminates a color.
	 * @param {Color} source The color to illuminate.
	 * @param {number} scale The scale of illumination (0 to 1).
	 * @returns {Color} The illuminated color.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static illuminate(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		return Color.viaHSL(source.#hue, source.#saturation, 100 * scale);
	}
	/**
	 * Changes the alpha transparency of a color.
	 * @param {Color} source The color to change the transparency of.
	 * @param {number} scale The scale of transparency (0 to 1).
	 * @returns {Color} The color with adjusted transparency.
	 * @throws {RangeError} If the scale is out of range.
	 */
	static pass(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Property 'scale' out of range: ${scale}`);
		return Color.viaHSL(source.#hue, source.#saturation, source.#lightness, scale);
	}
	//#endregion
	//#region Properties
	/** @type {number} */
	#red = 0;
	/** 
	 * Gets the red component of the color.
	 * @returns {number} The red component.
	 */
	get red() {
		return this.#red;
	}
	/** 
	 * Sets the red component of the color.
	 * @param {number} value The red value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set red(value) {
		if (value < 0 || value > 255) throw new RangeError(`Property 'red' out of range: ${value}`);
		this.#red = trunc(value);
		[this.#hue, this.#saturation, this.#lightness] = Color.#RGBtoHSL(this.#red, this.#green, this.#blue);
	}
	/** @type {number} */
	#green = 0;
	/** 
	 * Gets the green component of the color.
	 * @returns {number} The green component.
	 */
	get green() {
		return this.#green;
	}
	/** 
	 * Sets the green component of the color.
	 * @param {number} value The green value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set green(value) {
		if (value < 0 || value > 255) throw new RangeError(`Property 'green' out of range: ${value}`);
		this.#green = trunc(value);
		[this.#hue, this.#saturation, this.#lightness] = Color.#RGBtoHSL(this.#red, this.#green, this.#blue);
	}
	/** @type {number} */
	#blue = 0;
	/** 
	 * Gets the blue component of the color.
	 * @returns {number} The blue component.
	 */
	get blue() {
		return this.#blue;
	}
	/** 
	 * Sets the blue component of the color.
	 * @param {number} value The blue value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set blue(value) {
		if (value < 0 || value > 255) throw new RangeError(`Property 'blue' out of range: ${value}`);
		this.#blue = trunc(value);
		[this.#hue, this.#saturation, this.#lightness] = Color.#RGBtoHSL(this.#red, this.#green, this.#blue);
	}
	/** @type {number} */
	#hue = 0;
	/** 
	 * Gets the hue component of the color.
	 * @returns {number} The hue component.
	 */
	get hue() {
		return this.#hue;
	}
	/** 
	 * Sets the hue component of the color.
	 * @param {number} value The hue value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set hue(value) {
		if (value < 0 || value > 360) throw new RangeError(`Property 'hue' out of range: ${value}`);
		this.#hue = trunc(value);
		[this.#red, this.#green, this.#blue] = Color.#HSLtoRGB(this.#hue, this.#saturation, this.#lightness);
	}
	/** @type {number} */
	#saturation = 0;
	/** 
	 * Gets the saturation component of the color.
	 * @returns {number} The saturation component.
	 */
	get saturation() {
		return this.#saturation;
	}
	/** 
	 * Sets the saturation component of the color.
	 * @param {number} value The saturation value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set saturation(value) {
		if (value < 0 || value > 100) throw new RangeError(`Property 'saturation' out of range: ${value}`);
		this.#saturation = trunc(value);
		[this.#red, this.#green, this.#blue] = Color.#HSLtoRGB(this.#hue, this.#saturation, this.#lightness);
	}
	/** @type {number} */
	#lightness = 0;
	/** 
	 * Gets the lightness component of the color.
	 * @returns {number} The lightness component.
	 */
	get lightness() {
		return this.#lightness;
	}
	/** 
	 * Sets the lightness component of the color.
	 * @param {number} value The lightness value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set lightness(value) {
		if (value < 0 || value > 100) throw new RangeError(`Property 'lightness' out of range: ${value}`);
		this.#lightness = trunc(value);
		[this.#red, this.#green, this.#blue] = Color.#HSLtoRGB(this.#hue, this.#saturation, this.#lightness);
	}
	/** @type {number} */
	#alpha = 1;
	/** 
	 * Gets the alpha component of the color.
	 * @returns {number} The alpha component.
	 */
	get alpha() {
		return this.#alpha;
	}
	/** 
	 * Sets the alpha component of the color.
	 * @param {number} value The alpha value to set.
	 * @throws {RangeError} If the value is out of range.
	 */
	set alpha(value) {
		if (value < 0 || value > 1) throw new RangeError(`Property 'alpha' out of range: ${value}`);
		this.#alpha = value;
	}
	//#endregion
	//#region Methods
	/**
	 * Converts the color to a string representation.
	 * @param {boolean} deep Indicates whether to include alpha channel in the output.
	 * @param {ColorFormats} format The color format to use for the string representation.
	 * @returns {string} The string representation of the color.
	 */
	toString(deep = false, format = ColorFormats.RGB) {
		return Color.stringify(this, deep, format);
	}
	/**
	 * Creates a clone of the color.
	 * @returns {Color} A clone of the color.
	 */
	clone() {
		return Color.clone(this);
	}
	/**
	 * Mixes the color with another color.
	 * @param {Color} other The other color to mix with.
	 * @param {number} ratio The ratio of the mixture. Default is 0.5.
	 * @returns {Color} The mixed color.
	 */
	mix(other, ratio = 0.5) {
		return Color.mix(this, other, ratio);
	}
	/**
	 * Converts the color to grayscale.
	 * @param {number} scale The scale factor for the grayscale conversion. Default is 1.
	 * @returns {Color} The grayscale color.
	 */
	grayscale(scale = 1) {
		return Color.grayscale(this, scale);
	}
	/**
	 * Inverts the color.
	 * @param {number} scale The scale factor for the inversion. Default is 1.
	 * @returns {Color} The inverted color.
	 */
	invert(scale = 1) {
		return Color.invert(this, scale);
	}
	/**
	 * Applies sepia effect to the color.
	 * @param {number} scale The scale factor for the sepia effect. Default is 1.
	 * @returns {Color} The color with sepia effect applied.
	 */
	sepia(scale = 1) {
		return Color.sepia(this, scale);
	}
	/**
	 * Rotates the hue of the color.
	 * @param {number} angle The angle of rotation in degrees.
	 * @returns {Color} The color with rotated hue.
	 */
	rotate(angle) {
		return Color.rotate(this, angle);
	}
	/**
	 * Saturates the color.
	 * @param {number} scale The scale factor for saturation.
	 * @returns {Color} The saturated color.
	 */
	saturate(scale) {
		return Color.saturate(this, scale);
	}
	/**
	 * Illuminates the color.
	 * @param {number} scale The scale factor for illumination.
	 * @returns {Color} The illuminated color.
	 */
	illuminate(scale) {
		return Color.illuminate(this, scale);
	}
	/**
	 * Passes the color.
	 * @param {number} scale The scale factor.
	 * @returns {Color} The passed color.
	 */
	pass(scale) {
		return Color.pass(this, scale);
	}
	//#endregion
}
//#endregion

//#region Texture
/**
 * Represents a texture.
 * @extends {Matrix<Color>}
 */
class Texture extends Matrix {
	//#region Converters
	/**
	 * Converts the texture to ImageData.
	 * @param {Texture} texture The texture to convert.
	 * @returns {ImageData} The converted ImageData.
	 */
	static toImageData(texture) {
		const imageData = new ImageData(texture.size.x, texture.size.y);
		const data = imageData.data;
		for (let y = 0; y < texture.size.y; y++) {
			for (let x = 0; x < texture.size.x; x++) {
				const position = new Point2D(x, y);
				const index = texture.size.x * y + x;
				const color = texture.get(position);
				data[index * 4 + 0] = color.red;
				data[index * 4 + 1] = color.green;
				data[index * 4 + 2] = color.blue;
				data[index * 4 + 3] = color.alpha;
			}
		}
		return imageData;
	}
	/**
	 * Creates a texture from ImageData.
	 * @param {ImageData} imageData The ImageData to create the texture from.
	 * @returns {Texture} The created texture.
	 */
	static fromImageData(imageData) {
		const texture = new Texture(new Point2D(imageData.width, imageData.height));
		const data = imageData.data;
		for (let y = 0; y < texture.size.y; y++) {
			for (let x = 0; x < texture.size.x; x++) {
				const position = new Point2D(x, y);
				const index = texture.size.x * y + x;
				const color = Color.viaRGB(
					data[index * 4 + 0],
					data[index * 4 + 1],
					data[index * 4 + 2],
					data[index * 4 + 3],
				);
				texture.set(position, color);
			}
		}
		return texture;
	}
	//#endregion
	//#region Contructors
	/**
	 * Clones the texture.
	 * @param {Texture} texture The texture to clone.
	 * @returns {Texture} The cloned texture.
	 */
	static clone(texture) {
		const result = new Texture(texture.size);
		for (let y = 0; y < texture.size.y; y++) {
			for (let x = 0; x < texture.size.x; x++) {
				const position = new Point2D(x, y);
				texture.set(position, texture.get(position).clone());
			}
		}
		return texture;
	}
	/**
	 * @param {Readonly<Point2D>} size The size of the texture.
	 */
	constructor(size) {
		super(size, Color.TRANSPARENT);
	}
	//#endregion
	//#region Modifiers
	/**
	 * Mixes two textures.
	 * @param {Texture} first The first texture.
	 * @param {Texture} second The second texture.
	 * @param {number} ratio The ratio of mixing.
	 * @returns {Texture} The mixed texture.
	 */
	static mix(first, second, ratio = 0.5) {
		if (ratio < 0 || ratio > 1) throw new RangeError(`Ratio ${ratio} out of range [0 - 1]`);
		const result = first.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, first.get(position).mix(second.get(position), ratio));
			}
		}
		return result;
	}
	/**
	 * Converts the texture to grayscale.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of the grayscale effect.
	 * @returns {Texture} The grayscale texture.
	 */
	static grayscale(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).grayscale(scale));
			}
		}
		return result;
	}
	/**
	 * Inverts the colors of the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of the inversion effect.
	 * @returns {Texture} The inverted texture.
	 */
	static invert(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).invert(scale));
			}
		}
		return result;
	}
	/**
	 * Applies sepia effect to the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of the sepia effect.
	 * @returns {Texture} The texture with sepia effect.
	 */
	static sepia(source, scale = 1) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).sepia(scale));
			}
		}
		return result;
	}
	/**
	 * Rotates the hue of the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} angle The angle of rotation.
	 * @returns {Texture} The rotated texture.
	 */
	static rotate(source, angle) {
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).rotate(angle));
			}
		}
		return result;
	}
	/**
	 * Saturates the colors of the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of saturation effect.
	 * @returns {Texture} The saturated texture.
	 */
	static saturate(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).saturate(scale));
			}
		}
		return result;
	}
	/**
	 * Illuminates the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of illumination.
	 * @returns {Texture} The illuminated texture.
	 */
	static illuminate(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).illuminate(scale));
			}
		}
		return result;
	}
	/**
	 * Sets the transparency of the texture.
	 * @param {Texture} source The source texture.
	 * @param {number} scale The scale of transparency.
	 * @returns {Texture} The texture with transparency.
	 */
	static pass(source, scale) {
		if (scale < 0 || scale > 1) throw new RangeError(`Scale ${scale} out of range [0 - 1]`);
		const result = source.clone();
		for (let y = 0; y < result.size.y; y++) {
			for (let x = 0; x < result.size.x; x++) {
				const position = new Point2D(x, y);
				result.set(position, source.get(position).pass(scale));
			}
		}
		return result;
	}
	//#endregion
	//#region Methods
	/**
	 * Clones the texture.
	 * @returns {Texture} The cloned texture.
	 */
	clone() {
		return Texture.clone(this);
	}
	/**
	 * Mixes this texture with another texture.
	 * @param {Texture} other The other texture to mix.
	 * @param {number} ratio The ratio of mixing.
	 * @returns {Texture} The mixed texture.
	 */
	mix(other, ratio = 0.5) {
		return Texture.mix(this, other, ratio);
	}
	/**
	 * Converts the texture to grayscale.
	 * @param {number} scale The scale of the grayscale effect.
	 * @returns {Texture} The grayscale texture.
	 */
	grayscale(scale = 1) {
		return Texture.grayscale(this, scale);
	}
	/**
	 * Inverts the colors of the texture.
	 * @param {number} scale The scale of the inversion effect.
	 * @returns {Texture} The inverted texture.
	 */
	invert(scale = 1) {
		return Texture.invert(this, scale);
	}
	/**
	 * Applies sepia effect to the texture.
	 * @param {number} scale The scale of the sepia effect.
	 * @returns {Texture} The texture with sepia effect.
	 */
	sepia(scale = 1) {
		return Texture.sepia(this, scale);
	}
	/**
	 * Rotates the hue of the texture.
	 * @param {number} angle The angle of rotation.
	 * @returns {Texture} The rotated texture.
	 */
	rotate(angle) {
		return Texture.rotate(this, angle);
	}
	/**
	 * Saturates the colors of the texture.
	 * @param {number} scale The scale of saturation effect.
	 * @returns {Texture} The saturated texture.
	 */
	saturate(scale) {
		return Texture.saturate(this, scale);
	}
	/**
	 * Illuminates the texture.
	 * @param {number} scale The scale of illumination.
	 * @returns {Texture} The illuminated texture.
	 */
	illuminate(scale) {
		return Texture.illuminate(this, scale);
	}
	/**
	 * Sets the transparency of the texture.
	 * @param {number} scale The scale of transparency.
	 * @returns {Texture} The texture with transparency.
	 */
	pass(scale) {
		return Texture.pass(this, scale);
	}
	//#endregion
};
//#endregion

export { ColorFormats, Color, Texture };
