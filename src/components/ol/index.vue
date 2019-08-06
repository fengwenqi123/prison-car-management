<template>
  <div class="containers">
    <div id="map" ref="rootmap">
      <div id="coor"></div>
      <div id="maplevel"></div>
    </div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import {init} from '@/assets/gis/map'
  export default {
    mounted() {
      const mapcontainer = this.$refs.rootmap
      init(mapcontainer)
    }
  }
</script>

<style lang="scss" scoped>
  .active {
    border: 1px solid #0050B3;
  }

  /*隐藏ol的一些自带元素*/
  .ol-attribution, .ol-zoom {
    display: none;
  }

  .containers {
    height: 100%;

    #map {
      position: relative;
      height: 100%;
    }

    #coor {
      position: absolute;
      bottom: 24px;
      right: 40px;
      z-index: 999999;
      width: 200px;
      height: 30px;
      color: #fff;
    }

    #maplevel {
      position: absolute;
      bottom: 30px;
      right: 20px;
      z-index: 99999;
      color: #fff;
    }
  }

</style>
