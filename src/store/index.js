import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);
//该文件用于创建store
//mutations 用于操作数据state
const mutations =  {
    //修改courseData
    GET_course(state,data){
      for(let i=0; i < data.pageSize; i++){
         state.courseData.courseList[i]=data.value[i]
      }
      state.courseData.total = data.total     
      state.courseData.courseList.splice(state.courseData.total,1000000-state.courseData.total+1);     
    },
    //修改activeData
    GET_active(state,value){
      for(let i=0; i < value.length; i++){
         state.activeData.activeList[i]=value[i]
      }
      state.activeData.total = value.length     
      state.activeData.activeList.splice(state.activeData.total,1000000-state.activeData.total+1);
    },
    GET_file(state,value){      
      for(let i=0; i < value.val.length; i++){
         state.fileData.fileList[i]=value.val[i]
      }
      state.fileData.total = value.val.length     
      state.fileData.fileList.splice(state.fileData.total,1000000-state.fileData.total+1);   
    },
    GET_work(state,value){
      
      for(let i=0; i < value.val.length; i++){
         state.workData.workList[i]=value.val[i]
      }
      state.workData.total = value.val.length     
      state.workData.workList.splice(state.workData.total,1000000-state.workData.total);
      console.log(state.workData)
    },
    setClock(state,value)
    {     
        state.clock.push({
          name:value.name,
          date:value.date,
          type:value.type,
        })
    },
    setUser(state,value){      
      state.user = value
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
    fileData:{
      total: 0 ,
      fileList:new Array(1000000)
    },
    workData:{
      total:0,
      workList:new Array(1000000)
    },
    clock:[
      {
        name:'',
        date:'',
        type:''
      }
    ],
    user:{
      userID: '',
      userName: '',
      password: '',
      type: ''
    }
}
//创建store
const store = new Vuex.Store({
    state,    
    mutations,
})

export default store