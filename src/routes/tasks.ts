import express, { RequestHandler } from "express";
import { Task } from "../types/Task";
import { randomUUID } from "crypto";

const router = express.Router();

let tasks: Task[] = [
  {
    id: "001",
    title: "First task",
    dateCreated: Date.now(),
    inProgress: false,
    completed: false,
  },
];

interface UpdatedTask {
  title?: string;
  inProgress?: boolean;
  completed?: boolean;
}

// GET all tasks
router.get("/", (req, res) => {
  res.json(tasks);
});

// POST new task
router.post("/", (req, res) => {
  const { title } = req.body;
  const newTask: Task = {
    id: randomUUID(),
    title,
    dateCreated: Date.now(),
    inProgress: false,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH task (update title, inProgress status or completed status)
router.patch("/:id", ((req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (typeof req.body.title === "string") {
    task.title = req.body.title;
  }
  if (typeof req.body.inProgress === "boolean") {
    task.inProgress = req.body.inProgress;
  }
  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  res.json(task);
}) as RequestHandler);

// DELETE task
router.delete("/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== req.params.id);
  res.status(204).send();
});

export default router;
