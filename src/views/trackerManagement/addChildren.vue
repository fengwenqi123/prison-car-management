<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="编号:" prop="code">
              <el-input :readonly="readonly" placeholder="请输编号" v-model="form.code" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input :readonly="readonly" placeholder="请输入名称" v-model="form.name" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="设备识别码:" prop="license">
              <el-input :readonly="readonly" placeholder="请输入设备识别码" v-model="form.license" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
              <el-input :readonly="readonly" placeholder="请填写备注" v-model="form.description" clearable>
              </el-input>
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

import { findAuthorize, add } from '@/api/tracker'

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
        code: null,
        name: null,
        license: null,
        description: null
      },
      // form: this.row,
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
      console.log(this.row)
      if (this.row) {
        this.form = this.row
        console.log(this.form)
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
