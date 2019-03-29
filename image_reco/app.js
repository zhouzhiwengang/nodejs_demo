"use strict"
var images = require('images')
var Tesseract = require('tesseract.js');
var request = require('request');
var fs = require('fs');
// 将图片下载到本地
function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream)
        .on('close', function () {
            callback();
        });
}
// 识别图片
function recognize(filePath, callback) {
    // 图片放大
    images(filePath)
        .size(90)
        .save(filePath);
    // 识别
    Tesseract
        .recognize(filePath, {
            lang: 'eng', // 语言选英文
            tessedit_char_blacklist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
                //因为是数字验证码，排除字母
        })
        .then((result) => {
            callback(result.text);
        });
}
function getVcode() {
    var url = 'https://ww1.sinaimg.cn/large/8c9b876fly1fe0bvsibibj201a00p07l.jpg';
    var filename = 'vcode.png';
    // 先下载下来，再识别
    downloadFile(url, filename, function () {
        recognize(filename, function (txt) {
            console.log('识别结果: ' + txt);
        });
    });
}
getVcode();