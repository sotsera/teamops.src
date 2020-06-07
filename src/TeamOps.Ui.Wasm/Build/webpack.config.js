const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const magicImporter = require("node-sass-magic-importer");

module.exports = (env) => {

    var isDevelopment = env === "development";
    var isForGithubPages = env === "github";
    var mode = isDevelopment ? env : "production";

    printBanner(env, mode);

    const config = {
        entry: {
            teamops: path.resolve("../teamops.js")
        },
        mode: mode,
        devtool: isDevelopment ? "source-map" : "",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader, options: { hmr: isDevelopment } },
                        { loader: "css-loader" },
                        { loader: "postcss-loader", options: { config: { path: "./" } } },
                        { loader: "sass-loader", options: { implementation: require("sass"), sassOptions: { importer: magicImporter() } } }
                    ]
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, "../wwwroot"),
            filename: isDevelopment ? "[name].js" : "[name]-[contenthash:8].min.js",
            crossOriginLoading: "anonymous"
        },
        plugins: [
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["index.html", "teamops*.{js,css}*", "spinner*.{js,css}*"] }),
            new MiniCssExtractPlugin({
                filename: isDevelopment ? "[name].css" : "[name]-[contenthash:8].min.css",
                chunkFilename: isDevelopment ? "[id].css" : "[id]-[contenthash:8].min.css"
            }),
            new SriPlugin({ hashFuncNames: ["sha384"], enabled: true }),
            new HtmlWebpackPlugin({
                inject: false,
                template: "../Layout/index.html",
                minify: {
                    minifyJS: true,
                    minifyCSS: true
                },
                isForGithubPages: isForGithubPages
            }),
            new HtmlBeautifyPlugin({
                config: {
                    html: {
                        end_with_newline: true,
                        indent_size: 2,
                        indent_with_tabs: false,
                        indent_inner_html: true,
                        preserve_newlines: false,
                        unformatted: ["p", "i", "b", "span"]
                    }
                }
            })
        ]
    }

    return config;
};

function printBanner(env, mode) {
    const message = `Teamops configuration: ${env} - mode: ${mode}`;

    console.log("-".repeat(message.length));
    console.log(message);
    console.log("-".repeat(message.length));
}