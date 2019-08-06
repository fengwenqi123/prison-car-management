<template>
  <div class="containers">
    <div class="car-info" v-for="(item,index) in carLists" :key="index">
      <div class="car-info-title" @click="selectActive(index)">
        <div class="left">
          <div class="icon" :class="{errorIcon:item.alert}">
            <svg-icon icon-class="carInfo"></svg-icon>
          </div>
          <div class="name">
            {{item.license}}
          </div>
        </div>
        <div class="right">
          <div class="out" @click="carOut(item.id)">
            驶离
          </div>
        </div>
      </div>
      <el-collapse-transition>
        <div class="car-info-list" v-if="index===active">
          <div class="form">
            <div class="item">
              <div class="label">
                随车民警
              </div>
              <div class="value">
                {{item.police}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                驾驶员
              </div>
              <div class="value">
                {{item.pilot}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                联系方式
              </div>
              <div class="value">
                {{item.mobile}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                身份证号码
              </div>
              <div class="value">
                {{item.idCard}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                进入时间
              </div>
              <div class="value">
                {{item.addTimeString}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                停留时间
              </div>
              <div class="value">
                {{item.addTimeString | nowTime}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                跟踪器
              </div>
              <div class="value">
                {{item.trackerName}}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {out} from '@/api/CarInformation'
  import {stringToTime, timeDifference} from '@/utils/index'

  export default {
    name: 'index',
    props: ['carList'],
    computed: {
      ...mapGetters([
        'carId'
      ])
    },
    data() {
      return {
        active: 0,
        carLists: this.carList,
        activeCar: null
      }
    },
    filters: {
      nowTime(value) {
        const time = new Date().getTime() - stringToTime(value) * 1000
        return timeDifference(time)
      }
    },
    watch: {
      carList: {//  深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.carLists = val
          this.activeCar = val[this.active]
        },
        deep: true
      },
      carId: {
        handler(val, oldVal) {
          this.carLists.forEach((item, index) => {
            if (item.id === val) {
              this.selectActive(index)
            }
          })
        },
        deep: true
      },
      'activeCar.videoDeviceBean': {
        handler(val, oldVal) {
          if (oldVal) {
            if (val.id === oldVal.id) {
              return
            }
          }
          if (val) {
            window.postMessage({
              act: 'video',
              msg: {
                obj: JSON.stringify(val)
              }
            }, '*')
          }
        },
        deep: true
      }
    },
    methods: {
      selectActive(index) {
        this.active = index
        this.activeCar = this.carLists[this.active]
      },
      carOut(id) {
        this.$confirm('车辆驶离确认, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          out(id).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
          })
        }).catch(() => {
          console.log(2)
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .containers {
    .car-info {
      margin-top: 8px;

      &-title {
        cursor: pointer;
        padding: 0 16px;
        height: 50px;
        background: rgba(214, 235, 255, 1);
        border: 1px solid rgba(51, 153, 255, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          .icon {
            background: #389E0D;
            width: 24px;
            height: 24px;
            display: inline-block;
            text-align: center;
            line-height: 24px;
            border-radius: 50%;
          }

          .name {
            display: inline-block;
            font-size: 18px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
          }
        }

        .right {
          div {
            display: inline-block;
          }

          .label {
            font-size: 16px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            margin-right: 8px;
          }

          .value {
            font-size: 16px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }

          .out {
            color: red;
          }
        }
      }

      &-list {
        background: #fff;
        padding: 8px 0;

        .form {
          .item {
            padding: 10px 0;
            display: flex;

            .label {
              width: 100px;
              text-align: right;
            }

            .value {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
</style>
