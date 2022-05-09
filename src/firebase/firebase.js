import * as firebase from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAleKIv1rONAaYJUvFPMZgGmAVvzFRgVsM",
  authDomain: "xcape-hint-app.firebaseapp.com",
  databaseURL:
    "https://xcape-hint-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xcape-hint-app",
  storageBucket: "xcape-hint-app.appspot.com",
  messagingSenderId: "1063603328752",
  appId: "1:1063603328752:web:48e275031e86f438769435",
  measurementId: "G-PEBMQ7TR0D",
};

const app = firebase.initializeApp(firebaseConfig);
export const firebaseDB = getDatabase();
