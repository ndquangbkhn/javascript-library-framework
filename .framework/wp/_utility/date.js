
"define webpack";

function init() {
    return {
        diffMinutes: function (dt2, dt1) {
            var diff = (dt2.getTime() - dt1.getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }
    };
}
exports["default"] = init();



