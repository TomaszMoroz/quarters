<template>
  <q-page>
    <q-card class="q-pa-md" style="max-width: 400px; margin: auto;">
      <q-card-section>
        <div class="text-h6">Upload File</div>
      </q-card-section>

      <q-card-section>
        <q-uploader
          label="Select file"
          auto-upload
          @added="uploadImage"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn :loading="uploading" label="Upload" color="primary" @click="startUpload" />
      </q-card-actions>

      <q-card-section v-if="imageUrl">
        <div class="q-mt-md text-h6">Uploaded Image:</div>
        <q-img :src="imageUrl" class="q-mt-sm" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { storage } from "boot/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const uploading = ref(false);
const imageUrl = ref(null);
const file = ref(null);

const uploadImage = (files) => {
  file.value = files[0]; // Get the first selected file
};

const startUpload = async () => {
  if (!file.value) {
    alert("Please select a file to upload.");
    return;
  }

  uploading.value = true;
  try {
    // Create a reference in Firebase Storage
    const fileRef = storageRef(storage, `uploads/${file.value.name}`);

    // Upload the file
    await uploadBytes(fileRef, file.value);

    // Get the file's download URL
    imageUrl.value = await getDownloadURL(fileRef);
    alert("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("File upload failed!");
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.q-card {
  margin-top: 20px;
}
</style>
