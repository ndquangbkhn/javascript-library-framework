const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const htmlMin = require("html-minifier").minify;
const map = require('map-stream');
const header = require('gulp-header');
const replace = require('gulp-replace');


String.prototype.replaceAll = function (n, t) {
	return this.split(n).join(t);
};


String.prototype.format = function () {
	for (var t = this, i, n = 0; n < arguments.length; n++)
		i = new RegExp("\\{" + n + "\\}", "gi"),
			t = t.replace(i, arguments[n]);
	return t;
};



const DIR_NAME = "./";
const htmlMinOption = {
	removeComments: true,
	collapseWhitespace: true,
	quoteCharacter: '"',
	decodeEntities: true,
	minifyCSS: true
};


const bundleConfig = JSON.parse(readFile('bundleconfig.json'));

//Bản build
const BUILD_VERSION = bundleConfig.version ? "-" + bundleConfig.version : "";

//tiền tố gắn vào tên webpack core
const CORE_WP_PREFIX = "wp.core.";
//replace css prefix
const REPLACE_CSS_PREFIX = "cssprefix";

//tiền tố cho class css
const CSS_PREFIX = bundleConfig.cssprefix ? bundleConfig.cssprefix : (function (length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
})(8);




const WEBPACK_CONFIG = path.join(DIR_NAME, "webpackconfig");
const DIST_PATH = path.join(DIR_NAME, "dist");
const APP_PATH = path.join(DIR_NAME, "app");
const CORE_WEBPACK_PATH = path.join(DIR_NAME, ".framework/wp");

const SOURCE_PATH = path.join(APP_PATH, "src");
const ASSETS_PATH = path.join(APP_PATH, "assets");
const CONFIG_PATH = path.join(APP_PATH, "config");
const DATA_PATH = path.join(APP_PATH, "data");
const CULTURE_PATH = path.join(APP_PATH, "culture");
const BUILD_PATH = path.join(ASSETS_PATH, "build");
const WEBPACK_PATH = path.join(SOURCE_PATH, "webpack");


const AUTOGEN_PATH = path.join(SOURCE_PATH, "_autogen");
const LIBS_PATH = [path.join(SOURCE_PATH, "libs/*.js")];
const STARTUP_FILE = path.join(SOURCE_PATH, "startup.js");
const CONFIG_FILE = path.join(CONFIG_PATH, "config.json");

const TEMPLATE_FILES = [
	path.join(SOURCE_PATH, "template"),
	path.join(WEBPACK_PATH, "ui"),
];


const CSS_FILES = [
	path.join(WEBPACK_PATH, "ui/*.css")
];


let outputName = bundleConfig.output;
const JS_OUTPUT_NAME = "{0}{1}.js".format(outputName, BUILD_VERSION);
const CSS_OUTPUT_NAME = "{0}{1}.css".format(outputName, BUILD_VERSION);

let webpack_files = [];



let core_webpack_config = {};
let core_webpack_files = [];
let core_webpack_map = {};
let default_webpacks_enable = {};
let dependences = [];


let webpack_map = JSON.parse(readFile(path.join(WEBPACK_CONFIG, "webpack.map.json"), 'utf-8'));

var webpackTemplate = readFile(path.join(DIR_NAME, ".framework/webpack.tpl"));

function checkValue(obj, value) {
	let check = false;
	Object.keys(obj).forEach(function (x) {
		if (obj[x] == value) {
			check = true;
		}
	});

	return check;
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
				default_webpacks_enable[config.name] = !!config.enable;
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
	Object.keys(default_webpacks_enable).forEach(function (name) {
		if (dependences.includes(name)) {
			default_webpacks_enable[name] = true;
		}
		if (default_webpacks_enable[name] == true) {
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



	console.log("enabled core webpack");
	console.log(core_webpack_enable);
}


function loadSourceWebpack(sourcePath) {
	if (!sourcePath) {
		sourcePath = WEBPACK_PATH;
	}
	readDir(sourcePath).forEach(function (filename) {
		let dirPath = path.join(sourcePath, filename);
		if (fs.lstatSync(dirPath).isDirectory()) {
			loadSourceWebpack(dirPath);
		} else {
			let fileInfo = path.parse(dirPath);
			var ext = fileInfo.ext.toLocaleLowerCase();
			if (ext == ".js" && checkValue(webpack_map, fileInfo.name)) {
				webpack_files.push(dirPath);
			}
		}
	});
}

function loadSource(cb) {
	dependences = [];

	//load webpack app
	loadSourceWebpack();
	loadDependences();
	console.log("webpack in source");
	console.log(dependences);

	loadCoreWebpackConfig();
	loadCoreWebpackRequires();
	printCoreWebpack();

	cb();

}

function loadDependences() {
	webpack_files.concat([STARTUP_FILE]).forEach(function (dirPath) {
		let content = readFile(dirPath, 'utf-8');
		let dep = matchDependences(content);
		dep.forEach(function (name) {
			if (!dependences.includes(name)) {
				dependences.push(name);
			}
		});
	});


}

function printCoreWebpack() {
	let _content = [];
	Object.keys(core_webpack_config).forEach(function (name) {
		let config = core_webpack_config[name];
		let content = '## {0}\n{1}={2};\n'.format(config.des || "webpack", config.name, !!config.enable);
		_content.push(content);
	});
	writeFile(path.join(CORE_WEBPACK_PATH, "webpack.core.md"), _content.join("\n"));


}

function bundleCoreJS(cb) {

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
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {
			cb();
		});

}

function bundleAppJS(cb) {

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
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {

			cb();
		});

}

function bundleJS(cb) {
	
	gulp.src(LIBS_PATH.concat([path.join(AUTOGEN_PATH, "_core_script.js"), path.join(AUTOGEN_PATH, "_app_script.js")]))
		.pipe(concat("_script.js"))
		.pipe(gulp.dest(AUTOGEN_PATH))
		.on("end", function () {
			cb();
		});

}

function generateJS(cb) {
	var global = bundleConfig.global;
	var wrapTemplate = readFile(path.join(DIR_NAME, ".framework/wrap.tpl"));

	var script = [];

	//config
	var scriptConfig = "loadConfig({0});".format(readFile(CONFIG_FILE, 'utf-8'));
	script.push(scriptConfig);
	//webpack
	Object.assign(webpack_map, core_webpack_map, webpack_map);
	console.log("====== webpack map =====");
	console.log(webpack_map);
	var webpackConfig = ";loadWebpackConfig({0});".format(JSON.stringify(webpack_map));
	script.push(webpackConfig);
	//READ DATA JSON
	readDir(DATA_PATH).forEach(function (filename) {
		var filePath = path.join(DATA_PATH, filename);
		var file = path.parse(filePath);
		if (file.ext.toLocaleLowerCase() == ".json") {
			var name = file.name;
			var content = ";loadData('{0}',{1});".format(name, readFile(filePath, 'utf-8'));
			script.push(content);
		}
	});

	readDir(CULTURE_PATH).forEach(function (fileName) {
		var filePath = path.join(CULTURE_PATH, fileName);
		var file = path.parse(filePath);
		if (file.ext.toLocaleLowerCase() == ".json") {
			var name = file.name;
			var content = ";loadResource('{0}', {1});".format(name, readFile(filePath, 'utf-8'));
			script.push(content);
		}
	});

	TEMPLATE_FILES.forEach(function (dir) {
		readDir(dir).forEach(function (fileName) {
			var filePath = path.join(dir, fileName);
			var file = path.parse(filePath);
			if (file.ext.toLocaleLowerCase() == ".html") {
				var name = file.name;
				let html = htmlMin(readFile(filePath, 'utf-8'), htmlMinOption);

				var content = ";loadTemplate('{0}', '{1}');".format(name, html);
				script.push(content);
			}
		});
	});

	let tempResource = script.join("");

	let globalObj = global ? "window.{0} = window.{0} || {}".format(global) : "{}";
	wrapTemplate = wrapTemplate.replaceAll("GLOBAL_OBJECT", globalObj)
		.replaceAll("FRAMEWORK_INIT_SCRIPT", tempResource);


	let licenseInfo = readFile(path.join(DIR_NAME, "License.tpl"), 'utf-8');
	licenseInfo = licenseInfo.replaceAll("{LibraryName}", bundleConfig.libraryName)
		.replaceAll("{Description}", bundleConfig.description)
		.replaceAll("{Year}", (new Date()).getFullYear());

	console.log(licenseInfo);
	gulp.src([path.join(AUTOGEN_PATH, "_script.js")])
		.pipe(map(function (file, callback) {
			var fileContents = file.contents.toString();
			fileContents = wrapTemplate.replaceAll("REPLACE_SCRIPT", fileContents);
			file.contents = new Buffer.from(fileContents);
			callback(null, file);
		}))
		//xuất file
		.pipe(concat(JS_OUTPUT_NAME))
		.pipe(replace(REPLACE_CSS_PREFIX, CSS_PREFIX))
		//binding license info to head
		.pipe(header(licenseInfo))
		.pipe(gulp.dest(BUILD_PATH))
		//minify
		.pipe(uglify())
		//binding license info to head
		.pipe(header(licenseInfo))
		//đổi tên thành file min.js
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest(BUILD_PATH))
		.on("end", function () {
			cb();
		});


}

function generateCSS(cb) {
	if (CSS_FILES.length > 0) {
		console.log("==== Style config ===");
		console.log(CSS_FILES);
		gulp.src(CSS_FILES)
			.pipe(cleanCSS({ rebaseTo: BUILD_PATH }))
			.pipe(concat(CSS_OUTPUT_NAME))
			.pipe(replace(REPLACE_CSS_PREFIX, CSS_PREFIX))
			.pipe(gulp.dest(BUILD_PATH))
			.pipe(rename({ extname: '.min.css' }))
			.pipe(gulp.dest(BUILD_PATH))
			.on("end", function () {
				cb();
			});
	} else {
		console.log("No css file");
		cb();
	}

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
function matchDependences(str) {
	let arr = [];
	var regex = /webpack\(['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?\)/g;
	var match;

	while ((match = regex.exec(str)) !== null) {
		arr.push(match[1]);
	}

	return arr;



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



let cleanTask = gulp.series(cleanOutput);

//build test. 
let buildTask = gulp.series(cleanOutput, gulp.parallel(generateCSS, gulp.series(loadSource, gulp.parallel(bundleCoreJS, bundleAppJS), bundleJS, generateJS)));

exports.default = buildTask;
exports.clean = cleanTask;
exports.release= gulp.series(buildTask, publish);
exports.build = buildTask;

 