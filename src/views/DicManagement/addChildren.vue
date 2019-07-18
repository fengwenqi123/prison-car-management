<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="分类:" prop="classification">
              <el-input
                placeholder="请输入分类"
                v-model="form.classification"
                :readonly="readonly"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="项目名称:" prop="itemName">
              <el-input
                :readonly="readonly"
                placeholder="请输入项目名称"
                v-model="form.itemName"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="项目值:" prop="itemValue">
              <el-input
                :readonly="readonly"
                placeholder="请输入项目值"
                v-model="form.itemValue"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
              <el-input
                :readonly="readonly"
                type="textarea"
                :rows="6"
                placeholder="请输入备注"
                v-model="form.sort">
              </el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-radio v-model="form.type" label='1' :readonly="readonly">系统</el-radio>
              <el-radio v-model="form.type" label='2' :readonly="readonly">自定义</el-radio>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-radio v-model="form.status" label='1' :readonly="readonly">启用</el-radio>
              <el-radio v-model="form.status" label='2' :readonly="readonly">禁用</el-radio>
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

  import {add} from '@/api/DicManagement'

  export default {
    props: ['row', 'readonly'],
    data() {
      return {
        // 表单属性
        labelWidth: '100px',
        // 数据
        disabled: false,
        authArr: [],
        sourceData: null,
        showButton: true,
        // 表单内容
        form: {
          id: null,
          classification: null,
          itemName: null,
          itemValue: null,
          sort: null,
          description: null,
          status: '1',
          type: '1'
        },
        // 表单验证
        rules: {
          classification: [{required: true, message: '请输入分类', trigger: 'blur'}],
          itemName: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
          itemValue: [{required: true, message: '请输入项目值', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.init()
    },

    methods: {
      init() {
        if (this.row) {
          this.form = JSON.parse(JSON.stringify(this.row))
          this.form.status = this.form.status.toString()
          this.form.type = this.form.type.toString()
        }
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
            })
            this.submit()
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
