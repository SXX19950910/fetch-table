<template>
 <div class="table-index-wrap">
   <fetch-table class="mt-30" table-key="华为官翻sku列表" :request-params="options" :request-options="requestOptions" config-base-url="https://jk.www.huishoubao.com/configApi"></fetch-table>
 </div>
</template>

<script>
// import fetchTable from '../../components/FetchTable/index';
export default {
  components: {
    // fetchTable
  },
  data() {
    return {
      data: [],
      options: {
      },
      requestOptions: {
        url: 'http://wms-wwwapi.huishoubao.com.cn/admin/stock',
        data: {
          "_head": {
            "_version": "0.01",
            "_msgType": "request",
            "_timestamps": "1634183796",
            "_interface": "SalesProduct.Hwout.Config.GetRule",
            "_remark": ""
          },
          "_param": {
            loginToken: "4202dc79931d389980243883c7853a29",
            loginUserId: "1911",
            "attr": "map_sku,map_product,map_grade",
            "page": "0",
            "show": "20"
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    onResponse(res) {
      return res._data._data.data.map(item => {
        const newItem = {...item}
        newItem.Fsku_desc = [newItem.Fsku_desc]
        return newItem
      })
    },
    response(res) {
      return res.data.list
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
    }
  }
}
</script>

<style lang="scss">
.table-index-wrap {
  padding: 20px;
}
</style>
