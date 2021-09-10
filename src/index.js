import fetchTable from './components/FetchTable/index.vue'

const install = function(Vue, opts = {}) {
    if (install.installed) return
    Vue.component('fetch-table', fetchTable)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const API = {
    install
}

export default API