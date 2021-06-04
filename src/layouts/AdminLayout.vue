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
        <q-btn @click="logout" color="accent" label="登出" unelevated size="md" />
      </q-toolbar>
    </q-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="leftDrawer" side="left" bordered content-class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- 選單內容 -->
        <q-list bordered>
          <q-item :to="{ name: 'Admin' }" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="blue" text-color="white" icon="view_list" />
            </q-item-section>
            <q-item-section>訂單管理</q-item-section>
          </q-item>

          <q-item :to="{ name: 'Products' }" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="teal" text-color="white" icon="category" />
            </q-item-section>
            <q-item-section>書籍</q-item-section>
          </q-item>

          <q-item :to="{ name: 'Accounts'}" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar rounded color="purple" text-color="white" icon="people_alt" />
            </q-item-section>
            <q-item-section>帳號管理</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="my-container-sm">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { projectAuth } from 'boot/firebase.config';

export default {
  name: 'AdminLayout',
  data() {
    return {
      leftDrawer: false,
    };
  },
  methods: {
    async logout() {
      try {
        this.$q.loading.show();
        await projectAuth.signOut();
        this.$router.push({ name: 'Home' });
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>
