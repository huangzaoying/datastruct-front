<template>
  <div class="course">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <!-- 每一次clear都会调用getcourList，并且更新匹配参数query -->
          <el-input
            placeholder="输入关键字搜索(名称或教师)"
            clearable
            v-model="queryInfo.query"
            @clear="getcourseList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search(queryInfo.query)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-radio v-model="radio" label="2">按老师查找</el-radio>
          <el-radio v-model="radio" label="1">按名称查找</el-radio>
        </el-col>
        <el-col :span="4">
          <!-- 添加课程区域 -->
          <el-button type="primary" @click="addJudge">课程添加</el-button>
        </el-col>
        <!--排序下拉框-->
        <el-col :span="4">
          <el-select
            v-model="value"
            filterable
            placeholder="请选择排序方式"
            :clearable="true"
            style="right"
            @change="sort($event)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 课程列表 -->
      <el-table :data="courseData.courseList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column
          prop="date"
          label="上课时间"
          width="400px"
        ></el-table-column>
        <el-table-column prop="location" label="上课地点"></el-table-column>
        <el-table-column
          prop="teacher"
          label="课程老师"
          sortable
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.courseID)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removecourseById(scope.row.courseID)"
            ></el-button>
            <!-- 详情按钮 -->
            <el-button
              type="info"
              icon="el-icon-message"
              size="mini"
              @click="detail(scope.row.courseID)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        @size-change="handleSizeChange"
        :page-size="queryInfo.pageSize"
        :page-sizes="[5, 9, 13, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="courseData.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加课程对话框 -->
    <el-dialog
      title="添加课程"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDislogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        label-width="100px"
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上课时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="addForm.date"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="上课地点" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="课程老师" prop="teacher">
          <el-input v-model="addForm.teacher"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcourse">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改课程"
      @close="aditClosed"
      :visible.sync="editDialogVisble"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上课时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="editForm.date"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="上课地点" prop="locationID">
          <el-input v-model="editForm.location"></el-input>
        </el-form-item>
        <el-form-item label="课程老师" prop="teacher">
          <el-input v-model="editForm.teacher"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editcourseInfo(editForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="查询结果如下"
      :visible.sync="dialogTableVisible"
      width="50%"
    >
      <el-table :data="course" label-width="100px">
        <el-table-column property="name" label="课程名称"></el-table-column>
        <el-table-column
          property="date"
          label="时间"
          width="300"
        ></el-table-column>
        <el-table-column property="location" label="上课地点"></el-table-column>
        <el-table-column property="teacher" label="教师"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//用于生成计算属性  最好用数组写法
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'homepage',
  data() {
    return {
      radio: '1',
      // 获取课程列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 5,
        //排序  1按时间 2按name  0 不排序
        sort: 0,
      },
      //用于展示查询的结果
      course: [
        {
          courseID: null,
          name: null,
          dotID: null,
          date: null,
          teacher: null,
        },
      ],
      dialogTableVisible: false,
      // 控制用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加课程数据的对象
      addForm: {
        courseID: 0,
        date: '',
        locationID: 0,
        location: '',
        name: '',
        teacher: '',
      },
      //验证规则
      addFormRules: {
        name: [
          {
            required: true,
            message: '课程名不能为空',
            trigger: 'blur',
          },
        ],
        location: [
          {
            required: true,
            message: '课程地址不能为空',
            trigger: 'blur',
          },
        ],
        teacher: [
          {
            required: true,
            message: '老师姓名不能为空',
            trigger: 'blur',
          },
        ],
      },
      // 修改课程消息对话框显示和隐藏
      editDialogVisble: false,
      // 保存已经选中的角色id值
      selectRoleId: '',
      // 编辑用户的对象
      editForm: {
        courseID: null,
        name: null,
        dotID: null,
        date: null,
        teacher: null,
      },
      //排序的选择项目
      options: [
        {
          value: '1',
          label: '时间',
        },
        {
          value: '2',
          label: '名称',
        },
      ],
      value: '',
    }
  },
  //用于请求的钩子
  created() {
    this.getcourseList()
  },
  methods: {
    //获取数据
    async getcourseList() {
      await this.$http
        .get(
          'course/findAll?pageNum=' +
            this.queryInfo.pageNum +
            '&pageSize=' +
            this.queryInfo.pageSize +
            '&sort=' +
            this.queryInfo.sort
        )
        .then(
          (response) => {
            var data = {
              value: response.data.entity.list,
              total: response.data.entity.total,
              ...this.queryInfo,
            }
            this.$store.commit('GET_course', data)
          },
          (error) => {
            console.log('请求失败', error.message)
          }
        )
    },
    // 监听 pagesize 改变事件 每页显示的个数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getcourseList() //这里要重新获取数据请求
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getcourseList() //这里要重新获取数据请求
    },
    // 监听添加课程的对话框关闭事件
    addDislogClosed() {
      this.$refs.addFormRef.resetFields() //重置表单
    },
    // 点击按钮,添加新课程
    addcourse() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'course/add?date=' +
            this.addForm.date +
            '&dotID=' +
            this.addForm.locationID +
            '&name=' +
            this.addForm.name +
            '&teacher=' +
            this.addForm.teacher
        )
        if (!res.success) {
          return this.$message.error('添加失败')
        }
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getcourseList()
        return this.$message.success('添加成功')
      })
    },
    // 展示编辑用于的对话框 通过id
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('course/find?id=' + id)
      if (!res.success) {
        return this.$message.error('查询课程数据失败~')
      }
      this.editForm = res.entity[0]
      const token = window.sessionStorage.getItem('token')
      if (token == 0) {
        this.editDialogVisble = false
        this.$message.error('暂无权限')
      } else if (token == 1) {
        this.editDialogVisble = true
      }
    },
    // 监听修改对话框的关闭事件
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //预校验
    editcourseInfo(editForm) {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put(
          'course/update?date=' +
            editForm.date +
            '&dotID=' +
            editForm.locationID +
            '&id=' +
            editForm.courseID +
            '&name=' +
            editForm.name +
            '&teacher=' +
            editForm.teacher
        )
        if (!res.success) {
          this.$message.error('更新失败!')
        }
        this.editDialogVisble = false
        this.getcourseList()
        this.$message.success('更新成功!')
      })
    },
    // 根据id删除对应的课程信息  已完成
    async removecourseById(Id) {
      // 询问用户是否删除用户
      const confirmRusult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '永久删除该课程',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //如果确定删除，则返回值为字符串 confirm
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      this.$http.delete('course/delete', { params: { id: Id } }).then((res) => {
        const { data: response } = res
        console.log(response)
        if (!response.success) {
          return this.$message.error('该课程删除失败')
        }
        this.$message.success('该课程已经删除')
        //更新数据
        this.getcourseList()
      })
    },
    //排序请求函数  存在页面问题
    async sort(value) {
      this.queryInfo.sort = value
      await this.$http
        .get(
          'course/findAll?pageNum=' +
            this.queryInfo.pageNum +
            '&pageSize=' +
            this.queryInfo.pageSize +
            '&sort=' +
            this.queryInfo.sort
        )
        .then(
          (response) => {
            var data = {
              value: response.data.entity.list,
              total: response.data.entity.total,
              ...this.queryInfo,
            }
            this.$store.commit('GET_course', data)
          },
          (error) => {
            console.log('请求失败', error.message)
          }
        )
    },
    detail(id) {
      //course detail 根据id进行跳转
      this.$router.push({ name: 'coursedetail', params: { data: id } })
    },
    //查询功能完成
    async search(query) {
      var response
      console.log(query)
      if (this.radio == '1') {
        const { data: res } = await this.$http.get('course/find?name=' + query)
        response = res
      } else if (this.radio == '2') {
        const { data: res } = await this.$http.get(
          'course/find?teacher=' + query
        )
        response = res
      }
      if (response.entity.length) {
        for (var i = 0; i < response.entity.length; i++) {
          this.course[i] = response.entity[i]
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
  computed: {
    // 存放课程的数据和数量
    ...mapState(['courseData']),
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-card {
  .el-select {
    position: absolute;
    right: 0px;
    width: 300px;
    padding: 5px;
  }
}
</style>