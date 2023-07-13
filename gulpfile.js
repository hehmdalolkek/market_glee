import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import autoPrefixer from 'gulp-autoprefixer';
import gulpUglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
const { src, dest, watch, parallel, series } = gulp;
const scss = gulpSass( dartSass );


function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoPrefixer({
			grid: true,
			overrideBrowserslist: 'last 10 versions'
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/slick-carousel/slick/slick.js',
		'app/js/main.js'
	])
	.pipe(concat('main.min.js'))
	.pipe(gulpUglify())
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function images() {
	return src('app/images/**/*.*')
	.pipe(imagemin())
	.pipe(dest('dist/images'))
}

function cleanDist() {
	return deleteAsync('dist/**')
}

function build() {
	return src([
		'app/**/*.html',
		'app/css/style.min.css',
		'app/js/main.min.js'
	], {base: 'app'})
	.pipe(dest('dist'))
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		notify: false
	})
}

function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload);
}


export const runStyles = styles;
export const runScripts = scripts;
export const runImages = images;
export const runCleanDist = cleanDist;
export const runBuild = build;
export const runBrowsersync = browsersync;
export const runWatching = watching;

gulp.task('default', parallel(styles, scripts, browsersync, watching));
gulp.task('project', series(cleanDist, images, build));