import express, { Request, Response, NextFunction } from 'express';
      import mongoose from 'mongoose';
      import helmet from 'helmet';
      import rateLimit from 'express-rate-limit';
      import winston from 'winston';
      import dotenv from 'dotenv';
      import { Todo } from './types/todo';

      // Load environment variables
      const result = dotenv.config();
      if (result.error) {
        console.error('Error loading .env file:', result.error);
      } else {
        console.log('Environment variables loaded:', result.parsed);
      }

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
      const port: number = parseInt(process.env.PORT || '3000', 10);
      if (isNaN(port)) {
        logger.error('Invalid port number:', process.env.PORT);
        process.exit(1);
      }

      // Middleware
      app.use(helmet()); // Secure HTTP headers
      app.use(express.json()); // Parse JSON bodies
      app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per IP
        message: { error: 'Too many requests, please try again later.' }
      }));

      // Log requests
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
        completed: { type: Boolean, default: false }
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
        next();
      };

      // API Routes
      app.get('/api/todos', async (req: Request, res: Response) => {
        try {
          const todos = await TodoModel.find();
          res.json(todos.map(todo => ({
            id: todo._id.toString(),
            title: todo.title,
            completed: todo.completed
          })));
        } catch (err) {
          logger.error('Error fetching todos:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      app.post('/api/todos', validateTodo, async (req: Request, res: Response) => {
        try {
          const todo = new TodoModel({
            title: req.body.title,
            completed: req.body.completed || false
          });
          const savedTodo = await todo.save();
          res.status(201).json({
            id: savedTodo._id.toString(),
            title: savedTodo.title,
            completed: savedTodo.completed
          });
        } catch (err) {
          logger.error('Error creating todo:', err);
          res.status(500).json({ error: 'Internal server error' });
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
          const updatedTodo = await todo.save();
          res.json({
            id: updatedTodo._id.toString(),
            title: updatedTodo.title,
            completed: updatedTodo.completed
          });
        } catch (err) {
          logger.error('Error updating todo:', err);
          res.status(500).json({ error: 'Internal server error' });
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
        } catch (err) {
          logger.error('Error deleting todo:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      // Global error handler
      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error('Unhandled error:', err);
        res.status(500).json({ error: 'Internal server error' });
      });

      // Start server
      app.listen(port, '127.0.0.1', () => {
        logger.info(`Server is running on http://localhost:${port}`);
      });