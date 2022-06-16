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
    <el-row>
      <el-card style="margin-top: 20px; hegiht: 460px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(value, name) in tablelable"
            :key="name"
            :prop="name"
            :label="value"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      tableData: [
        {
          name: '参加xx活动',
          time: '3-29-13:00',
          state: 'await',
          completed: 'No',
        },
        {
          name: '参加xx活动',
          time: '3-29-13:00',
          state: 'await',
          completed: 'No',
        },
        {
          name: '参加xx活动',
          time: '3-29-13:00',
          state: 'await',
          completed: 'No',
        },
        {
          name: '参加xx活动',
          time: '9-29-13:00',
          state: 'await',
          completed: 'No',
        },
        {
          name: '参加xx活动',
          time: '4-29-13:00',
          state: 'await',
          completed: 'No',
        },
        {
          name: '参加xx活动',
          time: '3-28-13:00',
          state: 'underway ',
          completed: 'No',
        },
      ],
      tablelable: {
        name: '事件',
        time: '时间',
        state: '状态',
        completed: '是否完成',
      },
    }
  },
  methods: {},
  mounted() {
    console.log(this.user)
  },
  computed: {
    // 存放课程的数据和数量
    ...mapState(['user']),
  },
}
</script>
<style lang="less" scoped>
</style>
