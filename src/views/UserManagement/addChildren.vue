<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="登录名:" prop="loginName">
              <el-input
                placeholder="请输入登录名"
                v-model="form.loginName"
                :readonly="readonly"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input
                :readonly="readonly"
                placeholder="请输入名称"
                v-model="form.name"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="选择部门:" prop="departmentIds">
              <select class="select" name="supLayer" v-model="departmentIds" @change="selectChange"
                      :readonly="readonly">
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
            <el-form-item label="员工编号:" prop="code">
              <el-input
                :readonly="readonly"
                clearable
                placeholder="请输入员工编号"
                v-model="form.code">
              </el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="type">
              <el-radio v-model="form.gender" label='1' :readonly="readonly">男</el-radio>
              <el-radio v-model="form.gender" label='2' :readonly="readonly">女</el-radio>
            </el-form-item>
            <el-form-item label="email:" prop="email">
              <el-input
                clearable
                :readonly="readonly"
                placeholder="请输入email"
                v-model="form.email">
              </el-input>
            </el-form-item>
            <el-form-item label="手机:" prop="mobile">
              <el-input
                clearable
                :readonly="readonly"
                placeholder="请输入手机"
                v-model="form.mobile">
              </el-input>
            </el-form-item>
            <el-form-item label="身份证:" prop="idCard">
              <el-input
                clearable
                :readonly="readonly"
                placeholder="请输入身份证"
                v-model="form.idCard">
              </el-input>
            </el-form-item>
            <el-form-item label="生日:" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                align="right"
                :readonly="readonly"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="地址:" prop="address">
              <el-input
                clearable
                :readonly="readonly"
                placeholder="请输入地址"
                v-model="form.address">
              </el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
              <el-input
                type="textarea"
                :rows="6"
                :readonly="readonly"
                placeholder="请输入备注"
                v-model="form.description">
              </el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-radio v-model="form.status" label='1' :readonly="readonly">启用</el-radio>
              <el-radio v-model="form.status" label='2' :readonly="readonly">禁用</el-radio>
            </el-form-item>
            <el-form-item label="选择角色:">
              <el-checkbox-group v-model="roleIds" v-for="item in roleArr" :key="item.id">
                <el-checkbox :label="item.id" :readonly="readonly">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!readonly" icon="el-icon-document" size="small" @click="submitForm('addForm')"
                 class="blueButton">保存
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="cancel" class="whiteButton">返回</el-button>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import {add, getRoleArr, findRoleById, findDepById} from '@/api/UserManagement'
  import {findDep} from '@/api/DepManagement'

  export default {
    props: ['row', 'readonly'],
    data() {
      return {
        // 表单属性
        labelWidth: '100px',
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
        authArr: [],
        sourceData: null,
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
    created() {
      this.init()
      this.findAuth()
      this.getData()
    },
    methods: {
      init() {
        if (this.row) {
          this.form = JSON.parse(JSON.stringify(this.row))
          this.form.status = this.form.status.toString()
          this.form.gender = this.form.gender.toString()
        }
      },
      // 数据操作
      findAuth() {
        findDep().then(response => {
          this.data2 = response.data.dataList
          if (this.form.id) {
            this.findDepByIds()
          }
        })
      },
      getData() {
        getRoleArr().then(response => {
          this.roleArr = response.data.dataList
          if (this.form.id) {
            this.findRoleByIds()
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
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.submit()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submit() {
        this.$emit('submit')
      },
      cancel() {
        this.$emit('cancel')
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
