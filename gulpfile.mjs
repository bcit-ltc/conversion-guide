// jshint node:true

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';

const bs = browserSync.create();
const sassCompiler = gulpSass(sass);

const sassSources = "./scss/**/*.scss";
const cssDest = "./css";
const mapDest = "./maps";
const htmlSources = ["./pages/**/*.html", "./partials/**/*.html"];

// Compiles Sass, autoprefixes, minifies, and creates sourcemaps
function css() {
	return gulp.src(sassSources)
		.pipe(sourcemaps.init())
		.pipe(sassCompiler().on('error', sassCompiler.logError))
		.pipe(autoprefixer())
		.pipe(cleanCSS({
			level: 1
		}))
		.pipe(sourcemaps.write(mapDest))
		.pipe(gulp.dest(cssDest))
		.pipe(bs.stream());
}

// Build files once
gulp.task('build', css);

// Run BrowserSync after HTML changes
/* gulp.task("sync", function () {
	// Pipe nothing
	return gulp.src("!./")
		.pipe(bs.stream());
}); */

// Watch and build files on change
gulp.task('watch', function () {
	css();
	bs.init({
		server: "./"
	});
	//gulp.watch(htmlSources, ['sync']);
	gulp.watch(htmlSources).on('change', bs.reload);
	gulp.watch(sassSources, gulp.series(css));
});
