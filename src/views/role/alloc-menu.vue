<template>
  <div class="alloc-munu">
    <el-card>
      <el-tree
      ref="tree"
      node-key="id"
      :data="data"
      :default-checked-keys="checkedKeys"
      :props="defaultProps"
      :show-checkbox="true"
      :default-expand-all="true"
      ></el-tree>
      <div style="margin:20px">
        <el-button @click="Reset">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.data = data.data
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs.tree.getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      console.log(data, 'rolemenu')
      if (data.code === '000000') {
        this.checkfilter(data.data)
      }
    },
    checkfilter (data) {
      data.forEach(element => {
        if (!element.selected) {
          return
        }
        if (element.subMenuList) {
          return this.checkfilter(element.subMenuList)
        }
        this.checkedKeys = [...this.checkedKeys, element.id]
      })
    },
    Reset () {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style scoped lang="scss"></style>
