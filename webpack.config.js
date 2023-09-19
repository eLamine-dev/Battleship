// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
   mode: 'development',
   entry: './src/index.js',
   output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: '[name][ext]',
      clean: true,
   },
   devtool: 'inline-source-map',
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
         },

         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
         },
      ],
   },

   plugins: [
      new HtmlWebpackPlugin({
         title: 'Battleship',
         filename: 'index.html',
         template: path.resolve(__dirname, './src/index.html'),
      }),
   ],
};
