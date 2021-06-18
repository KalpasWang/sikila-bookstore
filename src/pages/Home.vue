<template>
  <q-page class="my-container-sm" padding>
    <!-- 書籍列表 -->
    <h2 class="text-h4 custom-headings q-mt-xl">所有書籍</h2>
    <div v-if="loading" class="flex flex-center">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="5em" :thickness="5" />
    </div>
    <div v-else>
      <div
        v-if="products && products.length"
        class="row justify-center items-start q-gutter-md q-px-md"
      >
        <!-- 書籍資訊卡片 -->
        <q-card v-for="item in filteredProducts" :key="item.id" class="my-card">
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
              size="lg"
              color="primary"
              class="full-width"
            >書籍簡介</q-btn>
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
    };
  },
  computed: {
    ...mapGetters(['products', 'productsMsg']),
    filteredProducts() {
      return this.products.filter((item) => item.enabled);
    },
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
.border {
  border: 1px solid #666;
}
</style>
