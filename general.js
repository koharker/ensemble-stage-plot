// File: enforceTypeExtension.js

if (typeof Object.prototype.enforceType !== 'function') {
    Object.defineProperty(Object.prototype, 'enforceType', {
        value: function(typePrototype) {
            // Method implementation remains the same
            const expectedTypeName = typePrototype.constructor.name;
            const actualTypeName = this.constructor.name;
            const typePropsAndMethods = Object.getOwnPropertyNames(typePrototype)
                                                .filter(prop => typeof typePrototype[prop] === 'function' || typeof typePrototype[prop] !== 'function');
            const missingPropsAndMethods = typePropsAndMethods.filter(propOrMethod => this[propOrMethod] === undefined);
            if (missingPropsAndMethods.length > 0) {
                const baseErrorMessage = `Assignment type mismatch: expected instance of ${expectedTypeName}`;
                const detailedErrorMessage = actualTypeName !== "Object" ? `, got instance of ${actualTypeName}.` : ".";
                const missingDetailsMessage = ` Missing properties/methods: ${missingPropsAndMethods.join(', ')}`;
                throw new TypeError(baseErrorMessage + detailedErrorMessage + missingDetailsMessage);
            }
        },
        writable: true,
        configurable: true
    });
}










/*
function enforceType(obj) {
    //TypeError: Assignment type mismatch: expected instance of Bird, got instance of Car.
    //TypeError: Cannot assign 'Car' to 'Bird'. Method 'fly' missing in 'Car'.
}

Object.prototype.enforceType = function(typePrototype) {
    const expectedTypeName = typePrototype.constructor.name;
    const actualTypeName = this.constructor.name;

    // Extract both the properties and method names of the typePrototype
    const typePropsAndMethods = Object.getOwnPropertyNames(typePrototype)
                                      .filter(prop => typeof typePrototype[prop] === 'function' || typeof typePrototype[prop] !== 'function');
    
    // Check if the current object has all the properties and methods of typePrototype
    const missingPropsAndMethods = typePropsAndMethods.filter(propOrMethod => this[propOrMethod] === undefined);

    if (missingPropsAndMethods.length > 0) {
        const baseErrorMessage = `TypeError: Assignment type mismatch: expected instance of ${expectedTypeName}`;
        const detailedErrorMessage = actualTypeName !== "Object" ? `, got instance of ${actualTypeName}.` : ".";
        const missingDetailsMessage = ` Missing properties/methods: ${missingPropsAndMethods.join(', ')}`;

        throw new TypeError(baseErrorMessage + detailedErrorMessage + missingDetailsMessage);
    }
};









// Example usage
class Bird {
    constructor() {
        this.wings = 2;
        this.hasFeathers = true;
    }

    fly() { console.log("The bird flies."); }
}

class Car {
    constructor() {
        this.wheels = 4;
    }

    drive() { console.log("The car drives."); }
}

const tweety = new Bird();
const toyota = new Car();
const genericObject = {}; // Plain object

// This should pass without error
try {
    tweety.enforceType(Bird.prototype);
    console.log("Tweety passed the type check.");
} catch (e) {
    console.log(e.message);
}

// This should throw a TypeError with "got instance of Car"
try {
    toyota.enforceType(Bird.prototype);
    console.log("Toyota passed the type check.");
} catch (e) {
    console.log(e.message);
}

// This should throw a TypeError without "got instance of"
try {
    genericObject.enforceType(Bird.prototype);
    console.log("Generic object passed the type check.");
} catch (e) {
    console.log(e.message);
}

*/