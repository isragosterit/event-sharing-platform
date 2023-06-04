import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
 
const firebaseConfig = {
    apiKey: "AIzaSyBQBeUeQqMOaPRA9hRlxMdGFuEWkP4v9Jk",
    authDomain: "events-project-cc941.firebaseapp.com",
    databaseURL: "https://events-project-cc941-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "events-project-cc941",
    storageBucket: "events-project-cc941.appspot.com",
    messagingSenderId: "447016930758",
    appId: "1:447016930758:web:f870ea10f39566d67bf6c7"
}
 
// Initialize Firebase and Firebase Authentication
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db }; // add getFirestore to your exports