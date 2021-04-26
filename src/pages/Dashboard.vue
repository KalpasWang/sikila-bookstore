<template>
  <q-page padding>
    <!-- content -->
    <h2>Dashboard</h2>
    <q-btn
      :to="{ name: 'Home' }"
      rounded
      outline
      color="secondary"
      label="回首頁"
      icon="arrow_back_ios"
    />
  </q-page>
</template>

<script>
export default {
  name: 'Dashboard',
};
</script>
