<template>
  <div class="active">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课外活动</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>欢迎来到课外活动信息界面！</h3>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          class="right"
          placeholder="输入关键字搜索"
          clearable
          v-model="queryInfo.query"
          @clear="getactiveList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchBy(queryInfo.query)"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          class="button"
          type="primary"
          @click="addDialogVisible = true"
          >活动添加</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="activeData.activeList"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
      border
    >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="date" label="活动时间" sortable width="200px">
      </el-table-column>
      <el-table-column prop="name" label="课外活动名称" sortable width="300px">
      </el-table-column>
      <el-table-column prop="type" label="课外活动类型" sortable width="300px">
        {{ type == '0' ? '个人活动' : '集体活动' }}
      </el-table-column>
      <el-table-column align="right">
        <template v-slot="scope">
          <el-button size="mini" @click="ShowclockForm(scope.row.eventID)"
            >setClock</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row.eventID)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.eventID)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改活动"
      @close="aditClosed"
      :visible.sync="editDialogVisble"
      width="50%"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
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
        <el-form-item label="类型" required>
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editactiveInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="活动信息" :visible.sync="dialogTableVisible" width="50%">
      <el-table :data="active" label-width="100px">
        <el-table-column
          property="name"
          label="名称"
          width="200"
        ></el-table-column>
        <el-table-column
          property="date"
          label="时间"
          width="200"
        ></el-table-column>
        <el-table-column property="type" label="类型" width="200">
          {{ type == 1 ? '个人活动' : '集体活动' }}
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="添加闹钟"
      :visible.sync="TableVisible"
      width="50%"
      @close="DislogClosed"
    >
      <el-form label-width="100px" ref="clockFormRef" :model="clockForm">
        <el-form-item label="名称" required>
          <el-input v-model="clockForm.name"></el-input>
        </el-form-item>
        <el-form-item label="时间" required>
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="clockForm.date"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="clockForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TableVisible = false">取 消</el-button>
        <el-button type="primary" @click="setclock()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加活动"
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
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
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
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addactive">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      clockForm: {
        name: '',
        date: new Date(),
        type: '',
      },
      queryInfo: {
        // 搜索值
        query: '',
        //排序代码
        sort: 1,
      },
      active: [
        {
          eventID: '',
          name: '',
          date: '',
          type: '',
        },
      ],
      dialogTableVisible: false,
      TableVisible: false,
      addDialogVisible: false,
      // 添加课程数据的对象
      addForm: {
        date: '',
        name: '',
        type: '',
      },
      //验证规则
      addFormRules: {
        name: [
          {
            required: true,
            message: '活动名不能为空',
            trigger: 'blur',
          },
        ],
        location: [
          {
            required: true,
            message: '活动地址不能为空',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisble: false,
      editForm: {
        eventID: 0,
        date: '',
        name: '',
        type: '',
      },
      options: [
        {
          value: '1',
          label: '单次',
        },
        {
          value: '2',
          label: '每天',
        },
        {
          value: '3',
          label: '每周',
        },
      ],
      options1: [
        {
          value: '1',
          label: '个人活动',
        },
        {
          value: '0',
          label: '集体活动',
        },
      ],
      value1: '',
      //时间选择器
      value: '',
      startTime: '',
      endTime: '',
      search: '',
      add_name: '',
    }
  },
  //用于请求的钩子
  created() {
    this.getactiveList()
  },
  methods: {
    async handleEdit(id) {
      const { data: res } = await this.$http.get('event/find?id=' + id)
      if (!res.success) {
        return this.$message.error('查询课程数据失败~')
      }
      console.log(res)
      this.editForm = res.entity[0]
      this.editDialogVisble = true
    },
    //删除已完成
    async handleDelete(Id) {
      const confirmRusult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '永久删除该活动',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmRusult)
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      this.$http.delete('event/delete', { params: { id: Id } }).then((res) => {
        const { data: response } = res
        console.log(response)
        if (!response.success) {
          return this.$message.error('活动删除失败')
        }
        this.$message.success('活动已经删除')
        //去更新数据
        this.getactiveList()
      })
    },
    //添加活动 已完成
    async addactive() {
      console.log(this.addForm)
      const { data: res } = await this.$http.post(
        'event/add?date=' +
          this.addForm.date +
          '&name=' +
          this.addForm.name +
          '&type=' +
          this.addForm.type
      )
      this.addDialogVisible = false
      console.log(res)
      if (!res.success) {
        return this.$message.error('添加失败')
      }
      this.getactiveList()
      return this.$message.success('添加成功')
    },
    //获取数据
    async getactiveList() {
      this.$http.get('event/findAll').then(
        (response) => {
          console.log(response)
          this.$store.commit('GET_active', response.data.entity)
          console.log(response.data.entity)
        },
        (error) => {
          console.log('请求失败', error.message)
        }
      )
    },
    // 监听修改对话框的关闭事件
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    DislogClosed() {
      this.$refs.clockFormRef.resetFields()
    },
    //
    editactiveInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        // 发起修改课程信息的数据请求 根据接口
        const { data: res } = await this.$http.put(
          'event/update?date=' +
            this.editForm.date +
            '&id=' +
            this.editForm.eventID +
            '&name=' +
            this.editForm.name +
            '&type=' +
            this.editForm.type
        )
        console.log(res)
        if (!res.success) {
          this.$message.error('更新失败!')
        }
        this.editDialogVisble = false
        this.getactiveList()
        this.$message.success('更新成功!')
      })
    },
    //查询功能完成
    async searchBy(query) {
      const { data: res } = await this.$http.get('event/find?name=' + query)
      if (res.entity.length) {
        //name查到了
        this.active = []
        for (var i = 0; i < res.entity.length; i++) {
          this.active[i] = res.entity[i]
        }
        this.dialogTableVisible = true
        return this.$message.success('查询成功!')
      } else {
        var type = 0
        if (query == '个人活动') {
          type = 1
        } else if (query == '集体活动') {
          type = 0
        }
        const { data: res } = await this.$http.get('event/find?type=' + type) //按照类型查询
        if (res.entity.length) {
          //teacher查到
          this.active = []
          for (var i = 0; i < res.entity.length; i++) {
            this.active[i] = res.entity[i]
          }
          this.dialogTableVisible = true
          return this.$message.success('查询成功!')
        }
      }
      return this.$message.error('查询失败~')
    },
    //闹钟设置函数
    setclock() {
      this.TableVisible = false
      console.log(this.clockForm)
      this.$store.commit('setClock', this.clockForm)
    },
    async ShowclockForm(id) {
      this.TableVisible = true
      console.log(id)
      const { data: res } = await this.$http.get('event/find?id=' + id)
      if (!res.success) {
        return
      }
      this.clockForm.name = res.entity[0].name
      this.clockForm.date = res.entity[0].date
      console.log(this.clockForm)
    },
    addDislogClosed() {
      this.$refs.addFormRef.resetFields() //重置表单
    },
  },
  computed: {
    // 存放活动的数据和数量
    ...mapState(['activeData']),
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.button {
  position: absolute;
  right: 20px;
  width: 150px;
  // padding: 5px;
}
</style>