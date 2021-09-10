<template>
  <div class="column-setting-wrap">
    <el-dialog v-drag class="column-setting-dialog" title="自定义列" width="900px" :visible.sync="visible" append-to-body>
      <div v-loading="loading" element-loading-text="加载中..." class="column-content">
        <div class="left-area">
          <div class="title-box">可选字段</div>
          <el-checkbox-group class="check-left" v-model="checkList" @change="onSelectChange">
            <el-checkbox v-for="(item, index) in columnList" :key="index" :label="item.prop" :checked="item.visible" :disabled="item.isDefault" class="item">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="right-area">
          <div class="title-box">已选字段</div>
          <draggable v-model="selectedList" class="right-check_block">
            <div v-for="(item, index) in selectedList" :key="index" class="select-item cursor-move">
              <span><i class="el-icon-sort mr-5"></i>{{ item.label }}</span><i v-if="!item.isDefault" class="el-icon-close" @click.stop="handleRemoveColumn(item)"></i>
            </div>
          </draggable>
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
import request from '../../utils/request.js';
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
      columnList: []
    }
  },
  created() {
    this.getDefaultData()
  },
  methods: {
    init() {
      this.visible = true
    },
    async getDefaultData() {
      this.selectedList = []
      this.loading = true
      const options = Object.assign({
        url: '/table/query',
        data: {
          tableKey: this.tableKey
        }
      }, this.requestOptions)
      const res = await request(options).catch(err => {
        this.$message.error(err)
        this.loading = false
      })
      this.loading = false
      if (res && res.data && res.data.list.length > 0) {
        this.columnList = res.data.list[0].columnList
        this.columnList.forEach(item => {
          const newItem = { ...item }
          if (newItem.visible) {
            this.selectedList.push(newItem)
          }
        })
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
      this.selectedList = []
      this.checkList.forEach(item => {
        const current = this.columnList.find(column => column.prop === item)
        this.selectedList.push({...current})
      })
    },
    handleSubmit() {
      this.$emit('submit', this.selectedList.map(item => item.prop))
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
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
    height: 400px;
    overflow: auto;
    .title-box {
      background-color: #f5f7fa;
      width: 100%;
      line-height: 36px;
      padding: 0 15px;
      font-size: 12px;
    }
    .left-area {
      width: 75%;
      margin-right: 20px;
      border: 1px solid #EBEEF5;
      border-radius: 2px;
      .item {
        width: 25%;
        margin-right: 0;
        height: 35px;
      }
      .check-left {
        padding: 15px;
        .el-checkbox__label {
          font-size: 13px;
        }
      }
    }
    .right-area {
      width: 25%;
      border: 1px solid #EBEEF5;
      border-radius: 2px;
      .right-check_block {
        padding-top: 10px;
        .select-item {
          width: 100%;
          font-size: 12px;
          line-height: 32px;
          display: flex;
          padding: 0 15px;
          align-items: center;
          justify-content: space-between;
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
