<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="添加权限:">
              <el-tree
                :data="data2"
                :show-checkbox=flag
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
              >
              </el-tree>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input
                :readonly="readonly"
                placeholder="请输入名称"
                v-model="form.name"
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
            <el-form-item label="状态:" prop="status">
              <el-radio :readonly="readonly" v-model="form.status" label='1'>启用</el-radio>
              <el-radio :readonly="readonly" v-model="form.status" label='2'>禁用</el-radio>
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

  import {listToTree} from '@/utils/listtoTree.js'
  import {findRole, add, findRoleById} from '@/api/RoleManagement'

  export default {
    props: ['row', 'readonly'],
    data() {
      return {
        // 表单属性
        labelWidth: '100px',
        // 数据
        flag: true,
        data2: [],
        disabled: false,
        authArr: [],
        sourceData: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        Jurisdiction: [],
        // 表单内容
        form: {
          id: null,
          name: null,
          description: null,
          status: '1',
          authorizeIds: null
        },
        // 表单验证
        rules: {
          name: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.init()
      this.getAll()
    },
    methods: {
      init() {
        if (this.row) {
          this.form = JSON.parse(JSON.stringify(this.row))
          this.form.status = this.form.status.toString()
        }
      },
      // 数据操作
      getAll() { // 查看所有权限
        findRole().then(response => {
          var list = response.data
          list.forEach((item, index) => {
            item.disabled = this.disabled
          })
          this.data2 = listToTree('id', 'layer', list)
          if (this.form.id) {
            this.findRoleByIds()
          }
        })
      },
      findRoleByIds() { // 根据角色id获取权限
        findRoleById(this.form.id).then(response => {
          this.Jurisdiction = response.data
          this.$refs.tree.setCheckedNodes(this.Jurisdiction)
        })
      },
      // 表单操作
      submitForm(formName) {
        this.form.authorizeIds = this.$refs.tree.getCheckedKeys().join(',')
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
