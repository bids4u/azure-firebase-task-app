const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { ObjectId } = require("mongodb");
const { authenticate } = require("../utils/auth");

app.http("deleteTask", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "deleteTask/{id}", // Added route to specify {id} parameter
  handler: async (request, context) => {
    try {
      // Authenticate user
      const decodedToken = await authenticate(request, context);
      context.log("Authenticated user:", decodedToken.uid);

      const { id } = request.params;

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          jsonBody: { error: "Invalid task ID" },
        };
      }

      const { db } = await connectToDatabase();
      const result = await db
        .collection("tasks")
        .deleteOne({ 
          _id: new ObjectId(id),
          userId: decodedToken.uid // Ensure only the task owner can delete
        });

      if (result.deletedCount === 0) {
        return {
          status: 404,
          jsonBody: { error: "Task not found or not authorized" },
        };
      }

      return {
        status: 204, // No Content
      };
    } catch (error) {
      context.log.error("Delete task error:", error.stack || error);
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