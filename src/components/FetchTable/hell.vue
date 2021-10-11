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
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  render(h) {
    const { context, row, column } = this
    if (column.renderHeader) {
      return new Transform({ value: column.renderHeader }).runStrFunction({ h, context, row, column })
    } else {
      return h('span', [this.value])
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
