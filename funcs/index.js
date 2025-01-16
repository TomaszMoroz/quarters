const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  const { receiver, fileName, timestamp } = data;

  if (!receiver || !fileName || !timestamp) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required parameters."
    );
  }

  try {
    // Simulate sending a notification
    console.log(`Notification for ${receiver}: ${fileName} uploaded at ${timestamp}`);

    // TODO: Replace this with actual notification logic
    return { success: true, message: "Notification sent successfully!" };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to send notification."
    );
  }
});
