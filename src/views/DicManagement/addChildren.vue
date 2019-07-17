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
              <el-form-item label="分类:" prop="classification">
                <el-input
                  placeholder="请输入分类"
                  v-model="form.classification"
                  :readonly="disabled"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="项目名称:" prop="itemName">
                <el-input
                  :readonly="disabled"
                  placeholder="请输入项目名称"
                  v-model="form.itemName"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="项目值:" prop="itemValue">
                <el-input
                  :readonly="disabled"
                  placeholder="请输入项目值"
                  v-model="form.itemValue"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="排序:" prop="sort">
                <el-input
                  :readonly="disabled"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入备注"
                  v-model="form.sort">
                </el-input>
              </el-form-item>
              <el-form-item label="类型:" prop="type">
                <el-radio v-model="form.type" label='1' :disabled="disabled">系统</el-radio>
                <el-radio v-model="form.type" label='2' :disabled="disabled">自定义</el-radio>
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
  import {add} from '@/api/DicManagement'

  export default {
    data() {
      return {
        // 表单属性
        labelWidth: '300px',
        selected: null,
        // 数据
        disabled: false,
        page_title: '新增字典',
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
    components: {
      titleHeader
    },
    created() {
      this.getQuery()
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
              sessionStorage.setItem('Dictionary', JSON.stringify(this.$route.params))
            }
          } else {
            this.sourceData = JSON.parse(sessionStorage.getItem('Dictionary'))
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
          this.form.type = d.data.type.toString()
        }
      },
      // 数据操作
      // 表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            add(this.form).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({name: 'DicManagement'})
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
        this.$router.push({name: 'DicManagement'})
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
