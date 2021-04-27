<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="bg-white text-grey-10" elevated>
      <q-toolbar class="my-container-sm">
        <q-btn flat round dense icon="menu" @click="leftDrawer = !leftDrawer" />
        <q-toolbar-title>
          <h1 class="q-my-none text-h6 text-weight-bold">
            <span class="text-h4 text-blue text-shadow">觀音之愛</span>
            <span class="text-grey-8 text-weight-regular">&nbsp;書坊管理</span>
          </h1>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="leftDrawer" side="left" bordered content-class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="my-container-sm">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  // name: 'LayoutName',

  data() {
    return {
      leftDrawer: false,
    };
  },
};
</script>
