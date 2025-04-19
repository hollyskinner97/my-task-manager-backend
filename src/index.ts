import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", usersRouter);
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Task Manager API. Unless logged in, you will not be able to access database data."
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
