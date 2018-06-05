import * as brain from 'brain.js';
import * as fs from 'fs';
import * as path from 'path';

interface ICategory {
    id: number,
    name: string,
    samples?: string[]
}

export default class TextClassifier {
    public static categories: ICategory[];
    public static dictionary: string[];

    public static initialize() {
        this.classifier = new brain.NeuralNetwork();

        fs.readFile(path.resolve('trainedModels/trainedModel.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return
            }

            this.classifier.fromJSON(JSON.parse(data));
            console.log('Classifier restored from file')
        })

        fs.readFile(path.resolve('trainedModels/dictionary.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return
            }

            this.dictionary = JSON.parse(data);
            console.log('Dictionary restored from file')
        })

        fs.readFile(path.resolve('trainedModels/categories.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return
            }

            this.categories = JSON.parse(data);
            console.log('Categories restored from file')
        })
    }

    public static get instance() {
        return this.classifier;
    }

    public static reset() {
        this.classifier = new brain.NeuralNetwork();
    }

    private static classifier: any;
}
