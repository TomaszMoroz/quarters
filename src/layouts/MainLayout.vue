<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
    <q-toolbar v-if="loggedUser">
      <q-btn flat label="Files" to="/files" icon="upload" />
      <q-btn
        v-if="loggedUser"
        icon="download"
        flat
        class="q-mr-md"
        label="Fetch"
        to="/fetch"
      />
      <q-btn
        v-if="loggedUser"
        icon="edit"
        flat
        class="q-mr-md"
        label="Create document"
        to="create"
      />
      <q-btn
        v-if="loggedUser"
        icon="mail"
        flat
        class="q-mr-md"
        label="Inbox"
        to="inbox"
      >
       <q-badge color="orange" floating>{{ incomingMessages }}</q-badge>
      </q-btn>
      <q-btn
        v-if="loggedUser"
        icon="send"
        flat
        class="q-mr-md"
        label="Send"
        to="send"
      />
      <q-btn
        v-if="loggedUser"
        icon="account_circle"
        flat
        @click="logout"
        class="q-mr-md"
        label="Logout"
      />
    </q-toolbar>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { user, db } from 'src/boot/firebase';  // Assuming db is the Firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore';  // Firestore querying methods

const router = useRouter();
const loggedUser = ref(null);
const incomingMessages = ref(0);  // Count of unread messages

const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  router.push('/login');  // Redirect to the login page after logout
};

// Fetch unread messages
const fetchUnreadMessages = async () => {
  if (!loggedUser.value) return;

  const userEmail = loggedUser.value.email;  // Ensure you're using the email string here
  const messagesRef = collection(db, 'messages');  // Assuming messages are stored in 'messages' collection
  const q = query(messagesRef,
                  where('recipient', '==', userEmail),  // Filter by recipient's email
                  where('isread', '==', false));  // Filter by unread messages

  try {
    const querySnapshot = await getDocs(q);
    console.log('snap', querySnapshot, userEmail);
    incomingMessages.value = querySnapshot.size;  // Set the unread messages count
  } catch (error) {
    console.error("Error fetching unread messages:", error.message);
  }
};

onMounted(() => {
  loggedUser.value = user.value;
  console.log(loggedUser.value);
  if (loggedUser.value) {
    fetchUnreadMessages();  // Fetch unread messages when the component is mounted
  }
});

watch(user, newUser => {
  if (newUser) {
    loggedUser.value = newUser;  // Ensure the full User object is assigned here
    console.log('new user', newUser.email);
    fetchUnreadMessages();  // Fetch unread messages when the user changes
  } else {
    loggedUser.value = null;
    incomingMessages.value = 0; // Reset the unread message count on logout
  }
});
</script>
