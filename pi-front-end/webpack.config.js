const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './src/main.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                /*                 query: {
                                    presets: ['es2015', 'react']
                                } */
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?url=false"
                })
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, "src"),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader?url=false', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            title: 'React Starter',
            template: 'index.ejs'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'main.css'
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
      }

}
