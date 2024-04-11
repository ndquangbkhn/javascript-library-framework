
"define webpack";

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



