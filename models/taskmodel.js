// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], required: true },
  priority: { type: Number, required: true },
  userId: { type: String, required: true },
  deleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
