<template>
  <div class="create">
    <el-card>
      <div slot="header">
        <el-steps :active="active" finish-status="success">
          <el-step v-for="(step, i) in steps" :key="step.id" :title='step.title' @click.native="active = i"></el-step>
        </el-steps>
      </div>
      <el-form label-width="80px" :model="course" :rules="rules" ref="ruleForm">
        <div v-show="active === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述" :prop="course.previewFirstField.length > 20 ? 'previewFirstField' : 'previewSecondField'">
            <el-input v-model="course.previewFirstField"
            placeholder="概述1"
            style="width: 48%; min-width: 300px; margin-right: 15px">
              <template slot="append">{{course.previewFirstField.length}}/20</template>
            </el-input>
            <el-input v-model="course.previewSecondField"
            placeholder="概述2"
            style="width: 48%; min-width: 300px; margin-right: 15px">
              <template slot="append">{{course.previewSecondField.length}}/20</template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="course.sortNum" controls-position="right"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="active === 1">
          <course-image v-model="course.courseListImg" label="课程封面" :limit="8"></course-image>
          <course-image v-model="course.courseImgUrl" label="解锁封面"></course-image>
        </div>
        <div v-show="active === 2">
          <el-form-item label="售卖价格">
            <el-input type="number" :min="0" v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input type="number" :min="0" v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input type="number" :min="0" v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag">
            </el-input>
          </el-form-item>
        </div>
        <div v-show="active === 3">
          <el-form-item label="秒杀活动" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input type="number" :min="0" v-model="course.activityCourseDTO.amount"><template slot="append">元</template></el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="course.activityCourseDTO.stock"><template slot="append">个</template></el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="active === 4">
          <el-form-item label="课程详情">
            <!-- <el-input type="textarea" v-model="course.courseDescriptionMarkDown"></el-input> -->
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="active++" v-if="active !== steps.length - 1">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage.vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import TextEditor from '@/components/TextEditor'
export default {
  name: 'CourseCreateOrEdit',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      active: 0,
      steps: [
        { id: 1, title: '基本信息' },
        { id: 2, title: '课程封面' },
        { id: 3, title: '销售信息' },
        { id: 4, title: '秒杀信息' },
        { id: 5, title: '课程详情' }
      ],
      imageUrl: '',
      course: {
        // id: 0,
        // 课程名称
        courseName: '',
        // 课程介绍
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          // 讲师名称
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          // 讲师介绍
          description: ''
        },
        // 课程详情内容
        courseDescriptionMarkDown: '',
        // 商品原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        // 课程排序
        sortNum: 0,
        // 概述1
        previewFirstField: '',
        // 概述2
        previewSecondField: '',
        // 上架状态，默认值 0 代表不上架，1 代表上架
        status: 0,
        // 销量
        sales: 0,
        // 参与秒杀活动的课程
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 秒杀活动开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 秒杀活动价格
          amount: 0,
          // 秒杀库存
          stock: 0
        }
      },
      rules: {
        previewFirstField: [
          { min: 0, max: 20, message: '长度小于20个字符', trigger: 'blur' }
        ],
        previewSecondField: [
          { min: 0, max: 20, message: '长度小于20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async save () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '保存'}成功`)
        this.$router.push({
          name: 'course'
        })
      }
    },
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        if (!data.data.activityCourse) {
          this.course.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-step {
  cursor: pointer;
}
</style>
