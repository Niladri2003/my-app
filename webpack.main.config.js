module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  externals: {
    pinggy: "commonjs2 pinggy",
    winston: "commonjs2 winston",
    "@pinggy/pinggy": "commonjs2 @pinggy/pinggy",
  },
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
};
