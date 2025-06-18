import express, { Request, Response, NextFunction } from 'express';
  import jsonServer from 'json-server';
  import path from 'path';
  import { Todo } from './types/todo';

  const app = express();
  const port = 3000;

  // Validation middleware for POST and PUT requests
  const validateTodo = (req: Request, res: Response, next: NextFunction) => {
    const todo: Partial<Todo> = req.body;
    if (!todo.title || typeof todo.title !== 'string' || todo.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (todo.completed !== undefined && typeof todo.completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    next();
  };

  // Set up json-server middleware
  const router = jsonServer.router(path.join(__dirname, '../db.json'));
  const middlewares = jsonServer.defaults();

  app.use(express.json()); // Parse JSON bodies
  app.use(middlewares);

  // Apply validation for POST and PUT requests
  app.post('/api/todos', validateTodo);
  app.put('/api/todos/:id', validateTodo);

  app.use('/api', router); // Mount json-server at /api

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });