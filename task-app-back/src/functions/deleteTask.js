const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");
const { ObjectId } = require("mongodb");

app.http("deleteTask", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const { id } = request.params;

    if (!ObjectId.isValid(id)) {
      return {
        status: 400,
        jsonBody: { error: "Invalid task ID" },
      };
    }

    const {db} = await connectToDatabase();

    try {
      const result = await db
        .collection("tasks")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return {
          status: 404,
          jsonBody: { error: "Task not found" },
        };
      }

      return {
        status: 204, // No Content
      };
    } catch (error) {
      context.log.error("Delete task error:", error);
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error" },
      };
    }
  },
});
