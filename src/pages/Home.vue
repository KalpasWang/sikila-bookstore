<template>
  <q-page class="my-container-sm" padding>
    <div class="banner-area q-my-md q-gutter-sm">
      <q-banner rounded class="bg-primary text-white">
        <h4 class="text-subtitle1 q-my-none">關於Sikila與觀音之愛</h4>
        <template v-slot:action>
          <q-btn flat color="white" label="了解更多" @click="about = true" />
        </template>
      </q-banner>
      <q-banner rounded class="bg-accent text-white">
        <h4 class="text-subtitle1 q-my-none">購買須知（重要！）</h4>
        <template v-slot:action>
          <q-btn flat label="了解更多" @click="needToKnow = true" />
        </template>
      </q-banner>
      <q-dialog v-model="about">
        <q-card>
          <q-card-section>
            <div class="text-h6">關於Sikila與觀音之愛</div>
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
      <q-dialog v-model="needToKnow">
        <q-card>
          <q-card-section>
            <div class="text-h6">關於Sikila與觀音之愛</div>
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
    <h2 class="text-h4 custom-headings">所有書籍</h2>
    <div v-if="loading" class="col-auto q-mx-auto">
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else>
      <div
        v-if="products && products.length > 0"
        class="row justify-center items-start q-gutter-md q-px-md"
      >
        <q-card v-for="item in products" :key="item.id" class="my-card">
          <q-img style="height: 400px" :src="item.image" contain />

          <q-card-section class="q-pa-sm">
            <q-btn
              fab
              color="accent"
              icon="local_fire_department"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />
          </q-card-section>

          <q-card-section>
            <h5 class="q-my-none">{{ item.title }}</h5>
            <h6 class="q-my-none text-subtitle1 text-weight-light">{{ item.author }}</h6>
          </q-card-section>

          <q-separator />

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
