/**@typedef {import("./structure.js").AbilityMetadata} AbilityMetadata */
/**@typedef {import("./structure.js").ElementalBoard} ElementalBoard */

"use strict";

import { Random } from "./modules/generators.js";
import { Point2D } from "./modules/measures.js";
import { Color } from "./modules/palette.js";
import { Ability, Elemental, board } from "./structure.js";

//#region Dirt
class Dirt extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Dirt`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(150, 100, 80);
	}
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([]);
	}
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([]);
	}
}
board.cases.set(Dirt, 90);
//#endregion
//#region Grass
class Grass extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Grass`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(0, 128, 0);
	}
	/** @type {AbilityMetadata} */
	static #metaGrow = new Ability.Metadata(`Grow`, `Description`, 10);
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([Grass.#metaGrow]);
	}
	constructor() {
		super();
		const random = Random.global;

		this.addEventListener(`spawn`, (event) => {
			const board = this.board;

			this.#grow.addEventListener(`execute`, (event) => {
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
				} else event.preventDefault();
			});
		});
	}
	/** @type {Ability} */
	#grow = new Ability(Grass.#metaGrow);
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([this.#grow]);
	}
}
board.cases.set(Grass, 4);
//#endregion
//#region Fire
class Fire extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Fire`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(255, 150, 0);
	}
	/** @type {AbilityMetadata} */
	static #metaBurn = new Ability.Metadata(`Burn`, `Description`, 4);
	/** @type {AbilityMetadata} */
	static #metaFade = new Ability.Metadata(`Fade`, `Description`, 16);
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([Fire.#metaBurn, Fire.#metaFade]);
	}
	constructor() {
		super();
		const random = Random.global;

		this.addEventListener(`spawn`, (event) => {
			const board = this.board;

			this.#burn.addEventListener(`execute`, (event) => {
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
				} else event.preventDefault();
			});

			this.#fade.addEventListener(`execute`, (event) => {
				board.spawnElementOfType(this.position, Dirt);
				event.preventDefault();
			});
		});
	}
	/** @type {Ability} */
	#burn = new Ability(Fire.#metaBurn);
	/** @type {Ability} */
	#fade = new Ability(Fire.#metaFade);
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([this.#burn, this.#fade]);
	}
}
board.cases.set(Fire, 2);
//#endregion
//#region Water
class Water extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Water`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(0, 50, 255);
	}
	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 8);
	/** @type {AbilityMetadata} */
	static #metaEvaporate = new Ability.Metadata(`Evaporate`, `Description`, 8);
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([Water.#metaFlow, Water.#metaEvaporate]);
	}
	constructor() {
		super();
		const random = Random.global;

		this.addEventListener(`spawn`, (event) => {
			const board = this.board;

			this.#flow.addEventListener(`execute`, (event) => {
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
				} else event.preventDefault();
			});

			this.#evaporate.addEventListener(`execute`, (event) => {
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
				} else event.preventDefault();
			});
		});
	}
	/** @type {Ability} */
	#flow = new Ability(Water.#metaFlow);
	/** @type {Ability} */
	#evaporate = new Ability(Water.#metaEvaporate);
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([this.#flow, this.#evaporate]);
	}
}
board.cases.set(Water, 2);
//#endregion
//#region Lava
class Lava extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Lava`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(255, 0, 0);
	}
	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 15);
	/** @type {AbilityMetadata} */
	static #metaBurn = new Ability.Metadata(`Burn`, `Description`, 8);
	/** @type {AbilityMetadata} */
	static #metaFade = new Ability.Metadata(`Fade`, `Description`, 4);
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([Lava.#metaFlow, Lava.#metaBurn, Lava.#metaFade]);
	}
	/** @type {number} */
	static #maxDensity = 3;
	constructor() {
		super();
		const random = Random.global;

		this.addEventListener(`spawn`, (event) => {
			const board = this.board;

			this.#flow.addEventListener(`execute`, (event) => {
				const positions = [
					new Point2D(this.position.x, this.position.y - 1),
					new Point2D(this.position.x - 1, this.position.y),
					new Point2D(this.position.x + 1, this.position.y),
					new Point2D(this.position.x, this.position.y + 1),
				];
				const targets = board.getElementsOfType(positions, Dirt);
				if (targets.length > 0 && this.#density > 0) {
					const target = random.item(targets);
					const descendant = board.spawnElementOfType(target.position, Lava);
					descendant.#density = this.#density - 1;
				} else event.preventDefault();
			});

			this.#burn.addEventListener(`execute`, (event) => {
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
				} else event.preventDefault();
			});

			this.#fade.addEventListener(`execute`, (event) => {
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
				} event.preventDefault();
			});
		});
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	get color() {
		return Color.mix(Fire.color, Lava.color, this.#density / Lava.#maxDensity);
	}
	/** @type {number} */
	#density = Lava.#maxDensity;
	/** @type {Ability} */
	#flow = new Ability(Lava.#metaFlow);
	/** @type {Ability} */
	#burn = new Ability(Lava.#metaBurn);
	/** @type {Ability} */
	#fade = new Ability(Lava.#metaFade);
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([this.#flow, this.#burn, this.#fade]);
	}
}
board.cases.set(Lava, 1);
//#endregion
//#region Ice
class Ice extends Elemental {
	/**
	 * @readonly
	 * @returns {string}
	 */
	static get name() {
		return `Ice`;
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	static get color() {
		return Color.viaRGB(0, 200, 255);
	}
	/** @type {AbilityMetadata} */
	static #metaFlow = new Ability.Metadata(`Flow`, `Description`, 12);
	/** @type {AbilityMetadata} */
	static #metaMelt = new Ability.Metadata(`Melt`, `Description`, 4);
	/** @type {AbilityMetadata} */
	static #metaEvaporate = new Ability.Metadata(`Evaporate`, `Description`, 4);
	/**
	 * @readonly
	 * @returns {Readonly<AbilityMetadata[]>}
	 */
	static get abilities() {
		return Object.freeze([Ice.#metaFlow, Ice.#metaMelt, Ice.#metaEvaporate]);
	}
	/** @type {number} */
	static #maxDensity = 3;
	constructor() {
		super();
		const random = Random.global;

		this.addEventListener(`spawn`, (event) => {
			const board = this.board;

			this.#flow.addEventListener(`execute`, (event) => {
				const positions = [
					new Point2D(this.position.x, this.position.y - 1),
					new Point2D(this.position.x - 1, this.position.y),
					new Point2D(this.position.x + 1, this.position.y),
					new Point2D(this.position.x, this.position.y + 1),
				];
				const targets = board.getElementsOfType(positions, Dirt);
				if (targets.length > 0 && this.#density > 0) {
					const target = random.item(targets);
					const descendant = board.spawnElementOfType(target.position, Ice);
					descendant.#density = this.#density - 1;
				} else event.preventDefault();
			});

			this.#melt.addEventListener(`execute`, (event) => {
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
				} event.preventDefault();
			});

			this.#evaporate.addEventListener(`execute`, (event) => {
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
				} event.preventDefault();
			});
		});
	}
	/**
	 * @readonly
	 * @returns {Color}
	 */
	get color() {
		return Color.mix(Water.color, Ice.color, this.#density / Ice.#maxDensity);
	}
	/** @type {number} */
	#density = Ice.#maxDensity;
	/** @type {Ability} */
	#flow = new Ability(Ice.#metaFlow);
	/** @type {Ability} */
	#melt = new Ability(Ice.#metaMelt);
	/** @type {Ability} */
	#evaporate = new Ability(Ice.#metaEvaporate);
	/**
	 * @readonly
	 * @returns {Readonly<Ability[]>}
	 */
	get abilities() {
		return Object.freeze([this.#flow, this.#melt, this.#evaporate]);
	}
}
board.cases.set(Ice, 1);
//#endregion
