<template>
  <div class="container">
    <multi></multi>
  </div>
</template>

<script>
  import {screen} from '@/api/map.js'
  import multi from '@/components/video/multi'

  export default {
    components: {
      multi
    },
    data() {
      return {
        screenData: null
      }
    },
    created() {
      this.getScreen()
    },
    methods: {
      // 获取地图监控
      getScreen() {
        screen().then(response => {
          var screenData = response.data
          window.postMessage({
            act: 'screen',
            msg: {
              obj: JSON.stringify(screenData)
            }
          }, '*')
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
