import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBVaMA1ibpQe-pj2WHhOi48L6bNz9GiQV0",
    authDomain: "instagram-clone-9260d.firebaseapp.com",
    projectId: "instagram-clone-9260d",
    storageBucket: "instagram-clone-9260d.appspot.com",
    messagingSenderId: "415239043466",
    appId: "1:415239043466:web:6c1b1158c1a97abcc2b073",
    measurementId: "G-YFXSW5EKP3"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};