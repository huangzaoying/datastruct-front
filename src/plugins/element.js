import Vue from 'vue'
import Element from 'element-ui'
import { MessageBox } from 'element-ui';
// 引入弹框提示组件 Message 需要全局引用 使用 Vue.prototype
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui';
Vue.use(Element)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm