const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const magicImporter = require("node-sass-magic-importer");

module.exports = (env) => {

    var isDevelopment = env === "development";
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
            filename: isDevelopment ? "[name].js" : "[name]-[contenthash:8].js",
            crossOriginLoading: "anonymous"
        },
        plugins: [
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["index.html", "teamops*.{js,css}*", "spinner*.{js,css}*"] }),
            new MiniCssExtractPlugin({
                filename: isDevelopment ? "[name].css" : "[name]-[contenthash:8].css",
                chunkFilename: isDevelopment ? "[id].css" : "[id]-[contenthash:8].css"
            }),
            new SriPlugin({ hashFuncNames: ["sha384"], enabled: true }),
            new HtmlWebpackPlugin({ minify: false, inject: false, template: "../Layout/index.html" })
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