import fetchTable from './components/FetchTable/index.vue'
import { setTableData } from './utils';

const install = async function(Vue) {
    if (install.installed) return
    Vue.component('fetch-table', fetchTable)
    await setTableData()
}

if (typeof window !== 'undefined' && window.Vue) {
    void install(window.Vue)
}

const API = {
    install
}

export default API
