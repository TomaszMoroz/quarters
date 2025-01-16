<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Your Messages</div>
      </q-card-section>
    </q-card>

    <!-- Message List -->
    <q-list bordered class="q-mt-md">
      <q-item
        v-for="message in messages"
        :key="message.id"
        clickable
        class="q-pa-md"
        :class="{'bg-light-green': !message.isread}"
        @click="openMessage(message)"
      >
        <q-item-section>
          <div>
            <strong>From:</strong> {{ message.sender }}
          </div>
          <div>
            <strong>Message:</strong> {{ message.text }}
          </div>
          <div v-if="message.fileUrl">
            <strong>Attachment:</strong>
            <a :href="message.fileUrl" target="_blank" class="text-primary">
              Download File
            </a>
          </div>
          <div class="text-grey-7 text-caption">
            {{ formatTimestamp(message.timestamp) }}
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Message Dialog -->
    <q-dialog v-model="messageDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Message Details</div>
          <div>{{ selectedMessage?.text }}</div>
          <div v-if="selectedMessage?.fileUrl">
            <a :href="selectedMessage.fileUrl" target="_blank" class="text-primary">
              Download Attachment
            </a>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Mark as Read" color="primary" @click="markAsRead" />
          <q-btn label="Close" color="secondary" @click="closeMessageDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, user } from 'boot/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';

// Reactive States
const messages = ref([]);
const incomingMessages = ref(0);
const messageDialogOpen = ref(false);
const selectedMessage = ref(null);

// Fetch Messages Function
const fetchMessages = async () => {
  const recipient = user.value?.email;
  if (!recipient) {
    console.error("You must be logged in to read messages.");
    return;
  }

  try {
    const messagesQuery = query(
      collection(db, "messages"),
      where("recipient", "==", recipient),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    messages.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Failed to fetch messages:", error.message);
  }
};

// Real-Time Listener for Unread Messages
const listenForUnreadMessages = () => {
  const recipient = user.value?.email;
  if (!recipient) {
    console.error("You must be logged in to read messages.");
    return;
  }

  const messagesQuery = query(
    collection(db, "messages"),
    where("recipient", "==", recipient),
    where("isread", "==", false), // Only listen for unread messages
    orderBy("timestamp", "desc")
  );

  // Real-time listener
  onSnapshot(messagesQuery, (querySnapshot) => {
    messages.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    incomingMessages.value = querySnapshot.size;  // Update unread message count
  });
};

// Format Timestamp
const formatTimestamp = (timestamp) => {
  return timestamp ? new Date(timestamp.toMillis()).toLocaleString() : "Unknown Time";
};

// Mark message as read
const markAsRead = async () => {
  if (selectedMessage.value) {
    try {
      const messageRef = doc(db, "messages", selectedMessage.value.id);
      await updateDoc(messageRef, { isread: true });
      selectedMessage.value.isread = true; // Update UI immediately
    } catch (error) {
      console.error("Error marking message as read:", error.message);
    }
  }
};

// Open Message Dialog
const openMessage = (message) => {
  selectedMessage.value = message;
  messageDialogOpen.value = true;
};

// Close Message Dialog
const closeMessageDialog = () => {
  messageDialogOpen.value = false;
};

// Fetch messages initially
onMounted(() => {
  fetchMessages();
  listenForUnreadMessages();  // Start listening for new unread messages
});
</script>

<style scoped>
.bg-light-green {
  background-color: #a8e6a3;  /* Light green color */
}
</style>
