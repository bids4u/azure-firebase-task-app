const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { updateTaskData, VALID_STATUSES } = require("../utils/taskModel");
const { ObjectId } = require("mongodb");

app.http("updateTask", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "updateTask/{id}",
  handler: async (request, context) => {
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
      return {
        status: 400,
        jsonBody: { error: "Invalid task ID" },
      };
    }

    const updates = await request.json(); // <- fix here

    // Validate status if provided
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return {
        status: 400,
        jsonBody: {
          error: `Invalid status value. Allowed: ${VALID_STATUSES.join(", ")}`,
        },
      };
    }

    const {db} = await connectToDatabase();

    try {
      const existingTask = await db
        .collection("tasks")
        .findOne({ _id: new ObjectId(id) });

      if (!existingTask) {
        return {
          status: 404,
          jsonBody: { error: "Task not found" },
        };
      }

      const updatedTask = updateTaskData(existingTask, updates);

      await db
        .collection("tasks")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedTask });

      return {
        status: 200,
        jsonBody: updatedTask,
      };
    } catch (error) {
      context.log.error("Update task error:", error);
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error" },
      };
    }
  },
});
