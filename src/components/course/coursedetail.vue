<template>
  <el-row :gutter="20" class="container">
    <el-col :span="6">
      <h4>课程信息</h4>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课程信息</span>
        </div>
        <div v-for="item in course" :key="item" class="text item">
          {{ item }}
        </div>
      </el-card>
      <h4>
        考试信息
        <el-button
          type="success"
          icon="el-icon-check"
          @click="addJudge"
          size="mini"
          circle
        ></el-button>
      </h4>
      <el-table
        :data="examdetail"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        border
      >
        <el-table-column prop="name" label="考试名称" width="90" sortable>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="90" sortable>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="90" sortable>
        </el-table-column>
        <el-table-column prop="dotName" label="考试地点" width="90" sortable>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="9">
      <h4>
        课程资料
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          size="mini"
          @click="addDialogVisible1 = true"
        ></el-button>
      </h4>
      <div width="10">
        <!-- 搜索与添加区域 -->
        <!-- 每一次clear都会调用getcourList，并且更新匹配参数query -->
        <el-input
          placeholder="输入文件名查找"
          clearable
          v-model="query"
          @clear="getAllFile"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchFile(query)"
          ></el-button>
        </el-input>
      </div>

      <el-table
        :data="fileData.fileList"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        border
      >
        <el-table-column prop="title" label="文件名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="content" label="文件内容" width="300" sortable>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.fileID, scope.row.title)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-upload
        class="upload-demo"
        action="http://localhost:8080/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-top: 20px"
          >点击上传</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件,且不超过500kb
        </div>
      </el-upload></el-col
    >
    <el-col :span="9">
      <h4>
        作业<el-button
          type="success"
          icon="el-icon-check"
          @click="addDialogVisible2 = true"
          size="mini"
          circle
        ></el-button>
      </h4>
      <el-table
        :data="workData.workList"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="title" label="作业名" width="140" sortable>
        </el-table-column>
        <el-table-column prop="content" label="作业内容" width="140" sortable>
        </el-table-column>
        <el-table-column prop="ddl" label="截止日期" width="180" sortable>
        </el-table-column>
        <el-table-column prop="state" label="是否完成" width="100" sortable>
          {{ state == 1 ? '完成' : '未完成' }}
        </el-table-column>
      </el-table>
      <el-upload
        class="upload-demo"
        action="http://localhost:8080/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-top: 20px"
          >点击上传</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件,且不超过500kb
        </div>
      </el-upload>
    </el-col>

    <!-- 添加考试对话框 -->
    <el-dialog
      title="添加考试"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDislogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form label-width="100px" ref="addFormRef" :model="addForm">
        <el-form-item label="考试名称" prop="name" required>
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="addForm.startTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="addForm.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="考试地点" prop="location" required>
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addexam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加资料对话框 -->
    <el-dialog
      title="添加资料"
      :visible.sync="addDialogVisible1"
      width="50%"
      @close="addDislogClosed1"
    >
      <!-- 内容主体区域 -->
      <el-form label-width="100px" ref="addFormRef1" :model="addForm1">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="addForm1.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" required>
          <el-input v-model="addForm1.content"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addFile">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查询结果如下"
      :visible.sync="dialogTableVisible"
      width="50%"
    >
      <el-table :data="file" label-width="100px">
        <el-table-column property="title" label="标题"></el-table-column>
        <el-table-column property="content" label="内容"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="修改资料内容"
      @close="aditClosed"
      :visible.sync="editDialogVisble"
      width="50%"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="新内容">
          <el-input type="textarea" v-model="editForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editfileInfo(editForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 添加作业对话框 -->
    <el-dialog
      title="添加作业"
      :visible.sync="addDialogVisible2"
      width="50%"
      @close="addDislogClosed2"
    >
      <!-- 内容主体区域 -->
      <el-form label-width="100px" ref="addFormRef2" :model="addForm2">
        <el-form-item label="作业名称" prop="title" required>
          <el-input v-model="addForm2.title"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="addForm2.ddl"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="作业内容" prop="location" required>
          <el-input v-model="addForm2.content"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="addwork">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      sort1: '',
      sort2: '',
      query: '',
      courseID: '',

      reverse: true,
      editDialogVisble: false,
      fileList: [],
      coursedetail: {
        courseID: null,
        name: null,
        dotID: null,
        date: null,
        teacher: null,
      },
      editForm: {
        content: '', //修改文件的内容
        fileID: '',
        courseID: '',
        title: '',
      },
      examdetail: [
        {
          dotID: '',
          dotName: '',
          endTime: '',
          name: '',
          startTime: '',
        },
      ],
      addDialogVisible: false,
      addDialogVisible1: false,
      addDialogVisible2: false,
      addForm: {
        dotID: '',
        dotName: '',
        endTime: '',
        name: '',
        startTime: '',
      },
      addForm1: {
        title: null,
        content: null,
      },
      addForm2: {
        content: '',
        ddl: '',
        title: '',
        state: '',
      },
      filedata: [
        {
          content: '',
          courseID: '',
          fileID: '',
          title: '',
        },
      ],
      //用于展示查询的结果
      file: [
        {
          content: null,
          courseID: null,
          fileID: null,
          title: null,
        },
      ],
      dialogTableVisible: false,
      // 控制用户对话框的显示和隐藏
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    addDislogClosed() {
      this.$refs.addFormRef.resetFields() //重置表单
    },
    addDislogClosed1() {
      this.$refs.addFormRef1.resetFields() //重置表单
    },
    addDislogClosed2() {
      this.$refs.addFormRef2.resetFields() //重置表单
    },
    aditClosed() {
      this.$refs.editFormRef.resetFields()
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
    //
    addexam() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        //可以发起添加考试请求
        const { data: res } = await this.$http.post(
          'exam/add?dotName=' +
            this.addForm.name +
            'endTime=' +
            this.addForm.endTime +
            'name' +
            this.addForm.name +
            'startTime=' +
            this.addForm.startTime
        )
        if (!res.success) {
          return this.$message.error('添加失败')
        }
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        //this.getAllexam()
        return this.$message.success('添加成功')
      })
    },
    //添加资料 完成
    addFile() {
      this.$refs.addFormRef1.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'file/add?content=' +
            this.addForm1.content +
            '&id=' +
            this.courseID +
            '&title=' +
            this.addForm1.title
        )
        if (!res.success) {
          return this.$message.error('添加失败')
        }
        this.addDialogVisible1 = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getAllFile()
        return this.$message.success('添加成功')
      })
    },
    addwork() {
      this.$refs.addFormRef2.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'work/add?content=' +
            this.addForm2.content +
            '&courseID=' +
            this.courseID +
            '&ddl=' +
            this.addForm2.ddl +
            '&state=0' +
            '&title=' +
            this.addForm2.title
        )
        if (!res.success) {
          return this.$message.error('添加失败')
        }
        this.addDialogVisible1 = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getAllFile()
        return this.$message.success('添加成功')
      })
    },
    //展示课程信息
    async getCourse() {
      const { data: res } = await this.$http.get(
        'course/find?id=' + this.courseID
      )
      if (!res.success) {
        return this.$message.error('查询课程数据失败~')
      }
      this.coursedetail = res.entity[0]
      console.log(this.coursedetail)
      return this.$message.success('查询课程数据成功~')
    },
    //完成 获取所有的资料
    async getAllFile() {
      await this.$http.get('file/defind').then(
        (response) => {
          var data = {
            val: response.data.entity,
            total: 0,
          }
          this.$store.commit('GET_file', data)
        },
        (error) => {
          console.log('请求失败', error.message)
        }
      )
    },
    async getAllWork() {
      await this.$http.get('work/findAll?sort=' + this.sort2).then(
        (response) => {
          var data = {
            val: response.data.entity,
            total: 0,
          }
          this.$store.commit('GET_work', data)
        },
        (error) => {
          console.log('请求失败', error.message)
        }
      )
    },
    async searchFile(query) {
      //按照title查找
      const { data: res } = await this.$http.get(
        'course/find?id=0' + '&title=' + query
      )
      if (res.entity.length) {
        for (var i = 0; i < res.entity.length; i++) {
          this.course[i] = res.entity[i]
        }
        this.dialogTableVisible = true
        return this.$message.success('查询成功!')
      }
      return this.$message.error('查询失败~')
    },
    async showEditDialog(id, title) {
      const { data: res } = await this.$http.get(
        'file/find?id=' + id + '&title=' + title
      )
      if (!res.success) {
        return this.$message.error('查询文件数据失败~')
      }
      this.editForm = res.entity[0]
      this.editDialogVisble = true
      return this.$message.success('查询文件数据成功~')
    },
    // 监听修改对话框的关闭事件
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editfileInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        console.log(this.editForm, '更改前')
        const { data: res } = await this.$http.post(
          'file/update?content=' +
            this.editForm.content +
            '&id=' +
            this.editForm.fileID
        )
        console.log(res.entity)
        if (!res.success) {
          this.$message.error('更新失败!')
        }
        this.editDialogVisble = false
        this.getAllFile()
        this.$message.success('更新成功!')
      })
    },
  },
  computed: {
    // 存放课程的数据和数量
    ...mapState(['fileData']),
    ...mapState(['workData']),
    course: {
      get() {
        var courseList = []
        courseList[0] = '课程名称：' + this.coursedetail.name
        courseList[1] = '上课时间：' + this.coursedetail.date
        courseList[2] = '上课地点：' + this.coursedetail.dotID
        courseList[3] = '上课教师：' + this.coursedetail.teacher
        return courseList
      },
    },
  },
  mounted() {
    this.courseID = this.$route.params.data //取得id
    this.getAllFile()
    this.getAllWork()
    this.getCourse()
  },
}
</script>
<style lang="less" scoped>
.container {
  background: rgb(135, 235, 173);
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  background: greenyellow;
}
</style>
