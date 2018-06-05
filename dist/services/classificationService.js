"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mimir = require("mimir");
const TextClassifier_1 = require("../entities/TextClassifier");
function parseClassifierResult(classifierResult) {
    const max = Math.max(...classifierResult);
    const index = classifierResult.indexOf(max);
    return TextClassifier_1.default.categories.find(cat => cat.id === index + 1);
}
function classifyText(text) {
    const textBow = mimir.bow(text, TextClassifier_1.default.dictionary);
    const classifierResult = TextClassifier_1.default.instance.run(textBow);
    return parseClassifierResult(classifierResult);
}
exports.classifyText = classifyText;
function classifyBulk(data) {
    console.log("DATA", data);
    const classifiedData = data.map(publication => {
        const category = classifyText(publication.text);
        return {
            publicationId: publication.id,
            categoryId: category.id,
            categoryName: category.name
        };
    });
    console.log('CLASSIFIED DATA', classifiedData);
    return classifiedData;
}
exports.classifyBulk = classifyBulk;
//# sourceMappingURL=classificationService.js.map