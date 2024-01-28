const express = require('express');
const router = express.Router();
const subTaskController = require('../controllers/subTaskController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create',authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { taskId, title, description,status } = req.body;

    if (!taskId || !title || !description || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSubTask = await subTaskController.createSubTask(taskId,user, title, description,status);
    return res.status(201).json(newSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ error: 'Missing taskId parameter' });
    }

    const subTasks = await subTaskController.getSubTasksByTaskId(taskId);
    return res.status(200).json(subTasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const taskId = req.query.taskId || null;

    const subTasks = await subTaskController.getAllUserSubTasks(user, taskId);
    console.log(subTasks);
    return res.status(200).json(subTasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update/:subTaskId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const subTaskId = req.params.subTaskId;
    const { status } = req.body;

    console.log(userId);


    // Check if status is provided
    if (status === undefined || status === null) {
      return res.status(400).json({ error: 'Status is required for update' });
    }

    // Update subtask status (checking user ID)
    const updatedSubTask = await subTaskController.updateSubTaskStatus(userId, subTaskId, status);

    // Check if subtask was found and updated
    if (!updatedSubTask) {
      return res.status(404).json({ error: 'Subtask not found for the user' });
    }

    // Return the updated subtask
    return res.status(200).json(updatedSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/delete/:subTaskId', async (req, res) => {
  try {
    const { subTaskId } = req.params;
    const updatedSubTask = await subTaskController.softDeleteTask(subTaskId);

    if (!updatedSubTask) {
      return res.status(404).json({ error: 'Subtask not found or already deleted' });
    }

    return res.status(200).json(updatedSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;