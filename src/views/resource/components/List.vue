<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="url">
            <el-input v-model="form.url" placeholder="路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option
              v-for="item in resourceCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isloading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="isloading"
          >
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column
            prop="name"
            label="资源名称"
            width="100">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源路径">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | tf }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
              size="mini"
              @click='handleEdit(scope.row)'>编辑</el-button>
              <el-button
              size="mini"
              type="danger"
              @click='handleDelete(scope.row)'>删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isloading"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePage, getResourceCategories } from '@/services/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      tableData: [],
      totalCount: 0,
      resourceCategory: [],
      isloading: false
    }
  },
  created () {
    this.loadCategory()
    this.loadResource()
  },
  methods: {
    async loadCategory () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategory = data.data
      }
    },
    async loadResource () {
      this.isloading = true
      const { data } = await getResourcePage(this.form)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.totalCount = data.data.total
        this.isloading = false
      }
    },
    handleSizeChange (val) {
      this.form.size = val
      this.loadResource()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResource()
    },
    onSubmit () {
      this.form.current = 1
      this.loadResource()
    },
    reset () {
      this.$refs.form.resetFields()
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
.el-pagination {
  text-align: center;
}
</style>
