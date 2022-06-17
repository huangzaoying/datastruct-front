<template>
  <div id="page">
    <el-row>
      <el-col :span="24"><Search /></el-col>
    </el-row>
    <MapContainer />
  </div>
</template>

<script>
import MapContainer from './MapContainer.vue'
import Search from './Search.vue'
export default {
  name: 'page1',
  components: {
    MapContainer,
    Search,
  },
}
</script>

<style lang="less" scoped>
#page {
  height: 80vh;
  width: 80vw;
}
</style>