const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const optimizeCss = require('optimize-css-assets-webpack-plugin')
const ip = require('ip')
const env = process.argv[process.argv.length - 1]
const devMode = process.env.RPA_ENV !== 'production'
const resolve = (src) => path.resolve(__dirname, src)

const appSrc = resolve('./src')
const appDist = resolve('./dist')
const appPublic = resolve('./public')
const appIndex = path.resolve(appSrc, 'index.jsx')
const appHtml = path.resolve(appPublic, 'index.html')

let envVars
/** 在该文件下配置项目基本参数 */
if (env === 'develop') {
  envVars = 'develop'
} else if (env === 'release-alpha') {
  envVars = 'release-alpha'
} else if (/feature-.?/.test(env)) {
  envVars = 'local'
} else if (env === 'release-beta') {
  envVars = 'release-beta'
} else if (env === 'master') {
  envVars = 'master'
} else {
  envVars = 'local'
}

const envMap = {
  develop: 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/dr',
  'release-alpha': 'https://preview.meizhilab.com/dr/alpha',
  'release-beta': 'https://preview.meizhilab.com/dr/beta',
  master: 'https://oss.web.meizhilab.com/dr',
  local: 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/local/dr',
}

const envPath = envMap[envVars]

const staticPath = `${envPath}/rpasource/static/`

const rpasourceImgPath = `${envPath}/rpasource/image`

// 静态cdn路径
const cdn = {
  dev: {
    react: 'https://cdn.bootcss.com/react/16.13.0/umd/react.development.js',
    reactDom: 'https://cdn.bootcss.com/react-dom/16.13.0/umd/react-dom.development.min.js',
    moment: 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/dr/portal/cdn/moment.2.24.0.min.js',
  },
  prd: {
    react: `${envPath}/portal/cdn/react.16.13.0.min.js`,
    reactDom: `${envPath}/portal/cdn/react-dom.16.3.0.min.js`,
    moment: `${envPath}/portal/cdn/moment.2.24.0.min.js`,
  },
}

const xdb = 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/dr/portal/cdn/xdb.umd.min.js'

const webpackConfig = {
  // 声明开发环境
  mode: devMode ? 'development' : 'production',
  // 项目打包的入口
  entry: {
    main: appIndex,
    common: ['react', 'react-dom', 'react-router-dom'],
  },
  // 输出的地方
  output: {
    filename: 'js/[name].[hash:8].js',
    path: appDist,
    publicPath: devMode ? '/' : staticPath,
  },
  // 是否开启调试模式
  devtool: devMode ? 'eval-source-map' : 'source-map',
  // 压缩相关的配制
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // 所要用到的插件
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[name].chunk.css',
    }),
    new HTMLWebpackPlugin({
      template: appHtml,
      filename: 'index.html',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        RPA_ENV: JSON.stringify(env),
      },
      IS_ENV: JSON.stringify(env),
      rpasourceImgPath: JSON.stringify(rpasourceImgPath),
      xdb: JSON.stringify(xdb),
    }),
    new cleanWebpackPlugin({}),
    new HappyPack({
      id: 'happypack',
      loaders: ['babel-loader?cacheDirectory'],
      threads: 4, // 开启 4 个线程
    }),
  ],
  // 打包各种文件所需用的babel
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: devMode,
              localIdentName: !devMode ? 'H[hash:base64:6]' : '[path][name]-[local]',
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /css_modules/, // 只要匹配到了这个，就是用css modules，这里的css_modules和auto-css-module插件中source.value的后缀相匹配
            use: [
              'css-hot-loader', // css热更新插件，支持对提取css的热更新
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 1,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                  modifyVars: require('./config/theme'), // less变量的修改可以放到文件中，module.exports={}完成变量替换
                },
              },
            ],
          },
          {
            use: [
              'css-hot-loader', // 非css modules的less配置
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                  modifyVars: require('./config/theme'),
                },
              },
            ],
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/, // 对除了src目录下的less配置
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: require('./config/theme'),
            },
          },
        ],
        exclude: path.resolve(__dirname, './src'),
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader?cacheDirectory',
        // loader: 'happypack/loader?id=happypack',
        include: [resolve('./src')],
        exclude: [resolve('./node_modules')],
      },
      {
        test: /\.(ts|tsx)$/,
        loaders: ['babel-loader?cacheDirectory', 'ts-loader'],
        // loaders: ['happypack/loader?id=happypack', 'ts-loader'],
        include: [resolve('./src')],
        exclude: [resolve('./node_modules')],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(svg|woff2|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  // 定义全局的快捷方式
  resolve: {
    // 设置别名
    alias: {
      '@src': appSrc,
      '@common': resolve('./src/common'),
    },
    extensions: ['.js', '.jsx', '.ts'],
  },
  // 开发时用到的服务器
  devServer: {
    contentBase: appPublic,
    hot: true,
    host: `${ip.address()}`,
    port: 8000,
    historyApiFallback: true,
    overlay: true,
    inline: true,
    stats: 'errors-only',
  },
}

const Uglify = [
  new ParallelUglifyPlugin({
    cacheDir: '.cache/',
    uglifyJS: {
      output: {
        beautify: devMode,
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true, //去掉debugger
        collapse_vars: true,
        reduce_vars: true,
        global_defs: {
          '@alert': 'console.log', // 去掉alert
        },
      },
      warnings: false,
    },
  }),
  // new optimizeCss({
  //   cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
  //   cssProcessorOptions: {
  //     discardComments: { removeAll: true },
  //   },
  //   canPrint: true, //是否将插件信息打印到控制台
  // }),
]

if (!devMode) {
  const pluginsArr = webpackConfig.plugins
  webpackConfig.plugins = [...pluginsArr, ...Uglify]
}

module.exports = webpackConfig
