import request from './request'
import config from './../config/index'

export async function sleep(delay) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), delay)
    })
}

const getLocalTableList = () => JSON.parse(localStorage.getItem('tableList') || '[]')

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

export async function setTableData(data) {
    const options = Object.assign({ baseURL: `${config.configBaseUrl}/table/query`, data: {} }, data)
    const res = await request({
        url: options.baseURL,
        data: options.data
    }).catch(err => {
        throw new Error('获取table配置数据发生错误,' + err)
    })
    if (res && res.data.list) {
        localStorage.setItem('tableList', JSON.stringify(res.data.list))
    }
}

export async function getTableData(options) {
    return new Promise(async (resolve, reject) => {
        let result = { data: { list: [] } }
        const data = getLocalTableList().find(item => item.tableKey === options.data.tableKey)
        if (!data) {
            const res = await request({ url: `${config.configBaseUrl}/table/query`, data: options.data }).catch(err => {
                reject(options.data.tableKey + '配置数据未找到！，请查看tableKey是否正确,' + err)
            })
            if (res && res.data.list) {
                result.data.list = res.data.list
            }
        } else {
            result.data.list.push(data)
        }
        resolve(result)
    })
}
