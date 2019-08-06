<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <div class="logo"><img :src="logo" alt=""></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="top_main">
        <navbar class="nav"></navbar>
        <!--<tags-view class="tag"></tags-view>-->
      </div>
      <app-main class="appmain"></app-main>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import {Navbar, Sidebar, AppMain} from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import logo from '@/assets/img/logo.png'

  export default {
    name: 'layout',
    data() {
      return {
        logo
      }
    },
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('CloseSideBar', {withoutAnimation: false})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    background: #252A2F;

    .appmain {
      padding-top: 68px;
    }

    .top_main {
      position: absolute;
      width: 100%;
      height: 68px;
      z-index: 99;

      .nav, .tag {
        /*width: calc(100% - 180px);*/
        /*position: fixed;*/
      }

      .nav {
        z-index: 19;
        position: absolute;
        width: 100%;
      }

      .tag {
        position: absolute;
        width: 100%;
        top: 68px;
      }

    }

    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    .logo {
      position: fixed;
      top: 0px;
      z-index: 100;
      width: 180px;
      height: 68px;
      background: #252A2F;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 56px;
        height: 56px;
      }
    }

    .en1 {
      /*width: 100%;*/
      /*position: fixed;*/
      /*z-index: 99999;*/
    }

    .fix {
      width: 100%;
      position: fixed;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
