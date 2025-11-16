// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const { logger } = require('firebase-functions')
// const { onRequest } = require('firebase-functions/https')
// const { onDocumentCreated } = require('firebase-functions/firestore')

// The Firebase Admin SDK to access Firestore.
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'
// import { connectFirestoreEmulator } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// // If running on localhost, connect client SDKs to emulators:
// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//   // Firestore emulator
//   connectFirestoreEmulator(db, '127.0.0.1', 8080)

//   // Auth emulator (if used)
//   // connectAuthEmulator(auth, 'http://127.0.0.1:9099')

//   // If you use functions client, you may connect them too (see below)
// }

export { auth, db }
export default app
