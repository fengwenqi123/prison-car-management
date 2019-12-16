<template>
  <div class="containers">
    <ol-map></ol-map>
    <div class="list-page">
      <web-video></web-video>
      <div class="button" @click="register">
        <svg-icon icon-class="car"></svg-icon>
        车辆登记
      </div>
      <div class="car-list">
        <car-info :carList="carList" @faka="faka"></car-info>
      </div>
    </div>
    <div class="cardialog" v-if="cardialog">
      <el-dialog title="车辆登记" :visible.sync="cardialog" width="60%" top="15vh" @close="closeDialog">
        <register :mapId="mapId" :carValue="carValue" @closeDialog="closeDialog"></register>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars,prefer-const */

  import {mapGetters} from 'vuex'
  import olMap from '@/components/ol/index'
  import {pointTo} from '@/assets/gis/HTool'
  import webVideo from '@/components/video/index'
  import carInfo from '@/components/carInfoList/index'
  import register from './register'
  import {findCarByMapId} from '@/api/map.js'
  import {singleTrackMoveTest} from '@/assets/gis/track.js'
  import {addInfoLayers} from '@/assets/gis/HTool.js'
  import {getCar} from '@/api/histor'
  export default {
    data() {
      return {
        cardialog: false,
        mapId: null,
        carData: [],
        interval: null,
        carList: null,
        carValue: null
      }
    },
    computed: {
      ...mapGetters([
        'app',
        'carArr'
      ])
    },
    components: {
      olMap,
      webVideo,
      carInfo,
      register
    },
    mounted() {
      this.getQuery()
      this._addInfoLayers()
      this._findCarByMapId()
      this.interval = setInterval(() => {
        this._findCarByMapId()
      }, 3000)
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval) // 在Vue实例销毁前，清除我们的定时器
      }
    },
    methods: {
      faka(item) {
        this.carValue = item
        this.register()
      },
      getQuery() {
        this.mapId = this.$route.params.id
        const lon = parseFloat(this.$route.params.lon)
        const lat = parseFloat(this.$route.params.lat)
        const zoom = 17
        pointTo(lon, lat, zoom)
      },
      register() {
        this.cardialog = true
      },
      closeDialog() {
        this.cardialog = false
        this.carValue = null
      },
      _addInfoLayers() {
        addInfoLayers(this.app)
      },
      _findCarByMapId() {
        findCarByMapId(this.mapId).then(response => {
          getCar(1, 8, '', '', '', '', '', '1').then(response1 => {
            var carList = [...response.data, ...response1.data.dataList]
            // carList.forEach((item) => {
            //   delete item.carBean
            // })
            this.carList = carList
            if (!this.carArr) {
              this.$store.commit('addCarInfo', response.data)
            } else {
              this.carData = []
              var data = response.data
              data.forEach((item, index) => {
                this.carArr.forEach((car, i) => {
                  if (car.id === item.id) {
                    let obj = {}
                    obj.start = [car.longitude, car.latitude]
                    obj.end = [item.longitude, item.latitude, item.course]
                    obj.carInfo = item
                    this.carData.push(obj)
                  }
                })
              })
              this.$store.commit('addCarInfo', response.data)
              singleTrackMoveTest(this.carData)
            }
          })
          // if (!this.carArr) {
          //   this.$store.commit('addCarInfo', response.data)
          // } else {
          //   this.carData = []
          //   var data = response.data
          //   data.forEach((item, index) => {
          //     this.carArr.forEach((car, i) => {
          //       if (car.id === item.id) {
          //         let obj = {}
          //         obj.start = [car.longitude, car.latitude]
          //         obj.end = [item.longitude, item.latitude, item.course]
          //         obj.carInfo = item
          //         this.carData.push(obj)
          //       }
          //     })
          //   })
          //   this.$store.commit('addCarInfo', response.data)
          //   singleTrackMoveTest(this.carData)
          // }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .containers {
    position: relative;

    .list-page {
      width: 348px;
      position: absolute;
      top: 16px;
      right: 16px;

      .button {
        cursor: pointer;
        margin-top: 16px;
        height: 30px;
        background: rgba(24, 144, 255, 1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .svg-icon {
          font-size: 18px;
          margin-right: 6px;
        }
      }
    }
  }
</style>
