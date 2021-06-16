import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

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
const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

let user = 'pending';

async function syncUserState() {
  projectAuth.onAuthStateChanged((_user) => {
    // 如果已經有使用者的id
    if (_user && _user.uid) {
      const { email, displayName } = _user;

      projectFirestore
        .collection('users')
        .where('email', '==', email)
        .get()
        .then((res) => {
          if (!res.empty) {
            const uid = res.docs[0].id;
            user = { uid, email, displayName };
          } else {
            user = null;
          }
        })
        .catch(() => {
          user = null;
        });
    } else {
      user = null;
    }
  });
}

async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    // 如果還沒拿到使用者資料
    if (user === 'pending') {
      const t1 = Date.now();
      const timerId = setInterval(() => {
        // 超過3秒就 reject
        if (Date.now() - t1 >= 3000) {
          reject('無法取得使用者');
        }
        if (typeof user === 'object') {
          clearInterval(timerId);
          resolve(user);
        } else if (!user) {
          clearInterval(timerId);
          resolve(user);
        }
      }, 20);
    } else {
      resolve(user);
    }
  });
}

export {
  projectAuth,
  projectFirestore,
  projectStorage,
  timestamp,
  syncUserState,
  getCurrentUser,
};
