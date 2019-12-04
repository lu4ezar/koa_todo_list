const Task = require('../models/task');

exports.createTask = async (owner, task) => {
  try {
    const newTask = new Task({ owner, ...task });
    await newTask.save();
    return newTask;
  } catch (err) {
    throw err;
  }
};

exports.getTasks = async ctx => {
  try {
    const { user } = ctx.state;
    const target = user.isAdmin ? /.*/ : user.username;
    let search = { owner: target };
    const query = helper(ctx.query);
    search = { ...search, ...query };
    let tasks = await Task.find(search);
    return tasks;
  } catch (err) {
    throw err;
  }
};

const helper = query => {
  Object.keys(query).map(prop => {
    if (!query[prop]) {
      delete query[prop];
    }
  });
  return query;
};
