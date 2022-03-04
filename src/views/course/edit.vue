<template>
 <div class="edit-course">
   <create-or-edit isEdit :courseId="courseId"></create-or-edit>
 </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'EditCoures',
  props: {
    courseId: {
      type: [Number, String],
      require: true
    }
  },
  components: {
    CreateOrEdit
  }
}
</script>

<style scoped lang="scss"></style>
