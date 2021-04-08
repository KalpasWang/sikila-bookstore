<template>
  <q-page class="my-container-sm" padding>
    <q-toolbar class="q-my-lg">
      <q-btn rounded :to="{ name: 'Home' }" color="secondary" label="回首頁" icon="arrow_back_ios" />
    </q-toolbar>

    <div v-if="loading" class="flex justify-center q-pt-lg">
      <q-spinner class="q-mx-auto" color="primary" size="3em" :thickness="10" />
    </div>
    <h6 v-else-if="productDetailsMsg.type === 'negative'">{{ productDetailsMsg.message }}</h6>
    <q-card v-else class="my-card" bordered>
      <q-card-section horizontal>
        <q-card-section class="px-1-xs">
          <q-img :src="productDetails.image" class="shadow-2" contain width="140px" />
        </q-card-section>

        <q-card-section class="col column px-1-xs">
          <div class="text-h3 text-h4-xs q-mb-sm">{{ productDetails.title }}</div>
          <div class="text-subtitle1">{{ productDetails.author }} 編著</div>
          <div class="text-subtitle1">{{ productDetails.price | currency }}</div>
          <q-card-actions class="q-mt-lg col-grow justify-end items-end q-gutter-sm">
            <q-btn rounded outline color="accent">免費試閱</q-btn>
            <q-btn rounded outline color="primary">加入購物車</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-section class="col-12">
        <div class="text-h5 q-mb-lg max-width-1024">書籍簡介</div>
        <div
          class="text-h6 paragraph text-weight-light max-width-1024"
        >{{ productDetails.description }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProductDetails',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters(['productDetails', 'productDetailsMsg']),
  },
  watch: {
    productDetailsMsg(value) {
      if (value.type) {
        this.$q.notify({
          position: 'top',
          icon: value.icon,
          type: value.type,
          message: value.message,
        });
      }
    },
  },
  created() {
    this.$store
      .dispatch('fetchProductsDetails', this.$route.params.id)
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
.max-width-1024 {
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
}
</style>
