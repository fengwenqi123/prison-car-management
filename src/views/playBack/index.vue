<template>
  <div class="play-back">
    <play-back></play-back>
    <div class="videos">
      <video-play-back></video-play-back>
      <his :carList="historyInfo" v-if="historyInfo"></his>
    </div>
    <time-line
      v-if="timeArr"
      :timeArr="timeArr"
      :times="startTimes"
      @setGisPlay="setGisPlay"
      @setGisSuspend="setGisSuspend"
      @setGisStop="setGisStop"
    ></time-line>
  </div>
</template>

<script>
  /* eslint-disable prefer-const */

  import playBack from '@/views/map/playBack'
  import {playback} from '@/api/CarInformation.js'
  import {pointTo} from '@/assets/gis/HTool'
  import timeLine from './timeLine'
  import {trackPlayBack, movingPause, movingJump, movingStop} from '@/assets/gis/trackBack'
  import {timeToString} from '@/utils/index.js'
  import videoPlayBack from '@/components/video/videoPlayBack'
  import his from '@/components/carInfoList/his'

  export default {
    name: 'index',
    data() {
      return {
        historyInfo: null,
        visitorInfoPoints: null,
        timeArr: null,
        startTimes: null,
        videoInfo: null,
        lastTime: null
      }
    },
    components: {
      playBack,
      timeLine,
      his,
      videoPlayBack
    },
    created() {
      this.getTime()
    },
    mounted() {
      this.getQuery()
    },
    watch: {
      'videoInfo.videoDeviceBean': {
        handler(val, oldVal) {
          var _this = this
          if (!oldVal) {
            if (val) {
              window.postMessage({
                act: 'postVideoInfo',
                msg: {
                  obj: val,
                  lastTime: _this.lastTime
                }
              }, '*')
            }
          } else {
            if (!val) {
              return
            } else {
              if (val.id !== oldVal.id) {
                window.postMessage({
                  act: 'postVideoInfo',
                  msg: {
                    obj: val,
                    lastTime: _this.lastTime
                  }
                }, '*')
              }
            }
          }
        },
        deep: true
      }
    },
    methods: {
      getQuery() {
        this.carId = this.$route.params.id
        this.playBackByCarId()
      },
      playBackByCarId() {
        playback(this.carId).then(response => {
          this.historyInfo = response.data.historyInfo
          this.visitorInfoPoints = response.data.visitorInfoPoints
          this.lastTime = this.visitorInfoPoints[this.visitorInfoPoints.length - 1].moveTimeString
          this.timeArr = [this.visitorInfoPoints[0].moveTimeString, this.lastTime]
          const zoom = 17
          pointTo(this.historyInfo.mapBean.longitude, this.historyInfo.mapBean.latitude, zoom)
          trackPlayBack(this.visitorInfoPoints)
        })
      },
      setGisPlay(time, speed) {
        movingJump(time, speed)
        var _this = this
        window.postMessage({
          act: 'postVideoInfo',
          msg: {
            obj: _this.videoInfo.videoDeviceBean,
            lastTime: _this.lastTime
          }
        }, '*')
      },
      setGisSuspend() {
        movingPause()
        window.postMessage({
          act: 'suspendTime'
        }, '*')
      },
      setGisStop() {
        movingStop()
        window.postMessage({
          act: 'stopTime'
        }, '*')
      },
      // 从地图获取时间戳
      getTime() {
        var _this = this
        window.addEventListener('message', _this.getT, false)
      },
      getT(e) {
        var _this = this
        if (e.data.act === 'areaTrackTiming') {
          _this.startTimes = timeToString(e.data.msg.time)
          let videoInfo = this.getVideoInfo(_this.startTimes)
          if (videoInfo.length > 0) {
            this.videoInfo = videoInfo[0]
          }
        }
      },
      getVideoInfo(movingTime) {
        return this.visitorInfoPoints.filter((f) => {
          if (f.moveTimeString === movingTime) {
            return f
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .videos {
    width: 346px;
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
