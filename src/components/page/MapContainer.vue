<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import userUrl from '../../assets/user.png'
import stUrl from '../../assets/start.png'
import edUrl from '../../assets/end.png'
import mdUrl from '../../assets/marker.png'
window._AMapSecurityConfig = {
  securityJsCode: '8aedfd4ddbb3d0fb0b17995938924bc7',
}
import eventBus from '@/Bus/eventBus'
export default {
  name: 'MapContainer',
  data() {
    return {
      timer: '',
      map: null,
      autoOptions: {
        input: '',
      },
      auto: null,
      pathSimplifierIns: '',
      nav: '',
      start: '',
      end: '',
      now: '',
      flag: false,
      timeid: '',
      lines: [
        {
          name: '最优路线',
          path: [],
        },
      ],
    }
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: 'a7e6c5b3ee88ad5b699bef8f8f9e960a', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        AMapUI: {
          //重点就是这个
          version: '1.1',
          plugins: ['misc/PathSimplifier', 'overlay/SimpleMarker'], //SimpleMarker设置自定义图标，PathSimplifier轨迹展示组件
        },
        plugins: [
          'AMap.ToolBar',
          'AMap.Scale',
          'AMap.HawkEye',
          'AMap.Geolocation',
          'AMap.AutoComplete',
        ],
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            viewMode: '3D',
            zoom: 15, //初始化地图级别
            center: [116.2841209, 40.15683511],
          })
          this.map.addControl(new AMap.Scale())
          this.map.addControl(new AMap.ToolBar())
          this.map.addControl(new AMap.HawkEye())
          this.map.addControl(new AMap.Geolocation())
          //this.auto = new AMap.AutoComplete(this.autoOptions)
          this.now = new AMap.Marker({
            position: [116.2841209, 40.15683511], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-15, -12), //相对于基点的偏移位置
            icon: new AMap.Icon({
              image: mdUrl,
            }),
          })
          this.map.add(this.now)
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap()
  },
  created() {
    //消息订阅 当对方发数据就触发
    eventBus.$on('shareuserInput', (val) => {
      console.log(val)
      for (var i = 0; i < val.entity.length; i++) {
        var temp1 = [val.entity[i].lng, val.entity[i].lat]
        this.lines[0].path[i] = temp1
      }
      this.$notify({
        title: '最优路径',
        message: val.message,
        duration: 0,
      })
      if (!this.flag) {
        //第一次请求路径
        this.now.remove() //把当前定位删除了需要修改为终点的定位
        this.flag = true
      }
      let that = this
      var my_map = this.map
      if (that.pathSimplifierIns) {
        //通过该方法清空上次传入的轨迹
        that.pathSimplifierIns.setData([])
        that.start.remove() //清空起点和终点
        that.end.remove()
      }
      AMapUI.loadUI(
        ['misc/PathSimplifier', 'overlay/SimpleMarker'],
        function (PathSimplifier, SimpleMarker) {
          //起点和终点
          that.end = new AMap.Marker({
            position: that.lines[0].path[that.lines[0].path.length - 1], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-15, -12), //相对于基点的偏移位置
            icon: new AMap.Icon({
              image: edUrl,
            }),
          })
          that.start = new AMap.Marker({
            position: that.lines[0].path[0], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-15, -12), //相对于基点的偏移位置
            icon: new AMap.Icon({
              image: stUrl,
            }),
          })
          // 将创建的点标记添加到已有的地图实例：
          that.map.add(that.start)
          that.map.add(that.end)

          //开始轨迹
          var emptyLineStyle = {
            lineWidth: 0,
            fillStyle: null,
            strokeStyle: null,
            borderStyle: null,
          }
          that.pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: my_map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              return pathData.path
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              return null
            },
            renderOptions: {
              pathLineStyle: emptyLineStyle, //将点、线相关的style全部置emptyLineStyle
              pathLineSelectedStyle: emptyLineStyle,
              pathLineHoverStyle: emptyLineStyle,
              keyPointStyle: emptyLineStyle,
              startPointStyle: emptyLineStyle,
              endPointStyle: emptyLineStyle,
              keyPointHoverStyle: emptyLineStyle,
              keyPointOnSelectedPathLineStyle: emptyLineStyle,
            },
          })
          that.pathSimplifierIns.setData(that.lines)
          //因为可能存在多条路径，所以循环设置
          that.lines.forEach((item, index) => {
            //创建巡航器 移动轨迹	index是重点
            that.navg = that.pathSimplifierIns.createPathNavigator(index, {
              loop: false,
              speed: 300,
              pathNavigatorStyle: {
                width: 50,
                height: 50,
                //使用图片
                content: PathSimplifier.Render.Canvas.getImageContent(
                  userUrl,
                  onload,
                  onerror
                ),
                strokeStyle: 'white',
                fillStyle: 'white',
                //经过路径的样式
                pathLinePassedStyle: {
                  lineWidth: 6,
                  strokeStyle: 'blue',
                  dirArrowStyle: {
                    stepSpace: 20,
                    strokeStyle: 'white',
                  },
                },
              },
            })
            that.navg.start()
            that.map.setCenter(
              that.lines[0].path[that.lines[0].path.length - 1] //设置中心点为终点
            )
          })
        }
      )
    })
  },
  beforeDestroy() {
    eventBus.$off('shareuserInput')
  },
  destroyed() {
    this.map.destroy()
    this.map = null
  },
}
</script>

<style  scoped>
#container {
  padding: 0px;
  margin: 10px;
  width: 100%;
  height: 100%;
}
</style>