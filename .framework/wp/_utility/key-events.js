
"define webpack";
const Utility = webpack("Utility");


function init() {
    return {
        on: function (element, actions) {
            if (Utility.isFn(actions.onKeyDown) || Utility.isFn(actions.onEnter) || Utility.isFn(actions.onESC)) {
                let handleKeyDown = function (e) {

                    var code = e.which;
                    var target = e.target;
                    if (Utility.isFn(actions.onKeyDown)) {
                        actions.onKeyDown(target, code, e);
                    }
                    if (code == 13 && Utility.isFn(actions.onEnter)) {
                        actions.onEnter(target, code, e);
                    }

                    if (code == 27 && Utility.isFn(actions.onESC)) {
                        actions.onESC(target, code, e);
                    }
                };
                element.addEventListener('keypress', handleKeyDown);
            }

            if (Utility.isFn(actions.onKeyPress)) {

                let handleKeyPress = function (e) {

                    var code = e.which;
                    var target = e.target;
                    actions.onKeyPress(target, code, e);

                    if (code == 13 && Utility.isFn(actions.onEnter)) {
                        actions.onEnter(target, code, e);
                    }

                    if (code == 27 && Utility.isFn(actions.onESC)) {
                        actions.onESC(target, code, e);
                    }
                };

                element.addEventListener('keypress', handleKeyPress);

            }

            if (Utility.isFn(actions.onKeyUp)) {

                let handleKeyUp = function (e) {
                    var code = e.which;
                    var target = e.target;
                    actions.onKeyUp(target, code, e);
                };

                element.addEventListener('keyup', handleKeyUp);

            }

        }

    };
}
exports["default"] = init();



