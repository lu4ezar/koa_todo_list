const passport = require("koa-passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    await User.findById(id, (err, user) => {
      done(null, user);
    });
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err, { message: err.message });
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);
