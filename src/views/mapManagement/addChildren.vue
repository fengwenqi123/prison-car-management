<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="编码:">
              <el-input :readonly="readonly" placeholder="请输入编码" v-model="form.code" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input :readonly="readonly" placeholder="请输入名称" v-model="form.name" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="经度:" prop="longitude">
              <el-input :readonly="readonly" placeholder="请输入经度" v-model="form.longitude" clearable>
              </el-input>
              <span @click="onPoint">
                <svg-icon icon-class="dingwei"></svg-icon>
              </span>
            </el-form-item>
            <el-form-item label="纬度:" prop="latitude">
              <el-input :readonly="readonly" placeholder="请输入纬度" v-model="form.latitude" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="部门:" prop="departmentId">
              <el-select v-model="form.departmentId" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id" :disabled="readonly">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" :readonly="readonly" placeholder="请填写事由" v-model="form.description" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-radio :readonly="readonly" v-model="form.status" label='1' :disabled="readonly">启用</el-radio>
              <el-radio :readonly="readonly" v-model="form.status" label='2' :disabled="readonly">禁用</el-radio>
            </el-form-item>

            <el-form-item label="上传图片:">
              <el-upload action=" http://192.168.1.207:8100/storage/" :disabled="readonly" :headers="headers" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="success" :limit="1" :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
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
    <div class="pdialog" v-if="pdialog">
      <el-dialog title="定位" class="point" :visible.sync="pdialog" append-to-body width="80%" top="0">
        <point></point>
        <el-button icon="el-icon-map-location" size="small" class="pointButton" @click="newPoint()">
          点击定位
        </el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable object-curly-spacing */
import { add } from '@/api/map'
import { lists } from '@/api/department'
import { TokenKey } from '@/utils/auth'
import point from '@/views/map/point.vue'
import HDraw from '@/assets/gis/HDraw.js'
import { mapGetters } from 'vuex'

export default {
  props: ['row', 'readonly'],
  components: {
    point
  },
  watch: {
    pointObj: {
      //  深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.form.longitude = val[0]
        this.form.latitude = val[1]
      },
      deep: true
    }
  },
  data() {
    return {
      pdialog: false,
      dialogImageUrl: '',
      dialogVisible: false,
      // token
      token: new TokenKey().getToken(),
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
        status: '1',
        longitude: null,
        latitude: null
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }]
      },
      // 图片处理
      fileList: [],
      // 分页
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
  computed: {
    headers() {
      return {
        accessToken: this.token
      }
    },
    ...mapGetters(['area', 'pointObj'])
  },
  created() {
    this.init()
    // this.findAuth()
    this.getList()
    this.pic()
  },
  methods: {
    // 图片操作
    success(response, file, fileList) {
      if (response.code === 200) {
        this.form.image = 'http://192.168.1.207:8100/storage/' + response.data
        console.log(this.form.image)
      } else {
        this.$alert(response.msg, '提示', {
          confirmButtonText: '确定'
        })
      }
    },
    handleRemove(file, fileList) {
      this.form.image = ''
      console.log(this.form.image)
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
    pic() {
      var tmp = this.row
      if (!tmp && typeof tmp != 'undefined' && tmp != 0) {
        return
      }
      if (this.row.image === '') {
        return
      } else {
        this.fileList.push({
          url: this.row.image
        })
      }
    },
    init() {
      if (this.row) {
        this.form = JSON.parse(JSON.stringify(this.row))
        this.form.status = this.form.status.toString()
      }
    },
    // 表单操作
    submitForm(formName) {
      console.log(this.form.image)
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
    },
    onPoint() {
      this.pdialog = true
      const type = 'Point'
      this.$nextTick(() => {
        HDraw.clear()
        if (this.form.longitude && this.form.latitude) {
          HDraw.addPreFeature(
            type,
            `${this.form.longitude},${this.form.latitude}`
          )
        }
      })
    },
    newPoint() {
      HDraw.clear()
      const type = 'Point'
      HDraw.setDrawTool(type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pointButton {
  position: absolute;
  top: 64px;
  right: 138px;
}
</style>
