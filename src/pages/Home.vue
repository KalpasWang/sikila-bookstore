<template>
  <q-page class="my-container-sm" padding>
    <!-- banner 重點訊息 -->
    <div class="q-my-md">
      <q-banner rounded class="bg-primary">
        <h4 class="text-subtitle1 q-my-none text-grey-3">購買須知（購買前請先閱讀）</h4>
        <template v-slot:action>
          <q-btn flat color="white" label="了解更多" @click="needToKnow = true" />
        </template>
      </q-banner>
      <q-dialog v-model="needToKnow">
        <q-card>
          <q-card-section>
            <div class="text-h6">購買須知（購買前請先閱讀）</div>
          </q-card-section>
          <q-card-section class="q-pt-none text-body1 text-weight-light">
            <ol class="q-pl-md">
              <li class="q-mb-md">如果確定要購買書籍，請先按右上角的我的書庫，沒有帳號的情況預設會跳出登入頁面，請點選『還沒有帳號嗎？』進入註冊頁面</li>
              <li class="q-mb-md">
                輸入你的 Email，暱稱與6個字以上的密碼，如果註冊失敗可能是 Email
                已經有註冊過了或是密碼少於六個字，如果是其他原因導致無法註冊，請寄信到
                <a
                  href="mailto:sikilabookstore@gmail.com"
                >sikilabookstore@gmail.com</a>
              </li>
              <li
                class="q-mb-md"
              >註冊成功會跳轉到我的書庫頁面，可以看到目前沒有書籍，請再到首頁並點選你要購買的書籍的介紹頁面，點選購買，如果成功會看到一個訂購成功的通知</li>
              <li class="q-mb-md">請按照頁面上標的價錢匯款</li>
            </ol>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="關閉" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- 書籍列表 -->
    <h2 class="text-h4 custom-headings q-mt-xl">所有書籍</h2>
    <div v-if="loading" class="flex flex-center">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else>
      <div
        v-if="products && products.length"
        class="row justify-center items-start q-gutter-md q-px-md"
      >
        <!-- 書籍資訊卡片 -->
        <q-card v-for="item in products" :key="item.id" class="my-card">
          <q-img style="height: 312px" :src="item.image" contain />
          <q-separator />

          <q-card-section class="q-pa-none">
            <q-btn
              fab
              color="accent"
              icon="local_fire_department"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-80%);"
            />
          </q-card-section>

          <q-card-section class="q-pb-none">
            <h5 class="q-my-none text-h6 text-weight-regular">{{ item.title }}</h5>
            <h6 class="q-my-none text-subtitle1 text-weight-light">{{ item.author }}</h6>
          </q-card-section>

          <q-card-actions class="justify-end">
            <q-btn
              :to="{ name: 'ProductDetails', params: { id: item.id } }"
              unelevated
              color="primary"
              class="full-width"
            >查看更多</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <h4 v-else-if="products && !products.length" class="text-h6 text-center">尚未有書籍</h4>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      loading: true,
      needToKnow: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg']),
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('fetchProducts');
    if (this.productsMsg) {
      this.$q.dialog({
        title: '發生錯誤',
        message: this.productsMsg,
      });
    }
    this.loading = false;
  },
};
</script>

<style lang="scss">
.my-card {
  width: 220px;
  max-width: 90%;
}
</style>
