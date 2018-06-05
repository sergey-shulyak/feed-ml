"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const mimir = require("mimir");
const TextClassifier_1 = require("../entities/TextClassifier");
function createDictionary(data) {
    return mimir.dict(data);
}
function createBagOfWords(categories) {
    const allSamples = lodash_1.flatMap(categories, category => category.samples);
    const dictionary = createDictionary(allSamples);
    TextClassifier_1.default.dictionary = dictionary;
    const trainData = categories.map(category => {
        const { id: categoryId, samples } = category;
        const bows = samples.map(sample => mimir.bow(sample, dictionary));
        return { categoryId, bows };
    });
    return trainData;
}
function createOutputVector(categoryId, categories) {
    return categories.map((currentCategory, index) => currentCategory.id === categoryId ? 1 : 0);
}
function createTrainData(categories) {
    const categoryBagOfWords = createBagOfWords(categories);
    return lodash_1.flatMap(categoryBagOfWords, data => {
        const { categoryId, bows } = data;
        return bows.map(bow => ({
            input: bow,
            output: createOutputVector(categoryId, categories)
        }));
    });
}
function trainNeuralNetworkClassifier(trainData) {
    TextClassifier_1.default.reset();
    const textClassifier = TextClassifier_1.default.instance;
    TextClassifier_1.default.categories = trainData.categories.map(cat => lodash_1.omit(cat, "samples"));
    const trainDataVectors = createTrainData(trainData.categories);
    const trainResult = textClassifier.train(trainDataVectors, {
        errorThresh: 0.005,
        log: true,
        logPeriod: 10
    });
    console.log('Neural network trained', trainResult);
}
exports.trainNeuralNetworkClassifier = trainNeuralNetworkClassifier;
//# sourceMappingURL=trainingService.js.map