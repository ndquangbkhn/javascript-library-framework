
"define webpack";
const Utility = webpack("Utility");
const DateUtil = webpack("DateUtil");
const Converter = webpack("Converter");

function createCacheData(value, expire) {
    return Converter.serialize({ val: value, exp: expire, time: new Date() });
}



function parseCachedData(cachedDataString) {
    if (!Utility.isValue(cachedDataString)) return null;
    var cachedData = Converter.deserialize(cachedDataString);
    var cachedTime = new Date(cachedData.time);
    if (cachedData.exp > 0) {
        var diff = DateUtil.diffMinutes(new Date(), cachedTime);
        if (diff >= cachedData.exp) {
            isExpired = true;
            return { Expired: true };
        }
    }
    return { Data: cachedData.val, CachedTime: cachedTime, Expired: false }
}

function cacheStorage(cacheKey, value, expire, storageObject) {
    if (Utility.isUndefined(value)) {
        var cachedDataString = storageObject.getItem(cacheKey);
        if (!Utility.isValue(cachedDataString)) {
            storageObject.removeItem(cacheKey);
            return null;
        }
        var parseData = parseCachedData(cachedDataString);
        if (parseData.Expired) {
            storageObject.removeItem(cacheKey);
            return null;
        } else {
            return parseData;
        }
    }

    if (Utility.isNull(value)) {
        storageObject.removeItem(cacheKey);
        return null;
    } else {

        var cacheData = createCacheData(value, expire);
        storageObject.setItem(cacheKey, cacheData);
        return {
            Data: parseCachedData(storageObject.getItem(cacheKey)).Data
        };
    }

}
function initSessionCache() {
    return {
        set: function (cacheKey, value, expire) {
            return cacheStorage(cacheKey, value, expire, window.sessionStorage);
        },
        delete: function (cacheKey) {
            let value = null;
            return cacheStorage(cacheKey, value, expire, window.sessionStorage);
        },
        get: function (cacheKey) {
            return cacheStorage(cacheKey, undefined, undefined, window.sessionStorage);
        }
    };
}
function initLocalCache() {
    return {
        set: function (cacheKey, value, expire) {
            return cacheStorage(cacheKey, value, expire, window.localStorage);
        },
        delete: function (cacheKey) {
            let value = null;
            return cacheStorage(cacheKey, value, expire, window.localStorage);
        },
        get: function (cacheKey) {
            return cacheStorage(cacheKey, undefined, undefined, window.localStorage);
        }
    };
}

exports["Session"] = initSessionCache();
exports["Local"] = initLocalCache();



