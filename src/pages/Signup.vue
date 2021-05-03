<template>
  <q-page padding class="flex flex-center">
    <q-card square class="shadow-2" style="width: 300px;max-width:90%;">
      <q-card-section class="bg-primary">
        <h4 class="text-h5 text-white q-my-md">註冊帳號</h4>
      </q-card-section>
      <q-card-section>
        <q-form class="q-px-sm q-pt-md">
          <q-input square clearable v-model="email" type="email" label="Email">
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input square clearable v-model="displayName" type="text" label="暱稱">
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
          @click="signup"
          unelevated
          size="lg"
          color="primary"
          class="full-width text-white"
          label="註冊"
        />
      </q-card-actions>
      <q-card-section class="text-center q-pa-sm">
        <q-btn :to="{ name: 'Login' }" flat color="transparent" class="text-grey-6">已經有帳號了嗎？</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { projectAuth } from 'boot/firebase.config';

export default {
  name: 'Signup',
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async signup() {
      try {
        this.$q.loading.show();
        const credentials = await projectAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        if (!credentials) {
          throw new Error('無法註冊帳號');
        }
        await credentials.user.updateProfile({ displayName: this.displayName });
        // console.log(credentials);
        this.$router.push({ name: 'MyBook' });
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
