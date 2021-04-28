import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAjmpMLs-SDXwsQiFBptDanyT9KvnA6ZB4',
  authDomain: 'sikila-bookstore.firebaseapp.com',
  projectId: 'sikila-bookstore',
  storageBucket: 'sikila-bookstore.appspot.com',
  messagingSenderId: '50747345060',
  appId: '1:50747345060:web:b6930a63c8dc63f1b43e31',
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init firestore service
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();

export { projectFirestore, projectStorage };
