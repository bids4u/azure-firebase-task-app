const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { authenticate } = require("../utils/auth");

app.http("getTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      // Authenticate user
      const decodedToken = await authenticate(request, context);
      // context.log("Authenticated user:", decodedToken.uid);

      const { db } = await connectToDatabase();
      // Optionally filter tasks by userId
      const tasks = await db
        .collection("tasks")
        .find({ userId: decodedToken.uid })
        .toArray();
      // const tasks = await db.collection("tasks").find().toArray();

      context.log(tasks);
      return {
        status: 200,
        jsonBody: tasks,
      };
    } catch (error) {
      context.log(error)
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
