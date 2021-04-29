import { projectAuth } from 'boot/firebase.config';

let user = projectAuth.currentUser;

// 在 function 外監聽 auth 動態
// 所以只會有一個 listener
projectAuth.onAuthStateChanged((_user) => {
  console.log('User state change. Current user is:', _user);
  user = _user;
});

const getUser = () => user;

export default getUser;
