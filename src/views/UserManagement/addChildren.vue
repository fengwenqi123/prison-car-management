<template>
  <div class="CommonTable">
    <div class="title-table">
      <title-header></title-header>
    </div>
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <el-card class="table_main">
          <div class="table_form">
            <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
              <el-form-item  label="登录名:" prop="loginName">
                <el-input
                  placeholder="请输入登录名"
                  v-model="form.loginName"
                  :readonly="disabled"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item  label="名称:" prop="name">
                <el-input
                  :readonly="disabled"
                  placeholder="请输入名称"
                  v-model="form.name"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item  label="选择部门:" prop="departmentIds">
                <select class="select" name="supLayer" v-model="departmentIds" @change="selectChange" :disabled="disabled">
                  <option value="">请选择</option>
                  <option v-for="item in data2" :value="item.id" :key="item.id">
                    <span v-if="!item.layer" v-text="item.name"></span>
                    <span v-if="item.layer && item.layer.length==3" v-text="item.name"></span>
                    <span v-if="item.layer && item.layer.length==6" v-text="'　┝ '+item.name"></span>
                    <span v-if="item.layer && item.layer.length==9" v-text="'　　┝ '+item.name"></span>
                    <span v-if="item.layer && item.layer.length==12" v-text="'　　　　┝ '+item.name"></span>
                    <span v-if="item.layer && item.layer.length==15" v-text="'　　　　　　┝ '+item.name"></span>
                  </option>
                </select>
              </el-form-item>
              <el-form-item  label="员工编号:" prop="code">
                <el-input
                  clearable
                  placeholder="请输入员工编号"
                  v-model="form.code">
                </el-input>
              </el-form-item>
              <el-form-item  label="性别:" prop="type">
                <el-radio v-model="form.gender" label='1' :disabled="disabled">男</el-radio>
                <el-radio v-model="form.gender" label='3' :disabled="disabled">女</el-radio>
              </el-form-item>
              <el-form-item  label="email:" prop="email">
                <el-input
                  clearable
                  placeholder="请输入email"
                  v-model="form.email">
                </el-input>
              </el-form-item>
              <el-form-item  label="手机:" prop="mobile">
                <el-input
                  clearable
                  placeholder="请输入手机"
                  v-model="form.mobile">
                </el-input>
              </el-form-item>
              <el-form-item  label="身份证:" prop="idCard">
                <el-input
                  clearable
                  placeholder="请输入身份证"
                  v-model="form.idCard">
                </el-input>
              </el-form-item>
              <el-form-item  label="生日:" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  align="right"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
              <el-form-item  label="地址:" prop="address">
                <el-input
                  clearable
                  placeholder="请输入地址"
                  v-model="form.address">
                </el-input>
              </el-form-item>
              <el-form-item  label="备注:" prop="description">
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入备注"
                  v-model="form.description">
                </el-input>
              </el-form-item>
              <el-form-item  label="状态:" prop="status">
                <el-radio v-model="form.status" label='1' :disabled="disabled">启用</el-radio>
                <el-radio v-model="form.status" label='2' :disabled="disabled">禁用</el-radio>
              </el-form-item>
              <el-form-item  label="选择角色:">
                <el-checkbox-group v-model="roleIds" v-for="item in roleArr" :key="item.id">
                  <el-checkbox :label="item.id" :disabled="disabled">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <div class="form_bottom">
      <el-button  icon="el-icon-document" size="small" @click="submitForm('addForm')" class="blueButton" v-if="showButton">保存</el-button>
      <el-button  icon="el-icon-refresh" size="small" @click="resetForm('addForm')" class="whiteButton" v-if="showButton">重置</el-button>
      <el-button  icon="el-icon-refresh-left" size="small" @click="goBack" class="whiteButton">返回</el-button>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import titleHeader from '@/components/title/index'
  import {add, getRoleArr, findRoleById, findDepById} from '@/api/UserManagement'
  import {findDep} from '@/api/DepManagement'

  export default {
    data() {
      return {
        // 表单属性
        labelWidth: '300px',
        // 数据
        roleArr: [],
        roleIds: [],
        data2: null,
        departmentIds: null,
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        disabled: false,
        page_title: '新增用户',
        authArr: [],
        sourceData: null,
        showButton: true,
        // 表单内容
        form: {
          id: null,
          loginName: null,
          name: null,
          departmentIds: null,
          code: null,
          gender: '1',
          email: null,
          mobile: null,
          idCard: null,
          birthday: null,
          address: null,
          description: null,
          status: '1',
          roleIds: []
        },
        // 表单验证
        rules: {
          loginName: [{required: true, message: '请输入登录名', trigger: 'blur'}],
          name: [{required: true, message: '请输入名称', trigger: 'blur'}]
        }
      }
    },
    components: {
      titleHeader
    },
    created() {
      this.getQuery()
      this.findAuth()
      this.getData()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // console.log(vm)
        // vm的赋值是在mounted之后的，所以mounted勾子里面获取不到vm.$set()设置的值
        vm.getQuery(to.params)
      })
    },
    methods: {
      // 获取路由传来的数据
      getQuery(data) {
        // console.log(data)// 无论路由有没有传值，params的初始值都是{},但是在组件加载时vm并没有渲染，所以开始data是underfined
        if (data) {
          if (Object.keys(data).length > 0) { // 没有刷新路由的情况
            this.sourceData = this.$route.params // 路由传过来的数据
            if (this.sourceData.data) { // 编辑或详情，this.sourceData.data此时是有数据的
              this.renderData(this.sourceData)
              sessionStorage.setItem('User', JSON.stringify(this.$route.params))
            }
          } else {
            this.sourceData = JSON.parse(sessionStorage.getItem('User'))
            this.renderData(this.sourceData)
          }
        }
      },
      renderData(d) {
        this.page_title = d.title
        this.disabled = d.disabled
        this.showButton = d.show
        if (d.data) {
          this.form = d.data
          this.form.status = d.data.status.toString()
          this.form.gender = d.data.gender.toString()
        }
      },
      // 数据操作
      findAuth() {
        findDep().then(response => {
          if (response.code === 200) {
            this.data2 = response.data.dataList
            if (this.form.id) {
              this.findDepByIds()
            }
          }
        })
      },
      getData() {
        getRoleArr().then(response => {
          if (response.code === 200) {
            this.roleArr = response.data.dataList
            if (this.form.id) {
              this.findRoleByIds()
            }
          }
        })
      },
      findRoleByIds() {
        findRoleById(this.form.id).then(response => {
          response.data.forEach((item, index) => {
            this.roleIds.push(item.id)
          })
        })
      },
      findDepByIds() {
        findDepById(this.form.id).then(response => {
          this.departmentIds = response.data[0].id
          this.form.departmentIds = this.departmentIds
        })
      },
      selectChange() {
        this.form.departmentIds = this.departmentIds
      },
      // 表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.roleIds = this.roleIds.join(',')
            add(this.form).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({name: 'UserManagement'})
                }, 500)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.form = {}
        this.departmentIds = null
        this.roleIds = []
      },
      goBack() {
        this.$router.push({name: 'UserManagement'})
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
