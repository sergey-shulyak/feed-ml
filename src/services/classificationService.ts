import * as mimir from 'mimir';

import TextClassifier from '../entities/TextClassifier';

function parseClassifierResult(classifierResult: number[]) {
    const max = Math.max(...classifierResult);
    const index = classifierResult.indexOf(max);

    return TextClassifier.categories.find(cat => cat.id === index + 1);
}

export function classifyText(text: string) {
    const textBow = mimir.bow(text, TextClassifier.dictionary);
    const classifierResult = TextClassifier.instance.run(textBow);

    return parseClassifierResult(classifierResult);
}

export function classifyBulk(data: [{ id: number, text: string }]) {
    console.log("DATA", data);
    const classifiedData = data.map(publication => {
        const category = classifyText(publication.text);

        return {
            publicationId: publication.id,
            categoryId: category.id,
            categoryName: category.name
        }
    });

    console.log('CLASSIFIED DATA', classifiedData);

    return classifiedData;
}