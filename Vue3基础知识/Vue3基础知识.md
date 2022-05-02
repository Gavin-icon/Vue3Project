### Vue3基础知识
```
1.Vue3的一些改动：
* Vue3代打检测规范：volar | Vue2代码检测规范：vuter
* Vue3采用compositionAPI，组合式API
* Vue3可以利用新的开发工具Vue devtools Beta版本
* Vue3可以采用新的构建工具，vite，通过npm cretae/init vite@latest构建；效率更高!
* eslint安装并初始化：npm i eslint -D [不要最新版本]; npx eslint --init 进行初始化eslint; 对于eslintrc.js的配置中：extends选项设置使用的规范Vue3/Vue2 --> plugin:vue/vue3-recommended | plugin:vue/recommended
* eslint在package.json中配置哪些文件被自动修复：eslint ./src/**/*.{js,vue}
* eslint无法检测到vue中编译时的函数，如defineProps等，可以配置eslintrc.js： env：{ 'vue/setup-compiler-macros': true }

``` 

```
2.Vue3的setup用法:
* ---script 下 export default {} 中书写:
* setup函数，书写方式同data/methods，内部书写JavaScript代码，最后需要导出才能被外部使用!
* setup函数内部不能调用Vue的其他数据，因为setup函数执行时间早于beforeCreate函数!
* 本身setup函数内部声明的数据并不是响应式数据，不可被修改，只可被访问!
* data()或setup()，二选一!

* ---使用setup语法糖：<script setup></script> 简化书写，无需导出等操作!
```

```
3.响应式API：
①ref函数的使用：
* 使用vue引入: import { ref } from vue  |  import { ref } from '@vue/reactivity'
* 使用: ref函数去包裹要变成响应式数据的数据
* 修改：变为响应式数据后，如果需要通过函数更改数据，则需要对数据.value处理获取数据，因为这是JavaScript编程，其他地方不需处理是因为vue帮助处理了!

②reactive函数的使用：
* 由于Vue3响应式原理是依靠proxy进行设置的，故而传入的应该是对象
* reactive函数变为响应式数据以后访问时不需要.value处理

③无论是ref函数还是reactive函数，底层都和proxy相关，ref函数只不过书写简单了，底层会将ref函数的数据再次放入proxy中，设置属性为value，属性值为传入的数据;而reactive函数的底层就是proxy；

④reactive的相关方法：
(1)shallowReactive：
* reactive是深响应式，而shallowReactive是浅响应式，无法对二级对象处理[即二级对象不是响应式数据];
* 使用上和reactive一致，传递一个对象;
(2)readonly:
* 深度只读，无法修改，使用上和reactive一样，传递一个对象!
(3)shallowReadonly:
* 浅度只读，深层数据可被修改，但由于其不是响应式数据，试图不会更新!

⑤检测方法：true / false
(1)isReactive()
(2)isReadonly()
(3)isShallowReadonly()
(4)isProxy

⑥toRefs：
* toRefs用于将响应式对象转换为普通对象，且属性均为ref类型;
* 用途：既想要响应式数据，又想要解构操作！！！--->解决解构导致响应式丢失的问题
* 例子： let { count } = toRefs(dataList)

⑦toRef:
* 用于将响应式对象的指定属性转换为ref类型
* 例子： let count = toRef(dataList, 'count')

⑧computed函数：
* 减少视图中的复杂逻辑
* 计算属性具有缓存性，减少重复的计算操作
* 计算属性取得的结果是ref类型，需要加.value
* 代码：
const count = computed(() => {
  // 默认get
  console.log('执行了计算属性')
  return `物品的个数为:${num.value}`
})
const count = computed({
  get: () => {
    console.log('执行了计算属性')
    return `物品的个数为:${num.value}`
  },
  set: (newValue) => {
    console.log(`被修改了',${newValue}`)
  }
})

⑨watch函数:
* 侦听器用于侦听数据变化并执行相应代码
* 侦听的是源，不可以是数据
* 第三个参数设置深度监听[效率低，基本不设置]，{ deep: true } ; 还可以设置立即执行 { immediate: true } ; 还可以设置{ flush: 'post' | 'sync'  }--post用于操作DOM结构使用--sync用于数据变更一次执行一次[Vue默认合并，多个数据同时变化只会执行一次watch]
* 第一种传参方式：参数一{ 侦听的是单个源直接写 | 否则用箭头函数形式写 } 参数二{回调函数，执行哪些操作}
  watch(
    () => dataList.count,
    (newValue, oldValue) => {
      console.log('变化了')
    }
  )
  ----------------------------------
  watch(
    dataList,
    (newValue, oldValue) => {
      console.log('变化了')
    }
  )

* 第二种传参方式：ref类型的响应式数据直接写
const num = ref(0)
watch(
  num,
  (newValue,oldValue) => {
    console.log('数据变化')
  }
)

* 若要侦听多个源，则参数1采用数组形式，对于内部数据[ref类型直接写，reactive类型若是单个源直接写，否则()=>形式书写] watch([()=> data.num, count] , ↓↓↓)
* 对应的，若侦听了多个源，则回调函数书写形式也发生变化：([newNum,newCount],[oldNum,oldCount]) => {...}

⑩watchEffect:
* 自动对回调内的数据进行依赖收集的一种侦听器
* 无需配置参数即哪些数据需要被侦听
* 初始化就会自动执行一次，类似immediate:true
* 不能得到数据变化前后的状态值
* 参数2：{ deep: true, immediateL true[默认], flush: 'post' | 'sync' }
```
