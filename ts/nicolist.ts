import * as $ from 'jquery'
import FavbuttonUtil from './favbutton'
import config from './form'
import Util from './util'
import NicolistImageDataURL from './images'

/**
 * get video list jQuery element 
 * @param {string} id - video id
 * @param {string} title - video title
 * @param {string} genre - video genre
 * @return {jQuery}
 */
function $rightVideoElem(id, title, genre){
	var div = $('<div>', {
		'class': 'd-flex flex-row align-items-center'
	});
	var favIcon = FavbuttonUtil.$createFavbutton(id, title, function onFav(_id, _title){
		if ($('#favs li').hasClass('selected')) {
			if ($('#right a[data-id='+id+']').length === 0){
				if (config.sort()){
					$rightVideoElem(id, title, '').insertAfter('#right h4');
				} else {
					$('#right').append($rightVideoElem(id, title, ''));
				}
			}
		}
	}, function onUnfav(_id, _title){
	}, function onBoth(_id, _title){
		refreshFavsLeft();
		localStorage.setItem('nicolist_star', JSON.stringify(FavbuttonUtil.starred));
	});
	var a = $( "<a>", {
		"href": getVideoURL(id),
		'target': '_blank',
		'data-genre' : genre,
		'data-id' : id,
		'data-title' : title,
		'class': 'rightvideo',
		'contextmenu': function(e){
			showMenu(e.pageX, e.pageY, $(this), 'right');
			return false;
		},
		'click': function(e){
			if ($('#click_action').val() !== 'official'){
				e.preventDefault();
			}
			openVideo($(this), 'right');
		}
	});
	div.append(favIcon);
	if (!config.showThumb()) {
		div.addClass('mb-2');
	}
	if (config.showThumb()){
		a.append(createStayUnloadedTNI(id, false));
	}
	if (config.taggedTitle()){
		var _ma = title.match(/【[^【】]+】/g);//【】
		var _mb = title.match(/\[[^\[\]]+\]/g);//[]
		var tags = [];
		var converted_title = title;
		if (_ma !== null){
			for (var j = 0; j < _ma.length; j++) {
				tags.push(_ma[j]);
			}
			converted_title = converted_title.replace(/【[^【】]+】/g, '');
		}
		if (_mb !== null){
			for (var j = 0; j < _mb.length; j++) {
				tags.push(_mb[j]);
			}
			converted_title = converted_title.replace(/\[[^\[\]]+\]/g, '');
		}
		converted_title = converted_title.replace(/^\s+/g, '').replace(/\s+$/g, '');
		a.append($('<span>',{
			text: converted_title,
			'class': 'mr-2'
		}));
		a.appendTo(div);
		for (var j = 0; j < tags.length; j++) {
			div.append($('<span>',{
				text: tags[j].slice(1, -1),
				'class': 'titletag ml-1',
				'click': function(){
					$('#search').val($(this).text());
					search($(this).text());
					var _s = $('#sr').offset().top-16;
					if (_s < $('html,body').scrollTop()){
						$('html,body').stop().animate({scrollTop:_s}, 'swing');
					}
				}
			}))
		}//j
	} else {
		a.append($('<span>',{
			text: title
		}));
		a.appendTo(div);
	}
	return div;
}
/**
 * get video url from video id
 * @param {string} id - video id
 * @return {string} - video url
 */
function getVideoURL(id){
	if (/^sm\d+$/.test(id)
		|| /^nm\d+$/.test(id)
		|| /^so\d+$/.test(id)
		|| /^\d+$/.test(id)){
		return 'http://www.nicovideo.jp/watch/' + id;
	} else {
		return 'https://www.youtube.com/watch?v=' + id;
	}
}
/**
 * get thumbnail url from video id
 * @param {string} id - video id
 * @return {string} thumbnail url
 */
function getThumbURL(id){
	if (/^sm\d+$/.test(id)){
		var numid = Util.int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if (/^nm\d+$/.test(id)){
		var numid = Util.int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if (/^so\d+$/.test(id)){
		var numid = Util.int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if (/^\d+$/.test(id)){
		var numid = Util.int(id);
		return NicolistImageDataURL.CHANNEL;
	} else {
		return 'https://img.youtube.com/vi/'+id+'/0.jpg'
	}
}
/**
 * get video id from video url
 * @param {string} str - url
 * @return {string|null} video id (null returned if not matched)
 */
function getIdFromURL(str){
	var m_sm = str.match(/nicovideo\.jp\/watch\/(sm\d+)/);
	if (m_sm !== null){
		return m_sm[1];
	}
	var m_nm = str.match(/nicovideo\.jp\/watch\/(nm\d+)/);
	if (m_nm !== null){
		return m_nm[1];
	}
	var m_so = str.match(/nicovideo\.jp\/watch\/(so\d+)/);
	if (m_so !== null){
		return m_so[1];
	}
	var m_cn = str.match(/nicovideo\.jp\/watch\/(\d+)/);
	if (m_cn !== null){
		return m_cn[1];
	}
	var m_yt = str.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
	if (m_yt !== null){
		return m_yt[1];
	}
	var m_yt2 = str.match(/youtube\.com\/watch\?[^&]+&v=([a-zA-Z0-9_-]+)/);
	if (m_yt2 !== null){
		return m_yt2[1];
	}
	return null;
}