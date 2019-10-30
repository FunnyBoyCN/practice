module.exports = {
  plugins: {
      'autoprefixer': {
          browsers: ['Android >= 4.0', 'iOS >= 7']
      },
      "postcss-px-to-viewport": {
          "viewportWidth": 375,
          "minPixelValue": 1,
          "unitPrecision": 3
      }
  }
}
