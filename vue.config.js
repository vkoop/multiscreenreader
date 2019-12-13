const path = require('path');

module.exports = {
    //TODO cleaner solution with integration into gradle
    outputDir: path.resolve(__dirname, './src/main/resources/static'),

    pages: {
        first: {
            entry: __dirname + '/src/main/webapp/src/main.js',
            template: __dirname + '/public/index.html'
        },
        second: {
            entry: __dirname + '/src/main/webapp/src/secondMain.js',
            template: __dirname + '/public/indexSecond.html'
        }
    },

    configureWebpack: {
        context: __dirname + '/src/main/webapp/src',
        resolve: {
            alias: {
                '@': __dirname + '/src/main/webapp/src'
            }
        },
        entry: {
            app: './main.js'
        }
    }
};
