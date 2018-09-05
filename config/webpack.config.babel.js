import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import PostcssPresetEnv from 'postcss-preset-env';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import getClientEnvironment from './env';
import postcssConfig from './postcss.config';

const env = getClientEnvironment('development');
const shouldUseSourceMap = env.raw.GENERATE_SOURCE_MAP !== 'false';

export default {
  mode: 'development',
  devtool: shouldUseSourceMap ? 'cheap-module-source-map' : false,
  entry: ['react-dev-utils/webpackHotDevClient', path.resolve('src/index.js')],
  resolve: {
    modules: [path.resolve('src'), path.resolve('node_modules')],
    extensions: ['.js', '.json'],
    alias: {
      '@assets': path.resolve('src/assets'),
      modernizr$: path.resolve('.modernizrrc'),
    },
  },
  output: {
    path: path.resolve('.tmp'),
    filename: '[name].js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: false,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
        exclude: [/[/\\\\]node_modules[/\\\\]/],
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                highlightCode: true,
                plugins: [
                  'react-hot-loader/babel',
                  [
                    'react-css-modules',
                    {
                      generateScopedName: '[name]__[local]___[hash:base64:5]',
                      webpackHotModuleReloading: true,
                    },
                  ],
                ],
              },
            },
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
                options: {
                  sourceMap: shouldUseSourceMap,
                },
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: shouldUseSourceMap,
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: shouldUseSourceMap,
                  ident: 'postcss',
                  plugins: () => [
                    PostcssPresetEnv(postcssConfig),
                  ],
                },
              },
            ],
          },
          {
            test: /\.svg$/,
            issuer: /\.js$/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'react-svg-loader',
                options: {
                  jsx: true, // true outputs JSX tags,
                },
              },
            ],
          },
          {
            type: 'javascript/auto',
            test: /modernizrrc(\.json)?$/,
            use: ['modernizr-loader', 'json-loader'],
          },
          {
            test: /\.(jpe?g|jpg|gif|ico|png|woff|woff2|eot|ttf|webp)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new StyleLintPlugin({
      context: path.resolve('src'),
      files: '**/*.css',
      emitErrors: false,
      failOnError: false,
      quiet: false,
    }),
    new CopyWebpackPlugin([path.resolve('public')]),
    new HTMLWebpackPlugin({
      template: path.resolve('public/index.html'),
    }),
  ],
  devServer: {
    contentBase: '.tmp',
    watchContentBase: true,
    hot: true,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 3000,
    before(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};
