/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>

class Util{
	static readonly domain = 'https://tkgwku.github.io/n';
	//static readonly domain = 'http://jar.oiran.org/app/nicolist';
	static getLS(key, callbackSuccess:Function, callbackNull?:Function){
		let ls = window.localStorage.getItem(key);
		if (ls !== null){
			callbackSuccess(ls);
		} else {
			if (callbackNull) callbackNull();
		}
	}
	static getLSInt(key, callbackSuccess:Function, callbackNaN?:Function){
		let ls = Util.int(window.localStorage.getItem(key));
		if (!isNaN(ls)){
			callbackSuccess(ls);
		} else {
			if (callbackNaN) callbackNaN();
		}
    }
	static isNull(smthng){
		return $.type(smthng) === 'undefined' || smthng === null;
	}
	static escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, x => {return '\\'+x});
	}
	static escapeREInsideBracket(str){
		return str.replace(/[\[\]\-\\\*\^]/g, (x) => {
			return '\\' + x;
		})
	}
	static zenkakuToHankakuS(t:string) {
		return t.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(x) {
			return String.fromCharCode(x.charCodeAt(0) - 0xFEE0);
		});
	}
	static zenkakuToHankakuA(qs:Array<string>) {
		let a = []
		for (let q of qs){
			a.push(Util.zenkakuToHankakuS(q));
		}
		return a;
	}
	static escapeHtmlSpecialChars(text) {
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}
	static saveAsFile(filename, content){
		var file = new Blob([content], {type: 'text/plane;'});
		if (!Util.isNull(window.navigator.msSaveOrOpenBlob)) {
			window.navigator.msSaveOrOpenBlob(file, filename);
		} else {
			var a = document.createElement('a');
			var url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() =>  {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);  
			}, 0); 
		}
	}
	static bytesize(str) {
		return encodeURIComponent(str).replace(/%../g, "a").length;
	}
	static int(str){
		if (str === null) {return NaN;}
		let num = parseInt(str, 10);
		if (isNaN(num)){
			let m = str.match(/\d+/);
			if (m == null) return NaN;
			return parseInt(m[0], 10);
		} else {
			return num;
		}
	}
	static cutStringBytesize(str, max){
		max = max || 50;
		if (Util.bytesize(str) > max){
			var count = 0;
			var newstr = ''
			for (var i = 0; i < str.length; i++) {
				var chara = str.charAt(i);
				count += Util.bytesize(chara);
				if (count > max){
					return newstr + '...';
				} else {
					newstr += chara;
				}
			}
		} else {
			return str;
		}
	}
	static cutString(str, max){
		max = max || 40;
		if (str.length > max){
			return str.substring(0, max)+'...';
		} else {
			return str;
		}
	}
	static registerTooltip($elem){
		$elem.tooltip({
			'placement': 'bottom',
			'animation': false,
			'template': '<div class="tooltip mt-2" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
		});
	}
	static copyObj(obj){
		return $.extend(true, {}, obj);
	}
	/**
	 * shuffle array 
	 * @param {Array} srcarray - target array
	 * @param {any} [first] - fix first element 
	 * @returns {Array} shuffled array
	 */
	static shuffle(srcarray: Array<any>, first?){
		let array = srcarray.slice(0);
		if (array.length <= 1) {return array};
		if (first){
			var x = $.inArray(first, array);
			if (x !== -1){
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
	}
}