<template>
  <div class="dynamic-table-wrap">
    <el-table ref="table" v-loading="loading" element-loading-text="加载中..." v-bind="configOptions" :data="data">
      <el-table-column v-if="configOptions.selection" type="selection"></el-table-column>
      <template v-for="(item, index) in columnList">
        <el-table-column v-if="item.visible" :key="index" :type="item.type" :row-key="item.id" :label="item.label" :fixed="item.fixed" :prop="item.prop" :show-tooltip-when-overflow="item.showOverflowTooltip" :resizable="item.resizable" :class-name="item.className" :column-key="item.columnKey" :width="item.width" :min-width="item.minWidth" :align="item.align">
          <template slot="header" slot-scope="props">
            <hell v-if="refresh" :row="props.row" :column="item" :value="item.label" :type="item.type" :context="context"></hell>
          </template>
          <template slot-scope="props">
            <cell v-if="refresh" :row="props.row" :column="item" :value="props.row[item.prop]" :type="item.type" :context="context"></cell>
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" width="40" align="center">
        <template v-if="refresh" slot="header">
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
    <column-setting ref="setting" :table-key="tableKey" :config-base-url="configBaseUrl" @submit="onSettingSubmit"/>
  </div>
</template>

<script>
import request from '../../utils/request.js';
import { deepClone, isObject, isArray } from '../../utils';
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
    immediately: {
      type: Boolean,
      default: true
    },
    tableKey: {
      type: String,
      default: '',
      required: true
    },
    request: Function,
    response: Function,
    requestOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    configBaseUrl: {
      type: String,
      default: 'http://jk.www.huishoubao.com/configApi'
    },
    requestParams: {
      type: Object,
      default() {
        return {}
      }
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
      columnList: [{ visible: false }],
      configOptions: {
        params: '{}'
      },
      data: [],
      page: {
        sizeOptions: [],
        current: 0,
        size: 20
      },
      refresh: false,
      checkList: [],
      configRequestOptions: {
        url: '/table/query',
        method: 'POST',
        timeout: 1000 * 60
      }
    }
  },
  watch: {
    tableKey() {
      this.reset()
      this.init()
    }
  },
  computed: {
    newParams() {
      return Object.assign(JSON.parse(this.configOptions.params), deepClone(this.requestParams))
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      await this.getOptions()
      this.immediately && await this.getData()
      this.loading = false
      this.refresh = true
    },
    reset() {
      this.configOptions = {}
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
      if (!isArray(list)) return []
      return list.map((item, index) => {
        const newItem = {...item}
        newItem.$index = index + 1
        return newItem
      })
    },
    async getData() {
      const {api, params} = this.configOptions
      if (!api || !params) return
      const options = Object.assign({ url: api, data: this.newParams }, this.requestOptions)
      const fetch = this.request || request
      const res = await fetch(options).catch(err => {
        this.$message.error(err)
        this.loading = false
        this.$emit('fetch-error', options)
      })
      let result = this.getRes(res)
      this.data = this.formatData(result)
    },
    getRes(res) {
      let result
      const getList = target => {
        for (const key in target) {
          const current = target[key]
          if (isObject(current)) {
            getList(current)
          } else if (isArray(current)) {
            result = current
            break;
          }
        }
      }
      if (this.response) {
        try {
          result = this.response(res)
        } catch (e) {
          throw new Error(e)
        }
      } else {
        getList(res)
      }
      if (!isArray(result)) {
        console.error('接口返回字段必须包含List类型')
      }
      return result
    },
    async getOptions() {
      const options = Object.assign(this.configRequestOptions, { baseURL: this.configBaseUrl, data: { tableKey: this.tableKey } })
      const res = await request(options).catch(err => {
        this.$message.error(err)
        this.loading = false
        this.$emit('fetch-error', options)
      })
      if (res && res.data.list.length > 0) {
        const data = res.data.list[0]
        const columnList = data.columnList.map(item => {
          const newItem = {...item}
          if (newItem.fixed === 'none') delete newItem.fixed
          newItem.type = ['default'].includes(newItem.type) ? '' : newItem.type
          return newItem
        })
        this.configOptions = deepClone(data)
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
