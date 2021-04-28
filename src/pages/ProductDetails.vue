<template>
  <q-page class="my-container-sm" padding>
    <q-toolbar class="q-my-lg">
      <q-btn
        :to="{ name: 'Home' }"
        rounded
        outline
        color="secondary"
        label="回首頁"
        icon="arrow_back_ios"
      />
    </q-toolbar>

    <div v-if="loading" class="flex justify-center q-pt-lg">
      <q-spinner class="q-mx-auto" color="primary" size="3em" :thickness="10" />
    </div>
    <div v-else-if="productDetailsMsg.length === 0">
      <q-card v-if="productDetails && productDetails.title" class="maxw90 q-mx-auto" bordered>
        <q-card-section horizontal>
          <q-card-section class="px-1-xs">
            <q-img :src="productDetails.image" class="shadow-2" contain width="140px" />
          </q-card-section>

          <q-card-section class="col column px-1-xs">
            <div class="text-h3 text-h4-xs q-mb-sm">{{ productDetails.title }}</div>
            <div class="text-subtitle1">{{ productDetails.author }} 編著</div>
            <div class="text-subtitle1">{{ productDetails.price | currency }}</div>
            <q-card-actions class="q-mt-lg col-grow justify-end items-end q-gutter-sm">
              <q-btn
                :to="{ name: 'Preview', params: { id: productDetails.id }}"
                unelevated
                size="lg"
                color="accent"
              >免費試閱</q-btn>
              <q-btn unelevated size="lg" color="primary">購買</q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-section class="col-12">
          <div class="text-h5 text-center q-mb-lg max-width-1024">書籍簡介</div>
          <div
            class="text-body1 text-center paragraph text-weight-light max-width-1024"
          >{{ productDetails.description }}</div>
        </q-card-section>
      </q-card>
    </div>
    <h4 v-else class="text-h6 text-center">發生錯誤</h4>
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
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('fetchProductsDetails', this.$route.params.id);
    if (this.productDetailsMsg.length > 0) {
      this.$q.dialog({
        title: '發生錯誤',
        message: this.productDetailsMsg,
      });
    }
    this.loading = false;
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
