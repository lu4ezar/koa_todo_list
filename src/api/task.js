const Task = require('../models/task');

exports.createTask = async ( owner, task ) => {
	try {
		const newTask  = new Task({owner, task});
		await newTask.save();
		console.log(`Success! Added ${newTask.task}`);
	} catch(err) {
		console.log(`saveTaskError: ${err}`);
	}
}

exports.getTasks = async (ctx) => {
	try {
		const {user} = ctx.state;
		const target = user.isAdmin ? /.*/ : user.username;
		const tasks = await Task.find({ 'owner': target});		
		return tasks;
	} catch(err) {
		console.log(`getTasksError: ${err}`);
		return null;
	}
}