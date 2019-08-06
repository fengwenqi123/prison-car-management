<template>
  <div class="container">
    <div class="table_main_add">
      <el-scrollbar class="scrolls">
        <div class="table_form">
          <el-form :model="form" status-icon :rules="rules" ref="addForm" :label-width="labelWidth">
            <el-form-item label="所属监区:" prop="mapId">
              <el-select v-model="form.mapId" placeholder="请选择监区">
                <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id"
                           :disabled="readonly">
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
            <el-form-item label="绘制监控区域:">
              <el-button icon="el-icon-document" size="small" @click="draw()"
                         class="blueButton">点击绘制
              </el-button>
            </el-form-item>
            <el-form-item label="经度:" prop="longitude">
              <el-input :readonly="readonly" placeholder="请输入经度" v-model="form.longitude" clearable>
              </el-input>
              <span @click="onPoint"><svg-icon icon-class="dingwei"></svg-icon></span>
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
              </el-input>
              .
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
      <el-button v-if="!readonly" icon="el-icon-document" size="small" @click="submitForm('addForm')"
                 class="blueButton">保存
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="cancel" class="whiteButton">返回</el-button>
    </div>
    <div class="idialog" v-if="idialog">
      <el-dialog title="绘制区域" class="point" :visible.sync="idialog" :fullscreen="fullscreen" width="80%" top="0"
                 append-to-body>
        <coor></coor>
        <el-button icon="el-icon-map-location" size="small" class="pointButton" @click="newDraw()">
          绘制区域
        </el-button>
      </el-dialog>
    </div>
    <div class="pdialog" v-if="pdialog">
      <el-dialog title="定位" class="point" :visible.sync="pdialog" :fullscreen="fullscreen" width="80%" top="0"
                 append-to-body>
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

  import {add} from '@/api/monitor'
  import {lists} from '@/api/map'
  import coor from '@/views/map/coor.vue'
  import point from '@/views/map/point.vue'
  import {mapGetters} from 'vuex'
  import HDraw from '@/assets/gis/HDraw.js'

  export default {
    props: ['row', 'readonly'],
    components: {
      coor,
      point
    },
    computed: {
      ...mapGetters([
        'area',
        'pointObj'
      ])
    },
    watch: {
      area: {//  深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.form.irradiationArea = val
        },
        deep: true
      },
      pointObj: {//  深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.form.longitude = val[0]
          this.form.latitude = val[1]
        },
        deep: true
      },
      idialog: {//  深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          if (!val) {
            // HDraw.clear()
            // alert(111)
          }
        },
        deep: true
      }
    },
    data() {
      return {
        idialog: false,
        pdialog: false,
        fullscreen: false,
        // 表单属性
        labelWidth: '140px',
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
        },
        // 表单验证
        rules: {
          mapId: [{required: true, message: '请选择监区', trigger: 'blur'}],
          code: [
            {required: true, message: '请输入摄像头编号', trigger: 'blur'}
          ],
          deviceName: [{required: true, message: '请输入摄像头名称', trigger: 'blur'}],
          address: [{required: true, message: '请输入安装位置', trigger: 'blur'}],
          longitude: [{required: true, message: '请输入经度', trigger: 'blur'}],
          latitude: [{required: true, message: '请输入纬度', trigger: 'blur'}],
          ip: [{required: true, message: '请输入设备IP地址', trigger: 'blur'}],
          port: [{required: true, message: '请输入端口号', trigger: 'blur'}],
          account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          channel: [{required: true, message: '请输入通道号', trigger: 'blur'}],
          vcrIp: [{required: true, message: '请输入设备IP', trigger: 'blur'}],
          vcrPort: [{required: true, message: '请输入端口号', trigger: 'blur'}],
          vcrAccount: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          vcrPassword: [{required: true, message: '请输入密码', trigger: 'blur'}],
          vcrChannel: [{required: true, message: '请输入通道号', trigger: 'blur'}]

        },
        page: {
          pageSize: 1000,
          pageNum: 1,
          total: 0
        },
        sort: '',
        order: '',
        departmentId: null,
        status: null,
        keyword: null,
        options: []
      }
    },
    created() {
      this.init()
      // this.findAuth()
      this.getList()
    },
    methods: {
      // 获取地图列表
      getList() {
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
      init() {
        if (this.row) {
          this.form = JSON.parse(JSON.stringify(this.row))
          console.log(this.form)
        }
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
      },
      draw() {
        this.idialog = true
        const type = 'Polygon'
        this.$nextTick(() => {
          if (this.form.irradiationArea) {
            HDraw.addPreFeature(type, this.form.irradiationArea)
          } else {
            HDraw.clearPreFeature()
          }
        })
      },
      newDraw() {
        HDraw.clear()
        const type = 'Polygon'
        HDraw.setDrawTool(type)
      },
      onPoint() {
        this.pdialog = true
        const type = 'Point'
        this.$nextTick(() => {
          HDraw.clear()
          if (this.form.longitude && this.form.latitude) {
            HDraw.addPreFeature(type, `${this.form.longitude},${this.form.latitude}`)
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
<style rel="stylesheet/scss" lang="scss">
  .point {
    .el-dialog__body {
      padding-bottom: 20px;
    }

  }
</style>
