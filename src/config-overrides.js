const { GenerateSW } = require('workbox-webpack-plugin');


module.exports = {
    webpack: function (config, env) {
        //JS Overrides
        config.output.filename = 'static/js/[contenthash].main.bundle.js';
        if (env === "production") {
            config.output.chunkFilename = 'static/js/[contenthash].bundle.js';
        }
        config.plugins.push(new GenerateSW());

        config.optimization = {
            splitChunks: {
                chunks: 'all',
                minSize: 200000,
                maxSize: 800000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                },
            },
        }

        return config;
    }
};