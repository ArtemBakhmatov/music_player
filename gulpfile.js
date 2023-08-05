const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require("gulp-clean-css");
const browsersync = require("browser-sync");
const fileinclude = require('gulp-file-include');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

const dist = "./dist";

gulp.task("html", () => {
    return gulp.src("./src/*.html")
        .pipe(fileinclude())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(dist))
        .pipe(browsersync.stream());
});

gulp.task("scripts", () => {
    return gulp.src("./src/js/script.js")
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: true,
            devtool: "source-map",
        }))
        .pipe(gulp.dest(dist + '/js'))
        .pipe(browsersync.stream());
});

gulp.task("styles", () => {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("src/css"))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist/css/"))
        .pipe(browsersync.stream())
});

gulp.task('icons', function() {
    return gulp.src("./src/icons/**/*")
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('images', function() {
    return gulp.src("./src/img/**/*")
        .pipe(gulp.dest('dist/img'));
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });

    gulp.watch("./src/html/", gulp.parallel("html"));
    gulp.watch("./src/icons/**/*", gulp.parallel("icons"));
    gulp.watch("./src/img/**/*", gulp.parallel("images"));
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("styles"));
});

gulp.task("build", gulp.parallel("html", "scripts", "styles", "icons", "images"));

gulp.task("default", gulp.parallel("watch", "build"));

gulp.task("scripts-min", () => {
    return gulp.src("./src/js/script.js")
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
        }))
        .pipe(gulp.dest(dist + '/js'));
});