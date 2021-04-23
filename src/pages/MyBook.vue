<template>
  <q-page padding>
    <div class="q-py-md q-px-xl flex justify-end">
      <q-btn-dropdown color="primary" unelevated :label="`${user.displayName} 的帳號`">
        <div class="column no-wrap q-pa-md">
          <div class="text-subtitle1 q-mb-xs">{{ user.email }}</div>
          <q-btn color="accent" label="登出" unelevated size="md" v-close-popup />
        </div>
      </q-btn-dropdown>
    </div>
    <h2 class="text-h4 custom-headings">我的書籍</h2>
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else class="row wrap justify-center q-gutter-md q-pa-xl">
      <q-img
        v-for="item in userData.books"
        :key="item.id"
        :src="item.image"
        @click="$router.push({ name: 'Read', params: { id: item.id } })"
        style="max-width: 200px; height: 283px;"
        contain
        class="shadow-2 cursor-pointer bg-white img-hover"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MyBook',
  data() {
    return {
      user: {
        id: '00001',
        displayName: '丸尾',
        email: 'wf6212@gmail.com',
        password: '383838',
      },
      loading: true,
    };
  },
  computed: {
    ...mapGetters(['userData', 'userLoginMsg', 'userDataMsg']),
  },
  methods: {
    async fetchMyProfile() {
      this.loading = true;
      await this.$store.dispatch('fetchUserData', this.user.id);
      if (this.userDataMsg.length > 0) {
        this.$q.dialog({
          title: '發生錯誤',
          message: this.userDataMsg,
        });
      }
      this.loading = false;
    },
  },
  created() {
    this.fetchMyProfile();
  },
};
</script>
