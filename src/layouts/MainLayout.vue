<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" elevated>
      <q-toolbar>

        <q-toolbar-title class="font-caveat">
          <span class="font-caveat">Sikila</span> 電子書坊
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

      <q-footer bordered class="bg-white">
        <q-tabs class="text-black" active-bg-color="blue-1" active-color="blue">
          <q-route-tab :to="{ name: 'Home' }" name="home" icon="home" label="首頁" />
          <q-route-tab :to="{ name: 'MyBook' }" name="mybook" icon="auto_stories" label="我的書庫" />
        </q-tabs>
      </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
};
</script>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans TC',
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans',
  sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji'
}
</style>
