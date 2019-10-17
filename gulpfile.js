
const { dest, src, watch } = require('gulp'),
	postcss = require("gulp-postcss"),
	browserSync = require("browser-sync").create(),
	autoprefixer = require("autoprefixer"),
	cssvars = require("postcss-simple-vars"),
	postcss_nested = require("postcss-nested"),
	cssImport = require("postcss-import"),
	plumber = require("gulp-plumber"),
	mixin = require("postcss-mixins");


function anerror(errorInfo){
	if(errorInfo){
		console.log(errorInfo.toString());
	}
	this.emit('end');
}

exports.watcher = function watcher(cb) {
	browserSync.init({
		notify:false,
		server: "./app"
	});

  watch("./app/assets/styles/**/*.css", styles);
  watch("app/*.html").on("change", browserSync.reload);

  cb();
}

function styles() {
 return src("./app/assets/styles/styles.css")
 	.pipe(plumber())
 	.pipe(postcss([cssImport, mixin, cssvars, postcss_nested, autoprefixer]))
 	.pipe(dest("./app/temp/styles")).pipe(browserSync.stream());
}