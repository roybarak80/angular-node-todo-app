# ToDo List Application

This is a full-stack ToDo list application with a Node.js backend and an Angular frontend, supporting CRUD operations for ToDo items.

## Folder Structure

```
todo-app/
├── frontend/            ← Angular frontend
├── backend/             ← Node.js backend
├── Dockerfile.backend   ← Backend Docker image
├── Dockerfile.frontend  ← Frontend Docker image
├── docker-compose.yml   ← Docker Compose configuration
├── .dockerignore        ← Docker ignore file
├── README.md
```

## Prerequisites

- Node.js (v18 or later)
- npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker and Docker Compose

## Setup Without Docker

### Backend
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build TypeScript:
   ```bash
   npm run build
   ```
4. Start backend:
   ```bash
   npm run start:api
   ```

### Frontend
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run start
   ```
4. Open `http://localhost:4200`.

### Run Both
```bash
cd frontend
npm run start:all
```

## Setup With Docker
1. Ensure Docker is running.
2. Build and start containers:
   ```bash
   docker-compose up --build
   ```
3. Access:
   - Frontend: `http://localhost:4200`
   - Backend APIs: `http://localhost:3000/api/todos`
   - MongoDB: `mongodb://localhost:27017/todos`
4. Stop containers:
   ```bash
   docker-compose down
   ```

### Docker Notes
- The frontend is served by Nginx, proxying `/api/` to the backend.
- The backend uses Mongoose with MongoDB.
- MongoDB data is persisted in a Docker volume (`mongodb-data`).
- Logs are available in `backend/logs/`.

## Features
- Add, update, delete, and mark ToDo items.
- Secure backend with Helmet and rate limiting.
- Structured logging with Winston.
- MongoDB for persistent storage.

## Troubleshooting
- **Docker Build Fails**:
  - Ensure `backend/.env` is not copied (use environment in `docker-compose.yml`).
  - Clear Docker cache:
    ```bash
    docker builder prune
    ```
- **MongoDB Connection**:
  - Check MongoDB container logs:
    ```bash
    docker logs todo-app-mongodb-1
    ```
- **Port Conflicts**:
  - Free ports 3000, 4200, 27017:
    ```bash
    lsof -i :3000
    kill -9 <PID>
    ```