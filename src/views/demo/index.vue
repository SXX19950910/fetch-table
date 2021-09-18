<template>
 <div class="table-index-wrap">
   <div class="handle-area text-right">
     <el-button type="primary" size="small" @click="handleGoAdd">新增列表</el-button>
   </div>
   <fetch-table class="mt-30" table-key="订单系统-闲鱼已验货售后订单列表" :request-options="options"></fetch-table>
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
          createBeginTime: "2021-09-01",
          createEndTime: "2021-09-30",
          expressNo: "",
          imei: "",
          merchantGoodsNo: "",
          refundStatus: "",
          sn: "",
          token: "d5265db383ef9ad3c73f93fcdbe8cafa",
          uid: "1937",
          xyOrderNo: "",
        }
      }
    }
  },
  created() {
  },
  methods: {
    handleGoAdd() {
      this.$router.push({ name: 'Edit' })
    },
    response(res) {
      return res.data.list
    }
  }
}
</script>

<style lang="scss">
.table-index-wrap {
  padding: 20px;
}
</style>
