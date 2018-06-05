import { flatMap, fill, omit } from 'lodash';
import * as mimir from 'mimir';

import TextClassifier from '../entities/TextClassifier';

interface ICategory {
  id: number,
  name: string,
  samples?: string[]
}

interface ITrainData {
  categories: ICategory[]
}

function createDictionary(data: string[]) {
  return mimir.dict(data);
}

function createBagOfWords(categories: ICategory[]) {
  const allSamples = flatMap(categories, category => category.samples);

  const dictionary = createDictionary(allSamples);

  TextClassifier.dictionary = dictionary;

  const trainData = categories.map(category => {
    const { id: categoryId, samples } = category;

    const bows = samples.map(sample => mimir.bow(sample, dictionary));

    return { categoryId, bows };
  });

  return trainData;
}

function createOutputVector(categoryId: number, categories: ICategory[]) {
  return categories.map((currentCategory, index) => currentCategory.id === categoryId ? 1 : 0);
}

function createTrainData(categories: ICategory[]) {
  const categoryBagOfWords = createBagOfWords(categories);

  return flatMap(categoryBagOfWords, data => {
    const { categoryId, bows } = data;

    return bows.map(bow => ({
      input: bow,
      output: createOutputVector(categoryId, categories)
    }));
  })
}

export function trainNeuralNetworkClassifier(trainData: ITrainData) {
  TextClassifier.reset();
  const textClassifier = TextClassifier.instance;

  TextClassifier.categories = trainData.categories.map(cat => omit(cat, "samples"));

  const trainDataVectors = createTrainData(trainData.categories);

  const trainResult = textClassifier.train(trainDataVectors, {
    errorThresh: 0.005,
    log: true,
    logPeriod: 10
  });

  console.log('Neural network trained', trainResult);
}
