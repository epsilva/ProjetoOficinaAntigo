import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCrw4c16nCUSfORAAj90-BrziVV_RGpYcY",
    authDomain: "mecanicapp-13be9.firebaseapp.com",
    databaseURL: "https://mecanicapp-13be9.firebaseio.com",
    projectId: "mecanicapp-13be9",
    storageBucket: "mecanicapp-13be9.appspot.com",
    messagingSenderId: "656232187547",
    appId: "1:656232187547:web:aefe3c5ae335331b"
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const firebaseStorage = firebase.storage();