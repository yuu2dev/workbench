const path = require('path')
const dotenv = require('dotenv')
const { EnvironmentPlugin } = require('webpack')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: path.join(__dirname, './build/bundle.js'),
})
module.exports = (env) => {
    const config = dotenv.config({
        path: env.production ? '.env.production' : '.env.development',
    })
    const commonWebpack = {
        mode: process.env.NODE_ENV,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
    }
    const mainWebpack = Object.assign({}, commonWebpack, {
        target: 'electron-main',
        entry: path.resolve(__dirname, 'src', 'main.ts'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'build'),
        },
        plugins: [new EnvironmentPlugin({ ...config.parsed })],
    })
    const preloadWebpack = Object.assign({}, commonWebpack, {
        target: 'electron-preload',
        entry: path.resolve(__dirname, 'src', 'preload.ts'),
        output: {
            filename: 'preload.js',
            path: path.resolve(__dirname, 'build'),
        },
        plugins: [],
    })
    const fileManagerPlugin = new FileManagerPlugin({
        events: {
            onStart: {
                delete: [path.resolve(__dirname, 'build', 'dist')],
            },
            onEnd: {
                move: [
                    {
                        source: path.resolve(__dirname, 'webview', 'dist'),
                        destination: path.resolve(__dirname, 'build', 'dist'),
                    },
                ],
            },
        },
    })
    const electronReloadPlugin = ElectronReloadPlugin()
    const webpacks = [mainWebpack, preloadWebpack].map((webpack) => {
        if (env.production && webpack.target == 'electron-main') {
            webpack.plugins.push(fileManagerPlugin)
        } else {
            webpack.plugins.push(electronReloadPlugin)
        }
        return webpack
    })
    return webpacks
}
