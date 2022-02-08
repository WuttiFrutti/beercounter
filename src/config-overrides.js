const { GenerateSW } = require('workbox-webpack-plugin');


module.exports = {
    webpack: function (config, env) {
        //JS Overrides
        config.output.filename = 'static/js/main.js';
        if (env === "production") {
            config.output.chunkFilename = 'static/js/[contenthash].bundle.js';
        }
        config.plugins.push(new GenerateSW())

        return config;
    }
};