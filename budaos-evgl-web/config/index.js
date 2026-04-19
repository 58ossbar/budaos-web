'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

// 后端服务地址配置
const API_TARGET = process.env.API_TARGET || 'http://localhost:9080'

// 通用代理配置
const proxyConfig = {
  target: API_TARGET,
  changeOrigin: true,
  secure: false
}

// API 路径列表
const apiPaths = [
  '/evgl',
  '/login-api',
  '/index-api',
  '/classroom-api',
  '/managementPanel-api',
  '/pkginfo-api',
  '/resourceCenter-api',
  '/questions-api',
  '/cloud-api',
  '/teachingCenter-api',
  '/subject-api',
  '/major-api',
  '/examCenter-api',
  '/testPaper-api',
  '/teacher-api',
  '/score-api',
  '/dict-api',
  '/news-api',
  '/partner-api',
  '/classroom-trainee-api',
  '/classroom-group-api',
  '/classroom-trainee-check-api',
  '/sign-api',
  '/activity',
  '/site',
  '/paperExamine',
  '/trainee-story',
  '/cbim'
]

// 生成 proxyTable
const proxyTable = {}
apiPaths.forEach(path => {
  proxyTable[path] = proxyConfig
})

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: proxyTable,

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8888, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
