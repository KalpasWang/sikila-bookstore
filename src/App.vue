<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$api.interceptors.request.use(
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
