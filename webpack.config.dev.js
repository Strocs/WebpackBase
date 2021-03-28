const path = require('path') // Extensión que viene en node
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        main: './src/index.js', // El archivo de entrada
        about: './src/about.js'  
    } ,
    output: { // configuración de la salida
        path: path.resolve(__dirname, 'dist'), //nombre de la carpeta
        filename: '[name].[contenthash].js', // Nombre del el archivo unificado
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    mode: 'development',
    devtool: "source-map",
    resolve: { 
        extensions: ['.js'], // extensiones con las que voy a trabajar
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: { // forma de cargar modulos con sus exclusiones y usos
        rules: [
        {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css|.styl$/i,
            use: [MiniCssExtractPlugin.loader, 
            'css-loader',
            'stylus-loader'
        ],
        },
        {
            test: /\.png/,
            type: 'asset/resource'
        },
        {
            test: /\.(woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: "application/font-woff",
                    name: "[name].[contenthash].[ext]",
                    outputPath: "./assets/fonts/",
                    publicPath: "../assets/fonts/",
                    esModule: false,
                }
            }
        }
    ]},

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html', // ubicación del html
            filename: './index.html', // nombre de salid
            chunks: ['main'],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/about.html', // ubicación del html
            filename: './about.html', // nombre de salida
            chunks: ['about'],
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
            {
                from: path.resolve(__dirname, "src", "assets/images"),
                to: "assets/images"
            }
            ]
        }),
        new Dotenv(),
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        historyApiFallback: true,
        port: 3000,
    },
}