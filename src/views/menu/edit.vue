<template>
  <div class="menu-edit">
    <create-or-edit :isEdit="true">

    </create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
};
</script>

<style scoped lang=""></style>
