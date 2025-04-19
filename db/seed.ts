import { connectToDatabase } from "./mongoClient";

async function seed() {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  const tasksCollection = db.collection("tasks");

  // Clear previous data
  await usersCollection.deleteMany({});
  await tasksCollection.deleteMany({});

  // Create a sample user
  const user = {
    email: "test@example.com",
    password: "hashedPassword",
  };

  const result = await usersCollection.insertOne(user);
  const userId = result.insertedId;

  console.log("User created with ID:", userId);

  // Create sample tasks (linked to the user)
  const sampleTasks = [
    {
      title: "Learn MongoDB",
      inProgress: false,
      completed: false,
      dateCreated: Date.now(),
      deadline: null,
      userId: userId,
    },
    {
      title: "Build an app using Typescript",
      inProgress: false,
      completed: false,
      dateCreated: Date.now(),
      deadline: null,
      userId: userId,
    },
    {
      title: "Refactor app for MongoDB",
      inProgress: true,
      completed: false,
      dateCreated: Date.now(),
      deadline: null,
      userId: userId,
    },
  ];

  // Insert tasks
  const taskResult = await tasksCollection.insertMany(sampleTasks);
  console.log(`Database seeded with ${taskResult.insertedCount} tasks`);

  process.exit(0); // Exit the process after seeding
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
