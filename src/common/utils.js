var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
var chnUnitChar = ["", "十", "百", "千"];
var utils = {
    numToChn(num) {
        var index = num.toString().indexOf(".");
        if (index != -1) {
            var str = num.toString().slice(index);
            var a = "点";
            for (var i = 1; i < str.length; i++) {
                a += chnNumChar[parseInt(str[i])];
            }
            return a;
        } else {
            return "";
        }
    },

    //定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
    sectionToChinese(section) {
        var str = "",
            chnstr = "",
            zero = false,
            count = 0; //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
        while (section > 0) {
            var v = section % 10; //对数字取余10，得到的数即为个位数
            if (v == 0) {
                //如果数字为零，则对字符串进行补零
                if (zero) {
                    zero = false; //如果遇到连续多次取余都是0，那么只需补一个零即可
                    chnstr = chnNumChar[v] + chnstr;
                }
            } else {
                zero = true; //第一次取余之后，如果再次取余为零，则需要补零
                str = chnNumChar[v];
                str += chnUnitChar[count];
                chnstr = str + chnstr;
            }
            count++;
            section = Math.floor(section / 10);
        }
        return chnstr;
    },

    //定义整个数字全部转换的方法，需要依次对数字进行10000为单位的取余，然后分成小节，按小节计算，当每个小节的数不足1000时，则需要进行补零

    TransformToChinese(num) {
        if (num === undefined) {
            return "";
        }

        var a = this.numToChn(num);
        num = Math.floor(num);
        var unitPos = 0;
        var strIns = "",
            chnStr = "";
        var needZero = false;

        if (num === 0) {
            return chnNumChar[0];
        }
        while (num > 0) {
            var section = num % 10000;
            if (needZero) {
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = this.sectionToChinese(section);
            strIns +=
                section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = section < 1000 && section > 0;
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr + a;
    },

    getUrlParam(key) {
        return (
            decodeURIComponent(
                (new RegExp("[?|&]" + key + "=" + "([^&;]+?)(&|#|;|$)").exec(
                    window.location.href
                ) || [, ""])[1].replace(/\+/g, "%20")
            ) || null
        );
    },

    decodeBase64(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            return str;
        }
    },

    base64_utf8_encode: function(input) {
        input = this.utf8_encode(input);
        return this.base64_encode(input);
    },

    base64_utf8_decode: function(input) {
        input = this.base64_decode(input);
        return this.utf8_decode(input);
    },

    base64_encode: function(input) {
        if (!input) return '';

        var _keyStr =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        //input = this.utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output =
                output +
                _keyStr.charAt(enc1) +
                _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) +
                _keyStr.charAt(enc4);
        }
        return output;
    },

    base64_decode: function(input) {
        if (!input) return '';

        var _keyStr =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        //output = this.utf8_decode(output);
        return output;
    },

    utf8_encode: function(string) {
        if (!string) return '';

        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    utf8_decode: function(utftext) {
        if (!utftext) return'';

        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(
                    ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                );
                i += 3;
            }
        }
        return string;
    },

    ajax(request) {
        request.dataType = "jsonp";
        request.type = "GET";
        request.jsonp = "callback";
        request.cache = true;
        request.timeout = 5000;
        if (typeof request.data !== "undefined") {
            request.data = {
                data: JSON.stringify(request.data)
            };
        }
        return $.ajax(request);
    },
    ajaxJson(request) {
        request.dataType = "json";
        request.type = "GET";
        request.cache = true;
        request.timeout = 5000;

        window.console.log(request);
        window.console.log("ajax json request...");
        return $.ajax(request);
    },
    ajaxJsonp(request) {
        request.dataType = "jsonp";
        request.type = "GET";
        request.jsonp = "callback";
        request.cache = true;
        request.timeout = 5000;

        window.console.log(request);
        window.console.log("ajax");
        return $.ajax(request);
    },

    thousandPoint: function(num) {
        if (!num) {
            return "0";
        }
        return num.toString().replace(/(?=(?!^)(\d{3})+$)/g, ",");
    },

    isClickTooFask: function(key) {
        let theKey = "lastClickTime" + key;
        let nowTime = new Date().valueOf();
        if (this[theKey]) {
            if (nowTime - this[theKey] < 1500) {
                return true;
            }
        }
        this[theKey] = nowTime;
        return false;
    },

    isOnline: function(callback) {
        const i = new Image();
        i.src = `${
            window.location.protocol
        }//web1.yystatic.com/public/global/base/image/yybear.jpg?t=${Date.parse(
            new Date()
        )}`;
        i.onload = function() {
            callback(true);
        };
        i.onerror = function() {
            callback(false);
        };
    },

    getMidInfo(str, beginStr, endStr, fromPos = 0) {
        let beginPos = str.indexOf(beginStr, fromPos);
        if (beginPos < fromPos) return undefined;
        let endPos = str.indexOf(endStr, beginPos + beginStr.length);
        if (endPos < fromPos) return undefined;

        return {
            info: str.substring(beginPos + beginStr.length, endPos),
            pos: endPos + endStr.length
        }
    },

    toast(msg) {
        let duration=2000;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 5em;color: rgb(255, 255, 255);display:flex;align-items:center;justify-content:center; word-wrap:break-word; word-break:break-all; text-align: center;border-radius: 20px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 1.2em;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    },
};

export default utils;
