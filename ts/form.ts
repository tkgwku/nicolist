import * as $ from 'jquery' 

/**
 * @type {Object.<string, Function>}
 */
export default {
	sort: function(){
		return $('#nicolist_sort').prop('checked');
	},
	showThumb: function(){
		return $('#nicolist_thumb').prop('checked');
	},
	taggedTitle: function(){
		return $('#nicolist_taggedtitle').prop('checked');
	}
}