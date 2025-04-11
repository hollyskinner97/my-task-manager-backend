import express, { RequestHandler } from "express";
import { Task } from "../types/Task";
import { connectToDatabase } from "../../db/mongoClient";
import { ObjectId } from "mongodb";

const router = express.Router();

interface UpdatedTask {
  title?: string;
  inProgress?: boolean;
  completed?: boolean;
}

// GET all tasks
router.get("/", async (req, res): Promise<void> => {
  try {
    const db = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    // Fetch all tasks from the collection
    const tasks = await tasksCollection.find().toArray();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}) as RequestHandler;

// POST new task
router.post("/", async (req, res): Promise<void> => {
  try {
    const { title } = req.body;

    const newTask: Omit<Task, "_id"> = {
      title,
      dateCreated: Date.now(),
      inProgress: false,
      completed: false,
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
}) as RequestHandler;

// PATCH task (update title, inProgress status or completed status)
router.patch("/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, inProgress, completed } = req.body;

    if (title && title.length > 50) {
      res
        .status(400)
        .json({ error: "Task title must be 50 characters or fewer." });
      return;
    }

    const db = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    // Find the task by its MongoDB ObjectId
    const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Prepare update object
    const updatedTask: UpdatedTask = {};
    if (title !== undefined) updatedTask.title = title;
    if (inProgress !== undefined) updatedTask.inProgress = inProgress;
    if (completed !== undefined) updatedTask.completed = completed;

    // Update the task in the database
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTask }
    );

    // Fetch the updated task
    const updated = await tasksCollection.findOne({ _id: new ObjectId(id) });

    res.json(updated);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
}) as RequestHandler;

// DELETE task
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const db = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    // Delete the task from the database
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
}) as RequestHandler;

export default router;
