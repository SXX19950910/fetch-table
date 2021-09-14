<template>
 <div class="table-index-wrap">
   <div class="handle-area text-right">
     <el-button type="primary" size="small" @click="handleGoAdd">新增列表</el-button>
   </div>
   <fetch-table class="mt-30" table-key="订单系统-闲鱼已验货售后订单列表"></fetch-table>
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
      data: []
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
