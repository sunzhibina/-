const anOrios = wx.getSystemInfoSync();
const utilMd5 = require('./MD5.js');
const url = 'https://apigateway-tocwmp.youzy.cn';
// let url = 'https://apigateway-qa.youzy.cn';
const API_URL_C = 'https://wxcode.youzy.cn';
const API_URL_CPC = 'https://apigateway.youzy.cn/Data';
const API_URL_CPB = 'https://apigateway.youzy.cn/ToB';
const API_URL_CPD = url+'/Data';
const API_URL_CPU = url + '/ToCUsers';
const API_URL_CPUS = url;
const API_URL_CPToC = url + '/ToC';
const API_URL_CPP = 'https://pay.youzy.cn';
const key = '1ebc37b92a8d488fb7e1b44594a340dd';
function urlToObj(str) {
  var obj = [];
  var arr1 = str.split("?");
  var arr2 = arr1[1].split("&");
  for (var i = 0; i < arr2.length; i++) {
    var res = arr2[i].split("=");
    obj.push(res[0] + '=' + res[1]);
  }
  obj = obj.join('&');
  return obj;
}
module.exports = {
  fetchApi(url, type, bOrC, params) {
    let youzySignature = '';
    if (url.indexOf("?") != -1) {
      let newUrl = urlToObj(url);
      youzySignature = utilMd5.hexMD5((newUrl + '&' + key).toLowerCase()).toLowerCase();
    } else {
      if (params == undefined) {
        youzySignature = utilMd5.hexMD5(('&' + key).toLowerCase()).toLowerCase();
      } else {
        youzySignature = utilMd5.hexMD5((JSON.stringify(params) + '&' + key).toLowerCase()).toLowerCase();
      }
    }
    let apiUrl = '';
    if (bOrC == "C") {
      apiUrl = `${API_URL_C}/${url}`;
    } else if (bOrC == "CPC") {
      apiUrl = `${API_URL_CPC}/${url}`;
    } else if (bOrC == "CPB") {
      apiUrl = `${API_URL_CPB}/${url}`;
    } else if (bOrC == "CPD") {
      apiUrl = `${API_URL_CPD}/${url}`;
    } else if (bOrC == "CPU") {
      apiUrl = `${API_URL_CPU}/${url}`;
    } else if (bOrC == "CPUS") {
      apiUrl = `${API_URL_CPUS}/${url}`;
    } else if (bOrC == "CPP") {
      apiUrl = `${API_URL_CPP}/${url}`;
    } else if (bOrC == "CPToC") {
      apiUrl = `${API_URL_CPToC}/${url}`;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: apiUrl,
        method: type,
        data: params,
        header: {
          'content-type': 'application/json;charset=utf-8',
          'YouzyApp_Sign': youzySign(),
          'YouzyApp_ApiSign': youzyApiSign(),
          'YouzyApp_DataSign': youzyDATASign(),
          'YouzyApp_SuperSign': youzySuperSign(),
          'YouzyApp_FromSource': anOrios.system,
          "YouzyApp_IP": "",
          "Youzy-Signature": youzySignature
        },
        success: resolve,
        fail: function () {},
        complete: function (res) {
          // console.log("res=", res);
        }
      })
    })
  }
}
function getChars(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'Z';
        break;
      case '1':
        chars[i] = 'O';
        break;
      case '2':
        chars[i] = 'T';
        break;
      case '3':
        chars[i] = 't';
        break;
      case '4':
        chars[i] = 'F';
        break;
      case '5':
        chars[i] = 'f';
        break;
      case '6':
        chars[i] = 'S';
        break;
      case '7':
        chars[i] = 's';
        break;
      case '8':
        chars[i] = 'E';
        break;
      case '9':
        chars[i] = 'N';
        break;
      case '-':
        chars[i] = 'L';
        break;
      case ':':
        chars[i] = 'D';
        break;
      case ' ':
        chars[i] = 'B';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzyApiSign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'L';
        break;
      case '1':
        chars[i] = 'l';
        break;
      case '2':
        chars[i] = 'V';
        break;
      case '3':
        chars[i] = 'v';
        break;
      case '4':
        chars[i] = 'R';
        break;
      case '5':
        chars[i] = 'r';
        break;
      case '6':
        chars[i] = 'Y';
        break;
      case '7':
        chars[i] = 'y';
        break;
      case '8':
        chars[i] = 'P';
        break;
      case '9':
        chars[i] = 'I';
        break;
      case '-':
        chars[i] = 'W';
        break;
      case ':':
        chars[i] = 'w';
        break;
      case ' ':
        chars[i] = 'Q';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzyDATASign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'P';
        break;
      case '1':
        chars[i] = 'O';
        break;
      case '2':
        chars[i] = 'I';
        break;
      case '3':
        chars[i] = 'U';
        break;
      case '4':
        chars[i] = 'Y';
        break;
      case '5':
        chars[i] = 'T';
        break;
      case '6':
        chars[i] = 'R';
        break;
      case '7':
        chars[i] = 'E';
        break;
      case '8':
        chars[i] = 'W';
        break;
      case '9':
        chars[i] = 'Q';
        break;
      case '-':
        chars[i] = 'A';
        break;
      case ':':
        chars[i] = 'S';
        break;
      case ' ':
        chars[i] = 's';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzySuperSign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'M';
        break;
      case '1':
        chars[i] = 'N';
        break;
      case '2':
        chars[i] = 'B';
        break;
      case '3':
        chars[i] = 'V';
        break;
      case '4':
        chars[i] = 'C';
        break;
      case '5':
        chars[i] = 'X';
        break;
      case '6':
        chars[i] = 'Z';
        break;
      case '7':
        chars[i] = 'L';
        break;
      case '8':
        chars[i] = 'K';
        break;
      case '9':
        chars[i] = 'J';
        break;
      case '-':
        chars[i] = 'H';
        break;
      case ':':
        chars[i] = 'G';
        break;
      case ' ':
        chars[i] = 'F';
        break;
    }
  }
  return chars.join("");
}
function youzySign() {  //yyyy-MM-dd HH:mm:ss:SSS
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = secss + "-" + mon + "-" + day + " " + hours + ":" + mins + ":" + secs + ":" + hao;
  var str = getChars(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "G" + getChars(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "C" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzyApiSign() {  //MM-yyyy-HH dd-mm-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  var str = mon + "-" + secss + "-" + hours + " " + day + "-" + mins + "-" + secs;
  var str = getCharsyouzyApiSign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "h" + getCharsyouzyApiSign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "U" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzyDATASign() {  //HH:MM-yyyy:::dd-SSS-mm-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = hours + ':' + mon + '-' + secss + ':::' + day + '-' + hao + '-' + mins + '-' + secs;
  var str = getCharsyouzyDATASign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "t" + getCharsyouzyDATASign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "T" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzySuperSign() {  //mm-dd-SSS-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = mins + '-' + day + '-' + hao + '-' + secs;
  var str = getCharsyouzySuperSign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "Q" + getCharsyouzySuperSign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "q" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}