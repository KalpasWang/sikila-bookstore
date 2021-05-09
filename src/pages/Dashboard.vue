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
    <div v-if="loading" class="flex flex-center q-pt-md">
      <!-- 載入資料時顯示旋轉特效 -->
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
    <q-table v-else title="目前訂單" :data="formattingData" :columns="columns" row-key="name">
      <template v-slot:body-cell-enable="props">
        <q-td :props="props">
          <div>
            <q-btn
              @click="enableOrder(props.row)"
              :disable="disableBtn"
              outline
              size="sm"
              color="primary"
              :label="props.value"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <div>
            <q-btn
              @click="deleteOrder(props.row)"
              :disable="disableBtn"
              outline
              size="sm"
              color="accent"
              :label="props.value"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      ordersData: [],
      loading: false,
      disableBtn: false,
      columns: [
        {
          name: 'title',
          align: 'center',
          label: '訂購書籍',
          field: 'title',
        },
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
        {
          name: 'enable',
          align: 'right',
          label: '啟用按鈕',
          field: 'enable',
        },
        {
          name: 'delete',
          align: 'right',
          label: '刪除按鈕',
          field: 'delete',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['userMsg']),
    formattingData() {
      return this.ordersData.map((item) => ({
        id: item.id,
        email: item.email,
        nickName: item.displayName,
        title: item.title,
        createdAt: this.transformTime(item.createdAt.seconds),
        isEnabled: item.isEnabled ? '已啟用' : '未啟用',
        enable: '啟用',
        delete: '刪除',
      }));
    },
  },
  methods: {
    async enableOrder(row) {
      this.$q
        .dialog({
          title: '確認操作',
          message: `是否確認要啟用 ${row.nickName} 訂購的 ${row.title}呢？`,
          cancel: true,
          persistent: true,
        })
        // eslint-disable-next-line space-before-function-paren
        .onOk(async () => {
          this.disableBtn = true;
          await this.$store.dispatch('enableUserOrder', row.id);
          if (this.userMsg) {
            this.$q.dialog({
              title: '發生錯誤',
              message: this.userMsg,
            });
          } else {
            const idx = this.ordersData.findIndex((el) => el.id === row.id);
            this.ordersData.splice(idx, 1);
          }
          this.disableBtn = false;
        });
    },
    deleteOrder(row) {
      this.$q
        .dialog({
          title: '確認操作',
          message: `是否確認要刪除 ${row.nickName} 訂購 ${row.title} 的訂單呢？`,
          cancel: true,
          persistent: true,
        })
        // eslint-disable-next-line space-before-function-paren
        .onOk(async () => {
          this.disableBtn = true;
          await this.$store.dispatch('deleteUserOrder', row.id);
          if (this.userMsg) {
            this.$q.dialog({
              title: '發生錯誤',
              message: this.userMsg,
            });
          } else {
            const idx = this.ordersData.findIndex((el) => el.id === row.id);
            this.ordersData.splice(idx, 1);
          }
          this.disableBtn = false;
        });
    },
    transformTime(timestamp) {
      const now = Math.floor(Date.now() / 1000);
      // console.log('now: ', now);
      const diff = now - timestamp;
      // console.log('diff: ', diff);
      const s = diff % 60;
      const m = Math.floor(diff / 60) % 60;
      const h = Math.floor(diff / 3600) % 24;
      const d = Math.floor(diff / 86400) % 30;
      // console.log(h, m, s);
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
    this.loading = true;
    this.ordersData = await this.$store.dispatch('fetchUserOrders');
    if (this.userMsg) {
      this.$q.dialog({
        title: '發生錯誤',
        message: this.userMsg,
      });
    }
    this.loading = false;
  },
};
</script>
