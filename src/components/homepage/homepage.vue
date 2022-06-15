<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/login.png" />
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="accsee">老师管理员</p>
          </div>
        </div>
        <div class="logininfo">
          <p>上次登录时间：<span>2022-3-28</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>
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
    </el-col>
    <el-col style="margin-top: 20px" :span="16">
      <div class="class-table">
        <div class="table-wrapper">
          <div class="tabel-container">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th
                    v-for="(weekNum, weekIndex) in classTableData.courses
                      .length"
                    :key="weekIndex"
                  >
                    {{ '周' + digital2Chinese(weekIndex, 'week') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(lesson, lessonIndex) in classTableData.lessons"
                  :key="lessonIndex"
                >
                  <td>
                    <p>{{ '第' + digital2Chinese(lessonIndex + 1) + '节' }}</p>
                    <p class="period">{{ lesson }}</p>
                  </td>
                  <td
                    v-for="(course, courseIndex) in classTableData.courses"
                    :key="courseIndex"
                  >
                    {{
                      classTableData.courses[courseIndex][lessonIndex] || '-'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
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
      classTableData: {
        lessons: [
          '08:00-08:45',
          '08:50-9:35',
          '09:50-10:35',
          '10:40-11:25',
          '11:30-12:15',
          '13:00-13:45',
          '13:50-14:35',
          '14:45-15:30',
          '15:40-16:25',
          '16:25-17:20',
          '17:25-18:10',
          '18:15-18:50',
          '19:20-20:05',
          '20:10-20:55',
        ],
        courses: [
          ['', '', '', '', '', '', '', ''],
          ['计网', '计网', '计组', '计组', '计组'],
          ['形式语言与自动机', '形式语言与自动机', '', '', '', '毛概', '毛概'],
          [''],
          [
            '计网',
            '计网',
            '数据结构课设',
            '数据结构课设',
            '',
            '毛概',
            '毛概',
            '排球',
            '排球',
          ],
          ['', '', 'C++', 'C++', 'C++'],
          [''],
        ],
      },
    }
  },
  methods: {
    /**
     * 数字转中文
     * @param {Number} num 需要转换的数字
     * @param {String} identifier 标识符
     * @returns {String} 转换后的中文
     */
    digital2Chinese(num, identifier) {
      const character = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二',
        '十三',
        '十四',
      ]
      return identifier === 'week' && (num === 0 || num === 7)
        ? '日'
        : character[num]
    },
  },
  mounted() {},
}
</script>
<style lang="scss" scoped>
.class-table {
  .table-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tabel-container {
    margin: 7px;

    table {
      table-layout: fixed;
      width: 100%;

      thead {
        background-color: #67a1ff;
        th {
          color: #fff;
          line-height: 17px;
          font-weight: normal;
        }
      }
      tbody {
        background-color: #eaf2ff;
        td {
          color: #677998;
          line-height: 12px;
        }
      }
      th,
      td {
        width: 60px;
        padding: 12px 2px;
        font-size: 12px;
        text-align: center;
      }

      tr td:first-child {
        color: #333;
        .period {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
