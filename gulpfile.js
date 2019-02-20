const { src, dest, parallel, watch } = require("gulp");
const pug = require("gulp-pug");
const less = require("gulp-less");
const minifyCSS = require("gulp-csso"); // 压缩css
const concat = require("gulp-concat");

const gulpif = require("gulp-if"); // gulp if 判断环境
const minimist = require("minimist"); // 解析参数
const autoprefixer = require("gulp-autoprefixer"); // 添加前缀

const browserSync = require("browser-sync"); // 实时重载
const reload = browserSync.reload; // 实时重载

const watchs = require("gulp-watch"); // 只重新编译被更改过的文件
const htmlmin = require("gulp-htmlmin"); // 压缩html

const tap = require("gulp-tap"); // 处理文件

const path = require("path"); // 路径

// 获取环境变量
let knownOptions = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || "production"
  }
};
let options = minimist(process.argv.slice(2), knownOptions);
let envBoolean = options.env === "production";

let pathUrlHtml = "src/html/**/*.+(pug|html)";
let pathUrlCss = "src/css/**/*.less";
let pathUrlJs = "src/js/**/*.js";
let pathUrlImg = "src/img/**/*";

function serve() {
  browserSync({
    server: {
      baseDir: "./build"
    }
  });

  watch(pathUrlHtml, html);
  watch(pathUrlCss, css);
  watch(pathUrlJs, js);
  // watch(pathUrlImg, img);
}

function html() {
  let booleanHtml = false; // true pug | false html
  return (
    src(pathUrlHtml)
      .pipe(watchs(pathUrlHtml))
      // .pipe(tap((file) => {
      //   console.log(file);
      //   console.log(file.path)
      //   if (path.extname(file.path) === '.html') {

      //   } else if (path.extname(file.path) === '.pug') {}
      // }))
      .pipe(gulpif(booleanHtml, pug())) // 编译pug
      .pipe(
        gulpif(
          !booleanHtml,
          htmlmin({
            collapseWhitespace: true,
            removeComments: true
          })
        )
      ) // 压缩html
      .pipe(dest("build"))
      .pipe(
        reload({
          stream: true
        })
      )
  );
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
    .pipe(
      reload({
        stream: true
      })
    );
}

function js() {
  return (
    src(pathUrlJs, {
      sourcemaps: !envBoolean
    })
      // .pipe(concat("app.min.js"))
      .pipe(
        dest("build/js", {
          sourcemaps: !envBoolean
        })
      )
  );
}

function img() {
  return src(pathUrlImg).pipe(dest("build/img"));
}
img();
// exports.js = js;
// exports.css = css;
// exports.html = html;
// exports.default = parallel(html, css, js);
exports.default = parallel(serve);
