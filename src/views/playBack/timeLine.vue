<template>
  <div class="progress">
    <div class="plays">
      <div class="play" :type="flag" @click="play">
        <svg-icon :icon-class="plays"></svg-icon>
      </div>
      <div class="stop" @click="stopTime">
        <svg-icon :icon-class="stops"></svg-icon>
      </div>
    </div>
    <div class="startTime">
      {{startTimes}}
    </div>
    <div class="mid">
      <div @click="move" class="TheColorBar" :style="{width:ballLeftLength+'px'}"></div>
      <div v-focus="{setType,setLeft}" class="TimeBall" :style="{left:ballLeftLength+'px'}"></div>
      <div @click="move" class="TheBar" :style="{width:width+'px'}"></div>
    </div>
    <div class="endTime">
      {{endTime}}
    </div>
<!--    <div class="speed">-->
<!--      <el-dropdown placement="top-start" @command="commands">-->
<!--  <span class="el-dropdown-link">-->
<!--    速度 x{{speed}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--  </span>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item command="64">16</el-dropdown-item>-->
<!--          <el-dropdown-item command="32">8</el-dropdown-item>-->
<!--          <el-dropdown-item command="16">4</el-dropdown-item>-->
<!--          <el-dropdown-item command="8">2</el-dropdown-item>-->
<!--          <el-dropdown-item command="1">1</el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
<!--    </div>-->
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing,prefer-const,space-before-function-paren,no-redeclare,no-undef */

  // stringToTime 字符串转时间戳  timeToString 时间戳转字符串
  import {stringToTime, timeToString, getAbsLeft} from '@/utils/index.js'

  export default {
    props: ['timeArr', 'times'],
    data() {
      return {
        plays: 'plays',
        stops: 'stop',
        startTime: this.timeArr[0],
        endTime: this.timeArr[1],
        flag: false,
        AverageTime: null,
        AverageLength: null,
        width: 800,
        ballLeftLength: 0,
        ballLeftTime: 0,
        speed: '1'
      }
    },
    created() {
      this.getInfo()
      this.flag = true
    },
    watch: {
      flag() {
        if (this.flag) {
          this.plays = 'plays'
          this.suspendTime()
        } else {
          this.plays = 'suspend'
          this.startsTime()
        }
      },
      // 判断移动时候超出最大最小范围
      ballLeftLength() {
        if (this.ballLeftLength > this.width) {
          this.ballLeftLength = this.width
        } else if (this.ballLeftLength < 0) {
          this.ballLeftLength = 0
        }
      },
      times() {
        this.startTimes = this.times
      }
    },
    computed: {
      // 拖动时刷新startTime
      startTimes: {
        get: function () {
          return timeToString((Math.floor(this.ballLeftLength / this.width * this.AverageTime + 0.0000000001) + stringToTime(this.startTime)) * 1000)
        },
        set: function (value) {
          this.ballLeftLength = (stringToTime(value) - stringToTime(this.startTime)) / this.AverageTime * this.width
        }
      }
    },
    methods: {
      setType(type) {
        this.flag = type
      },
      setLeft(left) {
        this.ballLeftLength = left
      },
      play() {
        this.flag = !this.flag
      },
      getInfo() {
        // 移动总时间(秒)
        this.AverageTime = stringToTime(this.endTime) - stringToTime(this.startTime)
        // 每秒移动长度
        this.AverageLength = this.width / this.AverageTime
      },
      // 地图开始播放
      setGisPlay() {
        let time = stringToTime(this.startTimes) * 1000
        let speed = 1000 / this.speed
        this.$emit('setGisPlay', time, speed)
        // movingJump(stringToTime(this.startTimes) * 1000, 1000 / this.speed)
      },
      // 地图暂停
      setGisSuspend() {
        this.$emit('setGisSuspend')
        // movingPause()
      },
      // 地图停止播放
      setGisStop() {
        this.$emit('setGisStop')
        // movingStop()
      },
      // 开始移动
      startsTime() {
        this.setGisPlay()
      },
      // 暂停移动
      suspendTime() {
        this.setGisSuspend()
      },
      // 停止移动
      stopTime() {
        this.flag = true
        this.ballLeftLength = 0
        this.setGisStop()
      },
      // 快进
      commands(val) {
        this.speed = val
        if (!this.flag) {
          this.$emit('setSpeed', this.speed)
          // movingAccelerate(1000 / this.speed)
        }
      },
      // 点击进度条跳时间点
      move(ev) {
        this.flag = true
        this.$nextTick(() => {
          let disx = ev.clientX - getAbsLeft(document.querySelector('.mid'))
          if (disx < 0) {
            disx = 0
          }
          this.ballLeftLength = disx
          this.flag = false
        })
      }
    },
    directives: {
      focus: {
        // 指令的定义
        inserted(el, binding) {
          var flag = true
          var type = true
          el.onmousedown = function (ev) {
            var ev = ev || event
            var disx = ev.clientX - el.offsetLeft
            flag = false
            type = true
            binding.value.setType(type)
            document.onmousemove = function (ev1) {
              var ev = ev1 || event
              binding.value.setLeft(ev.clientX - disx)
            }
          }
          document.onmouseup = function (ev) {
            if (!flag) {
              type = false
              binding.value.setType(type)
            }
            flag = true
            document.onmousemove = null
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .progress {
    position: absolute;
    bottom: 50px;
    left: 50%;
    background: #fff;
    padding: 6px 0;
    width: 1400px;
    margin-left: -700px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .plays {
      display: flex;

      .svg-icon {
        font-size: 40px;
        color: #000;
        cursor: pointer;
        margin: 6px;
      }
    }

    .startTime, .endTime {
      margin: 0 8px;
      width: 160px;
      text-align: center;
    }

    .mid {
      position: relative;

      .TheColorBar {
        position: absolute;
        cursor: pointer;
        background: #3498db;
        height: 6px;
        top: 0px;
        left: 0px;
        /*transition: all 0.1s;*/
      }

      .TheBar {
        cursor: pointer;
        height: 6px;
        background: #f5f5f5;
      }

      .TimeBall {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: #3498db;
        position: absolute;
        margin-left: -6px;
        top: -3px;
        /*transition: all 0.1s;*/
        cursor: pointer;
      }
    }

  }

</style>
