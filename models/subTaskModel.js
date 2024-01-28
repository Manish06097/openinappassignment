const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    ref: 'Task',
    required: true,
  },
  user: {
    type: String,
    ref: 'Task',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
