<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Send a Message</div>
      </q-card-section>
      <q-card-section>
        <!-- Recipient Selection -->
        <q-select
          v-model="selectedRecipient"
          :options="recipients"
          label="Select Recipient"
          outlined
          dense
        />

        <!-- Message Input -->
        <q-input
          v-model="message"
          label="Your Message"
          type="textarea"
          rows="4"
          filled
          class="q-mt-md"
        />

        <!-- File Attachment -->
        <q-input
          v-model="file"
          type="file"
          filled
          class="q-mt-md"
          @change="handleFileChange"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Send Message"
          color="primary"
          @click="sendMessage"
          :disable="!selectedRecipient || !message"
        />
      </q-card-actions>
    </q-card>

    <!-- Feedback Messages -->
    <q-banner v-if="statusMessage" :color="statusColor" class="q-mt-md">
      {{ statusMessage }}
    </q-banner>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storage, db, user } from "boot/firebase";
import { ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uid } from "quasar";

// Reactive States
const selectedRecipient = ref("");
const message = ref("");
const file = ref(null);
const statusMessage = ref(null);
const statusColor = ref("");

// Dummy Recipients List
const recipients = [
  "tmoroz688+logistics@gmail.com",
  "tmoroz688+ocoka@gmail.com",
  "tmoroz688@gmail.com",
];

// Handle File Selection
const handleFileChange = (event) => {
  const files = event.target.files;
  file.value = files.length > 0 ? files[0] : null;
};

// Send Message
const sendMessage = async () => {
  const sender = user.value?.email;
  if (!sender) {
    statusMessage.value = "You must be logged in to send messages.";
    statusColor.value = "red";
    return;
  }

  try {
    statusMessage.value = "Sending message...";
    statusColor.value = "blue";

    let fileUrl = null;
    if (file.value) {
      const fileId = uid();
      const filePath = `uploads/${sender}/messages/${fileId}-${file.value.name}`;
      const storageRef = firebaseRef(storage, filePath);

      // Upload the file
      await uploadBytes(storageRef, file.value);
      fileUrl = await getDownloadURL(storageRef);
    }

    // Save message in Firestore
    const messageDoc = {
      sender,
      recipient: selectedRecipient.value,
      text: message.value,
      fileUrl,
      timestamp: serverTimestamp(),
      isread: false
    };

    await addDoc(collection(db, "messages"), messageDoc);

    // Success Feedback
    statusMessage.value = "Message sent successfully!";
    statusColor.value = "green";

    // Reset form
    selectedRecipient.value = "";
    message.value = "";
    file.value = null;
  } catch (error) {
    console.error("Failed to send message:", error.message);
    statusMessage.value = "Failed to send message: " + error.message;
    statusColor.value = "red";
  }
};
</script>

<style scoped>
.q-banner {
  text-align: center;
}
</style>







<!-- <template>
  <q-page>
    <q-card class="q-pa-md" style="max-width: 400px; margin: auto;">
      <q-card-section>
        <div class="text-h6">Send Document</div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="selectedDocumentId"
          :options="documentOptions"
          label="Choose a Document"
          filled
          class="q-mb-md"
        />
        <q-input v-model="recipientEmail" label="Recipient's Email" filled />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          :loading="sending"
          label="Send File"
          color="primary"
          @click="sendFile"
        />
      </q-card-actions>

      <q-card-section v-if="message">
        <div :class="messageClass" class="q-mt-md">{{ message }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { firebaseAuth, db } from "boot/firebase";  // Corrected import for Firestore
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const sending = ref(false);
const selectedDocumentId = ref(null);
const documentOptions = ref([]);
const recipientEmail = ref("");
const message = ref("");
const messageClass = ref("text-positive");

const loggedUser = ref(null);

// Fetch logged-in user
onMounted(() => {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      loggedUser.value = user.email;
    } else {
      loggedUser.value = null;
    }
  });

  fetchDocuments();
});

// Fetch available documents
const fetchDocuments = async () => {
  try {
    const docsSnapshot = await getDocs(collection(db, "documents"));
    documentOptions.value = docsSnapshot.docs
      .filter((doc) => doc.data().owner === loggedUser.value)
      .map((doc) => ({ label: doc.data().title, value: doc.id }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    message.value = "Failed to fetch documents.";
    messageClass.value = "text-negative";
  }
};

// Send the document to the recipient
const sendFile = async () => {
  if (!selectedDocumentId.value || !recipientEmail.value) {
    message.value = "Please select a document and enter a recipient.";
    messageClass.value = "text-negative";
    return;
  }

  sending.value = true;

  try {
    const documentRef = doc(db, "documents", selectedDocumentId.value);
    await updateDoc(documentRef, {
      sharedWith: recipientEmail.value,
    });

    message.value = `Document sent successfully to ${recipientEmail.value}!`;
    messageClass.value = "text-positive";
  } catch (error) {
    console.error("Error sending document:", error);
    message.value = "Failed to send the document.";
    messageClass.value = "text-negative";
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.q-card {
  margin-top: 20px;
}
</style> -->
