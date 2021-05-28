<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" elevated>
      <q-toolbar class="my-container-sm">
        <q-toolbar-title>
          <h1 class="q-my-none text-h6 text-weight-bold">
            <router-link :to="{ name: 'Home' }">
              <img src="icons/favicon-32x32.png" alt="Icon" class="vertical-bottom q-mr-sm" />
            </router-link>
            <span class="text-h4 text-blue text-shadow">觀音之愛</span>
            <span class="text-grey-8 text-weight-regular">&nbsp;電子書坊</span>
          </h1>
        </q-toolbar-title>

        <q-tabs class="text-black large-only" indicator-color="transparent">
          <q-route-tab
            :to="{ name: 'Home' }"
            name="home"
            icon="home"
            label="首頁"
            :class="isActive('Home')"
          />
          <q-route-tab
            :to="{ name: 'MyBook' }"
            name="mybook"
            icon="auto_stories"
            label="我的書庫"
            :class="isActive('MyBook')"
          />
        </q-tabs>
      </q-toolbar>

      <div class="small-only flex justify-end">
        <q-btn flat :to="{ name: 'Home' }" label="首頁" icon="home" :class="isActive('Home')" />
        <q-btn
          flat
          :to="{ name: 'MyBook' }"
          label="我的書庫"
          icon="auto_stories"
          :class="isActive('MyBook')"
        />
      </div>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-footer class="static bg-secondary text-white q-pa-lg text-center">
      <div>&copy; Copyrights 2021 Sikila 有著作權，侵害必究</div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {};
  },
  methods: {
    isActive(name) {
      if (this.$route.name === name) {
        return 'bg-blue-1 text-primary blue-tab-border';
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.blue-tab-border {
  border-bottom: 2px solid $primary;
}
</style>
