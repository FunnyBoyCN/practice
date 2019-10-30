module.exports = {
    plugins: {
        'autoprefixer': {
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
        },
        "postcss-px-to-viewport": {
            "viewportWidth": 375,
            "viewportHeight": 667,
            "minPixelValue": 1,
            "unitPrecision": 3,
            "propList": ['*','!font*'],
            "selectorBlackList":['.navbar','.cartBottom']
        }
    }
}
