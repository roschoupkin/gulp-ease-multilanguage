'use strict';
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through2');
const parsePage = function (str, lang) {
  const substitute = new RegExp('gp\\{\\{([^(?!\\}\\})].[^(?!\\}\\})]*)\\}\\}', 'g');
  return str.replace(substitute, (s, str) => {
    const obj = JSON.parse('{'+str+'}');
    return obj[lang];
  });
};

module.exports = () => {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-multilanguage', 'Streaming not supported'));
      return;
    }

    try {
      const data = file.contents.toString()
        .split('\n')
        .map((line) => parsePage(line, 'en'))
        .join('\n');
      file.contents = new Buffer(data);;
      this.push(file);
    } catch (err) {
      this.emit('error', new PluginError('gulp-multilanguage', err));
    }

    cb();
  });
};