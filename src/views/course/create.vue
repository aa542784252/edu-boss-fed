<template>
 <div class="create-course">
   <create-or-edit></create-or-edit>
 </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'CreateCourse',
  components: {
    CreateOrEdit
  }
}
</script>

<style scoped lang="scss"></style>
