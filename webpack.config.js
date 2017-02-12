var webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

// definePlugin 会把定义的string 变量插入到Js代码中。
console.log(process.env.NODE_ENV)
var definePlugin = new webpack.DefinePlugin({
    __production__: JSON.stringify(process.env.NODE_ENV=='production'),
});



var config = {
    context: __dirname + '/script',
    entry: {
        app: ['./app.js'],

    },
    output: {
        path: __dirname + '/script',
        filename: 'app.bundle.js',
        publicPath: '/script/',
    },

    devServer: {
        hot: true,
        port: 3333,
        // proxy: {
        //     '*': {
        //         target: 'http://sf_admin.testapp.org',
        //         secure: false,
        //         changeOrigin: true
        //     },
        // },
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|3rd)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components|3rd)/,
                loader: ExtractTextPlugin.extract("style", "css?sourceMap")
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style', // backup loader when not building .css file
                    'css?sourceMap!sass?sourceMap' // loaders to preprocess CSS
                )
            },
            {test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/, loader: 'url-loader?limit=100000'}
        ]
    },
    resolve: {
    },
    plugins: [
        //reusePlugin,
        new ExtractTextPlugin("app.bundle.css"),
        definePlugin
    ]

};

module.exports = config;