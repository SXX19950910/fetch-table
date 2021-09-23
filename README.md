# fetch-table
`顾名思义，这是一个表格组件，与其它表格不同的地方在于它的渲染逻辑及业务逻辑都是通过拉取远程的表格配置数据进行操作的`

### 安装 install

npm i fetch-table </br>
yarn add fetch-table

### 基础用法

main.js
```javascript
import fetchTable from 'fetch-table';
import 'fetch-table/dist/fetch-table.css'
Vue.use(fetchTable)
```

```vue
<template>
  <div class="table-index-wrap">
    <fetch-table class="mt-30" table-key="配置列表" :request-options="requestOptions"></fetch-table>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      requestOptions: {
        baseURL: process.env.VUE_APP_URL || '表格数据的API地址'
      }
    }
  },
  created() {
  },
  
}
</script>
```

### 参数说明

#### tableKey（String）
`获取配置数据的key，可理解为查询接口中的id`

#### configBaseUrl（String）
`获取列表配置数据的api地址`

#### requestParams（Object）
`自定义列表数据接口的请求参数`

#### requestOptions（Object）
`参数同axios的config参数，可以在此配置自己的请求设置`<br>

例如

```json
{
  "baseURL": "https://www.demo.com",
  "timeout": "600000",
  "method": "POST",
  "params": ""
}
```

#### context（Object）
`指定组件调用的this对象`

#### immediately（Boolean）
`是否立刻加载列表数据`

#### request || response（Function）
`自定义请求request或响应response的方法`
```vue
<template>
    <fetch-table ref="table" class="mt-20" :immediately="true" :request-params="requestParams" config-base-url="https://jk.www.huishoubao.com/configApi" :request="onRequest" table-key="订单系统-闲鱼已验货售后订单列表"></fetch-table>
</template>

<script>
import { getXyCheckAfterSaleList } from '@/api/api.js'
export default {
  components: {
  },
  data() {
    return {
      form: {
        xyOrderNo: '',
        afterSaleNo: '',
        merchantGoodsNo: '',
        buyerName: '',
        buyerPhone: '',
        time: [],
        expressNo: '',
        imei: '',
        sn: '',
        refundStatus: '',
        needReturnGoods: ''
      },
    }
  },
  computed: {
    requestParams() {
      const { xyOrderNo, afterSaleNo, merchantGoodsNo, buyerName, buyerPhone, time, expressNo, imei, sn, refundStatus, needReturnGoods } = this.form
      return {
        xyOrderNo,
        afterSaleNo,
        merchantGoodsNo,
        buyerPhone,
        buyerName,
        createBeginTime: time[0] + ' 00:00:00',
        createEndTime: time[1] + ' 23:59:59',
        expressNo,
        imei,
        sn,
        refundStatus,
        needReturnGoods
      }
    }
  },
  methods: {
    onRequest(options) {
      return getXyCheckAfterSaleList(options.data)
    },
    onResponse(res) {
      return res.data.result
    }
  }
}
</script>

```
#### summaryMethod
`列表尾部合计方法用法参考element-ui中的table文档`

#### spanMethod
`列和行的合并方法参考element-ui中的table文档`
