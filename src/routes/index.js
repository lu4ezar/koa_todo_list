//@ts-check
const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Task = require('../api/task')
const User = require('../api/user')

// common routes

router
  .get('/login', async ctx => ctx.render('/login'))
  .post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      successFlash: 'Welcome back!',
      failureFlash: true,
    })
  )

router
  .get('/register', async ctx => ctx.render('register'))
  .post('/register', async ctx => {
    try {
      const user = await User.createUser(ctx.request.body)
      ctx.login(user)
      ctx.flash('success', `Welcome new user ${user.username}!`)
      ctx.redirect('/')
    } catch (err) {
      ctx.flash('error', err.message)
      ctx.redirect('/register')
    }
  })

router.get('/favicon.ico', ctx => (ctx.status = 204))

// protected routes

async function restrictAccess(ctx, next) {
  if (!ctx.isAuthenticated()) {
    return ctx.redirect('/login')
  }
  return next()
}

router.use(restrictAccess)

router
  .get('/', async ctx => {
    const tasks = await Task.getTasks(ctx)
    const { user } = ctx.state
    return ctx.render('/index', {
      user: user,
      title: 'Tasks',
      tasks: tasks,
    })
  })
  .get('/add', async ctx => ctx.render('add'))
  .post('/add', async ctx => {
    try {
      const task = await Task.createTask(
        ctx.state.user.username,
        ctx.request.body.task
      )
      ctx.flash('success', `${task.task} was added!`)
      ctx.redirect('/')
    } catch (err) {
      ctx.flash('error', err.message)
      ctx.redirect('/add')
    }
  })
  .get('/logout', async ctx => {
    ctx.logout()
    ctx.redirect('/')
  })

module.exports = {
  routes() {
    return router.routes()
  },
  allowedMethods() {
    return router.allowedMethods()
  },
}
