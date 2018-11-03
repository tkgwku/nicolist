/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>
var Util = /** @class */ (function () {
    function Util() {
    }
    //static readonly domain = 'http://jar.oiran.org/app/nicolist';
    Util.getLS = function (key, callbackSuccess, callbackNull) {
        var ls = window.localStorage.getItem(key);
        if (ls !== null) {
            callbackSuccess(ls);
        }
        else {
            if (callbackNull)
                callbackNull();
        }
    };
    Util.getLSInt = function (key, callbackSuccess, callbackNaN) {
        var ls = Util.int(window.localStorage.getItem(key));
        if (!isNaN(ls)) {
            callbackSuccess(ls);
        }
        else {
            if (callbackNaN)
                callbackNaN();
        }
    };
    Util.isNull = function (smthng) {
        return $.type(smthng) === 'undefined' || smthng === null;
    };
    Util.escapeHtmlSpecialChars = function (text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
    Util.saveAsFile = function (filename, content) {
        var file = new Blob([content], { type: 'text/plane;' });
        if (!Util.isNull(window.navigator.msSaveOrOpenBlob)) {
            window.navigator.msSaveOrOpenBlob(file, filename);
        }
        else {
            var a = document.createElement('a');
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    };
    Util.bytesize = function (str) {
        return encodeURIComponent(str).replace(/%../g, "a").length;
    };
    Util.int = function (str) {
        if (str === null) {
            return NaN;
        }
        var num = parseInt(str, 10);
        if (isNaN(num)) {
            var m = str.match(/\d+/);
            if (m == null)
                return NaN;
            return parseInt(m[0], 10);
        }
        else {
            return num;
        }
    };
    Util.cutStringBytesize = function (str, max) {
        max = max || 50;
        if (Util.bytesize(str) > max) {
            var count = 0;
            var newstr = '';
            for (var i = 0; i < str.length; i++) {
                var chara = str.charAt(i);
                count += Util.bytesize(chara);
                if (count > max) {
                    return newstr + '...';
                }
                else {
                    newstr += chara;
                }
            }
        }
        else {
            return str;
        }
    };
    Util.cutString = function (str, max) {
        max = max || 40;
        if (str.length > max) {
            return str.substring(0, max) + '...';
        }
        else {
            return str;
        }
    };
    Util.registerTooltip = function ($elem) {
        $elem.tooltip({
            'placement': 'bottom',
            'animation': false,
            'template': '<div class="tooltip mt-2" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
    };
    Util.copyObj = function (obj) {
        return $.extend(true, {}, obj);
    };
    /**
     * shuffle array
     * @param {Array} srcarray - target array
     * @param {any} [first] - fix first element
     * @returns {Array} shuffled array
     */
    Util.shuffle = function (srcarray, first) {
        var array = srcarray.slice(0);
        if (array.length <= 1) {
            return array;
        }
        ;
        if (first) {
            var x = $.inArray(first, array);
            if (x !== -1) {
                array.splice(x, 1);
            }
        }
        var n = array.length, t, i;
        while (n) {
            i = Math.floor(Math.random() * n--);
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }
        if (first && x !== -1) {
            array.splice(0, 0, first);
        }
        return array;
    };
    Util.domain = 'https://tkgwku.github.io/n';
    return Util;
}());
