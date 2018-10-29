import * as $ from 'jquery'

/**
 * @classdesc video search utility class
 * @constructor
 */
export default class SearchUtil {
	/**
	 * compoundRe('xyzw', '.') -> 'x.y.z.w'
	 * @param {string} text - target string
	 * @param {string} re - string placed between chars
	 * @return {string}
	 */
	static compoundRe = function(text, re){
		var str = '';
		for (var i = 0; i < text.length; i++) {
			str += text.charAt(i);
			if (i < text.length-1){
				str += re;
			}
		}
		return str;
	}
}