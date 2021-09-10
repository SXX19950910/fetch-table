<template>
 <div class="table-index-wrap">
   <div class="handle-area text-right">
     <el-button type="primary" size="small" @click="handleGoAdd">新增列表</el-button>
   </div>
   <fetch-table class="mt-30" table-key="配置列表" :request-options="requestOptions"></fetch-table>
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
      requestOptions: {
        baseURL: process.env.VUE_APP_URL
      }
    }
  },
  created() {
  },
  methods: {
    handleGoAdd() {
      this.$router.push({ name: 'Edit' })
    },
    handleGoEdit(data) {
      this.$router.push({ name: 'Edit', query: { tableKey: data.tableKey }})
    },
    handleRemoveItem(data) {
      const submit = async () => {
        const res = await this.$api.table.remove({ id: data._id })
        if (res && res.data) {
          this.$message.success('删除成功')
          void this.init()
        }
      }
      this.$confirm('此操作将永久删除该列表数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submit()
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss">
.table-index-wrap {
  padding: 20px;
}
</style>
