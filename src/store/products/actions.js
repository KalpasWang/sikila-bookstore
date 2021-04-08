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
          type: 'negative',
          icon: 'info',
          message: `無法取得書籍列表：Status ${res.status}`,
        });
      }
    })
    .catch((err) => {
      commit('setProductsMsg', {
        type: 'negative',
        icon: 'info',
        message: `無法取得書籍列表：${err.message}`,
      });
    });
}

export function fetchProductsDetails({ commit }, id) {
  api
    .get(`/products?id=${id}`)
    .then((res) => {
      if (res.status === 200) {
        commit('setProductDetails', res.data[0]);
      } else {
        commit('setProductDetailsMsg', {
          type: 'negative',
          icon: 'info',
          message: `無法取得書籍：Status ${res.status}`,
        });
      }
    })
    .catch((err) => {
      commit('setProductDetailsMsg', {
        type: 'negative',
        icon: 'info',
        message: `無法取得書籍：${err.message}`,
      });
    });
}
