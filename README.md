# Elements
A sandbox-style game.

![Screenshot](https://imgur.com/hN4VArk.png)

© Adaptive Core 2023  
- - -
## Guide
A sandbox with an automatically generated board that can be launched to observe the interactions between elements. But the main focus of the game is not the random generation of the board, but the support for user code. After all, you can edit or remove built-in elements, create your own elements, add interaction principles with other elements, and connect them to the board. User-created elements will also be generated on the board with a specified percentage and fully supported by the game. The structure of the elements and their interactions is contained in the `elements.js` file, which can be edited as desired. To create custom elements, it is recommended to look at the code of the built-in elements or the example of a user element below.
```js
//#region Sample Element // It is recommended to encapsulate each element in a separate region.
class SampleElement extends Elemental { // All elements should extend the Elemental class.
	static title = `Sample Element`; // A static field named "title" is created to store the name of this type of element.
	static color = new Color(0, 0, 0); // Similarly, a "color" field is created to store the color.
	static durationSampleAbility = 1; // It is recommended to create a separate variable for each ability indicating its preparation duration.
	constructor() {
		super(); // The parent constructor is called at the beginning without arguments.
		this._title = SampleElement.title; // The type name is passed to individual instances.
		this._color = SampleElement.color; // Similarly, the color is passed.
		this.abilities.push(this.#sampleAbility); // Abilities are attached. More about them below.
	}
	#sampleAbility = new Ability(`Sample Ability`, () => { // Each ability is stored in a private field. The Ability class is used to create abilities.
		// Actions performed when the ability is used.
		return true; // Reset the progress of the ability after it is used? A value of true corresponds to resetting.
	}, SampleElement.durationSampleAbility); // Passing the duration.
}
board.cases.set(SampleElement, 50); // After creating the element, it is connected in the following way, where the second parameter indicates the percentage of appearance of this element. Note that the appearance percentages of other elements also affect the result.
//#endregion
```
- - -
## News
### Update 2.6.4 (21.06.2023)
- Updated internal engine.  
- Fixed design issues.  
- Updated design layout.  
- Improved adaptation for mobile devices.  
- Enhanced internal modules.  
- Changed rendering algorithm.  
- Improved translation.  

### Update 2.5.7 (17.05.2023)
- Improved internal engine.  
- Fixed rendering issue.  

### Update 2.5.5 (04.02.2023)
- Added the ability to take a snapshot of the board.  
- Added the option to change the game loop in the settings.  
- Fixed a version compatibility issue with settings.  
- Improved design.  

### Patch 2.5.3 (31.01.2023)
- Fixed design issues where the board with a size of 101 or larger would go beyond the page boundaries.  
- Adapted the control panel to different themes.  

### Update 2.5.2 - Custom code support (30.01.2023)
- Improved HTML structure.  
- Changed the sandbox icon.  
- Updated styles.  
- Fixed design issues.  
- Added code descriptions.  
- Improved modules for easier operation.  
- Enhanced code structure.  
- Reduced code redundancy.  
- Added full support for user scripts.  
- Optimized element counter functionality.  
- Improved theme settings.  
- Enhanced error descriptions.  
- Removed unstable functions.  
- Added a sample of user code.  

### Update 2.1.6 (20.11.2022)
- Added the ability to change the absolute frames per second (FPS) count in the settings menu.  
- Accelerated the operation of settings and saves.  
- Changed the icon on the main page.  
- Added icons at the top of the pages.  
- Activated a safe mode to preserve data integrity in case of errors.  
- Available update check when connected to the internet from the settings menu.  

### Update 2.1.3 (13.11.2022)
- Now it is possible to hide elements with a zero count in the element counter.  
- Improved settings structure.  
- Enhanced dropdown menu structure in the settings.  

### Update 2.1.2
- Added a settings section.  
- The theme can be changed in the settings.  
- The FPS counter can be hidden or shown in the settings.  
- The element counter can be hidden or shown in the settings.  
- The board size can be changed in the settings.  
- Fixed internal program structure.  
- Fixed styles.  
- Added effects.  
- Fixed fonts.  
- Added warning hints about data loss.  
- Changed the color of the Dirt element (previously Void).  
- Optimized program performance.  
- Fixed the movement indicator for the board.  

### Update 2.0.5
- Updated design.  
- Added a dark theme (internal toggle).  
- Changed the structure of the elements.  
- Fixed an issue with incorrect layer rendering.  
- Added small effects.  

### Update 2.0.2
- Added color for the FPS counter.  
- Added an element table.  
- Improved board structure.  

### Update 2.0.0
- The game has been rewritten in JS (with JSDoc support).  
- The entire game structure has been changed.  
- Dynamic internal interactions have been added (for now).  
- Custom elements have been added.  
- The FPS counter has been added.  

...