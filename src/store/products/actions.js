/*
export function someAction (context) {
}
*/
import { projectFirestore } from 'boot/firebase.config';

export async function fetchProducts({ commit }) {
  try {
    const res = await projectFirestore.collection('products').get();
    if (res.docs) {
      const products = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      commit('setProducts', products);
    } else {
      throw new Error(`無法取得書籍列表：Status ${res.status}`);
    }
  } catch (error) {
    commit('setProductsMsg', error.message);
  }
}

export async function fetchProductsDetails({ commit }, id) {
  try {
    const res = await projectFirestore
      .collection('products')
      .doc(id)
      .get();
    if (!res.exists) {
      throw new Error('這本書並不存在');
    }
    const { description } = res.data();
    commit('setProductDetails', {
      ...res.data(),
      id: res.id,
      description: description.replaceAll(' ', '\n'),
    });
  } catch (error) {
    commit('setProductDetailsMsg', error.message);
  }
}
