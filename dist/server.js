"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("dotenv");
env.load();
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const routes_1 = require("./routes");
const app = new Koa();
// CORS
app.use(cors({ credentials: true }));
// Error handling
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        ctx.status = error.status || 500;
        ctx.body = { error: error.message };
    }
});
// Logging
const logging = async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url} ${ctx.status}`);
    await next();
};
app.use(logging);
// Body parser
app.use(bodyParser());
// Router
app.use(routes_1.default.routes());
// Launch
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
//# sourceMappingURL=server.js.map