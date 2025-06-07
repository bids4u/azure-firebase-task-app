const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { authenticate } = require("../utils/auth");

app.http("createTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      // Authenticate user
      const decodedToken = await authenticate(request, context);
      context.log("Authenticated user:", decodedToken.uid);

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
        userId: decodedToken.uid, // Associate task with authenticated user
      };

      const result = await db.collection("tasks").insertOne(task);
      context.log("Inserted Task:", result);

      return {
        status: 201,
        jsonBody: {
          ...task,
          _id: result.insertedId,
        },
      };
    } catch (error) {
      context.log("Error:", error.stack || error);
      if (error.message === "No token provided") {
        return {
          status: 401,
          jsonBody: { error: "No token provided" },
        };
      }
      if (error.message === "Token expired") {
        return {
          status: 401,
          jsonBody: { error: "Token expired" },
        };
      }
      if (error.message.startsWith("Invalid token")) {
        return {
          status: 401,
          jsonBody: { error: error.message },
        };
      }
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error", details: error.message },
      };
    }
  },
});