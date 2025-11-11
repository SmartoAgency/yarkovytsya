/* eslint-disable linebreak-style */
const webpack = require('webpack');

const config = {
  mode: process.argv.includes('--production') ? 'production' : 'development',
  entry: {
    'immediate-loading': './src/assets/scripts/immediate-loading.js',
    index: './src/assets/scripts/index-app.js',
    home: './src/assets/scripts/home.js',
    plannings: './src/assets/scripts/plannings.js',
    'single-project': './src/assets/scripts/gulp-modules/single-project.js',
    'single-flat': './src/assets/scripts/single-flat.js',
    'single-news': './src/assets/scripts/single-news.js',
    compare: './src/assets/scripts/gulp-modules/compare.js',
    news: './src/assets/scripts/news.js',
    projects: './src/assets/scripts/projects.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto', // ✅ ВАЖЛИВО!
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images/',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks(chunk) {
            return chunk.name !== 'immediate-loading';
          },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
