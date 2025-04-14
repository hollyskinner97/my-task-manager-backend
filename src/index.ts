import express from "express";
import router from "./routes/tasks";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/tasks", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
