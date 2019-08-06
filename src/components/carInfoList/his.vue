<template>
  <div class="containers">
    <div class="car-info">
      <div class="car-info-title">
        <div class="left">
          <div class="icon">
            <svg-icon icon-class="carInfo"></svg-icon>
          </div>
          <div class="name">
            {{item.carLicense}}
          </div>
        </div>
        <div class="right">
        </div>
      </div>
      <el-collapse-transition>
        <div class="car-info-list">
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
                {{item.startTimeString}}
              </div>
            </div>
            <div class="item">
              <div class="label">
                停留时间
              </div>
              <div class="value">
                {{item.endTimeString}}
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
  export default {
    name: 'index',
    props: ['carList'],
    data() {
      return {
        item: this.carList
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
