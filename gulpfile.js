const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const htmlMin = require("html-minifier").minify;
var map = require('map-stream');


//HTML
const htmlMinOption = {
	removeComments: true,
	collapseWhitespace: true,
	quoteCharacter: '"',
	decodeEntities: true,
	minifyCSS: true
};


const bundleConfig = JSON.parse(readFile('bundleconfig.json'));

const CORE_WEBPACK_PATH = ".framework/wp";
const WEBPACK_CONFIG = "webpackconfig";
const DIST_PATH = "dist";
const APP_PATH = "app";

const SOURCE_PATH = path.join(APP_PATH, "src");
const ASSETS_PATH = path.join(APP_PATH, "assets");
const CONFIG_PATH = path.join(APP_PATH, "config");
const DATA_PATH = path.join(APP_PATH, "data");
const CULTURE_PATH = path.join(APP_PATH, "culture");
const BUILD_PATH = path.join(ASSETS_PATH, "build");
const WEBPACK_PATH = path.join(SOURCE_PATH, "webpack");
const TEMPLATE_PATH = path.join(SOURCE_PATH, "template");
const AUTOGEN_PATH = path.join(SOURCE_PATH, "_autogen");
const STARTUP_FILE = path.join(SOURCE_PATH, "startup.js");

const CSS_FILES = [
	"app/src/webpack/ui/*.css",
];

const CORE_WP_PREFIX = "wp.core.";

String.prototype.replaceAll = function (n, t) {
	return this.split(n).join(t);
};


String.prototype.format = function () {
	for (var t = this, i, n = 0; n < arguments.length; n++)
		i = new RegExp("\\{" + n + "\\}", "gi"),
			t = t.replace(i, arguments[n]);
	return t;
};



var BUILD_VERSION = "";
if (bundleConfig.version) BUILD_VERSION = "-" + bundleConfig.version;



function checkValue(obj, value) {
	let check = false;
	Object.keys(obj).forEach(function (x) {
		if (obj[x] == value) {
			check = true;
		}
	});

	return check;
}


let webpack_files = [];
let compress = false;
let outputName = bundleConfig.output;

let core_webpack_config = {};
let core_webpack_files = [];
let core_webpack_map = {};

let enable_webpacks = JSON.parse(readFile(path.join(WEBPACK_CONFIG, "webpack.core.json"), 'utf-8'));
let webpack_map = JSON.parse(readFile(path.join(WEBPACK_CONFIG, "webpack.map.json"), 'utf-8'));

let js_files = [];
var webpackTemplate = readFile(path.join(__dirname, ".framework/webpack.tpl"));


function getScriptOutputName() {
	let ext = compress ? ".min.js" : ".js";
	return "{0}{1}{2}".format(outputName, BUILD_VERSION, ext);
}

function getStyleOutputName() {
	let ext = compress ? ".min.css" : ".css";
	return "{0}{1}{2}".format(outputName, BUILD_VERSION, ext);
}

function generateCSS(cb) {
	let css = CSS_FILES;
	if (css.length > 0) {
		console.log("==== Style config ===");
		console.log(css);
		let cssFileName = getStyleOutputName();
		console.log("==== Style output ===");
		console.log(cssFileName);
		gulp.src(css)
			.pipe(map(function (file, callback) {
				var fileContents = file.contents.toString();
				file.contents = new Buffer.from(fileContents);
				callback(null, file);
			}))
			.pipe(cleanCSS({ rebaseTo: BUILD_PATH }))
			.pipe(concat(cssFileName))
			.pipe(gulp.dest(BUILD_PATH))
			.on("end", function () {
				cb();
			});
	} else {
		console.log("No css file");
		cb();
	}

}


function loadCoreWebpackConfig(sourcePath) {
	if (!sourcePath) sourcePath = CORE_WEBPACK_PATH;
	readDir(sourcePath).forEach(function (filename) {
		let dirPath = path.join(sourcePath, filename);
		if (fs.lstatSync(dirPath).isDirectory()) {
			loadCoreWebpackConfig(dirPath);
		} else {
			let fileInfo = path.parse(dirPath);
			var ext = fileInfo.ext.toLocaleLowerCase();
			if (ext == ".json") {
				let config = JSON.parse(readFile(dirPath, 'utf-8'));
				config.path = path.join(fileInfo.dir, fileInfo.name + ".js");
				config.file = fileInfo.name;
				core_webpack_config[config.name] = config;
				//nếu mặc định enable thì cho vào config
				if (config.enable) {
					enable_webpacks[config.name] = true;
				}
			}
		}
	});
}


function loadCoreWebpackRequires() {
	let core_webpack_enable = {};
	let checked = {};

	let checkRequired = function (wpname) {
		checked[wpname] = true;

		if (!core_webpack_enable[wpname]) {
			core_webpack_enable[wpname] = true;
		}
		let config = core_webpack_config[wpname];
		if (Array.isArray(config.requires) && config.requires.length > 0) {
			config.requires.forEach(function (name) {
				if (!checked[name]) {
					checkRequired(name);
				}
			});
		}
	};

	//duyệt các webpacks đang cấu hình enable và lấy requires của nó
	Object.keys(enable_webpacks).forEach(function (name) {
		if (enable_webpacks[name] == true) {
			if (!checked[name]) {
				checkRequired(name);
			}

		}
	});

	//lấy file của các webpack
	Object.keys(core_webpack_enable).forEach(function (name) {
		let config = core_webpack_config[name];
		core_webpack_files.push(config.path);
		core_webpack_map[name] = CORE_WP_PREFIX + config.file;
	});

}


function loadWebpack(sourcePath) {
	if (!sourcePath) sourcePath = WEBPACK_PATH;
	readDir(sourcePath).forEach(function (filename) {
		let dirPath = path.join(sourcePath, filename);
		if (fs.lstatSync(dirPath).isDirectory()) {
			loadWebpack(dirPath);
		} else {
			let fileInfo = path.parse(dirPath);
			var ext = fileInfo.ext.toLocaleLowerCase();
			if (ext == ".js" && checkValue(webpack_map, fileInfo.name)) {
				webpack_files.push(dirPath);
			}
		}
	});
}



function printCoreWebpack() {
	let _content = [];
	Object.keys(core_webpack_config).forEach(function (name) {
		let config = core_webpack_config[name];
		let content = '//{0}\n{1}={2};\n'.format(config.des || "webpack", config.name, !!config.enable);
		_content.push(content);
	});
	writeFile(path.join(WEBPACK_CONFIG, "_autogen/webpack.core.default.js"), _content.join("\n"));
	console.log(_content.join("\n"));

}

function bundleCoreJS(cb) {
	loadCoreWebpackConfig();
	loadCoreWebpackRequires();
	printCoreWebpack();
	gulp.src(core_webpack_files)
		.pipe(map(function (file, cb) {
			let fileInfo = path.parse(file.path);
			var fileContents = file.contents.toString();
			var search = matchWebpack(fileContents);
			if (search.match) {
				fileContents = webpackTemplate.format(CORE_WP_PREFIX + fileInfo.name, search.content);
				file.contents = new Buffer.from(fileContents);
			}
			cb(null, file);
		}))
		.pipe(concat("_core_script.js"))
		.pipe(uglify())
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {
			cb();
		});

}

function bundleAppJS(cb) {
	//load webpack app
	loadWebpack();
	gulp.src(webpack_files.concat([STARTUP_FILE]))
		.pipe(map(function (file, cb) {
			let fileInfo = path.parse(file.path);
			var fileContents = file.contents.toString();
			var search = matchWebpack(fileContents);
			if (search.match) {
				fileContents = webpackTemplate.format(fileInfo.name, search.content);
				file.contents = new Buffer.from(fileContents);
			}
			cb(null, file);
		}))
		.pipe(concat("_app_script.js"))
		.pipe(uglify())
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {

			cb();
		});

}

function bundleJS(cb) {
	gulp.src([path.join(AUTOGEN_PATH, "_core_script.js"), path.join(AUTOGEN_PATH, "_app_script.js")])
		.pipe(map(function (file, cb) {
			let fileInfo = path.parse(file.path);
			var fileContents = file.contents.toString();
			var search = matchWebpack(fileContents);
			if (search.match) {
				fileContents = webpackTemplate.format(fileInfo.name, search.content);
				file.contents = new Buffer.from(fileContents);
			}
			cb(null, file);
		}))
		.pipe(concat("_script.js"))
		.pipe(uglify())
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {
			cb();
		});

}

function generateJS(cb) {
	var global = bundleConfig.global;
	var wrapTemplate = readFile(path.join(__dirname, ".framework/wrap.tpl"));

	var script = [];

	//config
	var configPath = path.join(CONFIG_PATH, "config.json");
	var scriptConfig = "loadConfig({0});".format(readFile(configPath, 'utf-8'));
	script.push(scriptConfig);
	//webpack
	Object.assign(webpack_map, core_webpack_map, webpack_map);
	console.log("====== webpack map =====");
	console.log(webpack_map);
	var webpackConfig = "loadWebpackConfig({0});".format(JSON.stringify(webpack_map));
	script.push(webpackConfig);
	//READ DATA JSON
	readDir(DATA_PATH).forEach(function (filename) {
		var filePath = path.join(DATA_PATH, filename);
		var file = path.parse(filePath);
		if (file.ext.toLocaleLowerCase() == ".json") {
			var name = file.name;
			var content = "loadData('{0}',{1});".format(name, readFile(filePath, 'utf-8'));
			script.push(content);
		}
	});

	readDir(CULTURE_PATH).forEach(function (fileName) {
		var filePath = path.join(CULTURE_PATH, fileName);
		var file = path.parse(filePath);
		if (file.ext.toLocaleLowerCase() == ".json") {
			var name = file.name;
			var content = "loadResource('{0}', {1});".format(name, readFile(filePath, 'utf-8'));
			script.push(content);
		}
	});
	readDir(TEMPLATE_PATH).forEach(function (fileName) {
		var filePath = path.join(TEMPLATE_PATH, fileName);
		var file = path.parse(filePath);
		if (file.ext.toLocaleLowerCase() == ".html") {
			var name = file.name;
			let html = htmlMin(readFile(filePath, 'utf-8'), htmlMinOption);

			var content = "loadTemplate('{0}', '{1}');".format(name, html);
			script.push(content);
		}
	});

	let tempResource = script.join("");

	let globalObj = global ? "window.{0} = window.{0} || {}".format(global) : "{}";
	wrapTemplate = wrapTemplate.format(globalObj, tempResource);

	let opt = compress ? {} : { mangle: false, compress: false, output: { beautify: true } };
	gulp.src([path.join(AUTOGEN_PATH, "_script.js")])
		.pipe(map(function (file, callback) {
			var fileContents = file.contents.toString();

			fileContents = wrapTemplate.replaceAll("{REPLACE_SCRIPT}", fileContents);
			file.contents = new Buffer.from(fileContents);
			callback(null, file);
		}))
		.pipe(concat(getScriptOutputName()))
		.pipe(uglify(opt))
		.pipe(gulp.dest(BUILD_PATH))
		.on("end", function () {
			cb();
		});


}


function matchWebpack(content) {
	var reTagCatcher = /\"define webpack\";/g;
	var match = content.match(reTagCatcher);
	var text = match && match[0] ? match[0] : "";
	content = content.replace(reTagCatcher, "");
	return {
		match: text != "",
		content: content
	};
}

function cleanOutput(cb) {
	fse.emptyDirSync(BUILD_PATH);
	fse.emptyDirSync(DIST_PATH);
	cb();
}
function publish(cb) {
	fse.copySync(path.join(BUILD_PATH), path.join(DIST_PATH, "src"));
	fse.copySync(path.join(ASSETS_PATH, "img"), path.join(DIST_PATH, "img"));

	cb();
}


function readFile(path) {
	return fs.readFileSync(path, 'utf-8');
}

function writeFile(path, content) {
	fs.writeFileSync(path, content, { encode: 'utf8' });
}

function readDir(dir) {
	return fs.readdirSync(dir);
}


function setCompress(cb) {
	compress = true;
	cb();
}



exports.webpack = gulp.series(bundleCoreJS);
exports.clean = gulp.series(cleanOutput);

//build test. 
exports.build = gulp.series(cleanOutput, gulp.parallel(generateCSS, gulp.series(gulp.parallel(bundleCoreJS, bundleAppJS), bundleJS, generateJS)));
exports.default = exports.build;
//release to dist
exports.release = gulp.series(setCompress, gulp.series(cleanOutput, gulp.parallel(generateCSS, gulp.series(gulp.parallel(bundleCoreJS, bundleAppJS), bundleJS, generateJS))), publish);
