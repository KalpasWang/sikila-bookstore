<template>
  <q-page class="my-container-sm" padding>
    <div class="q-py-md q-px-xl flex justify-end">
      <q-btn-dropdown
        v-if="user && user.uid"
        color="primary"
        auto-close
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
      <div
        v-if="userBooks && userBooks.length > 0"
        class="row wrap justify-center q-gutter-md q-pa-xl"
      >
        <q-img
          v-for="item in userBooks"
          :key="item.id"
          :src="item.image"
          @click="$router.push({ name: 'Read', params: { id: item.bid } })"
          style="max-width: 200px; height: 283px;"
          contain
          class="shadow-2 cursor-pointer bg-white img-hover"
        />
      </div>
      <div v-else-if="userBooks && userBooks.length === 0" class="text-center text-h6">還沒有書籍</div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import { projectAuth } from 'boot/firebase.config';

export default {
  name: 'MyBook',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['user', 'userBooks', 'userMsg']),
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.$router.push({ name: 'Home' });
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
      try {
        this.loading = true;
        if (!this.user || !this.user.uid) {
          throw new Error('無法取得你的資料');
        }
        await this.$store.dispatch('fetchUserBooks', this.user.uid);
        if (this.userMsg) {
          throw new Error(this.userMsg);
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
  },
  mounted() {
    this.fetchMyBooks();
  },
};
</script>
