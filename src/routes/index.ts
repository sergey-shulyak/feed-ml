import * as Router from "koa-router";

import classifierRouter from "./classifierRouter";

const indexRouter = new Router();

indexRouter.use(classifierRouter.routes());

export default indexRouter;
