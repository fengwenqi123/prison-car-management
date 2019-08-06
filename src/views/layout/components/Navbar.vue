<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <img :src="title" class="title" alt="">
      <div class="tabs">
        <div class="item">
          <router-link to="/screen">
            <svg-icon icon-class="screen"></svg-icon>
            分屏展示
          </router-link>
        </div>
        <div class="item" style="margin-left: 12px;">
          <router-link to="/home">
            <svg-icon icon-class="home"></svg-icon>
            地图首页
          </router-link>
        </div>
        <el-popover
          placement="bottom"
          width="150"
          trigger="click">
          <ul class="ul1">
            <li>
              <div class="item" @click="modPassword">
                <i class="el-icon-edit"></i>
                修改密码
              </div>
            </li>
            <li>
              <div class="item" @click="logout">
                <i class="el-icon-third-tuichudenglu"></i>
                退出登录
              </div>
            </li>
          </ul>
          <div slot="reference" class="avatar-wrapper">
            <svg-icon icon-class="avatar" class="user-avatar"></svg-icon>
            <p style="color: #888888;">{{name}}</p>
          </div>
        </el-popover>
      </div>
    </el-menu>
  </div>

</template>

<script>
  /* eslint-disable object-curly-spacing,prefer-const */

  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import title from '@/assets/img/title.png'

  export default {
    name: 'Navbar',
    data() {
      return {
        flag: false,
        title,
        data: {},
        active1: null,
        time1: null
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'sidebar'
      ])
    },
    mounted() {
    },
    methods: {
      download() {
        window.open('../static/exe/install_flash_player_ppapi.exe')
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        // var service = `http://${window.location.host}/`
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
          // window.location.href = `http://59.202.42.57:8080/casZjgh/logout?service=${service}`
        })
      },
      modPassword() {
        this.$router.push({name: 'modPassword'})
      },
      joinin() {
        this.flag = true
      },
      out() {
        this.flag = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .number {
    display: inline-block;
    height: 30px;
    background: #fff;
    line-height: 30px;
    border-radius: 15px;
    color: #fff;
    text-align: center;
    padding: 0 10px;
  }

  .success {
    background: green;
  }

  .error {
    background: red;
  }

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    position: absolute;
    top: 200px;
    float: left;
    z-index: 999;
    padding: 0 10px;
  }

  .navbar {
    height: 68px;
    line-height: 50px;
    border-radius: 0px !important;
    background: #252A2F;

    .title {
      width: 312px;
      margin-top: 15px;
      position: absolute;
      z-index: 19;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .avatar-container1:hover {
      background: #333644;
    }

    .avatar-container1 {
      height: 68px;
      /*background: #333644;*/
      display: inline-block;
      position: absolute;
      right: 98px;
      padding: 0 20px;
      text-align: center;

      .el-dropdown-link {
        .svgs {
          font-size: 30px;
          margin-top: 12px;
        }

        p {
          margin-top: -30px;
          font-size: 10px;
        }

        color: #fff;
        cursor: pointer;
        position: relative;
        font-size: 10px;

        .el-icon-arrow-down {
          position: absolute;
        }
      }

    }

    .avatar-wrapper {
      width: auto;
      padding: 10px;
      border-radius: 20px;
      height: 32px;
      cursor: pointer;
      margin-right: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;

      .user-avatar {
        border-radius: 50%;
        margin-right: 10px;
        font-size: 22px;
        color: #888888;
      }
    }

    .msg {
      .pl1 {
        span {
          margin-right: 15px;

          .svgs {
            font-size: 20px;
          }
        }
      }

      padding: 15px;
      width: 320px;
      /*height: 220px;*/
      position: absolute;
      right: -20px;
      top: 63px;
      background: #f5f5f5;

      .divimg {
        text-align: center;

        img {
          width: 58px;
          border-radius: 50%;
          height: 58px;
        }
      }

      p {
        height: 28px;
        line-height: 28px;

        span {
          width: 84px;
          display: inline-block;
          text-align: right;
        }
      }

      .lie {
        text-align: center;
        padding: 0 15px;

        .svgs {
          font-size: 22px;
          color: #000;
        }

        .grid-content {
          height: 20px;
          margin-top: -13px;
          line-height: 20px;
          font-size: 10px;
        }

        p {
          display: flex;
          align-items: center; /*垂直居中*/
          justify-content: center; /*水平居中*/
          .svgouts {
            margin-right: 8px;
            font-size: 22px;
          }
        }

      }
    }

    .el-col, .outp {
      cursor: pointer;
    }

    .tabs {
      position: absolute;
      right: 20px;
      display: flex;
      height: 68px;
      justify-content: center;
      align-items: center;

      .item {
        a {
          width: auto;
          padding: 10px;
          border-radius: 20px;
          height: 32px;
          cursor: pointer;
          margin-right: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          color: #888888;

          .svg-icon {
            font-size: 20px;
            color: #888888;
            margin-right: 4px;
          }
        }
      }

      span {
        color: #ffff;
        display: flex;
        margin-left: 12px;
        cursor: pointer;

        a {
          display: inline-block;
          /* padding: 20px 20px; */
          height: 30px;
          background: #fff;
          line-height: 30px;
          width: 100px;
          border-radius: 15px;
          color: #1890FF;
          text-align: center;
        }
      }
    }
  }

  .svgD {
    margin-right: 15px;
  }

  .el-dropdown-menu {
    background: #f5f5f5;
  }

  .ul0 {
    li {
      padding: 10px 0;

      .item {
        display: flex;
        justify-content: space-around;
        margin-top: 5px;
        align-items: center;

        span:nth-child(1) {
          font-size: 10px;
        }
      }
    }
  }

  .ul1 {
    li {
      cursor: pointer;

      .item {
        display: flex;
        justify-content: center;
        height: 26px;
        align-items: center;
        background: rgba(232, 160, 16, 1);
        color: #fff;
        border-radius: 10px;

        i {
          margin-right: 20px;
        }
      }
    }

    li:nth-child(2) {
      .item {
        margin-top: 10px;
        background: rgba(220, 53, 69, 1);
      }
    }
  }
</style>

