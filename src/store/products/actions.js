/*
export function someAction (context) {
}
*/
import { api } from 'boot/axios';

export async function fetchProducts({ commit }) {
  try {
    const res = await api.get('/products');
    if (res.status === 200) {
      commit('setProducts', res.data);
    } else {
      throw new Error(`無法取得書籍列表：Status ${res.status}`);
    }
  } catch (error) {
    commit('setProductsMsg', error.message);
  }
}

export async function fetchProductsDetails({ commit }, id) {
  try {
    const res = await api.get(`/products?id=${id}`);
    if (res.status === 200) {
      commit('setProductDetails', res.data[0]);
    } else {
      throw new Error(`無法取得此書：Status ${res.status}`);
    }
  } catch (error) {
    commit('setProductDetailsMsg', error.message);
  }
}
