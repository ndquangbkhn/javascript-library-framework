
"define webpack";

function init() {
    const xssAttribute = "onmouseover;onmouseenter;onmouseleave;onmouseout;onMouseMove;onMouseOver;onMouseWheel;onwheel;onmouseup;onclick;ondblclick;onscroll;onresize;onfocus;onblur;autofocus;onchange;onbegin;oncontextmenu;oninput;oninvalid;onreset;onsearch;onselect;onsubmit;onerror;onstart;onload;onbeforeload;onUnload;onpageshow;onpagehide;onEnd;onPopState;onPropertyChange;onfilterchange;formaction;onReadyStateChange;ontoggle;onafterprint;onbeforeprint;onbeforeunload;onhashchange;onmessage;onoffline;ononline;onstorage;onkeyup;onkeydown;onkeypress;onkeyup;ondrag;ondragend;ondragenter;ondragleave;ondragover;ondragstart;ondrop;oncopy;oncut;onpaste;onabort;oncanplay;oncanplaythrough;oncuechange;ondurationchange;onemptied;onended;onloadeddata;onloadedmetadata;onloadstart;onpause;onplay;onplaying;onprogress;onratechange;onseeked;onseeking;onstalled;onsuspend;ontimeupdate;onvolumechange;onwaiting";
    const xssBlackList = "html;body;iframe;embed;base;meta;link;style;object;marquee;frameset;xss;script;applet;animate";
    return {
        removeXSS: function (text, whitelist, blacklist) {
            var t = text + "";
            if (!whitelist) whitelist = [];
            if (!blacklist) blacklist = [];
            blacklist = blacklist.concat(xssBlackList.split(";"));
            var dangerAttr = xssAttribute.split(";");

            whitelist.forEach(function (t) {
                t = t.toLowerCase();
            });
            blacklist = blacklist.filter(function (t) {
                t = t.toLowerCase();
                return !(whitelist.filter(x => x == t).length > 0);
            });

            var dv = document.createElement("div");
            var txt = document.createElement("textarea");

            var _checkTag = function (it) {
                dangerAttr.forEach(function (at) {
                    it.removeAttribute(at);
                });

                if (it.tagName.toLowerCase() == "a") {
                    if (it.href.indexOf("javascript:") >= 0) {
                        it.href = "";
                    }
                } else if (it.tagName.toLowerCase() == "img") {
                    if (it.src.indexOf("javascript:") >= 0) {
                        it.src = "";
                    }
                } else if (it.tagName.toLowerCase() == "iframe" || it.tagName.toLowerCase() == "embed") {
                    if (it.src.indexOf("data:") >= 0) {
                        it.src = "";
                    }
                }
            };

            dv.innerHTML = t;
            //duyệt các thẻ để xử lý xss
            var nodes = dv.querySelectorAll("*");
            nodes.forEach(function (it) {
                var tagName = it.tagName.toLowerCase();

                if (blacklist.indexOf(tagName) >= 0) {
                    txt.innerHTML = it.outerHTML;
                    it.replaceWith(txt.innerHTML);
                } else {
                    _checkTag(it);
                }
            });

            t = dv.innerHTML;
            txt = null;
            dv = null;
            return t;
        }
    };
}
exports["default"] = init();



