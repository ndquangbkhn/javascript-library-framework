"define webpack";

function initClass() {
    //Hàm khởi tạo, chạy trước cả hàm constructor
    function initialize(fn) {
        if (fn.parent instanceof Function) {
            initialize.apply(this, [fn.parent]);
            this.callParent = _clone(this,
                _superCopy(this, this.constructor)
            );
        }
        fn.apply(this, arguments);
    }
    //Hàm clone prototye từ class cha sang class con
    function _clone(source, des) {
        for (var prop in source) {
            //Chỉ override hàm
            if (prop !== "callParent" && source[prop] instanceof Function && !(source[prop].prototype instanceof _class)) {
                des[prop] = source[prop].callParent || _superCopy(source, source[prop]);
            }
        }
        return des;
    }
    function _superCopy(scope, fn) {
        var scopeSuper = scope.callParent;
        return fn.callParent = function () {
            var oldScope = scope.callParent;
            scope.callParent = scopeSuper;
            var fnReturn = fn.apply(scope, arguments);
            scope.callParent = oldScope;
            return fnReturn;
        };
    }

    /**
     * Tạo một Class base hỗ trợ kế thừa
     */
    let _class = function () { };
    _class.extend = function extd(des) {
        function childClass() {
            if (initialize !== arguments[0]) {
                //Tạo đối tượng kế thừa
                initialize.apply(this, [des]);
                _clone(this, this);
                if (this.initializer instanceof Function)
                    this.initializer.apply(this);
                this.constructor.apply(this, arguments);
            }
        }
        childClass.prototype = new this(initialize);
        childClass.prototype.constructor = childClass;
        childClass.toString = function () {
            return des.toString();
        };

        childClass.extend = function (target) {
            target.parent = des;
            return extd.apply(childClass, arguments);
        };

        return childClass;
    };

    //Kế thừa chính nó để tránh lặp vô hạn
    _class = _class.extend(function () {
        var me = this;
        this.constructor = function () { };
        this.default = {};

        
    });

    return _class;
}

exports["default"] =  initClass();



