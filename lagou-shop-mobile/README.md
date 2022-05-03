# Vue 3 + Vite

# 项目开发流程：
```
1. 利用vite创建项目: npm create vite@latest
2. 安装依赖：[vant3：npm i vant@next -S] + [vue-router：npm i vue-router@4] + [vuex: npm i vuex@next] + [sass： npm i sass -D]
3. 加入版本控制：git
4. 配置代码检测规范： 
* npm i eslint -S  |  npx eslint --init
* eslintrc.js修改eslint代码检测规范为vue3<<<--->>>plugin:vue/vue3-strongly-recommended 
* package,json配置eslint检测的文件<<<--->>>"lint": "eslint ./src/**/*.{js,vue} --fix"
* 针对新语法defineProps报错解决：nodefined解决方案--->>>Vue不需我们引入，简化了书写，所以eslintrc.js配置env中：'vue/setup-compiler-macros': true
5. 增加一些目录配置：router、views、vuex、api、components、compositionAPI、styles、utils...
6. 配置路由：
* vue-router4以前：采用VueRouter, 通过mode指定hash/history; vue-router4: 采用createRouter, 通过history指定createWebHash()/createWebHashHistory()，这两个方法需要被引入!!!
* 在main.js引入当前导出文件并注册Vue.use(router)
* vite中不存在@标识符，可以通过在vite.config.js中配置: resolve: { alias: [ { find: '@', replacement: resolve(__dirname, 'src') } ] }  ++  import { resolve } from 'path'
* 新版本Vue项目路径必须写全，文档有声明!
* 匹配错误页面：path: '/:pathMatch(.*)*'
7. rem移动端适配： amfe-flexible + postcss-pxtorem [ main.js引入flexible  ；  postcss.config.js配置插件的rootValue和propsList:['*'] ]
```
# 项目遇到的问题：
```
1. 初始请求数据时，由于不像Vue2一样在created钩子中获取数据，所以可能导致数据初始获取时出现问题，可以采用可选链操作符去判断当前数据是否存在：如--> const swipeData = computed(() => indexData.value.data?.swiperBg.default.imgList.list)

2. 制作商品列表时边框圆角设置不生效？
* <van-grid getter="15">设置后也不生效↓↓
* 要设置给内部真正需要设置圆角的元素
* 掌握道理：组件看似简单，但其内部有许多容易犯的错误，要多实践、掌握更多的经验才行！！
* 宫格默认居中，取消则<van-grid :center="fasle">
```