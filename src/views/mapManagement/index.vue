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
          <div class="table_search_buttonLeft">
            <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="add" class="blueButton">添加
            </el-button>
          </div>
        </div>
        <div class="table">
          <el-table height="100%" stripe ref="multipleTable" :data="tableData" @select-all="handleSelectionAll" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="Id" label="序号" width="80">
              <template slot-scope="scope">
                <span>{{scope.$index+(page.pageNum - 1) * page.pageSize+1}} </span>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="编码" width="100">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="100">
            </el-table-column>
            <el-table-column prop="image" label="图片路径">
              <template slot-scope="scope">
                <img :src="scope.row.image" width="120" height="120" />
              </template>
            </el-table-column>
            <el-table-column prop="departmentId" label="部门ID">
            </el-table-column>
            <el-table-column prop="description" label="备注">
            </el-table-column>
            <el-table-column label="状态" prop='status'>
              <template slot-scope="scope">
                <el-tag size="medium" v-bind:class="{ active: scope.row.status === 1}">{{ scope.row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="modifyTimeString" label="更新时间" width="100">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="handleClickInfo(scope.row)" type="text" size="small" icon="el-icon-search" class="table_button">查看
                  </el-button>
                  <el-button @click="handleClickModify(scope.row)" type="text" size="small" icon="el-icon-edit-outline" class="table_button">编辑
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <div class="fenye_left">
            <el-checkbox v-model="checked" @change="toggleSelection(tableData)">全选</el-checkbox>
            <el-button icon="el-icon-delete" size="small" @click="del" class="whiteButton">批量删除</el-button>
            <el-button icon="el-icon-circle-check-outline" size="small" @click="Enable" class="whiteButton">批量启用
            </el-button>
            <el-button icon="el-icon-circle-close-outline" size="small" @click="Disable" class="whiteButton">批量禁用
            </el-button>
            <span class="checkNum">已选择{{checkNum}}项</span>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.pageNum" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
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
import { lists, delt, enable, disable } from '@/api/map'

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
      departmentId: ''
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
    query() {
      this.page.pageNum = 1
      this.list()
    },
    //  重置
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
        this.status,
        this.keyword,
        this.departmentId
      ).then(response => {
        this.tableData = response.data.dataList
        this.page = response.data.page
        console.log(this.tableData)
      })
    },
    add() {
      this.title = '新增'
      this.addDialog = true
    },
    handleClickInfo(row) {
      this.title = '查看'
      this.row = row
      this.readonly = true
      this.addDialog = true
    },
    handleClickModify(row) {
      this.title = '修改'
      this.row = row
      this.addDialog = true
    },
    del() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请先选择'
        })
        return
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var num = []
          this.selectData.forEach((item, index) => {
            num.push(item.id)
          })
          delt(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    Enable() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请先选择'
        })
        return
      }
      this.$confirm('此操作即将启动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var num = []
          this.selectData.forEach((item, index) => {
            num.push(item.id)
          })
          enable(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    Disable() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请先选择'
        })
        return
      }
      this.$confirm('此操作即将启动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var num = []
          this.selectData.forEach((item, index) => {
            num.push(item.id)
          })
          disable(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.active {
  background: #67c23a;
  color: #fff;
}
</style>
