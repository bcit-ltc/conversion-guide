// jshint node:true

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';
import { partialProcessor } from './gulp-partial-processor.mjs';
import path from 'path';

const bs = browserSync.create();
const sassCompiler = gulpSass(sass);

const sassSources = "./scss/**/*.scss";
const cssDest = "./css";
const mapDest = "./maps";
const htmlSources = ["./pages/**/*.html", "./partials/**/*.html"];
const htmlDest = "./dist";

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
		.pipe(gulp.dest(htmlDest + '/css'))
		.pipe(bs.stream());
}

// Copy CSS files to dist directory
function copyCSS() {
	return gulp.src('./css/*.css')
		.pipe(gulp.dest(htmlDest + '/css'))
		.pipe(bs.stream());
}

// Copy assets to dist directory
function copyAssets() {
	return gulp.src('./assets/**/*', { encoding: false })
		.pipe(gulp.dest(htmlDest + '/assets'));
}

// Copy JS files to dist directory
function copyJS() {
	return gulp.src('./js/**/*')
		.pipe(gulp.dest(htmlDest + '/js'))
		.pipe(bs.stream());
}

// Process partials to convert XML-like tags to HTML
function processPartials() {
	return gulp.src('./partials/**/*.html')
		.pipe(partialProcessor())
		.pipe(gulp.dest('./processed-partials'));
}

// Process HTML files and include partials
function html() {
	return gulp.src('./pages/**/*.html')
		.pipe(fileInclude({
			prefix: '@@',
			basepath: path.resolve('./processed-partials/')
		}))
		.pipe(gulp.dest(htmlDest))
		.pipe(bs.stream());
}

// Build files once
gulp.task('build', gulp.series(processPartials, gulp.parallel(css, copyCSS, copyAssets, copyJS, html)));

// Run BrowserSync after HTML changes
/* gulp.task("sync", function () {
	// Pipe nothing
	return gulp.src("!./")
		.pipe(bs.stream());
}); */

// Watch and build files on change
gulp.task('watch', function () {
	processPartials();
	css();
	copyCSS();
	copyAssets();
	copyJS();
	html();
	bs.init({
		server: {
			baseDir: "./dist",
			middleware: function (req, res, next) {
				// Handle clean URLs
				const cleanUrls = {
					'/text': '/text.html',
					'/media': '/media.html',
					'/interactions': '/interactions.html',
					'/knowledge-check': '/knowledge-check.html',
					'/learning-blocks': '/learning-blocks.html',
					'/tables': '/tables.html',
					'/marker-reference': '/marker-reference.html'
				};
				
				if (cleanUrls[req.url]) {
					req.url = cleanUrls[req.url];
				}
				
				next();
			}
		}
	});
	gulp.watch('./partials/**/*', gulp.series(processPartials, html));
	gulp.watch(htmlSources, gulp.series(html));
	gulp.watch(sassSources, gulp.series(css, copyCSS));
	gulp.watch('./assets/**/*', gulp.series(copyAssets));
	gulp.watch('./js/**/*', gulp.series(copyJS));
});
