<template>
  <q-page>
    <q-card class="q-pa-md" style="max-width: 800px; margin: auto;">
      <q-card-section>
        <div class="text-h6">Uploaded Files</div>
      </q-card-section>

      <q-card-section>
        <!-- Display list of files -->
        <q-list>
          <q-item
            v-for="(file, index) in files"
            :key="index"
            clickable
            @click="downloadFile(file.url)"
          >
            <q-item-section>
              <q-item-label>{{ file.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn label="Download" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storage, db } from "boot/firebase"; // Assuming firebase is set up
import { listAll, ref as storageRef, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

const files = ref([]); // List of files to display

// Fetch the list of uploaded files and their URLs
const fetchFiles = async () => {
  try {
    // Reference to Firebase Storage folder where files are uploaded
    const filesRef = storageRef(storage, 'uploads');

    // List all files in the "uploads" folder
    const fileList = await listAll(filesRef);

    // Fetch download URLs for each file
    for (const item of fileList.items) {
      const downloadURL = await getDownloadURL(item);
      files.value.push({
        name: item.name,
        url: downloadURL,
      });
    }
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

onMounted(fetchFiles); // Fetch files when the component is mounted

// Function to handle file download
const downloadFile = (url) => {
  // Open the file download URL in a new tab
  window.open(url, "_blank");
};
</script>

<style scoped>
.q-card {
  margin-top: 20px;
}
</style>
