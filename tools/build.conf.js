({
  mainConfigFile: '../requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond'
  },
  baseUrl: '..',
  name: 'permalink-hub',
  include: [
    'almond'
  ],
  out: "../dist/permalink-hub.min.js",
  cjsTranslate: true,
  optimize: "none",
  preserveLicenseComments: false,
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true,
  onBuildRead: function(moduleName, path, contents) {
    switch (moduleName) {
      case "jquery":
        contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})
