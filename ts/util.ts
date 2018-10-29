import * as $ from 'jquery'

/**
 * @classdesc utility class
 * @constructor
 */
export default class Util {
	/**
	 * escape []-\*^ into \[\]\-\\\*\^
	 * @param {string} str - target string
	 * @return {string}
	 */
	static escapeREInsideBracket = function(str){
		return str.replace(/[\[\]\-\\\*\^]/g, function(x){
			return '\\' + x;
		});
	}
	/**
	 * cut string
	 * @param {string} str - target string
	 * @param {number} [max=40] - max length
	 * @return {string}
	 */
	static restrLength = function(str, max=40){
		if (str.length > max){
			return str.substring(0, max)+'...';
		} else {
			return str;
		}
	}
	/**
	 * cut string
	 * @param {string} str - target string
	 * @param {number} [max=50] - max bytesize
	 * @return {string}
	 */
	static restrBytesize = function(str, max=50){
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
	/**
	 * get bytesize of string
	 * @param {string} str - target string
	 * @return {number}
	 */
	static bytesize = function(str) {
		return encodeURIComponent(str).replace(/%../g, "a").length;
	}
	/**
	 * escape HTML special chars: &<>"'
	 * @param {string} text - target string
	 * @return {string} 
	 */
	static escapeHtmlSpecialChars = function(text) {
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}
	/**
	 * return if given param is not undefined and not null
	 * @param {any} smthng - target
	 * @return {boolean}
	 */
	static isDefined = function(smthng){
		return $.type(smthng) !== 'undefined' && smthng !== null;
	}
	/**
	 * prompt save file window
	 * @param {string} filename - name of new file
	 * @param {string} content - content of new file 
	 */
	static promptWinExplorer = function(filename, content){
		var file = new Blob([content], {type: 'text/plane;'});
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(file, filename);
		} else {
			var a = document.createElement('a');
			var url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);  
			}, 0); 
		}
	}
	/**
	 * string to integer
	 * @param {string} str - target string
	 * @return {number|NaN}
	 */
	static int = function(str){
		if (str === null) {return NaN;}
		var num = parseInt(str, 10);
		if (isNaN(num)){
			return parseInt(str.match(/\d+/)[0], 10);
		} else {
			return num;
		}
	}
	/**
	 * copy object
	 * @param {Object} obj - target object
	 * @return {Object}
	 */
	static copyObj = function(obj){
		return $.extend(true, {}, obj);
	}
	/**
	 * place alert 
	 * @param {string} mes - message string
	 * @param {string} [type='warning'] - alert type (bootstrap)
	 * @param {string} [wrapper='#alert'] - wrapper selecter (should be empty div)
	 * @param {boolean} [permanent=false] - get rid of close button
	 * @param {jQuery} [$appendElem] - append element at the end of alert
	 */
	static message = function(mes, type, wrapper, permanent, $appendElem) {
		const MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
		if ($.type(type) !== 'string' || $.inArray(type, MESSAGE_TYPES) === -1) type = 'warning';
		if ($.type(wrapper) !== 'string' || wrapper === '') wrapper = '#alert';
		if ($.type(permanent) !== 'boolean') permanent = false;
		var div = $('<div>', {
			'class': 'alert alert-'+type
		}).css('display', 'none');
		if (!permanent){
			$('<button>', {
				html: '<span>&times;</span>',
				'type':'button',
				'class':'close',
				'click': function(){
					//$(this).parent().fadeOut('slow', refreshStyle);
				}
			}).appendTo(div);
		}
		var span = $('<span>', {
			text: mes
		});
		if ($appendElem) {
			span.append($appendElem)
		};
		span.appendTo(div);
		$(wrapper).html('');
		$(wrapper).append(div);
		div.fadeIn();
	}
	/**
	 * 1,048,576 -> '1 MB'
	 * @param {number} byte - size bytes
	 * @return {string} formated string
	 */
	static sizeString = function(byte){
		if (byte < 500){
			return byte + " byte";
		} else if (byte >> 10 < 500){
			var a = Math.round( byte * 100 / 1024 ) / 100;
			return a + " KB";
		} else {
			var a = Math.round( (byte * 100 / 1024) / 1024 ) / 100;
			return a + " MB";
		}
	}
	/**
	 * register tooltip (bootstrap.js)
	 * @param {jQuery} $elem - target jQuery element
	 */
	static registerTooltip = function($elem){
		$elem.tooltip({
			'placement': 'bottom',
			'animation': false,
			'template': '<div class="tooltip mt-2" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
		});
	}
}