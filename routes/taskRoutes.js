// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;
    console.log(req.body)

    if (!title || !description || !dueDate || !status || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user;

    const newTask = taskController.createTask(title, description, dueDate, status, priority, userId);
    return res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const filters = {
      priority: req.query.priority,
      dueDate: req.query.dueDate,
    };
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const tasks = await taskController.getAllUserTasks(userId, filters, page, pageSize);
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update/:taskId', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { dueDate, status } = req.body;
    const userId = req.user; // Get user ID from the authenticated user

    if (!dueDate && !status) {
      return res.status(400).json({ error: 'Missing required fields for update' });
    }

    const updatedTask = await taskController.updateTask(taskId, dueDate, status, userId);

    if (updatedTask) {
      return res.status(200).json(updatedTask);
    } else {
      return res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/delete/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await taskController.softDeleteTask(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(deletedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
