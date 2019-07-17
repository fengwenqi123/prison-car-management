<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical"
      background-color="#fff"
      text-color="#778899"
      active-text-color="#fff"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import Hamburger from '@/components/Hamburger'

  export default {
    components: {SidebarItem, Hamburger},
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .hamburger-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background: #f5f5f5;
    width: 180px;
  }
</style>
