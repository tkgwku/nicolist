import NicolistImageDataURL from './images'
import * as $ from 'jquery'

/**
 * @classdesc fav button utility class
 * @constructor
 */
export default class FavbuttonUtil {
	/**
	 * fav id and title array
	 * @type {array}
	 */
	static starred = [];
	/**
	 * get fav button jQuery element
	 * @param {string} id - video id
	 * @param {string} title - video id
	 * @param {Function} onFav - called when faved
	 * @param {Function} onUnfav - called when unfaved
	 * @param {Function} onBoth - called when faved and unfaved
	 * @return {jQueryElem} fav button element 
	 */
	static $createFavbutton(id, title, onFav: Function, onUnfav: Function, onBoth: Function){
		var starIndex = FavbuttonUtil._indexOf(id);
		var favIcon = FavbuttonUtil._$favbutton(starIndex !== -1);
		favIcon.addClass('mr-2 pointer').attr({
			'title': 'お気に入り',
			'data-id': id,
			'data-title': title
		}).on('click', function(){
			var thisId = $(this).attr('data-id');
			var thisTitle = $(this).attr('data-title');
			FavbuttonUtil.toggleFav(thisId, thisTitle, onFav, onUnfav);
			onBoth(id, title);
		});
		return favIcon;
	}
	/**
	 * (start fav button animation)
	 * @param {jQueryElem} $fav - fav button jQuery element
	 */
	static _startStarAnimation($fav){
		var posx = $fav.offset().left - $fav.width()/2;
		var posy = $fav.offset().top - $fav.height()/2;
		var img = $('<img>',{
			'width': '32px',
			'height': '32px',
			'src': NicolistImageDataURL.LARGE_STAR_DATA_URL
		});
		var div = $('<div>',{
			'id': 'starAnime'
		}).css({'top':posy,'left':posx});
		div.append(img);
		$('#body').append(div);
		img.animate({width: '2px', height: '2px', opacity: 0, 'margin-left': '15px', 'margin-top': '15px'}, 300, function(){
			$('#starAnime').remove();
		});
	}
	/**
	 * (get fav button element)
	 * @param {boolean} starred - whether the video faved or not 
	 * @return {jQueryElem} fav button elem
	 */
	static _$favbutton(starred){
		return (starred ? $('<img>', {
			'src' : NicolistImageDataURL.STAR_DATA_URL
		}) : $('<img>', {
			'src' : NicolistImageDataURL.UNSTAR_DATA_URL
		})).addClass('favIcon');
	}
	/**
	 * (get fav index)
	 * @param {string} id - video id 
	 * @return {number} index (returned -1 if not found)
	 */
	static _indexOf(id){
		for (var i = 0; i < FavbuttonUtil.starred.length; i+=2) {
			var stId = FavbuttonUtil.starred[i];
			if (stId === id){
				return i;
			}
		}
	}
	/**
	 * toggle fav
	 * @param {string} id - video id 
	 * @param {string} title - video title 
	 * @param {Function} onFav - called when faved
	 * @param {Function} onUnfav - called when unfaved
	 */
	static toggleFav(id, title, onFav: Function, onUnfav: Function){
		var starIndex = FavbuttonUtil._indexOf(id);
		if (starIndex === -1){
			FavbuttonUtil.starred.push(id);
			FavbuttonUtil.starred.push(title);
			$('.favIcon[data-id='+id+']').each(function(){
				$(this).attr('src', NicolistImageDataURL.STAR_DATA_URL);
				FavbuttonUtil._startStarAnimation($(this));
			});
			onFav(id, title);
		} else {
			FavbuttonUtil.starred.splice(starIndex, 2);
			$('.favIcon[data-id='+id+']').each(function(){
				$(this).attr('src', NicolistImageDataURL.UNSTAR_DATA_URL);
			});
			onUnfav(id, title);
		}
	}
}
