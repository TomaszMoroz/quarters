<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
<q-toolbar>
  <q-btn flat label="Home" to="/" />
  <q-btn flat label="Files" to="/files" />
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
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { user } from 'src/boot/firebase';

const router = useRouter();

const loggedUser = ref(null)

const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  router.push('/login'); // Redirect to the login page after logout
};

onMounted(() => {
  loggedUser.value = user
})
</script>
