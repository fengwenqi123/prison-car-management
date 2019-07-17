<template>
  <div class="title-header">
    <div class="title-left">
      <page-header></page-header>
    </div>
    <div class="title-right">
      <breadcrumb></breadcrumb>
    </div>
  </div>
</template>

<script>
  import pageHeader from '@/components/pageHeader/index'
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    components: {
      Breadcrumb,
      pageHeader
    }
  }
</script>

<style scoped>

</style>
