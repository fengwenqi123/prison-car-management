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
                  :readonly="disabled"
                  placeholder="请输入名称"
                  v-model="form.name"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="备注:" prop="description">
                <el-input
                  :readonly="disabled"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入备注"
                  v-model="form.description">
                </el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-radio v-model="form.status" label='1' :disabled="disabled">启用</el-radio>
                <el-radio v-model="form.status" label='2' :disabled="disabled">禁用</el-radio>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <div class="form_bottom">
      <el-button icon="el-icon-document" size="small" @click="submitForm('addForm')" class="blueButton"
                 v-if="showButton">保存
      </el-button>
      <el-button icon="el-icon-refresh" size="small" @click="resetForm('addForm')" class="whiteButton"
                 v-if="showButton">重置
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="goBack" class="whiteButton">返回</el-button>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import titleHeader from '@/components/title/index'
  import {listToTree} from '@/utils/listtoTree.js'
  import {findRole, add, findRoleById} from '@/api/RoleManagement'

  export default {
    data() {
      return {
        // 表单属性
        labelWidth: '300px',
        selected: null,
        // 数据
        flag: true,
        data2: [],
        disabled: false,
        page_title: '新增角色',
        authArr: [],
        sourceData: null,
        showButton: true,
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
    components: {
      titleHeader
    },
    created() {
      this.getAll()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getQuery(to.params.data)
      })
    },

    methods: {
      // 获取路由传来的数据
      getQuery(data) {
        console.log(data)// 无论路由有没有传值，params的初始值都是{},但是在组件加载时vm并没有渲染，所以开始data是underfined
        if (data) { // 没有刷新路由的情况
          this.sourceData = this.$route.params // 路由传过来的数据
          if (this.sourceData.data) { // 编辑或详情，this.sourceData.data此时是有数据的
            this.renderData(this.sourceData)
            sessionStorage.setItem('Role', JSON.stringify(this.$route.params))
          }
        } else {
          this.sourceData = JSON.parse(sessionStorage.getItem('Role'))
          this.renderData(this.sourceData)
        }
      },
      renderData(d) {
        this.page_title = d.title
        this.disabled = d.disabled
        this.showButton = d.show
        if (d.data) {
          this.form = d.data
          this.form.status = d.data.status.toString()
        }
      },
      // 数据操作
      getAll() { // 查看所有权限
        findRole().then(response => {
          if (response.code === 200) {
            var list = response.data
            list.forEach((item, index) => {
              item.disabled = this.disabled
            })
            this.data2 = listToTree('id', 'layer', list)
            if (this.form.id) {
              this.findRoleByIds()
            }
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
              if (response.code === 200) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({name: 'RoleManagement'})
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
      },
      goBack() {
        this.$router.push({name: 'RoleManagement'})
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
