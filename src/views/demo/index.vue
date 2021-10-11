<template>
 <div class="table-index-wrap">
   <fetch-table class="mt-30" table-key="配置列表" :request-params="options" config-base-url="http://127.0.0.1:6002/configApi"></fetch-table>
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
        tableKey: '配置列表'
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
