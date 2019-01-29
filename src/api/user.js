const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async ({username, password}) => {
	try {
		const salt = bcrypt.genSaltSync(10);
		password = bcrypt.hashSync(password, salt);
		const newUser = new User({username, password});
		await newUser.save();
		return newUser;
	} catch(err) {
		throw err;
	}
}

// unused
exports.fetchUser = async ({username}) => {
	try {
		const user = await User.findOne({ 'username': username});
		return user;
	} catch (err) {
		throw err;
	}
}