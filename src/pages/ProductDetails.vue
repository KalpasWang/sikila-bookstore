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
      <q-spinner class="q-mx-auto" color="primary" size="5em" :thickness="5" />
    </div>
    <div v-else>
      <q-card v-if="productDetails && productDetails.title" class="q-mx-auto" bordered>
        <q-card-section class="large-only" horizontal>
          <q-card-section class="px-1-xs">
            <q-img :src="productDetails.image" class="shadow-2" contain width="140px" />
          </q-card-section>

          <q-card-section class="col column px-1-xs">
            <div class="text-h3 q-mb-sm">{{ productDetails.title }}</div>
            <div class="text-subtitle1">{{ productDetails.author }} 編著</div>
            <div class="text-subtitle1">
              {{ productDetails.price | currency }}
              (或者美元{{productDetails.priceUS | currencyUS}}，
              人民幣{{productDetails.priceRMB | currencyRMB }})
            </div>
            <q-card-actions
              v-if="productDetails.preview"
              class="q-mt-lg col-grow justify-end items-end q-gutter-sm"
            >
              <q-btn
                :to="{ name: 'Preview', params: { id: productDetails.id }}"
                unelevated
                size="lg"
                color="accent"
                class="q-px-lg"
              >免費試閱</q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card-section>

        <q-card-section class="small-only" horizontal>
          <q-card-section class="q-px-sm">
            <q-img :src="productDetails.image" class="shadow-2" contain width="100px" />
          </q-card-section>

          <q-card-section class="col column q-px-sm">
            <div class="text-h5 text-weight-regular q-mb-md">{{ productDetails.title }}</div>
            <div class="text-body2 text-weight-regular">{{ productDetails.author }} 編著</div>
            <div class="text-body2 text-weight-regular">
              {{ productDetails.price | currency }}
              (或者美元{{productDetails.priceUS | currencyUS}}，
              人民幣{{productDetails.priceRMB | currencyRMB }})
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-actions v-if="productDetails.preview" class="small-only q-mt-md">
          <q-btn
            :to="{ name: 'Preview', params: { id: productDetails.id }}"
            unelevated
            size="lg"
            color="accent"
            class="col"
          >免費試閱</q-btn>
        </q-card-actions>

        <q-separator />

        <q-card-section class="col-12">
          <div class="text-h5 text-center q-mb-lg max-width-768">書籍簡介</div>
          <div
            class="text-body1 text-center paragraph text-weight-light max-width-768"
          >{{ productDetails.description }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCurrentUser } from 'boot/firebase.config';

export default {
  name: 'ProductDetails',
  data() {
    return {
      loading: true,
      btnLoading: false,
    };
  },
  computed: {
    ...mapGetters(['productDetails', 'productDetailsMsg']),
  },
  methods: {
    async buy(bid) {
      this.btnLoading = true;
      const user = await getCurrentUser();
      if (!user || !user.uid) {
        this.$router.push({ name: 'Login' });
      } else {
        const { uid, email, displayName } = user;
        // eslint-disable-next-line object-curly-newline
        const { title, image, read, pdf } = this.productDetails;
        const progress = 0;
        const isEnabled = false;
        await this.$store.dispatch('addNewOrder', {
          uid,
          email,
          displayName,
          bid,
          title,
          image,
          read,
          pdf,
          progress,
          isEnabled,
        });
        if (this.productDetailsMsg) {
          this.$q.dialog({
            title: '無法訂購',
            message: this.productDetailsMsg,
          });
        } else {
          this.$q.dialog({
            title: '訂購成功，請記得付款',
            message: '付款方式請參考首頁的說明',
          });
        }
      }
      this.btnLoading = false;
    },
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('fetchProductsDetails', this.$route.params.id);
    if (this.productDetailsMsg) {
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
.max-width-768 {
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
}
</style>
