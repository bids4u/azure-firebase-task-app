const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");

app.http("createTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { db } = await connectToDatabase();

      const { title, description, status } = await request.json();

      if (!title) {
        return {
          status: 400,
          jsonBody: { error: "Title is required" },
        };
      }

      const task = {
        title,
        description,
        status: status || "pending",
        createdAt: new Date(),
      };

      const result = await db.collection("tasks").insertOne(task);
      console.log("Inserted Task:", result);

      return {
        status: 201,
        jsonBody: {
          ...task,
          _id: result.insertedId,
        },
      };
    } catch (error) {
      console.error("Function Error:", error);
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error" },
      };
    }
  },
});
