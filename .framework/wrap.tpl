(function (window, seft, factory) {
    factory(seft, window);
})(window, {0}, function (global, window) {
   
    let $webpack = {};
    let $webpack_config = {
    };
    
     $webpack["Config"] = {
                exports: {
                    default:{}
                },
                loaded: true
            };

    $webpack["Data"] = {
                exports: {
                },
                loaded: true
            };
    
    $webpack["Resource"] = {
                exports: {
                },
                loaded: true
            };
    
    $webpack["Template"] = {
                exports: {
                },
                loaded: true
            };

    (function(){
        function loadData(name, value){
            $webpack["Data"].exports[name] = value;
        }

        function loadTemplate(name, value){
            $webpack["Template"].exports[name] = value;
        }
        function loadResource(culture, value){
            if(culture != "add"){
                $webpack["Resource"].exports[culture] = value;
            }
        }


        $webpack["Resource"].exports.add = loadResource;

        function loadConfig(value){
            Object.assign($webpack["Config"].exports.default , value);
        }

        function loadWebpackConfig(value){
            $webpack_config = value;
        }

        {1}
    })();

  

    function webpack(webpackName, moduleName){
        let wpname = $webpack_config[webpackName];
        let wpObj = $webpack[webpackName];
        if(wpname){
            wpObj = $webpack[wpname];
        }
        if( wpObj){
            if(!wpObj.exports) wpObj.exports= {};
            if(!wpObj.loaded){
                wpObj.call($webpack[webpackName], wpObj.exports);
                wpObj.loaded = true;
            }

            if(moduleName && wpObj.exports[moduleName]){
                return wpObj.exports[moduleName];
            } else {
                if(moduleName){
                    console.warn("module " + moduleName + " is not defined");   
                }
            }

           return wpObj.exports.default?  wpObj.exports.default: wpObj.exports;
           
        } else {
            console.error("webpack " + webpackName + " is not defined");   
        }
    }
    
    window.log =function(){
        console.log($webpack);
    };

    {REPLACE_SCRIPT}
});

