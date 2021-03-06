<template>
  <q-page padding>
    <!-- content -->
    <q-btn :to="{ name: 'Home' }" rounded outline color="secondary" label="回電子書坊" />
    <h2 class="text-h4 custom-headings">書籍管理</h2>
    <div class="text-center q-my-md">
      <q-btn
        rounded
        unelevated
        color="primary"
        label="建立新產品"
        icon="add"
        @click="newProductDialog = true"
      />
    </div>
    <div v-if="loading" class="flex flex-center q-pt-md">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="5em" :thickness="5" />
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">書本圖片</th>
          <th class="text-left">書本名稱</th>
          <th class="text-left">作者</th>
          <th class="text-left">啟用狀態</th>
          <th class="text-center">有此書的使用者</th>
          <th class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td class="text-left">
            <img :src="item.image" :alt="item.title" style="width:70px;" class="border" />
          </td>
          <td class="text-left">{{ item.title }}</td>
          <td class="text-left">{{ item.author }}</td>
          <td class="text-left">{{ item.enabled }}</td>
          <td class="text-center">
            <q-btn
              round
              color="secondary"
              icon="people"
              size="sm"
              @click="fetchUsersByBookId(item.id)"
            />
          </td>
          <td class="text-center">
            <q-btn
              color="primary"
              label="刪除"
              size="sm"
              @click="DeleteProductById(item.id, item.title)"
            />
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
    <q-dialog v-model="newProductDialog">
      <q-card class="scroll" style="width: 300px;max-width: 90%;">
        <q-card-section>
          <h4 class="text-h6 text-center">增加新產品</h4>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="title"
            label="產品名稱"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="author"
            label="作者"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="image"
            label="產品圖片連結"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="description"
            filled
            type="textarea"
            label="產品介紹"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="price"
            type="number"
            label="產品價格"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="priceUS"
            type="number"
            label="產品價格（美金）"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input
            v-model="priceRMB"
            type="number"
            label="產品價格（人民幣）"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '必填']"
          />
          <q-input v-model="pdf" label="書籍PDF檔連結" lazy-rules />
          <q-input v-model="preview" label="試閱epub檔連結" lazy-rules />
          <q-input v-model="read" label="書籍epub檔連結" lazy-rules />
          <q-toggle v-model="enabled" label="是否啟用" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="確認" :loading="isUploading" color="primary" @click="createNewProduct" />
          <q-btn label="重置" :disable="isUploading" color="accent" @click="reset" />
          <q-btn flat label="關閉" :disable="isUploading" color="secondary" v-close-popup />
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
      isUploading: false,
      users: [],
      fetchingUsers: false,
      usersDialog: false,
      newProductDialog: false,
      title: '',
      author: '',
      description: '',
      image: '',
      price: 0,
      priceUS: 0,
      priceRMB: 0,
      pdf: null,
      preview: null,
      read: null,
      enabled: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg', 'userMsg']),
  },
  methods: {
    async fetchProducts() {
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
    async DeleteProductById(id, title) {
      try {
        this.$q
          .dialog({
            title: '確認操作',
            message: `是否確認要刪除 ${title} 這項產品以及每個帳號擁有的書籍呢？`,
            cancel: true,
            persistent: true,
          })
          // eslint-disable-next-line space-before-function-paren
          .onOk(async () => {
            const docRef = projectFirestore.collection('products').doc(id);
            await docRef.delete();
            const res = await projectFirestore
              .collection('userBooks')
              .where('bid', '==', id)
              .get();
            // console.log(res);
            if (!res.empty) {
              res.docs.forEach(async(doc) => {
                await this.$store.dispatch('deleteUserOrder', doc.id);
                if (this.userMsg) {
                  throw new Error(this.userMsg);
                }
              });
            }
            this.fetchProducts();
          });
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤，無法刪除此書',
          message: error.message,
        });
      }
    },
    async createNewProduct() {
      try {
        this.description = this.description.replace(/\n/g, '{n}');
        await projectFirestore.collection('products').add({
          title: this.title,
          author: this.author,
          image: this.image,
          description: this.description,
          price: this.price,
          priceUS: this.priceUS,
          priceRMB: this.priceRMB,
          pdf: this.pdf,
          preview: this.preview,
          read: this.read,
          enabled: this.enabled,
        });
        this.newProductDialog = false;
        this.reset();
        this.$q.dialog({
          title: '新增產品成功',
        });
        this.fetchProducts();
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      }
    },
    reset() {
      this.title = '';
      this.author = '';
      this.image = '';
      this.description = '';
      this.price = 0;
      this.priceUS = 0;
      this.priceRMB = 0;
      this.pdf = null;
      this.preview = null;
      this.read = null;
      this.enabled = false;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>
