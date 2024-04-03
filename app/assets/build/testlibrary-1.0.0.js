(function(window, seft, factory) {
    factory(seft, window);
})(window, window.TestLibrary = window.TestLibrary || {}, function(global, window) {
    let $webpack = {};
    let $webpack_config = {};
    $webpack["Config"] = {
        exports: {
            default: {}
        },
        loaded: true
    };
    $webpack["Data"] = {
        exports: {},
        loaded: true
    };
    $webpack["Resource"] = {
        exports: {},
        loaded: true
    };
    $webpack["Template"] = {
        exports: {},
        loaded: true
    };
    (function() {
        function loadData(name, value) {
            $webpack["Data"].exports[name] = value;
        }
        function loadTemplate(name, value) {
            $webpack["Template"].exports[name] = value;
        }
        function loadResource(culture, value) {
            if (culture != "add") {
                $webpack["Resource"].exports[culture] = value;
            }
        }
        $webpack["Resource"].exports.add = loadResource;
        function loadConfig(value) {
            Object.assign($webpack["Config"].exports.default, value);
        }
        function loadWebpackConfig(value) {
            $webpack_config = value;
        }
        loadConfig({});
        loadWebpackConfig({
            PopupUI: "Popup",
            Service: "service",
            Class: "wp.core.class",
            Converter: "wp.core.converter",
            DateUtil: "wp.core.date",
            RequestUtil: "wp.core.request",
            Secure: "wp.core.secure",
            Utility: "wp.core.util",
            CacheUtil: "wp.core.cache",
            HTMLUtil: "wp.core.html"
        });
        loadData("data", {});
        loadResource("en", {});
        loadResource("vi", {});
        loadTemplate("item", '<div class="item"></div>');
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
    window.log = function() {
        console.log($webpack);
    };
    $webpack["wp.core.class"] = function(e) {
        e.default = function() {
            function r(e) {
                e.parent instanceof Function && (r.apply(this, [ e.parent ]), this.callParent = a(this, o(this, this.constructor))), 
                e.apply(this, arguments);
            }
            function a(e, t) {
                for (var n in e) "callParent" !== n && e[n] instanceof Function && !(e[n].prototype instanceof i) && (t[n] = e[n].callParent || o(e, e[n]));
                return t;
            }
            function o(n, o) {
                var r = n.callParent;
                return o.callParent = function() {
                    var e = n.callParent, t = (n.callParent = r, o.apply(n, arguments));
                    return n.callParent = e, t;
                };
            }
            let i = function() {};
            return i.extend = function t(n) {
                function o() {
                    r !== arguments[0] && (r.apply(this, [ n ]), a(this, this), 
                    this.initializer instanceof Function && this.initializer.apply(this), 
                    this.constructor.apply(this, arguments));
                }
                return ((o.prototype = new this(r)).constructor = o).toString = function() {
                    return n.toString();
                }, o.extend = function(e) {
                    return e.parent = n, t.apply(o, arguments);
                }, o;
            }, i = i.extend(function() {
                this.constructor = function() {}, this.default = {};
            });
        }();
    }, $webpack["wp.core.converter"] = function(e) {
        e.default = {
            serialize: function(e) {
                return Array.isArray(e) ? JSON.stringify(e) : JSON.stringify(e, (() => {
                    const n = new WeakSet();
                    return (e, t) => {
                        if ("object" == typeof t && null !== t) {
                            if (n.has(t)) return;
                            n.add(t);
                        }
                        return t;
                    };
                })());
            },
            deserialize: function(e) {
                if ("string" != typeof e) return "object" == typeof e && 0 < Object.keys(e).length ? e : {};
                try {
                    return JSON.parse(e);
                } catch (e) {
                    return {};
                }
            }
        };
    }, $webpack["wp.core.date"] = function(e) {
        e.default = {
            diffMinutes: function(e, t) {
                return e = (e.getTime() - t.getTime()) / 1e3, e /= 60, Math.abs(Math.round(e));
            }
        };
    }, $webpack["wp.core.request"] = function(e) {
        e.default = {
            post: function(e, t, n, o, r, a) {
                t = {
                    method: "Post",
                    headers: t,
                    body: n ? JSON.stringify(n) : null
                }, fetch(e, t).then(e => {
                    if (e.ok) return e.json();
                    throw r(e.status, e), Error(e.statusText);
                }).then(e => {
                    "function" == typeof o && o(e);
                }).catch(function(e) {
                    "function" == typeof a && a(ex), console.log("Fetch Error", e);
                });
            },
            get: function(e, t, n, o, r, a) {
                if (n) {
                    0 == e.indexOf("/") && (e = location.origin + e);
                    let t = new URL(e);
                    Object.keys(n).forEach(function(e) {
                        t.searchParams.append(e, encodeURIComponent(n[e]));
                    }), e = t.toString();
                }
                fetch(e, {
                    method: "Get",
                    headers: t
                }).then(e => {
                    if (e.ok) return e.json();
                    throw r(e.status, e), Error(e.statusText);
                }).then(e => {
                    "function" == typeof o && o(e);
                }).catch(function(e) {
                    "function" == typeof a && a(ex), console.log("Fetch Error", e);
                });
            }
        };
    }, $webpack["wp.core.secure"] = function(e) {
        e.default = {
            removeXSS: function(e, n, o) {
                var e = e + "", r = (n = n || [], o = (o = o || []).concat("html;body;iframe;embed;base;meta;link;style;object;marquee;frameset;xss;script;applet;animate".split(";")), 
                "onmouseover;onmouseenter;onmouseleave;onmouseout;onMouseMove;onMouseOver;onMouseWheel;onwheel;onmouseup;onclick;ondblclick;onscroll;onresize;onfocus;onblur;autofocus;onchange;onbegin;oncontextmenu;oninput;oninvalid;onreset;onsearch;onselect;onsubmit;onerror;onstart;onload;onbeforeload;onUnload;onpageshow;onpagehide;onEnd;onPopState;onPropertyChange;onfilterchange;formaction;onReadyStateChange;ontoggle;onafterprint;onbeforeprint;onbeforeunload;onhashchange;onmessage;onoffline;ononline;onstorage;onkeyup;onkeydown;onkeypress;onkeyup;ondrag;ondragend;ondragenter;ondragleave;ondragover;ondragstart;ondrop;oncopy;oncut;onpaste;onabort;oncanplay;oncanplaythrough;oncuechange;ondurationchange;onemptied;onended;onloadeddata;onloadedmetadata;onloadstart;onpause;onplay;onplaying;onprogress;onratechange;onseeked;onseeking;onstalled;onsuspend;ontimeupdate;onvolumechange;onwaiting".split(";")), t = (n.forEach(function(e) {
                    e.toLowerCase();
                }), o = o.filter(function(t) {
                    return t = t.toLowerCase(), !(0 < n.filter(e => e == t).length);
                }), document.createElement("div")), a = document.createElement("textarea");
                return t.innerHTML = e, t.querySelectorAll("*").forEach(function(e) {
                    var t, n = e.tagName.toLowerCase();
                    0 <= o.indexOf(n) ? (a.innerHTML = e.outerHTML, e.replaceWith(a.innerHTML)) : (t = e, 
                    r.forEach(function(e) {
                        t.removeAttribute(e);
                    }), "a" == t.tagName.toLowerCase() ? 0 <= t.href.indexOf("javascript:") && (t.href = "") : "img" == t.tagName.toLowerCase() ? 0 <= t.src.indexOf("javascript:") && (t.src = "") : "iframe" != t.tagName.toLowerCase() && "embed" != t.tagName.toLowerCase() || 0 <= t.src.indexOf("data:") && (t.src = ""));
                }), e = t.innerHTML, t = a = null, e;
            }
        };
    }, $webpack["wp.core.util"] = function(e) {
        e.default = {
            isValue: function(e) {
                return null != e && "" !== e;
            },
            isUndefined: function(e) {
                return void 0 === e;
            },
            isNull: function(e) {
                return "object" == typeof e && null == e;
            },
            isFn: function(e) {
                return "function" == typeof e;
            },
            isDate: function(e) {
                return e instanceof Date && !isNaN(e);
            }
        };
    }, $webpack["wp.core.cache"] = function(e) {
        const a = webpack("Utility"), n = webpack("DateUtil"), i = webpack("Converter");
        function c(e) {
            var t;
            return a.isValue(e) ? (e = i.deserialize(e), t = new Date(e.time), 0 < e.exp && n.diffMinutes(new Date(), t) >= e.exp ? {
                Expired: isExpired = !0
            } : {
                Data: e.val,
                CachedTime: t,
                Expired: !1
            }) : null;
        }
        function o(e, t, n, o) {
            var r;
            return a.isUndefined(t) ? (r = o.getItem(e), !a.isValue(r) || (r = c(r)).Expired ? (o.removeItem(e), 
            null) : r) : a.isNull(t) ? (o.removeItem(e), null) : (r = t, t = n, 
            n = i.serialize({
                val: r,
                exp: t,
                time: new Date()
            }), o.setItem(e, n), {
                Data: c(o.getItem(e)).Data
            });
        }
        e.Session = {
            set: function(e, t, n) {
                return o(e, t, n, window.sessionStorage);
            },
            delete: function(e) {
                return o(e, null, expire, window.sessionStorage);
            },
            get: function(e) {
                return o(e, void 0, void 0, window.sessionStorage);
            }
        }, e.Local = {
            set: function(e, t, n) {
                return o(e, t, n, window.localStorage);
            },
            delete: function(e) {
                return o(e, null, expire, window.localStorage);
            },
            get: function(e) {
                return o(e, void 0, void 0, window.localStorage);
            }
        };
    }, $webpack["wp.core.html"] = function(e) {
        const n = webpack("Template");
        let o = {};
        global.cacheTemplateElement = o, e.default = {
            loadByTemplateName: function(e, t) {
                return o[e] || (t = this.htmlToElement(n[e], t), o[e] = t), o[e].cloneNode(!0);
            },
            htmlToElement: function(e, n) {
                var t = document.createElement("template"), e = (e = e.trim(), t.innerHTML = e, 
                t.content.firstChild);
                return n && (e.querySelectorAll("[res-key]").forEach(function(e) {
                    var t = e.getAttribute("res-key");
                    e.innerText = n[t] || "", e.removeAttribute("res-key");
                }), e.querySelectorAll("[res-title]").forEach(function(e) {
                    var t = e.getAttribute("res-title");
                    e.setAttribute("title", n[t] || ""), e.removeAttribute("res-title");
                }), e.querySelectorAll("[res-placeholder]").forEach(function(e) {
                    var t = e.getAttribute("res-placeholder");
                    e.setAttribute("placeholder", n[t] || ""), e.removeAttribute("res-placeholder");
                }), e.querySelectorAll("[res-data-placeholder]").forEach(function(e) {
                    var t = e.getAttribute("res-data-placeholder");
                    e.setAttribute("data-placeholder", n[t] || ""), e.removeAttribute("res-data-placeholder");
                })), e;
            }
        };
    }, $webpack.Popup = function(e) {
        e.default = {};
    };
});