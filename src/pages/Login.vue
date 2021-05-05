<template>
  <q-page padding class="flex flex-center">
    <q-card square class="shadow-2" style="width: 300px;max-width:90%;">
      <q-card-section class="bg-primary">
        <h4 class="text-h5 text-white q-my-md">登入帳號</h4>
      </q-card-section>
      <q-card-section>
        <q-form class="q-px-sm q-pt-md">
          <q-input square clearable v-model="email" type="email" label="Email">
            <template v-slot:prepend>
              <q-icon name="email" />
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
          :disable="!isBtnEnabled"
          :loading="isLoading"
          unelevated
          size="lg"
          color="primary"
          class="full-width text-white"
          label="登入"
        />
      </q-card-actions>
      <q-card-section class="text-center q-pa-sm">
        <q-btn :to="{ name: 'Signup' }" flat color="transparent" class="text-grey-6">還沒有帳號嗎？</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { projectAuth } from 'boot/firebase.config';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      isBtnEnabled: true,
      isLoading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.isLoading = true;
        this.isBtnEnabled = false;
        await projectAuth.signInWithEmailAndPassword(this.email, this.password);
        this.$router.push({ name: 'MyBook' });
      } catch (err) {
        this.$q.dialog({
          title: '發生錯誤',
          message: `帳號或密碼錯誤：${err.message}`,
        });
      } finally {
        this.isLoading = false;
        this.isBtnEnabled = true;
      }
    },
  },
};
</script>
