<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="所属监区:" prop="mapId">
              <el-select v-model="form.mapId" placeholder="请选择监区">
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id"
                           :disabled="readonly">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="编号:">
              <el-input :readonly="readonly" placeholder="请输编号" v-model="form.code" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input :readonly="readonly" placeholder="请输入名称" v-model="form.name" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="设备识别码:">
              <el-input :readonly="readonly" placeholder="请输入设备识别码" v-model="form.license" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input :readonly="readonly" placeholder="请填写备注" v-model="form.description" clearable>
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

  import {add} from '@/api/tracker'
  import {lists} from '@/api/map'

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
          mapId: null,
          id: null,
          code: null,
          name: null,
          license: null,
          description: null
        },
        page: {
          pageSize: 1000,
          pageNum: 1,
          total: 0
        },
        sort: null,
        order: null,
        status: null,
        keyword: null,
        departmentId: null,
        options: [],
        // form: this.row,
        // 表单验证
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          mapId: [{required: true, message: '请选择监区', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.init()
      this.getDepList()
    },
    methods: {
      init() {
        console.log(this.row)
        if (this.row) {
          this.form = this.row
          console.log(this.form)
        }
      },
      // 获取地图列表
      getDepList() {
        lists(
          this.page.pageNum,
          this.page.pageSize,
          this.order,
          this.sort,
          this.status,
          this.keyword,
          this.departmentId
        ).then(response => {
          this.options = response.data.dataList
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
