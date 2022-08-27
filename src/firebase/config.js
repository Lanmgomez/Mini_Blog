import { initializeApp } from "firebase/app";
// import database
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBDobKTCeX3AhdKTFZJQkbawKTILY4lplA",
  authDomain: "mini-blog-77869.firebaseapp.com",
  projectId: "mini-blog-77869",
  storageBucket: "mini-blog-77869.appspot.com",
  messagingSenderId: "491770910172",
  appId: "1:491770910172:web:7ae1691bfb565bda61ab19"
};

const app = initializeApp(firebaseConfig);

// initialize database
const db = getFirestore(app)

export {db};