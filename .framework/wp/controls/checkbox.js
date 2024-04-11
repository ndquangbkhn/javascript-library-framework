"define webpack";

const uiClass = webpack("Class");
const Utility = webpack("Utility");
const DOMUtil = webpack("DOMUtil");

let checkBoxControl = uiClass.extend(function () {
    var me = this;

    let _ui_monitor = {};


    this.default = {
        language: "vi",
        afterShow: null,
        afterHide: null,
        data: []

    };

    let _opts = {};

    let _resource = {};
    this.constructor = function (options) {
        _opts = {};
        Object.assign(_opts, me.default);
        Object.assign(_opts, options);
        _opts.language = _opts.language || "vi";
        _resource = webpack("Resource", _opts.language) || webpack("Resource", "vi");
        if (typeof _opts.resource === "object") {
            Object.assign(_resource, _opts.resource);
            delete _opts.resource;
        }

        me.data = _opts.data;
    };


    /**
     * Binding dữ liệu
     */
    function bindData(data) {
        me.data = data;

        //binding here
        
    }

    function render() {
        if (!_ui_monitor.initDOM) {
            initDOM();
        }

        _ui_monitor.rendered = true;
        document.body.appendChild(me.el); //write to body
    }

    function initDOM() {

        //đối tượng dialog
        me.el = DOMUtil.create("div", "misalibs-checkbox-container", { "misa-type": "checkbox" });


        if (me.data) {
            bindData(me.data);
        }

        _ui_monitor.initDOM = true;
    }

    this.hide = function () {
        if (me.el) {
            DOMUtil.hide(me.el);
            if (Utility.isFn(_opts.afterHide)) {
                _opts.afterHide(me.data);
            }
        }
    };

    /**
        * Hiển thị dialog thông báo
        */
    this.show = function () {
        if (!_ui_monitor.rendered) {
            render();
        }
        DOMUtil.show(me.el);

    };


});

exports["default"] = checkBoxControl;