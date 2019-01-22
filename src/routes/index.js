//@ts-check
const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const Task = require('../api/task');
const User = require('../api/user');

const flash = require('koa-better-flash');


// common routes
router
	.get('/login',
		async ctx => ctx.render('login')
	)
	.post('/login',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			successFlash: 'Welcome!',
			failureFlash: 'Not welcome'
		})
	);

router
	.get('/register',
		async ctx => ctx.render('register')
	)
	.post('/register',
		async ctx => {
			const user = await User.createUser(ctx.request.body);
			if (user) {
				ctx.login(user);
				ctx.redirect('/');
			} else {
				ctx.flash('info', [ 'hi', 'hello', 'good morning' ]);
				ctx.redirect('/login');
			}
		}
	);
	// test
	/*.post('/register', async ctx => {
		const user = await User.createUser(ctx.request.body);
		return passport.authenticate('local', (err, user, info, status) => {
    		if (user) {
				ctx.login(user);
				ctx.redirect('/');
    		} else {
				ctx.status = 400;
				ctx.body = { status: 'error' };
    		}
		})(ctx);
	});*/

router.get('/error', async ctx => ctx.render('error'));
router.get('/favicon.ico', ctx => ctx.status = 204);


// protected routes

async function restrictAccess(ctx, next) {
	if (!ctx.isAuthenticated()) {
		return ctx.redirect('/login');
	}
	return next();
}

router.use(restrictAccess);

router
	.get('/',
		async ctx => {
			const tasks = await Task.getTasks(ctx);
			const { user } = ctx.state;
			return ctx.render('/index', {
				user: user,
				title: 'Tasks',
				tasks: tasks
			});
		}
	)
	.get('/add',
		async ctx => ctx.render('add')
	)
	.post('/add',
		async ctx => {
			await Task.createTask(ctx.state.user.username, ctx.request.body.task);
			ctx.redirect('/');
		}
	)
	.get('/logout',
		async ctx => {
			ctx.logout();
			ctx.redirect('/');
		}
	);

module.exports = {
	routes() {
		return router.routes();
	},
	allowedMethods() {
		return router.allowedMethods();
	}
};
