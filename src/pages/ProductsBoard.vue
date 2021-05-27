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
    <h2 class="text-h4 custom-headings">書籍管理</h2>
    <div v-if="loading" class="flex flex-center q-pt-md">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">書本圖片</th>
          <th class="text-left">書本名稱</th>
          <th class="text-left">作者</th>
          <th class="text-left">啟用狀態</th>
          <th class="text-right">有此書的使用者</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td class="text-left">
            <img :src="item.image" :alt="item.title" style="width:70px;" class="border" />
          </td>
          <td class="text-left">{{ item.title }}</td>
          <td class="text-left">{{ item.author }}</td>
          <td class="text-left">{{ item.enabled }}</td>
          <td class="text-right">
            <q-btn round color="primary" icon="people" @click="fetchUsersByBookId(item.id)" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-dialog v-model="usersDialog">
      <q-card>
        <q-card-section v-if="!fetchingUsers">
          <h4 class="text-h6 q-my-none">擁有人數：{{ users.length }}</h4>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="fetchingUsers">
          <q-spinner color="primary" size="3em" :thickness="5" />
        </q-card-section>

        <q-card-section v-else class="scroll">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">Email</th>
                <th class="text-right">暱稱</th>
                <th class="text-right">購買時間</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.uid">
                <td class="text-left">{{ user.email }}</td>
                <td class="text-right">{{ user.displayName }}</td>
                <td class="text-right">{{ user.createdAt.seconds | date }}</td>
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
import { mapGetters } from 'vuex';
import { projectFirestore } from 'boot/firebase.config';

export default {
  name: 'ProductsBoard',
  data() {
    return {
      loading: false,
      users: [],
      fetchingUsers: false,
      usersDialog: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg']),
  },
  methods: {
    async fetchUsersByBookId(id) {
      this.usersDialog = true;
      this.fetchingUsers = true;
      const res = await projectFirestore
        .collection('userBooks')
        .where('bid', '==', id)
        .get();
      if (!res.empty) {
        this.users = res.docs
          .map((doc) => ({ ...doc.data() }))
          .filter((item) => item.isEnabled)
          .map((u) => ({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            createdAt: u.createdAt,
          }));
      } else {
        this.users = [];
      }
      this.fetchingUsers = false;
    },
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('fetchProducts');
    if (this.productsMsg) {
      this.$q.dialog({
        title: '發生錯誤',
        message: this.productsMsg,
      });
    }
    this.loading = false;
  },
};
</script>
