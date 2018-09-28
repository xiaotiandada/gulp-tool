const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const cssmin = require('gulp-minify-css');
// 生成sourcemap文件
const sourcemaps = require('gulp-sourcemaps');
// 出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）
const notify = require('gulp-notify');
const plumber  = require('gulp-plumber');

const browserSync = require('browser-sync').create();


const babel = require("gulp-babel");
const concat = require("gulp-concat");
const autoprefixer = require('gulp-autoprefixer');

gulp.task('watch',['build-html','build-less','build-js'],function(gulpCallback){
    browserSync.init({
        server: './dist',
        open : true
    },function callback(){
        gulp.watch('./src/**/*.html',['build-html']);
        gulp.watch('./src/less/**/*.less',['build-less']);
        gulp.watch('./src/es6/**/*.js',['build-js']);
        gulpCallback();
    });
});

gulp.task('build-html', function () {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
})

gulp.task('build-less',function(){
    return gulp.src('./src/less/*.less')
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less({
        paths : [path.join(__dirname,'less','includes')]
    }))
    // .pipe(cssmin())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('build-js',function(){
    return gulp.src('./src/es6/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    // .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream())
});

gulp.task('default',['watch']);
