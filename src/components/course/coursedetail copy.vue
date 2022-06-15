<template>
  <div class="grid-container">
    <div class="item1">
      <h3>资料</h3>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <!-- <input type="file" required="required" multiple><el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button></input> -->
      <!--  把href中的路径改成要下载的文件路径-->
      <button type="button" id="btn" class="btn btn-default">
        <a href="C:Users/Administrator/Desktop/文件.docx" download="下载"></a
        >下载
      </button>
    </div>

    <div class="item2">
      <h3>当前进度</h3>
      <el-progress
        :text-inside="true"
        :stroke-width="30"
        :percentage="50"
        color="skyblue"
        status="exception"
      ></el-progress>
    </div>
    <div class="item3">
      <h3>作业</h3>
      <el-dropdown>
        <el-button type="primary">
          详情<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="width: 50%">
          <el-dropdown-item>已交</el-dropdown-item>
          <el-dropdown-item>作业1</el-dropdown-item>
          <el-dropdown-item divided>待交</el-dropdown-item>
          <el-dropdown-item>作业2</el-dropdown-item>
          <el-dropdown-item>作业3</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="item4">
      <h3>考试</h3>
      <el-dropdown>
        <el-button type="primary">
          详情<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="width: 50%">
          <el-dropdown-item>期中考试</el-dropdown-item>
          <el-dropdown-item>考试时间</el-dropdown-item>
          <el-dropdown-item>考试地点</el-dropdown-item>
          <el-dropdown-item divided>期末考试</el-dropdown-item>
          <el-dropdown-item>考试时间</el-dropdown-item>
          <el-dropdown-item>考试地点</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="item5">上课时间</div>
    <div class="item6">上课地点</div>
    <div class="item7">课程群</div>
  </div>
</template>

<script>
import courseVue from './course.vue'
export default {
  name: 'coursedetail',
  data() {
    return {
      //课程详细信息
      id: this.$route.data.id,
      course: {},
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
    }
  },
  methods: {
    async getcourseByid() {
      const { data: res } = await this.$http.get('course/findById', {
        params: this.id,
      })
      this.course = res.course
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
  },
}
</script>

<style type="text/css" scoped>
/* 栅格布局 */
.item1 {
  grid-area: files;
}
.item2 {
  grid-area: process;
}
.item3 {
  grid-area: homework;
}
.item4 {
  grid-area: exams;
}
.item5 {
  grid-area: course_time;
}
.item6 {
  grid-area: classroom;
}
.item7 {
  grid-area: course_group;
}
/* 栅格布局的基本样式 */
.grid-container {
  display: grid;
  padding: 6px;
  height: 100%;
  grid-template-areas:
    'files process homework exams'
    'files course_time course_time exams'
    'files classroom classroom exams'
    'files course_group course_group exams';
  grid-template-columns: 1fr 3fr 1fr 1fr;
  grid-template-rows: 25% 25% 25% 25%;
  grid-gap: 2px;
  background-color: rgb(87, 125, 250);
}

.grid-container > div {
  text-align: center;
  padding: 10px;
  background-color: rgb(254, 201, 209);
}
/* 资料部分的样式 */
.grid-container > div > input {
  height: 40px;
  width: 100%;
  color: rgb(132, 45, 14);
}

.grid-container > div > button {
  height: 40px;
  width: 100%;
  color: rgb(132, 45, 14);
  background-color: rgb(183, 197, 253);
}
/* 当前进度的样式 */
.g-container {
  width: 240px;
  height: 25px;
  border-radius: 25px;
  background: rgb(235, 235, 246);
}

.g-progress {
  width: 30%;
  height: inherit;
  border-radius: 25px 0 0 25px;
  background: linear-gradient(90deg, rgb(117, 241, 117), rgb(103, 237, 237));
}
/* 作业和考试部分的样式 */
/* .grid-container > div > select {
            height: 50px;
            width: 100%;
            color: rgb(29, 78, 167);
            background-color: rgb(183, 197, 253);
        } */

.el-dropdown-link {
  cursor: pointer;
  color: #1c88f4;
}
.el-icon-arrow-down {
  font-size: 12px;
  width: 100%;
}
</style>