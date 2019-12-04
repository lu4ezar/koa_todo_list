/* eslint-disable no-console */
const Task = require("../models/task");

exports.createTask = async (owner, task) => {
  try {
    const newTask = new Task({ owner, ...task });
    await newTask.save();
    return newTask;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const removeEmptyProperties = query =>
  Object.keys(query).filter(prop => !!query[prop]);

exports.getTasks = async ctx => {
  try {
    const { user } = ctx.state;
    const target = user.isAdmin ? /.*/ : user.username;
    let search = { owner: target };
    const query = removeEmptyProperties(ctx.query);
    search = { ...search, ...query };
    const tasks = await Task.find(search);
    return tasks;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
