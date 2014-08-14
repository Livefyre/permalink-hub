require.config({
  paths: {
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    inherits: 'lib/inherits/inherits',
    rework: 'lib/rework/rework',
    debug: 'lib/debug/debug'
  },
  packages: [{
    name: "permalink-hub",
    location: "src",
    main: "main"
  }],
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'jasmine-jquery': {
      deps: ['jquery', 'jasmine']
    },
    rework: {
      exports: 'rework'
    }
  }
});
