<template>
  <section class="app-main">
    <el-scrollbar class="scrolls">
      <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.fullPath
      }
    }
  }
</script>
<style>
  .app-main {
    /*padding-top: 110px;*/
    background: #ECF0F5;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter {
    transform: translateX(20px);
    opacity: 0.7;
  }

  .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
