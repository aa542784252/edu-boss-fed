<template>
  <div class="user">
    <user-list></user-list>
  </div>
</template>

<script>
import UserList from './components/List.vue'
export default {
  name: 'UserIndex',
  components: {
    UserList
  }
}
</script>

<style scoped lang="scss"></style>
