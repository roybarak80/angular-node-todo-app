# Angular Node Todo App

A robust todo list application built with Angular for the frontend and Node.js with MongoDB for the backend. This app allows users to manage tasks efficiently with a secure and intuitive interface.

## Features

- **Create Todo List**: Add new tasks with details like title, description, status, and due date.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on todos.
- **Filter Todos**: Filter tasks by status (e.g., completed, pending) or due date.
- **Fields Validation**: Ensure valid input data for todo fields (e.g., required fields, data formats) on the backend.
- **MongoDB Integration**: Store and manage todos in a MongoDB database for persistent data storage.
- **Security Layer**:
  - **ETag Disabled**: Prevents caching-related vulnerabilities by disabling ETag headers.
  - **Helmet**: Enhances API security by setting secure HTTP headers.
  - **Rate Limiting**: Limits each IP to 100 requests per 15-minute window to prevent abuse.

## Project Structure

```
angular-node-todo-app/
├── frontend/               # Angular frontend
│   ├── Dockerfile.frontend # Dockerfile for frontend
│   ├── src/               # Angular source code
│   ├── package.json       # Frontend dependencies
│   └── angular.json       # Angular configuration
├── backend/               # Node.js backend
│   ├── Dockerfile         # Dockerfile for backend
│   ├── server.js         # Backend entry point
│   ├── package.json      # Backend dependencies
│   └── (other backend files)
├── docker-compose.yml     # Docker Compose configuration (optional)
└── README.md             # This file
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Angular CLI](https://angular.io/cli) (v17 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance, e.g., MongoDB Atlas)
- [Docker](https://www.docker.com/) (optional, for containerization)
- [Docker Compose](https://docs.docker.com/compose/) (optional, for multi-container setup)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/roybarak80/angular-node-todo-app.git
   cd angular-node-todo-app
   ```

2. **Set Up the Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Set Up the Backend**:
   ```bash
   cd ../backend
   npm install
   ```
   Ensure MongoDB is running (local or cloud). Set the MongoDB connection string in your environment variables (e.g., `.env` file):
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   ```
   Install additional backend dependencies for security:
   ```bash
   npm install helmet express-rate-limit
   ```

4. **Run the App Locally**:
   - **Frontend**: From the `frontend/` directory:
     ```bash
     ng serve
     ```
     Open `http://localhost:4200` in your browser.
   - **Backend**: From the `backend/` directory:
     ```bash
     node server.js
     ```
     The backend API runs on `http://localhost:3000` (adjust port if customized).

## Backend Security Configuration

The backend includes the following security measures in `server.js`:

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Disable ETag
app.disable('etag');

// Apply Helmet for secure headers
app.use(helmet());

// Apply rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { error: 'Too many requests, please try again later.' }
}));
```

## Running with Docker

1. **Build Docker Images**:
   From the `frontend/` directory:
   ```bash
   docker build -t roybarak1/angular-todo-frontend:latest -f Dockerfile.frontend .
   ```
   From the `backend/` directory:
   ```bash
   docker build -t roybarak1/node-todo-backend:latest .
   ```

2. **Run with Docker Compose** (if `docker-compose.yml` is set up):
   ```bash
   docker-compose up --build
   ```
   Access the app at `http://localhost` (frontend) and `http://localhost:3000` (backend API). Ensure MongoDB is accessible to the backend container (e.g., via `MONGODB_URI` environment variable).

3. **Push to Docker Hub**:
   ```bash
   docker login
   docker push roybarak1/angular-todo-frontend:latest
   docker push roybarak1/node-todo-backend:latest
   ```

## Usage

- **Add a Todo**: Enter task details (title, description, status, due date) in the frontend. The backend validates fields before saving to MongoDB.
- **Edit/Delete**: Modify or remove tasks using the edit/delete buttons.
- **Filter Tasks**: Use filter options to view tasks by status or sort by due date.
- **Security**: The backend enforces rate limits and secure headers to protect the API.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repo.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, reach out via [GitHub Issues](https://github.com/roybarak80/angular-node-todo-app/issues).
