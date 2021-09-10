import * as Babel from '@babel/standalone'
import babelPluginTransformVueJsx from 'babel-plugin-transform-vue-jsx'

class Transform {
    constructor(options = {}) {
        this.value = options.value
        this.context = options.context
        this.row = options.row
        this.column = options.column
        this.h = options.h
    }

    runStrFunction(arg) {
        const entries = Object.entries(arg)
        const yieldIterator = {}
        yieldIterator[Symbol.iterator] = function* () {
            for (const item of entries) {
                yield item[1]
            }
        }
        const argument = entries.reduce((total, item, index) => {
            total = total + item[0] + (index === entries.length - 1 ? '' : ',')
            return total
        }, '')
        return new Function(argument, `return ${this.value}()`)(...yieldIterator);
    }

    toRender() {
        return Babel.transform(this.value, {
            plugins: [babelPluginTransformVueJsx],
        }).code
    }
}

export default Transform