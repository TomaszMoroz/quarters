<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="email" label="Email" />
        <q-input v-model="password" label="Password" type="password" />
      </q-card-section>
      <q-card-actions>
        <q-btn label="Login" color="primary" @click="login" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { firebaseAuth } from 'boot/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');

const login = async () => {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
</script>
