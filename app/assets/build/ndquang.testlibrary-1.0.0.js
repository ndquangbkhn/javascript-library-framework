//---------------------------------------------------------------------
// My.Test.Libary
// Thư viện cung cấp giao diện hiển thị tính năng test abc
// From: Javascript Library framework
// Copyright (c) 2024 nguyenducquang.bkhn@gmail.com
// Author: nguyenducquang.bkhn
// Website: 
//---------------------------------------------------------------------

(function (window, seft, factory) {
    factory(seft, window);
})(window, window.NDQuangLibrary = window.NDQuangLibrary || {} , function (global, window) {

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

        loadConfig({});;loadWebpackConfig({"PopupUI":"Popup","Service":"service","HTMLUtil":"wp.core.html","DOMUtil":"wp.core.dom","Utility":"wp.core.util"});;loadData('data',{});;loadResource('en', {});;loadResource('vi', {});;loadTemplate('item', '<div class="ndquang-lib-item"></div>');;loadTemplate('Popup', '<div class="ndquang-lib-popup"></div>');
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

    ;(function (factory) {
    factory();
})(function () {
   __initWebpack('wp.core.html', function(exports){
        

const Template = webpack("Template");

let cacheTemplateElement = {};
global.cacheTemplateElement = cacheTemplateElement;
function init() {
    return {
        loadByTemplateName: function (name, resource) {
            if (!cacheTemplateElement[name]) {
                var el = this.htmlToElement(Template[name], resource);
                cacheTemplateElement[name] = el;
            }

            return cacheTemplateElement[name].cloneNode(true);
        },
        htmlToElement: function (html, resource) {
            var template = document.createElement("template");
            html = html.trim();
            template.innerHTML = html;
            let el = template.content.firstChild;

            if (resource) {
                this.setResource(el, resource);
            }
            return el;
        },
        setResource: function (el, resource) {
            el.querySelectorAll("[res-key]").forEach(function (item) {
                var key = item.getAttribute("res-key");
                item.innerText = resource[key] || "";
            });

            el.querySelectorAll("[res-title]").forEach(function (item) {
                var key = item.getAttribute("res-title");
                item.setAttribute("title", resource[key] || "");
            });

            el.querySelectorAll("[res-placeholder]").forEach(function (item) {
                var key = item.getAttribute("res-placeholder");
                item.setAttribute("placeholder", resource[key] || "");
            });
            el.querySelectorAll("[res-data-placeholder]").forEach(function (item) {
                var key = item.getAttribute("res-data-placeholder");
                item.setAttribute("data-placeholder", resource[key] || "");
            });
        }

    };
}
exports["default"] = init();




    })
});


;(function (factory) {
    factory();
})(function () {
   __initWebpack('wp.core.dom', function(exports){
        

const Utility = webpack("Utility");

const TemplateContainer = document.createElement("template");
function init() {
    return {
        addClass: function (el, cls) {
            let arr = [];
            if (Array.isArray(cls)) {
                arr = cls;
            } else if (typeof cls == "string") {
                arr = cls.split(" ").filter(x => Utility.isValue(x));
            }

            arr.forEach(element => {
                if (!el.classList.contains(element)) {
                    el.classList.add(element);
                }
            });
        },
        removeClass: function (el, cls) {
            el.classList.remove(cls);
        },
        hide: function (el) {
            el.style.display = "none";
        },
        show: function (el, displayType) {
            if (!displayType) {
                displayType = "block";
            }
            el.style.display = displayType;
        },
        attr: function (el, attributes, value) {
            if (typeof attributes =="object") {
                Object.keys.forEach(key => {
                    el.setAttribute(key, attributes[key] + "");
                });
            } else if(typeof attributes == "string"){

                if(Utility.isValue(value)){
                    el.setAttribute(key, value + "");
                } else {
                    return el.getAttribute(attributes);
                }
            }
        },
        removeAttr: function(el, attribute){
            el.removeAttribute(attribute);
        },
        create: function (tagName, classList, attributes) {
            let el = document.createElement(tagName);
            this.addClass(el, classList);
            this.attr(el, attributes);
            return el;
        },
        createDIV: function (classList, attributes) {
            return create("div", classList, attributes);
        },
        fromTemplate: function(html){
            html = html.trim();
            TemplateContainer.innerHTML = html;
            return TemplateContainer.content.firstChild;
        }

    };
}
exports["default"] = init();




    })
});


;(function (factory) {
    factory();
})(function () {
   __initWebpack('wp.core.util', function(exports){
        


function init() {
    return {
        isValue: function (val) {
            return val !== undefined && val !== null && val !== "";
        },
        isUndefined: function (val) {
            return val === undefined;
        },
        isNull: function (val) {
            return typeof val == "object" && val == null;
        },
        isFn: function (val) {
            return typeof val == "function";
        },
        isDate: function (val) {
            return val instanceof Date && !isNaN(val);
        },
        extends: function () {
            var _extends = Object.assign ? Object.assign.bind()
                : function (target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i];
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                    return target;
                };
            return _extends.apply(this, arguments);
        }
        
    };
}
exports["default"] = init();




    })
});


;(function (factory) {
    factory();
})(function () {
   __initWebpack('Popup', function(exports){
        

let popupUI = function(){

}

exports["default"] = popupUI;
    })
});


(function(){

    "use strict";

    


})();
});

