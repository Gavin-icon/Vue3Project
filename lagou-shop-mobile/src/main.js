import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import 'amfe-flexible'
import '@/styles/base.css'
// import Vant from 'vant'
// import 'vant/lib/index.css'

import {
  NavBar,
  Form,
  CellGroup,
  Field,
  Popup,
  Cascader,
  Switch,
  Button,
  Empty,
  SubmitBar,
  Checkbox,
  Cell,
  Icon,
  PullRefresh,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  List,
  NoticeBar,
  AddressEdit,
  ActionSheet,
  RadioGroup,
  Tabs,
  Stepper,
  ActionBar,
  ActionBarIcon,
  TabbarItem,
  Image,
  Rate,
  Tabbar,
  AddressList,
  Radio,
  Tab,
  ActionBarButton,
  Toast

} from 'vant'

const app = createApp(App)
app.use(router)
app.use(store)
// app.use(Vant)

app.use(NavBar)
  .use(Form)
  .use(CellGroup)
  .use(Field)
  .use(Popup)
  .use(Cascader)
  .use(Switch)
  .use(Button)
  .use(Empty)
  .use(SubmitBar)
  .use(Checkbox)
  .use(Cell)
  .use(Icon)
  .use(PullRefresh)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(List)
  .use(NoticeBar)
  .use(AddressEdit)
  .use(ActionSheet)
  .use(RadioGroup)
  .use(Tabs)
  .use(Stepper)
  .use(ActionBar)
  .use(ActionBarIcon)
  .use(TabbarItem)
  .use(Image)
  .use(Rate)
  .use(Tabbar)
  .use(AddressList)
  .use(Radio)
  .use(Tab)
  .use(ActionBarButton)
  .use(Toast)

app.mount('#app')
