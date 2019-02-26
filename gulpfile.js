const {
  src,
  dest,
  parallel,
  watch
} = require("gulp");
const less = require("gulp-less");
const minifyCSS = require("gulp-csso"); // 压缩css
const concat = require("gulp-concat"); // 合并

const gulpif = require("gulp-if"); // gulp if 判断环境
const minimist = require("minimist"); // 解析参数
const autoprefixer = require("gulp-autoprefixer"); // 添加前缀

const browserSync = require("browser-sync"); // 实时重载
const reload = browserSync.reload; // 实时重载

const watchs = require("gulp-watch"); // 只重新编译被更改过的文件
const htmlmin = require("gulp-htmlmin"); // 压缩html

const rev = require("gulp-rev"); //  添加后缀
const revCollector = require("gulp-rev-collector"); // html添加后缀
const rename = require("gulp-rename"); // 重命名
const clean = require("gulp-clean"); // 删除
const browserify = require('browserify');
const log = require('gulplog');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const tsify = require("tsify");

// 获取环境变量
let knownOptions = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || "production"
  }
};
let options = minimist(process.argv.slice(2), knownOptions);
let envBoolean = options.env === "production";

// path 路径
let pathUrlRev = "src/rev/**/*.json";
let pathUrlHtml = "src/html/**/*.html";
let pathUrlCss = "src/css/**/*.less";
let pathUrlJs = "src/js/**/main-*.ts";
let pathUrlImg = "src/img/**/*";

let cleanPathUrlJs = 'build/js/**/*.js'

function serve() {
  browserSync({
    server: {
      baseDir: "./build"
    }
  });

  watch([pathUrlRev, pathUrlHtml], html).on('change', reload)
  watch(pathUrlCss, css).on('change', reload)
  watch(pathUrlJs, js).on('change', reload)
}

function html() {
  return src([pathUrlRev, pathUrlHtml])
    .pipe(revCollector())
    .pipe(
      gulpif(
        envBoolean,
        htmlmin({
          collapseWhitespace: true,
          removeComments: true
        })
      )
    ) // 压缩html
    .pipe(
      rename({
        dirname: "./"
      })
    )
    .pipe(dest('build'))
}

function css() {
  return src(pathUrlCss)
    .pipe(watchs(pathUrlCss))
    .pipe(less())
    .pipe(gulpif(envBoolean, minifyCSS())) // 压缩css
    .pipe(
      gulpif(
        envBoolean,
        autoprefixer({
          // 添加前缀
          browsers: ["last 2 versions"],
          cascade: false
        })
      )
    )
    .pipe(dest("build/css"))
}

function js() {
  // cleanJs()
  // return (
  //   src(pathUrlJs, {
  //     sourcemaps: !envBoolean
  //   })
  //   // .pipe(concat("app.min.js"))
  //   .pipe(rev())
  //   .pipe(
  //     dest("build/js", {
  //       sourcemaps: !envBoolean
  //     })
  //   )
  //   .pipe(rev.manifest())
  //   .pipe(dest('src/rev'))
  // );

  return src(pathUrlJs, {
      read: false
    })
    .pipe(tap(function (file) {
      log.info('bundling ' + file.path);
      file.contents = browserify(file.path, {
          debug: true
        })
        .plugin(tsify)
        .bundle();
    }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(
      rename({
        dirname: "./",
        extname: ".min.js"
      })
    )
    .pipe(
      dest("build/js", {
        sourcemaps: !envBoolean
      })
    )

}

function cleanJs() {
  return src(cleanPathUrlJs, {
    read: false
  }).pipe(clean())
}

function img() {
  return src(pathUrlImg).pipe(dest("build/img"));
}

img()
exports.default = parallel(serve);