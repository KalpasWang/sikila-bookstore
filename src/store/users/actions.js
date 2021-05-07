/*
export function someAction (context) {
}
*/
import { projectFirestore } from 'boot/firebase.config';

export async function fetchUserBooks({ commit }, id) {
  try {
    const res = await projectFirestore
      .collection('userBooks')
      .where('uid', '==', id)
      .get();
    if (!res.empty) {
      const books = res.docs.map((doc) => ({ ...doc.data() }));
      commit('setUserBooks', books);
      commit('setUserMsg', '');
    } else {
      throw Error('目前還沒有書籍');
    }
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}

export async function fetchUserOrders({ commit }) {
  try {
    const res = await projectFirestore
      .collection('userBooks')
      .where('isEnabled', '==', false)
      .get();
    commit('setUserMsg', '');
    if (!res.empty) {
      const orders = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return orders;
    }
    return [];
  } catch (error) {
    commit('setUserMsg', error.message);
    return [];
  }
}

// export async function patchUserData({ commit }, { id, fontSize, theme }) {
//   try {
//     const res = await api.patch(`/usersData/${id}`, { fontSize, theme });
//     if (res.status === 200) {
//       commit('setUserData', res.data);
//       commit('setUserDataMsg', '');
//     } else {
//       throw Error('無法更新使用者資料');
//     }
//   } catch (error) {
//     commit('setUserDataMsg', error.message);
//   }
// }
