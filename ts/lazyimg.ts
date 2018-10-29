import * as $ from 'jquery'

/**
 * @classdesc lazy loading image utility class
 * @constructor
 */
export default class LazyImgUtil {
	/**
	 * fav id and title array
	 * @type {array}
	 */
	static loadedImg = [];
	/**
	 * load image which is visible in screen
	 * @param {jQuery} $images - target images (mostly .img-thumbnail s)
	 * @param {jQuery} [$scrollable=$('html,body')] - hooked element
	 */
	static loadVisibleImg($images, $scrollable=$('html,body')) {
		var horizon = $(window).height() + $scrollable.scrollTop();
		$images.each(function(i, elem){
			if (!$(elem).is(':hidden')){
				if ($(elem).offset().top < horizon){
					LazyImgUtil.loadImg($(elem));
				}
			}
		});
	}
	/**
	 * hook scroll event
	 * @param {jQuery} $images - target images (mostly .img-thumbnail s)
	 * @param {jQuery} [$scrollable=$('html,body')] - hooked element
	 */
	static registerScrollEvent($images, $scrollable=$('html,body')){
		$scrollable.scroll(function(){
			LazyImgUtil.loadVisibleImg($images, $scrollable);
		});
	}
	/**
	 * load image
	 * @param {jQuery} $img - image element to load, which has data-src attr
	 */
	static loadImg($img){
		const LOADING_CLASS = 'loading';
		var srcurl = $img.attr('data-src');
		if (srcurl){
			$img.on('load', function(){
				if ($.inArray($(this).attr('src'), LazyImgUtil.loadedImg) === -1){
					LazyImgUtil.loadedImg.push($(this).attr('src'));
				}
				$(this).removeClass(LOADING_CLASS);
				$img.removeAttr('data-src');
			});
			$img.attr('src', srcurl);
		}
	}
	/**
	 * create loadable image
	 * @param {string} src - url of image
	 * @param {classes} classes - css classes of image
	 * @return {jQuery} image elem
	 */
	static $createLoadableImg(src, classes){
		return $('<img>',{
			'data-src': src,
			'alt': 'Loading',
			'class': 'loading ' + classes
		});
	}
}
