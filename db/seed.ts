import { connectToDatabase } from "./mongoClient";

async function seed() {
  const db = await connectToDatabase();
  const tasksCollection = db.collection("tasks");
  await tasksCollection.deleteMany({}); // Clear previous data

  const sampleTasks = [
    {
      title: "Learn MongoDB",
      inProgress: false,
      completed: false,
      dateCreated: Date.now(),
    },
    {
      title: "Build an app using Typescript",
      inProgress: false,
      completed: false,
      dateCreated: Date.now(),
    },
    {
      title: "Refactor app for MongoDB",
      inProgress: true,
      completed: false,
      dateCreated: Date.now(),
    },
  ];

  const result = await tasksCollection.insertMany(sampleTasks);
  console.log(`Database seeded correctly with ${result.insertedCount} tasks`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
