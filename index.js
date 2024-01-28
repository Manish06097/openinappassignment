// index.js
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://user:1234@cluster0.qhsrqqw.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check for DB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


// Import routes
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');


// Use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subTaskRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
