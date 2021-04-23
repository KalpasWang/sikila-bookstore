<template>
  <q-page class="my-container-sm" padding>
    <div class="banner-area q-my-md q-gutter-sm">
      <q-banner rounded class="bg-purple-8 text-white">
        We can't find your saved recipes until you sign in.
        <template v-slot:action>
          <q-btn flat color="white" label="Continue as a Guest" />
          <q-btn flat color="white" label="Sign in" />
        </template>
      </q-banner>
      <q-banner rounded class="bg-grey-3">
        <template v-slot:avatar>
          <img src="https://cdn.quasar.dev/img/mountains.jpg" style="width: 100px; height: 64px" />
        </template>
        Could not retrieve travel data.
        <template v-slot:action>
          <q-btn flat label="Retry" />
        </template>
      </q-banner>
    </div>
    <div class="row q-col-gutter-md">
      <div v-if="loading" class="q-mx-auto">
        <q-spinner color="primary" size="3em" :thickness="10" />
      </div>
      <h6
        v-else-if="productsMsg.type === 'negative'"
        class="q-mx-auto text-center"
      >{{ productsMsg.message }}</h6>
      <div v-else v-for="item in products" :key="item.id" class="col-lg-3 col-md-4 col-sm-6 col-12">
        <q-card>
          <q-img :src="item.image" contain />

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
