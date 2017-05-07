const path = require('path');
const argv = require('yargs').argv;
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const debug = require('debug')('app:config:webpack');

const webpackConfig = {
    name    : 'client',
    target  : 'web',
    devtool : 'source-map',
    resolve : {
        extensions : ['.js', '.jsx', '.json'],
        modules: [path.resolve(__dirname, 'src'), "node_modules"],
    },
    module : {}
};

webpackConfig.entry = {
    fool : [path.resolve(__dirname, 'src', 'index.js'), 'webpack-hot-middleware/client?path=/__webpack_hmr'],
    vendor : [
        'react',
        'react-dom'
    ]
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
    filename   : `[name].[hash].js`,
    path       : path.resolve(__dirname, 'public'),
    publicPath : '/'
}

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {}
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true
webpackConfig.externals['react/lib/ReactContext'] = true
webpackConfig.externals['react/addons'] = true

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
    new HtmlWebpackPlugin({
        template : path.resolve(__dirname, 'src', 'index.html'),
        hash     : false,
        filename : 'index.html',
        inject   : 'body',
        minify   : {
            collapseWhitespace : true
        }
    }),
    // new webpack.ProvidePlugin({
    //     cx: "classnames",
    // })
]

debug('Enabling plugins for live development (HMR, NoErrors).')
webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
)

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.rules = [];
webpackConfig.module.rules.push({
    test    : /\.(js|jsx)$/,
    exclude : [/node_modules/],
    loader  : 'babel-loader',
    query   : {
        cacheDirectory : false,
        presets        : ['es2015', 'react', 'stage-0'],
        plugins        : [
            'transform-react-jsx',
        ],
    }
})
webpackConfig.module.rules.push({
    test   : /\.json$/,
    loader : 'json-loader'
})
webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            query: {
                sourceMap: true,
                modules: true,
                localIdentName: '[local]__[hash:base64:3]'
            }
        },
        'postcss-loader',
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
            }
        }
    ]
})
webpackConfig.module.rules.push({
    test: /\.css$/,
    use: [
        'css-loader',
        'postcss-loader'
    ]
})
webpackConfig.module.rules.push({
    test: /\.txt$/,
    use: 'raw-loader'
})

module.exports = webpackConfig
