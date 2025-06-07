const { app } = require("@azure/functions");
const connectToDatabase = require("../utils/db");

app.http("getTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const {db} = await connectToDatabase();

    try {
      const tasks = await db.collection("tasks").find({}).toArray();

      return {
        status: 200,
        jsonBody: tasks,
      };
    } catch (error) {
      context.log("Get tasks error:", error.stack || error);
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error" },
      };
    }
  },
});
