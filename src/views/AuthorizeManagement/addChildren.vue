<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="上级权限:" prop="supAuth">
              <el-input v-model="parent" v-if="this.form.id" disabled>
              </el-input>
              <select name="supLayer" v-model="form.supLayer" class="select" v-if="!this.form.id">
                <option value="">请选择</option>
                <option v-for="item in authArr" :value="item.layer" :key="item.id">
                  <span v-if="item.layer && item.layer.length==3" v-text="item.name"></span>
                  <span v-if="item.layer && item.layer.length==6" v-text="'　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==9" v-text="'　　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==12" v-text="'　　　　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==15" v-text="'　　　　　　┝ '+item.name"></span>
                </option>
              </select>
            </el-form-item>
            <el-form-item label="权限名称:" prop="name">
              <el-input :readonly="readonly" placeholder="请输入权限名称" v-model="form.name" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="权限值:" prop="actionValue">
              <el-input :readonly="readonly" placeholder="请输入权限值" v-model="form.actionValue" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
              <el-input :readonly="readonly" placeholder="请输入排序" v-model="form.sort" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
              <el-input :readonly="readonly" type="textarea" :rows="6" placeholder="请输入备注" v-model="form.description">
              </el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-radio :readonly="readonly" v-model="form.status" label='1'>启用</el-radio>
              <el-radio :readonly="readonly" v-model="form.status" label='2'>禁用</el-radio>
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

import { findAuthorize, add } from '@/api/AuthorizeManagement'

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
.active {
  background: #67c23a;
  color: #fff;
}
</style>
