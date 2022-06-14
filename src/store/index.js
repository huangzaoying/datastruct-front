import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);
//该文件用于创建store
//actions 用于响应组件中的动作
const actions =  {

}
 
//mutations 用于操作数据state
const mutations =  {
    //修改courseData
    GET_course(state,data){
      for(let i=0; i < data.pageSize; i++){
         state.courseData.courseList[i]=data.value[i]
      }
      state.courseData.total = data.total     
      state.courseData.courseList.splice(state.courseData.total,1000000-state.courseData.total+1);
      //state.courseData.courseList = state.courseData.courseList.slice((data.pageNum-1)*data.pageSize, data.pageNum*data.pageSize)
    },
    //修改activeData
    GET_active(state,value){
      for(let i=0; i < value.length; i++){
         state.activeData.activeList[i]=value[i]
      }
      state.activeData.total = value.length     
      state.activeData.activeList.splice(state.activeData.total,1000000-state.activeData.total+1);
    },
    setClock(state,value)
    {     
        state.clock.push({
          name:value.name,
          date:value.date,
          type:value.type,
        })
      }
}

//state 用于存放数据
const state =  {
    // 存放课程的数据和数量
    courseData: {
        courseList: new Array(1000000),
        total: 0
      },
    activeData:{
        activeList:new Array(1000000),
        total :0
    },
    clock:[
      {
        name:'',
        date:'',
        type:''
      }
    ]
}
//getters 用于加工state中的数据  类似计算属性
const getters = {
    data1(state){

    }
}
//创建store
const store = new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})

export default store