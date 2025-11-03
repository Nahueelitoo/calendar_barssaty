// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAY616n87spcGOtKaXnOAUqeZW2zNmPG_8",
  authDomain: "calendario-barssaty.firebaseapp.com",
  projectId: "calendario-barssaty",
  storageBucket: "calendario-barssaty.firebasestorage.app",
  messagingSenderId: "156897755245",
  appId: "1:156897755245:web:8857a1a1eab25fc661bf64"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);