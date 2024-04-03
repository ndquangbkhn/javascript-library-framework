# Hướng dẫn thi công

## Node version

Using nodejs v16

## Package

Cài đặt node module

```
npm install
```
## Build & Release

### Build:
chạy lệnh:

```
gulp build
```


### Phát hành 
Chạy lệnh:

```
gulp release
```

Nếu báo lỗi 

```
The term 'gulp' is not recognized as the name of a cmdlet
```

thì chạy lệnh sau cài gulp
Cài đặt package

```
npm i --global gulp-cli 
npm i --global gulp@4.0.0 
npm i  gulp-concat 
npm i  gulp-uglify
npm i  gulp-clean-css
```