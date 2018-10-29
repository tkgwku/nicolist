import * as $ from 'jquery'

/**
 * @classdesc video player utility class
 * @constructor
 */
export default class PlayerUtil {
	/**
	 * shuffle array
	 * @param {array} array - taregt array
	 * @param {any} [first] - fix first element
	 * @return {array} shuffled array
	 */
	static shuffle = function(array, first){
		if (array.length <= 1) {return array};
		var copied = array.slice(0, array.length);
		if (first){
			var x = $.inArray(first, copied);
			if (x !== -1){
				copied.splice(x, 1);
			}
		}
		var n = copied.length, t, i;
		while (n) {
			i = Math.floor(Math.random() * n--);
			t = copied[n];
			copied[n] = copied[i];
			copied[i] = t;
		}
		if (first && x !== -1) {
			copied.splice(0, 0, first);
		}
		return copied;
	}
	/**
	 * [a, b, c, d, e, f] -> [e, f, c, d, a, b]
	 * @param {array} list - target array (must have 2x content)
	 * @return {array}
	 */
	static reversePairList = function(list){
		if (list.length % 2 === 1) {
			throw new Error('Util.reversePairList: target must have 2x content');
		}
		var _list = [];
		for (var i = list.length/2 - 1; i >= 0; i--) {
			_list.push(list[2*i]);
			_list.push(list[2*i+1]);
		}
		return _list;
	}
}
