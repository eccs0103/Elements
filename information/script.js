"use strict";

import { ArchiveManager } from "../scripts/modules/storage.js";
import { Elemental, Settings } from "../scripts/structure.js";

//#region Initialize
const managerSettings = await ArchiveManager.construct(`${navigator.dataPath}.Elements`, Settings);
const board = Elemental.Board.self;
const divElementsContainer = await window.ensure(() => document.getElement(HTMLDivElement, `div#elements-container`));
const templateElementFragment = await window.ensure(() => document.getElement(HTMLTemplateElement, `template#element-fragment`));
const templateAbilityFragment = await window.ensure(() => document.getElement(HTMLTemplateElement, `template#ability-fragment`));
//#endregion
//#region Main
navigator.colorScheme = managerSettings.data.colorScheme;

await window.load(Promise.withSignal((signal, resolve, reject) => window.ensure(() => {
	const scriptElements = document.createElement(`script`);
	scriptElements.type = `module`;
	scriptElements.src = `../scripts/elements.js`;
	scriptElements.addEventListener(`load`, (event) => resolve(undefined), { signal });
	scriptElements.addEventListener(`error`, (event) => reject(event.error), { signal });
	document.head.appendChild(scriptElements);
})));

window.ensure(() => {
	const summary = Array.from(board.cases).reduce((previous, [, percentage]) => previous + percentage, 0);
	let index = 0;
	for (const [element, probability] of board.cases) {
		if (index !== 0) {
			const hr = divElementsContainer.appendChild(document.createElement(`hr`));
			hr.classList.add(`depth`);
		}
		const fragmentElement = templateElementFragment.content.cloneNode(true);
		if (!(fragmentElement instanceof DocumentFragment)) throw new EvalError(`Invalid result of fragment clone`);

		const rectAvatarIcon = fragmentElement.getElement(SVGRectElement, `rect#element-0-avatar-icon`);
		rectAvatarIcon.id = `rect#element-${index}-avatar-icon`;
		rectAvatarIcon.setAttribute(`fill`, element.color.toString(true));

		const h2ElementName = fragmentElement.getElement(HTMLHeadingElement, `h2#element-0-name`);
		h2ElementName.id = `element-${index}-name`;
		h2ElementName.textContent = element.name;

		const ddElementProbability = fragmentElement.getElement(HTMLElement, `dd#element-0-probability`);
		ddElementProbability.id = `element-${index}-probability`;
		ddElementProbability.textContent = `${(probability / summary * 100).toFixed(2)}%`;

		const dlElementAbilitiesContainer = fragmentElement.getElement(HTMLElement, `dl#element-0-abilities-container`);
		dlElementAbilitiesContainer.id = `element-${index}-abilities-container`;

		let index2 = 0;
		for (const metadata of element.metaset) {
			const fragmentAbility = templateAbilityFragment.content.cloneNode(true);
			if (!(fragmentAbility instanceof DocumentFragment)) throw new EvalError(`Invalid result of fragment clone`);

			const dtElementAbilityName = fragmentAbility.getElement(HTMLElement, `dt#element-0-ability-0-name`);
			dtElementAbilityName.id = `element-${index}-ability-${index2}-name`;
			dtElementAbilityName.textContent = metadata.name;

			const ddElementAbilityPreparation = fragmentAbility.getElement(HTMLElement, `dd#element-0-ability-0-preparation`);
			ddElementAbilityPreparation.id = `element-${index}-ability-${index2}-preparation`;
			ddElementAbilityPreparation.textContent = `Preparation: ${metadata.preparation} frame(s)`;

			const ddElementAbilityDescription = fragmentAbility.getElement(HTMLElement, `dd#element-0-ability-0-description`);
			ddElementAbilityDescription.id = `element-${index}-ability-${index2}-description`;
			ddElementAbilityDescription.textContent = metadata.description;

			dlElementAbilitiesContainer.appendChild(fragmentAbility);
			index2++;
		}

		divElementsContainer.appendChild(fragmentElement);
		index++;
	}
});
//#endregion
