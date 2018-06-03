import * as env from "dotenv";

env.load();

import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as bodyParser from "koa-bodyparser";

import router from "./routes";
import * as HttpStatuses from "http-status-codes";

const app = new Koa();

// CORS
app.use(cors({ credentials: true }));

// Error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = { error: error.message };
    }
});

// Logging
const logging = async (ctx: Koa.Context, next: () => void) => {
    console.log(`${ctx.method} ${ctx.url} ${ctx.status}`);
    await next();
};

app.use(logging);

// Body parser
app.use(bodyParser());

// Router
app.use(router.routes());

// Launch
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
