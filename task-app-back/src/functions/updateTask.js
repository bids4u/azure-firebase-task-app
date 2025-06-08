const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { updateTaskData, VALID_STATUSES } = require("../utils/taskModel");
const { ObjectId } = require("mongodb");
const { authenticate } = require("../utils/auth");

app.http("updateTask", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "updateTask/{id}",
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

      const updates = await request.json();

      // Validate status if provided
      if (updates.status && !VALID_STATUSES.includes(updates.status)) {
        return {
          status: 400,
          jsonBody: {
            error: `Invalid status value. Allowed: ${VALID_STATUSES.join(
              ", "
            )}`,
          },
        };
      }

      const { db } = await connectToDatabase();
      const existingTask = await db.collection("tasks").findOne({
        _id: new ObjectId(id),
        userId: decodedToken.uid // Ensure only the task owner can update
      });

      if (!existingTask) {
        return {
          status: 404,
          jsonBody: { error: "Task not found or not authorized" },
        };
      }

      const updatedTask = updateTaskData(existingTask, updates);
      await db.collection("tasks").updateOne(
        { _id: new ObjectId(id), userId: decodedToken.uid },
        // { _id: new ObjectId(id) },
        { $set: updatedTask }
      );

      return {
        status: 200,
        jsonBody: updatedTask,
      };
    } catch (error) {
      context.log.error("Update task error:", error.stack || error);
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
