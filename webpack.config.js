var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'js');
var APP_DIR = path.resolve(__dirname, 'js');
var SPEC_DIR = path.resolve(__dirname, 'spec');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : [APP_DIR],
                exclude : /(node_modules)/,
                loader : 'babel',
                query: {
                    presets:['es2015','react']
                }
            }
            // ,
            // {
            //     test : /\.jsx?/,
            //     include : APP_DIR,
            //     exclude : /(node_modules)/,
            //     loader : 'imports'
            // }
            // ,
            // {
            //     test : /\.jsx?/,
            //     include : APP_DIR,
            //     exclude : /(node_modules)/,
            //     loader : 'exports'
            // }
        ]
    },
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false // https://github.com/webpack/webpack/issues/1496
            }
        })
    ]
};

module.exports = config;
