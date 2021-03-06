const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isDev = process.env.NODE_ENV !== 'production'
const externals = {
    "vue-multiselect": "vue-multiselect",
    "libphonenumber-js": "libphonenumber-js"
}

const plugins = [new BundleAnalyzerPlugin]

// if(!isDev) plugins.push()

module.exports = {
    configureWebpack: {
        externals: isDev ? {} : externals,
        plugins: plugins,
    },
    css: {
        loaderOptions: {
            sass: {
                data: isDev ? `@import '~vue-multiselect/dist/vue-multiselect.min.css';` : ''
            }
        }
    }
}
