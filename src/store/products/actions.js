/*
export function someAction (context) {
}
*/
import { api } from 'boot/axios';

export function fetchProducts({ commit }) {
  api
    .get('/products')
    .then((res) => {
      if (res.status === 200) {
        commit('setProducts', res.data);
      } else {
        commit('setProductsMsg', {
          position: 'top-right',
          type: 'negative',
          icon: 'info',
          message: `無法取得書籍列表：Status ${res.status}`,
        });
      }
    })
    .catch((err) => {
      commit('setProductsMsg', {
        position: 'top-right',
        type: 'negative',
        icon: 'info',
        message: `無法取得書籍列表：${err.message}`,
      });
    });
}
