<template>
  <div class="CommonTable">
    <div class="title-table">
      <title-header></title-header>
    </div>
    <el-card class="table_main">
      <div class="table_search">
        <span>关键字：</span>
        <el-input
          placeholder="请输入关键字"
          v-model="keyword"
          clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="query" class="blueButton">查询</el-button>
        <div class="table_search_buttonLeft">
          <el-button  icon="el-icon-refresh" size="small" @click="resetPassword" class="whiteButton">重置密码</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="add" class="blueButton">添加</el-button>
          <!-- <el-button type="warning" icon="el-icon-edit-outline" size="small" @click="modify">修改</el-button> -->
        </div>
      </div>
      <div class="table">
          <el-table
            height="605"
            stripe
            ref="multipleTable"
            :data="tableData"
            @select-all="handleSelectionAll"
            @selection-change="handleSelectionChange"
            >
             <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="Id"
              label="序号"
              width="80">
              <template slot-scope="scope">
                <span>{{scope.$index+(page.pageNum - 1) * page.pageSize+1}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="编号"
              sortable
              prop="code"
            >
              <template slot-scope="scope">
                <p>{{scope.row.code}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginName"
              sortable
              label="登录名"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="name"
              sortable
              label="姓名"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="gender"
              sortable
              label="性别"
              width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.gender
                  =='1' ?
                  '男' :
                  '女' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="birthday"
              label="生日"
              sortable
              width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
           <el-table-column
              prop="status"
              label="状态"
              width="120">
              <template slot-scope="scope">
                <li slot="scope"  v-bind:class="{ success: scope.row.status =='1',error:scope.row.status =='2' }"><span>
                   {{ scope.row.status
                  ===1 ?'启用'
                  :scope.row.status
                  ===2 ?'禁用'
                  :'状态有误' }}
                </span>
                </li>
              </template>
            </el-table-column>
            <el-table-column
              prop="modifyTimeString"
              sortable
              label="更新时间"
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="220">
              <template slot-scope="scope">
                <el-button-group>
                <el-button @click="handleClickInfo(scope.row)" type="text" size="small" icon="el-icon-search" class="table_button">查看</el-button>
                <el-button @click="handleClickModify(scope.row)"  type="text" size="small" icon="el-icon-edit-outline" class="table_button">编辑</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
    </div>
    <div class="fenye">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
        <div class="fenye_left">
          <el-checkbox v-model="checked" @change="toggleSelection(tableData)">全选</el-checkbox>
          <el-button  icon="el-icon-delete" size="small" @click="del" class="whiteButton">批量删除</el-button>
          <el-button  icon="el-icon-circle-check-outline" size="small" @click="Enable" class="whiteButton">批量启用</el-button>
          <el-button  icon="el-icon-circle-close-outline" size="small" @click="Disable" class="whiteButton">批量禁用</el-button>
          <span class="checkNum">已选择{{checkNum}}项</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  /* eslint-disable object-curly-spacing */

  import titleHeader from '@/components/title/index'
  import {lists, delt, enable, disable, resetpassword} from '@/api/UserManagement'
  // import {getToken} from '@/utils/auth' // 验权

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
        sort: '',
        classification: '',
        type: '',
        status: 0,
        keyword: '',
        show: true,
        tableData: [],
        currentPage: 4,
        mul_0: '',
        mul: '',
        disabled: false,
        checked: false,
        checkNum: 0
      }
    },
    components: {
      titleHeader
    },
    created() {
      this.list()
    },
    methods: {
      handleSelectionChange(val) {
        this.mul_0 = val
        this.checkNum = this.mul_0.length
        if (this.mul_0.length === this.tableData.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      handleSelectionAll(val) {
        this.mul_0 = val
        console.log(this.mul_0)
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.page.pageSize = val
        this.list()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.page.pageNum = val
        this.list()
      },
      list() {
        lists(this.page.pageNum, this.page.pageSize, this.order, this.sort, this.status, this.keyword).then(response => {
          this.tableData = response.data.dataList
          this.page = response.data.page
        })
      },
      query() {
        this.page.pageNum = 1
        this.list()
      },
      add() {
        this.$router.push({name: 'AddUser', params: {title: '新增用户', data: null, show: true, disabled: false}})
      },
      handleClickInfo(row) {
        this.$router.push({name: 'AddUser', params: {title: '用户详情', data: row, show: false, disabled: true}})
      },
      handleClickModify(row) {
        this.$router.push({name: 'AddUser', params: {title: '编辑用户', data: row, show: true, disabled: false}})
      },
      modify() {
        if (this.mul_0.length > 1) {
          this.$message({
            message: '只能选择一个'
          })
          return
        }
        if (this.mul_0.length === 0) {
          this.$message({
            message: '请先选择'
          })
          return
        } else {
          this.mul = this.mul_0[0]
          this.show = false
          this.disabled = true
        }
      },
      del() {
        if (this.mul_0.length === 0) {
          this.$message({
            message: '请先选择'
          })
          return
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var num = []
          this.mul_0.forEach((item, index) => {
            num.push(item.id)
          })
          delt(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      Enable() {
        if (this.mul_0.length === 0) {
          this.$message({
            message: '请先选择'
          })
          return
        }
        this.$confirm('此操作即将启动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var num = []
          this.mul_0.forEach((item, index) => {
            num.push(item.id)
          })
          enable(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      Disable() {
        if (this.mul_0.length === 0) {
          this.$message({
            message: '请先选择'
          })
          return
        }
        this.$confirm('此操作即将启动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var num = []
          this.mul_0.forEach((item, index) => {
            num.push(item.id)
          })
          disable(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      resetPassword() {
        if (this.mul_0.length === 0) {
          this.$message({
            message: '请先选择'
          })
          return
        }
        this.$confirm('此操作即将启动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var num = []
          this.mul_0.forEach((item, index) => {
            num.push(item.id)
          })
          resetpassword(num).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.list()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
