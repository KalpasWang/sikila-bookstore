<template>
  <div class="q-pa-md column flex-center window-height">
    <q-btn
      :to="{ name: 'Home'}"
      rounded
      outline
      color="secondary"
      label="回首頁"
      icon="arrow_back_ios"
      class="q-mb-lg"
    />
    <q-card square class="shadow-2">
      <q-card-section class="bg-primary">
        <h4 class="text-h5 text-white q-my-md">登入管理員帳號</h4>
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
      <q-card-actions class="q-px-lg q-pt-md q-mb-lg">
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
    </q-card>
  </div>
</template>

<script>
import { projectAuth, projectFirestore } from 'boot/firebase.config';

export default {
  name: 'AdminLogin',
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
        const res = await projectFirestore
          .collection('admin')
          .where('email', '==', this.email)
          .get();
        if (res.empty) {
          throw new Error('帳號或密碼錯誤');
        }
        await projectAuth.signInWithEmailAndPassword(this.email, this.password);
        this.$router.push({ name: 'Admin' });
      } catch (err) {
        this.$q.dialog({
          title: '發生錯誤',
          message: err.message,
        });
      } finally {
        this.isLoading = false;
        this.isBtnEnabled = true;
      }
    },
  },
};
</script>
