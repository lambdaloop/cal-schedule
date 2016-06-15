var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    entry: {
        bundle: "./app.jsx"
    },
    output: {
        path: 'build',
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'babel', query: { presets:['react'] } },

            { test: /\.css$/, loader: "style-loader!css-loader?-minimize" },
            { test: /\.less$/, loader: "style-loader!css-loader?-minimize!less-loader" },

            // **IMPORTANT** This is needed so that each bootstrap js file required by
            // bootstrap-webpack has access to the jQuery object
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
            
            // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
            // loads bootstrap's css.
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?\d*$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }, sourceMap: false
        // })
        // new CompressionPlugin({
        //     asset: "{file}.gz",
        //     algorithm: "gzip",
        //     regExp: /\.js$|\.html$/,
        //     threshold: 10240,
        //     minRatio: 0.8
        // })
    ],
    cache: true
};
