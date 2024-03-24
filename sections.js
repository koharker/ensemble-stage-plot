//import { Chair } from './chair.js'; // Import Chair class if needed inside Section class

export class Section {
    constructor(name) {
        this.name = name;
        this.rows = {}; // Dynamically holds row data
    }

    addChair(chair) {
        if (!this.rows[chair.row]) {
            this.rows[chair.row] = [];
        }
        this.rows[chair.row].push(chair);
    }

    removeChair(chair) {
        // Check if the row exists
        if (this.rows[chair.row]) {
            // Find the index of the chair to remove in the row array
            const chairIndex = this.rows[chair.row].findIndex(existingChair => 
                existingChair === chair // Or any other equality condition based on your Chair structure
            );
        
            // If the chair was found, remove it from the array
            if (chairIndex !== -1) {
                this.rows[chair.row].splice(chairIndex, 1);
                
                // Optional: Remove the row property if it's now empty
                if (this.rows[chair.row].length === 0) {
                    delete this.rows[chair.row];
                }
            }
        }
    }

    // Method to check if the section is empty (contains no chairs)
    isEmpty() {
        return Object.values(this.rows).every(row => row.length === 0);
    }

    // Method to return the total number of chairs in the section
    getTotalChairs() {
        return Object.values(this.rows).reduce((total, row) => total + row.length, 0);
    }
}

/*



export class SectionNew {
    constructor(name) {
        this.name = name;
        this.rows = {}; // Initialize with an empty object for rows
    }

    addChair(chair) {
        // Destructure chair properties if needed, e.g., const { row, leftBoundTheta, rightBoundTheta } = chair;
        const { row } = chair;

        if (!this.rows[row]) {
            this.rows[row] = {
                chairs: [],
                leftTheta: null,
                rightTheta: null,
                id: row, // Assuming row ID is the same as row number for simplicity
            };
        }

        this.rows[row].chairs.push(chair);

        // Update the leftTheta and rightTheta for the row after adding a chair
        this.#updateThetaBounds(row);
    }

    removeChair(chair) {
        const { row } = chair;
        if (this.rows[row]) {
            const index = this.rows[row].chairs.findIndex(existingChair => existingChair === chair);
            if (index !== -1) {
                this.rows[row].chairs.splice(index, 1);
                
                if (this.rows[row].chairs.length === 0) {
                    delete this.rows[row];
                } else {
                    this.#updateThetaBounds(row);
                }
            }
        }
    }

    #updateThetaBounds(row) {
        // Directly update the row's leftTheta and rightTheta properties
        const { maxLeftTheta, minRightTheta } = this.rows[row].chairs.reduce(({ maxLeftTheta, minRightTheta }, { leftBoundTheta, rightBoundTheta }) => ({
            maxLeftTheta: Math.max(maxLeftTheta, leftBoundTheta),
            minRightTheta: Math.min(minRightTheta, rightBoundTheta),
        }), { maxLeftTheta: -Infinity, minRightTheta: Infinity });

        this.rows[row].leftTheta = maxLeftTheta;
        this.rows[row].rightTheta = minRightTheta;
    }

    #findRowThetaBounds(chairsInRow) {
        // This method can be removed if not used elsewhere since logic has been moved to #updateThetaBounds
        return {}; // Placeholder if necessary
    }

    isEmpty() {
        // Use Object.values and every for concise evaluation
        return Object.values(this.rows).every(({ chairs }) => chairs.length === 0);
    }

    getTotalChairs() {
        // Sum up the number of chairs across all rows in a concise manner
        return Object.values(this.rows).reduce((total, { chairs }) => total + chairs.length, 0);
    }
}
*/