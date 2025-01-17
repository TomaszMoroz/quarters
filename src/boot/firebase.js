import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyBoEqyTya6778nl8d2WogPn01BAauM88WM",
  authDomain: "quarters-fcbd0.firebaseapp.com",
  databaseURL: "https://quarters-fcbd0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quarters-fcbd0",
  storageBucket: "quarters-fcbd0.firebasestorage.app",
  messagingSenderId: "533915499744",
  appId: "1:533915499744:web:25ed02ba6a67eb4f612485",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const functions = getFunctions(firebaseApp);
const user = ref(null);

onAuthStateChanged(firebaseAuth, (currentUser) => {
  user.value = currentUser;
});

export { firebaseApp, firebaseAuth, db, storage, functions, user };
