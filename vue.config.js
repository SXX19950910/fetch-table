const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === "production"

const plugins = isProd ? [
    new BundleAnalyzerPlugin({
        analyzerHost: '127.0.0.1',
        analyzerPort: 6001,
        analyzerMode: 'server',
        openAnalyzer: false
    })
] : []

const externals = isProd ? {
    'axios': 'axios',
    lodash: {
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_',
    },
    babel: 'BABEL',
    '@babel/standalone': '@babel/standalone',
    'vuedraggable': 'vuedraggable',
    'babel-plugin-transform-vue-jsx': 'babel-plugin-transform-vue-jsx',
    'fetch-tale': 'fetch-table'
} : ''

const config = {
    publicPath: "./",
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
        plugins,
        externals
    }
}

module.exports = config;