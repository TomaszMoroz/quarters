<template>
  <q-page>
    <q-card class="q-pa-md" style="max-width: 400px; margin: auto;">
      <q-card-section>
        <div class="text-h6">Create Document</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="title" label="Document Title" filled class="q-mb-md" />
        <q-input v-model="content" label="Content" filled type="textarea" class="q-mb-md" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn :loading="loading" label="Save Document" color="primary" @click="saveDocument" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { db, firebaseAuth } from "boot/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const title = ref("");
const content = ref("");
const loading = ref(false);

const saveDocument = async () => {
  if (!title.value || !content.value) {
    alert("Title and content are required.");
    return;
  }

  loading.value = true;
  try {
    await addDoc(collection(db, "Documents"), {
      title: title.value,
      content: content.value,
      creatorEmail: firebaseAuth.currentUser.email,
      timestamp: serverTimestamp(),
    });
    alert("Document saved successfully!");
    title.value = "";
    content.value = "";
  } catch (error) {
    console.error("Error saving document:", error);
    alert("Failed to save document.");
  } finally {
    loading.value = false;
  }
};
</script>
