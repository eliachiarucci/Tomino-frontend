const CracoAntDesignPlugin = require("craco-antd");
const path = require("path");
process.env.BROWSER = "none";

module.exports = {
  plugins: [{
    plugin: CracoAntDesignPlugin,
     options: {
        customizeThemeLessPath: path.join(
          __dirname,
          "src/style/antd.customize.less"
        )
      },
    },
  ],
};