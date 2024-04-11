
(function (window, seft, factory) {
    factory(seft, window);
})(window, GLOBAL_OBJECT , function (global, window) {

    let $webpack = {};
    let $webpack_config = {
    };

    function __initWebpack(name, value) {
        $webpack[name] = value;
    }
    function __getWebpack(name) {
        return $webpack[name];
    }
    __initWebpack("Config", {
        exports: {
            default: {}
        },
        loaded: true
    });


    __initWebpack("Data", {
        exports: {
        },
        loaded: true
    });

    __initWebpack("Resource", {
        exports: {
        },
        loaded: true
    });

    __initWebpack("Template", {
        exports: {
        },
        loaded: true
    });

    (function () {
        function loadData(name, value) {
            __getWebpack("Data").exports[name] = value;
        }

        function loadTemplate(name, value) {
            __getWebpack("Template").exports[name] = value;
        }
        function loadResource(culture, value) {
            if (culture != "add") {
                __getWebpack("Resource").exports[culture] = value;
            }
        }


        __getWebpack("Resource").exports.add = loadResource;

        function loadConfig(value) {
            Object.assign(__getWebpack("Config").exports.default, value);
        }

        function loadWebpackConfig(value) {
            $webpack_config = value;
        }

        FRAMEWORK_INIT_SCRIPT
    })();



    function webpack(webpackName, moduleName) {
        let wpname = $webpack_config[webpackName];
        let wpObj = $webpack[webpackName];
        if (wpname) {
            wpObj = $webpack[wpname];
        }
        if (wpObj) {
            if (!wpObj.exports) wpObj.exports = {};
            if (!wpObj.loaded) {
                wpObj.call($webpack[webpackName], wpObj.exports);
                wpObj.loaded = true;
            }

            if (moduleName && wpObj.exports[moduleName]) {
                return wpObj.exports[moduleName];
            } else {
                if (moduleName) {
                    console.warn("module " + moduleName + " is not defined");
                }
            }

            return wpObj.exports.default ? wpObj.exports.default : wpObj.exports;

        } else {
            console.error("webpack " + webpackName + " is not defined");
        }
    }

    window.log = function () {
        console.log($webpack);
    };

    REPLACE_SCRIPT
});

