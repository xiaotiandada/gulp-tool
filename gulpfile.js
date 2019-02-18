const {
  src,
  dest,
  parallel
} = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso'); // 压缩css
const concat = require('gulp-concat');

const gulpif = require('gulp-if'); // gulp if 判断环境
var minimist = require('minimist'); // 解析参数

// 获取环境变量
let knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'production'
  }
};
let options = minimist(process.argv.slice(2), knownOptions);
let envBoolean = options.env === 'production';

function html() {
  return src('client/templates/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('client/templates/*.less')
    .pipe(less())
    .pipe(gulpif(envBoolean, minifyCSS()))
    .pipe(dest('build/css'))
}

function js() {
  return src('client/javascript/*.js', {
      sourcemaps: !envBoolean
    })
    .pipe(concat('app.min.js'))
    .pipe(dest('build/js', {
      sourcemaps: !envBoolean
    }))
}

// exports.js = js;
// exports.css = css;
// exports.html = html;
exports.default = parallel(html, css, js);