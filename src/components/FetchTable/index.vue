<template>
  <div class="dynamic-table-wrap">
    <el-table ref="table" v-loading="loading" element-loading-text="加载中..." v-bind="options" :data="data">
      <el-table-column v-if="options.selection" type="selection"></el-table-column>
      <template v-for="(item, index) in columnList">
        <el-table-column v-if="refresh && item.visible" :key="index" :type="item.type" :row-key="item.id" :label="item.label" :prop="item.prop" :show-tooltip-when-overflow="item.showOverflowTooltip" :resizable="item.resizable" :class-name="item.className" :column-key="item.columnKey" :fixed="item.fixed" :width="item.width" :min-width="item.minWidth" :align="item.align">
          <template slot="header" slot-scope="props">
            <hell :row="props.row" :column="item" :value="item.label" :type="item.type" :context="context"></hell>
          </template>
          <template slot-scope="props">
            <cell :row="props.row" :column="item" :value="props.row[item.prop]" :type="item.type" :context="context"></cell>
          </template>
        </el-table-column>
      </template>
      <el-table-column width="40" align="center">
        <template slot="header">
          <i class="icon-btn el-icon-s-tools" @click="initSetting"></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-if="page.enable"
        class="page-area"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="page.current"
        :page-sizes="page.sizeOptions"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="data.length">
    </el-pagination>
    <column-setting ref="setting" :table-key="tableKey" :request-options="requestOptions" @submit="onSettingSubmit"/>
  </div>
</template>

<script>
import request from '../../utils/request.js';
import { deepClone } from '../../utils';
import columnSetting from './ColumnSetting.vue'
import cell from './cell.vue'
import hell from './hell.vue'

export default {
  name: 'fetch-table',
  components: {
    columnSetting,
    cell,
    hell
  },
  props: {
    tableKey: {
      type: String,
      default: '',
      required: true
    },
    requestOptions: {
      type: Object,
      default: () => {},
      required: true
    },
    context: {
      type: Object,
      default() {
        return this.$parent
      }
    }
  },
  data() {
    return {
      loading: false,
      columnList: [{ visible: true }],
      options: {},
      data: [],
      page: {
        sizeOptions: [],
        current: 0,
        size: 20
      },
      refresh: false,
      checkList: [],
      baseDataUrl: '/table/query'
    }
  },
  watch: {
    tableKey() {
      this.reset()
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      await this.getOptions()
      await this.getData()
      this.loading = false
      this.refresh = true
    },
    reset() {
      this.options = {}
      this.refresh = false
      this.columnList = [{ visible: true, label: '' }]
      this.data = []
      this.$nextTick(() => this.refresh = true)
    },
    onCurrentChange() {
    },
    onSizeChange() {
    },
    formatData(list) {
      return list.map((item, index) => {
        const newItem = {...item}
        newItem.$index = index + 1
        return newItem
      })
    },
    async getData() {
      const {api, params} = this.options
      if (!api || !params) return
      const options = Object.assign({ url: api, data: JSON.parse(params || '{}') }, this.requestOptions)
      const res = await request(options).catch(err => {
        this.$message.error(err)
        this.$emit('fetch-error', options)
      })
      if (res && res.data) {
        this.data = this.formatData(res.data.list)
      }
    },
    async getOptions() {
      const options = Object.assign({ url: this.baseDataUrl, data: { tableKey: this.tableKey } }, this.requestOptions)
      const res = await request(options).catch(err => {
        this.$message.error(err)
        this.$emit('fetch-error', options)
      })
      if (res && res.data.list.length > 0) {
        const data = res.data.list[0]
        const columnList = data.columnList.map(item => {
          const newItem = {...item}
          newItem.fixed = newItem.fixed === 'none' ? '' : newItem.fixed
          newItem.type = ['default'].includes(newItem.type) ? '' : newItem.type
          return newItem
        })
        this.options = deepClone(data)
        this.page = data.pagination
        this.columnList = deepClone(columnList)
      }
    },
    onSettingSubmit(checklist) {
      const columnList = deepClone(this.columnList)
      let newList = []
      this.refresh = false
      columnList.forEach(item => item.visible = false)
      checklist.forEach(item => {
        const currentIndex = columnList.findIndex(column => column.prop === item)
        const current = deepClone(columnList[currentIndex])
        current.visible = true
        newList.push(current)
        columnList.splice(currentIndex, 1)
      })
      this.$nextTick(() => this.refresh = true)
      this.columnList = newList.concat(columnList)
    },
    initSetting() {
      this.$refs.setting.init()
    },
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection()
    },
    toggleRowSelection(row, selected) {
      this.$refs.table && this.$refs.table.toggleRowSelection(row, selected)
    },
    toggleAllSelection() {
      this.$refs.table && this.$refs.table.toggleAllSelection()
    },
    setCurrentRow(row) {
      this.$refs.table && this.$refs.table.setCurrentRow(row)
    },
    clearSort() {
      this.$refs.table && this.$refs.table.clearSort()
    },
    doLayout() {
      this.$refs.table && this.$refs.table.doLayout()
    }
  }
}
</script>

<style lang="scss">
.dynamic-table-wrap {
  .icon-btn {
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: #409EFF;
    }
  }
  .page-area {
    text-align: right;
    padding: 20px 0;
  }
}
</style>
