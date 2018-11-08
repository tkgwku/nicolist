/// <reference path="images.ts"/>
/// <reference path="util.ts"/>
/// <reference path="mobile.ts"/>
/// <reference path="player.ts"/>
/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../node_modules/@types/sortablejs/index.d.ts"/>

class Nicolist{
	static readonly MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
	static readonly SEP_DEF_VAL = ' 　+';
	static readonly IGN_DEF_VAL = '';
	static readonly debug = false;

	static y:object = {"とりあえず":[]};
	static prevy:object = {"とりあえず":[]};
	static searchHistory = [];
	static selectedGenre = '';
	static showingMenu = false;
	static readonly islocal = !Nicolist.debug && window.location.protocol === 'file:';
	static starred = [];
	static lastId = '';//checkURLValidity()
	static loadedtn = [];
	static fileToLoad:File;

	static loadImg($elem: JQuery){
		var srcurl = $elem.attr('data-src');
		if (srcurl){
			$elem.on('load', (e) => {
				if ($.inArray($(e.currentTarget).attr('src'), Nicolist.loadedtn) === -1){
					Nicolist.loadedtn.push($(e.currentTarget).attr('src'));
				}
				$(e.currentTarget).removeClass('loading');
				$(e.currentTarget).off('load');
			});
			$elem.attr('src', srcurl);
		}
	}
	static loadImgOnScreen(scrollSelecter, wrapperSelecter) {
		var horizon = $(window).height() + $(scrollSelecter).scrollTop() + 50;
		$(wrapperSelecter).find('img[data-src]:visible').each((i, elem) => {
			if ($(elem).offset().top < horizon){
				Nicolist.loadImg($(elem));
			}
		});
	}
	static search(query:string) {
		let separator = Util.escapeREInsideBracket($('#nicolist_separator').val()+'');
		let queryArray = [];
		if (separator === ''){
			queryArray = [query];
		} else {
			let ga = separator.charAt(0);
			queryArray = query
				.replace(new RegExp('['+separator+']', 'g'), ga)
				.replace(new RegExp(`${ga}+`, 'g'), ga)
				.replace(new RegExp(`${ga}$|^${ga}`, 'g'), '')
				.split(ga);
		}
		if (queryArray[0] === '') {
			Nicolist.message('検索クエリが空です。');
			return;
		}
		let sqDesc = queryArray.join('」+「');

		$('#sr').html('');

		$('<button>', {
			'class': 'close',
			'aria-label': 'Close',
			'click': e => {
				$('#sr').fadeOut('slow', () => {
					Nicolist.refreshStyle();
					$('#sr').html('');
				});
			}
		}).append($('<span>', {
			html: '&times;'
		})).appendTo('#sr');

		Nicolist.pushHistory(query);

		const isand = $("#nicolist_and").prop('checked');// true: AND false: OR
		let maxsearchcount = Util.int($("#nicolist_msc").val() + '');
		if (maxsearchcount <= 0){
			maxsearchcount = Infinity;
		}
		
		const ignore = Util.escapeREInsideBracket($('#nicolist_ignore').val() + '');

		let videoCount = 0;
		let genreCount = 0;
		let maxlength = 0;

		let $wrapperSr = $('<div>');

		/**
		 * div#sr
		 *   div=$wrapperSr
		 *     h4 {text: 検索結果}
		 *       small {text: xx件の一致}
		 *     div {data-for:genreTitle}
		 *       p {text: Genrename, data-for:titleText}
		 *       (p) {data-for: desc}
		 *     div=$wrapperVideos {data-for:wrapperVideos}
		 *       div=$wrapperVideo {class: d-flex...}
		 *         img=$favbutton
		 *         a=$a {data-id, data-title, data-genre}
		 *           (img {class: img-thumbnail})
		 *           span
		 */

		for (const genre in Nicolist.y){
			const list = $('#nicolist_sort').prop('checked') ? Nicolist.reversePairList(Nicolist.y[genre]) :  Nicolist.y[genre].slice(0);
			let $wrapperVideos;
			let thisGenreMatchCount = 0;
			for (let l = 0, _len = list.length/2; l <_len; l+=1){
				const id = list[2*l];
				const title = list[2*l+1];

				let match = isand ? Nicolist.matchAND : Nicolist.matchOR; 

				let matchArray = $('#nicolist_hankaku').prop('checked') ?
					match(title, queryArray, ignore) : 
					match(Util.zenkakuToHankakuS(title), Util.zenkakuToHankakuA(queryArray), ignore);
				if (matchArray){
					videoCount+=1;
					if (videoCount > maxsearchcount){
						$('#sr').append($('<div>', {
							'class': 'd-flex flex-row align-items-center'
						}).append($('<img>', {
							'src': OVERFLOW
						})).append($('<div>', {
							text: `検索条件「${sqDesc}」に一致する動画が多すぎます!`,
							'class': 'ml-4'
						})));
						$('#sr').fadeIn();
						return;
					}
					// first match appeared on this genre
					if (thisGenreMatchCount === 0){
						genreCount+=1;
						$wrapperSr.append($('<div>', {
							'data-for': 'genreTitle',
						}).append($('<p>', {
							text: genre,
							'data-for': 'titleText'
						})));
	
						$wrapperVideos = $('<div>', {
							'data-for': 'wrapperVideos',
							'class': 'mt-2 mb-2'
						});
					}
					thisGenreMatchCount += 1;
					if (thisGenreMatchCount > maxlength){
						maxlength = thisGenreMatchCount;
					}

					let $wrapperVideo = $('<div>',{
						'class': 'd-flex align-items-center flex-row'
					});

					let $favbutton = Nicolist.createFavIcon(id, title);
	
					$wrapperVideo.append($favbutton);
	
					let $a = MobileUtil.anchorOpt($('<a>', {
						'href': Nicolist.getVideoURL(id),
						'target': '_blank',
						'data-genre' : genre,
						'data-id' : id,
						'data-title' : title,
					}), (e2) => {
						if ($('#click_action').val() !== 'official'){
							e2.preventDefault();
						}
						Nicolist.openVideo($(e2.currentTarget), 'search');
					}, e => {
						Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'search');
						e.preventDefault();
					});

					if ($('#nicolist_thumb_res').prop('checked')){
						$a.append(Nicolist.createStayUnloadedTNI(id, false));
					}

					$a.append(Nicolist.$markedSpan(title, matchArray));
					$wrapperVideo.append($a);
					$wrapperVideos.append($wrapperVideo);
				}
			}
			if ($wrapperVideos){
				$wrapperSr.append($wrapperVideos);
			}
		}
		if (videoCount === 0) {
			$('#sr').append($('<span>', {
				text: `検索条件「${sqDesc}」に一致する動画はありませんでした`
			}));
			$('#sr').fadeIn();
			return;
		}

		$wrapperSr.prepend($('<h4>', {
			text: `「${sqDesc}」の検索結果`
		}).append($('<small>',{
			text: `(${videoCount}件の一致)`,
			'class': 'text-muted ml-2'
		})));

		const manyMatched = $('#nicolist_thumb_res').prop('checked') && maxlength > 10 && videoCount > 20;

		if (manyMatched){
			$wrapperSr.find('[data-for=genreTitle]').each((_i, _elem) => {
				$(_elem).on('click', e => {
					$(_elem).next().toggleClass('silent');
					$(_elem).children().filter('[data-for=desc]').toggleClass('silent');
					Nicolist.loadImgOnScreen('html, body', '#sr');
				});
				$(_elem).text('- '+$(_elem).text());
				$(_elem).addClass('pointer hover');
				$(_elem).append($('<p>', {
					text: 'クリックして詳細を表示',
					'class': 'white-gray ml-2',
					'data-for': 'desc'
				}));
			});
			$wrapperSr.find(`[data-for=wrapperVideos]`).addClass('silent');
		}
		$('#sr').append($wrapperSr);
		$('#sr').fadeIn();
		Nicolist.loadImgOnScreen('html, body', '#sr');
		$('#alert').fadeOut();
	}
	static $markedSpan(t:string, m:Array<string>){
		if (!$('#nicolist_highlight').prop('checked')){
			return $('<span>', {
				text: t
			});
		}
		let d = $('<span>');
		let completed = [];
		let marked = [];
		if (!$('#nicolist_hankaku').prop('checked')){
			t = Util.zenkakuToHankakuS(t);
			m = Util.zenkakuToHankakuA(m);
		}
		const mark = (from, count) => {
			if (from == -1) return;
			let i = 0;
			while (i < count) {
				if (marked.indexOf(from+i) === -1){
					marked.push(from+i);
				}
				i+=1;
			}
		}
		for (const str of m){
			if ($.inArray(str, completed) === -1){
				for (let k = 0, klen = t.length - str.length + 1;k < klen; k+=1){
					if (str.toUpperCase() === t.substring(k, k+str.length).toUpperCase()){
						mark(k, str.length);
						completed.push(str);
					}
				}
			}
		}
		let lastMarkStart = -1;
		let lastMarkEnd = -1;
		for (let j = 0, len = t.length;j < len;j+=1){
			let isMarked = marked.indexOf(j) !== -1;
			if (isMarked){
				if (lastMarkStart === -1){
					lastMarkStart = j;
				}
				if (lastMarkEnd !== -1){
					d.append($('<span>', {
						text: t.substring(lastMarkEnd, j)
					}));
					lastMarkEnd = -1;
				}
			} else {
				if (lastMarkEnd === -1){
					lastMarkEnd = j;
				}
				if (lastMarkStart !== -1){
					d.append($('<mark>', {
						text: t.substring(lastMarkStart, j)
					}));
					lastMarkStart = -1;
				}
			}
		}
		if (lastMarkStart !== -1){
			d.append($('<mark>', {
				text: t.substring(lastMarkStart, t.length)
			}));
		}
		if (lastMarkEnd !== -1){
			d.append($('<span>', {
				text: t.substring(lastMarkEnd, t.length)
			}));
		}
		return d;
	}
	
	static ignorantRE(t:string, x:string) {
		let re = '';
		for (let i = 0, len = t.length; i < len; i+=1){
			re += Util.escapeRegExp(t.charAt(i)) + (i === len-1 ? '' : x);
		}
		return re;
	}
	static matchSingle(t:string, q:string, ignore:string){
		return ignore === '' ? 
			t.match(new RegExp(Util.escapeRegExp(q), 'gi')) :
			t.match(new RegExp(Nicolist.ignorantRE(q, `[${ignore}]*`), 'gi'));
	}
	static matchAND(t:string, qs:Array<string>, ignore:string){
		let ms = [];
		for (let q of qs){
			let m = Nicolist.matchSingle(t, q, ignore);
			if (m){
				ms = ms.concat(m);
			} else {
				return null;
			}
		}
		return ms.slice(0);
	}
	static matchOR(t:string, qs:Array<string>, ignore:string){
		let ms = [];
		for (let q of qs){
			let m = Nicolist.matchSingle(t, q, ignore);
			if (m){
				ms = ms.concat(m);
			}
		}
		if (ms.length !== 0) {
			return ms.slice(0);
		} else {
			return null;
		}
	}
	static getVideoURL(id){
		if (/^sm\d+$/.test(id)
			|| /^nm\d+$/.test(id)
			|| /^so\d+$/.test(id)
			|| /^\d+$/.test(id)){
			return 'http://www.nicovideo.jp/watch/' + id;
		} else {
			return 'https://www.youtube.com/watch?v=' + id;
		}
	}
	static getThumbURL(id){
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
			return CHANNEL;
		} else {
			return 'https://img.youtube.com/vi/'+id+'/0.jpg'
		}
	}
	static videoIdMatch(str){
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
	static sub(){
		if (Nicolist.checkValidity()){
			const title = $('#title').val()+'';
			const genre = $('#genre').val()+'';
			const id = Nicolist.videoIdMatch($('#url').val());
			if (!Nicolist.has(genre, id)){
				Nicolist.pushPrev();
				Nicolist.y[genre].push(id);
				Nicolist.y[genre].push(title);
				Nicolist.refresh('v');//video change
				$('#url').val('');
				$('#title').val('');
				$('#url, #title').removeClass('is-valid');
				if (!$('#registry').hasClass('silent')){
					$('#registry').addClass('silent');
				}
				$('#registry').html('');
				Nicolist.lastId = '';
				$('#alert, #alert-addvideo').html('');
				if ($('#nicolist_stayopen').prop('checked')){
					Nicolist.messageUndoable(`動画「${Util.cutString(title, 50)}」を追加しました`, 'success', '#alert-addvideo', 'v');
				} else {
					Nicolist.messageUndoable(`動画「${Util.cutString(title, 50)}」を追加しました`, 'success', null, 'v');
					$('#addVideoModal').modal('hide');
				}
			} else {
				Nicolist.message('すでに登録されています', 'warning', '#alert-addvideo');
			}
		}
	}
	static checkTitleValidity($node){
		if ($node.val() === ''
			|| $node.val().length > 100 
			|| /^http:\/\//.test($node.val()) 
			|| /^https:\/\//.test($node.val())){
			$node.removeClass('is-valid');
			$node.addClass('is-invalid');
			return false;
		} else {
			$node.removeClass('is-invalid');
			$node.addClass('is-valid');
			return true;
		}
	}
	static checkURLValidity(){
		let m = Nicolist.videoIdMatch($('#url').val()+'');
		if (m !== null){
			$('#url').removeClass('is-invalid');
			$('#url').addClass('is-valid');
			if (m !== Nicolist.lastId){
				$('#registry').html('');
				let already = $('<ul>', {
					'class': 'list-unstyled'
				});
				for (let genre in Nicolist.y){
					const list = Nicolist.y[genre];
					for (let i = 0, _len = list.length/2; i < _len; i+=1) {
						const id = list[2*i];
						const title = list[2*i+1];
						if (id === m){
							already.append(
								$('<li>', {
									text: genre
								}).append($('<span>', {
									text: `(${Util.cutString(title, 80)})`,
									'class': 'ml-2 text-muted' 
								}))
							);
						}
					}
				}
				let div = $('<div>', {
					'class': 'd-flex align-items-center flex-row'
				});
				div.append(Nicolist.createThumbImgElem(m, false));
				if (already.html() !== ''){
					$('#registry').prepend($('<div>',{
						text: 'この動画はすでに以下のジャンルに登録されています:',
						'class': 'mb-2 text-muted'
					}));
					div.append(already);
					div.appendTo('#registry');
				} else {
					div.append($('<span>',{
						text: 'サムネイルはこのように表示されます',
						'class': 'text-muted'
					}));
					div.appendTo('#registry');
				}
				$('#registry').removeClass('silent');
				Nicolist.lastId = m;
			}
			return true;
		} else {
			$('#url').removeClass('is-valid');
			$('#url').addClass('is-invalid');
			$('#registry').addClass('silent');
			return false;
		}
	}
	static checkGenreValidity(){
		if ($('#genre').val() === ''){
			$('#genre').addClass('is-invalid');
			return false;
		}
		return true;
	}
	static checkValidity(){
		var flag = Nicolist.checkGenreValidity();
		flag = Nicolist.checkURLValidity() && flag;
		flag = Nicolist.checkTitleValidity($('#title')) && flag;
		if (!flag){
			$('#button').prop('disabled', true);
		} else {
			$('#button').prop('disabled', false);
		}
		return flag;
	}
	static pushHistory(queryStr) {
		const _hindex = $.inArray(queryStr, Nicolist.searchHistory);
		if (_hindex === -1){
			let a = [];
			a.push(queryStr);
			let count = Math.min(Util.int($('#nicolist_historyCount').val()+'')-1, Nicolist.searchHistory.length);
			for (let i = 0; i < count; i+=1) {
				a.push(Nicolist.searchHistory[i]);
			}
			Nicolist.searchHistory = a;
		} else {
			let a = [];
			a.push(queryStr);
			for (let i = 0, _len = Nicolist.searchHistory.length; i < _len; i+=1) {
				if (i !== _hindex){
					a.push(Nicolist.searchHistory[i]);
				}
			}
			Nicolist.searchHistory = a;
		}
		localStorage.setItem('searchHistory', JSON.stringify(Nicolist.searchHistory));
	}
	static handleVideoDrop(e:DragEvent){
		const sel = e.pageX > $('#addVideoModal').outerWidth(true)/2 ? '#title' : '#url';
		let data = e.dataTransfer.items;
		if (Util.isNull(data)) {
			Nicolist.message('あなたのブラウザはDragEventをサポートしていないため、ドラッグ&ドロップの処理を続行することができません', 'danger');
			return;
		}
		for (let i = 0; i < data.length; i+=1) {
			if (data[i].kind !== 'string'){continue;}
			if (/^text\/plain/.test(data[i].type)) {
				data[i].getAsString((s) => {
					$(sel).val(s);
					Nicolist.checkValidity();
				});
			} else if (/^text\/html/.test(data[i].type)) {
				data[i].getAsString((s) => {
					let m = s.match(/<[^><]+>[^><]*(?=<)/g);
					let s2 = null;
					if (m !== null){
						for (let j = 0, _jlen = m.length; j < _jlen; j+=1){
							if (/<span id="video-title"/.test(m[j])){
								s2 = m[j].replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
								$('#title').val(s2);
							}
						}
					}
					if (s2 === null){
						let s2 = s.replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
						$('#title').val(s2);
					}
					Nicolist.checkValidity();
				});
			} else if (/^text\/uri-list/.test(data[i].type)) {
				data[i].getAsString((s) => {
					$('#url').val(s);
					Nicolist.checkValidity();
				});
			}
		} 
		$(sel).removeClass('dragging');
	}
	static registerScrollEventListener($scrollElem, func, interval=5){
		$scrollElem.scroll((e:JQuery.Event) => {
			let $thisElem = $(e.currentTarget);
			let thisphase = $thisElem.data('__scroll_phase');
			if (Util.isNull(thisphase)){
				$thisElem.data('__scroll_phase', 0);
			} else {
				if (thisphase >= interval){
					func(e);
					$thisElem.data('__scroll_phase', 0);
				} else {
					$thisElem.data('__scroll_phase', thisphase+1);
				}
			}
		});
	}
	static registerEventListener(){
		NicolistPlayer.registerEventListener();
		$(window).on('unload', () => {
			Nicolist.unload();
		});
		Nicolist.registerScrollEventListener($(window), (e) => {
			Nicolist.loadImgOnScreen('html, body', '#sr, #right');
		});
		Nicolist.registerScrollEventListener($('#ccModal'), (e) => {
			Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
		});
		$('input[type=checkbox]').on('change', (e) => {
			let id = $(e.currentTarget).attr('id');
			if (!Util.isNull(id)){
				window.localStorage.setItem(id, $(e.currentTarget).prop('checked'));
			}
		});
		/* create copy / move videos */
		$('#nicolist_thumb_cc').on('change', () =>  {
			$('#ccvideos').find('.img-thumbnail').each((_i, elem) => {
				$(elem).toggleClass('silent');
				Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
			});
		});
		$('#ccopen').on('click', (e) => {
			$('#ccvideos').html('');
			$('#ccalert').html('');
			$('#ccModal').modal('show');
			/** 
			 * div#ccvideos
			 *   p=$genre_name {data-genre, class: ccgenrename}
			 *     span {text: -, class: genre_indicator}
			 *     span {text: Genrename}
			 *     span {datacount, class: badge}
			 *   div=$genre_videos
			 *     div=$genre_video_item {class: d-flex, data-id, data-genre, data-title}
			 *       img  {data-src, class: img-thumbnail}
			 *       span {text: Title}
			 *     ...
			*/
			for (let genre in Nicolist.y){
				let $genre_name = $('<p>',{
					'click': (e2) => {
						let $thisElem = $(e2.currentTarget);
						let $genreVideosElem = $thisElem.next();
						if ($genreVideosElem.hasClass('silent')){
							$genreVideosElem.removeClass('silent');
							$thisElem.parent().find('.ccgenrename').each((i, elem) => {
								if ($(elem).attr('data-genre') !== $thisElem.attr('data-genre')){
									$(elem).next().addClass('silent');
									$(elem).find('.cc_genre_indicator').text('-');
								}
							});
							$thisElem.find('.cc_genre_indicator').text('+');
							Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
						} else {
							$genreVideosElem.addClass('silent');
							$thisElem.find('.cc_genre_indicator').text('-');
						}
						return false;
					},
					'data-genre': genre,
					'class':'ccgenrename'
				});
				$genre_name.append($('<span>', {
					text: '-',
					'class': 'cc_genre_indicator mr-1'
				}));
				$genre_name.append($('<span>', {
					text: genre
				}));
				$genre_name.append($('<span>',{
					'data-count':'0',
					'class': 'badge badge-pill badge-secondary2 ml-2'
				}));
				let $genre_videos = $('<div>', {
					'class': 'silent'
				});

				let list = Nicolist.y[genre];
				if ($('#nicolist_sort').prop('checked')){
					list = Nicolist.reversePairList(list);
				}
				for (let i = 0, _len = list.length/2; i < _len; i+=1) {
					const id = list[2*i];
					const title = list[2*i+1];
					let $genre_video_item = $('<div>', {
						'class': 'd-flex flex-row align-items-center ccvideo',
						'data-title' : title,
						'data-id'    : id,
						'data-genre' : genre,
						'data-for' 	 : 'cc_genre_video',
						'click': (e3) => {
							let $thisElem = $(e3.currentTarget);
							let $countElem = $thisElem.parent().prev().find('[data-count]');
							let count = Util.int($countElem.attr('data-count'));
							if ($thisElem.hasClass('alert-success')){
								$thisElem.removeClass('alert-success');
								count-=1;
							} else {
								$thisElem.addClass('alert-success');
								count+=1;
							}
							$countElem.attr('data-count', count+'');
							if (count === 0) {
								$countElem.addClass('silent');
							} else {
								$countElem.removeClass('silent');
								$countElem.text(count+'');
							}
						}
					});
					let $img = Nicolist.createStayUnloadedTNI(id, false);
					if (!$('#nicolist_thumb_cc').prop('checked')){
						$img.addClass('silent');
					}
					$genre_video_item.append($img);
					$genre_video_item.append($('<span>', {
						text: title
					}));
					$genre_videos.append($genre_video_item);
				}
				$('#ccvideos').append($genre_name);
				$('#ccvideos').append($genre_videos);
			}
			Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
		});
		$('#ccnew').on('change', (e) => {
			let val = $('#ccnew').val() + '';
			localStorage.setItem('nicolist_ccnewval', val+'');
			if (val === 'copytoold' || val === 'movetoold'){
				$('#ccnewform').css('display', 'none');
				$('#ccoldform').css('display', 'block');
			} else {
				$('#ccnewform').css('display', 'block');
				$('#ccoldform').css('display', 'none');
			}
			if (val === 'copytoold' || val === 'copytonew'){
				$('#createcopy, #createcopy2').text('コピー');
			} else {
				$('#createcopy, #createcopy2').text('移動');
			}
		});
		$('#createcopy, #createcopy2').on('click', () => {
			let $cc_video_selected = $('#ccvideos').find('.alert-success[data-for=cc_genre_video]');
			if ($cc_video_selected.length === 0){
				Nicolist.message('動画が選択されていません。', 'warning', '#ccalert');
				$('#ccModal').stop().animate({scrollTop:0}, 'slow');
				return;
			}
			let mode = $('#ccnew').val()+'';
			if (mode === 'copytoold' || mode === 'movetoold') {
				let targetgenre = $('#ccoldsel').val()+'';
				if (!Nicolist.y.hasOwnProperty(targetgenre)){
					Nicolist.message('ジャンルを選択してください。', 'warning', '#ccalert');
					return;
				}
				let remove_cc = mode === 'movetoold';
				let failcount = 0;
				let successcount = 0;
				let _y = Util.copyObj(Nicolist.y);
				$cc_video_selected.each((_i, elem) => {
					const id = $(elem).attr('data-id');
					const title = $(elem).attr('data-title');
					if ($.inArray(id, _y[targetgenre]) === -1){
						_y[targetgenre].push(id);
						_y[targetgenre].push(title);
						if (remove_cc){
							const genre = $(elem).attr('data-genre');
							let list2 = _y[genre];
							let newlist = [];
							for (let i = 0, _len=list2.length/2; i < _len; i+=1){
								if (list2[2*i] !== id){
									newlist.push(list2[2*i]);
									newlist.push(list2[2*i+1]);
								}
							}
							_y[genre] = newlist;
						}
						successcount+=1;
					} else {
						failcount+=1;
					}
				});
				if (successcount > 0){
					Nicolist.pushPrev();
					Nicolist.y = _y;
					let verb = remove_cc?'移動':'コピー';
					Nicolist.messageUndoable(`${successcount}個の動画を「${targetgenre}」に${verb}しました` 
						+ (failcount > 0 ? ` (${failcount}個の動画は既に登録されているため${verb}されません)` : ''), 'success', null, 'vgs');
					Nicolist.setSelGen(targetgenre);
					Nicolist.refresh('gvs');
					$('#ccModal').modal('hide');
				} else {
					Nicolist.message(`すべて「${targetgenre}」に登録済みの動画です`, 'warning', '#ccalert');
					$('#ccModal').stop().animate({scrollTop:0}, 'slow');
					return;
				}
			} else if (mode === 'copytonew' || mode === 'movetonew') {
				let remove_cb = mode === 'movetonew';
				let ccname = $('#ccname').val()+'';
				if (ccname === ''){
					Nicolist.message('作成するジャンルの名前を入力してください。', 'warning', '#ccalert');
					$('#ccModal').stop().animate({scrollTop:0}, 'slow');
					return;
				} else if (Nicolist.y.hasOwnProperty(ccname)){
					Nicolist.message('既に存在するジャンル名です。', 'warning', '#ccalert');
					$('#ccModal').stop().animate({scrollTop:0}, 'slow');
					return;
				} else {
					Nicolist.pushPrev();
					let list = [];
					$cc_video_selected.each((_i, elem) => {
						const title = $(elem).attr('data-title');
						const id = $(elem).attr('data-id');
						if (remove_cb){
							const genre = $(elem).attr('data-genre');
							let list2 = Nicolist.y[genre];
							let newlist = [];
							for (var i = 0, _len = list2.length/2; i < _len; i+=1){
								if (list2[2*i] !== id){
									newlist.push(list2[2*i]);
									newlist.push(list2[2*i+1]);
								}
							}
							Nicolist.y[genre] = newlist;
						}
						if ($.inArray(id, list) === -1){
							list.push(id);
							list.push(title);
						}
					});
					Nicolist.y[ccname] = list;
					let verb = remove_cb ? '移動' : 'コピー';
					Nicolist.messageUndoable(`「${ccname}」に${list.length/2}個の動画を${verb}しました`, 'success', null, 'gvs');
					Nicolist.setSelGen(ccname);
					Nicolist.refresh('gvs');
					$('#ccalert').html('');
					$('#ccModal').modal('hide');
					$('#ccname').val('');
				}
			}
		});
		/* end: create copy / move videos */

		$('#showAddGenre').on('click', () => {
			$('#genreModal').modal('show');
			$('#alert-genre').html('');
		});
		$('#randomFromAll').on('click', () => {
			Nicolist.randomFromAll();
		});
		$('#randomFromRight').on('click', () => {
			Nicolist.randomFromRight();
		});
		$('#favs').on('click', (e) => {
			if (!$(e.currentTarget).hasClass('disabled')) {Nicolist.showFavs();}
		});
		$('#nicolist_thumb').on('change', () => {
			Nicolist.refresh('v');
		});
		$('#nicolist_taggedtitle').on('change', () => {
			Nicolist.refresh('v');
		});
		$('#nicolist_sort').on('change', () => {
			Nicolist.refresh('v');
		});
		$('#nicolist_multitab').on('change', () =>  {
			$('#laert').fadeOut();
		});
		$('#openAddModal').on('click', () => {
			$('#alert-addvideo').html('');
			$('#addVideoModal').modal('show');
		});
		$('#click_action').on('change', (e) => {
			localStorage.setItem('nicolist_click_action', $(e.currentTarget).val()+'');
		});
		$('#openPref').on('click', () => {
			$('#nicolist_separator').removeClass('is-valid');
			$('#prefModal').modal('show');
		});
		$('#nicolist_separator').on('input', () => {
			localStorage.setItem('nicolist_separator', $('#nicolist_separator').val()+'');
			$('#nicolist_separator').addClass('is-valid');
		});
		$('#nicolist_ignore').on('input', () => {
			localStorage.setItem('nicolist_ignore', $('#nicolist_ignore').val()+'');
		});
		$('#body').on('dragstart', (e) => {
			(<DragEvent>e.originalEvent).dataTransfer.clearData();
		});
		$('#body, #prefModal').on('dragover', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
		$('#body').get(0).ondrop = (e) => {
			e.preventDefault();
			let data = e.dataTransfer.items;
			if (data && data.length > 0 && data[0].kind){
				for (let i = 0; i < data.length; i+=1) {
					if (data[i].kind === 'file' && /json/.test(data[i].type)) {
						Nicolist.fileToLoad = data[i].getAsFile();
						$('#rawFileName').text(Nicolist.fileToLoad.name);
						$('#loadRawJson').removeClass('silent');
						$('#dummyLoadRawJson').addClass('silent');
						$('#prefModal').on('shown.bs.modal', () => {
							$('#prefModal').stop().animate({scrollTop:$('#loadRawJson').offset().top}, 1400, () => {
								$('#prefModal').off('shown.bs.modal');
							});
						});
						$('#prefModal').modal('show');
						break;
					} else if (data[i].kind === 'string'){
						$('#addVideoModal').modal('show');
						Nicolist.handleVideoDrop(e);
						break;
					}
				}
			} else {
				/* for IE-11 */
				let files = e.dataTransfer.files;
			
				for (let i = 0; i < files.length; i+=1) {
					if (/\.json$/.test(files[i].name)) {
						Nicolist.fileToLoad = files[i];
						$('#rawFileName').text(Nicolist.fileToLoad.name);
						$('#loadRawJson').removeClass('silent');
						$('#dummyLoadRawJson').addClass('silent');
						$('#prefModal').on('shown.bs.modal', () => {
							$('#prefModal').stop().animate({scrollTop:$('#loadRawJson').offset().top}, 1400, () => {
								$('#prefModal').off('shown.bs.modal');
							});
						});
						$('#prefModal').modal('show');
						break;
					}
				}
			}
		};
		$('#prefModal').get(0).ondrop = (e) => {
			e.preventDefault();
			let data = e.dataTransfer.items;
			if (data && data.length > 0 && data[0].kind){
				for (let i = 0; i < data.length; i+=1) {
					if (data[i].kind === 'file' && /json/.test(data[i].type)) {
						Nicolist.fileToLoad = data[i].getAsFile();
						$('#rawFileName').text(Nicolist.fileToLoad.name);
						$('#loadRawJson').removeClass('silent');
						$('#dummyLoadRawJson').addClass('silent');
						$('#prefModal').stop().animate({scrollTop:$('#loadRawJson').offset().top}, 600);
					}
				}
			} else {
				let files = e.dataTransfer.files;
				for (var i = 0; i < files.length; i+=1) {
					if (/\.json$/.test(files[i].name)) {
						Nicolist.fileToLoad = files[i];
						$('#rawFileName').text(Nicolist.fileToLoad.name);
						$('#loadRawJson').removeClass('silent');
						$('#dummyLoadRawJson').addClass('silent');
						$('#prefModal').stop().animate({scrollTop:$('#loadRawJson').offset().top}, 600);
					}
				}
			}
		};
		$('#addVideoModal').on('dragover', (e) => {
			e.stopPropagation();
			e.preventDefault();
			if (e.pageX > $('body').outerWidth(true)/2) {
				$('#title').addClass('dragging');
				$('#url').removeClass('dragging');
			} else {
				$('#url').addClass('dragging');
				$('#title').removeClass('dragging');
			}
		});
		$('#addVideoModal').on('dragleave', (e) => {
			e.stopPropagation();
			e.preventDefault();
			$('#url, #title').removeClass('dragging');
		});
		$('#addVideoModal').on('drop', (e) => {
			e.preventDefault();
			Nicolist.handleVideoDrop(<DragEvent>e.originalEvent);
		});
		$('#url, #title').on('input', (e) => {
			Nicolist.checkValidity();
		});
		$('body').on('click', (e) =>{
			if (Nicolist.showingMenu){
				Nicolist.closeMenu();
			}
			$('#history').css('display', 'none');
		});
		$('#menu').on('click', (e) => {
			e.stopPropagation();
		});
		$('#addgenre').on('click', (e) => {
			e.stopPropagation();
			if (Nicolist.addGenre($('#genrename').val())){
				Nicolist.setSelGen($('#genrename').val());
				$('#genreModal').modal('hide');
				$('#genrename').val('');
				Nicolist.refresh('gs');
			} else {
				$('#genrename').blur();
				$('#genrename').focus();
			}
		});
		$('#genrename').on("keypress", (e) => {
			if (e.keyCode === 13) { // Enter
				e.preventDefault();
				e.stopPropagation();
				if (Nicolist.addGenre($('#genrename').val())){
					Nicolist.setSelGen($('#genrename').val());
					$('#genreModal').modal('hide');
					$('#genrename').val('');
					Nicolist.refresh('gs');
				} else {
					$('#genrename').blur();
					$('#genrename').focus();
				}
			}
		});
		$('#button').on('click', (e) => {
			Nicolist.sub();
		});
		$('#genreModal').on('shown.bs.modal', () => {
			$('#genrename').focus();
		});
		$('#saveEdit').on('click', (e) => {
			var id = $('#editUrl').text();
			var title = $('#editTitle').val()+'';
			var genre = $('#editGenre').val()+'';
			var oldtitle = $(e.currentTarget).attr('data-title');
			var oldgenre = $(e.currentTarget).attr('data-genre');
			if (title === ''){
				Nicolist.message('タイトルが空欄です', 'warning', '#emalert');
				$('#editTitle').addClass('is-invalid');
			} else if (genre === ''){
				Nicolist.message('ジャンルが正しく選択されていません', 'warning', '#emalert');
				$('#editGenre').addClass('is-invalid');
			} else if (title === oldtitle && genre === oldgenre){
				Nicolist.message('変更なしになっています', 'warning', '#emalert');
				$('#editTitle').addClass('is-invalid');
				$('#editGenre').addClass('is-invalid');
			//} else if ($.inArray(id, y[genre]) !== -1){
				//Nicolist.message('既に移動先のジャンルに登録されている動画です', 'warning', '#emalert');
			} else {
				var mesElem = $('<div>');
				var table = $('<table>', {'class':'mb-4'});
				var tr1 = $('<tr>');
				tr1.append($('<td>', {text: 'タイトル: '}));
				var td1 = $('<td>');
				td1.append($('<strong>', {text: title}));
				if (oldtitle === title) {
					td1.append($('<span>', {text: ' (変更なし)'}));
				}
				td1.appendTo(tr1);
				tr1.appendTo(table);
				if (oldtitle !== title){
					var tr2 = $('<tr>', {'class': 'gray'});
					tr2.append($('<td>', {text: '変更前: '}));
					tr2.append($('<td>', {text: oldtitle}))
					tr2.appendTo(table);
				}
				var tr3 = $('<tr>');
				tr3.append($('<td>', {text: 'ジャンル: ','class':'confirmedit'}));
				var td2 = $('<td>',{'class':'confirmedit'});
				td2.append($('<strong>', {text: genre}));
				if (oldgenre === genre) {
					td2.append($('<span>', {text: ' (変更なし)'}));
				}
				td2.appendTo(tr3);
				tr3.appendTo(table);
				if (oldgenre !== genre){
					var tr4 = $('<tr>', {'class': 'gray'});
					tr4.append($('<td>', {text: '変更前: '}));
					tr4.append($('<td>', {text: oldgenre}))
					tr4.appendTo(table);
				}
				mesElem.append(table);
				mesElem.append($('<span>', {text:'変更を保存しますか?'}));
				Nicolist.confAvoidable(mesElem, () => {
					var _y = Util.copyObj(Nicolist.y);
					var list = _y[oldgenre];
					var newlist = [];
					for (var i = 0; i < list.length/2; i+=1){
						if (list[2*i] !== id){
							newlist.push(list[2*i]);
							newlist.push(list[2*i+1]);
						} else if (oldgenre === genre){
							newlist.push(id);
							newlist.push(title);
						}
					}
					_y[oldgenre] = newlist;
					if (oldgenre !== genre){
						_y[genre].push(id);
						_y[genre].push(title);
					}
					Nicolist.pushPrev();
					Nicolist.y = _y;
					Nicolist.messageUndoable('動画「'+title+'」の動画情報を更新しました', 'info', null, 'v');
					Nicolist.refresh('v');
					$('#editModal').modal('hide');
				});
			}
		});
		$('#editModal').on('hidden.bs.modal', () => {
			$('#editTitle').removeClass('is-invalid');
			$('#editGenre').removeClass('is-invalid');
			$('#emalert').html('');
		})
		$('#nicolist_historyCount').on('change', (e) => {
			var sh = Util.int($(e.currentTarget).val());
			if (!isNaN(sh) && sh > 0){
				localStorage.setItem('nicolist_historyCount', sh+'');
			}
		});
		/**
		 * max search count
		 */
		$('#nicolist_msc').on('change', (e) => {
			var sh2 = Util.int($(e.currentTarget).val());
			if (!isNaN(sh2) && sh2 > 0){
				localStorage.setItem('nicolist_msc', sh2+'');
			}
		});
		$('#nicolist_loop').on('change', () => {
			if ($('#play iframe').length !== 0) {
				if ($('#nicolist_loop').prop('checked')){
					$('#pcloop img').attr('src', LOOP_DATA_URL);
					$('#pcloop').attr('title', 'ループ再生を解除');
				} else {
					$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
					$('#pcloop').attr('title', 'ループ再生');
				}
				Util.registerTooltip($('#pcloop'));
				NicolistPlayer.refreshController();
			}
		});
		$('#nicolist_cinematic').on('change', () => {
			if ($('#play iframe').length !== 0) {
				if ($('#nicolist_cinematic').prop('checked')){
					$('#pcwidth img').attr('src', NARROW_DATA_URL);
					$('#pcwidth').attr('title', '固定サイズで表示');
				} else {
					$('#pcwidth img').attr('src', WIDEN_DATA_URL);
					$('#pcwidth').attr('title', 'ワイド画面で表示');
				}
				Util.registerTooltip($('#pcwidth'));
				NicolistPlayer.refreshController();
			}
			NicolistPlayer.videoResize();
		})
		$('#searchQuery').on('focus', (e) => {
			if (Nicolist.searchHistory.length === 0) return;
			$('#history').html('');
			for (var i = 0; i < Nicolist.searchHistory.length; i+=1) {
				var item = Nicolist.searchHistory[i];
				$('<a>', {
					text: item,
					'class': 'dropdown-item pointer',
					click: (e2) => {
						$('#searchQuery').val($(e2.currentTarget).text());
						Nicolist.search($('#searchQuery').val()+'');
					}
				}).appendTo('#history');
			}//i
			$('#history').css({
				'min-width': $(e.currentTarget).outerWidth() + 'px',
				'display': 'inline-block',
				'top': $(e.currentTarget).offset().top + $(e.currentTarget).outerHeight(),
				'left': $(e.currentTarget).offset().left
			});
		});
		$('#searchQuery').on('click', (e) => {
			e.stopPropagation();
		});
		$('#searchQuery').on('keypress', (e) => {
			if (e.keyCode === 13) {//enter
				Nicolist.search($('#searchQuery').val()+'');
				$('#searchQuery').blur();
				$('#history').css('display', 'none');
			}
		});
		$('#search').on('click', () => {
			Nicolist.search($('#searchQuery').val()+'');
		});
		$('#sgopen').on('click', () => {
			$('#sggenre').html('');
			let gs = Object.keys(Nicolist.y);
			for (let i = 0; i< gs.length; i+=1){
				let g = gs[i];
				let div = $('<div>',{
					'class': 'sggwrapper '+(i != 0 ? 'sgtarget' : '')
				}).append($('<div>', {
					text: g,
					'class': 'sgg '+(i != 0 ? '' : 'sgdef')
				}));
				$('#sggenre').append(div);
			}//i
			$('#genreSortModal').modal('show');
			Sortable.create($('#sggenre').get(0), {
				draggable: '.sgtarget',
				animation: 300
			});
		});
		$('#submitGenreSort, #submitGenreSort2').on('click', () => {
			Nicolist.pushPrev();
			var _y = {};
			$('.sgg').each((i, elem) => {
				var g = $(elem).text();
				_y[g] = Nicolist.y[g];
			});
			Nicolist.y = _y;
			Nicolist.refresh('g');
			Nicolist.messageUndoable('ジャンルを並び替えしました', 'success', null, 'g');
			$('#genreSortModal').modal('hide');
		});

		$('#issueRaw').on('click', () => {
			var d = new Date();
			Util.saveAsFile('backup_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'.json', JSON.stringify(Nicolist.y));
		});
		$('#fromRawFile').on('change', (e) => {
			$('#loadrawalert').html('');
			var files = e.target['files'];
			if (!files || files.length !== 1) {
				Nicolist.message('正しいファイルを選択してください', 'warning', '#loadrawalert');
				return;
			}
			if (!/json/.test(files[0].type)){
				Nicolist.message('jsonファイルを選択してください', 'warning', '#loadrawalert');
				return;
			}

			Nicolist.fileToLoad = files[0];
			$('#rawFileName').text(Nicolist.fileToLoad.name);
			$('#loadRawJson').removeClass('silent');
			$('#dummyLoadRawJson').addClass('silent');
		});
		$('#loadRawJson').on('click', () => {
			if (Nicolist.fileToLoad){
				var reader = new FileReader();
				reader.readAsText(Nicolist.fileToLoad);

				reader.onload = () => {
					try {
						if (reader.result instanceof ArrayBuffer){
							var toload = JSON.parse(reader.result.toString());
						} else {
							var toload = JSON.parse(reader.result);
						}
					} catch (e){
						Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
						return;
					}
					var videocount = 0;
					var genrecount = 0;
					if ($.type(toload) !== 'object'){
						Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
						return;
					}
					var _y = Util.copyObj(Nicolist.y);
					var _tkeys = Object.keys(toload);
					for (var j = 0; j < _tkeys.length; j+=1) {
						var genre = _tkeys[j];
						var list = toload[genre];
						if ($.type(list) !== 'array'){
							Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
							return;
						}
						for (var i = 0; i < list.length/2; i+=1){
							var id = list[2*i];
							var title = list[2*i+1];
							if (!_y.hasOwnProperty(genre)) {
								_y[genre] = [];
								genrecount+=1;
							}
							if ($.inArray(id, _y[genre]) === -1){
								_y[genre].push(id);
								_y[genre].push(title);
								videocount+=1;
							}
						}
					}//j
					if (videocount === 0 && genrecount === 0){
						Nicolist.message('すべて登録済みの動画です', 'warning', '#loadrawalert');
					} else {
						Nicolist.pushPrev();
						Nicolist.y = _y;
						Nicolist.messageUndoable('JSONから'+(videocount>0?videocount+'個の動画':'')+(genrecount>0&&videocount>0?'、':'')+(genrecount>0?genrecount+'個のジャンル':'')+'を新たに読み込みました', 'success', null, (genrecount>0?'g':'')+(videocount>0?'v':''));
						Nicolist.refresh((genrecount>0?'g':'')+(videocount>0?'v':''));
						$('#loadrawalert').html('');
						$('#prefModal').modal('hide');
					}
				};
				Nicolist.fileToLoad = null;
				$('#rawFileName').text('');
				$('#loadRawJson').addClass('silent');
				$('#dummyLoadRawJson').removeClass('silent');
			}
		});
	}
	static init(){
		NicolistPlayer.showFavbutton = true;
		Nicolist.registerEventListener();

		// if the browser don't support local storage
		if (Util.isNull(localStorage)){
			if (!Util.isNull(document.cookie)){
				class Storage {
					data:object = {};
					length = 0;
					constructor(){
						this.length = 0;
						this.data = {};
						var _s = document.cookie.match(/ls_[^=;]+=[^;=]*/g);
						if (_s !== null){
							for (var i = 0; i < _s.length; i+=1) {
								var _t = _s[i].split(/=/);
								this.data[unescape(_t[0].substring(3))] = _t[1];
							}
						}
					}
					getItem = (key) =>  {
						return this.data[key];
					}
					setItem = (key, val) =>  {
						if (key !== null){
							if (!this.data.hasOwnProperty(key)){
								this.length+=1;
							}
							var _d = new Date();
							_d.setTime(Date.now() + 114514*60*1000);//almost 13 years
							document.cookie = 'ls_' + escape(key) + '=' + escape(val) + '; expires='+_d.toUTCString()+'; path=/';
							this.data[key] = val;
						}
					}
					removeItem = (key) =>  {
						if (key !== null){
							document.cookie = 'ls_' + escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
							if (this.data.hasOwnProperty(key)){
								this.length-=1;
								delete this.data[key];
							}
						}
					}
					clear = () => {
						this.data = {};
						this.length = 0;
					}
					key = (i) => {
						return Object.keys(this.data)[i];
					}
				}
				localStorage = new Storage();
				if (document.cookie === ''){
					// first visit
					Nicolist.message('お使いのブラウザはローカルストレージをサポートしていないため、代わりにcookieを使用してデータを保存しています。', 'warning');
				}
			} else {
				Nicolist.message('ローカルストレージ・Cookieが利用できないためデータを保存することができません。', 'danger', null, true);
			}
		}

		if (Nicolist.islocal) {
			$('#local_indicator').removeClass('silent');
		}

		Nicolist.initDataFromLS();
		Util.registerTooltip($('#controller span[title]'));
		Nicolist.refresh('vgs');
	}
	static initDataFromLS(){
		$('input[type=checkbox]').each((i, elem) => {	
			var id = $(elem).attr('id');
			if (!Util.isNull(id)){
				var bool = window.localStorage.getItem(id);
				if (bool === 'true'){
					$(elem).prop('checked', true);
				} else if (bool) {
					$(elem).prop('checked', false);
				}
			}
		});

		Util.getLS('nicolist_separator', (ls) => {
			$('#nicolist_separator').val(ls);
		}, () => {
			$('#nicolist_separator').val(Nicolist.SEP_DEF_VAL);
		});

		Util.getLS('nicolist_ignore' , (ls) => {
			$('#nicolist_ignore').val(ls);
		}, () => {
			$('#nicolist_ignore').val(Nicolist.IGN_DEF_VAL);
		});

		Util.getLS('nicolist_click_action' , (ls) => {
			if (ls !== ''){
				$('#click_action').val(ls);
			}
		});

		Util.getLSInt('_nicolistTabCount' , (ls) => {
			if (!$('#nicolist_multitab').prop('checked')){
				var errorspan = $('<span>');
				$('<span>', {
					text: '正しく終了されませんでしたか？',
					'class': 'undo ml-1 mr-1',
					'click': () => {
						localStorage.setItem('_nicolistTabCount', '1');
						$('#alert').fadeOut('slow', Nicolist.refreshStyle);
					}
				}).appendTo(errorspan);
				$('<span>', {
					text: '/',
					'class': 'ml-1 mr-1'
				}).appendTo(errorspan);
				$('<span>', {
					text: 'このアラートが常に表示される場合',
					'class': 'undo ml-1',
					'click': () => {
						$('#nicolist_multitab').prop('checked', true);
						localStorage.setItem('nicolist_multitab', 'true');
						$('#laert').fadeOut('slow', Nicolist.refreshStyle);
					}
				}).appendTo(errorspan);
				Nicolist.message('複数タブで同時に閲覧している可能性があります。', 'danger', null, true, errorspan);
			}
			localStorage.setItem('_nicolistTabCount', (ls+1)+'');
		}, () => {
			localStorage.setItem('_nicolistTabCount', '1');
		});

		Util.getLS('nicolist' , (ls) => {
			try {
				ls = JSON.parse(ls);
				if (typeof ls !== 'object'){
					throw new Error('JSON syntax error');//wont happen
				}
				Nicolist.y = Util.copyObj(ls);
			} catch(e) {
                console.error(`JSON Systax Error: ${ls} is not a json`);
                console.error(e);
			}
		});
		
		Util.getLS('selectedGenre' , (ls) => {
			Nicolist.setSelGen(ls);
		}, () => {
			if (Object.keys(Nicolist.y).length > 0){
				Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);//wont happen
			}
		});
		
		Util.getLS('nicolist_ccnewval' , (ls) => {
			$('#ccnew').val(ls);
			if (ls === 'copytoold' || ls === 'movetoold'){
				$('#ccnewform').css('display', 'none');
				$('#ccoldform').css('display', 'block');
			} else {
				$('#ccnewform').css('display', 'block');
				$('#ccoldform').css('display', 'none');
			}
			if (ls === 'copytoold' || ls === 'copytoold'){
				$('#createcopy, #createcopy2').text('コピー');
			} else {
				$('#createcopy, #createcopy2').text('移動');
			}
		});
		
		Util.getLS('searchHistory' , (ls) => {
			try {
				Nicolist.searchHistory = JSON.parse(ls);
				if ($.type(Nicolist.searchHistory) !== 'array'){
					Nicolist.searchHistory = [];
				}
			} catch (e){
                console.error(`JSON Systax Error: ${ls} is not a json`);
				console.error(e);
			}
		});
		
		Util.getLSInt('nicolist_historyCount', (ls) => {
			$('#nicolist_historyCount').val(ls);
		});
		
		Util.getLS('nicolist_msc' , (ls) => {
			$('#nicolist_msc').val(ls);
		});
		
		Util.getLS('nicolist_deleted' , (ls) => {
			try {
				NicolistPlayer.deletedVideoArray = JSON.parse(ls);
				if ($.type(NicolistPlayer.deletedVideoArray) !== 'array'){
					NicolistPlayer.deletedVideoArray = [];
				}
			} catch(e) {
                console.error(`JSON Systax Error: ${ls} is not a json`);
                console.error(e);
			}
		});
		
		Util.getLS('nicolist_star' , (ls) => {
			try {
				Nicolist.starred = JSON.parse(ls);
				if ($.type(Nicolist.starred) !== 'array'){
					Nicolist.starred = [];
				}
			} catch(e) {
                console.error(`JSON Systax Error: ${ls} is not a json`);
                console.error(e);
			}
		});
		
		Util.getLS('nicolist_volumemap' , (ls) => {
			try {
				ls = JSON.parse(ls);
				if ($.type(ls) === 'object'){
					NicolistPlayer.volumemap = ls;
				}
			} catch(e) {
                console.error(`JSON Systax Error: ${ls} is not a json`);
                console.error(e);
			}
		});
	}
	static unload(){
		var tabs = Util.int(localStorage.getItem('_nicolistTabCount'));
		if (tabs === 1){
			localStorage.removeItem('_nicolistTabCount');
		} else if (tabs >= 2){
			localStorage.setItem('_nicolistTabCount', (tabs-1)+'');
		}
	}
	static refresh(whatChanged){
		if (!Nicolist.y.hasOwnProperty(Nicolist.selectedGenre)){
			Nicolist.setSelGen('とりあえず');
		}
		var videoChanged = whatChanged.indexOf('v') !== -1;
		var genreChanged = whatChanged.indexOf('g') !== -1;
		var selectChanged = whatChanged.indexOf('s') !== -1;
		if (selectChanged){
			if ($('#favs li').hasClass('selected')){
				$('#favs li').removeClass('selected');
			}
			Nicolist.refreshFavsLeft();
		}
		if (selectChanged || genreChanged){
			//genreのselectの更新
			//#leftの更新
			$("select[role='genre']").html('');
			$('#left').html('');
			for (let genre in Nicolist.y){
				//select更新
				$("select[role='genre']").each((i, elem) => {
					$(elem).append($('<option>', {
						'value': genre,
						text: genre
					}));
				});
				//#left更新
				$('<li>', {
					'class': (genre === Nicolist.selectedGenre ? 'list-group-item selected' : 'list-group-item'),
					text: genre,
					click: (e) => {
						var genre2 = $(e.currentTarget).text();
						Nicolist.setSelGen(genre2);
						Nicolist.refresh('s');
					}
				}).appendTo("#left");
			}
			$('select[role="genre"]').val(Nicolist.selectedGenre);
		}
		if (selectChanged || genreChanged || videoChanged){
			//#rightの更新
			$("#right").html('');
			if ($('#favs li').hasClass('selected')){
				Nicolist.showFavs();
			} else {
				if (Nicolist.selectedGenre === 'とりあえず'){
					$("<h4>", {
						text: Nicolist.selectedGenre
					}).append(
						$('<small>', {
							'class': 'text-muted ml-2',
							text: '('+(Nicolist.y[Nicolist.selectedGenre].length/2)+')'
						})
					).appendTo("#right");
				} else {
					$("<h4>", {
						text: Nicolist.selectedGenre
					}).append(
						$('<small>', {
							'class': 'text-muted ml-2 mr-1',
							text: '('+(Nicolist.y[Nicolist.selectedGenre].length/2)+')'
						})
					).append(
						$('<small>', {
							'class': 'removevideo',
							'data-genre' : Nicolist.selectedGenre,
							'title': 'ジャンルを削除',
							text: '×',
							click: (e2) =>  {
								Nicolist.removeGenre($(e2.currentTarget));
							}
						})
					).appendTo('#right');
				}
				var list = Nicolist.y[Nicolist.selectedGenre];
				if (list.length === 0){
					$('#right').append(Nicolist.$emptyElem());
				} else {
					if ($('#nicolist_sort').prop('checked')){
						list = Nicolist.reversePairList(list);
					}
					for (var i = 0; i < list.length/2; i+=1){
						var id = list[2*i];
						var title = list[2*i+1];
	
						var div = Nicolist.rightVideoElem(id, title, Nicolist.selectedGenre);
	
						div.appendTo("#right");
					}
					Nicolist.loadImgOnScreen('html, body', '#right');
				}
			}
		}
		if (genreChanged || videoChanged){
			$('#out').val(JSON.stringify(Nicolist.y, null, '    '));
			localStorage.setItem('nicolist', JSON.stringify(Nicolist.y));
			$('#length').text('('+Nicolist.sizeString(Util.bytesize(JSON.stringify(Nicolist.y)))+')');
			if ($('#sr').html() !== ''){
				Nicolist.search(Nicolist.searchHistory[0]);
			}
		}
	}
	static $emptyElem(){
		return $('<div>', {
			'class': 'd-flex flex-row align-items-center'
		}).append($('<img>', {
			'src': EMPTY,
			'width': '135',
			'height': '144',
			'class' : 'mt-4 ml-4'
		})).append($('<div>', {
			'class': 'ml-4 text-muted'
		}).append($('<div>', {
			text: 'リストはからっぽです...',
			'class': 'pt-4 fs-lg'
		}).append($('<div>').append($('<span>', {
			text: '使い方ページは',
			'class': 'ml-3'
		}).append($('<a>', {
			text: 'こちら',
			'class': 'ml-1',
			'href': 'https://github.com/tkgwku/nicolist/blob/master/README.md',
			'target': '_blank'
		}))))));
	}
	static refreshFavsLeft(){
		if (Nicolist.starred.length > 0){
			$('#favs').removeClass('disabled');
		} else {
			$('#favs').addClass('disabled');
		}
		$('#favlen').text((Nicolist.starred.length/2)+'');
	}
	static showFavs(){
		$('#left .selected').removeClass('selected');
		$('#favs li').addClass('selected');
		Nicolist.constructRightFav();
	}
	static constructRightFav(){
		$("#right").html('');
		var displayThumb = $('#nicolist_thumb').prop('checked');
		$("<h4>", {
			text: 'お気に入り'
		}).append($('<small>', {
			text: '×',
			'class': 'removevideo',
			'title': 'お気に入りをクリア',
			'click': () =>  {
				Nicolist.confirm('お気に入りをクリアしますか?', () => {
					Nicolist.starred = [];
					Nicolist.refreshFavsLeft();
					if ($('#play').html() !== '') {
						NicolistPlayer.refreshController();
					}
					$('.favIcon').each((_i, elem) => {
						$(elem).attr('src', UNSTAR_DATA_URL);
					});
					Nicolist.refresh('s');
					localStorage.setItem('nicolist_star', JSON.stringify(Nicolist.starred));
				});
			}
		})).appendTo("#right");

		var list = Nicolist.starred;
		if ($('#nicolist_sort').prop('checked')){
			list = Nicolist.reversePairList(list);
		}
		var startLazyLoad = Math.ceil($(window).height()/68);
		for (var i = 0; i < list.length/2; i+=1){
			var id = list[2*i];
			var title = list[2*i+1];

			var div = Nicolist.rightVideoElem(id, title, '');

			div.appendTo('#right');
		}
		Nicolist.loadImgOnScreen('html, body', '#right');
	}
	static toggleFav(id, title){
		var starIndex = -1;
		for (var j = 0; j < Nicolist.starred.length; j+=2) {
			var stId = Nicolist.starred[j];
			if (stId === id){
				starIndex = j;
				break;
			}
		}
		if (starIndex === -1){
			Nicolist.starred.push(id);
			Nicolist.starred.push(title);
			$('.favIcon[data-id='+id+']').each((_i, elem) => {
				$(elem).attr('src', STAR_DATA_URL);
				Nicolist.startStarAnimation($(elem));
			});
			if ($('#favs li').hasClass('selected')) {
				if ($('#right a[data-id='+id+']').length === 0){
					if ($('#nicolist_sort').prop('checked')){
						Nicolist.rightVideoElem(id, title, '').insertAfter('#right h4');
					} else {
						$('#right').append(Nicolist.rightVideoElem(id, title, ''));
					}
					Nicolist.loadImgOnScreen('html, body', '#right');
				}
			}
			return true;
		} else {
			Nicolist.starred.splice(starIndex, 2);
			$('.favIcon[data-id='+id+']').each((_i, elem) => {
				$(elem).attr('src', UNSTAR_DATA_URL);
			});
			return false;
		}
	}
	static rightVideoElem(id, title, genre){
		var div = $('<div>', {
			'class': 'd-flex flex-row align-items-center'
		});
		var favIcon = Nicolist.createFavIcon(id, title);
		var a = MobileUtil.anchorOpt($( "<a>", {
			"href": Nicolist.getVideoURL(id),
			'target': '_blank',
			'data-genre' : genre,
			'data-id' : id,
			'data-title' : title,
			'class': 'rightvideo',
		}), (e2) => {
			if ($('#click_action').val() !== 'official'){
				e2.preventDefault();
			}
			Nicolist.openVideo($(e2.currentTarget), 'right');
		}, (e) => {
			Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'right');
			e.preventDefault();
		});
		div.append(favIcon);
		if (!$('#nicolist_thumb').prop('checked')) {
			div.addClass('mb-2');
		}
		if ($('#nicolist_thumb').prop('checked')){
			a.append(Nicolist.createStayUnloadedTNI(id, false));
		}
		if ($('#nicolist_taggedtitle').prop('checked')){
			var _ma = title.match(/【[^【】]+】/g);//【】
			var _mb = title.match(/\[[^\[\]]+\]/g);//[]
			var tags = [];
			var converted_title = title;
			if (_ma !== null){
				for (var j = 0; j < _ma.length; j+=1) {
					tags.push(_ma[j]);
				}
				converted_title = converted_title.replace(/【[^【】]+】/g, '');
			}
			if (_mb !== null){
				for (var j = 0; j < _mb.length; j+=1) {
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
			for (var j = 0; j < tags.length; j+=1) {
				div.append($('<span>',{
					text: tags[j].slice(1, -1),
					'class': 'titletag ml-1',
					'click': (e) => {
						$('#search').val($(e.currentTarget).text());
						Nicolist.search($(e.currentTarget).text());
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
	static openVideo($elem, mode){
		var id = $elem.attr('data-id');
		var title = $elem.attr('data-title');
		var genre = $elem.attr('data-genre');
		var caval = $('#click_action').val();
		if (caval === 'thispage'){
			$('#play').html('');
			NicolistPlayer.playindex = 0;
			NicolistPlayer.playlist = [id];
			NicolistPlayer.playlistTitleMap = {};
			NicolistPlayer.playlistTitleMap[id] = title;
			if (Nicolist.islocal) {
				window.open(Util.domain+'/player.html?pl='+escape(JSON.stringify(NicolistPlayer.playlist))+'&i='+NicolistPlayer.playindex);
			} else {
				NicolistPlayer.createEmbedElem();
				NicolistPlayer.refreshController();
			}
		} else if (caval === 'cont' || caval === 'randomcont'){
			$('#play').html('');
			if (mode === 'right'){
				NicolistPlayer.playlist = [];
				NicolistPlayer.playlistTitleMap = {};
				$('#right a[data-id]').each((_i, elem2) => {
					var rvid = $(elem2).attr('data-id');
					NicolistPlayer.playlist.push(rvid);
					NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
				});
			} else if (mode === 'random'){
				NicolistPlayer.playlist = [];
				NicolistPlayer.playlistTitleMap = {};
				$('#randomVideo a[data-id]').each((_i, elem2) => {
					var rvid = $(elem2).attr('data-id');
					NicolistPlayer.playlist.push(rvid);
					NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
				});
			} else if (mode === 'search'){
				NicolistPlayer.playlist = [];
				NicolistPlayer.playlistTitleMap = {};
				$('#sr a[data-id]').each((_i, elem2) => {
					var svid = $(elem2).attr('data-id');
					NicolistPlayer.playlist.push(svid);
					NicolistPlayer.playlistTitleMap[svid] = $(elem2).attr('data-title');
				});
			} else {
				//wont happen
				return;
			}
			if (caval === 'randomcont'){
				NicolistPlayer.playlist = Util.shuffle(NicolistPlayer.playlist, id);
			}
			NicolistPlayer.playindex = $.inArray(id, NicolistPlayer.playlist);
			if (NicolistPlayer.playindex === -1) {
				NicolistPlayer.playindex = 0;
			}
			if (Nicolist.islocal) {
				window.open(Util.domain+'/player.html?pl='+escape(JSON.stringify(NicolistPlayer.playlist))+'&i='+NicolistPlayer.playindex);
			} else {
				NicolistPlayer.createEmbedElem();
				NicolistPlayer.refreshController();
			}
			$('html,body').stop().animate({scrollTop:0}, 'swing');
		}
	}
	static sizeString(byte){
		if (byte < 500){
			return byte + " byte";
		} else if (byte < 500000){
			var a = Math.round( byte * 100 / 1024 ) / 100;
			return a + " KB";
		} else if (byte < 500000000){
			var a = Math.round( (byte * 100 / 1024) / 1024 ) / 100;
			return a + " MB";
		} else {
			var a = Math.round( ((byte * 100 / 1024) / 1024) / 1024 ) / 100;
			return a + " GB";
		}
	}
	static showMenu(coord_x, coord_y, cont, mode){
		var id = cont.attr('data-id');
		var title = cont.attr('data-title');
		var genre = cont.attr('data-genre');
		var url = cont.attr('href');
		$("#menu").children('a').each((i, elem) => {
			var role = $(elem).attr('role');
			if (role === 'title'){
				if (url){
					$(elem).html('');
					var anc = $('<a>', {
						'href':url,
						text:title,
						'target':'_blank'
					});
					$(elem).append(anc);
				} else {
					$(elem).text(title);
				}
			} else if (role === 'remove'){
				if (genre){
					$(elem).off('click');
					$(elem).on('click', () => {
						Nicolist.removeVideo(id, title, genre);
						Nicolist.closeMenu();
					});
					if ($(elem).hasClass('disabled')){
						$(elem).removeClass('disabled');
					}
				} else {
					if (!$(elem).hasClass('disabled')){
						$(elem).addClass('disabled');
					}
				}
			} else if (role === 'edit'){
				if (genre){
					$(elem).off('click');
					$(elem).on('click', () => {
						let _id = cont.attr('data-id');
						let _title = cont.attr('data-title');
						let _genre = cont.attr('data-genre');
						$('#editThumb').attr('src', Nicolist.getThumbURL(_id));
						$('#editUrl').text(_id);
						$('#editUrlLink').attr('href', Nicolist.getVideoURL(_id));
						$('#editTitle').val(_title);
						$('#editGenre').val(_genre);
						$('#saveEdit').attr('data-title', _title);
						$('#saveEdit').attr('data-genre', _genre);
						$('#editModal').modal();
						Nicolist.closeMenu();
					});
					$(elem).removeClass('disabled');
				} else {
					$(elem).addClass('disabled');
				}
			} else if (role === 'play'){
				$(elem).off('click');
				$(elem).on('click', () => {
					$('#play').html('');
					NicolistPlayer.playindex = 0;
					NicolistPlayer.playlist = [id];
					NicolistPlayer.playlistTitleMap = {};
					NicolistPlayer.playlistTitleMap[id] = title;
					if (Nicolist.islocal) {
						window.open(Util.domain+'/player.html?pl='+escape(JSON.stringify(NicolistPlayer.playlist))+'&i='+NicolistPlayer.playindex);
					} else {
						NicolistPlayer.createEmbedElem();
						NicolistPlayer.refreshController();
					}
					Nicolist.closeMenu();
				});
			} else if (role === 'playall' || role === 'playall-random'){
				$(elem).off('click');
				$(elem).on('click', () => {
					$('#play').html('');
					if (mode === 'right'){
						$(elem).removeClass('disabled');
						NicolistPlayer.playlist = [];
						NicolistPlayer.playlistTitleMap = {};
						$('#right a[data-id]').each((_i, elem2) => {
							var rvid = $(elem2).attr('data-id');
							NicolistPlayer.playlist.push(rvid);
							NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
						});
					} else if (mode === 'random'){
						$(elem).removeClass('disabled');
						NicolistPlayer.playlist = [];
						NicolistPlayer.playlistTitleMap = {};
						$('#randomVideo a[data-id]').each((_i, elem2) => {
							var rvid = $(elem2).attr('data-id');
							NicolistPlayer.playlist.push(rvid);
							NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
						});
					} else if (mode === 'search'){
						$(elem).removeClass('disabled');
						NicolistPlayer.playlist = [];
						NicolistPlayer.playlistTitleMap = {};
						$('#sr a[data-id]').each((_i, elem2) => {
							var svid = $(elem2).attr('data-id');
							NicolistPlayer.playlist.push(svid);
							NicolistPlayer.playlistTitleMap[svid] = $(elem2).attr('data-title');
						});
					} else {
						//wont happen
						$(elem).addClass('disabled');
						return;
					}
					if (role === 'playall-random'){
						NicolistPlayer.playlist = Util.shuffle(NicolistPlayer.playlist, id);
					}
					NicolistPlayer.playindex = $.inArray(id, NicolistPlayer.playlist);
					if (NicolistPlayer.playindex === -1) {
						NicolistPlayer.playindex = 0;
					}
					if (Nicolist.islocal) {
						window.open(Util.domain+'/player.html?pl='+escape(JSON.stringify(NicolistPlayer.playlist))+'&i='+NicolistPlayer.playindex);
					} else {
						NicolistPlayer.createEmbedElem();
						NicolistPlayer.refreshController();
					}
					$('html,body').stop().animate({scrollTop:0}, 'swing');
					Nicolist.closeMenu();
				});
			}
		});
		$('#menu').css({
			'display': 'inline-block',
			'top': coord_y,
			'left': coord_x
		});
		Nicolist.showingMenu = true;
	}
	static closeMenu(){
		$('#menu').css('display', 'none');
		Nicolist.showingMenu = false;
	}
	static has(genre, id){
		var list = Nicolist.y[genre];
		for (var i = 0; i < list.length/2; i+=1){
			if (list[2*i] === id) {return true};
		}
		return false;
	}
	static addGenre(name){
		if (Util.bytesize(name) > 64){
			Nicolist.message('ジャンル名は64バイト以内に収める必要があります', 'warning', '#alert-genre');
			return false;
		}
		if (Util.bytesize(name) === 0){
			Nicolist.message('作成するジャンルの名前を入力してください。', 'warning', '#alert-genre');
			return false;
		}
		if (!Nicolist.y.hasOwnProperty(name)){
			Nicolist.pushPrev();
			Nicolist.y[name] = [];
			$('#alert-genre').html('');
			Nicolist.messageUndoable('ジャンル「'+name+'」を追加しました', 'success', null, 'gs');
			return true;
		} else {
			Nicolist.message('ジャンル「'+name+'」は既に存在しているようです。', 'warning', '#alert-genre');
			return false;
		}
	}
	static removeVideo(id, title, genre){
		let func = () => {
			Nicolist.pushPrev();
			let list = Nicolist.y[genre];
			let newlist = [];
			for (let i = 0, len = list.length/2; i < len; i+=1){
				if (list[2*i] !== id){
					newlist.push(list[2*i]);
					newlist.push(list[2*i+1]);
				}
			}
			Nicolist.y[genre] = newlist;
			Nicolist.messageUndoable('動画「'+Util.cutString(title, 50)+'」を削除しました', 'danger', null, 'v');
			Nicolist.refresh('v');//video change
		}
		Nicolist.confAvoidable('本当に動画「'+Util.cutString(title, 50)+'」を削除しますか？', func);
	}
	static removeGenre(elem){
		var genre = elem.attr('data-genre');
		Nicolist.confirm('本当にジャンル「'+genre+'」を削除しますか？\n'+(Nicolist.y[genre].length/2)+'個の動画が登録されています。', () => {
			var newy = {}; 
			Nicolist.pushPrev();
			for (var oldgenre in Nicolist.y){
				if (genre !== oldgenre){
					newy[oldgenre] = Nicolist.y[oldgenre];
				}
			}
			Nicolist.y = newy;
			Nicolist.messageUndoable('ジャンル「'+genre+'」を削除しました', 'danger', null, 'gs');
			Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);
			Nicolist.refresh('gs');//genre change
		});
	}
	static setSelGen(genre){
		if (!Nicolist.y.hasOwnProperty(genre)) {
			Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);
			Nicolist.message('前回選択していたジャンルの引き継ぎ時にエラーが発生しました', 'danger');
			return;
		}
		Nicolist.selectedGenre = genre;
		localStorage.setItem('selectedGenre', Nicolist.selectedGenre);
	}
	static redo($elem) {
		var _c = Util.copyObj(Nicolist.y);
		Nicolist.y = Util.copyObj(Nicolist.prevy);
		Nicolist.prevy = _c;
		Nicolist.messageUndoable('やり直しました', 'primary', $elem.attr('data-wrapper'), $elem.attr('data-refarg'));
		Nicolist.refresh($elem.attr('data-refarg'));
	}
	static undo($elem) {
		var _c = Util.copyObj(Nicolist.y);
		Nicolist.y = Util.copyObj(Nicolist.prevy);
		Nicolist.prevy = _c;
		Nicolist.messageUndoable('もとに戻しました', 'primary', $elem.attr('data-wrapper'), $elem.attr('data-refarg'), null, 'redo');
		Nicolist.refresh($elem.attr('data-refarg'));
	}
	static message(mes, type='warning', wrapper='#alert', permanent=false, elem?) {
		if ($.inArray(type, Nicolist.MESSAGE_TYPES) === -1) {
			type = 'warning';
		}
		if (wrapper === '' || $(wrapper).length === 0) {
			wrapper = '#alert';
		}
		var div = $('<div>', {
			'class': 'alert alert-'+type
		});
		if (!permanent){
			$('<button>', {
				'type':'button',
				'class':'close',
				'click': (e) => {
					$(e.currentTarget).parent().parent().fadeOut('slow', Nicolist.refreshStyle);
				}
			}).append($('<span>', {
				html: '&times;'
			})).appendTo(div);
		}
		var span = $('<span>', {
			text: mes
		});
		if (elem) span.append(elem);
		span.appendTo(div);
		$(wrapper).css('display', 'none');
		$(wrapper).html('');
		$(wrapper).append(div);
		$(wrapper).fadeIn();
	}
	static messageUndoable(mes, type?, wrapper?, whatChanged?, permanent?, toredo?){
		whatChanged = whatChanged || '';
		var span;
		if (toredo === 'redo') {
			span = $('<span>', {
				text: '[やり直す]',
				'class': 'undo',
				'data-wrapper': wrapper,
				'data-refarg': whatChanged,
				click : (e) => {
					Nicolist.redo($(e.currentTarget));
				}
			});
		} else {
			span = $('<span>', {
				text: '[もとに戻す]',
				'class': 'undo',
				'data-wrapper': wrapper,
				'data-refarg': whatChanged,
				click : (e) => {
					Nicolist.undo($(e.currentTarget));
				}
			});
		}
		Nicolist.message(mes, type, wrapper, permanent, span);
	}
	static confAvoidable(mes, func){
		if ($('#nicolist_del').prop('checked')){
			(func)();
		} else {
			if ($.type(mes) === 'string'){
				Nicolist.confirm($('<span>',{text: mes}), func);
			} else {
				Nicolist.confirm(mes, func);
			}
		}
	}
	static confirm(mesElem, func, ondeny?){
		$('#confDialog').html('');
		$('#confDialog').append(mesElem);
		$('#confOK').html('').append($('<button>', {
			text: 'はい',
			'class': 'btn btn-primary',
			click: func,
			'data-dismiss': 'modal'
		}));
		var cb = $('<button>', {
			text: 'キャンセル',
			'class': 'btn btn-secondary',
			'data-dismiss': 'modal'
		});
		if (ondeny !== null){
			cb.off('click');
			cb.on('click', ondeny);
		}
		$('#confDeny').html('').append(cb);
		$('#confModal').modal('show');
	}
	static pushPrev(){
		Nicolist.prevy = Util.copyObj(Nicolist.y);
	}
	static randomFromAll(){
		var _temp = {};
		var sum = 0;
		for (let genre in Nicolist.y){
			_temp[genre] = Nicolist.y[genre].length;
			sum += _temp[genre];
		}
		if (sum === 0){
			Nicolist.message('まだ一つも動画が登録されていません');
			return;
		}
		var rand = Math.random()*sum;//[0,sum)
		var sum2 = 0;
		var _tkeys = Object.keys(_temp);
		for (var i = 0; i < _tkeys.length; i+=1) {
			var genre2 = _tkeys[i];
			if (sum2 < rand && sum2 + _temp[genre2] >= rand){
				Nicolist.random(Nicolist.y[genre2], genre2);
				break;
			}
			sum2 += _temp[genre2];
		}
	}
	static random(list, genre){
		if (list.length === 0){
			Nicolist.message('まだ一つも動画が登録されていません');
			return;
		}
		var rand2 = Math.floor(Math.random() * (list.length/2));
		var id = list[rand2*2];
		var title = list[rand2*2 + 1];
		if ($('#nicolist_rand').prop('checked')){
			$('#randomVideo').html('');
		}
		if ($('#random button').length === 0){// if #random button doesn't exist
		  	$('<button>', {
		  		'type':'button',
		  		'class':'close',
		  		'click': (e) => {
		  			$('#random').fadeOut('slow', () => {
		  				Nicolist.refreshStyle();
		  				$('#randomVideo').html('');
		  			});
		  		}
		  	}).append($('<span>', {
		  		html: '&times;'
		  	})).prependTo('#random');
		}
		var a = MobileUtil.anchorOpt($('<a>', {
			'href': Nicolist.getVideoURL(id),
			'target': '_blank',
			'data-genre' : genre,
			'data-id' : id,
			'data-title' : title,
		}), (e) => {
			if ($('#click_action').val() !== 'official'){
				e.preventDefault();
			}
			Nicolist.openVideo($(e.currentTarget), 'random');
		}, (e) => {
			Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'random');
			e.preventDefault();
		});
		
		var div = $('<div>',{
			'class': 'd-flex align-items-center flex-row'
		});

		var favIcon = Nicolist.createFavIcon(id, title);

		div.append(favIcon);

		if ($('#nicolist_thumb_res').prop('checked')){
			a.append(Nicolist.createThumbImgElem(id, $('#nicolist_rand').prop('checked')));
		}
		var span = $('<span>', {text:title});
		a.append(span);
		div.append(a);
		if (genre !== null){
			div.append($('<span>', {
				text: '('+genre+')',
				'class': 'ml-2 text-muted'
			}));
		}
		div.prependTo('#randomVideo');
		$('#random').css('display', 'block');
	}
	static randomFromRight(){
		var list = [];
		var genre = null;
		$('#right a[data-id]').each((i, elem) => {
			list.push($(elem).attr('data-id'));
			list.push($(elem).attr('data-title'));
			if (genre == null){
				var thisGenre = $(elem).attr('data-genre');
				if (!Util.isNull(thisGenre)){
					genre = thisGenre;
				}
			}
		});
		Nicolist.random(list, genre);
	}
	static refreshStyle(){
		if ($('#history').css('display') !== 'none'){
			$('#history').css({
				'top': $('#searchQuery').offset().top + $('#searchQuery').outerHeight(),
				'left': $('#searchQuery').offset().left,
				'min-width': $('#searchQuery').outerWidth()
			});
		}
	}
	static createThumbImgElem(id, isFullSize){
		var $img = $('<img>',{
			'src': (Nicolist.getThumbURL(id)),
			'alt': 'No Image',
			'class': 'mr-4 img-thumbnail loading '+(isFullSize?'full-thumb':'sm-thumb')
		});
		$img.on('load', (e) => {
			if ($.inArray($(e.currentTarget).attr('src'), Nicolist.loadedtn) === -1){
				Nicolist.loadedtn.push($(e.currentTarget).attr('src'));
			}
			$(e.currentTarget).removeClass('loading');
			$(e.currentTarget).off('load');
		});
		return $img;
	}
	static createStayUnloadedTNI(id, isFullSize){
		const url = Nicolist.getThumbURL(id);
		if ($.inArray(url, Nicolist.loadedtn) === -1){
			return $('<img>',{
				'data-src': url,
				'alt': 'No Image',
				'class': 'mr-4 img-thumbnail loading '+(isFullSize?'full-thumb':'sm-thumb')
			});
		} else {
			return Nicolist.createThumbImgElem(id, isFullSize);
		}
	}
	static reversePairList(list){
		let _list = [];
		for (let i = list.length/2 - 1; i >= 0; i-=1) {
			_list.push(list[2*i]);
			_list.push(list[2*i+1]);
		}
		return _list;
	}
	static $starImg(starred){
		return (starred ? $('<img>', {
			'width': '16px',
			'height': '16px',
			'src' : STAR_DATA_URL
		}) : $('<img>', {
			'width': '16px',
			'height': '16px',
			'src' : UNSTAR_DATA_URL
		})).addClass('favIcon');
	}
	static startStarAnimation($elem){
		const posx = $elem.offset().left - $elem.width()/2;
		const posy = $elem.offset().top - $elem.height()/2;
		let img = $('<img>',{
			'width': '32px',
			'height': '32px',
			'src': LARGE_STAR_DATA_URL
		});
		let div = $('<div>',{
			'id': 'starAnime'
		}).css({'top':posy,'left':posx});
		div.append(img);
		$('#body').append(div);
		img.animate({width: '2px', height: '2px', opacity: 0, 'margin-left': '15px', 'margin-top': '15px'}, 300, () => {
			$('#starAnime').remove();
		});
	}
	static createFavIcon(id, title){
		let starIndex = -1;
		for (let j = 0, _jlen = Nicolist.starred.length; j < _jlen; j+=2) {
			let stId = Nicolist.starred[j];
			if (stId === id){
				starIndex = j;
				break;
			}
		}//j
		const favIcon = Nicolist.$starImg(starIndex !== -1);
		favIcon.addClass('mr-2 pointer').attr({
			'title': 'お気に入り',
			'data-id': id,
			'data-title': title
		}).on('click', (e) => {
			const thisId = $(e.currentTarget).attr('data-id');
			const thisTitle = $(e.currentTarget).attr('data-title');
			Nicolist.toggleFav(thisId, thisTitle);
			Nicolist.refreshFavsLeft();
			localStorage.setItem('nicolist_star', JSON.stringify(Nicolist.starred));
		});
		return favIcon;
	}
}