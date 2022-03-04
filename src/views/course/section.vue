<template>
 <div class="course-section">
   <!-- <div style="margin-bottom: 20px; width: 100%; position: relative"> -->
   <div class="header">
    <el-page-header
    @back="$router.push({
    name: 'course'
    })"
    :content="courseName">
    </el-page-header>
    <!-- <el-button type="primary" style="position: absolute; right: 0; top: -8px">+添加阶段</el-button> -->
    <el-button type="primary">+添加阶段</el-button>
    </div>
   <el-card>
     <el-tree
      :data="sections"
      :props="defaultProps"
      draggable
      v-loading="isLoading"
      :allow-drop="handleAllowDrop"
      @node-drop="handleNodeDrop"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName">
          <el-button>编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else>
          <el-button>编辑</el-button>
          <el-button @click="$router.push({
            name: 'course-video',
            params: {
              courseId,
              courseName,
              theme: data.theme
            },
            query: {
                  lessonId: data.id
                }
          })">上传视频</el-button>
          <el-button>状态</el-button>
        </span>
      </span>
      </el-tree>
   </el-card>
 </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/section'

export default {
  name: 'course-section',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    courseName: {
      type: [String]
    }
  },
  created () {
    this.loadSection()
  },
  data () {
    return {
      sections: [],
      isLoading: false,
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      console.log(data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    handleAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          if (draggingNode.data.sectionId) {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      }
      this.isLoading = false
    },
    cs (node, data) {
      console.log(node, data)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tree-node__content{
  height: auto;
  border-bottom: 1px solid #ededed;
}
.custom-tree-node{
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.header{
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.header .el-page-header{
  flex: 1;
  align-items: center;
}

</style>
