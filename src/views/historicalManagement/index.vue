<template>
  <div class="CommonTable">
    <div class="title-table">
      <title-header></title-header>
    </div>
    <el-card class="table_main">
      <div class="table_con">
        <div class="table_search">
          <el-form :inline="true" class="form-inline">
            <el-form-item label="关键字">
              <el-input placeholder="请输入关键字" v-model="keyword" clearable>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query" class="blueButton">查询
              </el-button>
              <el-button plain type='info' icon="el-icon-refresh" size="small" @click="rest" class="blueButton">重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          <el-table height="100%" stripe ref="multipleTable" :data="tableData" @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="Id" label="序号" width="80">
              <template slot-scope="scope">
                <span>{{scope.$index+(page.pageNum - 1) * page.pageSize+1}} </span>
              </template>
            </el-table-column>
            <el-table-column prop="carLicense" label="车牌号码" width="100">
            </el-table-column>
            <el-table-column prop="pilot" label="驾驶人" width="100">
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话">
            </el-table-column>
            <!--            <el-table-column prop="positionDeviceId" label="跟踪器">-->
            <!--            </el-table-column>-->
            <el-table-column prop="police" label="随车民警">
            </el-table-column>
            <el-table-column prop="userName" label="登记人员" width="100">
            </el-table-column>
            <el-table-column prop="addTimeString" label="登记时间">
            </el-table-column>
            <el-table-column label="是否告警">
              <template slot-scope="scope">
                <span :class="{alert:scope.row.alert}">{{scope.row.alert?'有告警':'无告警'}} </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="playBack(scope.row.id)" type="text" size="small" icon="el-icon-refresh-left">回放
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
           <div class="fenye_left">
          </div>
          <el-pagination class="fy" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="page.pageNum" :page-sizes="[10, 20, 30, 40]"
                         layout="total, sizes, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <div class="add" v-if="addDialog">
      <el-dialog :title="title" :visible.sync="addDialog" :before-close="handleClose">
        <addChildren :row="row" :readonly="readonly" @cancel="cancel" @submit="submit"></addChildren>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import titleHeader from '@/components/title/index'
  import addChildren from './addChildren'
  import {lists} from '@/api/histor'

  export default {
    data() {
      return {
        border: true,
        order: '',
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        checked: false,
        checkNum: 0,
        sort: '',
        status: 0,
        keyword: '',
        show: true,
        tableData: [],
        selectData: '',
        addDialog: false,
        row: null,
        readonly: false,
        title: '',
        addTimeMinString: '',
        addTimeMaxString: '',
        idCard: ''
      }
    },
    components: {
      titleHeader,
      addChildren
    },
    created() {
      this.list()
    },
    methods: {
      handleSelectionChange(val) {
        this.selectData = val
        this.checkNum = this.selectData.length
        if (this.selectData.length === this.tableData.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      handleSelectionAll(val) {
        this.selectData = val
        console.log(this.selectData)
      },
      toggleSelection(rows) {
        console.log(this.checked)
        if (this.checked) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        } else {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, false)
          })
        }
      },
      // 每页几条
      handleSizeChange(val) {
        this.page.pageSize = val
        this.list()
      },
      // 当前页
      handleCurrentChange(val) {
        this.page.pageNum = val
        this.list()
      },
      // 查询
      query() {
        this.page.pageNum = 1
        this.list()
      },
      // 重置
      rest() {
        this.keyword = ''
        this.list()
      },
      list() {
        lists(
          this.page.pageNum,
          this.page.pageSize,
          this.order,
          this.sort,
          this.addTimeMinString,
          this.addTimeMaxString,
          this.idCard,
          this.keyword
        ).then(response => {
          this.tableData = response.data.dataList
          this.page = response.data.page
          console.log(this.tableData)
        })
      },
      cancel() {
        this.handleClose()
      },
      submit() {
        this.handleClose()
        this.list()
      },
      handleClose() {
        this.addDialog = false
        this.row = null
        this.readonly = false
      },
      playBack(id) {
        this.$router.push({
          name: 'playBack',
          params: {
            id: id
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fy {
    margin-left: 550px;
  }

  .alert {
    color: red;
  }
</style>
