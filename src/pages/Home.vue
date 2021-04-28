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
            <p>我是Sikila，這名稱是 觀音菩薩為我命名的，意思是 --- 到彼岸者。我居住在中華民國台灣。</p>
            <p>在一個不經意的時刻，高次元振動頻率的 觀音菩薩上師，藉由我的口說出一連串的高振動語言，有人定義這語言為「光語」，實際上這只是某一次元空間的語言。</p>
            <p>原來這是在過去世 觀音菩薩對我的承諾，祂們應約來了。我開啟了更大視野～～我也體會了更多的愛～～～</p>
            <p>我的主要目的是傳遞 觀音上師的訊息，以協助地球人類的靈魂從第三次元提昇到第五次元的振動頻率。</p>
            <p>這裡的資訊 -- 觀音之愛，所說的並非是終極真相，它無法協助你達到'開悟'境界，但能協助處於第三次元的靈魂快速提昇，而這也是目前地球上99％以上的人類所需要的。</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="關閉" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- 書籍列表 -->
    <h2 class="text-h4 custom-headings q-mt-xl">所有書籍</h2>
    <div v-if="loading" class="col-auto q-mx-auto">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else-if="productsMsg.length === 0">
      <div
        v-if="products && products.length > 0"
        class="row justify-center items-start q-gutter-md q-px-md"
      >
        <!-- 書籍資訊卡片 -->
        <q-card v-for="item in products" :key="item.id" class="my-card">
          <q-img style="height: 400px" :src="item.image" contain />
          <q-separator />

          <q-card-section class="q-pa-sm">
            <q-btn
              fab
              color="accent"
              icon="local_fire_department"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />
          </q-card-section>

          <q-card-section class="q-py-none">
            <h5 class="q-my-none">{{ item.title }}</h5>
            <h6 class="q-my-none text-subtitle1 text-weight-light">{{ item.author }}</h6>
          </q-card-section>

          <q-card-actions class="flex justify-between">
            <div class="text-h5">{{ item.price | currency }}</div>
            <div class="q-gutter-x-sm">
              <q-btn
                :to="{ name: 'ProductDetails', params: { id: item.id } }"
                unelevated
                size="lg"
                color="primary"
              >查看更多</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <h4 v-else-if="products && products.length === 0" class="text-h6 text-center">尚未有書籍</h4>
    </div>
    <h4 v-else class="text-h6 text-center">發生錯誤</h4>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      loading: true,
      about: false,
      needToKnow: false,
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg']),
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch('fetchProducts');
    if (this.productsMsg.length > 0) {
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
  width: 280px;
  max-width: 90%;
}
</style>
