import * as brain from 'brain.js';

interface ICategory {
    id: number,
    name: string,
    samples?: string[]
}

export default class TextClassifier {
    public static categories: ICategory[];
    public static dictionary: string[];

    public static get instance() {
        return this.classifier;
    }

    private static classifier = new brain.NeuralNetwork();
}