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
                  :readonly="disabled"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="部门编号:" prop="code">
                <el-input
                  :readonly="disabled"
                  placeholder="请输入部门编号"
                  v-model="form.code"
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
  import {add, findDep} from '@/api/DepManagement'

  export default {
    data() {
      return {
        // 表单属性
        labelWidth: '300px',
        selected: null,
        // 数据
        parent: null,
        disabled: false,
        page_title: '新增部门',
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
    components: {
      titleHeader
    },
    created() {
      this.findAuth()
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
              sessionStorage.setItem('Department', JSON.stringify(this.$route.params))
            }
          } else {
            this.sourceData = JSON.parse(sessionStorage.getItem('Department'))
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
                      this.parent_layer = item.layer
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
              if (response.code === 200) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({name: 'DepManagement'})
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
        this.$router.push({name: 'DepManagement'})
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
