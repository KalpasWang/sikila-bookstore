<template>
  <div class="window-height">
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
      <!-- header -->
      <q-slide-transition :duration="300">
        <q-header elevated v-show="showMenu">
          <q-toolbar>
            <q-btn @click="$router.go(-1)" flat round dense icon="arrow_back" />
            <q-toolbar-title>{{ title }}</q-toolbar-title>
          </q-toolbar>
        </q-header>
      </q-slide-transition>

      <!-- footer -->
      <q-slide-transition :duration="300">
        <q-footer v-show="showMenu" elevated>
          <!-- 選單內容 -->
          <q-tab-panels v-model="setting" class="bg-grey-1 text-black">
            <!-- 進度條 -->
            <q-tab-panel name="progress">
              <div class="row flex-center">
                <div class="col q-pl-sm">
                  <q-slider v-model="progressModel" :min="0" :max="100" :step="0.1" />
                </div>
                <div
                  class="col-auto q-px-sm flex flex-center text-subtitle1"
                >{{ progress.toFixed(1) }}%</div>
              </div>
            </q-tab-panel>
            <!-- 文字大小 -->
            <q-tab-panel name="text-size">
              <div class="text-h6 text-center">{{ fontSize }}</div>
              <div class="row">
                <div class="col-1 flex flex-center">
                  <q-btn flat round dense icon="remove" @click="fontSizeModel = fontSize - 1" />
                </div>
                <div class="col-10 q-px-sm">
                  <q-slider v-model="fontSizeModel" :min="fontSizeMin" :max="fontSizeMax" />
                </div>
                <div class="col-1 flex flex-center">
                  <q-btn flat round dense icon="add" @click="fontSizeModel = fontSize + 1" />
                </div>
              </div>
            </q-tab-panel>
            <!-- 樣式主題 -->
            <q-tab-panel name="theme">
              <div class="row q-col-gutter-md">
                <div class="col" v-for="(item, index) in themeList" :key="item.name">
                  <q-btn
                    @click="themeIndexModel = index"
                    :color="item.bgClass"
                    :text-color="item.textClass"
                    :class="themeIndex === index ? 'border-blue' : ''"
                    class="fit text-h6"
                    no-caps
                    :label="item.label"
                    :icon="themeIndex === index ? 'check' : ''"
                  />
                </div>
              </div>
            </q-tab-panel>
            <!-- 目錄（空白） -->
            <q-tab-panel name="toc">
              <div></div>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator />
          <!-- 主選單 -->
          <q-tabs
            v-model="setting"
            dense
            class="bg-grey-1 text-black"
            align="justify"
            active-bg-color="blue-1"
            active-color="primary"
          >
            <q-tab name="progress" label="進度" icon="swap_horiz" />
            <q-tab name="text-size" label="文字大小" icon="format_size" />
            <q-tab name="theme" label="主題" icon="palette" />
            <q-tab @click="showToc = !showToc" name="toc" label="目錄" icon="toc" />
          </q-tabs>
        </q-footer>
      </q-slide-transition>

      <!-- 目錄 -->
      <q-drawer
        v-model="showToc"
        :width="tocWidth"
        :breakpoint="600"
        bordered
        overlay
        elevated
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <h3 class="text-h6 q-pl-sm vertical-bottom">
            <q-btn @click="showToc = false" icon="chevron_left" flat round dense />
            {{ title }}
          </h3>
          <q-separator />
          <q-tree
            :nodes="toc"
            node-key="href"
            children-key="subitems"
            :selected.sync="selectedToc"
            no-connectors
            default-expand-all
          />
        </q-scroll-area>
      </q-drawer>

      <!-- 主頁(電子書內容) -->
      <q-page-container class="p-0">
        <q-page class="position-relative overflow-hidden">
          <div id="read" class="overflow-hidden"></div>
          <div class="absolute-full row">
            <div class="col" @click="prevPage"></div>
            <div class="col-7" @click="toggleMenu"></div>
            <div class="col" @click="nextPage"></div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Epub from 'epubjs';
// import { projectStorage } from 'boot/firebase.config';

export default {
  name: 'Ebook',
  data() {
    return {
      // 書籍資訊
      bookLink: '',
      title: '',
      // 使用者資訊
      anonymous: true,
      // epubjs 相關資料
      book: null,
      rendition: null,
      locations: null,
      navigation: null,
      toc: [],
      selectedToc: '',
      // 控制選單與目錄的顯示與隱藏
      showMenu: false,
      showToc: false,
      // user 可設定的資訊
      setting: 'progress',
      progress: 0,
      fontSize: 20,
      fontSizeMin: 16,
      fontSizeMax: 36,
      themeIndex: 0,
      // 背景主題選項
      themeList: [
        {
          name: 'light',
          label: 'Light',
          color: '#1d1d1d',
          background: '#f5f5f5',
          bgClass: 'grey-2',
          textClass: 'dark',
        },
        {
          name: 'brown',
          label: 'Brown',
          color: '#1d1d1d',
          background: '#d7ccc8',
          bgClass: 'brown-2',
          textClass: 'dark',
        },
        {
          name: 'dark',
          label: 'Dark',
          color: '#eeeeee',
          background: '#212121',
          bgClass: 'grey-10',
          textClass: 'grey-3',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'userData',
      'userDataMsg',
      'productDetails',
      'productDetailsMsg',
    ]),
    tocWidth() {
      const maxWidth = 500;
      const width = window.innerWidth * 0.7;
      return width > maxWidth ? maxWidth : width;
    },
    progressModel: {
      get() {
        return parseFloat(this.progress.toFixed(1));
      },
      set(value) {
        if (value > 100) {
          value = 100;
        }
        if (value !== this.progress) {
          this.setProgress(value);
          this.progress = value;
        }
      },
    },
    fontSizeModel: {
      get() {
        return this.fontSize;
      },
      set(value) {
        if (value > this.fontSizeMax) {
          value = this.fontSizeMax;
        }
        if (value < this.fontSizeMin) {
          value = this.fontSizeMin;
        }
        this.setFontSize(value);
        this.fontSize = value;
      },
    },
    themeIndexModel: {
      get() {
        return this.themeIndex;
      },
      set(value) {
        this.setTheme(value);
        this.themeIndex = value;
      },
    },
  },
  watch: {
    selectedToc(value) {
      if (value) {
        this.jumpTo(value);
      }
    },
  },
  methods: {
    // 跳轉到指定的位置
    jumpTo(href) {
      this.rendition.display(href);
      this.hideMenu();
    },
    hideMenu() {
      this.showMenu = false;
      this.showToc = false;
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if (!this.showMenu) {
        this.showToc = false;
      }
    },
    setProgress(progress) {
      const pct = progress / 100;
      let location = pct > 0 ? this.locations.cfiFromPercentage(pct) : 0;
      if (pct === 1) {
        location = this.locations.cfiFromLocation(this.locations.total - 1);
      }
      this.rendition.display(location);
    },
    setTheme(index) {
      const theme = this.themeList[index];
      this.rendition.themes.override('color', theme.color, true);
      this.rendition.themes.override('background', theme.background, true);
    },
    setFontSize(fontSize) {
      if (this.rendition.themes) {
        this.rendition.themes.fontSize(`${fontSize}px`);
      }
    },
    prevPage() {
      // 如果目錄沒有打開，就隱藏選單往前一頁
      // 如果目錄被打開，就只隱藏目錄跟選單
      if (!this.showToc) {
        this.rendition.prev().then(() => {
          if (this.locations) {
            const currentLocation = this.rendition.currentLocation();
            const progress = this.locations.percentageFromCfi(
              currentLocation.start.cfi
            );
            this.progress = progress * 100;
          }
        });
      }
      this.hideMenu();
    },
    nextPage() {
      // 如果目錄沒有打開，就隱藏選單前往下一頁
      // 如果目錄被打開，就只隱藏目錄跟選單
      if (!this.showToc) {
        this.rendition.next().then(() => {
          if (this.locations) {
            const currentLocation = this.rendition.currentLocation();
            const progress = this.locations.percentageFromCfi(
              currentLocation.start.cfi
            );
            this.progress = progress * 100;
          }
        });
      }
      this.hideMenu();
    },
    // 當視窗被 resize, resize 目前的畫面
    resizeEpub() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.rendition.resize(width, height);
    },
    // async getBook(path) {
    //   try {
    //     const storageRef = projectStorage.ref(path);
    //     const url = await storageRef.getDownloadURL();
    //   } catch (error) {}
    // },
    // 傳送使用者資料到後端
    async patchUserData() {
      await this.$store.dispatch('patchUserData', {
        id: '00001',
        fontSize: this.fontSize,
        theme: this.themeIndex,
      });
      if (this.userDataMsg.length > 0) {
        this.$q.dialog({
          title: '發生錯誤',
          message: this.userDataMsg,
        });
      }
    },
    // 渲染 epub 檔案
    async showEpub() {
      // 生成 Ebook
      this.book = new Epub(this.bookLink);
      // 生成 Rendtion
      this.rendition = this.book.renderTo('read', {
        width: '100%',
        height: '100vh',
      });
      this.setFontSize(this.fontSize);
      this.setTheme(this.themeIndex);
      // 產生 epub 的 位置與導覽物件
      return this.book.ready
        .then(() => this.book.locations.generate())
        .then(() => {
          this.toc = this.book.navigation.toc;
          this.navigation = this.book.navigation;
          this.locations = this.book.locations;
          this.setProgress(this.progress);
          window.addEventListener('resize', this.resizeEpub);
        })
        .catch(() => {
          throw new Error('無法開啟書籍');
        });
    },
    // makeRangeCfi(startCfi, endCfi) {
    //   const cfiBase = startCfi.replace(/!.*/, '');
    //   const cfiStart = startCfi.replace(/.*!/, '').replace(/\)$/, '');
    //   const cfiEnd = endCfi.replace(/.*!/, '').replace(/\)$/, '');
    //   const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`;
    //   return cfiRange;
    // },
  },
  async mounted() {
    this.$q.loading.show();

    if (this.$route.name === 'Read') {
      // 如果是有帳號的使用者
      this.anonymous = false;
      try {
        await this.$store.dispatch('fetchUserData', '00001');
        if (this.userDataMsg.length > 0) {
          throw new Error(this.userDataMsg);
        }
        this.fontSize = this.userData.fontSize;
        this.themeIndex = this.userData.theme;
        const vm = this;
        const book = this.userData.books.find(
          (item) => item.id === vm.$route.params.id
        );
        if (!book || !book.read || book.read.length === 0) {
          throw new Error('找不到這本書');
        }
        this.bookLink = book.read;
        this.title = book.title;
        this.progress = book.progress || 0;
        await this.showEpub();
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    } else {
      // 如果是匿名的使用者
      this.anonymous = true;
      try {
        await this.$store.dispatch(
          'fetchProductsDetails',
          this.$route.params.id
        );
        if (this.productDetailsMsg.length > 0) {
          throw new Error(this.productDetailsMsg);
        }
        this.bookLink = this.productDetails.preview;
        this.title = this.productDetails.title;
        if (!this.bookLink || this.bookLink.length === 0) {
          throw new Error('找不到這本書');
        }

        await this.showEpub();
      } catch (error) {
        this.$q.dialog({
          title: '發生錯誤',
          message: error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    }
  },
  beforeDestroy() {
    if (!this.anonymous && this.userData && this.userData.id) {
      this.patchUserData();
    }
    window.removeEventListener('resize', this.resizeEpub);
  },
};
</script>

<style lang="scss">
.border-blue {
  border: 3px solid #2196f3;
}
</style>
