<template>
  <div class="CommonTable">
    <div class="table_title">
      <div class="title_left">修改密码</div>
      <titles class="title_right"></titles>
    </div>
    <el-card class="table_main">
      <div class="table_form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" :label-width="labelWidth" class="demo-ruleForm">
        <el-form-item label="原密码" prop="password">
          <el-input placeholder="请输入原密码" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input placeholder="请输入新密码" v-model="ruleForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPassword">
          <el-input placeholder="请再次输入新密码" v-model="ruleForm.checkPassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-card>
  </div>
</template>

  <script>
  import titles from '@/components/title'
  import {modify} from '@/api/ModPassword'
  import {TokenKey} from '@/utils/auth.js'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'))
        } else {
          // if (this.ruleForm.checkPass !== '') {
          //   console.log(this.$refs.ruleForm)
          //   this.$refs.ruleForm.validateField('checkPass')
          // }
          callback()
        }
      }
      var validateNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (value === this.ruleForm.password) {
          callback(new Error('新密码不能和原密码一致'))
        } else {
          callback()
        }
      }
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认新密码'))
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        labelWidth: '300px',
        token: new TokenKey().getToken(),
        ruleForm: {
          password: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          newPassword: [
            { validator: validateNewPass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validateCheckPass, trigger: 'blur' }
          ]
        }
      }
    },
    components: {titles},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modify(this.token, this.ruleForm.password, this.ruleForm.newPassword).then((response) => {
              console.log(response)
              this.$message({
                type: 'success',
                message: '密码修改成功，即将跳转登录页'
              })
              setTimeout(() => {
                this.$store.dispatch('LogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              }, 1000)
            })
              .catch((error) => {
                console.log(error)
                this.$message({
                  type: 'error',
                  message: '原密码错误，请重新操作'
                })
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
