const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async ({username, password}) => {
	try {
		const salt = bcrypt.genSaltSync(10);
		password = bcrypt.hashSync(password, salt);
		const newUser = new User({username, password});
		await newUser.save();
		console.log(`user created: ${newUser.username}`);
		return newUser;
	} catch(err) {
		console.log(`createUserError: ${err}`);
		// return null;
	}
}

// unused
exports.fetchUser = async ({username}) => {
	try {
		const user = await User.findOne({ 'username': username});
		console.log(`User ${username} found`);
		return user;
	} catch (err) {
		console.log(err);
	}
}