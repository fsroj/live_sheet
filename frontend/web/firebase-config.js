// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFIL0_KWnc9Um4lcOl5Wif4M7wNf3xVZI",
  authDomain: "lify-280503.firebaseapp.com",
  projectId: "lify-280503",
  storageBucket: "lify-280503.firebasestorage.app",
  messagingSenderId: "54623925516",
  appId: "1:54623925516:web:0d8b9f9d1ef98b52fa0529",
  measurementId: "G-ED9TCH9T37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Solo en desarrollo
if (window.location.hostname === "localhost") {
  firebase.firestore().useEmulator("localhost", 8080);
  firebase.auth().useEmulator("http://localhost:9099");
  console.log("Usando emuladores de Firebase");
}

// Opcional: Habilita persistencia de datos offline
firebase.firestore().enablePersistence()
  .catch((err) => {
    console.log("Error al habilitar persistencia:", err);
  });