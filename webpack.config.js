var webpack = require('webpack');

var config = {
    entry: './index.js',
    output: {
        filename: 'app.js'
    },

    devServer: {
        hot: true,
        port: 3333
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env'],
                    }
                }
            }
        ]
    }

};

module.exports = config;