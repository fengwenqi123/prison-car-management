<template>
  <div class="container register">
    <el-form :inline="true" :model="form" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="车牌号码:" prop="license">
        <el-input :readonly="readonly" placeholder="请输入车牌号码" v-model="form.license" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="驾驶员:">
        <el-input :readonly="readonly" placeholder="请登记驾驶员" v-model="form.pilot" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="身份证号:">
        <el-input :readonly="readonly" placeholder="请输入身份证号" v-model="form.idCard" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话:">
        <el-input :readonly="readonly" placeholder="请输入联系电话" v-model="form.mobile" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="随车民警:">
        <el-input :readonly="readonly" placeholder="请输入随车民警" v-model="form.police" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="车辆跟踪器:" prop="positionDeviceId">
        <el-select v-model="form.positionDeviceId" placeholder="请选择">
          <el-option v-for="(item,index) in trackData" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来访事由">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="form.cause">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="button">
      <el-button icon="el-icon-document" size="small" @click="submitForm('addForm')" class="blueButton">保存
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="cancel" class="whiteButton">返回</el-button>
    </div>
  </div>
</template>

<script>
  import {trackerById} from '@/api/tracker'
  import {add} from '@/api/CarInformation'

  export default {
    props: ['mapId'],
    name: 'register',
    data() {
      return {
        form: {
          id: null,
          idCard: null,
          pilot: null,
          police: null,
          mobile: null,
          positionDeviceId: null,
          cause: null,
          license: null
        },
        readonly: false,
        trackData: null,
        rules: {
          license: [{required: true, message: '请选择活动区域', trigger: 'change'}],
          positionDeviceId: [{required: true, message: '请选择跟踪器', trigger: 'change'}]
        }
      }
    },
    created() {
      this.getTracker()
    },
    methods: {
      // 获取跟踪器
      getTracker() {
        trackerById(this.mapId).then(response => {
          this.trackData = response.data
        })
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
              this.cancel()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancel() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    margin-top: 20px;

    .button {
      text-align: center;
      padding: 20px 0;
    }
  }
</style>
<style lang="scss">
  .register {
    .el-textarea {
      width: 780px;
      height: 180px;

      textarea {
        height: 100% !important;
      }
    }

    .el-form-item {
      margin-bottom: 40px;
    }
  }
</style>
