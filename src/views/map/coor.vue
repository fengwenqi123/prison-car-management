<template>
  <div class="coor">
    <ol-map></ol-map>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import olMap from '@/components/ol/index'
  import HDraw from '@/assets/gis/HDraw.js'

  export default {
    computed: {
      ...mapGetters([
        'app'
      ])
    },
    components: {
      olMap
    },
    mounted() {
      HDraw.init(this.app.map)
      HDraw.setDrawTool('Polygon')
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: 100%;
  }
</style>
