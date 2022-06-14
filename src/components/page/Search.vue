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
      },
    }
  },
  methods: {
    send() {
      eventBus.$emit('shareuserInput', this.inputText)
    },
  },
  mounted() {
    this.send()
  },
}
</script>

<style lang="less" scoped>
#search_container {
  height: 100%;
  width: 100%;
}
</style>>