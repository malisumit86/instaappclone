
  
  import firebase from  "firebase";
  
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBpWmI-OWwUtzGE2zNjRcdc9yb1srEYzp8",
    authDomain: "instaclone-3b15a.firebaseapp.com",
    databaseURL: "https://instaclone-3b15a.firebaseio.com",
    projectId: "instaclone-3b15a",
    storageBucket: "instaclone-3b15a.appspot.com",
    messagingSenderId: "331444971237",
    appId: "1:331444971237:web:519c4abb504c913cdf160c"
    // measurementId: "G-measurement-id",
  });
  
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  
  export {db,auth,storage};