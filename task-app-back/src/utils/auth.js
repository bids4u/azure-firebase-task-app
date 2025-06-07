// ../utils/auth.js
const admin = require("./firebase");

async function authenticate(request, context) {
  // Extract token from Authorization header
  let authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
  if (!authHeader) {
    for (const [key, value] of request.headers) {
      if (key.toLowerCase() === "authorization") {
        authHeader = value;
        break;
      }
    }
  }
  context.log("authHeader:", authHeader);

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
//   context.log("token:", token);

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // context.log("Decoded token:", decodedToken);
    return decodedToken; // Contains user info (e.g., uid, email)
  } catch (error) {
    context.log("Authentication error:", error.stack || error);
    if (error.code === "auth/id-token-expired") {
      throw new Error("Token expired");
    }
    if (error.code === "auth/argument-error" || error.code === "auth/invalid-credential") {
      throw new Error(`Invalid token: ${error.message}`);
    }
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

module.exports = { authenticate };