<template>
  <el-row class="search_container" :gutter="20">
    <el-col :span="6">
      <el-input
        placeholder="请输入起始地点"
        clearable
        v-model="inputText.origin"
      >
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-input
        placeholder="请输入目的地点"
        clearable
        v-model="inputText.destination"
      >
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-radio-group v-model="inputText.radio">
        <el-radio :label="1">步行</el-radio>
        <el-radio :label="2">交通工具</el-radio>
        <el-radio :label="0">混合</el-radio>
      </el-radio-group>
    </el-col>
    <el-col :span="6">
      <el-button icon="el-icon-search" circle @click="send()"></el-button>
      <el-button
        type="info"
        icon="el-icon-message"
        circle
        @click="dialogTableVisible = true"
      ></el-button>
    </el-col>
    <el-dialog title="对照表格" :visible.sync="dialogTableVisible" width="50%">
      <el-table :data="newPoint" label-width="120px">
        <el-table-column
          property="id"
          label="id"
          width="180"
          sortable
        ></el-table-column>
        <el-table-column
          property="name"
          label="地点"
          sortable
        ></el-table-column>
      </el-table>
    </el-dialog>
  </el-row>
</template>

<script>
import point from '../../assets/point.json'
import eventBus from '@/Bus/eventBus'
export default {
  data() {
    return {
      inputText: {
        radio: 1,
        origin: '',
        destination: '',
        path: [],
      },
      dialogTableVisible: false,
      point: [],
      newPoint: [],
    }
  },
  methods: {
    async send() {
      var fromID, toID
      for (var i = 0; i < this.newPoint.length; i++) {
        if (this.inputText.origin == this.newPoint[i].name)
          fromID = this.newPoint[i].id
        if (this.inputText.destination == this.newPoint[i].name)
          toID = this.newPoint[i].id
      }
      console.log(fromID, toID)
      const { data: res1 } = await this.$http.get(
        'travel/time?fromID=' +
          fromID +
          '&toID=' +
          toID +
          '&type=' +
          this.inputText.radio
      )
      const { data: res2 } = await this.$http.get(
        'travel/len?fromID=' +
          fromID +
          '&toID=' +
          toID +
          '&type=' +
          this.inputText.radio
      )
      var res = { res1, res2 }
      eventBus.$emit('shareuserInput', res)
    },
  },
  mounted() {
    this.point = JSON.parse(JSON.stringify(point))
    for (var i = 0; i < this.point.length; i++) {
      this.newPoint[i] = {
        name: this.point[i].name,
        id: i,
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>>