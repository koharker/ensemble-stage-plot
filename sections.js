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
