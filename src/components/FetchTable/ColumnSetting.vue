<template>
  <div class="column-setting-wrap">
    <el-dialog v-drag class="column-setting-dialog" title="自定义列" width="900px" :visible.sync="visible" append-to-body>
      <div v-loading="loading" element-loading-text="加载中..." class="column-content">
        <div class="left-area">
          <div class="title-box">可选字段</div>
          <el-scrollbar class="scroll-wrapper">
            <el-checkbox-group class="check-left" v-model="checkList" @change="onSelectChange">
              <el-checkbox v-for="(item, index) in columnList" :key="index" :label="item.prop" :checked="item.visible" :disabled="item.isDefault" class="item">
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
        <div class="right-area">
          <div class="title-box">已选字段</div>
          <el-scrollbar class="scroll-wrapper">
            <draggable v-model="selectedList" class="right-check_block" :options="{ animation: 200 }">
              <template v-for="(item, index) in selectedList">
                <div v-if="item.visible" :key="index" class="select-item cursor-move">
                  <span><i class="el-icon-sort mr-5"></i>{{ item.label }}</span><i v-if="!item.isDefault" class="el-icon-close" @click.stop="handleRemoveColumn(item)"></i>
                </div>
              </template>
            </draggable>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, getTableData } from '../../utils'
import drag from '../directive/drag.js'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  directives: {
    drag
  },
  props: {
    tableKey: {
      type: String,
      default: '',
      required: true
    },
    configBaseUrl: {
      type: String,
      default: ''
    },
    requestOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      loading: true,
      selectedList: [],
      checkList: [],
      columnList: [],
      originColumnList: [],
      originSelectList: []
    }
  },
  computed: {
    isLoaded() {
      return this.columnList.length > 0
    }
  },
  methods: {
    init() {
      this.getData()
      this.visible = true
    },
    getDefaultData() {
      this.checkList = []
      this.originColumnList.map(item => {
        if (item.visible) this.checkList.push(item.prop)
      })
      this.selectedList = deepClone(this.originSelectList)
    },
    async getData() {
      if (this.isLoaded) return
      this.selectedList = []
      this.loading = true
      const options = {
        baseURL: this.configBaseUrl,
        url: '/table/query',
        method: 'POST',
        timeout: 1000 * 60,
        data: {
          tableKey: this.tableKey
        }
      }
      const res = await getTableData(options).catch(err => {
        this.$message.error(err)
        this.loading = false
      })
      this.loading = false
      if (res && res.data && res.data.list.length > 0) {
        const data = res.data.list[0].columnList
        const map = new Map()
        this.columnList = []
        data.map(item => {
          const newItem = { ...item }
          if (!map.has(item.prop)) {
            map.set(item.prop, item.prop)
            this.columnList.push(newItem)
            this.selectedList.push(newItem)
          }
        })
        this.originColumnList = deepClone(this.columnList)
        this.originSelectList = deepClone(this.selectedList)
      }
    },
    handleRemoveColumn(data) {
      this.checkList.map((item, index) => {
        if (item === data.prop) {
          this.checkList.splice(index, 1)
        }
      })
      this.onSelectChange()
    },
    onSelectChange() {
      const indexMap = new Map()
      this.selectedList.forEach((item, index) => {
        item.visible = false
        indexMap.set(item.prop, index)
      })
      this.checkList.forEach(item => {
        const index = indexMap.get(item)
        this.selectedList[index].visible = true
      })
    },
    saveDefaultData() {
      const indexMap = new Map()
      this.columnList.map((item, index) => {
        indexMap.set(item.prop, index)
        item.visible = false
      })
      this.checkList.forEach(item => {
        const index = indexMap.get(item)
        this.columnList[index].visible = true
      })
      this.originColumnList = deepClone(this.columnList)
      this.originSelectList = deepClone(this.selectedList)
    },
    handleSubmit() {
      this.saveDefaultData()
      this.$emit('submit', this.selectedList.reduce((total, item) => {
        item.visible && total.push(item.prop)
        return total
      }, []))
      this.visible = false
    },
    handleCancel() {
      this.visible = false
      this.getDefaultData()
    }
  }
}
</script>

<style lang="scss">
/deep/ .el-dialog {
  .el-dialog__header {
    height: 44px;
    padding: 0 15px;
    align-items: center;
    display: flex;
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    padding-top: 15px;
  }
}

.column-setting-wrap {
  .icon-btn {
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
  }
}

.column-setting-dialog {
  .column-content {
    width: 100%;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    .scroll-wrapper {
      height: 400px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .title-box {
      background-color: #f5f7fa;
      width: 100%;
      line-height: 36px;
      padding: 0 15px;
      font-size: 12px;
      border-bottom: 1px solid #EBEEF5;
      box-sizing: border-box;
    }
    .left-area {
      width: 75%;
      margin-right: 20px;
      border: 1px solid #EBEEF5;
      border-radius: 2px;
      box-sizing: border-box;
      .item {
        width: 25%;
        margin-right: 0;
        height: 35px;
        box-sizing: border-box;
      }
      .check-left {
        padding: 15px;
        box-sizing: border-box;
        .el-checkbox__label {
          font-size: 13px;
        }
      }
    }
    .right-area {
      width: 25%;
      border: 1px solid #EBEEF5;
      border-radius: 2px;
      box-sizing: border-box;
      .right-check_block {
        padding: 6px 0 10px 0;
        box-sizing: border-box;
        .select-item {
          cursor: move;
          width: 100%;
          font-size: 12px;
          line-height: 36px;
          display: flex;
          padding: 0 15px;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          .el-icon-sort {
            margin-right: 5px;
          }
          .el-icon-close {
            cursor: pointer;
            font-weight: bold;
            &:hover {
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
}
</style>
