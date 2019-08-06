<template>
  <div class="container">
    <ul>
      <li v-for="(item,index) in map" :key="index" @click="pushs(item)">
        <div class="item">
          <p>{{item.name}}</p>
          <img :src="item.image">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {lists} from '@/api/mapView.js'

  export default {
    name: 'mapList',
    data() {
      return {
        map: []
      }
    },
    created() {
      this.getMapList()
    },
    methods: {
      // 获取地图
      getMapList() {
        lists().then(response => {
          this.map = response.data
        })
      },
      pushs(item) {
        this.$router.push({
          name: 'mapView',
          params: {
            id: item.id,
            lon: item.longitude,
            lat: item.latitude
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 50%;

        .item {
          padding: 0 10px;
          position: relative;

          p {
            position: absolute;
            top: 10px;
            left: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 2px;
            padding: 4px 10px;
            font-size: 14px;
          }

          img {
            width: 100%;

          }
        }
      }
    }
  }
</style>
