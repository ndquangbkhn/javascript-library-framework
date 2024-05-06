
"define webpack";
const DEFAULT_HEADER = {
    "Accept": "application/json",
    "Content-Type": "application/json"
};

function init() {
    return {
        post: function (url, headers, param, callback, onError, onException) {
            if(!headers) headers = {};
            let option = {
                method: "Post",
                headers: Object.assign({}, DEFAULT_HEADER, headers),
                body: param ? JSON.stringify(param) : null
            };

            fetch(
                url,
                option
            ).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    onError(res.status, res);
                    throw Error(res.statusText);
                }
            }).then(res => {
                if (typeof callback == "function") callback(res);
            }).catch(function (err) {
                if (typeof onException == "function") {
                    onException(ex);
                }
                console.log("Fetch Error", err);
            });
        },
        get: function (url, headers, param, callback, onError, onException) {
            if(!headers) headers = {};
            if (param) {
                if (url.indexOf("/") == 0) url = location.origin + url;
                let fullURL = new URL(url);
                Object.keys(param).forEach(function (key) {
                    fullURL.searchParams.append(key, encodeURIComponent(param[key]));
                });

                url = fullURL.toString();
            }

            let option = {
                method: "Get",
                headers: Object.assign({}, DEFAULT_HEADER, headers),
            };

            fetch(
                url,
                option
            ).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    onError(res.status, res);
                    throw Error(res.statusText);
                }
            }).then(res => {
                if (typeof callback == "function") callback(res);
            }).catch(function (err) {
                if (typeof onException == "function") {
                    onException(ex);
                }
                console.log("Fetch Error", err);
            });
        }
    };
}
exports["default"] = init();



