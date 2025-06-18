# ToDo List Application

This is a full-stack ToDo list application with a Node.js backend and an Angular frontend. The app supports adding, updating, removing, and marking ToDo items as done.

## Folder Structure

```
todo-app/
├── frontend/  ← Angular frontend
├── backend/   ← Node.js backend
├── README.md
```

## Prerequisites

- Node.js (v18 or later)
- npm
- Angular CLI (`npm install -g @angular/cli`)

## Backend Setup

The backend uses Express, json-server, and TypeScript to provide a RESTful API.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
5. The backend runs on `http://localhost:3000`. API endpoints are available at `/api/todos`.

## Frontend Setup

The frontend is an Angular 17 app using standalone components.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open `http://localhost:4200` in your browser to view the app.

### Proxy Configuration

To avoid CORS issues, a proxy is configured in `frontend/proxy.conf.json`. Ensure the backend is running before starting the frontend.

## Features

- Add new ToDo items by entering a title and clicking "Add" or pressing Enter.
- Toggle ToDo completion with the checkbox.
- Edit ToDo titles by modifying the text field and pressing Enter or clicking away.
- Delete ToDo items with the "Delete" button.

## Troubleshooting

- Ensure the backend is running before starting the frontend.
- If you encounter CORS issues, verify the proxy configuration in `frontend/proxy.conf.json` and `frontend/angular.json`.
- Check that port `3000` (backend) and `4200` (frontend) are not in use.