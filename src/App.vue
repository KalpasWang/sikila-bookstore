<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 監聽使用者狀態
    this.$store.dispatch('syncUserState');
    // 設定 axios request handler
    this.$axios.interceptors.request.use(
      (config) => config,
      (error) => {
        this.$Q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  },
};
</script>
