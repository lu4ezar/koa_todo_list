//@ts-check
const Koa = require('koa');
const app = new Koa();

const bodyParser = require('koa-body');
const logger = require('koa-logger');
const err = require('./middleware/error');
const path = require('path');
const flash = require('koa-better-flash');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

app.use(err).use(bodyParser());

require('./db');

// view
const render = require('koa-ejs');
render(app, {
  root: path.join(__dirname, '/view'),
  layout: 'layout',
  viewExt: 'ejs'
  // debug: true
});

// sessions
const session = require('koa-session');
app.keys = ['session-secret'];
app.use(session({}, app));

// flash
app.use(flash());
app.use(async (ctx, next) => {
  ctx.state.error = ctx.flash('error') || [];
  ctx.state.success = ctx.flash('success') || [];
  return next();
});

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
