<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/login.png" alt="" />
      </div>
      <!--      表单提交区域-->
      <el-form
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
      >
        <!--        用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!--        按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :loading="loginLoading"
            >登录</el-button
          >
          <el-button type="info" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      loginLoading: false, // 登录限制
      loginForm: {
        // 登录的表单数据的绑定对象
        username: '',
        password: '',
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    async register() {
      const { data: res } = await this.$http.post(
        'user/register?password=' +
          this.loginForm.password +
          '&userName=' +
          this.loginForm.username
      )
      if (!res.success) {
        return this.$message.error('注册失败')
      }
      return this.$message.success('注册成功')
    },
    login() {
      this.loginLoading = true
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return (this.loginLoading = false)
        }
        const { data: res } = await this.$http.post(
          'user/login?password=' +
            this.loginForm.password +
            '&userName=' +
            this.loginForm.username
        )
        //利用返回状态判断
        if (!res.success) {
          this.loginLoading = false
          return this.$message.error('登录失败 账户错误(或不存在)!')
        }
        this.$store.commit('setUser', res.entity)
        this.$message.success('登录成功!')
        // 1. 将登录成功之后的 token,保存到客户端的 sessionStorage(会话机制/只在当前页面生效)中 localStorage(持久话机制/关闭页面也不会忘记数据)
        //   1.1 项目中除了登录之外的API接口,必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效, 所以将 token 保存在 sessionStorage中
        window.sessionStorage.setItem('token', res.entity.type)
        // 2. 通过编程式路由导航跳转到后台主页,路由地址是 /home
        this.$router.push('/home')
        this.loginLoading = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background: #c0dcf9;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
