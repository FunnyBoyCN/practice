/**
 * Created by sun77 on 2019/7/31.
 */
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const path=require('path')
module.exports={
    configureWebpack:{
      plugins:[
          new SkeletonWebpackPlugin({
              webpackConfig: {
                  entry: {
                      app: path.join(__dirname, './src/skeleton/skeleton.js')
                  }
              },
              minimize: true,
              quiet: true,
              router: {
                  mode: 'history',
                  routes: [
                      {
                          path: '/',
                          skeletonId: 'skeleton-home'
                      }
                  ]
              }
          })
      ]
    },
    css:{
        extract: true,
        loaderOptions:{
            sass:{
                data:`@import "~@/style/theme.scss";`
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/practice/fruitShop/dist/'
        : '',
}