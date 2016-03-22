const PORT = process.env.PORT || 3000;

import * as Koa from "koa";
const fileServer = require('koa-static');
const convert = require('koa-convert')
const mount = require('koa-mount');

//import {TestClass} from "../common/test";
//let test = new TestClass();

let app = new Koa();

app.use(convert(mount('/src', fileServer('src'))));
app.use(convert(fileServer('public')));

/*
app.use(async (ctx: Koa.Context, next: Function) => {
        // ...
    }
);
*/

/* let server = */ app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});
