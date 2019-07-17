<template>
<div>
  <el-page-header @back="goBack" :content="title">
  </el-page-header>
</div>
</template>

<script>
    export default {
      computed: {
        title() {
          return this.$route.meta.title
        }
      },
      methods: {
        goBack() {
          this.$router.go(-1)
        }
      }
    }
</script>

<style scoped lang="scss">

</style>
