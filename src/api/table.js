import request from '../utils/request';

const table = {
    save(params) {
        return request({
            url: '/table/save',
            data: params
        })
    },
    query(params) {
        return request({
            url: '/table/query',
            data: params
        })
    },
    update(params) {
        return request({
            url: '/table/update',
            data: params
        })
    },
    remove(params) {
        return request({
            url: '/table/remove',
            data: params
        })
    }
}

export default table