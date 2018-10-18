const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');


module.export = merge(baseConfig,{
    mode: 'development',
    devtool: 'source-map',                                //js打包模式，详细回溯版，便于开发
    // 缓存机制，更新修改的内容（模块），不更新未修改的
    devServer: {                                          //热更新
        contentBase: path.resolve(__dirname,'../dist'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        inline: true,
        host: 'localhost',
        port: 4545
    },
    output: {
        path: path.resolve(__dirname,'../dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})
