<template>
  <q-page padding>
    <!-- content -->
    <q-btn
      :to="{ name: 'Home' }"
      rounded
      outline
      color="secondary"
      label="回首頁"
      icon="arrow_back_ios"
    />
    <h2 class="text-h4 custom-headings">帳號管理</h2>
    <div v-if="loading" class="flex flex-center q-pt-md">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="5em" :thickness="5" />
    </div>
    <q-markup-table v-else class="q-mx-auto" style="max-width: 650px;">
      <thead>
        <tr>
          <th class="text-left">Email</th>
          <th class="text-left">暱稱</th>
          <th class="text-right">擁有書籍</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-left">{{ user.email }}</td>
          <td class="text-left">{{ user.displayName }}</td>
          <td class="text-right">
            <q-btn round color="primary" icon="visibility" @click="fetchBooksByUserId(user.id)" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-dialog v-model="usersDialog">
      <q-card>
        <q-card-section>
          <h4 class="text-h6 q-my-none">擁有書籍</h4>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">書籍名稱</th>
                <th class="text-right">是否擁有</th>
                <th class="text-right">加入此書</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in userBooks" :key="book.bid">
                <td class="text-left">{{ book.title }}</td>
                <td class="text-center">{{ book.isEnabled ? "O" : "X" }}</td>
                <td class="text-right">
                  <q-btn v-if="!book.isEnabled" color="primary" label="加入" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { projectFirestore } from 'boot/firebase.config';
import { mapGetters } from 'vuex';

export default {
  name: 'AccountsBoard',
  data() {
    return {
      loading: false,
      users: [],
      userBooks: [],
      displayName: '',
      email: '',
      password: '',
      fetchingUserBooks: false,
      usersDialog: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg']),
  },
  methods: {
    async fetchBooksByUserId(id) {
      try {
        this.usersDialog = true;
        this.fetchingUserBooks = true;
        const res = await projectFirestore
          .collection('userBooks')
          .where('uid', '==', id)
          .get();
        if (!res.empty) {
          this.userBooks = res.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        } else {
          this.userBooks = [];
        }
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.fetchingUserBooks = false;
      }
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await projectFirestore.collection('users').get();
      if (!res.empty) {
        this.users = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      } else {
        throw new Error(`無法取得帳號列表：Status ${res.status}`);
      }
      await this.$store.dispatch('fetchProducts');
      if (this.productsMsg) {
        throw new Error(this.productsMsg);
      }
    } catch (error) {
      this.$q.dialog({
        title: '發生錯誤',
        message: error.message,
      });
    } finally {
      this.loading = false;
    }
  },
};
</script>
