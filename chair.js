class Chair {
    constructor(x, y, label, enabled, fontSize) {
        if (new.target === Chair) {
            throw new TypeError("Cannot construct Chair instances directly");
        }
        this.x = x;
        this.y = y;
        this.label = label;
        this.enabled = enabled;
        this.fontSize = fontSize;
    }

    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }
}