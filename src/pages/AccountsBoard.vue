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
    <div class="text-center q-my-md">
      <q-btn
        rounded
        unelevated
        color="primary"
        label="建立新帳號"
        icon="person"
        @click="signUpDialog = true"
      />
    </div>
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
        <tr v-for="(user, idx) in users" :key="user.id">
          <td class="text-left">{{ user.email }}</td>
          <td class="text-left">{{ user.displayName }}</td>
          <td class="text-right">
            <q-btn round color="primary" icon="visibility" @click="fetchBooksByUserIndex(idx)" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-dialog v-model="usersDialog">
      <q-card>
        <q-card-section>
          <h4 class="text-h6 q-my-none">
            擁有書籍
            <q-spinner v-if="addBookBtnDisabled" color="primary" size="2em" />
          </h4>
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
              <tr v-for="(book, idx) in allBooks" :key="book.id">
                <td class="text-left">{{ book.title }}</td>
                <td class="text-center">{{ book.isEnabled ? "O" : "X" }}</td>
                <td class="text-right">
                  <q-btn
                    v-if="!book.isEnabled"
                    @click="addBookToUser(book.id, idx)"
                    :disable="addBookBtnDisabled"
                    color="primary"
                    label="加入"
                  />
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
    <q-dialog v-model="signUpDialog">
      <q-card square class="shadow-2">
        <q-card-section class="bg-primary">
          <h4 class="text-h5 text-white q-my-md">註冊帳號</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-md">
            <q-input square clearable v-model="displayName" type="text" label="帳號">
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input square clearable v-model="password" type="password" label="密碼">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg q-pt-md">
          <q-btn
            @click="signup"
            :disable="signUpBtnDisabled"
            :loading="signUpBtnDisabled"
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="註冊"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { projectFirestore, projectAuth } from 'boot/firebase.config';
import { mapGetters } from 'vuex';

export default {
  name: 'AccountsBoard',
  data() {
    return {
      loading: false,
      signUpBtnDisabled: false,
      users: [],
      userIndex: -1,
      userBooks: [],
      allBooks: [],
      addBookBtnDisabled: false,
      displayName: '',
      email: '',
      password: '',
      usersDialog: false,
      signUpDialog: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg', 'productDetailsMsg']),
  },
  methods: {
    async fetchUsers() {
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
    async fetchBooksByUserIndex(idx) {
      try {
        this.userIndex = idx;
        const res = await projectFirestore
          .collection('userBooks')
          .where('uid', '==', this.users[this.userIndex].id)
          .get();
        if (!res.empty) {
          this.userBooks = res.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        } else {
          this.userBooks = [];
          this.allBooks = [];
        }
        this.getAllBooks();
        this.usersDialog = true;
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      }
    },
    async addBookToUser(bid, idx) {
      this.addBookBtnDisabled = true;
      const user = this.users[this.userIndex];
      const { id, email, displayName } = user;
      // eslint-disable-next-line object-curly-newline
      const { title, image, read, pdf } = this.allBooks[idx];
      const progress = 0;
      const isEnabled = true;
      await this.$store.dispatch('addNewOrder', {
        uid: id,
        email,
        displayName,
        bid,
        title,
        image,
        read,
        pdf,
        progress,
        isEnabled,
      });
      this.addBookBtnDisabled = false;
      if (this.productDetailsMsg) {
        this.$q.dialog({
          title: '無法加入此書籍',
          message: this.productDetailsMsg,
        });
      } else {
        this.fetchBooksByUserIndex(this.userIndex);
      }
    },
    async signup() {
      try {
        this.signUpBtnDisabled = true;
        this.email = `${this.displayName}@gmail.com`;
        const credentials = await projectAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        if (!credentials) {
          throw new Error('無法註冊帳號');
        }
        await credentials.user.updateProfile({ displayName: this.displayName });
        const { uid } = credentials.user;
        await projectFirestore
          .collection('users')
          .doc(uid)
          .set({
            displayName: this.displayName,
            email: this.email,
          });
        this.fetchUsers();
        this.signUpDialog = false;
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.signUpBtnDisabled = false;
      }
    },
    getAllBooks() {
      if (this.allBooks.length) this.allBooks = [];
      this.products.forEach((product) => {
        const idx = this.userBooks.findIndex((book) => book.bid === product.id);
        if (idx >= 0) {
          this.allBooks.push(this.userBooks[idx]);
        } else {
          this.allBooks.push(product);
        }
      });
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
