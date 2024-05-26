/**@typedef {import("./structure.js").AbilityMetadata} AbilityMetadata */
/**@typedef {import("./structure.js").ElementalBoard} ElementalBoard */

"use strict";

import { Random } from "./modules/generators.js";
import { Point2D } from "./modules/measures.js";
import { Color } from "./modules/palette.js";
import { Ability, Elemental } from "./structure.js";

const random = Random.global;
const board = Elemental.Board.self;

//#region Dirt
class Dirt extends Elemental {
	/** @type {string} */
	static #name = `Dirt`;
	/** @readonly @returns {string} */
	static get name() { return Dirt.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(150, 100, 80));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Dirt.#color; }

	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Dirt.#metadata; }

	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Dirt, 90);
//#endregion
//#region Grass
class Grass extends Elemental {
	/** @type {string} */
	static #name = `Grass`;
	/** @readonly @returns {string} */
	static get name() { return Grass.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(0, 128, 0));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Grass.#color; }

	/** @type {AbilityMetadata} */
	static #metaGrow = new Ability.Metadata(`Grow`, `Description`, 10);
	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([Grass.#metaGrow]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Grass.#metadata; }

	/** @type {Ability} */
	#grow = new Ability(Grass.#metaGrow, (invoker) => {
		const positions = [
			new Point2D(this.position.x - 1, this.position.y - 1),
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x + 1, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x - 1, this.position.y + 1),
			new Point2D(this.position.x, this.position.y + 1),
			new Point2D(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementsOfType(positions, Dirt);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Grass);
			invoker.change();
		}
	});
	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([this.#grow]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Grass, 4);
//#endregion
//#region Fire
class Fire extends Elemental {
	/** @type {string} */
	static #name = `Fire`;
	/** @readonly @returns {string} */
	static get name() { return Fire.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(255, 150, 0));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Fire.#color; }

	/** @type {AbilityMetadata} */
	static #metaBurn = new Ability.Metadata(`Burn`, `Description`, 4);
	/** @type {AbilityMetadata} */
	static #metaFade = new Ability.Metadata(`Fade`, `Description`, 16);
	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([Fire.#metaBurn, Fire.#metaFade]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Fire.#metadata; }

	/** @type {Ability} */
	#burn = new Ability(Fire.#metaBurn, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Fire);
			this.#fade.progress = 0;
			invoker.change();
		}
	});
	/** @type {Ability} */
	#fade = new Ability(Fire.#metaFade, (invoker) => {
		board.spawnElementOfType(this.position, Dirt);
	});
	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([this.#burn, this.#fade]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Fire, 2);
//#endregion
//#region Water
class Water extends Elemental {
	/** @type {string} */
	static #name = `Water`;
	/** @readonly @returns {string} */
	static get name() { return Water.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(0, 50, 255));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Water.#color; }

	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 8);
	/** @type {AbilityMetadata} */
	static #metaEvaporate = new Ability.Metadata(`Evaporate`, `Description`, 8);
	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([Water.#metaFlow, Water.#metaEvaporate]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Water.#metadata; }

	/** @type {Ability} */
	#flow = new Ability(Water.#metaFlow, (invoker) => {
		const positions = [
			new Point2D(this.position.x - 1, this.position.y - 1),
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x + 1, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x - 1, this.position.y + 1),
			new Point2D(this.position.x, this.position.y + 1),
			new Point2D(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementsOfType(positions, Dirt);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Water);
			invoker.change();
		}
	});
	/** @type {Ability} */
	#evaporate = new Ability(Water.#metaEvaporate, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Dirt);
			board.spawnElementOfType(this.position, Dirt);
			invoker.change();
		}
	});
	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([this.#flow, this.#evaporate]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Water, 2);
//#endregion
//#region Lava
class Lava extends Elemental {
	/** @type {string} */
	static #name = `Lava`;
	/** @readonly @returns {string} */
	static get name() { return Lava.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(255, 0, 0));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Lava.#color; }

	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 15);
	/** @type {AbilityMetadata} */
	static #metaBurn = new Ability.Metadata(`Burn`, `Description`, 8);
	/** @type {AbilityMetadata} */
	static #metaFade = new Ability.Metadata(`Fade`, `Description`, 4);
	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([Lava.#metaFlow, Lava.#metaBurn, Lava.#metaFade]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Lava.#metadata; }
	/** @type {number} */
	static #maxDensity = 3;

	/** @readonly @returns {Color} */
	get color() {
		return Color.mix(Fire.color, Lava.color, this.#density / Lava.#maxDensity);
	}
	/** @type {number} */
	#density = Lava.#maxDensity;
	/** @type {Ability} */
	#flow = new Ability(Lava.#metaFlow, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Dirt);
		if (targets.length > 0 && this.#density > 1) {
			const target = random.item(targets);
			const descendant = board.spawnElementOfType(target.position, Lava);
			descendant.#density = this.#density - 1;
			invoker.change();
		}
	});
	/** @type {Ability} */
	#burn = new Ability(Lava.#metaBurn, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Fire);
			invoker.change();
		}
	});
	/** @type {Ability} */
	#fade = new Ability(Lava.#metaFade, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Water);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Dirt);
			if (this.#density > 0) {
				this.#density--;
			} else {
				board.spawnElementOfType(this.position, Fire);
			}
			invoker.change();
		}
	});
	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([this.#flow, this.#burn, this.#fade]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Lava, 1);
//#endregion
//#region Ice
class Ice extends Elemental {
	/** @type {string} */
	static #name = `Ice`;
	/** @readonly @returns {string} */
	static get name() { return Ice.#name; }

	/** @type {Readonly<Color>} */
	static #color = Object.freeze(Color.viaRGB(0, 200, 255));
	/** @readonly @returns {Readonly<Color>} */
	static get color() { return Ice.#color; }

	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 12);
	/** @type {AbilityMetadata} */
	static #metaMelt = new Ability.Metadata(`Melt`, `Description`, 4);
	/** @type {AbilityMetadata} */
	static #metaEvaporate = new Ability.Metadata(`Evaporate`, `Description`, 4);
	/** @type {Readonly<AbilityMetadata[]>} */
	static #metadata = Object.freeze([Ice.#metaFlow, Ice.#metaMelt, Ice.#metaEvaporate]);
	/** @readonly @returns {Readonly<AbilityMetadata[]>} */
	static get metadata() { return Ice.#metadata; }
	/** @type {number} */
	static #maxDensity = 3;

	/** @readonly @returns {Color} */
	get color() {
		return Color.mix(Water.color, Ice.color, this.#density / Ice.#maxDensity);
	}
	/** @type {number} */
	#density = Ice.#maxDensity;
	/** @type {Ability} */
	#flow = new Ability(Ice.#metaFlow, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Dirt);
		if (targets.length > 0 && this.#density > 1) {
			const target = random.item(targets);
			const descendant = board.spawnElementOfType(target.position, Ice);
			descendant.#density = this.#density - 1;
			invoker.change();
		}
	});
	/** @type {Ability} */
	#melt = new Ability(Ice.#metaMelt, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Dirt);
			if (this.#density > 0) {
				this.#density--;
			} else {
				board.spawnElementOfType(this.position, Water);
			}
			invoker.change();
		}
	});
	/** @type {Ability} */
	#evaporate = new Ability(Ice.#metaEvaporate, (invoker) => {
		const positions = [
			new Point2D(this.position.x, this.position.y - 1),
			new Point2D(this.position.x - 1, this.position.y),
			new Point2D(this.position.x + 1, this.position.y),
			new Point2D(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Lava);
		if (targets.length > 0) {
			const target = random.item(targets);
			board.spawnElementOfType(target.position, Dirt);
			board.spawnElementOfType(this.position, Dirt);
			invoker.change();
		}
	});
	/** @type {Readonly<Ability[]>} */
	#abilities = Object.freeze([this.#flow, this.#melt, this.#evaporate]);
	/** @readonly @returns {Readonly<Ability[]>} */
	get abilities() { return this.#abilities; }
}
board.cases.set(Ice, 1);
//#endregion
