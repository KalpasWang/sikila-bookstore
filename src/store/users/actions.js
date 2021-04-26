/*
export function someAction (context) {
}
*/
import { api } from 'boot/axios';

export async function fetchUserData({ commit }, id) {
  try {
    const res = await api.get(`/usersData?id=${id}`);
    if (res.status === 200) {
      commit('setUserData', res.data[0]);
      commit('setUserDataMsg', '');
    } else {
      throw Error('無法取得使用者資料');
    }
  } catch (error) {
    commit('setUserDataMsg', error.message);
  }
}

export async function patchUserData({ commit }, { id, fontSize, theme }) {
  try {
    const res = await api.patch(`/usersData/${id}`, { fontSize, theme });
    if (res.status === 200) {
      commit('setUserData', res.data);
      commit('setUserDataMsg', '');
    } else {
      throw Error('無法更新使用者資料');
    }
  } catch (error) {
    commit('setUserDataMsg', error.message);
  }
}
