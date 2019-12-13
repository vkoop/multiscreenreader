module.exports = {
    pages: {
        first: {
            entry: __dirname + '/src/webapp/src/main.js',
            template: __dirname + '/public/index.html'
        },
        second: {
            entry: __dirname + '/src/webapp/src/mainSecond.js',
            template: __dirname + '/public/indexSecond.html'
        }
    },

    configureWebpack: {
        context: __dirname + '/src/webapp/src',
        resolve: {
            alias: {
                '@': __dirname + '/src/webapp/src'
            }
        }
    }
};
