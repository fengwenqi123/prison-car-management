<template>
  <div class="tags-view-container">
    <div class="sel">
      <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
        <div class="lefts clearfix">
          <span class="Towardsleft" @click="lef">
<!--          <img src="../../../assets/img/rights.png" alt="">-->
        </span>
        </div>
        <router-link
          v-for="tag in Array.from(visitedViews)"
          ref="tag"
          :class="isActive(tag)?'active':''"
          :to="tag"
          :key="tag.path"
          class="tags-view-item"
          v-if="tag.fullPath.indexOf('home')===-1"
          @contextmenu.prevent.native="openMenu(tag,$event)">
          {{ (tag.title) }}
          <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
        </router-link>
      </scroll-pane>
      <p class="rights">
        <span class='TowardsRight' @click="righ">
<!--          <img src="../../../assets/img/rights.png" alt="">-->
        </span>
        <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>
      </p>
    </div>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
  </div>
</template>

<script>
  /* eslint-disable space-before-function-paren,no-undef */

  import ScrollPane from '@/components/ScrollPane'
  import Screenfull from '@/components/Screenfull'
  // import { generateTitle } from '@/utils/i18n'

  export default {
    components: {
      ScrollPane,
      Screenfull
    },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        array: [],
        index: null,
        path: null
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
      this.a1()
      // this.submit()
      // this.righ()
    },
    methods: {
      righ() {
        this.array = this.$store.state.tagsView.visitedViews
        this.array.forEach((item, index) => {
          if (this.$route.path === item.path) {
            if (index < this.array.length) {
              this.index = index + 1
            }
          }
        })
        this.$router.push({
          path: this.array[this.index].path
        })
      },
      lef() {
        this.array = this.$store.state.tagsView.visitedViews
        this.array.forEach((item, index) => {
          if (this.$route.path === item.path) {
            if (index > 0) {
              this.index = index - 1
            }
          }
        })
        this.$router.push({
          path: this.array[this.index].path
        })
      },
      a1() {
        $('.screenfull').click(function () {
          // $('.sidebar-container, .logo, .top_main').hide()
          // $('.main-container').css('marginLeft', 0)
          // $('.appmain').css('paddingTop', 0)
        })
      },
      submit() {
        document.onkeydown = function (e) {
          var key = window.event.keyCode
          if (key === 27) {
            $('.sidebar-container, .logo, .top_main').show()
            $('.main-container').css('marginLeft', '180px')
            $('.appmain').css('paddingTop', '113px')
          }
        }
      },
      // generateTitle, // generateTitle by vue-i18n
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      isActive(route) {
        return route.path === this.$route.path
      },
      addViewTags() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              // this.$router.push('/')
              this.$router.push({
                path: '/'
              })
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push({
          path: '/'
        })
        // this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX - 180
        this.top = e.clientY - 68
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    .lefts {
      cursor: pointer;
      display: inline-block;
      position: fixed;
      left: 180px;
      z-index: 9;
      height: 41px;
      background: #fff;

      .Towardsleft {
        float: left;
        display: inline-block;
        width: 88px;
        height: 41px;
        background: #01579b;
        text-align: center;
        line-height: 41px;

        img {
          width: 30px;
          height: 30px;
          margin-top: 5px;
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -webkit-transform: rotate(180deg); /* Safari and Chrome */
        }
      }
    }

    .home {
      background: #fff;
      display: inline-block;
      position: absolute;
      left: 102px;
      width: 80px;
      z-index: 8;
      height: 40px;
      /*margin-left: 50px;*/
      text-align: center;

      img {
        width: 32px;
        height: 32px;
        margin-top: 4px;
      }
    }

    .rights {
      cursor: pointer;
      position: fixed;
      top: 68px;
      right: 0px;
      background: #fff;
      width: 130px;
      height: 40px;

      .TowardsRight {
        display: inline-block;
        width: 60px;
        height: 40px;
        background: #01579b;
        text-align: center;
        line-height: 40px;

        img {
          width: 30px;
          height: 30px;
          margin-top: 5px;
        }
      }
    }

    img {
      display: inline-block;
    }

    .sel {
      position: relative;
      display: inline-block;
      width: 100%;

      .screenfull {
        position: absolute;
        display: inline-block;
        top: 10px;
        right: 20px;
      }
    }

    .close {
      position: absolute;
      top: 10px;
      right: 7px;
      font-size: 20px;
    }

    .tags-view-wrapper {
      background: #fff;
      height: 42px;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

      .tags-view-item {
        transition: all 0.3s;
        display: inline-block;
        position: relative;
        width: 200px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #d8dce5;
        border-bottom: none;
        border-top: none;
        color: #495060;
        text-align: center;
        background: #fff;
        padding: 0 8px;
        font-size: 15px;
        top: 2px;
        /*margin-left: 5px;*/
        /*margin-top: 4px;*/
        &:first-of-type {
          border-left: 2px solid #d8dce5;
          margin-left: 87px;
        }

        &:last-of-type {
          border-right: 2px solid #d8dce5;
          margin-right: 134px;
        }

        &.active {
          /*background-color: #42b983;*/
          /*color: #fff;*/
          /*border-color: #42b983;*/
          border-bottom: 5px solid rgba(1, 87, 155, 1);

          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }

    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        border: 1px solid #ccc;
        position: absolute;
        top: 12px;
        right: 9px;
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;

        &:before {
          position: absolute;
          right: -1px;
          transform: scale(.6);
          display: inline-block;
        }

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
