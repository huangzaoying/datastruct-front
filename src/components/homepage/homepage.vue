<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/login.png" width="200px" height="200px" />
          <div class="userinfo">
            <p class="name">{{ user.userName }}</p>
            <p class="accsee">{{ user.type == 1 ? '管理员' : '学生' }}</p>
          </div>
        </div>
        <div class="logininfo">
          <p>上次登录时间：<span>2022-6-17</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-input
        placeholder="输入关键字搜索"
        clearable
        v-model="query"
        style="margin-top: 20px"
        class="input"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search(query)"
        ></el-button>
      </el-input>
      <el-radio-group v-model="radio">
        <el-radio :label="0">时间</el-radio>
        <el-radio :label="1">信息</el-radio>
        <el-radio :label="2">类型</el-radio>
      </el-radio-group>
      <el-card style="margin-top: 20px; hegiht: 460px">
        <el-table :data="logData.logList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="date" label="时间" sortable width="200px">
          </el-table-column>
          <el-table-column prop="info" label="操作" sortable width="300px">
          </el-table-column>
          <el-table-column prop="level" label="类型" sortable width="300px">
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog
      title="查询结果如下"
      :visible.sync="dialogTableVisible"
      width="50%"
    >
      <el-table :data="log" label-width="120px">
        <el-table-column
          property="date"
          label="时间"
          sortable
        ></el-table-column>
        <el-table-column
          property="info"
          label="信息"
          width="180"
          sortable
        ></el-table-column>
        <el-table-column
          property="level"
          label="类型"
          width="180"
          sortable
        ></el-table-column>
      </el-table>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      query: null,
      radio: 0,
      log: [],
      dialogTableVisible: false,
    }
  },
  methods: {
    async getAlllog() {
      const { data: res } = await this.$http.get('log/findAll')
      this.$store.commit('GET_log', res.entity)
      console.log(this.logData)
      if (res.entity.length) return this.$message.success('查询成功!')
      return this.$message.error('查询失败~')
    },
    async search(query) {
      var response = null
      if (this.radio == '0') {
        const { data: res } = await this.$http.get('log/find?date=' + query)
        response = res
      } else if (this.radio == '1') {
        const { data: res } = await this.$http.get('log/find?info=' + query)
        response = res
      } else if (this.radio == '2') {
        const { data: res } = await this.$http.get('log/find?level=' + query)
        response = res
      }
      console.log(response)
      if (response.success) {
        for (var i = 0; i < response.entity.length; i++) {
          this.log[i] = response.entity[i]
        }
        this.dialogTableVisible = true
        return this.$message.success('查询成功!')
      }
      return this.$message.error('查询失败~')
    },
    addJudge() {
      const token = window.sessionStorage.getItem('token')
      if (token == 0) {
        this.addDialogVisible = false
        this.$message.error('暂无权限')
      } else if (token == 1) {
        this.addDialogVisible = true
      }
    },
  },
  mounted() {
    console.log(this.user)
    this.getAlllog()
  },
  computed: {
    // 存放课程的数据和数量
    ...mapState(['user']),
    ...mapState(['logData']),
  },
}
</script>
<style lang="less" scoped>
.input {
  width: 40%;
}
</style>
