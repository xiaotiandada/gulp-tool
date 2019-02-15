const gulp = require("gulp");
const browserify = require("browserify");
const log = require("gulplog");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
// var buffer = require('vinyl-buffer');
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const less = require("gulp-less");
const path = require("path");
const cssmin = require("gulp-minify-css");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();

const babel = require("gulp-babel");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");

// ts

const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

const source = require("vinyl-source-stream");
const tsify = require("tsify");

// const buffer = require('vinyl-buffer');

const imagemin = require("gulp-imagemin"); // 压缩图片
const cache = require("gulp-cache"); // 缓存
const htmlmin = require("gulp-htmlmin"); // html

const es = require("event-stream");
const rename = require("gulp-rename");

const changed = require("gulp-changed");

const watchify = require("watchify");


var watch = require('gulp-watch');

gulp.task("watch", function () {
  browserSync.init({
    server: "./dist",
    port: "5500",
    open: true
  });
  gulp.watch("./src/**/*.html", ["build-html"]);
  gulp.watch("./src/less/**/*.less", ["build-less"]);
  gulp.watch("./src/js/**/*", ["build-js"]);
  gulp.watch("./src/img/**/*", ["build-img"]);
  gulp.watch("./src/lib/*", ["build-lib"]);
});

gulp.task("build-html", function () {
  gulp
    .src("./src/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("build-less", function () {
  gulp
    .src("./src/less/**/index-*.less")
    .pipe(watch("./src/less/**/index-*.less"))
    // .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")]
      })
    )
    .pipe(cssmin())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    // .pipe(sourcemaps.write())
    .pipe(
      rename({
        dirname: "./",
        extname: ".min.css"
      })
    )
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// gulp.task("build-js", function (done) {
//     gulp.src('./src/js/**/main-*.+(js|ts)', function (err, files) {
//         if (err) done(err)
//         var tasks = files.map(function (entry) {
//             return watchify(browserify({
//                     basedir: '.',
//                     debug: true,
//                     entries: entry
//                 }))
//                 .plugin(tsify)
//                 .bundle()
//                 .pipe(source(entry))
//                 .pipe(rename({
//                     dirname: './',
//                     extname: ".min.js"
//                 }))
//                 .pipe(plumber({
//                     errorHandler: notify.onError('Error: <%= error.message %>')
//                 }))
//                 .pipe(changed('src/js/**/*.(ts||js)'))
//                 .pipe(buffer())
//                 .pipe(uglify())
//                 // .pipe(babel())
//                 // .pipe(sourcemaps.init({
//                 //     loadMaps: true
//                 // }))
//                 // .pipe(sourcemaps.write('./'))
//                 .pipe(gulp.dest("dist/js"))
//                 .pipe(browserSync.stream())
//         })
//         es.merge(tasks).on('end', done)
//     })
// });

gulp.task("build-js", function () {
  return gulp.src('src/js/**/main-*.ts', {
      read: false
    })
    .pipe(watch('src/js/**/main-*.ts'))
    .pipe(tap(function (file) {
      log.info('bundling ' + file.path);
      file.contents = browserify(file.path, {
        debug: true
      }).plugin(tsify).bundle();
    }))
    .pipe(buffer())
    // .pipe(sourcemaps.init({
    //     loadMaps: true
    // }))

    .pipe(uglify())
    .pipe(rename({
      dirname: './',
      extname: ".min.js"
    }))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task("build-img", function () {
  gulp
    .src("./src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/img"));
  // .pipe(browserSync.stream());
});

gulp.task("build-lib", function () {
  gulp.src("./src/lib/**/*").pipe(gulp.dest("./dist/lib"));
});

gulp.task("default", ["watch"]);