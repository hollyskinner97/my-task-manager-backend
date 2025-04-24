# Task Manager Application

This is the backend of the Task Manager app, built with Express.js, MongoDB and TypeScript. The backend provides a RESTful API for creating, updating, and deleting tasks, as well as setting deadlines.

## Features

- **Token Authentication**: Users are given a token upon registration (JWT) which allows them to access the app functionality.
- **Task Management**: CRUD (Create, Read, Update, Delete) operations for tasks.
- **Task Completion**: Mark tasks as completed or not completed.
- **Deadline Management**: Set deadlines, validate deadlines, and remove deadlines.
- **Data Validation**: Ensure that deadlines are at least 1 minute in the future and within 52 weeks.
- **API Endpoints**: Provides RESTful endpoints for interacting with tasks.
- **MongoDB**: Stores task data in MongoDB.

### Technologies Used

- **TypeScript:** Adds static typing to JavaScript for code quality control.
- **Express**: Web framework for Node.js used to build the API.
- **MongoDB**: Database used to store task information.
- **JWT**: For token authentication.

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/my-task-manager-backend
   cd my-task-manager-backend

2. Install dependencies:
   npm install

3. Ensure you have the correct API URL in the `mongoClient.ts` file:
   Example:
   const uri = "mongodb://localhost:27017";

4. Run the app:
   npm run dev

5. The front end of this app can be found at: https://github.com/hollyskinner97/my-task-manager-frontend

## API Endpoints

- **GET** `/tasks` - Get all tasks
- **POST** `/tasks` - Create a new task
- **PATCH** `/tasks/:id` - Update an existing task
- **DELETE** `/tasks/:id` - Delete a task

### Enjoy!
