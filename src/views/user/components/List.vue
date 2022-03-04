<template>
  <el-card>
    <div slot="header">
      <el-form ref="filter-form" :model="filterParams" inline>
        <el-form-item label="手机号" inline-message="false">
          <el-input v-model="filterParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <div class="block">
            <el-date-picker
              v-model="filterParams.rangeDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isLoading"
            @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleQuery"
            :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
     <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="用户ID"
          width="150">
        </el-table-column>
        <el-table-column
          label="头像"
          width="100">
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          label="状态"
          width="80">
          <template slot-scope="scope">
            <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)">
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        v-if="Close"
        :before-close="handleClose">
        <el-select v-model="value1" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </span>
      </el-dialog>
  </el-card>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
export default {
  name: 'UserList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      tableData: [],
      isLoading: true,
      dialogVisible: false,
      // 下拉菜单数据
      options: [],
      // 选中选项的 ID 组成的数组
      value1: [],
      Close: true,
      currentRoleID: null
    }
  },
  created () {
    this.loadUserPages()
  },
  methods: {
    async loadUserPages () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.tableData = data.data.records
      this.isLoading = false
    },
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUserPages()
    },
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUserPages()
    },
    async handleSelectRole (userID) {
      this.Close = true
      this.currentRoleID = userID.id
      this.dialogVisible = true
      const { data } = await getAllRoles()
      console.log(data)
      if (data.code === '000000') {
        this.options = data.data
      }
      const { data: data2 } = await getUserRoles(userID.id)
      if (data2.code === '000000') {
        this.value1 = data2.data.map(item => item.id)
      }
    },
    cancel () {
      this.dialogVisible = false
      this.Close = false
      this.value1 = []
    },
    async handleAllocRole () {
      // 点击确认，将分配角色信息提交给服务端
      const { data } = await allocateUserRoles({
        userId: this.currentRoleID,
        roleIdList: this.value1
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
        this.Close = false
        this.value1 = []
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
