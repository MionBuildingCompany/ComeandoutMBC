import * as firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBx1T40XL8pruasVJTcbbEZftgeKs6cZYg",
  authDomain: "smenovkymbc.firebaseapp.com",
  projectId: "smenovkymbc",
  storageBucket: "smenovkymbc.firebasestorage.app",
  messagingSenderId: "953873365620",
  appId: "1:953873365620:web:3abcf8f0e27e0828d9ef21",
  measurementId: "G-59BFYM106E"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);