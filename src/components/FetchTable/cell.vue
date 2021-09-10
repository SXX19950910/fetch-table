<script>
import Transform from '../../utils/transform.js';
export default {
  props: {
    value: '',
    column: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    context: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    createElement() {
      const renderKey = {
        '': 'renderContent',
        'expand': 'renderExpand'
      }[this.type]
      return this.column[renderKey]
    }
  },
  render(h) {
    const { type, row, column, context, value } = this
    if (type === 'index') {
      return h('span', [this.row.$index])
    } else if (this.createElement) {
      return new Transform({ value: this.createElement, }).runStrFunction({ h, context, row, column })
    } else {
      return (
          <span>{ value }</span>
      )
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
