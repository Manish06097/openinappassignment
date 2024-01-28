const mongoose = require('mongoose');
const SubTask = require('../models/subTaskModel');

const createSubTask = async (taskId,user, title, description,status) => {
  try {
    const newSubTask = new SubTask({
      taskId: taskId,
      user,
      title,
      description,
      status,
    });

    const savedSubTask = await newSubTask.save();
    return savedSubTask;
  } catch (error) {
    throw error;
  }
};



const getAllUserSubTasks = async (userId, taskId = null) => {
  try {
    // Apply filters based on the provided task ID
    const filterQuery = { user:userId };
    if (taskId) {
      filterQuery.taskId = taskId;
    }

    // Retrieve user sub-tasks
    console.log('Filter Query:', filterQuery);
    const subTasks = await SubTask.find(filterQuery).exec();
    return subTasks;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving user sub-tasks');
  }
};


const updateSubTaskStatus = async (userId, subTaskId, status) => {
  try {
    // Find the subtask by ID and user ID
    const subTask = await SubTask.findOne({ _id: subTaskId, user:userId });

    // Check if the subtask exists
    if (!subTask) {
      return null; // Subtask not found
    }

    // Update the subtask status
    subTask.status = status;

    // Save the updated subtask
    await subTask.save();

    // Return the updated subtask
    return subTask;
  } catch (error) {
    throw error;
  }
};

const softDeleteTask = async (subTaskId) => {
  try {
    const subtask = await SubTask.findByIdAndUpdate(
      subTaskId,
      { deleted: true },
      { new: true }
    );

    return subtask;
  } catch (error) {
    console.error(error);
    throw error; // Handle the error appropriately in your application
  }
};


module.exports = {
  createSubTask,
  getAllUserSubTasks,
  updateSubTaskStatus,
  softDeleteTask




};
