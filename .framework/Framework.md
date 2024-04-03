# 1. Giới thiệu
Framework dùng để viết module (ui, thư viện,...) nhúng vào các ứng dụng khác.

# 2. Cấu trúc framework

## .framework
Thư mục chứa code của framework. 
- Các file template chứa đoạn mã định nghĩa cho webpack, moduel factory,...
- Các core-webpack như utility, date, secure,...

## .release
Thư mục lưu bản phát hành, tài liệu

## .vscode
Thư mục config vscode. DEV không chỉnh sửa

## app
Chứa source code cần thi công

### app/assets
Lưu các tài nguyên như ảnh, icon,...
- img -- Thư mục lưu ảnh, icon
- build -- thư mục chứa code js và css sau khi build
- test.html  -- file test

### app/config
- config.json -- Lưu các giá trị config cho module

### app/culture
Chứa các file resource theo từng ngôn ngữ

### app/data
Chứa dữ liệu sử dụng trong module. Ví dụ ảnh base64, đoạn text,...

### app/src
Chứa các file code (js và css)

#### app/src/template
Chứa các file html template cho UI nếu có

#### app/src/webpack
Chứa code của webpack.
Các file js trong thư mục này phải viết theo cấu trúc 1 webpack (hướng dẫn bên dưới)

#### app/src/webpack/ui
Chứa code của các webpack có UI. File css được viết trong thư mục này.

#### app/src/_autogen
Thư mục lưu file tự sinh khi bundle. DEV không sử dụng

## dist
Thư mục chứa file output

## node_modules
Chứa các modules nodejs. DEV không sử dụng


## webpackconfig
Cấu hình webpack cho ứng dụng.

### webpackconfig/_autogen
Chứa thông tin toàn bộ các webpack có sẵn của framework.
```js
//Convert dữ liệu, serialize hoặc deserialize,...
Converter=false;

//Xử lý dữ liệu kiểu Date
DateUtil=false;
```

Các webpack mặc định được load thì có giá trị là true.
DEV sửa dụng webpack nào thì lấy tên và config lại trong file webpack.core.json

### webpack.core.json
File cấu hình sử dụng **webpack core** nào của framework

```json
{
    "DateUtil": true,
    "Converter": true
}
```

Tên **webpack core** có thể xem trong file:
```
webpackconfig/_autogen/webpack.core.default.js
```

### webpack.map.json
File cấu hình sử dụng webpack của project

```json
{
    "DialogUI": "DialogUI",
    "Event": "event",
    "Service": "service"
}
```

- Key là tên của webpack. Được sử dụng trong cú pháp webpack("webpack_name");
- Value: tên file code js trong thư mục app/src/webpack

## bundleconfig.json
Cấu hình phiên bản, tên file output, tên module,..



# 3. Thi công

## 3.1 Biến global

Biến global là biến có thể truy cập trong toàn bộ source code của ứng dụng.
Được định nghĩa tên ở file bundleconfig.json 

```json
//bundleconfig.json
{
    "global":"your_obj_name"
}
```

ứng dụng truy cập thông qua window["your_obj_name"].

Nếu không cần tương tác với ứng dụng, có thể bỏ trống global 


```json
//bundleconfig.json
{
    "global":""
}
```

## 3.2 Config

Webpack "Config" là mặc định load.

### Thêm config
Thêm vào file app/config/config.json theo dạng key-value

### Đọc config

```js
const Config = webpack("Config");

let value = Config["your-config-key"];

```

## 3.3 Resource

Webpack "Resource" là mặc định load.

### Thêm resource
Thêm file resource theo ngôn ngữ vào thư mục app/culture
Tên file theo cấu trúc {culture-name}.json
Ví dụ: vi.json, en.json, de.json

Thêm text theo dạng key-value vào file tương ứng
Ví dụ:

```json
{
    "Title": "Thêm nhân viên",
    "Description":"Nhập để thêm nhân viên"
}

```

### Đọc resource

```js
//lấy resource theo tiếng việt
const Resource = webpack("Resource", "vi");
//lấy tiêu đề
let value = Resource["Title"];

```
## 3.4 Data

Webpack "Data" là mặc định load.

### Thêm data
Thêm file json vào thư mục app/data/ theo cấu trúc {file_name}.json
Dữ liệu được lưu dạng key-value

Ví dụ thêm file Location.json

```json
{
    "Bắc Ninh":"BN",
    "Hà Nội": "HN"
}
```
Mỗi file thêm vào trở thành 1 module trong webpack("Data") với module-name là tên file.

### Đọc dữ liệu

```js

const location = webpack("Data","Location");

//hoặc 
const Data = webpack("Data");
const location = Data.Location;
```

## 3.5 Template

Webpack "Template" là mặc định load.

### Thêm template

Thêm file .html vào thư mục app/src/template/ theo cấu trúc {file_name}.html

Ví dụ thêm file Popup.html

```html
<div class='your-module-popup' res-title='Popup_Title'>
    <div class='your-module-header' >
        <label res-key='Popup_Caption'></label>
        <input res-placeholder="Popup_InputPlaceholder"/>
    </div>
</div>
```

### Lấy template

Sử dụng webpack Template, tên template là tên file .html

```js
const Template = webpack("Template");
//lấy template dạng text
let popupTemplate = Template["Popup"];

```

### Tạo element từ template

Sử dụng webplace HTMLUtil được load mặc định vào project.

```js
let HTMLUtil = webpack("HTMLUtil");
let element = HTMLUtil.createElementByTemplate("Popup");
```

element được tạo ra từ template, các thông tin hiển thị theo ngôn ngữ được load tự động từ Resource theo các attribute config sau:

- res-key: element được binding text từ Resource theo key. 
- res-title: element được setAttribute title từ Resource theo key
- res-placeholder: element được set placeholder từ Resource theo key. Dùng cho input
- res-data-placeholder: tương tự res-placeholder, nhưng dành cho contenteditable


## 3.6 Webpack

Một webpack là 1 nhóm code độc lập thực hiện 1 chức năng cụ thể nào đó giống như định nghĩa Class trong C#. Trong 1 webpack có thể chia thành nhiều module mỗi module thực hiện 1 nhiệm vụ riêng.



### Thêm 1 webpack
Tạo file {webpack-name}.js trong thư mục app/src/webpack
Thêm chỉ thị

```js
"use webpack";
```
vào dòng đầu tiên của file.

Tất cả biến. function viết trong file sẽ được scope và chỉ truy cập được trong file.
Biến hoặc function nào muốn public ra để module khác sử dụng thì thông qua biến exports

```js
exports["module_name"] = ...
```

Định nghĩa default để khi không load webpack theo module 

```js
exports["default"] = ...
```
Nếu không định nghĩa default thì khi load webpack sẽ trả về obj exports chứa toàn bộ module

Các module muốn exports ra để sử dụng có thể là obj, function, ... được gắn vào biến exports

Ví dụ viết 1 webpack làm tính năng tìm kiếm trong file search.js
```js
"use webpack";
let myObj = {
    search: function(key){
        //do search
    }
};
//module mặc định được trả về khi gọi webpack không yêu cầu module_name cụ thể
exports["default"] = myObj;
//module SearchFn được public ra để sử dụng bên ngoài
exports["SearchFn"] = myObj.search
```

Config webpack mới vào webpack.map.json

```json
{
    "SearchUtil": "search"
}

```


### Sử dụng webpack

Để sử dụng 1 webpack hoặc 1 module trong webpack phải gọi hàm khởi tạo:

```js
const moduleObj = webpack("webpack_name", "module_name");
```
Trong đó:
- webpack_name là tên của Webpack (được đăng ký trong webpackconfig)
- module_name tên của module trong webpack. Trong 1 webpack có thể định nghĩa nhiều module.

Sử dụng webpack default thì không truyền module_name

```js
const wpObj = webpack("webpack_name");
```           

Một webpack được định nghĩa trước trong 1 file .js với cụm "use webpack"; ở dòng đầu tiên. Code định nghĩa chỉ được thực thi khi lần đầu webpack được yêu cầu load.


Ví dụ:

```js
//lấy object search
const SearchUtil = webpack("SearchUtil");
SearchUtil.search();

//lấy function search
let searchFn = webpack("Search", "SaerchFn");
searchFn();
```

### 3.7 startup.js

Startup.js là file code sẽ được chạy ngay khi thư viện được load vào ứng dụng. Thường trong startup.js làm các việc sau:
- public các method cho ứng dụng tích hợp sử dụng (init, show, loadData,...)
- có thể tự gọi khởi tạo hoặc đưa ra method khởi tạo cho ứng dụng chủ động

Để đảm bảo scope, toàn bộ code trong startup.js được viết trong JavaScript immediately invoked function (IIF)

```js
(function () {
    console.log("start");

    //init fn
    function init(config){
        //do something here
    }

    //public methods
    global.init = init.bind(global);
})();
```

# 4. Build và Release
- Đặt tên file output và version trong bundleconfig.json

## Build
Mở terminal chạy lênh

```
gulp build
```

Kết quả file .js và .css (nếu có file css trogn webpack/ui) được tạo ra trong thư mục app/assets/build/
File khi build chưa được minify, dùng để debug

## Release

Mở terminal chạy lênh

```
gulp release
```

Kết quả:
-  file .min.js và .min.css đã được minify (nếu có file css trogn webpack/ui)  tạo trong thư mục app/assets/build/  
- Sau đó tự động copy tất cả file trong app/assets/build/ vào dist/src và app/assets/img vào dist/img

File khi release được minify

# 5. Testing
Tạo file test.html trogn thư mục app/build để test thư viện vừa build ra.

Ví dụ: thư viện misa.newfeature được build version 1.0.0. Biến global được config trong bundleconfig.json là MISANewFeature

```html
<html>

<head>
    <title>MISA Test NewFeature</title>
    
    <link rel="stylesheet" type="text/css" href="build/misa.newfeature-1.0.0.css">
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>

<body style="background:#ccc">
    <script src="build/misa.newfeature-1.0.0.js"></script>
    <script>

        

        let notiData = [
            {
                "NotificationFeatureID": "457a8cd9-f4ac-4f9a-93d4-274c6383c85f",
                "FeatureType": 1,
                "IsView": 1,
                "IsDetailView": 0
            } 
        ];

        MISANewFeature.init({
            language: 'vi',
            data: notiData,
            version: '',
            autoShow: true,
        });
    </script>
</body>

</html>
```

# 6. Sửa lõi, nâng cấp thư viện
Mỗi lần phát hành 1 bản thư viện sửa lỗi hoặc nâng cấp tính năng cần phải thay đổi version

Đánh version theo cú pháp

```
{phiên bản}.{phiên bản tính năng}.{phiên bản sửa lỗi}
```

## Sửa lỗi thư viện
Ví dụ bản phát hành lib-3.3.0.min.js có lỗi không check null biến.
sửa lỗi xong phát hành bản 3.3.1

Khi nâng cấp lên lib-3.3.1.min.js dự án chỉ cần kiểm tra lại lõi đã được sửa chưa.

## Nâng cấp tính năng mới
Thư viện thêm hàm xử lý Date chẳng hạn. Xuất bản version 3.4.0
Khi nâng cấp từ 3.3.x lên lib-3.4.0.min.js phải không ảnh hưởng đến luồng hiện tại của dự án.

## Thay đổi lớn (luồng, config, giải pháp...)
Khi có thay đổi lớn buộc dự án phải thay đổi cách tích hợp thì nâng giá trị đầu tiên của version
Ví dụ thư viện bỏ sử dụng callback mà chuyển sang đồng nhất sử dụng event để tương tác với ứng dụng. Xuất bản phiên bản mới 4.0.0
Khi nâng cấp lên 4.0.0 dự án phải thay đổi cách config, cách tương tác trao đổi dữ liệu với thư viện, phải code lại.