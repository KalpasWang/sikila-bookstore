<template>
  <div class="overflow-hidden window-height">
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
      <!-- header -->
      <q-slide-transition :duration="300">
        <q-header elevated v-show="showMenu">
          <q-toolbar>
            <q-btn @click="$router.go(-1)" flat round dense icon="arrow_back" />
            <q-toolbar-title>{{ productDetails.title }}</q-toolbar-title>
            <q-btn @click="showToc = !showToc" flat round dense icon="toc" />
          </q-toolbar>
        </q-header>
      </q-slide-transition>

      <!-- footer -->
      <q-slide-transition :duration="300">
        <q-footer v-show="showMenu" elevated>
          <!-- 選單內容 -->
          <q-tab-panels v-model="setting" animated class="bg-grey-1 text-black">
            <q-tab-panel name="progress">
              <q-slider v-model="progress" :min="0" :max="50" />
            </q-tab-panel>
            <q-tab-panel name="text-size">
              <q-slider v-model="fontSize" :min="16" :max="36" />
            </q-tab-panel>
            <q-tab-panel name="theme">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-btn
                    color="grey-2"
                    text-color="black"
                    class="fit text-h6"
                    no-caps
                    label="Light"
                  />
                </div>
                <div class="col">
                  <q-btn color="grey-2" text-color="black" size="xl" no-caps label="Light" />
                </div>
                <div class="col">
                  <q-btn color="grey-2" text-color="black" size="xl" no-caps label="Light" />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="mode">
              <q-tabs v-model="mode" class="text-teal">
                <q-tab name="scroll" icon="text_rotate_vertical" label="捲動模式" />
                <q-tab name="paginated" icon="menu_book" label="翻頁模式" />
              </q-tabs>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator />
          <!-- 選單 -->
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

      <q-drawer v-model="showToc" :width="200" :breakpoint="600" bordered content-class="bg-grey-3">
        <q-scroll-area class="fit">
          <q-tree :nodes="toc" node-key="label" no-connectors :expanded.sync="expandedTocItem" />
        </q-scroll-area>
      </q-drawer>

      <!-- 主頁(電子書內容) -->
      <q-page-container class="p-0">
        <q-page class="relative-position overflow-hidden window-height">
          <div id="read"></div>
          <div class="absolute-full row">
            <div class="col" @click="prevPage"></div>
            <div class="col-7" @click="toggleTitleAndMenu"></div>
            <div class="col" @click="nextPage"></div>
          </div>
          <div
            v-if="errorMsg.length > 0"
            class="full-screen z-top bg-white flex justify-center items-center text-h6"
            @click="toggleTitleAndMenu"
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
      book: null,
      rendition: null,
      locations: null,
      navigation: null,
      toc: [],
      tocTree: [],
      expandedTocItem: [],
      showMenu: false,
      showToc: false,
      errorMsg: '',
      bookAvailable: false,
      setting: 'progress',
      progress: 0,
      fontSize: 20,
      mode: 'paginated',
      theme: 'light',
      // defaultTheme: 0,
      // themes: null,
      themeList: [
        {
          name: 'light',
          style: {
            body: {
              color: '#000',
              background: '#eef2f6',
            },
          },
        },
        {
          name: 'dark',
          style: {
            body: {
              color: '#eef2f6',
              background: '#212529',
            },
          },
        },
        {
          name: 'gold',
          style: {
            body: {
              color: '#000',
              background: '#fcd581',
            },
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['productDetails', 'productDetailsMsg']),
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
    toc(value) {
      if (value) {
        this.generateTocTree();
      }
    },
  },
  methods: {
    // showToc() {
    //   this.ifShowContent = true;
    // },
    // 跳轉到指定的位置
    // generateTocTree(list, depth = 0) {
    //   list.map(item => {

    //   })
    // for (let item of list) {
    //   if (!depth) {
    //     depth = 0;
    //     item = { ...item, depth: 0, padding: 'pl-3' };
    //   } else {
    //     item = { ...item, depth, padding: `pl-${depth + 3}` };
    //   }
    //   this.tocList.push(item);
    //   if (item.subitems) {
    //     this.getToc(item.subitems, depth + 1);
    //   }
    // }
    // },
    jumpTo(href) {
      this.rendition.display(href);
      this.hideTitleAndMenuShow();
    },
    hideTitleAndMenuShow() {
      this.showMenu = false;
      this.ifShowContent = false;
      this.$refs.menuBar.hideSetting();
    },
    // progress bar 的數值 (0-100)
    onProgressChange(progress) {
      const pct = progress / 100;
      let location = pct > 0 ? this.locations.cfiFromPercentage(pct) : 0;
      if (pct === 1) {
        location = this.locations.cfiFromLocation(this.locations.total - 1);
      }
      this.rendition.display(location);
    },
    setTheme(index) {
      // this.themes.select(this.themeList[index].name);
      const theme = this.themeList[index];
      this.rendition.themes.override('color', theme.style.body.color, true);
      this.rendition.themes.override(
        'background',
        theme.style.body.background,
        true
      );
      this.defaultTheme = index;
    },
    registerTheme() {
      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style);
      });
    },
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize;
      if (this.themes) {
        this.themes.fontSize(`${fontSize}px`);
      }
    },
    toggleTitleAndMenu() {
      this.showMenu = !this.showMenu;
      if (!this.showMenu) {
        this.$refs.menuBar.hideSetting();
        this.ifShowContent = false;
      }
    },
    prevPage() {
      this.showMenu = false;
      if (this.ifShowContent) {
        this.ifShowContent = false;
      } else if (this.rendition) {
        this.rendition.prev().then(() => {
          // 控制 progress bar 往後
          if (this.locations) {
            const currentLocation = this.rendition.currentLocation();
            const progress = Math.ceil(
              this.locations.percentageFromCfi(currentLocation.start.cfi) * 100
            );
            this.$refs.menuBar.setProgress(progress);
          }
        });
      }
    },
    nextPage() {
      this.showMenu = false;
      if (this.ifShowContent) {
        this.ifShowContent = false;
      } else if (this.rendition) {
        this.rendition.next().then(() => {
          // 控制 progress bar 往前
          if (this.locations) {
            const currentLocation = this.rendition.currentLocation();
            const progress = Math.ceil(
              this.locations.percentageFromCfi(currentLocation.start.cfi) * 100
            );
            this.$refs.menuBar.setProgress(progress);
          }
        });
      }
    },
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
        width: 'calc(100%)',
        height: '100vh',
      });
      this.rendition.display();
      this.themes = this.rendition.themes;
      this.setFontSize(this.defaultFontSize);
      // this.registerTheme();
      this.setTheme(this.defaultTheme);
      // 產生 epub 的 位置與導覽物件
      return (
        this.book.ready
          .then(() => this.book.locations.generate())
          // .then(() => this.book.loaded.navigation)
          .then(() => {
            this.toc = this.book.navigation.toc;
            this.navigation = this.book.navigation;
            this.locations = this.book.locations;
            window.addEventListener('resize', this.resizeEpub);
            this.bookAvailable = true;
          })
      );
      // .catch(() => {
      //   this.errorMsg = '無法開啟此書';
      // });
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
