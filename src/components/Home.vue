<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/login.png" alt="" />
        <span>课程管理系统</span>
      </div>
      <span>{{ newTime }}</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '61px' : '200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-menu-item
            :index="item.path + ''"
            v-for="item in noChildren"
            :key="item.path"
            @click="saveActivePath('' + item.path)"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="'el-icon-' + item.icon"></i>
              <!-- 文本 -->
              <span>{{ item.label }}</span>
            </template>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.path + ''"
            v-for="item in hasChildren"
            :key="item.path"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="'el-icon-' + item.icon"></i>
              <!-- 文本 -->
              <span>{{ item.label }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="sunItem.path"
              v-for="sunItem in item.children"
              :key="sunItem.path"
              @click="saveActivePath('/' + sunItem.path)"
            >
              <template slot="title">
                <!-- 二级菜单的模板区域 -->
                <i class="el-icon-menu"></i>
                <!-- 图标 -->
                <span>{{ sunItem.label }}</span>
                <!-- 文本 -->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button
          class="footer"
          @click="changetime()"
          type="info"
          icon="el-icon-setting"
          circle
        ></el-button>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
const days = ['天', '一', '二', '三', '四', '五', '六'] // 星期数组
var interval // 定义全局定时器，用于清除定时器
var increment = 0
var timeid
var idx = 1000
export default {
  data() {
    return {
      //时间单位
      year: null,
      month: null,
      date: null,
      day: null,
      time: null,
      //左侧菜单数据
      isCollapse: false, // 是否折叠属性
      activePath: '',
      addForm: {
        date: '',
        name: '',
      },

      menuList: [
        {
          path: '/homepage ',
          name: 'homepage',
          label: '首页',
          icon: 's-home',
          url: 'Home/Home',
        },
        {
          path: '/course',
          name: 'course',
          label: '课程信息',
          icon: 'video-play',
          url: 'MallManage/MallManage',
        },
        {
          path: '/active',
          name: 'active',
          label: '课外活动',
          icon: 'user',
        },
        {
          path: '/page1',
          name: 'page1',
          label: '校园导航',
          icon: 'setting',
          url: 'Other/PageOne',
        },
      ],
    }
  },
  methods: {
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    changetime() {
      idx *= 10
      if (idx == 10000) idx = 1
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮,切换菜单的折叠和展开
    toggleCollpase() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    addDislogClosed() {
      this.$refs.addFormRef.resetFields() //重置表单
    },
    //格式化时间戳
    format(time_format) {
      var time = new Date(time_format)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return (
        y +
        '-' +
        add0(m) +
        '-' +
        add0(d) +
        ' ' +
        add0(h) +
        ':' +
        add0(mm) +
        ':' +
        add0(s)
      )
    },
    //闹钟和时间函数
    timefunc() {
      let icnow = new Date(Date.parse('2022/5/15 09:50') + 1000 * increment++)
      this.year = icnow.getFullYear()
      this.month = icnow.getMonth() + 1
      this.date = icnow.getDate()
      this.day = days[icnow.getDay()]
      this.time =
        this.year +
        '-' +
        this.add0(this.month) +
        '-' +
        this.add0(this.date) +
        ' ' +
        icnow.toTimeString().substring(0, 8)
      var array = this.$store.state.clock
      for (var i = 1; i < array.length; i++) {
        if (array[i].date === this.time) {
          //时间到
          this.$notify({
            title: '闹钟提醒',
            message: '现在该去' + array[i].name,
            type: 'warning',
            duration: 0,
          })
        }
        let now
        if (array[i].type == '1') continue
        if (array[i].type == '2') {
          now = new Date(Date.parse(icnow) + 86400000) //下一天
        } else if (array[i].type == '3') {
          now = new Date(Date.parse(icnow) + 604800000) //下一周
        }
        let nowTime =
          now.getFullYear() +
          '-' +
          this.add0(now.getMonth()) +
          '-' +
          this.add0(now.getDate()) +
          ' ' +
          now.toTimeString().substring(0, 8)
        var form = {
          name: array[i].name,
          date: nowTime,
          type: array[i].type,
        }
        this.$store.commit('setClock', form)
      }
      clearInterval(timeid)
      timeid = setInterval(this.timefunc, idx)
    },
  },
  computed: {
    noChildren() {
      return this.menuList.filter((item) => !item.children)
    },
    hasChildren() {
      return this.menuList.filter((item) => item.children)
    },
    // 当前时间
    newTime: function () {
      return (
        this.year +
        '年' +
        this.month +
        '月' +
        this.date +
        '日 星期' +
        this.day +
        ' ' +
        this.time
      )
    },
  },
  created() {
    timeid = setInterval(this.timefunc, this.idx)
  },

  beforeDestroy() {
    clearInterval(interval)
  },
}
</script>

<style lang="less" scoped>
.hwelcome {
  color: #fff;
  font-size: 15px;
  height: 25px;
  text-align: center;
  background: green;
  span {
    margin-left: 10px;
  }
}
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .el-button {
    margin-left: 30px;
    margin-top: 400px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding-right: 10px;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.footer {
  //position: fixed;
  bottom: 0;
  //width: 100%;
  //line-height: var(--footer-height);
  background: #0f1714;
  color: #fff;
}
</style>