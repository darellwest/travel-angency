
const { dest, src, watch, series }  = require('gulp'),
	postcss          				= require("gulp-postcss"),
	browserSync 					= require("browser-sync").create(),
	autoprefixer 					= require("autoprefixer"),
	cssvars 						= require("postcss-simple-vars"),
	postcss_nested  				= require("postcss-nested"),
	cssImport 						= require("postcss-import"),
	plumber 						= require("gulp-plumber"),
	mixin 							= require("postcss-mixins"),
	svgSprite 						= require("gulp-svg-sprite"),
	rename 							= require("gulp-rename"),
	del                             = require("del");

	const config = {
		mode: {
			css: {
				sprite: "sprite.svg",
				render: {
					css: {
						template: "gulp/templates/sprite.css"
					}
				}
			}
		}
	}

function beginClean(){
	return del(["app/temp/sprite", "app/assets/images/sprites"]);
}

function copySpriteGraphics(){
	return src("app/temp/sprite/css/**/*.svg")
	.pipe(dest("app/assets/images/sprites"));
}

function createSprite(){
	return src("./app/assets/images/icons/**/*.svg")
		.pipe(svgSprite(config))
		.pipe(dest("./app/temp/sprite/"));
}

function copySpriteCSS(){
	return src("app/temp/sprite/css/*.css")
	.pipe(rename("_sprite.css"))
	.pipe(dest("./app/assets/styles/modules"));
}

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

function endClean(){
	return del("./app/temp/sprite/");
}

exports.default = series(beginClean, createSprite, copySpriteGraphics, copySpriteCSS, endClean);
