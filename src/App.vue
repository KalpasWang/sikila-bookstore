<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { Notify } from 'quasar';

export default {
  name: 'App',
  created() {
    Notify.create({
      position: 'top-right',
      icon: 'mood',
      type: 'positive',
      message: '歡迎來到 Sikila 電子書坊'
    });
  },
};
</script>
