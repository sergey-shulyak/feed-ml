"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brain = require("brain.js");
class TextClassifier {
    static get instance() {
        return this.classifier;
    }
    static reset() {
        this.classifier = new brain.NeuralNetwork();
    }
}
TextClassifier.classifier = new brain.NeuralNetwork();
exports.default = TextClassifier;
//# sourceMappingURL=TextClassifier.js.map