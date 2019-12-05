/* eslint-disable no-console */
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.createUser = async ({ username, password: passwordString }) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(passwordString, salt);
    const newUser = new User({ username, password });
    await newUser.save();
    return newUser;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// unused
exports.fetchUser = async ({ username }) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
