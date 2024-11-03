
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const apiKey = import.meta.env.VITE_APP_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_APP_FIREBASE_APP_ID;
console.log(apiKey,'apiKey');

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
