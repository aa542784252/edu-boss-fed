<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="输入搜索:">
            <el-input v-model="form.name" style="width:180"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>重置</el-button>
            <el-button type="primary" v-loading="isLoading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
          <template slot-scope="scope">
              <span>{{ scope.row.createdTime | tf }}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <div>
            <el-button type="text" @click="$router.push({
              name: 'alloc-menu',
              params: {
                roleId: scope.row.id
              }
            })">分配菜单</el-button>
            <el-button type="text">分配资源</el-button>
          </div>
          <div>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="isEdit?'编辑角色':'添加角色'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        v-if="Close"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        >
        <create-or-edit :role-id="roleId" @success="handleSuccess" @cancel="handleCancel" :isEdit="isEdit"></create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit.vue'
import { getRolePages, deleteRole } from '@/services/role'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        id: '',
        description: '',
        createdTime: ''
      },
      tableData: [],
      isLoading: false,
      dialogVisible: false,
      isEdit: false,
      roleId: '',
      Close: true
    }
  },
  created () {
    this.loadRolePages()
  },
  methods: {
    handleAdd () {
      this.Close = true
      this.dialogVisible = true
      this.isEdit = false
    },
    async loadRolePages () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      console.log(data)
      this.tableData = data.data.records
      this.isLoading = false
    },
    handleDelete (scope) {
      this.$confirm(`是否确认删除角色：${scope.name}？`, '删除提示')
        .then(async () => {
          const { data } = await deleteRole(scope.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadRolePages()
          }
        })
        .catch((err) => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    handleEdit (role) {
      this.isEdit = true
      this.dialogVisible = true
      this.roleId = role.id
      this.Close = true
    },
    handleCancel () {
      this.dialogVisible = false
      this.Close = false
    },
    handleSuccess () {
      this.dialogVisible = false
      this.loadRolePages()
      this.Close = false
    }
  },
  filters: {
    tf (date) {
      date = new Date(date)
      return `
      ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style scoped lang="scss">
.box-card div .el-form{
  display: flex;
  justify-content: space-between;
}
</style>
