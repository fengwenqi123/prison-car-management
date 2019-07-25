<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="车牌号码:" prop="carBean.license">
              <el-input :readonly="readonly" placeholder="请输入车牌号码" v-model="form.carBean" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="驾驶员:" prop="pilot">
              <el-input :readonly="readonly" placeholder="请登记驾驶员" v-model="form.pilot" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idCard">
              <el-input :readonly="readonly" placeholder="请输入身份证号" v-model="form.idCard" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile">
              <el-input :readonly="readonly" placeholder="请输入联系电话" v-model="form.mobile" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="随车民警:" prop="police">
              <el-input :readonly="readonly" placeholder="请输入随车民警" v-model="form.police" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="车辆跟踪器:" prop="positionDeviceId">
              <el-input :readonly="readonly" placeholder="请输入车辆跟踪器" v-model="form.positionDeviceId" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="行驶路线:" prop="lineId">
              <el-input :readonly="readonly" placeholder="请输入行驶路线" v-model="form.lineId" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="事由:" prop="cause">
              <el-input type="textarea" :readonly="readonly" placeholder="请填写事由" v-model="form.cause" clearable></el-input>
            </el-form-item>
            <el-form-item label="上传图片:" prop="cause">
              <el-upload action="" list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!readonly" icon="el-icon-document" size="small" @click="submitForm('addForm')" class="blueButton">保存
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="cancel" class="whiteButton">返回</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable object-curly-spacing */

import { findAuthorize, add } from '@/api/CarInformation'

export default {
  props: ['row', 'readonly'],
  data() {
    return {
      // 表单属性
      labelWidth: '100px',
      // 数据
      parent: null,
      disabled: false,
      authArr: [],
      // 表单内容
      form: {
        id: null,
        supLayer: null,
        name: null,
        actionValue: null,
        sort: null,
        description: null,
        status: '1'
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        actionValue: [
          { required: true, message: '请输入权限值', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
    this.findAuth()
  },
  methods: {
    init() {
      if (this.row) {
        this.form = JSON.parse(JSON.stringify(this.row))
        this.form.status = this.form.status.toString()
      }
    },
    // 数据操作
    findAuth() {
      findAuthorize().then(response => {
        this.authArr = response.data.dataList
        if (this.form.id) {
          if (this.form.layer.length < 4) {
            this.parent = this.form.name
          } else {
            var leng = this.form.layer.substr(0, this.form.layer.length - 3)
            var list = response.data.dataList
            list.forEach((item, index) => {
              if (leng === item.layer) {
                this.parent = item.name
              }
            })
          }
        }
      })
    },
    // 表单操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
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
