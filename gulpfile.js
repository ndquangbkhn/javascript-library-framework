const bundle = require("./.framework/bundle.js");

exports.build = bundle.build;
exports.release =bundle.release;
exports.clean = bundle.clean;
exports.default = bundle.build;