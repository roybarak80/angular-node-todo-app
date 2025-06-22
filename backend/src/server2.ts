import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import dotenv from 'dotenv';
import { Todo } from './types/todo';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize Express app
const app = express();
app.disable('etag');
const port: number = parseInt(process.env.PORT || '3000', 10);
if (isNaN(port)) {
  logger.error('Invalid port number:', process.env.PORT);
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
}));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// MongoDB connection
logger.info(`Connecting to MongoDB at ${process.env.MONGODB_URI}`);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todos')
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Todo Schema and Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, immutable: true },
  dueDate: { type: Date, default: null, required: false }
});

const TodoModel = mongoose.model('Todo', todoSchema);

// Validation middleware
const validateTodo = (req: Request, res: Response, next: NextFunction) => {
  const todo: Partial<Todo> = req.body;
  if (!todo.title || typeof todo.title !== 'string' || todo.title.trim() === '') {
    logger.warn(`Invalid title in request: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  if (todo.title.length > 100) {
    logger.warn(`Title too long: ${todo.title}`);
    return res.status(400).json({ error: 'Title must be less than 100 characters' });
  }
  if (todo.completed !== undefined && typeof todo.completed !== 'boolean') {
    logger.warn(`Invalid completed field: ${todo.completed}`);
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }
  if (todo.dueDate !== undefined && todo.dueDate !== null && isNaN(Date.parse(todo.dueDate))) {
    logger.warn(`Invalid dueDate: ${todo.dueDate}`);
    return res.status(400).json({ error: 'Due date must be a valid date or null' });
  }
  next();
};

// API Routes

app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.find().exec();
    if (!todos) {
      logger.warn('No todos found');
      return res.status(404).json({ error: 'No todos found' });
    }
    res.json(todos.map(todo => ({
      id: todo._id.toString(),
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : null
    })));
  } catch (err: any) {
    logger.error('Error fetching todos:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/todos', validateTodo, async (req: Request, res: Response) => {
  try {
    const todo = new TodoModel({
      title: req.body.title,
      completed: req.body.completed || false,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
    });
    const savedTodo = await todo.save();
    res.status(201).json({
      id: savedTodo._id.toString(),
      title: savedTodo.title,
      completed: savedTodo.completed,
      createdAt: savedTodo.createdAt.toISOString(),
      dueDate: savedTodo.dueDate ? savedTodo.dueDate.toISOString() : null
    });
  } catch (err: any) {
    logger.error('Error creating todo:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.put('/api/todos/:id', validateTodo, async (req: Request, res: Response) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) {
      logger.warn(`Todo not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.title = req.body.title;
    todo.completed = req.body.completed;
    todo.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    const updatedTodo = await todo.save();
    res.json({
      id: updatedTodo._id.toString(),
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      createdAt: updatedTodo.createdAt.toISOString(),
      dueDate: updatedTodo.dueDate ? updatedTodo.dueDate.toISOString() : null
    });
  } catch (err: any) {
    logger.error('Error updating todo:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const todo = await TodoModel.findByIdAndDelete(req.params.id);
    if (!todo) {
      logger.warn(`Todo not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({});
  } catch (err: any) {
    logger.error('Error deleting todo:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(port, '127.0.0.1', () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
