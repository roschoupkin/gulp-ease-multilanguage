'use strict';

const fs = require('fs');
const assert = require('assert');
const gutil = require('gulp-util');
const m = require('./');

it('default test', (done) => {
  const stream = m();

  stream.on('data', (file) => {
    const fixtures = fs.readFileSync('./test/output.html', 'utf-8');
    assert.equal(file.contents.toString(), fixtures.toString());
    done();
  });

  stream.write(new gutil.File({
    path: 'input.html',
    contents: fs.readFileSync('./input.html')
  }));

  stream.end()
});
