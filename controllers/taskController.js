const mongoose = require('mongoose');
const Task = require('../models/taskmodel');
const SubTask = require('../models/subTaskModel');
const cron = require('node-cron');
const twilio = require('twilio');



function calculateNewPriority(currentPriority, dueDate) {
  // Calculate the time difference between due date and today
  const timeDiff = new Date(dueDate) - new Date();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Update priority based on the specified criteria
  if (daysDiff === 0) {
    // Due date is today
    return 0;
  } else if (daysDiff >= 1 && daysDiff <= 2) {
    // Due date is between tomorrow and day after tomorrow
    return 1;
  } else if (daysDiff >= 3 && daysDiff <= 4) {
    // 3-4 days until due date
    return 2;
  } else {
    // 5 or more days until due date
    return 3;
  }
}


cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Cron job started at:', new Date());

    // Find tasks that are not deleted
    const tasks = await Task.find({ isDeleted: false });

    // Update priority for each task
    tasks.forEach(async (task) => {
      const newPriority = calculateNewPriority(task.priority, task.dueDate);

      // Update task priority in the database
      await Task.findByIdAndUpdate(task._id, { priority: newPriority });
    });

    console.log('Task priorities updated successfully.');
  } catch (error) {
    console.error('Error updating task priorities:', error.message);
  }
});
const createTask = async (title, description, dueDate, status, priority, userId) => {
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      priority,
      userId: userId, // Convert userId to ObjectId
    });

    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    throw error;
  }
};

const getAllUserTasks = async (userId, filters, page = 1, pageSize = 10) => {
  try {
    // Apply filters based on the provided query parameters
    const filterQuery = { userId };
    if (filters.priority) {
      filterQuery.priority = filters.priority;
    }
    if (filters.dueDate) {
      filterQuery.dueDate = filters.dueDate;
    }

    // Perform pagination
    const tasks = await Task.find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return tasks;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving user tasks');
  }
};

const updateTask = async (taskId, dueDate, status, userId) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId }, // Adding userId to the query
      { $set: { dueDate, status } },
      { new: true }
    );

    return updatedTask;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating task');
  }
};

const softDeleteTask = async (taskId) => {
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { deleted: true },
      { new: true }
    );

    return task;
  } catch (error) {
    console.error(error);
    throw error; // Handle the error appropriately in your application
  }
};


module.exports = {
  createTask, getAllUserTasks ,  updateTask,   softDeleteTask,

  // Other controller functions...
};
