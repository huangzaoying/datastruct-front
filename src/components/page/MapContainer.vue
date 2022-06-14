<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  securityJsCode: '8aedfd4ddbb3d0fb0b17995938924bc7',
}
import eventBus from '@/Bus/eventBus'
export default {
  name: 'MapContainer',
  data() {
    return {
      map: null,
      autoOptions: {
        input: '',
      },
      auto: null,
    }
  },
  methods: {
    initPage(PathSimplifier) {
      //创建组件实例
      var pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        map: map, //所属的地图实例
        getPath: function (pathData, pathIndex) {
          //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
          return pathData.path
        },
        getHoverTitle: function (pathData, pathIndex, pointIndex) {
          //返回鼠标悬停时显示的信息
          if (pointIndex >= 0) {
            //鼠标悬停在某个轨迹节点上
            return (
              pathData.name + '，点:' + pointIndex + '/' + pathData.path.length
            )
          }
          //鼠标悬停在节点之间的连线上
          return pathData.name + '，点数量' + pathData.path.length
        },
        renderOptions: {
          //轨迹线的样式
          pathLineStyle: {
            strokeStyle: 'red',
            lineWidth: 6,
            dirArrowStyle: true,
          },
        },
      })
    },
    initMap() {
      AMapLoader.load({
        key: 'a7e6c5b3ee88ad5b699bef8f8f9e960a', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        uiVersion: '1.0.11', // 版本号,
        plugins: [
          'AMap.ToolBar',
          'AMap.Scale',
          'AMap.HawkEye',
          'AMap.MapType',
          'AMap.Geolocation',
          'AMap.AutoComplete',
        ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            //设置地图容器id
            viewMode: '3D', //是否为3D地图模式
            zoom: 16, //初始化地图级别
            center: [105.681694, 26.231119], //初始化地图中心点位置
          })
          this.map.addControl(new AMap.Scale())
          this.map.addControl(new AMap.ToolBar())
          this.map.addControl(new AMap.HawkEye())
          // this.map.addControl(new AMap.MapType())
          this.map.addControl(new AMap.Geolocation())
          this.auto = new AMap.AutoComplete(this.autoOptions)
          var path = [
            new AMap.LngLat(105.669335, 26.265606),
            new AMap.LngLat(105.657662, 26.242821),
            new AMap.LngLat(105.681694, 26.231119),
            new AMap.LngLat(105.737313, 26.274226),
          ]
          // 创建一个 Marker 实例：
          let img = require('../../assets/end.png')
          var marker = new AMap.Marker({
            position: new AMap.LngLat(105.737313, 26.274226), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-15, -12), //相对于基点的偏移位置
            icon: new AMap.Icon({
              image: img,
            }),
            title: '终点',
          })
          img = require('../../assets/start.png')
          var marker1 = new AMap.Marker({
            position: new AMap.LngLat(105.669335, 26.265606), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-15, -12), //相对于基点的偏移位置
            icon: new AMap.Icon({
              image: img,
            }),
            title: '起点',
          })
          // 将创建的点标记添加到已有的地图实例：
          this.map.add(marker)
          this.map.add(marker1)
          // // 创建折线实例
          // var polyline = new AMap.Polyline({
          //   path: path,
          //   borderWeight: 10, // 线条宽度，默认为 1
          //   strokeColor: 'blue', // 线条颜色
          //   lineJoin: 'round', // 折线拐点连接处样式
          // })
          // // 将折线添加至地图实例
          // this.map.add(polyline)
          //加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
          AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
            if (!PathSimplifier.supportCanvas) {
              alert('当前环境不支持 Canvas！')
              return
            }

            //启动页面
            this.initPage(PathSimplifier)
            //这里构建两条简单的轨迹，仅作示例
            pathSimplifierIns.setData([
              {
                name: '轨迹0',
                path: [
                  [105.669335, 26.265606],
                  [105.657662, 26.242821],
                  [105.681694, 26.231119],
                  [105.737313, 26.274226],
                ],
              },
              {
                name: '大地线',
                //创建一条包括500个插值点的大地线
                path: PathSimplifier.getGeodesicPath(
                  [116.405289, 39.904987],
                  [87.61792, 43.793308],
                  500
                ),
              },
            ])

            //创建一个巡航器
            var navg0 = pathSimplifierIns.createPathNavigator(
              0, //关联第1条轨迹
              {
                loop: true, //循环播放
                speed: 1000000,
              }
            )

            navg0.start()
          })
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
    eventBus.$on('shareuserInput', (val) => {
      this.autoOptions.input = val.inputId
    })
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