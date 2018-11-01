/// <reference path="images.ts"/>
/// <reference path="nicolist.ts"/>
/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../node_modules/@types/youtube/index.d.ts"/>
/// <reference path="../node_modules/@types/sortablejs/index.d.ts"/>
var NicolistPlayer = /** @class */ (function () {
    function NicolistPlayer() {
    }
    NicolistPlayer.registerEventListener = function () {
        $(window).resize(function () {
            if ($('#play iframe').length === 0) {
                return;
            }
            NicolistPlayer.videoResize();
        });
        $(window).on('unload', function () {
            // todo
        });
        $(window).scroll(function () {
            // todo
        });
        $('#pcclose').on('click', function () {
            $('#play').html('');
            $('#pclist').addClass('silent').html('');
            $('#controller').addClass('silent');
            NicolistPlayer.playindex = -1;
            NicolistPlayer.playlist = [];
        });
        $('#pcnewtab').on('click', function () {
            window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(NicolistPlayer.playlist)) + '&i=' + NicolistPlayer.playindex);
        });
        $('#pclist').on('change', function () {
            NicolistPlayer.playindex = Nicolist.int($('#pclist').val() + '');
            if (isNaN(NicolistPlayer.playindex)) {
                NicolistPlayer.playindex = 0; //wont happen
            }
            NicolistPlayer.autoplay = false;
            NicolistPlayer.refreshPlayer();
        });
        $('#pcnext').on('click', function (e) {
            if ($(e.currentTarget).hasClass('disabled')) {
                return;
            }
            NicolistPlayer.autoplay = true;
            NicolistPlayer.next();
        });
        $('#pcprev').on('click', function (e) {
            if ($(e.currentTarget).hasClass('disabled')) {
                return;
            }
            NicolistPlayer.autoplay = true;
            NicolistPlayer.previous();
        });
        $('#pcloop').on('click', function () {
            if ($('#nicolist_loop').prop('checked')) {
                $('#nicolist_loop').prop('checked', false);
                localStorage.setItem('nicolist_loop', 'false');
                $('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
                $('#pcloop').attr('title', 'ループ再生');
            }
            else {
                $('#nicolist_loop').prop('checked', true);
                localStorage.setItem('nicolist_loop', 'true');
                $('#pcloop img').attr('src', LOOP_DATA_URL);
                $('#pcloop').attr('title', 'ループ再生を解除');
            }
            $('#pcloop').tooltip('dispose');
            Nicolist.registerTooltip($('#pcloop'));
            $('#pcloop').tooltip('show');
            NicolistPlayer.refreshController();
        });
        $('#pcwidth').on('click', function () {
            if ($('#nicolist_cinematic').prop('checked')) {
                $('#nicolist_cinematic').prop('checked', false);
                localStorage.setItem('nicolist_cinematic', 'false');
                $('#pcwidth img').attr('src', WIDEN_DATA_URL);
                $('#pcwidth').attr('title', 'ワイド画面で表示');
            }
            else {
                $('#nicolist_cinematic').prop('checked', true);
                localStorage.setItem('nicolist_cinematic', 'true');
                $('#pcwidth img').attr('src', NARROW_DATA_URL);
                $('#pcwidth').attr('title', '固定サイズで表示');
            }
            $('#pcwidth').tooltip('dispose');
            Nicolist.registerTooltip($('#pcwidth'));
            $('#pcwidth').tooltip('show');
            NicolistPlayer.videoResize();
        });
    };
    NicolistPlayer.randomize = function (array, first) {
        if (array.length <= 1) {
            return array;
        }
        ;
        if (first) {
            var x = $.inArray(first, array);
            if (x !== -1) {
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
    };
    NicolistPlayer.setupYoutubeIframe = function (id) {
        $('#play').html('');
        var div = $('<div>', {
            'id': 'playeriframeyoutube'
        });
        $('#play').append(div);
        NicolistPlayer.player = new YT.Player('playeriframeyoutube', {
            videoId: id,
            playerVars: { 'autoplay': (NicolistPlayer.autoplay ? 1 : 0) },
            events: {
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        NicolistPlayer.autoplay = true;
                        NicolistPlayer.next();
                    }
                    else if (event.data === YT.PlayerState.CUED) {
                        NicolistPlayer.removeFromDeletedVideoList(id);
                        if (NicolistPlayer.autoplay) {
                            NicolistPlayer.player.playVideo();
                            NicolistPlayer.autoplay = false;
                        }
                    }
                },
                'onError': function (event) {
                    NicolistPlayer.addToDeletedVideoList(id);
                    NicolistPlayer.autoplay = true;
                    NicolistPlayer.next();
                }
            }
        });
        NicolistPlayer.videoResize();
    };
    NicolistPlayer.setupNiconicoIframe = function (id) {
        $('#play').html('');
        var iframeElement = $('<iframe>', {
            "id": "playeriframenicovideo",
            "src": 'https://embed.nicovideo.jp/watch/' + id + '?jsapi=1&playerId=0',
            "frameborder": "0",
            "allow": "autoplay; encrypted-media",
            "allowfullscreen": ""
        });
        $('#play').append(iframeElement);
        NicolistPlayer.videoResize();
        window.onmessage = function (event) {
            if (event.origin === 'https://embed.nicovideo.jp') {
                if (event.data.eventName === 'error') {
                    //if the video has been dead
                    NicolistPlayer.addToDeletedVideoList(id);
                    NicolistPlayer.autoplay = true;
                    NicolistPlayer.next();
                }
                else if (event.data.eventName === 'playerStatusChange') {
                    if (event.data.data.playerStatus === 4) {
                        NicolistPlayer.autoplay = true;
                        NicolistPlayer.next();
                    }
                }
                else if (event.data.eventName === 'loadComplete') {
                    if (NicolistPlayer.autoplay) {
                        $('#play iframe').get(0).contentWindow.postMessage({ eventName: 'play', playerId: "0", sourceConnectorType: 1 }, 'https://embed.nicovideo.jp');
                        NicolistPlayer.autoplay = false;
                    }
                    NicolistPlayer.removeFromDeletedVideoList(id);
                    //set volume
                    if ($('#nicolist_savevolume').prop('checked')) {
                        var playing = NicolistPlayer.playlist[NicolistPlayer.playindex];
                        if (NicolistPlayer.volumemap.hasOwnProperty(playing)) {
                            $('#play iframe').get(0).contentWindow.postMessage({
                                eventName: 'volumeChange',
                                playerId: "0",
                                sourceConnectorType: 1,
                                data: {
                                    volume: NicolistPlayer.volumemap[playing]
                                }
                            }, 'https://embed.nicovideo.jp');
                        }
                        NicolistPlayer.skip_flag = true;
                    }
                }
                else if ($('#nicolist_savevolume').prop('checked') && event.data.eventName === 'playerMetadataChange') {
                    if (NicolistPlayer.skip_flag) {
                        NicolistPlayer.skip_flag = false;
                    }
                    else {
                        var v = Math.round(event.data.data.volume * 1000) / 1000;
                        var playing = NicolistPlayer.playlist[NicolistPlayer.playindex];
                        if (!NicolistPlayer.volumemap.hasOwnProperty(playing) || NicolistPlayer.volumemap[playing] !== v) {
                            NicolistPlayer.volumemap[playing] = v;
                            localStorage.setItem('nicolist_volumemap', JSON.stringify(NicolistPlayer.volumemap));
                        }
                    }
                }
            }
        };
    };
    NicolistPlayer.addToDeletedVideoList = function (id) {
        if ($.inArray(id, NicolistPlayer.deletedVideoArray) === -1) {
            NicolistPlayer.deletedVideoArray.push(id);
            localStorage.setItem('nicolist_deleted', JSON.stringify(NicolistPlayer.deletedVideoArray));
            var $elem = $('#pclist option[value=' + NicolistPlayer.playindex + ']');
            if ($elem.length !== 0) {
                $elem.text('[x] ' + (NicolistPlayer.playindex + 1) + ': ' + NicolistPlayer.playlistTitleMap[id]);
            }
        }
    };
    NicolistPlayer.removeFromDeletedVideoList = function (id) {
        var _delindex = $.inArray(id, NicolistPlayer.deletedVideoArray);
        if (_delindex !== -1) {
            NicolistPlayer.deletedVideoArray.splice(_delindex, 1);
            localStorage.setItem('nicolist_deleted', JSON.stringify(NicolistPlayer.deletedVideoArray));
            var $elem = $('#pclist option[value=' + NicolistPlayer.playindex + ']');
            if ($elem.length !== 0) {
                $elem.text((NicolistPlayer.playindex + 1) + ': ' + NicolistPlayer.playlistTitleMap[id]);
            }
        }
    };
    NicolistPlayer.videoSize = function () {
        var w = $('#play').outerWidth();
        var h = Math.ceil(w * 9 / 16);
        if ($(window).height() * 0.7 < h) {
            h = Math.ceil($(window).height() * 0.7);
            w = Math.ceil(h * 16 / 9);
        }
        if (w < 640 || $('#nicolist_cinematic').prop('checked')) {
            return [w, h];
        }
        else {
            return [640, 360];
        }
    };
    NicolistPlayer.videoResize = function () {
        var s = NicolistPlayer.videoSize();
        $('#play iframe').css({
            'width': s[0],
            'height': s[1]
        });
        $('#controller').css({
            'width': s[0]
        });
    };
    NicolistPlayer.next = function () {
        if (NicolistPlayer.hasNext()) {
            NicolistPlayer.playindex++;
            NicolistPlayer.refreshPlayer();
        }
        else {
            if ($('#nicolist_loop').prop('checked')) {
                NicolistPlayer.playindex = 0;
                NicolistPlayer.refreshPlayer();
            }
        }
    };
    NicolistPlayer.hasNext = function () {
        return NicolistPlayer.playindex > -1 && NicolistPlayer.playlist.length > NicolistPlayer.playindex + 1;
    };
    NicolistPlayer.hasPrevious = function () {
        return NicolistPlayer.playindex > 0;
    };
    NicolistPlayer.previous = function () {
        if (NicolistPlayer.hasPrevious()) {
            NicolistPlayer.playindex--;
            NicolistPlayer.refreshPlayer();
        }
        else {
            if ($('#nicolist_loop').prop('checked')) {
                NicolistPlayer.playindex = NicolistPlayer.playlist.length - 1;
                NicolistPlayer.refreshPlayer();
            }
        }
    };
    NicolistPlayer.refreshPlayer = function () {
        var id = NicolistPlayer.playlist[NicolistPlayer.playindex];
        if (/^sm\d+$/.test(id) || /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)) {
            if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframeyoutube') {
                NicolistPlayer.setupNiconicoIframe(id);
            }
            else {
                $('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/' + id + '?jsapi=1&playerId=0');
            }
        }
        else {
            if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframenicovideo') {
                NicolistPlayer.setupYoutubeIframe(id);
            }
            else {
                NicolistPlayer.player.loadVideoById({ videoId: id });
            }
        }
        NicolistPlayer.refreshController();
    };
    NicolistPlayer.refreshController = function () {
        if (NicolistPlayer.hasNext() || $('#nicolist_loop').prop('checked')) {
            $('#pcnext').removeClass('disabled');
        }
        else {
            $('#pcnext').addClass('disabled');
        }
        if (NicolistPlayer.hasPrevious() || $('#nicolist_loop').prop('checked')) {
            $('#pcprev').removeClass('disabled');
        }
        else {
            $('#pcprev').addClass('disabled');
        }
        if ($('#play').html() !== '') {
            $('#controller').removeClass('silent');
        }
        else {
            $('#controller').addClass('silent');
        }
        if (NicolistPlayer.playlist.length > 1) {
            $('#pclist').removeClass('silent');
            $('#pclist').val(NicolistPlayer.playindex + '');
        }
        else {
            $('#pclist').addClass('silent');
        }
        $('#pcfav').html('');
        //for nicolist main page
        if (NicolistPlayer.showFavbutton) {
            $('#pcfav').append(Nicolist.createFavIcon(NicolistPlayer.playlist[NicolistPlayer.playindex], NicolistPlayer.playlistTitleMap[NicolistPlayer.playlist[NicolistPlayer.playindex]]).removeClass('mr-2'));
            Nicolist.registerTooltip($('#pcfav .favIcon'));
        }
    };
    NicolistPlayer.initPlaylistSel = function () {
        $('#pclist').html('');
        var opt, suffix, i;
        for (i = 0; i < NicolistPlayer.playlist.length; i++) {
            if (NicolistPlayer.playlistTitleMap.hasOwnProperty(NicolistPlayer.playlist[i])) {
                suffix = ($.inArray(NicolistPlayer.playlist[i], NicolistPlayer.deletedVideoArray) === -1) ? '' : '[x] ';
                opt = $('<option>', {
                    text: suffix + (i + 1) + ': ' + NicolistPlayer.playlistTitleMap[NicolistPlayer.playlist[i]],
                    'value': i + ''
                });
                opt.appendTo($('#pclist'));
            }
            else {
                //wont happen
                continue;
            }
        }
    };
    NicolistPlayer.createEmbedElem = function () {
        var id = NicolistPlayer.playlist[NicolistPlayer.playindex];
        if (/^sm\d+$/.test(id) || /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)) {
            NicolistPlayer.setupNiconicoIframe(id);
        }
        else {
            NicolistPlayer.setupYoutubeIframe(id);
        }
        try {
            $('#play iframe').get(0).contentWindow.ondrop = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };
        }
        catch (e) {
            /* for IE-11 */
            // access denied [TypeError]
        }
        NicolistPlayer.initPlaylistSel();
        $('#pcprev img').attr('src', PREV_DATA_URL);
        $('#pcnext img').attr('src', NEXT_DATA_URL);
        $('#pcclose img').attr('src', CLOSE_DATA_URL);
        $('#pcnewtab img').attr('src', JUMP_DATA_URL);
        if ($('#nicolist_loop').prop('checked')) {
            $('#pcloop img').attr('src', LOOP_DATA_URL);
            $('#pcloop').attr('title', 'ループ再生を解除');
        }
        else {
            $('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
            $('#pcloop').attr('title', 'ループ再生');
        }
        Nicolist.registerTooltip($('#pcloop'));
        if ($('#nicolist_cinematic').prop('checked')) {
            $('#pcwidth img').attr('src', NARROW_DATA_URL);
            $('#pcwidth').attr('title', '固定サイズで表示');
        }
        else {
            $('#pcwidth img').attr('src', WIDEN_DATA_URL);
            $('#pcwidth').attr('title', 'ワイド画面で表示');
        }
        Nicolist.registerTooltip($('#pcwidth'));
    };
    ////// for player.html ///////
    NicolistPlayer.init = function () {
        NicolistPlayer.registerEventListener();
        $('input[type=checkbox]').on('change', function (e) {
            var id = $(e.currentTarget).attr('id');
            if (!Nicolist.isNullOrUndefined(id)) {
                window.localStorage.setItem(id, $(e.currentTarget).prop('checked'));
            }
        });
        $('#pcrestore').on('click', function () {
            NicolistPlayer.restore();
        });
        $('#pcopenpref').on('click', function () {
            $('#prefModal').modal('show');
        });
        NicolistPlayer.fromURLInfo();
    };
    NicolistPlayer.fromURLInfo = function () {
        var infoarray = window.location.search.match(/[^?&]+=[^?&]*/g);
        if (infoarray === null) {
            if (localStorage.getItem('nicolist_playlist_next')) {
                NicolistPlayer.restore();
            }
            $('#noquery').removeClass('silent');
            var l = localStorage.getItem('nicolist_playlist_s');
            if (l) {
                var ml = l.match(/[^?&]+=[^?&]*/g);
                if (ml) {
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
                }
                catch (e) {
                    $('#play').text(e);
                    return;
                }
            }
            else {
                var m2 = infoarray[i].match(/^i=(\d+)$/);
                if (m2) {
                    NicolistPlayer.playindex = Nicolist.int(m2[1]);
                }
            }
        }
        if (!(NicolistPlayer.playlist instanceof Array) || NicolistPlayer.playlist.length === 0) {
            $('#play').text('プレイリスト情報が不正です。');
            return;
        }
        if (NicolistPlayer.playlist.length <= NicolistPlayer.playindex || NicolistPlayer.playindex < 0) {
            NicolistPlayer.playindex = 0;
        }
        NicolistPlayer.refreshController();
        NicolistPlayer.createEmbedElem();
        localStorage.setItem('nicolist_playlist_s', 'pl=' + JSON.stringify(NicolistPlayer.playlist) + '&i=' + NicolistPlayer.playindex);
    };
    NicolistPlayer.restore = function () {
        var l = localStorage.getItem('nicolist_playlist_s');
        if (l) {
            var m = l.match(/^pl=([^?&]+)&i=(\d+)$/);
            if (m && m.length > 2) {
                NicolistPlayer.playlist = JSON.parse(unescape(m[1]));
                NicolistPlayer.playindex = parseInt(m[2], 10);
                NicolistPlayer.refreshController();
                NicolistPlayer.createEmbedElem();
                $('#noquery').addClass('silent');
            }
        }
    };
    NicolistPlayer.showFavbutton = false;
    NicolistPlayer.playlist = [];
    NicolistPlayer.playlistTitleMap = {};
    NicolistPlayer.playindex = -1;
    NicolistPlayer.deletedVideoArray = [];
    NicolistPlayer.volumemap = {};
    NicolistPlayer.autoplay = false; //createEmbedElem()
    NicolistPlayer.skip_flag = false; //setupNiconicoIframe()
    return NicolistPlayer;
}());
