
"define webpack";

function init() {
    return {
        removeXSS: function (htmlTemplate) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlTemplate, 'text/html');

            function removeEventAttributesAndRiskyTags(element) {
                const tagName = element.tagName.toLowerCase();
                if (tagName === 'script' ||
                    tagName === 'iframe' ||
                    tagName === 'embed' ||
                    tagName === 'frameset' ||
                    tagName === 'marquee' ||
                    tagName === 'xss' ||
                    tagName === 'applet' ||
                    tagName === 'base' ||
                    tagName === 'style' ||
                    tagName === 'html' ||
                    tagName === 'body' ||
                    tagName === 'animate' ||
                    tagName === 'frame' ||
                    tagName === 'object' ||
                    tagName === 'link' && element.getAttribute('rel') === 'import' ||
                    tagName === 'meta' && element.getAttribute('http-equiv') === 'refresh') {
                    element.parentNode.removeChild(element);
                } else {
                    const attributes = element.attributes;
                    for (let i = attributes.length - 1; i >= 0; i--) {
                        const attr = attributes[i];
                        if (attr.name.startsWith('on')) {
                            element.removeAttribute(attr.name);
                        }
                    }

                    if (element.tagName.toLowerCase() == "a") {
                        if (element.href.indexOf("javascript:") >= 0) {
                            element.href = "";
                        }
                    } else if (element.tagName.toLowerCase() == "img") {
                        if (element.src.indexOf("javascript:") >= 0) {
                            element.src = "";
                        }
                    } else if (element.tagName.toLowerCase() == "iframe" || element.tagName.toLowerCase() == "embed") {
                        if (element.src.indexOf("data:") >= 0) {
                            element.src = "";
                        }
                    }
                }
            }

            const elements = doc.body.querySelectorAll('*');
            elements.forEach((element) => {
                removeEventAttributesAndRiskyTags(element);
            });

            // Return the sanitized HTML as a string
            return doc.body.innerHTML;
        }
        
    };
}
exports["default"] = init();



