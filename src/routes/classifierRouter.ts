import {Context} from "koa";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";

import * as trainingService from "../services/trainingService";
import * as classificationService from "../services/classificationService";

import {omit} from 'lodash';

const classifierRouter = new Router();

classifierRouter.get("/classify", async (ctx, next) => {
    const {body} = ctx.request;
    const {text} = body;

    const category = classificationService.classifyText(text);

    ctx.body = {category};
});

classifierRouter.get("/classifyBulk", async (ctx, next) => {
    const {body} = ctx.request;
    const {data} = body;

    let classifiedData;

    try {
        classifiedData = classificationService.classifyBulk(data);
    } catch (error) {
        ctx.throw({error});
    }

    ctx.body = {classifiedData};
});

classifierRouter.post("/train", async (ctx, next) => {
    const {body} = ctx.request;

    const trainedClassifier = trainingService.trainNeuralNetworkClassifier(body);

    ctx.body = {message: "Classifier updated"}
})

export default classifierRouter;
