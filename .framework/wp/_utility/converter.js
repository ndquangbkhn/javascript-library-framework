
"define webpack";

function init() {
    return {
        serialize: function(obj){
            if(Array.isArray(obj)){
                return JSON.stringify(obj);
            } else {
                const getCircularReplacer = () => {
                    const seen = new WeakSet();
                    return (key, value) => {
                        if (typeof value === "object" && value !== null) {
                            if (seen.has(value)) {
                                return;
                            }
                            seen.add(value);
                        }
                        return value;
                    };
                };
            
                return JSON.stringify(obj, getCircularReplacer());
            }
        },
        deserialize: function(text) {
            if (typeof text == 'string') {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    return {};
                }
            } else if (typeof text == 'object' && Object.keys(text).length > 0) {
                return text;
            } else {
                return {};
            }
        }
    };
}
exports["default"] = init();



