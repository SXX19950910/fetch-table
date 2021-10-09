<template>
 <div class="table-index-wrap">
   <fetch-table class="mt-30" table-key="收货系统-闲鱼已验货收货列表"></fetch-table>
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
        url: 'https://xianyu-yiyanhuo-admin-api.huishoubao.com/api/afterSale/getList',
        data: {
          afterSaleNo: "",
          buyerName: "",
          buyerPhone: "",
          createBeginTime: "2021-09-23 00:00:00",
          createEndTime: "2021-09-30 23:59:59",
          expressNo: "",
          imei: "",
          merchantGoodsNo: "",
          refundStatus: "",
          sn: "",
          token: "e01b8509b1aab5553d301fec8627721e",
          uid: "1937",
          xyOrderNo: "",
        }
      }
    }
  },
  created() {
  },
  methods: {
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
