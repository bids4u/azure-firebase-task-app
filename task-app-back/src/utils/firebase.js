const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount), // Use cert instead of applicationDefault
      projectId: "azure-firebase-task-app" // Explicitly set projectId
    });
    console.log("Firebase Admin initialized with project ID:", admin.app().options.projectId);
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

module.exports = admin;