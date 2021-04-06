<template>
  <q-page class="my-container-sm" padding>
    <q-toolbar class="text-primary bg-white shadow-1 rounded q-mt-md">
      <q-toolbar-title>
        <q-btn rounded color="secondary" label="購物車" icon="shopping_cart" />
      </q-toolbar-title>
    </q-toolbar>
    <div class="row q-mt-md q-col-gutter-md">
      <div v-if="productsMsg.type === 'negative'">{{ productsMsg.message }}</div>
      <div
        class="col-md-4 col-sm-6 col-12"
        v-else
        v-for="item in products"
        :key="item.id"
      >
        <q-card>
          <q-img :src="item.image" contain />

          <q-card-section>
            <q-btn
              fab
              color="primary"
              icon="local_fire_department"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />

            <div class="row no-wrap items-center">
              <div class="col text-h5 ellipsis">
                {{ item.title }}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-h6">
              簡介
            </div>
            <div class="text-subtitle2 text-grey">
              {{ item.description | truncate }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="flex justify-between">
            <div class="text-subtitle1">
              {{ item.price | currency }}
            </div>
            <div class="q-gutter-x-sm">
              <q-btn outline color="primary">
                查看更多
              </q-btn>
              <q-btn outline color="secondary">
                加入購物車
              </q-btn>
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
      
    }
  },
  computed: {
    ...mapGetters(['products', 'productsMsg'])
  },
  watch: {
    productsMsg(value) {
      if (value.type) {
        this.$q.notify({
          type: value.type,
          message: value.message
        })
      }
    }
  },
  filters: {
    truncate(str) {
      const length = 30;
      const suffix = '...';
      if (str.length > length) {
        return str.substring(0, length) + suffix;
      } else {
        return str;
      }
    },
    currency(value) {
      let n = +value;
      if (isNaN(n)) {
        return;
      }
      return `NT$${n.toFixed(0).replace(/./g, (char, idx, str) => {
        const replacedStr =
          idx && char !== '.' && (str.length - idx) % 3 === 0
            ? `, ${char}`.replace(/\s/g, '')
            : char;
        return replacedStr;
      })}`;
    }
  },
  created() {
    this.$store.dispatch('fetchProducts')
  }
};
</script>
