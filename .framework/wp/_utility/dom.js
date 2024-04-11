
"define webpack";
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



