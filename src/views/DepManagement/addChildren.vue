<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="归属:" prop="supLayer">
              <el-input v-model="parent" v-if="this.form.id" disabled></el-input>
              <select class="select" name="supLayer" v-model="form.supLayer" v-if="!this.form.id">
                <option value="">请选择</option>
                <option v-for="item in data2" :value="item.layer" :key="item.id">
                  <span v-if="!item.layer" v-text="item.name"></span>
                  <span v-if="item.layer && item.layer.length==3" v-text="item.name"></span>
                  <span v-if="item.layer && item.layer.length==6" v-text="'　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==9" v-text="'　　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==12" v-text="'　　　　┝ '+item.name"></span>
                  <span v-if="item.layer && item.layer.length==15" v-text="'　　　　　　┝ '+item.name"></span>
                </option>
              </select>
            </el-form-item>
            <el-form-item label="部门名称:" prop="name">
              <el-input
                placeholder="请输入部门名称"
                v-model="form.name"
                :readonly="readonly"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="部门编号:" prop="code">
              <el-input
                :readonly="readonly"
                placeholder="请输入部门编号"
                v-model="form.code"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
              <el-input
                :readonly="readonly"
                type="textarea"
                :rows="6"
                placeholder="请输入备注"
                v-model="form.description">
              </el-input>
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

  import {add, findDep} from '@/api/DepManagement'

  export default {
    props: ['row', 'readonly'],
    data() {
      return {
        // 表单属性
        labelWidth: '100px',
        selected: null,
        // 数据
        parent: null,
        disabled: false,
        data2: [],
        authArr: [],
        sourceData: null,
        showButton: true,
        // 表单内容
        form: {
          id: null,
          supLayer: null,
          name: null,
          code: null,
          description: null
        },
        // 表单验证
        rules: {
          name: [{required: true, message: '请输入部门名称', trigger: 'blur'}]
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
        }
      },
      // 数据操作
      findAuth() {
        findDep().then(response => {
          if (response.code === 200) {
            this.data2 = response.data.dataList
            if (this.form.id) {
              this.data2.forEach((item, index) => {
                if (this.form.layer.length === 3) {
                  if (this.form.layer === item.layer) {
                    this.parent = item.name
                  }
                } else {
                  var leng = this.form.layer.substr(0, this.form.layer.length - 3)
                  var list = response.data.dataList
                  list.forEach((item, index) => {
                    if (leng === item.layer) {
                      this.parent = item.name
                    }
                  })
                }
              })
            }
          }
        })
      },
      // 表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
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
