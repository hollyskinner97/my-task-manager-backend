import express, { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../db/mongoClient";
import { ObjectId } from "mongodb";

const usersRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Add a user via registration
usersRouter.post("/register", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "User registered", userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
}) as RequestHandler;

// user login route
usersRouter.post("/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
}) as RequestHandler;

export default usersRouter;
