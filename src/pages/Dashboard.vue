<template>
  <q-page padding>
    <!-- content -->
    <q-btn
      :to="{ name: 'Home' }"
      rounded
      outline
      color="secondary"
      label="回首頁"
      icon="arrow_back_ios"
    />
    <h2 class="text-h4 custom-headings">Dashboard</h2>
    <q-table title="Treats" :data="formattingData" :columns="columns" row-key="name" />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      ordersData: [],
      columns: [
        {
          name: 'email',
          align: 'center',
          label: 'Email',
          field: 'email',
          sortable: true,
        },
        {
          name: 'nickName',
          align: 'center',
          label: '暱稱',
          field: 'nickName',
        },
        {
          name: 'title',
          align: 'center',
          label: '訂購書籍',
          field: 'title',
        },
        {
          name: 'createdAt',
          align: 'center',
          label: '訂購時間',
          field: 'createdAt',
          sortable: true,
        },
        {
          name: 'isEnabled',
          align: 'right',
          label: '是否啟用',
          field: 'isEnabled',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['userMsg']),
    formattingData() {
      return this.ordersData.map((item) => ({
        email: item.email,
        nickName: item.displayName,
        title: item.title,
        createdAt: this.transformTime(item.createdAt.seconds),
        isEnabled: item.isEnabled ? '啟用' : '未啟用',
      }));
    },
  },
  methods: {
    transformTime(timestamp) {
      const now = Math.floor(Date.now() / 1000);
      console.log('now: ', now);
      const diff = now - timestamp;
      console.log('diff: ', diff);
      // const positive = (n) => (n > 0 ? n : 0);
      const s = diff % 60;
      const m = Math.floor(diff / 60) % 60;
      const h = Math.floor(diff / 3600) % 24;
      const d = Math.floor(diff / 86400) % 30;
      console.log(h, m, s);
      if (s && !m && !h && !d) {
        return `${s} 秒`;
      }
      if (m && !h && !d) {
        return `${m} 分`;
      }
      if (h && !d) {
        return `${h} 小時`;
      }
      if (d) {
        return `${d} 天`;
      }
      return '一個月以上';
    },
  },
  async mounted() {
    this.ordersData = await this.$store.dispatch('fetchUserOrders');
    if (this.userMsg) {
      this.$q.dialog({
        title: '發生錯誤',
        message: this.userMsg,
      });
    }
  },
};
</script>
