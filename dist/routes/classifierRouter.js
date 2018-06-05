"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const trainingService = require("../services/trainingService");
const classificationService = require("../services/classificationService");
const classifierRouter = new Router();
classifierRouter.get("/classify", async (ctx, next) => {
    const { body } = ctx.request;
    const { text } = body;
    const category = classificationService.classifyText(text);
    ctx.body = { category };
});
classifierRouter.get("/classifyBulk", async (ctx, next) => {
    const { body } = ctx.request;
    const { data } = body;
    let classifiedData;
    try {
        classifiedData = classificationService.classifyBulk(data);
    }
    catch (error) {
        ctx.throw({ error });
    }
    ctx.body = { classifiedData };
});
classifierRouter.post("/train", async (ctx, next) => {
    const { body } = ctx.request;
    const trainedClassifier = trainingService.trainNeuralNetworkClassifier(body);
    ctx.body = { message: "Classifier updated" };
});
exports.default = classifierRouter;
//# sourceMappingURL=classifierRouter.js.map