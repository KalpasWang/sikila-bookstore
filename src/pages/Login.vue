<template>
  <q-page padding class="my-container-sm">
    <div class="q-my-lg q-px-md">
      <q-btn
        @click="$router.go(-1)"
        rounded
        outline
        color="secondary"
        label="回上一頁"
        icon="arrow_back_ios"
      />
    </div>
    <div class="flex flex-center q-px-md">
      <q-card square class="shadow-2">
        <q-card-section class="bg-primary">
          <h4 class="text-h5 text-white q-my-md">登入帳號</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-md">
            <q-input square clearable v-model="displayName" type="text" label="帳號">
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input square clearable v-model="password" type="password" label="密碼">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg q-pt-md">
          <q-btn
            @click="login"
            :disable="isLoading"
            :loading="isLoading"
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="登入"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { projectAuth } from 'boot/firebase.config';

export default {
  name: 'Login',
  data() {
    return {
      displayName: '',
      password: '',
      isLoading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.isLoading = true;
        const email = `${this.displayName}@gmail.com`;
        await projectAuth.signInWithEmailAndPassword(email, this.password);
        this.$router.push({ name: 'MyBook' });
      } catch (err) {
        this.$q.dialog({
          title: '發生錯誤',
          message: `帳號或密碼錯誤：${err.message}`,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
