<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { syncUserState } from 'boot/firebase.config';

export default {
  name: 'App',
  created() {
    // 監聽使用者狀態
    syncUserState();
  },
};
</script>
