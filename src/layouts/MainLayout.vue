<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" elevated>
      <q-toolbar class="my-container-sm">
        <q-toolbar-title>
          <h1 class="q-my-none text-h6 text-weight-bold">
            <span class="text-h4 text-primary text-shadow">觀音之愛</span> 電子書坊
          </h1>
        </q-toolbar-title>

        <q-tabs class="text-black large-only" active-bg-color="blue-1" active-color="blue">
          <q-route-tab :to="{ name: 'Home' }" name="home" icon="home" label="首頁" />
          <q-route-tab :to="{ name: 'MyBook' }" name="mybook" icon="auto_stories" label="我的書庫" />
        </q-tabs>
      </q-toolbar>

      <div class="small-only flex justify-end">
        <q-btn flat :to="{ name: 'Home' }" label="首頁" icon="home" />
        <q-btn flat :to="{ name: 'MyBook' }" label="我的書庫" icon="auto_stories" />
      </div>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {};
  },
};
</script>
