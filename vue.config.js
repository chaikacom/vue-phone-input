const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isDev = process.env.NODE_ENV !== 'production'

const externals = {
    "vue-multiselect": "vue-multiselect",
}

const plugins = []

if(!isDev) plugins.push(new BundleAnalyzerPlugin)


module.exports = {
    configureWebpack: {
        externals: isDev ? {} : externals,
        plugins: plugins
    }
}