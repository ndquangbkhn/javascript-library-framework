
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
        }
        
    };
}
exports["default"] = init();



