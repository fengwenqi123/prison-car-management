<template>
  <div class="login-container">
    <div class="header">
      <img :src="title" alt="">
    </div>
    <div class="mid">
      <div class="form">
        <el-form
          class="login-form"
          autoComplete="on"
          :rules="rules"
          :model="loginForm"
          ref="loginForm">
          <h3 class="title">用户登录</h3>
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              autoComplete="on"
              clearable
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              name="password"
              :type="pwdType"
              v-model="loginForm.password"
              autoComplete="on"
              show-password
              clearable
              placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <div>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <el-button
              class="buttom"
              type="primary"
              :loading="loading"
              @click="handleLogin('loginForm')">
              登 录
            </el-button>
          </div>
        </el-form>
        <div class="Tips">
          <div class="icon">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="item">
            <p>
              建议屏幕分辨率大于1366*768
            </p>
            <p>请使用谷歌浏览器, <span @click="download">点击下载</span></p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <span>华是科技 WhyisTech.Ltd @2019 All rights reserved.</span>
    </div>
  </div>
</template>

<script>
  import '@/utils/fontSize.js'
  import {UserName, PassWord, KeepPassWord} from '@/utils/auth'
  import {toboolean} from '@/utils/index'

  const userName = new UserName()
  const passWord = new PassWord()
  const keepPassWord = new KeepPassWord()
  const kpw = keepPassWord.getKPW() ? keepPassWord.getKPW() : false
  export default {
    name: 'login',
    data() {
      return {
        checked: kpw ? toboolean(kpw) : kpw,
        title: require('@/assets/img/login-title.png'),
        background: require('@/assets/img/background.png'),
        loginForm: {
          username: kpw ? userName.getUserName() : '',
          password: kpw ? passWord.getPassWord() : '',
          loginType: 0,
          loginSource: 1
        },
        loading: false,
        pwdType: 'password',
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleLogin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then((response) => {
              if (this.checked) {
                userName.setUserName(this.loginForm.username)
                passWord.setPassWord(this.loginForm.password)
                keepPassWord.setKPW(this.checked)
              } else {
                userName.removeUserName()
                passWord.removePassWord()
                keepPassWord.removeKPW()
              }
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      download() {
        window.open('../static/exe/ChromeSetup.exe')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login-container {
    position: absolute;
    height: 100%;
    width: 100%;

    .header {
      height: 140px;
      display: flex;
      align-items: center;
      padding-left: 80px;

      img {
        height: 84px;
      }
    }

    .mid {
      position: relative;
      height: 678px;
      width: 100%;
      background: url("../../assets/img/background.png") no-repeat;
      background-size: 100%;

      .form {
        position: absolute;
        top: 100px;
        right: 100px;
        width: 422px;
        height: 433px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        padding: 36px 44px 30px 44px;

        .login-form {
          .title {
            text-align: center;
            font-size: 30px;
            font-weight: normal;
            color: rgba(11, 56, 106, 1);
            line-height: 43px;
          }

          .buttom {
            margin-top: 18px;
            width: 332px;
            height: 46px;
            background: rgba(24, 144, 255, 1);
            border-radius: 2px;
          }
        }

        .Tips {
          margin-top: 16px;
          padding-left: 60px;
          display: flex;
          align-items: center;
          height: 36px;

          .icon {
            margin-right: 6px;

            .el-icon-warning-outline {
              font-size: 24px;
              color: #787F8C;
            }
          }

          .item {
            p {
              margin-top: 2px;
              font-size:13px;
              font-weight:400;
              color:rgba(120,126,140,1);
              span{
                color: #1890FF;
                font-size:13px;
                font-weight:400;
              }
            }
          }
        }
      }
    }

    .bottom {
      height: 115px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        color: #CCCCCC;
      }
    }
  }
</style>
<style lang="scss">
  .login-container {
    .el-input__inner {
      width: 332px;
      height: 46px;
      background: rgba(229, 233, 237, 1);
      border-radius: 2px;
      border: 1px solid rgba(208, 208, 208, 0.5);
    }
  }
</style>
