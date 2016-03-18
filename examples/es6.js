require('babel-register')({
  'presets': [
    'babel-polyfill',
    'es2015',
    'babel-preset-stage-0'
  ]
});

require('./basic.js');
