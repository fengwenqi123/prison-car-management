<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="编码:" prop="code">
              <el-input :readonly="readonly" placeholder="请输入车牌号码" v-model="form.code" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input :readonly="readonly" placeholder="请登记驾驶员" v-model="form.name" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="部门ID:">
              <!-- <el-input :readonly="readonly" placeholder="请输入身份证号" v-model="form.idCard" clearable> -->
              <!-- </el-input> -->
              <el-select v-model="form.departmentId" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
              <el-input type="textarea" :readonly="readonly" placeholder="请填写事由" v-model="form.description" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="状态:" prop="cause">
              <el-input type="textarea" :readonly="readonly" placeholder="请填写事由" v-model="form.cause" clearable></el-input>
            </el-form-item> -->

            <el-form-item label="上传图片:">
              <el-upload action=" http://192.168.1.207:85/track/storage/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
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
import { add } from '@/api/map'
import { lists } from '@/api/department'
export default {
  props: ['row', 'readonly'],
  data() {
    return {
      // token
      token: window.localStorage.getItem('token'),
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
        image: null,
        departmentId: null,
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
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      sort: '',
      order: '',
      options: []
    }
  },
  created() {
    this.init()
    // this.findAuth()
    this.getList()
  },
  methods: {
    // 图片操作
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getList() {
      lists(
        this.page.pageNum,
        this.page.pageSize,
        this.order,
        this.sort,
        this.status,
        this.keyword
      ).then(response => {
        this.options = response.data.dataList
        this.page = response.data.page
        console.log(this.options)
      })
    },
    init() {
      console.log(this.token)
      console.log(window.localStorage)
      if (this.row) {
        this.form = JSON.parse(JSON.stringify(this.row))
        this.form.status = this.form.status.toString()
      }
    },
    // 数据操作
    // findAuth() {
    //   findAuthorize().then(response => {
    //     this.authArr = response.data.dataList
    //     if (this.form.id) {
    //       if (this.form.layer.length < 4) {
    //         this.parent = this.form.name
    //       } else {
    //         var leng = this.form.layer.substr(0, this.form.layer.length - 3)
    //         var list = response.data.dataList
    //         list.forEach((item, index) => {
    //           if (leng === item.layer) {
    //             this.parent = item.name
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
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
