<template>
  <q-page padding>
    <!-- content -->
    <q-btn :to="{ name: 'Home' }" rounded outline color="secondary" label="回電子書坊" />
    <div class="text-center q-mt-lg">
      <h2>首頁</h2>
      <q-btn :to="{ name: 'Products' }" rounded color="teal" label="產品管理" />
      <q-btn :to="{ name: 'Accounts' }" rounded color="purple" label="帳號管理" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AdminHome',
  data() {
    return {};
  },
};
</script>
