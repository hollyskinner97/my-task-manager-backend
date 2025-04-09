import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db("taskManager"); // or whatever DB name you prefer
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}
