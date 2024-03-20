function drawSection(section) {
	$("canvas").clearCanvas();
	drawChart();
	//YOU NEED TO INCLUDE ANGLESTEP IN THE FUNCTION ARGUMENTS
	//var x = centerX - Math.sin(t) * r;
	//var y = centerY - Math.cos(t) * r;
	section.forEach(chair => drawSectionXY(chair));
}

function addChairToSection(chair, sectionName) {
	// also, you need to check for adjacency.
	const section = sections[sectionName];
	const sectionObjFromClass = sectionsClassTest[sectionName];
	
	console.log('addChairToSection: ',"section from addChairToSection", section);
	
	// 1) check if chair already has a section
	// 2) check if chair exists in current section
	// 3) check adjacency
	// 4) now we can add the chair
	const chairIsUnassigned = isChairUnassignedOrInSection(chair, sectionObjFromClass)
	const chairAlreadyExistsInSection = doesChairExistInSection(chair, sectionObjFromClass)
	const sectionIsEmpty = sectionObjFromClass.isEmpty()
	  
	const chairIsAdjacent = sectionChairIsAdjacent(chair, section);


	//const chairExists = section.some(existingChair => existingChair === chair); //Where 'section' is an Array
	//const sectionIsEmpty = section.length === 0; //Where 'section' is an Array
	console.log('addChairToSection: ','chairIsUnassigned',chairIsUnassigned)
	console.log('addChairToSection: ','sectionIsEmpty',sectionIsEmpty)
	console.log('addChairToSection: ','chairAlreadyExistsInSection', chairAlreadyExistsInSection)

	console.log('addChairToSection: ','chairIsAdjacent',chairIsAdjacent)

	//ADD CHAIR LOGIC: if 
    if (chairIsUnassigned && !chairAlreadyExistsInSection && ( sectionIsEmpty || chairIsAdjacent )) {
        section.push(chair);
		sectionObjFromClass.addChair(chair)
        chair.section = sectionName; // Assign or reassign the chair's section property.
		drawSection(section)
    }
	//GET RID OF CHAIR if. it is in the section, and is adjacent 
	else if (chairAlreadyExistsInSection && ( sectionIsEmpty || chairIsAdjacent )) {
        const sectionChairIndex = section.indexOf(chair);
		section.splice(sectionChairIndex, 1);
		sectionObjFromClass.removeChair(chair)
		chair.section = null;
		console.log('addChairToSection: ',"Chair already exists in this section.");
		drawSection(section);
    }
    // You might want to redraw or update the UI to reflect the chair being added to the section
	console.log('addChairToSection: ',"chair from addChairToSection", chair);

	console.log('addChairToSection: ','sections list', sections);
    
	//drawChart();
}



/**
 * Checks if a chair is either not assigned to any section or is already assigned to the specified section.
 * This is useful for ensuring that a chair is not mistakenly assigned to multiple sections or to verify
 * the chair's current assignment status relative to a specific section.
 *
 * @param {Object} chair - The chair object to check, expected to have a `section` property that indicates
 *                         the name of the section it is currently assigned to, if any.
 * @param {Section} section - The section object or structure against which to check the chair's assignment.
 *                            This object must have a `name` property to identify the section.
 * @returns {boolean} Returns `true` if the chair is unassigned or if it belongs to the specified section,
 *                    based on a comparison of the chair's `section` property and the section's `name`.
 *                    If the chair is assigned to a different section, it logs a message and returns `false`.
 */
function isChairUnassignedOrInSection(chair, section) {
	if (!!chair.section && chair.section != section.name) {
		console.log("This chair belongs to another section.")
		return false;
	}
	return true
}


/**
 * Checks if a specific chair object exists within any row of a given section.
 * Iterates through each row in the section's `rows` property and checks each chair
 * to see if it matches the specified `chair` object.
 * 
 * @param {Object} chair - The chair object to search for.
 * @param {Section} section - The section object to search within. The section should
 *                            have a `rows` property where each key is a row number and
 *                            its value is an array of chair objects.
 * @returns {boolean} Returns `true` if the specified chair object is found within any
 *                    of the rows in the given section. Otherwise, returns `false`.
 */
function doesChairExistInSection(chair, section) {
	for (let rowKey in section.rows) {
		let row = section.rows[rowKey]; // Access the array of chairs for this row
		for (let existingChair of row) { // Use of 'for...of' to iterate over array elements
			if (existingChair === chair) {
				return true; // The exact chair object was found
			}
		}
	}
	return false; // The chair object was not found
}


function sectionChairIsAdjacent(chair, section) {

	const adjacentSectionRowIsEmpty = isAdjacentSectionRowEmpty(chair, section);

	console.log('adjacentSectionRowIsEmpty:', adjacentSectionRowIsEmpty)

	// Check if chair is the first/only chair to be placed in a new row
	const chairIsOnlyChairAssignedToRow = isOnlyChairAssignedToSectionRow(chair, section)

	const chairIsLastRemainingChairAssignedToRow = isLastRemainingChairAssignedToRow(chair, section)
	if (chairIsLastRemainingChairAssignedToRow && section.length !== 1) return true;
  

	/*
	const isOnlyOneAssignedToRow = !section.some(adjacentChair => {
		adjacentChair.row === chair.row;
	});
*/
	// Check if the chair is next to a chair on its right or left, but not both
	const chairIsAdjacentToOnlyOneChairFromRow = isAdjacentToOnlyOneChair(chair, section)

	/*
	const isAdjacentToOnlyOneChair = sections[section].some(adjacentChair => 
		adjacentChair.row === chair.row && Math.abs(adjacentChair.index - chair.index) === 1
	);
	*/

	console.log('isAdjacentToOnlyOneChair', chairIsAdjacentToOnlyOneChairFromRow);
	console.log('isOnlyChairAssignedToSectionRow', isOnlyChairAssignedToSectionRow(chair, section))
	//console.log('isAdjacentToSingleChair', isAdjacentToSingleChair(section,chair));

	if (chairIsAdjacentToOnlyOneChairFromRow) return true;
  
	// Check if the chair is adjacent to any chair in the adjacent rows
	const isInAdjacentRow = section.some(adjacentChair => {
		// Check if the adjacentChair is in the row directly above or below the chair
		const isRowAdjacent = Math.abs(adjacentChair.row - chair.row) === 1;
		console.log('adjacentChairRow', adjacentChair.row)
		console.log('chairRow', chair.row)

		console.log(isRowAdjacent)

		// Check spatial adjacency based on bounding boxes
		// console.log('adjacentChairRightTheta', adjacentChair.rightBoundTheta)
		// console.log('adjacentChairLeftTheta', adjacentChair.leftBoundTheta)
		// console.log('chair.rightBoundTheta', chair.rightBoundTheta)
		// console.log('chair.leftBoundTheta', chair.leftBoundTheta)
		// console.log(`chair.leftBoundTheta (${chair.leftBoundTheta}) >= (${adjacentChair.rightBoundTheta}) adjacentChair.rightBoundTheta`, chair.leftBoundTheta >= adjacentChair.rightBoundTheta)
		const isSpatiallyAdjacent = chair.leftBoundTheta >= adjacentChair.rightBoundTheta && chair.rightBoundTheta <= adjacentChair.leftBoundTheta;
	
		return isRowAdjacent && isSpatiallyAdjacent;
	});
	console.log('isAdjacent??',isInAdjacentRow, chairIsOnlyChairAssignedToRow, chairIsAdjacentToOnlyOneChairFromRow )
	if (isInAdjacentRow && (chairIsOnlyChairAssignedToRow || chairIsAdjacentToOnlyOneChairFromRow))  {
		return isInAdjacentRow;
	};

	/**
	 * THIS SHOULD RETURN TRUE IF:
	 * chair is the first one,
	 * chair is to the immediate right or left, but not of a chair in the section
	 * chair is immediately above or below a chair in the section
	 * 
	 * 
	 */
}

function isAdjacentSectionRowEmpty(chair, section) {
	console.log('isAdjacentSectionRowEmpty: ', 'section = ', section)
	const isAdjacentSectionRowEmpty = section.some(adjacentChair => adjacentChair.row === chair.row);
	console.log('isAdjacentSectionRowEmpty: ', 'isAdjacentSectionRowEmpty = ',isAdjacentSectionRowEmpty)
	return isAdjacentSectionRowEmpty === 0;
}

function isAdjacentToOnlyOneChair(chair, section) {
	// Count the number of adjacent chairs in the same row
	const adjacentChairCount = section.filter(adjacentChair => 
		adjacentChair.row === chair.row && Math.abs(adjacentChair.index - chair.index) === 1
	).length;
	
	// Return true if exactly one chair is adjacent, false otherwise
	return adjacentChairCount === 1;
};

// Check if chair is the first/only chair to be placed in a new row
function isOnlyChairAssignedToSectionRow(chair, section) {
	console.log('isOnlyChairAssignedToSectionRow: ', 'section: ',section)
	console.log('isOnlyChairAssignedToSectionRow: ', 'chair: ',chair)
	const chairsInRowCount = section.filter(adjacentChair => {
		console.log('isOnlyChairAssignedToSectionRow: ','adjacentChair.row: ',adjacentChair, adjacentChair.row)
		console.log('isOnlyChairAssignedToSectionRow: ','chair.row: ', chair.row)
		return adjacentChair.row === chair.row;
	});
	console.log('isOnlyChairAssignedToSectionRow: ','chairsInRowCount: ', chairsInRowCount)
	return chairsInRowCount.length === 0
};

//if the chair you want to remove is the last chair in the row...
function isLastRemainingChairAssignedToRow(chair, section) {
	console.log('isOnlyChairAssignedToSectionRow: ', 'section: ',section)
	console.log('isOnlyChairAssignedToSectionRow: ', 'chair: ',chair)
	const chairsInSameRow = section.filter(adjacentChair => {
		console.log('isOnlyChairAssignedToSectionRow: ','adjacentChair.row: ',adjacentChair, adjacentChair.row)
		console.log('isOnlyChairAssignedToSectionRow: ','chair.row: ', chair.row)
		return adjacentChair.row === chair.row;
	});
	const chairIsInRow = chairsInSameRow.some(someChair => {
		console.log('isOnlyChairAssignedToSectionRow: ','adjacentChair.row: ',someChair, someChair.row)
		console.log('isOnlyChairAssignedToSectionRow: ','chair.row: ', chair.row)
		return someChair === chair;
	});
	console.log('isOnlyChairAssignedToSectionRow: ','chairsInRowCount: ', chairsInRowCount)
	if (chairsInSameRow.length === 1 && chairIsInRow) {
		return true
	} else {return false};
};


function sectionChairBridgesGap(chair, section) {
	const sectionChairsByRow = organizeSectionChairsIntoArray(section);
	
	if (chair.row ) {}
}
