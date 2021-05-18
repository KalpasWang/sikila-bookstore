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
      const books = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      commit('setUserBooks', books);
      commit('setUserMsg', '');
    }
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}

export async function fetchOneUserBook({ commit }, { id }) {
  try {
    const doc = await projectFirestore
      .collection('userBooks')
      .doc(id)
      .get();
    if (!doc.exists) {
      throw new Error('找不到這本書');
    }
    return { ...doc.data(), id: doc.id };
  } catch (error) {
    commit('setUserMsg', error.message);
    return {};
  }
}

export async function fetchUserSetting({ commit }, id) {
  try {
    const ref = projectFirestore.collection('userSetting').doc(id);
    const res = await ref.get();
    if (!res.exists) {
      await ref.set({ fontSize: 20, theme: 0 });
      commit('setUserSetting', { fontSize: 20, theme: 0 });
    } else {
      commit('setUserSetting', res.data());
    }
    commit('setUserMsg', '');
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
      return orders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    }
    return [];
  } catch (error) {
    commit('setUserMsg', error.message);
    return [];
  }
}

export async function enableUserOrder({ commit }, id) {
  try {
    const docRef = projectFirestore.collection('userBooks').doc(id);
    await docRef.update({
      isEnabled: true,
    });
    commit('setUserMsg', '');
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}

export async function deleteUserOrder({ commit }, id) {
  try {
    const docRef = projectFirestore.collection('userBooks').doc(id);
    await docRef.delete();
    commit('setUserMsg', '');
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}

export async function updateUserSetting({ commit }, { id, fontSize, theme }) {
  try {
    const docRef = projectFirestore.collection('userSetting').doc(id);
    await docRef.update({
      fontSize,
      theme,
    });
    commit('setUserMsg', '');
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}

export async function updateUserBookProgress({ commit }, { id, progress }) {
  try {
    const docRef = projectFirestore.collection('userBooks').doc(id);
    await docRef.update({
      progress,
    });
    commit('setUserMsg', '');
  } catch (error) {
    commit('setUserMsg', error.message);
  }
}
