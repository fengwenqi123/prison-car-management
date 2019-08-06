<template>
  <div class="coor">
    <ol-map></ol-map>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import olMap from '@/components/ol/index'
  import {addInfoLayers} from '@/assets/gis/HTool.js'

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
      this._addInfoLayers()
    },
    methods: {
      _addInfoLayers() {
        addInfoLayers(this.app)
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: 100%;
  }
</style>
