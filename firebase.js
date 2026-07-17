// firebase.js (compat com CDN)
const firebaseConfig = {
  apiKey: "AIzaSyBRvCA9M53MBSUwOuzeUX7myrMlevRzotw",
  authDomain: "hebraico-8d3bf.firebaseapp.com",
  projectId: "hebraico-8d3bf",
  storageBucket: "hebraico-8d3bf.appspot.com",   // ⚠️ corrigi para .appspot.com (padrão Firebase)
  messagingSenderId: "207294986594",
  appId: "1:207294986594:web:48e6123e48873ceba1143b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();