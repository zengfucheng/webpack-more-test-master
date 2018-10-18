const path = require('path');

const glob = require('glob');
const webpack = require('webpack');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

const entryConfig = getViewApp('src/pages/**/*.js','src');


module.exports = {
    mode: 'development',            //开发模式
    devtool: 'source-map',          //代码详细索引，报错显示位置
    devServer: {                                          //热更新
        // contentBase: path.resolve(__dirname,'../dist'),
        contentBase: '/',
        compress: true,                     //为所服务的一切启用gzip压缩
        historyApiFallback: true,
        hot: true,
        // hotOnly: true,                      //只热更新，意思就是 禁止自动刷新页面
        inline: true,                       //必须，实时刷新。不配置的话，不生效热更
        host: 'localhost',
        // port: 8080
    },
    entry: entryConfig,
    //     {
    //     // app: path.resolve(__dirname,'../src/index.js')
    //     home: path.resolve(__dirname,'../src/view/home.js'),
    //     about: path.resolve(__dirname,'../src/view/about.js')
    // },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname,'../dist'),
        publicPath: '/'
    },
    plugins: [
        new cleanWebpackPlugin(['dist'],{
            root: path.resolve(__dirname,'../'),
            exclude: '',
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new miniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // miniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(jpg|png|jpeg|gif|svg)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}

function getView(url,dir) {
    //本方法，自动获取入口文件路径，然后返回成一个 entry 配置对象
    //url 为 路径格式，如：src/view/**/*.js; dir 为
    let files = glob.sync(url);
    let entres = {};
    let dirname,extname,basename,pathname;
    files.forEach( function (v,i) {
        dirname = path.dirname(v);
        extname = path.extname(v);
        basename = path.basename(v,extname);
        pathname = path.join(dirname,basename);
        pathname = dir ? pathname.replace(new RegExp('^' + dir + '/'),'') : pathname;
        entres[pathname] = ['./'+v];
    });
    return entres;
};

function getViewApp(url,dir) {
    //本方法，自动获取入口文件路径，然后返回成一个 entry 配置对象
    //url 为 路径格式，如：src/view/**/*.js; dir 为
    let files = glob.sync(url);
    let entres = {};
    let dirname,extname,basename,pathname;
    let appname;
    files.forEach( function (v,i) {
        dirname = path.dirname(v);
        extname = path.extname(v);
        basename = path.basename(v,extname);
        pathname = path.join(dirname,basename);

        appname = path.basename( dirname,path.dirname(extname+'.js') )

        pathname = dir ? pathname.replace(new RegExp('^' + dir + '/'),'') : pathname;
        // entres[pathname] = ['./'+v];
        entres[appname] = ['./'+v];
    });
    return entres;
};

let pageList = getViewApp('src/pages/**/*.html','src');
let pages = Object.keys(pageList);
pages.forEach( function (v,i) {
    // getViewApp 的配套，getView 不适用
    let _entryConfig = entryConfig;
    let entryList = Object.keys(_entryConfig);
    let pageDirname = path.dirname(v + '.html');
    let entryDirname = '';

    let basename = path.basename(pageDirname);

    let templateUrl = pageList[v][0];

    // module.exports.entry.push(entryConfig[v]);
    console.log(v);

    let confiig = {
        // filename: 'view/' + basename + '.html',
        filename: v + '.html',
        template: templateUrl,
        inject: 'body',
        hash: true,
        chunks: false
    }
    if(v in entryConfig){
        confiig.inject = 'body';
        confiig.chunks = ['vendors',v]
    }


    module.exports.plugins.push(new htmlWebpackPlugin(confiig));
});

// pages.forEach( function (v,i) {
//     // getView 的配套，getViewApp 不适用
//     let _entryConfig = entryConfig;
//     let entryList = Object.keys(_entryConfig);
//     let pageDirname = path.dirname(v + '.html');
//     let entryDirname = '';
//
//     let basename = path.basename(pageDirname);
//     console.log(_entryConfig);
//     let confiig = {
//         // filename: 'view/' + basename + '.html',
//         filename: v + '.html',
//         template: 'src/' + v +'.html',
//         inject: 'body',
//         hash: true,
//         chunks: false
//     }
//     // if(v in entryConfig){
//     //     confiig.inject = 'body';
//     //     confiig.chunks = ['vendors',v]
//     // }
//
//
//     entryList.forEach( function (v,i) {
//         entryDirname = path.dirname( v + '.js');
//         if( pageDirname == entryDirname){
//             confiig.inject = 'body';
//             confiig.chunks = ['vendors',v]
//         }
//     } );
//     module.exports.plugins.push(new htmlWebpackPlugin(confiig));
// });
