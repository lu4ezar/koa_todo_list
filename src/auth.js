const passport = require('koa-passport');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
		done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		await User.findById(id, (err, user) => {
			done(null, user);
		})
	} catch (err) {
		done(err);
	}
});

const LocalStrategy = require('passport-local').Strategy;

passport.use(
	new LocalStrategy(function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	})
);
