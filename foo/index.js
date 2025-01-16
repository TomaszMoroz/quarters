import { firestore } from "firebase-functions";
import { initializeApp } from "firebase-admin";

initializeApp();

export const sendNotification = firestore
  .document("SentFiles/{sentFileId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { recipientEmail, documentId } = data;

    // Add your notification logic here (e.g., send an email)
    console.log(`Notification sent to ${recipientEmail} for document ${documentId}`);
  });
