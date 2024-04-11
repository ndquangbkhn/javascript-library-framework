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