<template>
  <div class="overflow-hidden window-height">
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
      <!-- header -->
      <q-slide-transition :duration="300">
        <q-header elevated v-show="showMenu">
          <q-toolbar>
            <q-btn @click="$router.go(-1)" flat round dense icon="arrow_back" />
            <q-toolbar-title>{{ productDetails.title }}</q-toolbar-title>
            <q-btn @click="showToc = !showToc" flat dense icon="toc" label="目錄" />
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
              <div class="row">
                <div class="col-10">
                  <q-slider v-model="progressModal" :min="0" :max="100" :step="0.1" />
                </div>
                <div class="col">{{ progress }}%</div>
              </div>
            </q-tab-panel>
            <!-- 文字大小 -->
            <q-tab-panel name="text-size">
              <div class="text-subtitle1">{{ fontSize }}</div>
              <div class="row">
                <div class="col-1">
                  <q-icon name="remove" class="text-primary" />
                </div>
                <div class="col-10">
                  <q-slider v-model="fontSizeModal" :min="16" :max="36" />
                </div>
                <div class="col-1">
                  <q-icon name="add" class="text-primary" />
                </div>
              </div>
            </q-tab-panel>
            <!-- 樣式主題 -->
            <q-tab-panel name="theme">
              <div class="row q-col-gutter-md">
                <div class="col" v-for="(item, index) in themeList" :key="item.name">
                  <q-btn
                    @click="themeIndexModal = index"
                    :color="item.bgClass"
                    :text-color="item.textClass"
                    class="fit text-h6"
                    no-caps
                    :label="item.label"
                  />
                </div>
              </div>
            </q-tab-panel>
            <!-- 閱讀模式 -->
            <q-tab-panel name="mode">
              <q-tabs v-model="modeModal" class="text-teal">
                <q-tab name="scrolled" icon="text_rotate_vertical" label="捲動模式" />
                <q-tab name="paginated" icon="menu_book" label="翻頁模式" />
              </q-tabs>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator />
          <!-- 主選單 -->
          <q-tabs
            v-model="setting"
            dense
            class="bg-grey-1 text-black"
            align="justify"
            narrow-indicator
          >
            <q-tab name="progress" label="進度" icon="swap_horiz" />
            <q-tab name="text-size" label="文字大小" icon="format_size" />
            <q-tab name="theme" label="主題" icon="palette" />
            <q-tab name="mode" label="閱讀模式" icon="library_books" />
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
          <h3 class="text-h6 q-pl-sm align-middle">
            <q-btn @click="showToc = false" icon="chevron_left" flat round dense />
            {{ productDetails.title }}
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
        <q-page class="relative-position overflow-hidden window-height">
          <div id="read"></div>
          <div class="absolute-full row">
            <div class="col" @click="prevPage"></div>
            <div class="col-7" @click="toggleMenu"></div>
            <div class="col" @click="nextPage"></div>
          </div>
          <div
            v-if="errorMsg.length > 0"
            class="full-screen z-top bg-white flex justify-center items-center text-h6"
            @click="toggleMenu"
          >{{ errorMsg }}</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Epub from 'epubjs';

// const DOWNLOAD_URL = '/static/09F3.epub';

export default {
  name: 'Ebook',
  data() {
    return {
      bookLink: '',
      // epubjs 相關資料
      book: null,
      rendition: null,
      locations: null,
      navigation: null,
      toc: [],
      selectedToc: '',
      errorMsg: '',
      // 控制選單與目錄的顯示與隱藏
      showMenu: false,
      showToc: false,
      // user 可設定的資訊
      setting: 'progress',
      progress: 0,
      fontSize: 20,
      mode: 'paginated',
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
    ...mapGetters(['productDetails', 'productDetailsMsg']),
    tocWidth() {
      const maxWidth = 500;
      const width = window.innerWidth * 0.7;
      return width > maxWidth ? maxWidth : width;
    },
    progressModal: {
      get() {
        return this.progress;
      },
      set(value) {
        if (value !== this.progress) {
          this.setProgress(value);
          this.progress = value;
        }
      },
    },
    fontSizeModal: {
      get() {
        return this.fontSize;
      },
      set(value) {
        this.setFontSize(value);
        this.fontSize = value;
      },
    },
    themeIndexModal: {
      get() {
        return this.themeIndex;
      },
      set(value) {
        this.setTheme(value);
        this.themeIndex = value;
      },
    },
    modeModal: {
      get() {
        return this.mode;
      },
      set(value) {
        this.setMode(value);
        this.mode = value;
      },
    },
  },
  watch: {
    productDetailsMsg(value) {
      if (value.type) {
        this.$q.notify({
          position: 'center',
          icon: value.icon,
          type: value.type,
          message: value.message,
        });
      }
    },
    errorMsg(value) {
      if (value.length > 0) {
        this.$q.notify({
          position: 'center',
          icon: 'info',
          type: 'negative',
          message: value,
        });
      }
    },
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
    setMode(flow) {
      if (this.book) {
        const manager = flow === 'paginated' ? 'default' : 'continuous';
        const { cfi } = this.rendition.location.end;
        this.rendition.destroy();
        this.rendition = this.book.renderTo('read', {
          manager,
          flow,
          width: '100%',
        });
        this.rendition.display(cfi);
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
            this.progress = progress.toFixed(1);
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
            this.progress = progress.toFixed(1);
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
    // 渲染 epub 檔案
    async showEpub() {
      // 生成 Ebook
      this.book = new Epub(this.bookLink);
      // 生成 Rendtion
      this.rendition = this.book.renderTo('read', {
        width: '100%',
        height: '100vh',
      });
      this.rendition.display();
      this.setFontSize(this.fontSize);
      this.setTheme(this.themeIndex);
      // 產生 epub 的 位置與導覽物件
      return this.book.ready
        .then(() => this.book.locations.generate())
        .then(() => {
          this.toc = this.book.navigation.toc;
          this.navigation = this.book.navigation;
          this.locations = this.book.locations;
          window.addEventListener('resize', this.resizeEpub);
        });
    },
  },
  async mounted() {
    let type = '';
    if (this.$route.name === 'Preview') {
      type = 'preview';
    } else if (this.$route.name === 'Read') {
      type = 'read';
    } else {
      this.$router.push({ name: 'Home' });
    }

    this.$q.loading.show();
    try {
      await this.$store.dispatch('fetchProductsDetails', this.$route.params.id);
      if (this.productDetails.id) {
        this.bookLink = this.productDetails[type];
        // this.bookLink = '/static/0000.epub';
        await this.showEpub();
      } else {
        throw Error();
      }
    } catch (e) {
      this.errorMsg = '無法開啟此書';
    } finally {
      this.$q.loading.hide();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEpub);
  },
};
</script>

<style lang="scss" scoped>
.ebook {
  position: relative;
  overflow: hidden;
  &__error {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__left-area {
    flex: 0 0 20%;
  }
  &__center-area {
    flex: 1;
  }
  &__right-area {
    flex: 0 0 20%;
  }
}
</style>
