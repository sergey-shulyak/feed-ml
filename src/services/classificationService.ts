import * as mimir from 'mimir';

import TextClassifier from '../entities/TextClassifier';

function parseClassifierResult(classifierResult: number[]) {
  const max = Math.max(...classifierResult);
  const index = classifierResult.indexOf(max);

  return TextClassifier.categories.find(cat => cat.id === index);
}

export function classifyText(text: string) {
  const textBow = mimir.bow(text, TextClassifier.dictionary);
  const classifierResult = TextClassifier.instance.run(textBow);

  return parseClassifierResult(classifierResult);
}
