<template>
  <q-page class="my-container-sm" padding>
    <div class="q-py-md q-px-md flex justify-end">
      <q-btn-dropdown
        v-if="user && user.uid"
        color="primary"
        auto-close
        no-caps
        unelevated
        :label="`${user.displayName} 的帳號`"
      >
        <div class="column no-wrap q-pa-md">
          <q-btn @click="logout" color="accent" label="登出" unelevated size="md" v-close-popup />
        </div>
      </q-btn-dropdown>
    </div>
    <h2 class="text-h4 custom-headings">我的書籍</h2>
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="primary" size="5em" :thickness="5" />
    </div>
    <div v-else>
      <div v-if="userBooks && userBooks.length > 0">
        <div class="row wrap justify-center items-start q-gutter-md q-pa-xl">
          <!-- 書籍資訊卡片 -->
          <q-card v-for="item in enabledBooks" :key="item.id" style="width: 200px;">
            <q-img style="height: 283px" :src="item.image" contain />
            <q-separator />
            <q-card-section>
              <div class="text-body1">{{ item.title }}</div>
            </q-card-section>

            <q-card-actions v-if="item.read" class="q-pb-xs">
              <q-btn
                :to="{ name: 'Read', params: { id: item.id } }"
                unelevated
                size="lg"
                color="primary"
                class="full-width"
              >閱讀電子書</q-btn>
            </q-card-actions>

            <q-card-actions v-if="item.pdf" class="q-py-xs">
              <q-btn
                type="a"
                :href="pdfUrl[item.pdf]"
                target="_blank"
                unelevated
                size="lg"
                color="secondary"
                class="full-width"
              >下載(pdf檔)</q-btn>
            </q-card-actions>

            <q-card-actions v-if="item.read" class="q-pt-xs">
              <q-btn
                type="a"
                :href="epubUrl[item.read]"
                target="_blank"
                unelevated
                size="lg"
                color="accent"
                class="full-width"
              >下載(epub檔)</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <div v-else class="text-center text-h6">還沒有書籍</div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  projectAuth,
  projectStorage,
  getCurrentUser,
} from 'boot/firebase.config';

export default {
  name: 'MyBook',
  data() {
    return {
      user: null,
      loading: false,
      pdfUrl: {},
      epubUrl: {},
    };
  },
  computed: {
    ...mapGetters(['userBooks', 'userMsg']),
    enabledBooks() {
      return this.userBooks.filter((b) => b.isEnabled);
    },
  },
  watch: {
    user(newValue) {
      if (!newValue) {
        this.$router.push({ name: 'Login' });
      }
    },
  },
  methods: {
    async logout() {
      try {
        this.$q.loading.show();
        await projectAuth.signOut();
        this.$router.push({ name: 'Home' });
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async fetchMyBooks() {
      if (!this.user || !this.user.uid) {
        throw new Error('無法取得你的書籍');
      }
      await this.$store.dispatch('fetchUserBooks', this.user.uid);
      if (this.userMsg) {
        this.$q.dialog({
          title: '發生錯誤',
          message: this.userMsg,
        });
      }
    },
    async downloadFile(path) {
      try {
        const storageRef = projectStorage.ref(path);
        const url = await storageRef.getDownloadURL();
        return url;
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: `無法取得 ${path} 檔案：${error.message}`,
        });
        return '';
      }
    },
  },
  async mounted() {
    try {
      this.loading = true;
      this.user = await getCurrentUser();
      await this.fetchMyBooks();
      // 取得書籍下載連結
      this.enabledBooks.forEach(async(book) => {
        if (book.pdf) {
          const url = await this.downloadFile(book.pdf);
          this.$set(this.pdfUrl, book.pdf, url);
        }
        if (book.read) {
          const url = await this.downloadFile(book.read);
          this.$set(this.epubUrl, book.read, url);
        }
      });
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
