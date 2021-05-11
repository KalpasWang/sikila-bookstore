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
          <div class="text-subtitle1 q-mb-xs">{{ user.email }}</div>
          <q-btn @click="logout" color="accent" label="登出" unelevated size="md" v-close-popup />
        </div>
      </q-btn-dropdown>
    </div>
    <h2 class="text-h4 custom-headings">我的書籍</h2>
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else>
      <div v-if="userBooks && userBooks.length > 0">
        <div class="row wrap justify-center q-gutter-md q-pa-xl">
          <q-img
            v-for="item in boughtBooks"
            :key="item.id"
            :src="item.image"
            @click="$router.push({ name: 'Read', params: { id: item.bid } })"
            style="max-width: 200px; height: 283px;"
            contain
            class="shadow-2 cursor-pointer bg-white"
          />
        </div>

        <h3 v-if="this.orderingBooks.length" class="text-h6 text-center q-mt-lg">尚未啟用的書籍</h3>
        <div class="row wrap justify-center q-gutter-md q-px-xl">
          <q-img
            v-for="item in orderingBooks"
            :key="item.id"
            :src="item.image"
            style="max-width: 100px; height: 141.5px;"
            contain
            class="shadow-2 bg-white"
          />
        </div>
      </div>
      <div v-else class="text-center text-h6">還沒有書籍</div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import { projectAuth, getCurrentUser } from 'boot/firebase.config';

export default {
  name: 'MyBook',
  data() {
    return {
      user: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['userBooks', 'userMsg']),
    boughtBooks() {
      return this.userBooks.filter((b) => b.isEnabled);
    },
    orderingBooks() {
      return this.userBooks.filter((b) => !b.isEnabled);
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
  },
  async mounted() {
    try {
      this.loading = true;
      this.user = await getCurrentUser();
      this.fetchMyBooks();
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
