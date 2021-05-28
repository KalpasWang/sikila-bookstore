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
            :disable="!isBtnEnabled"
            :loading="isLoading"
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="註冊"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-sm">
          <q-btn
            :to="{ name: 'Login' }"
            flat
            color="transparent"
            size="md"
            class="text-grey-6"
          >已經有帳號了嗎？</q-btn>
        </q-card-section>
      </q-card>
    </div>
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
      isBtnEnabled: true,
      isLoading: false,
    };
  },
  methods: {
    async signup() {
      try {
        this.isLoading = true;
        this.isBtnEnabled = false;
        const credentials = await projectAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        if (!credentials) {
          throw new Error('無法註冊帳號');
        }
        await credentials.user.updateProfile({ displayName: this.displayName });
        this.$router.push({ name: 'MyBook' });
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.isLoading = false;
        this.isBtnEnabled = true;
      }
    },
  },
};
</script>
