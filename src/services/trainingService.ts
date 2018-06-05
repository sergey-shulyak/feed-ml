import * as fs from 'fs';
import * as path from 'path';
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

  const serializedNetwork = textClassifier.toJSON();

  fs.writeFile(path.resolve('trainedModels/trainedModel.json'), JSON.stringify(serializedNetwork), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Trained model saved to trainedModel.json');
    }
  });

  fs.writeFile(path.resolve('trainedModels/dictionary.json'), JSON.stringify(TextClassifier.dictionary), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Dictionary saved to dictionary.json');
    }
  });

  fs.writeFile(path.resolve('trainedModels/categories.json'), JSON.stringify(TextClassifier.categories), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Dictionary saved to categories.json');
    }
  });

  console.log('Neural network trained', trainResult);
}
