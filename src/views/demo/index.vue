<template>
 <div class="table-index-wrap">
   <fetch-table class="mt-30" table-key="华为发货单列表" :request-params="options" :request-options="requestOptions" :response="onResponse" config-base-url="https://jk.www.huishoubao.com/configApi"></fetch-table>
 </div>
</template>

<script>
import fetchTable from '../../components/FetchTable/index';
export default {
  components: {
    fetchTable
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
            "_timestamps": "1635144188",
            "_interface": "SalesProduct.Hwout.Order.OrderOutList",
            "_remark": ""
          },
          "_param": {
            "loginUserId": "1937",
            "loginToken": "30e6630d1078d373d4eb6a79b4119d08",
            "page": "2",
            "show": "20",
            "hw_sn": "",
            "hw_out_sn": "",
            "out_status": "",
            "out_sn": "",
            "map_attr": "map_sku,map_product,map_grade",
            "attr": "out_detail"
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    onResponse(res) {
      console.log(res._data._data.data)
      return res._data._data.data
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
