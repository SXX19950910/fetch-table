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

#### tableKey<br>
`获取配置数据的key，可理解为查询接口中的id`

#### requestOptions<br>
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

#### context
`指定组件调用的this对象`
