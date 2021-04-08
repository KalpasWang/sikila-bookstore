<template>
  <q-page class="my-container-sm" padding>
    <q-toolbar class="q-mt-md">
      <q-toolbar-title>
        <q-btn rounded color="secondary" label="購物車" icon="shopping_cart" />
      </q-toolbar-title>
    </q-toolbar>
    <div class="row q-mt-md q-col-gutter-md">
      <div v-if="loading" class="q-mx-auto">
        <q-spinner color="primary" size="3em" :thickness="10" />
      </div>
      <h6 v-else-if="productsMsg.type === 'negative'">{{ productsMsg.message }}</h6>
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
            <div class="text-h6">{{ item.price | currency }}</div>
            <div class="q-gutter-x-sm">
              <q-btn
                :to="{ name: 'ProductDetails', params: { id: item.id } }"
                outline
                color="primary"
              >查看更多</q-btn>
              <q-btn outline color="secondary">加入購物車</q-btn>
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
  watch: {
    productsMsg(value) {
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
    this.$store.dispatch('fetchProducts').finally(() => {
      this.loading = false;
    });
  },
};
</script>
