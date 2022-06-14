<template>
  <div id="search_container">
    <el-input
      placeholder="请输入查找的关键词"
      clearable
      v-model="inputText.userInput"
      :id="inputText.inputId"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="send()"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
import eventBus from '@/Bus/eventBus'
export default {
  data() {
    return {
      inputText: {
        userInput: '',
        inputId: 'searchInput',
        path: [
          [116.478935, 39.997761],
          [116.478939, 39.997825],
          [116.478912, 39.998549],
          [116.478912, 39.998549],
          [116.478998, 39.998555],
          [116.478998, 39.998555],
          [116.479282, 39.99856],
          [116.479658, 39.998528],
          [116.480151, 39.998453],
          [116.480784, 39.998302],
          [116.480784, 39.998302],
          [116.481149, 39.998184],
          [116.481573, 39.997997],
          [116.481863, 39.997846],
          [116.482072, 39.997718],
          [116.482362, 39.997718],
          [116.483633, 39.998935],
          [116.48367, 39.998968],
          [116.484648, 39.999861],
        ],
      },
      control: null,
    }
  },
  methods: {
    send() {
      //利用输入框内容，返回了路线数组，再弹出对话框选择哪条路线
      eventBus.$emit('shareuserInput', this.inputText)
    },
  },
  mounted() {
    //this.send()
  },
}
</script>

<style lang="less" scoped>
#search_container {
  height: 100%;
  width: 100%;
}
</style>>