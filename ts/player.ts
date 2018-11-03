/// <reference path="images.ts"/>
/// <reference path="util.ts"/>
/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../node_modules/@types/youtube/index.d.ts"/>
/// <reference path="../node_modules/@types/sortablejs/index.d.ts"/>

class NicolistPlayer{
	static readonly domain = 'https://tkgwku.github.io/n';
	static showFavbutton = false;

	static playlist = [];
	static playlistTitleMap = {};
	static playindex = -1;
	static deletedVideoArray = [];
	static volumemap = {};
	static autoplay = false;//createEmbedElem()
	static skip_flag = false;//setupNiconicoIframe()
	static player;//setupYoutubeIframe()

	/**
	 * Register Nicolist Player Event Handler
	 */
	static registerEventListener(){
		$(window).resize(() =>  {
			if ($('#play iframe').length === 0) {return;}
			NicolistPlayer.videoResize();
		});
		$(window).on('unload', () => {
			// todo
		});
		$(window).scroll(() => {
			// todo
		});
		$('#pcclose').on('click', () => {
			$('#play').html('');
			$('#pclist').addClass('silent').html('');
			$('#controller').addClass('silent');
			NicolistPlayer.playindex = -1;
			NicolistPlayer.playlist = [];
		});
		$('#pcnewtab').on('click', () => {
			window.open(NicolistPlayer.domain+'/player.html?pl='+escape(JSON.stringify(NicolistPlayer.playlist))+'&i='+NicolistPlayer.playindex);
		});
		$('#pclist').on('change', () => {
			NicolistPlayer.playindex = Util.int($('#pclist').val()+'');
			if (isNaN(NicolistPlayer.playindex)) {
				NicolistPlayer.playindex = 0;//wont happen
			}
			NicolistPlayer.autoplay = false;
			NicolistPlayer.refreshPlayer();
		});
		$('#pcnext').on('click', (e) => {
			if ($(e.currentTarget).hasClass('disabled')) {return;}
			NicolistPlayer.autoplay = true;
			NicolistPlayer.next();
		});
		$('#pcprev').on('click', (e) => {
			if ($(e.currentTarget).hasClass('disabled')) {return;}
			NicolistPlayer.autoplay = true;
			NicolistPlayer.previous();
		});
		$('#pcloop').on('click', () => {
			if ($('#nicolist_loop').prop('checked')){
				$('#nicolist_loop').prop('checked', false);
				localStorage.setItem('nicolist_loop', 'false');
				$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
				$('#pcloop').attr('title', 'ループ再生');
			} else {
				$('#nicolist_loop').prop('checked', true);
				localStorage.setItem('nicolist_loop', 'true');
				$('#pcloop img').attr('src', LOOP_DATA_URL);
				$('#pcloop').attr('title', 'ループ再生を解除');
			}
			$('#pcloop').tooltip('dispose');
			Util.registerTooltip($('#pcloop'));
			$('#pcloop').tooltip('show');
			NicolistPlayer.refreshController();
		});
		$('#pcwidth').on('click', () => {
			if ($('#nicolist_cinematic').prop('checked')){
				$('#nicolist_cinematic').prop('checked', false);
				localStorage.setItem('nicolist_cinematic', 'false');
				$('#pcwidth img').attr('src', WIDEN_DATA_URL);
				$('#pcwidth').attr('title', 'ワイド画面で表示');
			} else {
				$('#nicolist_cinematic').prop('checked', true);
				localStorage.setItem('nicolist_cinematic', 'true');
				$('#pcwidth img').attr('src', NARROW_DATA_URL);
				$('#pcwidth').attr('title', '固定サイズで表示');
			}
			$('#pcwidth').tooltip('dispose');
			Util.registerTooltip($('#pcwidth'));
			$('#pcwidth').tooltip('show');
			NicolistPlayer.videoResize();
		});
	}
	/**
	 * create Youtube embed Iframe and append to '#play' 
	 * #play / iframe #playeriframeyoutube
	 * @param {string} id - video id
	 */
	static setupYoutubeIframe(id){
		$('#play').html('');
		var div = $('<div>',{
			'id': 'playeriframeyoutube',
		});
		$('#play').append(div);
		NicolistPlayer.player = new YT.Player('playeriframeyoutube', {
			videoId: id,
			playerVars: { 'autoplay': (NicolistPlayer.autoplay ? 1 : 0)},
			events: {
				'onStateChange': (event) => {
					if (event.data === YT.PlayerState.ENDED){
						NicolistPlayer.autoplay = true;
						NicolistPlayer.next();
					} else if (event.data === YT.PlayerState.CUED){
						NicolistPlayer.removeFromDeletedVideoList(id);
						if (NicolistPlayer.autoplay){
							NicolistPlayer.player.playVideo();
							NicolistPlayer.autoplay = false;
						}
					}
				},
				'onError': (event) => {
					NicolistPlayer.addToDeletedVideoList(id);
					NicolistPlayer.autoplay = true;
					NicolistPlayer.next();
				}
			}
		});
		NicolistPlayer.videoResize();
	}
	/**
	 * create Niconico embed Iframe and append to '#play' 
	 * #play / iframe #playeriframenicovideo
	 * @param {string} id - video id
	 */
	static setupNiconicoIframe(id:string){
		$('#play').html('');
		var iframeElement = $('<iframe>',{
			"id": "playeriframenicovideo",
			"src": 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId=0',
			"frameborder": "0",
			"allow": "autoplay; encrypted-media",
			"allowfullscreen": ""
		});
		$('#play').append(iframeElement);
		NicolistPlayer.videoResize();
		window.onmessage = (event) => {
			if (event.origin === 'https://embed.nicovideo.jp'){
				if (event.data.eventName === 'error'){
					//if the video has been dead
					NicolistPlayer.addToDeletedVideoList(id);
					NicolistPlayer.autoplay = true;
					NicolistPlayer.next();
				} else if (event.data.eventName === 'playerStatusChange'){
					if (event.data.data.playerStatus === 4){
						NicolistPlayer.autoplay = true;
						NicolistPlayer.next();
					}
				} else if (event.data.eventName === 'loadComplete'){
					if (NicolistPlayer.autoplay){
						(<HTMLIFrameElement>$('#play iframe').get(0)).contentWindow.postMessage({eventName:'play',playerId:"0",sourceConnectorType:1}, 'https://embed.nicovideo.jp');
						NicolistPlayer.autoplay = false;
					}
					NicolistPlayer.removeFromDeletedVideoList(id);
					//set volume
					if ($('#nicolist_savevolume').prop('checked')){
						var playing = NicolistPlayer.playlist[NicolistPlayer.playindex];
						if (NicolistPlayer.volumemap.hasOwnProperty(playing)){
							(<HTMLIFrameElement>$('#play iframe').get(0)).contentWindow.postMessage({
								eventName:'volumeChange',
								playerId: "0",
								sourceConnectorType: 1,
								data: {
									volume: NicolistPlayer.volumemap[playing]
								}
							}, 'https://embed.nicovideo.jp');
						}
						NicolistPlayer.skip_flag = true;
					}
				} else if ($('#nicolist_savevolume').prop('checked') && event.data.eventName === 'playerMetadataChange'){
					if (NicolistPlayer.skip_flag){
						NicolistPlayer.skip_flag = false;
					} else {
						var v = Math.round(event.data.data.volume * 1000)/1000;
						var playing = NicolistPlayer.playlist[NicolistPlayer.playindex];
						if (!NicolistPlayer.volumemap.hasOwnProperty(playing) || NicolistPlayer.volumemap[playing] !== v){
							NicolistPlayer.volumemap[playing] = v;
							localStorage.setItem('nicolist_volumemap', JSON.stringify(NicolistPlayer.volumemap));
						}
					}
				}
			}
		}
	}
	/**
	 * mark as unavailable video
	 * @param id 
	 */
	static addToDeletedVideoList(id){
		if ($.inArray(id, NicolistPlayer.deletedVideoArray) === -1){
			NicolistPlayer.deletedVideoArray.push(id);
			localStorage.setItem('nicolist_deleted', JSON.stringify(NicolistPlayer.deletedVideoArray));
			var $elem = $('#pclist option[value='+NicolistPlayer.playindex+']');
			if ($elem.length !== 0){
				$elem.text('[x] '+(NicolistPlayer.playindex+1)+': '+NicolistPlayer.playlistTitleMap[id]);
			}
		}
	}
	/**
	 * unmark from unavailable video
	 * @param id 
	 */
	static removeFromDeletedVideoList(id){
		var _delindex = $.inArray(id, NicolistPlayer.deletedVideoArray);
		if (_delindex !== -1){
			NicolistPlayer.deletedVideoArray.splice(_delindex, 1);
			localStorage.setItem('nicolist_deleted', JSON.stringify(NicolistPlayer.deletedVideoArray));
			var $elem = $('#pclist option[value='+NicolistPlayer.playindex+']');
			if ($elem.length !== 0){
				$elem.text((NicolistPlayer.playindex+1)+': '+NicolistPlayer.playlistTitleMap[id]);
			}
		}
	}
	/**
	 * make proper video Iframe element (width, height)
	 * @returns {Array} (width, height)
	 */
	static videoSize(){
		var w = $('#play').outerWidth();
		var h = Math.ceil(w * 9 / 16);
		if ($(window).height() * 0.7 < h){
			h = Math.ceil($(window).height() * 0.7);
			w = Math.ceil(h * 16 / 9);
		}
		if (w < 640 || $('#nicolist_cinematic').prop('checked')){
			return [w, h];
		} else {
			return [640, 360];
		}
	}
	/**
	 * set proper video Iframe width and height
	 */
	static videoResize(){
		var s = NicolistPlayer.videoSize();
		$('#play iframe').css({
			'width': s[0],
			'height': s[1]
		});
		$('#controller').css({
			'width': s[0]
		});
	}
	/**
	 * play next video 
	 */
	static next(){
		if (NicolistPlayer.hasNext()){
			NicolistPlayer.playindex++;
			NicolistPlayer.refreshPlayer();
		} else {
			if ($('#nicolist_loop').prop('checked')){
				NicolistPlayer.playindex = 0;
				NicolistPlayer.refreshPlayer();
			}
		}
	}
	/**
	 * playlist has next video
	 * @returns {boolean}
	 */
	static hasNext(){
		return NicolistPlayer.playindex > -1 && NicolistPlayer.playlist.length > NicolistPlayer.playindex + 1;
	}
	/**
	 * playlist has previous video
	 * @returns {boolean} 
	 */
	static hasPrevious(){
		return NicolistPlayer.playindex > 0;
	}
	/**
	 * play previous video
	 */
	static previous(){
		if (NicolistPlayer.hasPrevious()){
			NicolistPlayer.playindex--;
			NicolistPlayer.refreshPlayer();
		} else {
			if ($('#nicolist_loop').prop('checked')){
				NicolistPlayer.playindex = NicolistPlayer.playlist.length - 1;
				NicolistPlayer.refreshPlayer();
			}
		}
	}
	/**
	 * refresh player Iframe content <br>
	 * called when playlist change and when playindex change
	 */
	static refreshPlayer(){
		var id = NicolistPlayer.playlist[NicolistPlayer.playindex];
		if (/^sm\d+$/.test(id)|| /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)){
			if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframeyoutube'){
				NicolistPlayer.setupNiconicoIframe(id);
			} else {
				$('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId=0');
			}
		} else {
			if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframenicovideo'){
				NicolistPlayer.setupYoutubeIframe(id);
			} else {
				NicolistPlayer.player.loadVideoById({videoId: id});
			}
		}
		NicolistPlayer.refreshController();
	}
	/**
	 * refresh player controller outside Iframe
	 */
	static refreshController(){
		if (NicolistPlayer.hasNext() || $('#nicolist_loop').prop('checked')){
			$('#pcnext').removeClass('disabled');
		} else {
			$('#pcnext').addClass('disabled');
		}
		if (NicolistPlayer.hasPrevious() || $('#nicolist_loop').prop('checked')){
			$('#pcprev').removeClass('disabled');
		} else {
			$('#pcprev').addClass('disabled');
		}
		if ($('#play').html() !== ''){
			$('#controller').removeClass('silent');
		} else {
			$('#controller').addClass('silent');
		}
		if (NicolistPlayer.playlist.length > 1){
			$('#pclist').removeClass('silent');
			$('#pclist').val(NicolistPlayer.playindex+'');
		} else {
			$('#pclist').addClass('silent');
		}
		$('#pcfav').html('');
		//for nicolist main page
		if (NicolistPlayer.showFavbutton){
			$('#pcfav').append(Nicolist.createFavIcon(NicolistPlayer.playlist[NicolistPlayer.playindex], NicolistPlayer.playlistTitleMap[NicolistPlayer.playlist[NicolistPlayer.playindex]]).removeClass('mr-2'));
			Util.registerTooltip($('#pcfav .favIcon'));
		}
	}
	/**
	 * initialize playlist listup elements <br>
	 * todo: youtube-like playlist showcage
	 */
	static initPlaylistSel(){
		$('#pclist').html('');
		var opt, suffix, i;
		for (i = 0; i < NicolistPlayer.playlist.length; i++) {
			if (NicolistPlayer.playlistTitleMap.hasOwnProperty(NicolistPlayer.playlist[i])){
				suffix = ($.inArray(NicolistPlayer.playlist[i], NicolistPlayer.deletedVideoArray) === -1) ? '' : '[x] ';
				opt = $('<option>', {
					text: suffix + (i+1) + ': ' + NicolistPlayer.playlistTitleMap[NicolistPlayer.playlist[i]],
					'value': i+''
				});
				opt.appendTo($('#pclist'));
			} else {
				continue;
			}
		}
	}
	/**
	 * create embed Iframe element
	 */
	static createEmbedElem(){
		var id = NicolistPlayer.playlist[NicolistPlayer.playindex];
		if (/^sm\d+$/.test(id) || /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)){
			NicolistPlayer.setupNiconicoIframe(id);
		} else {
			NicolistPlayer.setupYoutubeIframe(id);
		}
		try {
			(<HTMLIFrameElement>$('#play iframe').get(0)).contentWindow.ondrop = (e) => {
				e.preventDefault();
				e.stopPropagation();
			}
		} catch(e) {
			/* for IE-11 */
			// access denied [TypeError]
		}
		NicolistPlayer.initPlaylistSel();

		$('#pcprev img').attr('src', PREV_DATA_URL);
		$('#pcnext img').attr('src', NEXT_DATA_URL);
		$('#pcclose img').attr('src', CLOSE_DATA_URL);
		$('#pcnewtab img').attr('src', JUMP_DATA_URL);
		if ($('#nicolist_loop').prop('checked')){
			$('#pcloop img').attr('src', LOOP_DATA_URL);
			$('#pcloop').attr('title', 'ループ再生を解除');
		} else {
			$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
			$('#pcloop').attr('title', 'ループ再生');
		}
		Util.registerTooltip($('#pcloop'));
		if ($('#nicolist_cinematic').prop('checked')){
			$('#pcwidth img').attr('src', NARROW_DATA_URL);
			$('#pcwidth').attr('title', '固定サイズで表示');
		} else {
			$('#pcwidth img').attr('src', WIDEN_DATA_URL);
			$('#pcwidth').attr('title', 'ワイド画面で表示');
		}
		Util.registerTooltip($('#pcwidth'));
	}
	////// for player.html ///////
	static init(){
		NicolistPlayer.registerEventListener();

		$('input[type=checkbox]').on('change', (e) => {
			var id = $(e.currentTarget).attr('id');
			if (!Util.isNull(id)){
				window.localStorage.setItem(id, $(e.currentTarget).prop('checked'));
			}
		});
		$('#pcrestore').on('click', () => {
			NicolistPlayer.restore();
		});
		$('#pcopenpref').on('click', () => {
			$('#prefModal').modal('show');
		});
		
		NicolistPlayer.fromURLInfo();
	}
	static fromURLInfo(){
		var infoarray = window.location.search.match(/[^?&]+=[^?&]*/g);

		if (infoarray === null){
			if (localStorage.getItem('nicolist_playlist_next')){
				NicolistPlayer.restore();
			}
			$('#noquery').removeClass('silent');

			var l = localStorage.getItem('nicolist_playlist_s');
			if (l){
				var ml = l.match(/[^?&]+=[^?&]*/g);
				if (ml){
					$('#restoreQuestion').removeClass('silent');
				}
			}
			return;
		}

		for (var i = 0; i < infoarray.length; i++) {
			var m = infoarray[i].match(/^pl=([^?&]+)$/);
			if (m) {
				try {
					NicolistPlayer.playlist = JSON.parse(unescape(m[1]));
				} catch(e) {
					$('#play').text(e);
					return;
				}
			} else {
				var m2 = infoarray[i].match(/^i=(\d+)$/);
				if (m2) {
					NicolistPlayer.playindex = Util.int(m2[1]);
				}
			}
		}

		if (!(NicolistPlayer.playlist instanceof Array) || NicolistPlayer.playlist.length === 0){
			$('#play').text('プレイリスト情報が不正です。');
			return;
		}

		if (NicolistPlayer.playlist.length <= NicolistPlayer.playindex || NicolistPlayer.playindex < 0) {
			NicolistPlayer.playindex = 0;
		}

		NicolistPlayer.refreshController();
		NicolistPlayer.createEmbedElem();

		
		localStorage.setItem('nicolist_playlist_s', 'pl='+JSON.stringify(NicolistPlayer.playlist)+'&i='+NicolistPlayer.playindex);
	}
	static restore(){
		var l = localStorage.getItem('nicolist_playlist_s');
		if (l){
			var m = l.match(/^pl=([^?&]+)&i=(\d+)$/);
			if (m && m.length > 2){
				NicolistPlayer.playlist = JSON.parse(unescape(m[1]));
				NicolistPlayer.playindex = parseInt(m[2], 10);
				NicolistPlayer.refreshController();
				NicolistPlayer.createEmbedElem();
				$('#noquery').addClass('silent');
			}
		}
	}
}