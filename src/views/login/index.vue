<template>
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="top">
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import request from '@/utils/request'
// import qs from 'qs'
import { login } from '@/services/user'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入正确手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 18, min: 6, message: '请输入6到18位密码', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    // async onSubmit () {
    //   try {
    //     await this.$refs.form.validate()
    //     // console.log(qs.stringify(this.form))
    //     const { data } = await request({
    //       methods: 'POST',
    //       url: '/front/user/login',
    //       data: qs.stringify(this.form)
    //     })
    //     if (data.state === 1) {
    //       this.$router.push({
    //         name: 'home'
    //       })
    //     } else {
    //       alert(data.message)
    //     }
    //   } catch (err) {
    //     console.log('未通过校验')
    //   }
    // }
    async onSubmit () {
      try {
        await this.$refs.form.validate()
        this.isLoginLoading = true
        const { data } = await login(this.form)
        console.log(data, 'data')
        this.isLoginLoading = false
        if (data.state === 1) {
          this.$message.success('登录成功')
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error('登录失败')
        }
      } catch (err) {
        console.log('没有通过校验')
      }
      // if (this.form.password === '111111') {
      //   this.$store.commit('setUser', { mk: 333 })
      //   // console.log(this.$refs.form)
      //   this.$refs.form.validate()
      //   this.isLoginLoading = true
      //   this.$message.success('登录成功')
      //   this.$router.push(this.$route.query.redirect || '/')
      // } else {
      //   this.$message.error('登录失败')
      // }
    }
  }
}
</script>

<style lang = "scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 300px;

      .el-button {
        width: 100%;
      }
    }
  }
</style>
