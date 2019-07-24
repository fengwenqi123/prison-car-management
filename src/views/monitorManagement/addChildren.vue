<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="所属监区:">
              <el-select v-model="form.mapId" placeholder="请选择监区">
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id" :disabled="readonly">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头编号:" prop="code">
              <el-input :readonly="readonly" placeholder="请输入摄像头编号" v-model="form.code" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="摄像头名称:" prop="deviceName">
              <el-input :readonly="readonly" placeholder="请输入摄像头名称" v-model="form.deviceName" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="安装位置:" prop="address">
              <el-input :readonly="readonly" placeholder="请输入安装位置" v-model="form.address" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="X轴坐标:" prop="x">
              <el-input :readonly="readonly" placeholder="请输入X轴坐标" v-model="form.x" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="Y轴坐标:" prop="y">
              <el-input :readonly="readonly" placeholder="请输入Y轴坐标" v-model="form.y" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="经度:" prop="longitude">
              <el-input :readonly="readonly" placeholder="请输入经度" v-model="form.longitude" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="纬度:" prop="latitude">
              <el-input :readonly="readonly" placeholder="请输入纬度" v-model="form.latitude" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="设备IP地址:" prop="ip">
              <el-input :readonly="readonly" placeholder="请输入设备IP地址" v-model="form.ip" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="端口号:" prop="port">
              <el-input :readonly="readonly" placeholder="请输入端口号" v-model="form.port" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="用户名:" prop="account">
              <el-input :readonly="readonly" placeholder="请输入用户名" v-model="form.account" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input :readonly="readonly" placeholder="请输入密码" v-model="form.password" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="通道号:" prop="channel">
              <el-input :readonly="readonly" placeholder="请输入通道号" v-model="form.channel" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="录像机设备IP地址:" prop="vcrIp">
              <el-input :readonly="readonly" placeholder="请输入设备IP" v-model="form.vcrIp" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="录像机端口号:" prop="vcrPort">
              <el-input :readonly="readonly" placeholder="请输入端口号" v-model="form.vcrPort" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="录像机用户名:" prop="vcrAccount">
              <el-input :readonly="readonly" placeholder="请输入用户名" v-model="form.vcrAccount" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="录像机密码:" prop="vcrPassword">
              <el-input :readonly="readonly" placeholder="请输入密码" v-model="form.vcrPassword" clearable>
              </el-input>.
            </el-form-item>
            <el-form-item label="录像机通道号:" prop="vcrChannel">
              <el-input :readonly="readonly" placeholder="请输入通道号" v-model="form.vcrChannel" clearable>
              </el-input>
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

import { add } from '@/api/monitor'
import { lists } from '@/api/department'

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
        code: null,
        deviceName: null,
        address: null,
        longitude: null,
        latitude: null,
        x: null,
        y: null,
        ip: null,
        port: null,
        account: null,
        password: null,
        channel: null,
        mapId: null,
        mapName: null,
        irradiationArea: null,
        vcrIp: null,
        vcrPort: null,
        vcrAccount: null,
        vcrPassword: null,
        vcrChannel: null
        // status: '1'
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
    // 获取监狱部门
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
      if (this.row) {
        this.form = JSON.parse(JSON.stringify(this.row))
        console.log(this.form)
        // this.form.status = this.form.status.toString()
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
