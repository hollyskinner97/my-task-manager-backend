import express, { RequestHandler } from "express";
import { Task } from "../types/Task";
import { connectToDatabase } from "../../db/mongoClient";
import { ObjectId } from "mongodb";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

interface UpdatedTask {
  title?: string;
  inProgress?: boolean;
  deadline?: Date | null;
  completed?: boolean;
}

// GET all tasks
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      // Fetch all tasks from the collection
      const userId = req.user?.userId;

      if (!userId) {
        res.status(400).json({ error: "User ID not found" });
        return;
      }

      const tasks = await tasksCollection.find({ userId }).toArray();
      res.json(tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
) as RequestHandler;

// POST new task
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const { title } = req.body;

      if (!req.user?.userId) {
        res.status(400).json({ error: "User ID is missing" });
        return;
      }

      const newTask: Omit<Task, "_id"> = {
        title,
        dateCreated: Date.now(),
        deadline: null,
        inProgress: false,
        completed: false,
        userId: req.user.userId,
      };

      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      // Insert the new task into the database
      const result = await tasksCollection.insertOne(newTask);

      // Return the newly created task
      const insertedTask = await tasksCollection.findOne({
        _id: result.insertedId,
      });
      res.status(201).json(insertedTask);
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ error: "Failed to add task" });
    }
  }
) as RequestHandler;

// PATCH task (update title, inProgress status or completed status)
router.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, inProgress, completed, deadline } = req.body;

      if (
        title !== undefined &&
        (typeof title !== "string" || title.length > 50)
      ) {
        res
          .status(400)
          .json({ error: "Task title must be 50 characters or fewer." });
        return;
      }

      // Validate deadline (if present)
      let parsedDeadline: Date | null | undefined;
      if (deadline !== undefined) {
        if (deadline === null) {
          parsedDeadline = null;
        } else {
          const parsed = new Date(deadline);
          if (isNaN(parsed.getTime())) {
            res.status(400).json({ error: "Invalid deadline date format." });
            return;
          }
          parsedDeadline = parsed;
        }
      }

      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      // Find the task by its MongoDB ObjectId
      const task = await tasksCollection.findOne({
        _id: new ObjectId(id),
        userId: req.user?.userId,
      });

      if (!task) {
        res.status(404).json({ error: "Task not found or unauthorised" });
        return;
      }

      // Prepare update object
      const updatedTask: UpdatedTask = {};
      if (title !== undefined) updatedTask.title = title;
      if (inProgress !== undefined) updatedTask.inProgress = inProgress;
      if (completed !== undefined) updatedTask.completed = completed;
      if (parsedDeadline !== undefined) updatedTask.deadline = parsedDeadline;

      // Update the task in the database
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id), userId: req.user?.userId },
        { $set: updatedTask }
      );

      if (result.modifiedCount === 0) {
        res.status(400).json({ error: "No changes made to the task" });
        return;
      }

      // Fetch the updated task
      const updated = await tasksCollection.findOne({ _id: new ObjectId(id) });

      res.json(updated);
    } catch (err) {
      console.error("Error updating task:", err);
      res.status(500).json({ error: "Failed to update task" });
    }
  }
) as RequestHandler;

// DELETE task
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const { id } = req.params;

      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      // Delete the task from the database
      const result = await tasksCollection.deleteOne({
        _id: new ObjectId(id),
        userId: req.user?.userId,
      });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Task not found or unauthorised" });
        return;
      }

      res.status(204).send();
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
) as RequestHandler;

export default router;
