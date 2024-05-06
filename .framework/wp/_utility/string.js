
"define webpack";

function init() {
    return {
        replaceAll: function (inputString, searchKey, replacementString) {
            const regex = new RegExp(searchKey, 'g');
            const updatedString = inputString.replace(regex, replacementString);
            return updatedString;
        },
        format: function (template, ...params) {
            return template.replace(/{(\d+)}/g, (match, index) => {
                const paramIndex = Number(index);
                if (paramIndex < params.length) {
                    return params[paramIndex];
                }
                return match;
            });
        }

    };
}
exports["default"] = init();



