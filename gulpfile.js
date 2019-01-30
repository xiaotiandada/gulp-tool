const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const cssmin = require('gulp-minify-css');
// 生成sourcemap文件
const sourcemaps = require('gulp-sourcemaps');
// 出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();


const babel = require("gulp-babel");
const concat = require("gulp-concat");
const autoprefixer = require('gulp-autoprefixer');


// ts

const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");

const buffer = require('vinyl-buffer');

const imagemin = require('gulp-imagemin') // 压缩图片
const cache = require('gulp-cache') // 缓存
const htmlmin = require('gulp-htmlmin') // html

const es = require('event-stream')
const rename = require("gulp-rename")

gulp.task('watch', ['build-html', 'build-less', 'build-css', 'build-ts', 'build-js', 'build-img', 'build-lib'], function () {
    browserSync.init({
        server: './dist',
        port: '5500',
        open: true,
    })
    gulp.watch('./src/**/*.html', ['build-html']);
    gulp.watch('./src/less/**/*.less', ['build-less']);
    gulp.watch('./src/css/**/*.css', ['build-css']);
    // gulp.watch('./src/es6/**/*.js', ['build-es6']);
    gulp.watch('./src/ts/**/*.ts', ['build-ts']);
    gulp.watch('./src/js/**/*.js', ['build-js']);
    gulp.watch('./src/img/**/*.+(png|jpg|jpeg|gif|svg)', ['build-img']);
    gulp.watch('./src/lib/*', ['build-lib']);
})


gulp.task('build-html', function () {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
})

gulp.task('build-less', function () {
    return gulp.src('./src/less/**/index-*.less')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(cssmin())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

/**
 * 压缩第三方css
 */
gulp.task('build-css', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css/public'))
})

// es6
// gulp.task('build-es6', function () {
//     return gulp.src('./src/es6/**/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         .pipe(uglify({
//             mangle: false
//         }))
//         // .pipe(concat("all.js"))
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest("./dist/js"))
//         .pipe(browserSync.stream())
// });

/**
 * ts
 */
gulp.task("build-ts", function (done) {
    gulp.src('./src/ts/**/main-*.ts', function (err, files) {
        if (err) done(err)
        var tasks = files.map(function (entry) {
            return browserify({
                    basedir: '.',
                    debug: true,
                    entries: entry
                })
                .plugin(tsify)
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    dirname: './',
                    extname: ".min.js"
                }))
                .pipe(buffer())
                .pipe(uglify())
                .pipe(sourcemaps.init({
                    loadMaps: true
                }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest("dist/js"))
                .pipe(browserSync.stream())
        })
        es.merge(tasks).on('end', done)
    })
});

/**
 * 压缩第三方js
 */
gulp.task('build-js', function () {
    return gulp.src('./src/js/**/*.js')
        // .pipe(uglify({
        //     mangle: false
        // }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('build-img', function () {
    return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
})

gulp.task('build-lib', function () {
    return gulp.src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib'))
});


gulp.task('default', ['watch']);