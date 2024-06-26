
"define webpack";
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



