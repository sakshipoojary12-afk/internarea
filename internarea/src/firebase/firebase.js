import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCWq5mYBOjKiikhl3WSPTuXCgIWYL7WHo",
  authDomain: "intershala-4d07d.firebaseapp.com",
  projectId: "intershala-4d07d",
  storageBucket: "intershala-4d07d.firebasestorage.app",
  messagingSenderId: "968082011917",
  appId: "1:968082011917:web:8fab3de8c75e746833a244"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };