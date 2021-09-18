export function deepClone(obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = (obj && typeof obj[key] === 'object') ? deepClone(obj[key]) : obj[key];
            }
        }
    }
    return newObj
}

export const isObject = obj => Object.prototype.toString.call(obj).includes('Object')

export const isArray = obj => Object.prototype.toString.call(obj).includes('Array')

export function getValues(target, ...keys) {
    if (!isObject(target)) {
        throw new Error('A参数必须为对象')
    }
    let result = {}
    const get = (data, keyName) => {
        const maps = Object.entries(data)
        maps.map(item => {
            const key = item[0]
            const value = item[1]
            if (isArray(value)) {
                value.map(field => get(field, keyName))
            } else if (isObject(value)) {
                get(value, keyName)
            } else if (keyName === key) {
                result[key] = value
            }
        })
    }
    keys.map(item => {
        get(target, item)
    })
    return result
}

export function merge (target, ...arg) {
    return arg.reduce((acc, cur) => {
        return Object.keys(cur).reduce((subAcc, key) => {
            const srcVal = cur[key]
            if (isObject(srcVal)) {
                subAcc[key] = merge(subAcc[key] ? subAcc[key] : {}, srcVal)
            } else if (isArray(srcVal)) {
                subAcc[key] = srcVal.map((item, idx) => {
                    if (isObject(item)) {
                        const curAccVal = subAcc[key] ? subAcc[key] : []
                        return merge(curAccVal[idx] ? curAccVal[idx] : {}, item)
                    } else {
                        return item
                    }
                })
            } else {
                subAcc[key] = srcVal
            }
            return subAcc
        }, acc)
    }, target)
}
