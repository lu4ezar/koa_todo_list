//@ts-check
const Koa = require('koa');
const app = new Koa();

const bodyParser = require('koa-body');
const logger = require('koa-logger');
const err = require('./middleware/error');
const path = require('path');
const flash = require('koa-better-flash');

app
	.use(logger())
	.use(err)
	.use(bodyParser())
	// .use(flash());

require('./db');

// view
const render = require('koa-ejs');
render(app, {
	root: path.join(__dirname, '/view'),
	layout: 'layout',
});

// sessions
const session = require('koa-session');
app.keys = ['session-secret'];
app.use(session({}, app));

// authentication
require('./auth');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
const { routes, allowedMethods } = require('./routes');
app.use(routes());
app.use(allowedMethods());


module.exports = app;
