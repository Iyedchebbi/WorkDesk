
// Fix: Use compatibility imports for Firebase v8 syntax in a v9+ environment to resolve type errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Initialize Firebase with the provided configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj3YTIGCEoNgCB170Jckm84Q30ceNCuoc",
  authDomain: "server-438811.firebaseapp.com",
  projectId: "server-438811",
  storageBucket: "server-438811.firebasestorage.app",
  messagingSenderId: "260502358532",
  appId: "1:260502358532:web:ef00b273c0872dd72c8351",
  measurementId: "G-S528PTWZ59"
};

// Use existing app if initialized, otherwise initialize a new one
// Fix: Accessing apps and initializeApp through the compat layer resolves the 'Property does not exist' errors
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

// Export instances using the namespaced API (Firebase v8 compat)
// Fix: Using the compat imports ensures .auth() and .firestore() are available on the firebase object
export const auth = firebase.auth();
export const db = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default app;
