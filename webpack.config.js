const path = require('path');
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader');

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * @type import('webpack').Configuration
 */
const config = {
    mode: IS_DEV ? 'development' : 'production',
    entry: './src/main.ts',
    output: {
        filename: 'no-graph.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new VueLoaderPlugin(),
        new DefinePlugin({
          __DEV__: IS_DEV,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json'),
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
          '@': path.join(__dirname, './src')
        }
    },
};
module.exports = (env) => {
    console.log(`当前执行${IS_DEV ? 'development' : 'production'}模式`);
    return config;
}
