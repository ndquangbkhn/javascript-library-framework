
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
            return this;
        },
        removeClass: function (el, cls) {
            el.classList.remove(cls);
            return this;
        },
        hide: function (...elements) {
            // Duyệt qua từng phần tử trong danh sách các tham số
            for (const element of elements) {
                // Kiểm tra xem phần tử có tồn tại không
                if (element) {
                    // Đặt thuộc tính CSS `display` thành `none` để ẩn phần tử
                    element.style.display = 'none';
                }
            }
            return this;
        },
        show: function (el, displayType) {
            if (!displayType) {
                displayType = "block";
            }
            el.style.display = displayType;

            return this;
        },
        fadeOut: function (element, duration) {
            // Set the initial opacity to 1
            element.style.opacity = 1;
            element.style.transition = `opacity ${duration}ms ease-in-out`;

            // Fade out the element
            element.style.opacity = 0;

            // After the fade-out duration, hide the element and set its display to 'none'
            setTimeout(() => {
                element.style.display = 'none';
                element.style.opacity = 1; // Reset opacity to 1 for the next time it's shown
                element.style.transition = "";
                element.style.transform = "";
            }, duration);
            return this;
        },
        fadeIn: function (element, duration) {
            element.style.opacity = 0;
            element.style.transition = `opacity ${duration}ms ease-in-out`;

            if (element.style.display == "none") {
                element.style.display = "";
            }
            if (element.style.transform == 'scale(0)') {
                element.style.transform = "";
            }


            setTimeout(() => {
                element.style.opacity = 1;
                setTimeout(function () {
                    element.style.transition = "";
                    element.style.transform = "";
                }, duration)
            }, 10);
            return this;
        },
        zoomOut: function (element, duration) {
            element.style.transform = 'scale(1)';
            element.style.transition = `transform ${duration}ms ease-in-out`;

            setTimeout(() => {
                element.style.transform = 'scale(0)';
                setTimeout(function () {
                    element.style.display = "none";
                    element.style.transition = "";
                    element.transform = "";
                }, duration)
            }, 10);

            return this;
        },
        zoomIn: function (element, duration) {
            element.style.transform = 'scale(0.5)';
            element.style.transition = `transform ${duration}ms ease-in-out`;

            if (element.style.display == "none") {
                element.style.display = "";
            }
            if (element.style.opacity == 0) {
                element.style.opacity = 1;
            }


            setTimeout(() => {
                element.style.transform = 'scale(1)';
                setTimeout(function () {
                    element.style.transition = "";
                    element.style.transform = "";
                }, duration)
            }, 10);

            return this;
        },

        attr: function (el, attributes, value) {
            if (typeof attributes == "object") {
                Object.keys.forEach(key => {
                    el.setAttribute(key, attributes[key] + "");
                });
            } else if (typeof attributes == "string") {

                if (Utility.isValue(value)) {
                    el.setAttribute(attributes, value + "");
                } else {
                    return el.getAttribute(attributes);
                }
            }

            return this;
        },
        removeAttr: function (el, attribute) {
            el.removeAttribute(attribute);
            return this;
        },
        create: function (tagName, classList, attributes) {
            let el = document.createElement(tagName);
            this.addClass(el, classList);
            this.attr(el, attributes);
            return el;
        },
        remove: function (...elements) {
            for (const element of elements) {
                if (element) {
                    if (!element) {
                        console.log('Element not found');
                        return;
                    }

                    const clonedElement = element.cloneNode(false);
                    // Thay thế phần tử cũ bằng phần tử mới
                    element.parentNode.replaceChild(clonedElement, element);
                    // Loại bỏ phần tử gốc khỏi DOM
                    element.remove();
                    // Loại bỏ phần tử mới khỏi DOM
                    clonedElement.remove();
                }
            }
        },
        append: function (parent, ...children) {
            parent.append(...children);
            return this;
        },
        prepend: function (parent, ...children) {
            parent.prepend(...children);
            return this;
        },
        empty: function (...elements) {
            for (const el of elements) {
                if (el) {
                    const tagName = el.tagName.toLowerCase();
                    if (tagName === 'input' || tagName === 'textarea') {
                        el.value = '';
                    } else {
                        const children = Array.from(el.children);
                        for (const child of children) {
                            const newChild = child.cloneNode(false);
                            newChild.innerHTML = child.innerHTML;
                            child.replaceWith(newChild);
                        }

                        // Làm trống nội dung của phần tử cha
                        el.innerHTML = "";
                    }

                }
            }

            return this;
        },
        createDIV: function (classList, attributes) {
            return create("div", classList, attributes);
        },
        fromTemplate: function (html) {
            html = html.trim();
            TemplateContainer.innerHTML = html;
            return TemplateContainer.content.firstChild;
        },
        stopEvent: function (e) {
            e.stopPropagation();
            e.preventDefault();
            return this;
        },
        onEvent: function (el, eventName, handler, once) {
            el.addEventListener(eventName, handler, { once: !!once });
            return this;
        },
        onceEvent: function (el, eventName, handler) {
            el.addEventListener(eventName, handler, { once: true });
            return this;
        },
        onClick: function (el, handler, once) {
            this.onEvent(el, "click", handler, once);
            return this;
        },
        onceClick: function (el, handler) {
            this.onEvent(el, "click", handler, true);
            return this;
        },
        css: function (el, styleObject, value) {
            if (typeof styleObject == "string") {
                if (Utility.isValue(value)) {
                    try {
                        el.style[styleObject] = value;
                    } catch (ex) {
                        console.error(ex);
                    }

                } else {
                    return window.getComputedStyle(el).getPropertyValue(styleObject);
                }
            } else if (typeof styleObject == "object") {
                // Lặp qua các khóa trong đối tượng kiểu
                for (const property in styleObject) {
                    if (styleObject.hasOwnProperty(property)) {
                        // Thiết lập giá trị CSS cho thuộc tính tương ứng trên phần tử
                        try {
                            el.style[property] = styleObject[property];
                        } catch (ex) {
                            console.error(ex);
                        }
                    }
                }
            }
            return this;
        },
        offset: function (el) {
            // Sử dụng phương pháp getBoundingClientRect để lấy thông tin của phần tử
            const rect = el.getBoundingClientRect();

            // Lấy giá trị cuộn của trang (scroll) từ document.documentElement
            const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;


            // Trả về đối tượng chứa thuộc tính top và left
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        },
        isVisible: function (element) {
            // Kiểm tra thuộc tính offsetWidth và offsetHeight
            const hasSize = element.offsetWidth > 0 || element.offsetHeight > 0;
            // Lấy thuộc tính CSS của phần tử
            const style = window.getComputedStyle(element);
            // Kiểm tra thuộc tính CSS display và visibility
            const isVisibleStyle = style.display !== 'none' && style.visibility !== 'hidden';
            // Phần tử được coi là hiển thị nếu nó có kích thước và thuộc tính CSS hợp lệ
            return hasSize && isVisibleStyle;
        },
        pastePlainText: function (element) {
            function handlePaste(event) {
                // Ngăn chặn hành động dán mặc định
                event.preventDefault();

                // Lấy dữ liệu từ sự kiện `paste`
                const clipboardData = event.clipboardData || window.clipboardData;

                // Lấy dữ liệu dạng văn bản thuần túy từ clipboard
                const plainText = clipboardData.getData('text/plain');

                // Chèn dữ liệu văn bản thuần túy vào phần tử
                // Kiểm tra xem phần tử có thuộc tính `contenteditable` không
                if (element.isContentEditable) {
                    // Nếu phần tử là nội dung có thể chỉnh sửa (contenteditable), chèn văn bản tại vị trí con trỏ chuột
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(document.createTextNode(plainText));
                    }
                } else {
                    // Nếu phần tử không có thuộc tính `contenteditable`, cập nhật giá trị của phần tử (chỉ áp dụng cho các phần tử `input` và `textarea`)
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        const start = element.selectionStart;
                        const end = element.selectionEnd;
                        const text = element.value;

                        // Cập nhật giá trị của phần tử
                        element.value = text.slice(0, start) + plainText + text.slice(end);

                        // Đặt con trỏ chuột ở cuối văn bản dán
                        element.selectionStart = element.selectionEnd = start + plainText.length;
                    }
                }
            }

            element.addEventListener("paste", handlePaste);

            return this;
        },
        focus: function (el) {
            el.focus();
            return this;
        },
        blur: function (el) {
            el.blur();
            return this;
        },
        text: function (el, text) {
            const tagName = el.tagName.toLowerCase();
            if (text == undefined) {
                if (tagName === 'input' || tagName === 'textarea') {
                    return el.value;
                }
                return el.innerText;
            } else {
                if (tagName === 'input' || tagName === 'textarea') {
                    el.value = text;
                } else {
                    // For other elements (p, div, span, h1-h6)
                    el.innerText = text;
                }

                return this;
            }

        },
        value: function (el, value) {
            const tagName = el.tagName.toLowerCase();
            if (value == undefined) {
                if (tagName === 'input' || tagName === 'textarea') {
                    return el.value;
                }
                return "";
            } else {
                if (tagName === 'input' || tagName === 'textarea') {
                    el.value = value;
                }

                return this;
            }

        }

    };
}
exports["default"] = init();



