"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const classifierRouter_1 = require("./classifierRouter");
const indexRouter = new Router();
indexRouter.use(classifierRouter_1.default.routes());
exports.default = indexRouter;
//# sourceMappingURL=index.js.map