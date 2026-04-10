import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBv7uZbmTu-jrz3fN1D4laoQMpSgTqnZY4",
  authDomain: "the-task-fca1a.firebaseapp.com",
  projectId: "the-task-fca1a",
  storageBucket: "the-task-fca1a.firebasestorage.app",
  messagingSenderId: "856897595765",
  appId: "1:856897595765:web:df903e28387c2fea4d8b3c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);