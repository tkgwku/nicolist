/// <reference path="images.ts"/>
/// <reference path="util.ts"/>
/// <reference path="player.ts"/>
/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../node_modules/@types/popper.js/index.d.ts"/>
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../node_modules/@types/youtube/index.d.ts"/>
/// <reference path="../node_modules/@types/sortablejs/index.d.ts"/>
var Nicolist = /** @class */ (function () {
    function Nicolist() {
    }
    Nicolist.loadImg = function ($elem) {
        var srcurl = $elem.attr('data-src');
        if (srcurl) {
            $elem.on('load', function (e) {
                if ($.inArray($(e.currentTarget).attr('src'), Nicolist.loadedtn) === -1) {
                    Nicolist.loadedtn.push($(e.currentTarget).attr('src'));
                }
                $(e.currentTarget).removeClass('loading');
            });
            $elem.attr('src', srcurl);
        }
    };
    Nicolist.escapeREInsideBracket = function (str) {
        return str.replace(/[\[\]\-\\\*\^]/g, function (x) {
            return '\\' + x;
        });
    };
    Nicolist.loadImgOnScreen = function (scrollSelecter, wrapperSelecter) {
        var horizon = $(window).height() + $(scrollSelecter).scrollTop();
        $(wrapperSelecter).find('img[data-src]:visible').each(function (i, elem) {
            if ($(elem).offset().top < horizon) {
                Nicolist.loadImg($(elem));
            }
        });
    };
    Nicolist.escapeRegExp = function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, function (x) { return '\\' + x; });
    };
    Nicolist.search = function (query) {
        var separator = Nicolist.escapeREInsideBracket($('#nicolist_separator').val() + '');
        var queryArray = [];
        if (separator === '') {
            queryArray = [query + ''];
        }
        else {
            var ga = separator.charAt(0);
            queryArray = (query + '')
                .replace(new RegExp('[' + separator + ']', 'g'), ga)
                .replace(new RegExp(ga + "+", 'g'), ga)
                .replace(new RegExp(ga + "$|^" + ga, 'g'), '')
                .split(ga);
        }
        if (queryArray[0] === '') {
            Nicolist.message('検索クエリが空です。');
            return;
        }
        var sqDesc = queryArray.join('」+「');
        $('#sr').html('');
        $('<button>', {
            'class': 'close',
            'aria-label': 'Close',
            'click': function (e) {
                $('#sr').fadeOut('slow', function () {
                    Nicolist.refreshStyle();
                    $('#sr').html('');
                });
            }
        }).append($('<span>', {
            html: '&times;'
        })).appendTo('#sr');
        Nicolist.pushHistory(query);
        var count = 0; //count all
        var mobj = {}; //matched video tree
        var isand = $("#nicolist_and").prop('checked'); // true: AND false: OR
        var maxsearchcount = Util.int($("#nicolist_msc").val());
        if (maxsearchcount <= 0) {
            maxsearchcount = Infinity;
        }
        var ignore = Nicolist.escapeREInsideBracket($('#nicolist_ignore').val());
        for (var genre in Nicolist.y) {
            var list = Nicolist.y[genre];
            if ($('#nicolist_sort').prop('checked')) {
                list = Nicolist.reversePairList(list);
            }
            for (var l = 0, _len = list.length / 2; l < _len; l++) {
                var id = list[2 * l];
                var title = list[2 * l + 1];
                var isMatched = true;
                if (isand) { //and
                    isMatched = true;
                    for (var _a = 0, queryArray_1 = queryArray; _a < queryArray_1.length; _a++) {
                        var searchQuery = queryArray_1[_a];
                        var m = void 0;
                        if (ignore !== '') {
                            m = title
                                .replace(new RegExp('[' + ignore + ']', 'g'), '')
                                .match(new RegExp(Nicolist.escapeRegExp(searchQuery), 'gi'));
                        }
                        else {
                            m = title
                                .match(new RegExp(Nicolist.escapeRegExp(searchQuery), 'gi'));
                        }
                        if (!m) {
                            isMatched = false;
                            break;
                        }
                    } //j
                }
                else { //or
                    isMatched = false;
                    for (var _b = 0, queryArray_2 = queryArray; _b < queryArray_2.length; _b++) {
                        var searchQuery = queryArray_2[_b];
                        var m = void 0;
                        if (ignore !== '') {
                            m = title
                                .replace(new RegExp('[' + ignore + ']', 'g'), '')
                                .match(new RegExp(Nicolist.escapeRegExp(searchQuery), 'gi'));
                        }
                        else {
                            m = title
                                .match(new RegExp(Nicolist.escapeRegExp(searchQuery), 'gi'));
                        }
                        if (m) {
                            isMatched = true;
                            break;
                        }
                    } //j
                }
                if (isMatched) {
                    count++;
                    if (count > maxsearchcount) {
                        $('#sr').append($('<span>', {
                            text: "\u691C\u7D22\u6761\u4EF6\u300C" + sqDesc + "\u300D\u306B\u4E00\u81F4\u3059\u308B\u52D5\u753B\u304C\u591A\u3059\u304E\u307E\u3059"
                        }));
                        $('#sr').fadeIn();
                        return;
                    }
                    if (!mobj.hasOwnProperty(genre)) {
                        mobj[genre] = [];
                    }
                    mobj[genre].push(id);
                    mobj[genre].push(title);
                }
            } //l
        } //i
        var mkeys = Object.keys(mobj);
        var mlen = mkeys.length;
        if (mlen === 0) {
            $('#sr').append($('<span>', {
                text: "\u691C\u7D22\u6761\u4EF6\u300C" + sqDesc + "\u300D\u306B\u4E00\u81F4\u3059\u308B\u52D5\u753B\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F"
            }));
            $('#sr').fadeIn();
            return;
        }
        var wrapperSr = $('<div>');
        $('<h4>', {
            text: "\u300C" + sqDesc + "\u300D\u306E\u691C\u7D22\u7D50\u679C"
        }).append($('<small>', {
            text: "(" + count + "\u4EF6\u306E\u4E00\u81F4)",
            'class': 'text-muted ml-2'
        })).appendTo(wrapperSr);
        var manyMatched = mlen > 2 && count > 20;
        for (var i = 0; i < mlen; i++) {
            var genre = mkeys[i];
            var list = mobj[genre];
            var wrapperTitle = $('<div>');
            var genreTitle = $('<span>', {
                text: (manyMatched ? '- ' : '') + genre,
                'data-genre': genre,
                'data-for': 'genreTitle'
            });
            if (manyMatched) {
                genreTitle.on('click', function (e) {
                    var thisGenre = $(e.currentTarget).attr('data-genre');
                    $("#sr div[data-for=wrapperGenre][data-genre!=\"" + thisGenre + "\"]").each(function (_i, elem) {
                        $(elem).addClass('silent');
                    });
                    $("#sr div[data-for=wrapperGenre][data-genre=\"" + thisGenre + "\"]").each(function (_i, elem) {
                        $(elem).toggleClass('silent');
                        Nicolist.loadImgOnScreen('html, body', '#sr');
                    });
                });
                genreTitle.addClass('pointer hover');
            }
            wrapperTitle.append(genreTitle);
            wrapperSr.append(wrapperTitle);
            var wrapperGenre = $('<div>', {
                'data-genre': genre,
                'data-for': 'wrapperGenre',
                'class': 'mt-2 mb-2'
            });
            if (manyMatched) {
                wrapperGenre.addClass('silent');
            }
            for (var k = 0, _lenk = list.length / 2; k < _lenk; k++) {
                var id = list[2 * k];
                var title = list[2 * k + 1];
                var wrapperVideo = $('<div>', {
                    'class': 'd-flex align-items-center flex-row'
                });
                var favIcon = Nicolist.createFavIcon(id, title);
                wrapperVideo.append(favIcon);
                var a = $('<a>', {
                    'href': Nicolist.getVideoURL(id),
                    'target': '_blank',
                    'data-genre': genre,
                    'data-id': id,
                    'data-title': title,
                    contextmenu: function (e) {
                        Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'search');
                        return false;
                    },
                    'click': function (e2) {
                        if ($('#click_action').val() !== 'official') {
                            e2.preventDefault();
                        }
                        Nicolist.openVideo($(e2.currentTarget), 'search');
                    }
                });
                if ($('#nicolist_thumb_res').prop('checked')) {
                    a.append(Nicolist.createStayUnloadedTNI(id, false));
                }
                var span = void 0;
                if ($('#nicolist_highlight').prop('checked')) {
                    title = Util.escapeHtmlSpecialChars(title);
                    for (var _e = 0, queryArray_3 = queryArray; _e < queryArray_3.length; _e++) {
                        var searchQuery = queryArray_3[_e];
                        title = title.replace(new RegExp(Nicolist.compoundRe(Nicolist.escapeRegExp(searchQuery), "[" + ignore + "]*"), 'gi'), function (x) {
                            return "<mark>" + x + "</mark>";
                        });
                    } //j
                    span = $('<span>', { html: title });
                }
                else {
                    span = $('<span>', { text: title });
                }
                /*
                var span;
                if ($('#nicolist_highlight').prop('checked')){
                    span = $('<span>');
                    var mpt = [_t];
                    for (var j = 0; j < sq.length; j++) {
                        var reg = new RegExp(Nicolist.compoundRe(sq[j], '['+ignore+']*'), 'gi');
                        var mptd = [];
                        for (var k = 0; k < mpt.length; k++) {
                            if (k % 2 === 0){
                                var mct = mpt[k].match(reg);
                                var mdt = mpt[k].split(reg);
                                if (mct !== null && mdt.length - 1 === mct.length){
                                    for (var l = 0; l < mct.length; l++) {
                                        mptd.push(mdt[l]);
                                        mptd.push(mct[l]);
                                    }
                                    mptd.push(mdt[mdt.length-1]);
                                } else {
                                    mptd.push(mpt[k]);
                                }
                            } else {
                                mptd.push(mpt[k]);
                            }
                        }
                        mpt = mptd;
                    }
                    for (var j = 0; j < mpt.length; j++) {
                        if (j % 2 === 0) {
                            span.append($('<span>', {text: mpt[j]}));
                        } else {
                            span.append($('<mark>', {text: mpt[j]}));
                        }
                    }
                } else {
                    span = $('<span>', {text: _t});
                }
                */
                a.append(span);
                a.appendTo(wrapperVideo);
                wrapperVideo.appendTo(wrapperGenre);
            } //k
            wrapperGenre.appendTo(wrapperSr);
        } //i
        $('#sr').append(wrapperSr);
        $('#sr').fadeIn();
        Nicolist.loadImgOnScreen('html, body', '#sr');
        $('#alert').fadeOut();
    };
    //compoundRe('xxxx', '.') -> 'x.x.x.x'
    Nicolist.compoundRe = function (text, re) {
        var str = '';
        for (var i = 0, _len = text.length; i < _len; i++) {
            str += text.charAt(i);
            if (i < _len - 1) {
                str += re;
            }
        }
        return str;
    };
    Nicolist.getVideoURL = function (id) {
        if (/^sm\d+$/.test(id)
            || /^nm\d+$/.test(id)
            || /^so\d+$/.test(id)
            || /^\d+$/.test(id)) {
            return 'http://www.nicovideo.jp/watch/' + id;
        }
        else {
            return 'https://www.youtube.com/watch?v=' + id;
        }
    };
    Nicolist.getThumbURL = function (id) {
        if (/^sm\d+$/.test(id)) {
            var numid = Util.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^nm\d+$/.test(id)) {
            var numid = Util.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^so\d+$/.test(id)) {
            var numid = Util.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^\d+$/.test(id)) {
            var numid = Util.int(id);
            return CHANNEL;
        }
        else {
            return 'https://img.youtube.com/vi/' + id + '/0.jpg';
        }
    };
    Nicolist.videoIdMatch = function (str) {
        var m_sm = str.match(/nicovideo\.jp\/watch\/(sm\d+)/);
        if (m_sm !== null) {
            return m_sm[1];
        }
        var m_nm = str.match(/nicovideo\.jp\/watch\/(nm\d+)/);
        if (m_nm !== null) {
            return m_nm[1];
        }
        var m_so = str.match(/nicovideo\.jp\/watch\/(so\d+)/);
        if (m_so !== null) {
            return m_so[1];
        }
        var m_cn = str.match(/nicovideo\.jp\/watch\/(\d+)/);
        if (m_cn !== null) {
            return m_cn[1];
        }
        var m_yt = str.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (m_yt !== null) {
            return m_yt[1];
        }
        var m_yt2 = str.match(/youtube\.com\/watch\?[^&]+&v=([a-zA-Z0-9_-]+)/);
        if (m_yt2 !== null) {
            return m_yt2[1];
        }
        return null;
    };
    Nicolist.sub = function () {
        if (Nicolist.checkValidity()) {
            var title = $('#title').val() + '';
            var genre = $('#genre').val() + '';
            var id = Nicolist.videoIdMatch($('#url').val());
            if (!Nicolist.has(genre, id)) {
                Nicolist.pushPrev();
                Nicolist.y[genre].push(id);
                Nicolist.y[genre].push(title);
                Nicolist.refresh('v'); //video change
                $('#url').val('');
                $('#title').val('');
                $('#url, #title').removeClass('is-valid');
                if (!$('#registry').hasClass('silent')) {
                    $('#registry').addClass('silent');
                }
                $('#registry').html('');
                Nicolist.lastId = '';
                $('#alert, #alert-addvideo').html('');
                if ($('#nicolist_stayopen').prop('checked')) {
                    Nicolist.messageUndoable("\u52D5\u753B\u300C" + Util.cutString(title, 50) + "\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F", 'success', '#alert-addvideo', 'v');
                }
                else {
                    Nicolist.messageUndoable("\u52D5\u753B\u300C" + Util.cutString(title, 50) + "\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F", 'success', null, 'v');
                    $('#addVideoModal').modal('hide');
                }
            }
            else {
                Nicolist.message('すでに登録されています', 'warning', '#alert-addvideo');
            }
        }
    };
    Nicolist.checkTitleValidity = function ($node) {
        if ($node.val() === ''
            || $node.val().length > 100
            || /^http:\/\//.test($node.val())
            || /^https:\/\//.test($node.val())) {
            $node.removeClass('is-valid');
            $node.addClass('is-invalid');
            return false;
        }
        else {
            $node.removeClass('is-invalid');
            $node.addClass('is-valid');
            return true;
        }
    };
    Nicolist.checkURLValidity = function () {
        var m = Nicolist.videoIdMatch($('#url').val() + '');
        if (m !== null) {
            $('#url').removeClass('is-invalid');
            $('#url').addClass('is-valid');
            if (m !== Nicolist.lastId) {
                $('#registry').html('');
                var already = $('<ul>', {
                    'class': 'list-unstyled'
                });
                for (var genre in Nicolist.y) {
                    var list = Nicolist.y[genre];
                    for (var i = 0, _len = list.length / 2; i < _len; i++) {
                        var id = list[2 * i];
                        var title = list[2 * i + 1];
                        if (id === m) {
                            already.append($('<li>', {
                                text: genre
                            }).append($('<span>', {
                                text: "(" + Util.cutString(title, 80) + ")",
                                'class': 'ml-2 text-muted'
                            })));
                        }
                    }
                }
                var div = $('<div>', {
                    'class': 'd-flex align-items-center flex-row'
                });
                div.append(Nicolist.createThumbImgElem(m, false));
                if (already.html() !== '') {
                    $('#registry').prepend($('<div>', {
                        text: 'この動画はすでに以下のジャンルに登録されています:',
                        'class': 'mb-2 text-muted'
                    }));
                    div.append(already);
                    div.appendTo('#registry');
                }
                else {
                    div.append($('<span>', {
                        text: 'サムネイルはこのように表示されます',
                        'class': 'text-muted'
                    }));
                    div.appendTo('#registry');
                }
                $('#registry').removeClass('silent');
                Nicolist.lastId = m;
            }
            return true;
        }
        else {
            $('#url').removeClass('is-valid');
            $('#url').addClass('is-invalid');
            $('#registry').addClass('silent');
            return false;
        }
    };
    Nicolist.checkGenreValidity = function () {
        if ($('#genre').val() === '') {
            $('#genre').addClass('is-invalid');
            return false;
        }
        return true;
    };
    Nicolist.checkValidity = function () {
        var flag = Nicolist.checkGenreValidity();
        flag = Nicolist.checkURLValidity() && flag;
        flag = Nicolist.checkTitleValidity($('#title')) && flag;
        if (!flag) {
            $('#button').prop('disabled', true);
        }
        else {
            $('#button').prop('disabled', false);
        }
        return flag;
    };
    Nicolist.pushHistory = function (queryStr) {
        var _hindex = $.inArray(queryStr, Nicolist.searchHistory);
        if (_hindex === -1) {
            var a = [];
            a.push(queryStr);
            var count = Math.min(Util.int($('#nicolist_historyCount').val() + '') - 1, Nicolist.searchHistory.length);
            for (var i = 0; i < count; i++) {
                a.push(Nicolist.searchHistory[i]);
            }
            Nicolist.searchHistory = a;
        }
        else {
            var a = [];
            a.push(queryStr);
            for (var i = 0, _len = Nicolist.searchHistory.length; i < _len; i++) {
                if (i !== _hindex) {
                    a.push(Nicolist.searchHistory[i]);
                }
            }
            Nicolist.searchHistory = a;
        }
        localStorage.setItem('searchHistory', JSON.stringify(Nicolist.searchHistory));
    };
    Nicolist.handleVideoDrop = function (e) {
        var sel = e.pageX > $('#addVideoModal').outerWidth(true) / 2 ? '#title' : '#url';
        var data = e.dataTransfer.items || e.originalEvent.dataTransfer.items;
        for (var i = 0; i < data.length; i++) {
            if (data[i].kind !== 'string') {
                continue;
            }
            if (/^text\/plain/.test(data[i].type)) {
                data[i].getAsString(function (s) {
                    $(sel).val(s);
                    Nicolist.checkValidity();
                });
            }
            else if (/^text\/html/.test(data[i].type)) {
                data[i].getAsString(function (s) {
                    var m = s.match(/<[^><]+>[^><]*(?=<)/g);
                    var s2 = null;
                    if (m !== null) {
                        for (var j = 0, _jlen = m.length; j < _jlen; j++) {
                            if (/<span id="video-title"/.test(m[j])) {
                                s2 = m[j].replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
                                $('#title').val(s2);
                            }
                        }
                    }
                    if (s2 === null) {
                        var s2_1 = s.replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
                        $('#title').val(s2_1);
                    }
                    Nicolist.checkValidity();
                });
            }
            else if (/^text\/uri-list/.test(data[i].type)) {
                data[i].getAsString(function (s) {
                    $('#url').val(s);
                    Nicolist.checkValidity();
                });
            }
        }
        $(sel).removeClass('dragging');
    };
    Nicolist.registerEventListener = function () {
        $(window).on('unload', function () {
            Nicolist.unload();
        });
        $(window).scroll(function () {
            Nicolist.loadImgOnScreen('html, body', '#sr, #right');
        });
        $('#ccModal').scroll(function () {
            Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
        });
        NicolistPlayer.registerEventListener();
        $('input[type=checkbox]').on('change', function (e) {
            var id = $(e.currentTarget).attr('id');
            if (!Util.isNull(id)) {
                window.localStorage.setItem(id, $(e.currentTarget).prop('checked'));
            }
        });
        /* create copy / move videos */
        $('#nicolist_thumb_cc').on('change', function () {
            $('#ccvideos').find('.img-thumbnail').each(function (_i, elem) {
                $(elem).toggleClass('silent');
                Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
            });
        });
        $('#ccopen').on('click', function (e) {
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
            for (var genre in Nicolist.y) {
                var $genre_name = $('<p>', {
                    'click': function (e2) {
                        var $thisElem = $(e2.currentTarget);
                        var $genreVideosElem = $thisElem.next();
                        if ($genreVideosElem.hasClass('silent')) {
                            $genreVideosElem.removeClass('silent');
                            $thisElem.parent().find('.ccgenrename').each(function (i, elem) {
                                if ($(elem).attr('data-genre') !== $thisElem.attr('data-genre')) {
                                    $(elem).next().addClass('silent');
                                    $(elem).find('.cc_genre_indicator').text('-');
                                }
                            });
                            $thisElem.find('.cc_genre_indicator').text('+');
                            Nicolist.loadImgOnScreen('#ccModal', '#ccvideos');
                        }
                        else {
                            $genreVideosElem.addClass('silent');
                            $thisElem.find('.cc_genre_indicator').text('-');
                        }
                        return false;
                    },
                    'data-genre': genre,
                    'class': 'ccgenrename'
                });
                $genre_name.append($('<span>', {
                    text: '-',
                    'class': 'cc_genre_indicator mr-1'
                }));
                $genre_name.append($('<span>', {
                    text: genre
                }));
                $genre_name.append($('<span>', {
                    'data-count': '0',
                    'class': 'badge badge-pill badge-secondary2 ml-2'
                }));
                var $genre_videos = $('<div>', {
                    'class': 'silent'
                });
                var list = Nicolist.y[genre];
                if ($('#nicolist_sort').prop('checked')) {
                    list = Nicolist.reversePairList(list);
                }
                for (var i = 0, _len = list.length / 2; i < _len; i++) {
                    var id = list[2 * i];
                    var title = list[2 * i + 1];
                    var $genre_video_item = $('<div>', {
                        'class': 'd-flex flex-row align-items-center ccvideo',
                        'data-title': title,
                        'data-id': id,
                        'data-genre': genre,
                        'data-for': 'cc_genre_video',
                        'click': function (e3) {
                            var $thisElem = $(e3.currentTarget);
                            var $countElem = $thisElem.parent().prev().find('[data-count]');
                            var count = Util.int($countElem.attr('data-count'));
                            if ($thisElem.hasClass('alert-success')) {
                                $thisElem.removeClass('alert-success');
                                count--;
                            }
                            else {
                                $thisElem.addClass('alert-success');
                                count++;
                            }
                            $countElem.attr('data-count', count + '');
                            if (count === 0) {
                                $countElem.addClass('silent');
                            }
                            else {
                                $countElem.removeClass('silent');
                                $countElem.text(count + '');
                            }
                        }
                    });
                    var $img = Nicolist.createStayUnloadedTNI(id, false);
                    if (!$('#nicolist_thumb_cc').prop('checked')) {
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
        $('#ccnew').on('change', function (e) {
            var val = $('#ccnew').val() + '';
            localStorage.setItem('nicolist_ccnewval', val + '');
            if (val === 'copytoold' || val === 'movetoold') {
                $('#ccnewform').css('display', 'none');
                $('#ccoldform').css('display', 'block');
            }
            else {
                $('#ccnewform').css('display', 'block');
                $('#ccoldform').css('display', 'none');
            }
            if (val === 'copytoold' || val === 'copytoold') {
                $('#createcopy, #createcopy2').text('コピー');
            }
            else {
                $('#createcopy, #createcopy2').text('移動');
            }
        });
        $('#createcopy, #createcopy2').on('click', function () {
            var $cc_video_selected = $('#ccvideos').find('.alert-success[data-for=cc_genre_video]');
            if ($cc_video_selected.length === 0) {
                Nicolist.message('動画が選択されていません。', 'warning', '#ccalert');
                $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                return;
            }
            var mode = $('#ccnew').val() + '';
            if (mode === 'copytoold' || mode === 'movetoold') {
                var targetgenre_1 = $('#ccoldsel').val() + '';
                if (!Nicolist.y.hasOwnProperty(targetgenre_1)) {
                    Nicolist.message('ジャンルを選択してください。', 'warning', '#ccalert');
                    return;
                }
                var remove_cc_1 = mode === 'movetoold';
                var failcount_1 = 0;
                var successcount_1 = 0;
                var _y_1 = Util.copyObj(Nicolist.y);
                $cc_video_selected.each(function (_i, elem) {
                    var id = $(elem).attr('data-id');
                    var title = $(elem).attr('data-title');
                    if ($.inArray(id, _y_1[targetgenre_1]) === -1) {
                        _y_1[targetgenre_1].push(id);
                        _y_1[targetgenre_1].push(title);
                        if (remove_cc_1) {
                            var genre = $(elem).attr('data-genre');
                            var list2 = _y_1[genre];
                            var newlist = [];
                            for (var i = 0, _len = list2.length / 2; i < _len; i++) {
                                if (list2[2 * i] !== id) {
                                    newlist.push(list2[2 * i]);
                                    newlist.push(list2[2 * i + 1]);
                                }
                            }
                            _y_1[genre] = newlist;
                        }
                        successcount_1++;
                    }
                    else {
                        failcount_1++;
                    }
                });
                if (successcount_1 > 0) {
                    Nicolist.pushPrev();
                    Nicolist.y = _y_1;
                    var verb = remove_cc_1 ? '移動' : 'コピー';
                    Nicolist.messageUndoable(successcount_1 + "\u500B\u306E\u52D5\u753B\u3092\u300C" + targetgenre_1 + "\u300D\u306B" + verb + "\u3057\u307E\u3057\u305F"
                        + (failcount_1 > 0 ? " (" + failcount_1 + "\u500B\u306E\u52D5\u753B\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u305F\u3081" + verb + "\u3055\u308C\u307E\u305B\u3093)" : ''), 'success', null, 'vgs');
                    Nicolist.setSelGen(targetgenre_1);
                    Nicolist.refresh('gvs');
                    $('#ccModal').modal('hide');
                }
                else {
                    Nicolist.message("\u3059\u3079\u3066\u300C" + targetgenre_1 + "\u300D\u306B\u767B\u9332\u6E08\u307F\u306E\u52D5\u753B\u3067\u3059", 'warning', '#ccalert');
                    $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                    return;
                }
            }
            else if (mode === 'copytonew' || mode === 'movetonew') {
                var remove_cb_1 = mode === 'movetonew';
                var ccname = $('#ccname').val() + '';
                if (ccname === '') {
                    Nicolist.message('作成するジャンルの名前を入力してください。', 'warning', '#ccalert');
                    $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                    return;
                }
                else if (Nicolist.y.hasOwnProperty(ccname)) {
                    Nicolist.message('既に存在するジャンル名です。', 'warning', '#ccalert');
                    $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                    return;
                }
                else {
                    Nicolist.pushPrev();
                    var list_1 = [];
                    $cc_video_selected.each(function (_i, elem) {
                        var title = $(elem).attr('data-title');
                        var id = $(elem).attr('data-id');
                        if (remove_cb_1) {
                            var genre = $(elem).attr('data-genre');
                            var list2 = Nicolist.y[genre];
                            var newlist = [];
                            for (var i = 0, _len = list2.length / 2; i < _len; i++) {
                                if (list2[2 * i] !== id) {
                                    newlist.push(list2[2 * i]);
                                    newlist.push(list2[2 * i + 1]);
                                }
                            }
                            Nicolist.y[genre] = newlist;
                        }
                        if ($.inArray(id, list_1) === -1) {
                            list_1.push(id);
                            list_1.push(title);
                        }
                    });
                    Nicolist.y[ccname] = list_1;
                    var verb = remove_cb_1 ? '移動' : 'コピー';
                    Nicolist.messageUndoable("\u300C" + ccname + "\u300D\u306B" + list_1.length / 2 + "\u500B\u306E\u52D5\u753B\u3092" + verb + "\u3057\u307E\u3057\u305F", 'success', null, 'gvs');
                    Nicolist.setSelGen(ccname);
                    Nicolist.refresh('gvs');
                    $('#ccalert').html('');
                    $('#ccModal').modal('hide');
                    $('#ccname').val('');
                }
            }
        });
        /* end: create copy / move videos */
        $('#showAddGenre').on('click', function () {
            $('#genreModal').modal('show');
            $('#alert-genre').html('');
        });
        $('#randomFromAll').on('click', function () {
            Nicolist.randomFromAll();
        });
        $('#randomFromRight').on('click', function () {
            Nicolist.randomFromRight();
        });
        $('#favs').on('click', function (e) {
            if (!$(e.currentTarget).hasClass('disabled')) {
                Nicolist.showFavs();
            }
        });
        $('#nicolist_thumb').on('change', function () {
            Nicolist.refresh('v');
        });
        $('#nicolist_taggedtitle').on('change', function () {
            Nicolist.refresh('v');
        });
        $('#nicolist_sort').on('change', function () {
            Nicolist.refresh('v');
        });
        $('#nicolist_multitab').on('change', function () {
            $('#laert').fadeOut();
        });
        $('#openAddModal').on('click', function () {
            $('#alert-addvideo').html('');
            $('#addVideoModal').modal('show');
        });
        $('#click_action').on('change', function (e) {
            localStorage.setItem('nicolist_click_action', $(e.currentTarget).val() + '');
        });
        $('#openPref').on('click', function () {
            $('#nicolist_separator').removeClass('is-valid');
            $('#prefModal').modal('show');
        });
        $('#nicolist_separator').on('input', function () {
            localStorage.setItem('nicolist_separator', $('#nicolist_separator').val() + '');
            $('#nicolist_separator').addClass('is-valid');
        });
        $('#nicolist_ignore').on('input', function () {
            localStorage.setItem('nicolist_ignore', $('#nicolist_ignore').val() + '');
        });
        $('#body').on('dragstart', function (e) {
            e.originalEvent['dataTransfer'].clearData();
        });
        $('#body, #prefModal').on('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $('#body').on('drop', function (e) {
            e.preventDefault();
            var data = e.originalEvent['dataTransfer'].items || e.originalEvent['dataTransfer'].files;
            for (var i = 0; i < data.length; i++) {
                var flag = data[i].kind === 'file' && /json/.test(data[i].type);
                if (flag) {
                    Nicolist.fileToLoad = data[i].getAsFile();
                }
                /* for IE-11 */
                if (Util.isNull(data[i].kind)) {
                    flag = /\.json$/.test(data[i].name);
                    if (flag) {
                        Nicolist.fileToLoad = data[i];
                    }
                }
                if (flag) {
                    $('#rawFileName').text(Nicolist.fileToLoad.name);
                    $('#loadRawJson').removeClass('silent');
                    $('#dummyLoadRawJson').addClass('silent');
                    var _scrollToRawInput = function () {
                        $('#prefModal').stop().animate({ scrollTop: $('#loadRawJson').offset().top }, 1400, function () {
                            $('#prefModal').off('shown.bs.modal', _scrollToRawInput);
                        });
                    };
                    $('#prefModal').on('shown.bs.modal', _scrollToRawInput);
                    $('#prefModal').modal('show');
                    break;
                }
                else if (data[i].kind === 'string') {
                    $('#addVideoModal').modal('show');
                    Nicolist.handleVideoDrop(e);
                    break;
                }
            }
        });
        $('#prefModal').on('drop', function (e) {
            e.preventDefault();
            var data = e.originalEvent['dataTransfer'].items || e.originalEvent['dataTransfer'].files;
            for (var i = 0; i < data.length; i++) {
                var flag = data[i].kind === 'file' && /json/.test(data[i].type);
                if (flag) {
                    Nicolist.fileToLoad = data[i].getAsFile();
                }
                /* for IE-11 */
                if (Util.isNull(data[i].kind)) {
                    flag = /\.json$/.test(data[i].name);
                    if (flag) {
                        Nicolist.fileToLoad = data[i];
                    }
                }
                if (flag) {
                    Nicolist.fileToLoad = data[i].getAsFile();
                    $('#rawFileName').text(Nicolist.fileToLoad.name);
                    $('#loadRawJson').removeClass('silent');
                    $('#dummyLoadRawJson').addClass('silent');
                }
            }
        });
        $('#addVideoModal').on('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.pageX > $('body').outerWidth(true) / 2) {
                $('#title').addClass('dragging');
                $('#url').removeClass('dragging');
            }
            else {
                $('#url').addClass('dragging');
                $('#title').removeClass('dragging');
            }
        });
        $('#addVideoModal').on('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('#url, #title').removeClass('dragging');
        });
        $('#addVideoModal').on('drop', function (e) {
            e.preventDefault();
            Nicolist.handleVideoDrop(e);
        });
        $('#url, #title').on('input', function (e) {
            Nicolist.checkValidity();
        });
        $('body').on('click', function (e) {
            if (Nicolist.showingMenu) {
                Nicolist.closeMenu();
            }
            $('#history').css('display', 'none');
        });
        $('#menu').on('click', function (e) {
            e.stopPropagation();
        });
        $('#addgenre').on('click', function (e) {
            e.stopPropagation();
            if (Nicolist.addGenre($('#genrename').val())) {
                Nicolist.setSelGen($('#genrename').val());
                $('#genreModal').modal('hide');
                $('#genrename').val('');
                Nicolist.refresh('gs');
            }
            else {
                $('#genrename').blur();
                $('#genrename').focus();
            }
        });
        $('#genrename').on("keypress", function (e) {
            if (e.keyCode === 13) { // Enter
                e.preventDefault();
                e.stopPropagation();
                if (Nicolist.addGenre($('#genrename').val())) {
                    Nicolist.setSelGen($('#genrename').val());
                    $('#genreModal').modal('hide');
                    $('#genrename').val('');
                    Nicolist.refresh('gs');
                }
                else {
                    $('#genrename').blur();
                    $('#genrename').focus();
                }
            }
        });
        $('#button').on('click', function (e) {
            Nicolist.sub();
        });
        $('#genreModal').on('shown.bs.modal', function () {
            $('#genrename').focus();
        });
        $('#saveEdit').on('click', function (e) {
            var id = $('#editUrl').text();
            var title = $('#editTitle').val() + '';
            var genre = $('#editGenre').val() + '';
            var oldtitle = $(e.currentTarget).attr('data-title');
            var oldgenre = $(e.currentTarget).attr('data-genre');
            if (title === '') {
                Nicolist.message('タイトルが空欄です', 'warning', '#emalert');
                $('#editTitle').addClass('is-invalid');
            }
            else if (genre === '') {
                Nicolist.message('ジャンルが正しく選択されていません', 'warning', '#emalert');
                $('#editGenre').addClass('is-invalid');
            }
            else if (title === oldtitle && genre === oldgenre) {
                Nicolist.message('変更なしになっています', 'warning', '#emalert');
                $('#editTitle').addClass('is-invalid');
                $('#editGenre').addClass('is-invalid');
                //} else if ($.inArray(id, y[genre]) !== -1){
                //Nicolist.message('既に移動先のジャンルに登録されている動画です', 'warning', '#emalert');
            }
            else {
                var mesElem = $('<div>');
                var table = $('<table>', { 'class': 'mb-4' });
                var tr1 = $('<tr>');
                tr1.append($('<td>', { text: 'タイトル: ' }));
                var td1 = $('<td>');
                td1.append($('<strong>', { text: title }));
                if (oldtitle === title) {
                    td1.append($('<span>', { text: ' (変更なし)' }));
                }
                td1.appendTo(tr1);
                tr1.appendTo(table);
                if (oldtitle !== title) {
                    var tr2 = $('<tr>', { 'class': 'gray' });
                    tr2.append($('<td>', { text: '変更前: ' }));
                    tr2.append($('<td>', { text: oldtitle }));
                    tr2.appendTo(table);
                }
                var tr3 = $('<tr>');
                tr3.append($('<td>', { text: 'ジャンル: ', 'class': 'confirmedit' }));
                var td2 = $('<td>', { 'class': 'confirmedit' });
                td2.append($('<strong>', { text: genre }));
                if (oldgenre === genre) {
                    td2.append($('<span>', { text: ' (変更なし)' }));
                }
                td2.appendTo(tr3);
                tr3.appendTo(table);
                if (oldgenre !== genre) {
                    var tr4 = $('<tr>', { 'class': 'gray' });
                    tr4.append($('<td>', { text: '変更前: ' }));
                    tr4.append($('<td>', { text: oldgenre }));
                    tr4.appendTo(table);
                }
                mesElem.append(table);
                mesElem.append($('<span>', { text: '変更を保存しますか?' }));
                Nicolist.confAvoidable(mesElem, function () {
                    var _y = Util.copyObj(Nicolist.y);
                    var list = _y[oldgenre];
                    var newlist = [];
                    for (var i = 0; i < list.length / 2; i++) {
                        if (list[2 * i] !== id) {
                            newlist.push(list[2 * i]);
                            newlist.push(list[2 * i + 1]);
                        }
                        else if (oldgenre === genre) {
                            newlist.push(id);
                            newlist.push(title);
                        }
                    }
                    _y[oldgenre] = newlist;
                    if (oldgenre !== genre) {
                        _y[genre].push(id);
                        _y[genre].push(title);
                    }
                    Nicolist.pushPrev();
                    Nicolist.y = _y;
                    Nicolist.messageUndoable('動画「' + title + '」の動画情報を更新しました', 'info', null, 'v');
                    Nicolist.refresh('v');
                    $('#editModal').modal('hide');
                });
            }
        });
        $('#editModal').on('hidden.bs.modal', function () {
            $('#editTitle').removeClass('is-invalid');
            $('#editGenre').removeClass('is-invalid');
            $('#emalert').html('');
        });
        $('#nicolist_historyCount').on('change', function (e) {
            var sh = Util.int($(e.currentTarget).val());
            if (!isNaN(sh) && sh > 0) {
                localStorage.setItem('nicolist_historyCount', sh + '');
            }
        });
        /**
         * max search count
         */
        $('#nicolist_msc').on('change', function (e) {
            var sh2 = Util.int($(e.currentTarget).val());
            if (!isNaN(sh2) && sh2 > 0) {
                localStorage.setItem('nicolist_msc', sh2 + '');
            }
        });
        $('#nicolist_loop').on('change', function () {
            if ($('#play iframe').length !== 0) {
                if ($('#nicolist_loop').prop('checked')) {
                    $('#pcloop img').attr('src', LOOP_DATA_URL);
                    $('#pcloop').attr('title', 'ループ再生を解除');
                }
                else {
                    $('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
                    $('#pcloop').attr('title', 'ループ再生');
                }
                Util.registerTooltip($('#pcloop'));
                NicolistPlayer.refreshController();
            }
        });
        $('#nicolist_cinematic').on('change', function () {
            if ($('#play iframe').length !== 0) {
                if ($('#nicolist_cinematic').prop('checked')) {
                    $('#pcwidth img').attr('src', NARROW_DATA_URL);
                    $('#pcwidth').attr('title', '固定サイズで表示');
                }
                else {
                    $('#pcwidth img').attr('src', WIDEN_DATA_URL);
                    $('#pcwidth').attr('title', 'ワイド画面で表示');
                }
                Util.registerTooltip($('#pcwidth'));
                NicolistPlayer.refreshController();
            }
            NicolistPlayer.videoResize();
        });
        $('#searchQuery').on('focus', function (e) {
            if (Nicolist.searchHistory.length === 0)
                return;
            $('#history').html('');
            for (var i = 0; i < Nicolist.searchHistory.length; i++) {
                var item = Nicolist.searchHistory[i];
                $('<a>', {
                    text: item,
                    'class': 'dropdown-item pointer',
                    click: function (e2) {
                        $('#searchQuery').val($(e2.currentTarget).text());
                        Nicolist.search($('#searchQuery').val());
                    }
                }).appendTo('#history');
            } //i
            $('#history').css({
                'min-width': $(e.currentTarget).outerWidth() + 'px',
                'display': 'inline-block',
                'top': $(e.currentTarget).offset().top + $(e.currentTarget).outerHeight(),
                'left': $(e.currentTarget).offset().left
            });
        });
        $('#searchQuery').on('click', function (e) {
            e.stopPropagation();
        });
        $('#searchQuery').on('keypress', function (e) {
            if (e.keyCode === 13) { //enter
                Nicolist.search($('#searchQuery').val());
                $('#searchQuery').blur();
                $('#history').css('display', 'none');
            }
        });
        $('#search').on('click', function (e) {
            Nicolist.search($('#searchQuery').val());
        });
        $('#sgopen').on('click', function () {
            $('#sggenre').html('');
            var gs = Object.keys(Nicolist.y);
            for (var i = 0; i < gs.length; i++) {
                var g = gs[i];
                var div = $('<div>', {
                    'class': 'sggwrapper ' + (i != 0 ? 'sgtarget' : '')
                }).append($('<div>', {
                    text: g,
                    'class': 'sgg ' + (i != 0 ? '' : 'sgdef')
                }));
                $('#sggenre').append(div);
            } //i
            $('#genreSortModal').modal('show');
            Sortable.create($('#sggenre').get(0), {
                draggable: '.sgtarget',
                animation: 300
            });
        });
        $('#submitGenreSort, #submitGenreSort2').on('click', function () {
            Nicolist.pushPrev();
            var _y = {};
            $('.sgg').each(function (i, elem) {
                var g = $(elem).text();
                _y[g] = Nicolist.y[g];
            });
            Nicolist.y = _y;
            Nicolist.refresh('g');
            Nicolist.messageUndoable('ジャンルを並び替えしました', 'success', null, 'g');
            $('#genreSortModal').modal('hide');
        });
        $('#issueRaw').on('click', function () {
            var d = new Date();
            Util.saveAsFile('backup_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '.json', JSON.stringify(Nicolist.y));
        });
        $('#fromRawFile').on('change', function (e) {
            $('#loadrawalert').html('');
            var files = e.target['files'];
            if (!files || files.length !== 1) {
                Nicolist.message('正しいファイルを選択してください', 'warning', '#loadrawalert');
                return;
            }
            if (!/json/.test(files[0].type)) {
                Nicolist.message('jsonファイルを選択してください', 'warning', '#loadrawalert');
                return;
            }
            Nicolist.fileToLoad = files[0];
            $('#rawFileName').text(Nicolist.fileToLoad.name);
            $('#loadRawJson').removeClass('silent');
            $('#dummyLoadRawJson').addClass('silent');
        });
        $('#loadRawJson').on('click', function () {
            if (Nicolist.fileToLoad) {
                var reader = new FileReader();
                reader.readAsText(Nicolist.fileToLoad);
                reader.onload = function () {
                    try {
                        if (reader.result instanceof ArrayBuffer) {
                            var toload = JSON.parse(reader.result.toString());
                        }
                        else {
                            var toload = JSON.parse(reader.result);
                        }
                    }
                    catch (e) {
                        Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
                        return;
                    }
                    var videocount = 0;
                    var genrecount = 0;
                    if ($.type(toload) !== 'object') {
                        Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
                        return;
                    }
                    var _y = Util.copyObj(Nicolist.y);
                    var _tkeys = Object.keys(toload);
                    for (var j = 0; j < _tkeys.length; j++) {
                        var genre = _tkeys[j];
                        var list = toload[genre];
                        if ($.type(list) !== 'array') {
                            Nicolist.message('フォーマットが正しくありません', 'warning', '#loadrawalert');
                            return;
                        }
                        for (var i = 0; i < list.length / 2; i++) {
                            var id = list[2 * i];
                            var title = list[2 * i + 1];
                            if (!_y.hasOwnProperty(genre)) {
                                _y[genre] = [];
                                genrecount++;
                            }
                            if ($.inArray(id, _y[genre]) === -1) {
                                _y[genre].push(id);
                                _y[genre].push(title);
                                videocount++;
                            }
                        }
                    } //j
                    if (videocount === 0 && genrecount === 0) {
                        Nicolist.message('すべて登録済みの動画です', 'warning', '#loadrawalert');
                    }
                    else {
                        Nicolist.pushPrev();
                        Nicolist.y = _y;
                        Nicolist.messageUndoable('JSONから' + (videocount > 0 ? videocount + '個の動画' : '') + (genrecount > 0 && videocount > 0 ? '、' : '') + (genrecount > 0 ? genrecount + '個のジャンル' : '') + 'を新たに読み込みました', 'success', null, (genrecount > 0 ? 'g' : '') + (videocount > 0 ? 'v' : ''));
                        Nicolist.refresh((genrecount > 0 ? 'g' : '') + (videocount > 0 ? 'v' : ''));
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
    };
    Nicolist.init = function () {
        NicolistPlayer.showFavbutton = true;
        Nicolist.registerEventListener();
        // if the browser don't support local storage
        if (Util.isNull(localStorage)) {
            if (!Util.isNull(document.cookie)) {
                var Storage_1 = /** @class */ (function () {
                    function Storage() {
                        var _this = this;
                        this.data = {};
                        this.length = 0;
                        this.getItem = function (key) {
                            return _this.data[key];
                        };
                        this.setItem = function (key, val) {
                            if (key !== null) {
                                if (!_this.data.hasOwnProperty(key)) {
                                    _this.length++;
                                }
                                var _d = new Date();
                                _d.setTime(Date.now() + 114514 * 60 * 1000); //almost 13 years
                                document.cookie = 'ls_' + escape(key) + '=' + escape(val) + '; expires=' + _d.toUTCString() + '; path=/';
                                _this.data[key] = val;
                            }
                        };
                        this.removeItem = function (key) {
                            if (key !== null) {
                                document.cookie = 'ls_' + escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                                if (_this.data.hasOwnProperty(key)) {
                                    _this.length--;
                                    delete _this.data[key];
                                }
                            }
                        };
                        this.clear = function () {
                            _this.data = {};
                            _this.length = 0;
                        };
                        this.key = function (i) {
                            return Object.keys(_this.data)[i];
                        };
                        this.length = 0;
                        this.data = {};
                        var _s = document.cookie.match(/ls_[^=;]+=[^;=]*/g);
                        if (_s !== null) {
                            for (var i = 0; i < _s.length; i++) {
                                var _t = _s[i].split(/=/);
                                this.data[unescape(_t[0].substring(3))] = _t[1];
                            }
                        }
                    }
                    return Storage;
                }());
                localStorage = new Storage_1();
                if (document.cookie === '') {
                    // first visit
                    Nicolist.message('お使いのブラウザはローカルストレージをサポートしていないため、代わりにcookieを使用してデータを保存しています。', 'warning');
                }
            }
            else {
                Nicolist.message('ローカルストレージ・Cookieが利用できないためデータを保存することができません。', 'danger', null, true);
            }
        }
        if (Nicolist.islocal) {
            $('#local_indicator').removeClass('silent');
        }
        Nicolist.initDataFromLS();
        Util.registerTooltip($('#controller span[title]'));
        Nicolist.refresh('vgs');
    };
    Nicolist.initDataFromLS = function () {
        $('input[type=checkbox]').each(function (i, elem) {
            var id = $(elem).attr('id');
            if (!Util.isNull(id)) {
                var bool = window.localStorage.getItem(id);
                if (bool === 'true') {
                    $(elem).prop('checked', true);
                }
                else if (bool) {
                    $(elem).prop('checked', false);
                }
            }
        });
        Util.getLS('nicolist_separator', function (ls) {
            $('#nicolist_separator').val(ls);
        }, function () {
            $('#nicolist_separator').val(Nicolist.SEP_DEF_VAL);
        });
        Util.getLS('nicolist_ignore', function (ls) {
            $('#nicolist_ignore').val(ls);
        }, function () {
            $('#nicolist_ignore').val(Nicolist.IGN_DEF_VAL);
        });
        Util.getLS('nicolist_click_action', function (ls) {
            if (ls !== '') {
                $('#click_action').val(ls);
            }
        });
        Util.getLSInt('_nicolistTabCount', function (ls) {
            if (!$('#nicolist_multitab').prop('checked')) {
                var errorspan = $('<span>');
                $('<span>', {
                    text: '正しく終了されませんでしたか？',
                    'class': 'undo ml-1 mr-1',
                    'click': function () {
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
                    'click': function () {
                        $('#nicolist_multitab').prop('checked', true);
                        localStorage.setItem('nicolist_multitab', 'true');
                        $('#laert').fadeOut('slow', Nicolist.refreshStyle);
                    }
                }).appendTo(errorspan);
                Nicolist.message('複数タブで同時に閲覧している可能性があります。', 'danger', null, true, errorspan);
            }
            localStorage.setItem('_nicolistTabCount', (ls + 1) + '');
        }, function () {
            localStorage.setItem('_nicolistTabCount', '1');
        });
        Util.getLS('nicolist', function (ls) {
            try {
                ls = JSON.parse(ls);
                if (typeof ls !== 'object') {
                    throw new Error('JSON syntax error'); //wont happen
                }
                Nicolist.y = ls;
            }
            catch (e) {
                console.error("JSON Systax Error: " + ls + " is not a json");
                console.error(e);
            }
        });
        Util.getLS('selectedGenre', function (ls) {
            Nicolist.setSelGen(ls);
        }, function () {
            if (Object.keys(Nicolist.y).length > 0) {
                Nicolist.setSelGen(Object.keys(Nicolist.y)[0]); //wont happen
            }
        });
        Util.getLS('nicolist_ccnewval', function (ls) {
            $('#ccnew').val(ls);
            if (ls === 'copytoold' || ls === 'movetoold') {
                $('#ccnewform').css('display', 'none');
                $('#ccoldform').css('display', 'block');
            }
            else {
                $('#ccnewform').css('display', 'block');
                $('#ccoldform').css('display', 'none');
            }
            if (ls === 'copytoold' || ls === 'copytoold') {
                $('#createcopy, #createcopy2').text('コピー');
            }
            else {
                $('#createcopy, #createcopy2').text('移動');
            }
        });
        Util.getLS('searchHistory', function (ls) {
            try {
                Nicolist.searchHistory = JSON.parse(ls);
                if ($.type(Nicolist.searchHistory) !== 'array') {
                    Nicolist.searchHistory = [];
                }
            }
            catch (e) {
                console.error("JSON Systax Error: " + ls + " is not a json");
                console.error(e);
            }
        });
        Util.getLSInt('nicolist_historyCount', function (ls) {
            $('#nicolist_historyCount').val(ls);
        });
        Util.getLS('nicolist_msc', function (ls) {
            $('#nicolist_msc').val(ls);
        });
        Util.getLS('nicolist_deleted', function (ls) {
            try {
                NicolistPlayer.deletedVideoArray = JSON.parse(ls);
                if ($.type(NicolistPlayer.deletedVideoArray) !== 'array') {
                    NicolistPlayer.deletedVideoArray = [];
                }
            }
            catch (e) {
                console.error("JSON Systax Error: " + ls + " is not a json");
                console.error(e);
            }
        });
        Util.getLS('nicolist_star', function (ls) {
            try {
                Nicolist.starred = JSON.parse(ls);
                if ($.type(Nicolist.starred) !== 'array') {
                    Nicolist.starred = [];
                }
            }
            catch (e) {
                console.error("JSON Systax Error: " + ls + " is not a json");
                console.error(e);
            }
        });
        Util.getLS('nicolist_volumemap', function (ls) {
            try {
                ls = JSON.parse(ls);
                if ($.type(ls) === 'object') {
                    NicolistPlayer.volumemap = ls;
                }
            }
            catch (e) {
                console.error("JSON Systax Error: " + ls + " is not a json");
                console.error(e);
            }
        });
    };
    Nicolist.unload = function () {
        var tabs = Util.int(localStorage.getItem('_nicolistTabCount'));
        if (tabs === 1) {
            localStorage.removeItem('_nicolistTabCount');
        }
        else if (tabs >= 2) {
            localStorage.setItem('_nicolistTabCount', (tabs - 1) + '');
        }
    };
    Nicolist.refresh = function (whatChanged) {
        if (!Nicolist.y.hasOwnProperty(Nicolist.selectedGenre)) {
            Nicolist.setSelGen('とりあえず');
        }
        var videoChanged = whatChanged.indexOf('v') !== -1;
        var genreChanged = whatChanged.indexOf('g') !== -1;
        var selectChanged = whatChanged.indexOf('s') !== -1;
        if (selectChanged) {
            if ($('#favs li').hasClass('selected')) {
                $('#favs li').removeClass('selected');
            }
            Nicolist.refreshFavsLeft();
        }
        if (selectChanged || genreChanged) {
            //genreのselectの更新
            //#leftの更新
            $("select[role='genre']").html('');
            $('#left').html('');
            var _loop_1 = function (genre) {
                //select更新
                $("select[role='genre']").each(function (i, elem) {
                    $(elem).append($('<option>', {
                        'value': genre,
                        text: genre
                    }));
                });
                //#left更新
                $('<li>', {
                    'class': (genre === Nicolist.selectedGenre ? 'list-group-item selected' : 'list-group-item'),
                    text: genre,
                    click: function (e) {
                        var genre2 = $(e.currentTarget).text();
                        Nicolist.setSelGen(genre2);
                        Nicolist.refresh('s');
                    }
                }).appendTo("#left");
            };
            for (var genre in Nicolist.y) {
                _loop_1(genre);
            }
            $('select[role="genre"]').val(Nicolist.selectedGenre);
        }
        if (selectChanged || genreChanged || videoChanged) {
            //#rightの更新
            $("#right").html('');
            if ($('#favs li').hasClass('selected')) {
                Nicolist.showFavs();
            }
            else {
                var displayThumb = $('#nicolist_thumb').prop('checked');
                if (Nicolist.selectedGenre === 'とりあえず') {
                    $("<h4>", {
                        text: Nicolist.selectedGenre
                    }).append($('<small>', {
                        'class': 'text-muted ml-2',
                        text: '(' + (Nicolist.y[Nicolist.selectedGenre].length / 2) + ')'
                    })).appendTo("#right");
                }
                else {
                    $("<h4>", {
                        text: Nicolist.selectedGenre
                    }).append($('<small>', {
                        'class': 'text-muted ml-2 mr-1',
                        text: '(' + (Nicolist.y[Nicolist.selectedGenre].length / 2) + ')'
                    })).append($('<small>', {
                        'class': 'removevideo',
                        'data-genre': Nicolist.selectedGenre,
                        'title': 'ジャンルを削除',
                        text: '×',
                        click: function (e2) {
                            Nicolist.removeGenre($(e2.currentTarget));
                        }
                    })).appendTo('#right');
                }
                var list = Nicolist.y[Nicolist.selectedGenre];
                if ($('#nicolist_sort').prop('checked')) {
                    list = Nicolist.reversePairList(list);
                }
                var startLazyLoad = Math.ceil($(window).height() / 68);
                for (var i = 0; i < list.length / 2; i++) {
                    var id = list[2 * i];
                    var title = list[2 * i + 1];
                    var div = Nicolist.rightVideoElem(id, title, Nicolist.selectedGenre, (i > startLazyLoad));
                    div.appendTo("#right");
                } //i
            }
        }
        if (genreChanged || videoChanged) {
            $('#out').val(JSON.stringify(Nicolist.y, null, '    '));
            localStorage.setItem('nicolist', JSON.stringify(Nicolist.y));
            $('#length').text('(' + Nicolist.sizeString(Util.bytesize(JSON.stringify(Nicolist.y))) + ')');
            if ($('#sr').html() !== '') {
                Nicolist.search(Nicolist.searchHistory[0]);
            }
        }
    };
    Nicolist.refreshFavsLeft = function () {
        if (Nicolist.starred.length > 0) {
            $('#favs').removeClass('disabled');
        }
        else {
            $('#favs').addClass('disabled');
        }
        $('#favlen').text((Nicolist.starred.length / 2) + '');
    };
    Nicolist.showFavs = function () {
        $('#left .selected').removeClass('selected');
        $('#favs li').addClass('selected');
        Nicolist.constructRightFav();
    };
    Nicolist.constructRightFav = function () {
        $("#right").html('');
        var displayThumb = $('#nicolist_thumb').prop('checked');
        $("<h4>", {
            text: 'お気に入り'
        }).append($('<small>', {
            text: '×',
            'class': 'removevideo',
            'title': 'お気に入りをクリア',
            'click': function () {
                Nicolist.confirm('お気に入りをクリアしますか?', function () {
                    Nicolist.starred = [];
                    Nicolist.refreshFavsLeft();
                    if ($('#play').html() !== '') {
                        NicolistPlayer.refreshController();
                    }
                    $('.favIcon').each(function (_i, elem) {
                        $(elem).attr('src', UNSTAR_DATA_URL);
                    });
                    Nicolist.refresh('s');
                    localStorage.setItem('nicolist_star', JSON.stringify(Nicolist.starred));
                });
            }
        })).appendTo("#right");
        var list = Nicolist.starred;
        if ($('#nicolist_sort').prop('checked')) {
            list = Nicolist.reversePairList(list);
        }
        var startLazyLoad = Math.ceil($(window).height() / 68);
        for (var i = 0; i < list.length / 2; i++) {
            var id = list[2 * i];
            var title = list[2 * i + 1];
            var div = Nicolist.rightVideoElem(id, title, '', (i > startLazyLoad));
            div.appendTo('#right');
        } //i
    };
    Nicolist.toggleFav = function (id, title) {
        var starIndex = -1;
        for (var j = 0; j < Nicolist.starred.length; j += 2) {
            var stId = Nicolist.starred[j];
            if (stId === id) {
                starIndex = j;
                break;
            }
        }
        if (starIndex === -1) {
            Nicolist.starred.push(id);
            Nicolist.starred.push(title);
            $('.favIcon[data-id=' + id + ']').each(function (_i, elem) {
                $(elem).attr('src', STAR_DATA_URL);
                Nicolist.startStarAnimation($(elem));
            });
            if ($('#favs li').hasClass('selected')) {
                if ($('#right a[data-id=' + id + ']').length === 0) {
                    if ($('#nicolist_sort').prop('checked')) {
                        Nicolist.rightVideoElem(id, title, '', false).insertAfter('#right h4');
                    }
                    else {
                        $('#right').append(Nicolist.rightVideoElem(id, title, '', false));
                    }
                }
            }
            return true;
        }
        else {
            Nicolist.starred.splice(starIndex, 2);
            $('.favIcon[data-id=' + id + ']').each(function (_i, elem) {
                $(elem).attr('src', UNSTAR_DATA_URL);
            });
            return false;
        }
    };
    Nicolist.rightVideoElem = function (id, title, genre, lazyload) {
        var div = $('<div>', {
            'class': 'd-flex flex-row align-items-center'
        });
        var favIcon = Nicolist.createFavIcon(id, title);
        var a = $("<a>", {
            "href": Nicolist.getVideoURL(id),
            'target': '_blank',
            'data-genre': genre,
            'data-id': id,
            'data-title': title,
            'class': 'rightvideo',
            'contextmenu': function (e) {
                Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'right');
                return false;
            },
            'click': function (e2) {
                if ($('#click_action').val() !== 'official') {
                    e2.preventDefault();
                }
                Nicolist.openVideo($(e2.currentTarget), 'right');
            }
        });
        div.append(favIcon);
        if (!$('#nicolist_thumb').prop('checked')) {
            div.addClass('mb-2');
        }
        if ($('#nicolist_thumb').prop('checked')) {
            if (lazyload) {
                a.append(Nicolist.createStayUnloadedTNI(id, false));
            }
            else {
                a.append(Nicolist.createThumbImgElem(id, false));
            }
        }
        if ($('#nicolist_taggedtitle').prop('checked')) {
            var _ma = title.match(/【[^【】]+】/g); //【】
            var _mb = title.match(/\[[^\[\]]+\]/g); //[]
            var tags = [];
            var converted_title = title;
            if (_ma !== null) {
                for (var j = 0; j < _ma.length; j++) {
                    tags.push(_ma[j]);
                }
                converted_title = converted_title.replace(/【[^【】]+】/g, '');
            }
            if (_mb !== null) {
                for (var j = 0; j < _mb.length; j++) {
                    tags.push(_mb[j]);
                }
                converted_title = converted_title.replace(/\[[^\[\]]+\]/g, '');
            }
            converted_title = converted_title.replace(/^\s+/g, '').replace(/\s+$/g, '');
            a.append($('<span>', {
                text: converted_title,
                'class': 'mr-2'
            }));
            a.appendTo(div);
            for (var j = 0; j < tags.length; j++) {
                div.append($('<span>', {
                    text: tags[j].slice(1, -1),
                    'class': 'titletag ml-1',
                    'click': function (e) {
                        $('#search').val($(e.currentTarget).text());
                        Nicolist.search($(e.currentTarget).text());
                        var _s = $('#sr').offset().top - 16;
                        if (_s < $('html,body').scrollTop()) {
                            $('html,body').stop().animate({ scrollTop: _s }, 'swing');
                        }
                    }
                }));
            } //j
        }
        else {
            a.append($('<span>', {
                text: title
            }));
            a.appendTo(div);
        }
        return div;
    };
    Nicolist.openVideo = function ($elem, mode) {
        var id = $elem.attr('data-id');
        var title = $elem.attr('data-title');
        var genre = $elem.attr('data-genre');
        var caval = $('#click_action').val();
        if (caval === 'thispage') {
            $('#play').html('');
            NicolistPlayer.playindex = 0;
            NicolistPlayer.playlist = [id];
            NicolistPlayer.playlistTitleMap = {};
            NicolistPlayer.playlistTitleMap[id] = title;
            if (Nicolist.islocal) {
                window.open(Util.domain + '/player.html?pl=' + escape(JSON.stringify(NicolistPlayer.playlist)) + '&i=' + NicolistPlayer.playindex);
            }
            else {
                NicolistPlayer.createEmbedElem();
                NicolistPlayer.refreshController();
            }
        }
        else if (caval === 'cont' || caval === 'randomcont') {
            $('#play').html('');
            if (mode === 'right') {
                NicolistPlayer.playlist = [];
                NicolistPlayer.playlistTitleMap = {};
                $('#right a[data-id]').each(function (_i, elem2) {
                    var rvid = $(elem2).attr('data-id');
                    NicolistPlayer.playlist.push(rvid);
                    NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                });
            }
            else if (mode === 'random') {
                NicolistPlayer.playlist = [];
                NicolistPlayer.playlistTitleMap = {};
                $('#randomVideo a[data-id]').each(function (_i, elem2) {
                    var rvid = $(elem2).attr('data-id');
                    NicolistPlayer.playlist.push(rvid);
                    NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                });
            }
            else if (mode === 'search') {
                NicolistPlayer.playlist = [];
                NicolistPlayer.playlistTitleMap = {};
                $('#sr a[data-id]').each(function (_i, elem2) {
                    var svid = $(elem2).attr('data-id');
                    NicolistPlayer.playlist.push(svid);
                    NicolistPlayer.playlistTitleMap[svid] = $(elem2).attr('data-title');
                });
            }
            else {
                //wont happen
                return;
            }
            if (caval === 'randomcont') {
                NicolistPlayer.playlist = Util.shuffle(NicolistPlayer.playlist, id);
            }
            NicolistPlayer.playindex = $.inArray(id, NicolistPlayer.playlist);
            if (NicolistPlayer.playindex === -1) {
                NicolistPlayer.playindex = 0;
            }
            if (Nicolist.islocal) {
                window.open(Util.domain + '/player.html?pl=' + escape(JSON.stringify(NicolistPlayer.playlist)) + '&i=' + NicolistPlayer.playindex);
            }
            else {
                NicolistPlayer.createEmbedElem();
                NicolistPlayer.refreshController();
            }
            $('html,body').stop().animate({ scrollTop: 0 }, 'swing');
        }
    };
    Nicolist.sizeString = function (byte) {
        if (byte < 500) {
            return byte + " byte";
        }
        else if (byte < 500000) {
            var a = Math.round(byte * 100 / 1024) / 100;
            return a + " KB";
        }
        else if (byte < 500000000) {
            var a = Math.round((byte * 100 / 1024) / 1024) / 100;
            return a + " MB";
        }
        else {
            var a = Math.round(((byte * 100 / 1024) / 1024) / 1024) / 100;
            return a + " GB";
        }
    };
    Nicolist.showMenu = function (coord_x, coord_y, cont, mode) {
        var id = cont.attr('data-id');
        var genre = cont.attr('data-genre');
        var title = cont.attr('data-title');
        var url = cont.attr('href');
        $("#menu").children('a').each(function (i, elem) {
            var role = $(elem).attr('role');
            if (role === 'title') {
                if (url) {
                    $(elem).html('');
                    var anc = $('<a>', {
                        'href': url,
                        text: title,
                        'target': '_blank'
                    });
                    $(elem).append(anc);
                }
                else {
                    $(elem).text(title);
                }
            }
            else if (role === 'remove') {
                if (genre) {
                    $(elem).on('click', function () {
                        Nicolist.removeVideo(cont);
                        Nicolist.closeMenu();
                    });
                    if ($(elem).hasClass('disabled')) {
                        $(elem).removeClass('disabled');
                    }
                }
                else {
                    if (!$(elem).hasClass('disabled')) {
                        $(elem).addClass('disabled');
                    }
                }
            }
            else if (role === 'edit') {
                if (genre) {
                    $(elem).on('click', function () {
                        var _id = cont.attr('data-id');
                        var _title = cont.attr('data-title');
                        var _genre = cont.attr('data-genre');
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
                }
                else {
                    $(elem).addClass('disabled');
                }
            }
            else if (role === 'play') {
                $(elem).on('click', function () {
                    $('#play').html('');
                    NicolistPlayer.playindex = 0;
                    NicolistPlayer.playlist = [id];
                    NicolistPlayer.playlistTitleMap = {};
                    NicolistPlayer.playlistTitleMap[id] = title;
                    if (Nicolist.islocal) {
                        window.open(Util.domain + '/player.html?pl=' + escape(JSON.stringify(NicolistPlayer.playlist)) + '&i=' + NicolistPlayer.playindex);
                    }
                    else {
                        NicolistPlayer.createEmbedElem();
                        NicolistPlayer.refreshController();
                    }
                    Nicolist.closeMenu();
                });
            }
            else if (role === 'playall' || role === 'playall-random') {
                $(elem).on('click', function () {
                    $('#play').html('');
                    if (mode === 'right') {
                        $(elem).removeClass('disabled');
                        NicolistPlayer.playlist = [];
                        NicolistPlayer.playlistTitleMap = {};
                        $('#right a[data-id]').each(function (_i, elem2) {
                            var rvid = $(elem2).attr('data-id');
                            NicolistPlayer.playlist.push(rvid);
                            NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                        });
                    }
                    else if (mode === 'random') {
                        $(elem).removeClass('disabled');
                        NicolistPlayer.playlist = [];
                        NicolistPlayer.playlistTitleMap = {};
                        $('#randomVideo a[data-id]').each(function (_i, elem2) {
                            var rvid = $(elem2).attr('data-id');
                            NicolistPlayer.playlist.push(rvid);
                            NicolistPlayer.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                        });
                    }
                    else if (mode === 'search') {
                        $(elem).removeClass('disabled');
                        NicolistPlayer.playlist = [];
                        NicolistPlayer.playlistTitleMap = {};
                        $('#sr a[data-id]').each(function (_i, elem2) {
                            var svid = $(elem2).attr('data-id');
                            NicolistPlayer.playlist.push(svid);
                            NicolistPlayer.playlistTitleMap[svid] = $(elem2).attr('data-title');
                        });
                    }
                    else {
                        //wont happen
                        $(elem).addClass('disabled');
                        return;
                    }
                    if (role === 'playall-random') {
                        NicolistPlayer.playlist = Util.shuffle(NicolistPlayer.playlist, id);
                    }
                    NicolistPlayer.playindex = $.inArray(id, NicolistPlayer.playlist);
                    if (NicolistPlayer.playindex === -1) {
                        NicolistPlayer.playindex = 0;
                    }
                    if (Nicolist.islocal) {
                        window.open(Util.domain + '/player.html?pl=' + escape(JSON.stringify(NicolistPlayer.playlist)) + '&i=' + NicolistPlayer.playindex);
                    }
                    else {
                        NicolistPlayer.createEmbedElem();
                        NicolistPlayer.refreshController();
                    }
                    $('html,body').stop().animate({ scrollTop: 0 }, 'swing');
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
    };
    Nicolist.closeMenu = function () {
        $('#menu').css('display', 'none');
        Nicolist.showingMenu = false;
    };
    Nicolist.has = function (genre, id) {
        var list = Nicolist.y[genre];
        for (var i = 0; i < list.length / 2; i++) {
            if (list[2 * i] === id) {
                return true;
            }
            ;
        }
        return false;
    };
    Nicolist.addGenre = function (name) {
        if (Util.bytesize(name) > 64) {
            Nicolist.message('ジャンル名は64バイト以内に収める必要があります', 'warning', '#alert-genre');
            return false;
        }
        if (Util.bytesize(name) === 0) {
            Nicolist.message('作成するジャンルの名前を入力してください。', 'warning', '#alert-genre');
            return false;
        }
        if (!Nicolist.y.hasOwnProperty(name)) {
            Nicolist.pushPrev();
            Nicolist.y[name] = [];
            $('#alert-genre').html('');
            Nicolist.messageUndoable('ジャンル「' + name + '」を追加しました', 'success', null, 'gs');
            return true;
        }
        else {
            Nicolist.message('ジャンル「' + name + '」は既に存在しているようです。', 'warning', '#alert-genre');
            return false;
        }
    };
    Nicolist.removeVideo = function (elem) {
        var genre = elem.attr('data-genre');
        var id = elem.attr('data-id');
        var title = elem.attr('data-title');
        Nicolist.confAvoidable('本当に動画「' + Util.cutString(title, 50) + '」を削除しますか？', function () {
            Nicolist.pushPrev();
            var list = Nicolist.y[genre];
            var newlist = [];
            for (var i = 0; i < list.length / 2; i++) {
                if (list[2 * i] !== id) {
                    newlist.push(list[2 * i]);
                    newlist.push(list[2 * i + 1]);
                }
            }
            Nicolist.y[genre] = newlist;
            Nicolist.messageUndoable('動画「' + Util.cutString(title, 50) + '」を削除しました', 'danger', null, 'v');
            Nicolist.refresh('v'); //video change
        });
    };
    Nicolist.removeGenre = function (elem) {
        var genre = elem.attr('data-genre');
        Nicolist.confirm('本当にジャンル「' + genre + '」を削除しますか？\n' + (Nicolist.y[genre].length / 2) + '個の動画が登録されています。', function () {
            var newy = {};
            Nicolist.pushPrev();
            for (var oldgenre in Nicolist.y) {
                if (genre !== oldgenre) {
                    newy[oldgenre] = Nicolist.y[oldgenre];
                }
            }
            Nicolist.y = newy;
            Nicolist.messageUndoable('ジャンル「' + genre + '」を削除しました', 'danger', null, 'gs');
            Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);
            Nicolist.refresh('gs'); //genre change
        });
    };
    Nicolist.setSelGen = function (genre) {
        if (!Nicolist.y.hasOwnProperty(genre)) {
            Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);
            Nicolist.message('前回選択していたジャンルの引き継ぎ時にエラーが発生しました', 'danger');
            return;
        }
        Nicolist.selectedGenre = genre;
        localStorage.setItem('selectedGenre', Nicolist.selectedGenre);
    };
    Nicolist.redo = function ($elem) {
        var _c = Util.copyObj(Nicolist.y);
        Nicolist.y = Util.copyObj(Nicolist.prevy);
        Nicolist.prevy = _c;
        Nicolist.messageUndoable('やり直しました', 'primary', $elem.attr('data-wrapper'), $elem.attr('data-refarg'));
        Nicolist.refresh($elem.attr('data-refarg'));
    };
    Nicolist.undo = function ($elem) {
        var _c = Util.copyObj(Nicolist.y);
        Nicolist.y = Util.copyObj(Nicolist.prevy);
        Nicolist.prevy = _c;
        Nicolist.messageUndoable('もとに戻しました', 'primary', $elem.attr('data-wrapper'), $elem.attr('data-refarg'), null, 'redo');
        Nicolist.refresh($elem.attr('data-refarg'));
    };
    Nicolist.message = function (mes, type, wrapper, permanent, elem) {
        if (type === void 0) { type = 'warning'; }
        if (wrapper === void 0) { wrapper = '#alert'; }
        if (permanent === void 0) { permanent = false; }
        if ($.inArray(type, Nicolist.MESSAGE_TYPES) === -1) {
            type = 'warning';
        }
        if (wrapper === '' || $(wrapper).length === 0) {
            wrapper = '#alert';
        }
        var div = $('<div>', {
            'class': 'alert alert-' + type
        });
        if (!permanent) {
            $('<button>', {
                'type': 'button',
                'class': 'close',
                'click': function (e) {
                    $(e.currentTarget).parent().parent().fadeOut('slow', Nicolist.refreshStyle);
                }
            }).append($('<span>', {
                html: '&times;'
            })).appendTo(div);
        }
        var span = $('<span>', {
            text: mes
        });
        if (elem)
            span.append(elem);
        span.appendTo(div);
        $(wrapper).css('display', 'none');
        $(wrapper).html('');
        $(wrapper).append(div);
        $(wrapper).fadeIn();
    };
    Nicolist.messageUndoable = function (mes, type, wrapper, whatChanged, permanent, toredo) {
        whatChanged = whatChanged || '';
        var span;
        if (toredo === 'redo') {
            span = $('<span>', {
                text: '[やり直す]',
                'class': 'undo',
                'data-wrapper': wrapper,
                'data-refarg': whatChanged,
                click: function (e) {
                    Nicolist.redo($(e.currentTarget));
                }
            });
        }
        else {
            span = $('<span>', {
                text: '[もとに戻す]',
                'class': 'undo',
                'data-wrapper': wrapper,
                'data-refarg': whatChanged,
                click: function (e) {
                    Nicolist.undo($(e.currentTarget));
                }
            });
        }
        Nicolist.message(mes, type, wrapper, permanent, span);
    };
    Nicolist.confAvoidable = function (mes, func) {
        if ($('#nicolist_del').prop('checked')) {
            (func)();
        }
        else {
            if ($.type(mes) === 'string') {
                Nicolist.confirm($('<span>', { text: mes }), func);
            }
            else {
                Nicolist.confirm(mes, func);
            }
        }
    };
    Nicolist.confirm = function (mesElem, func, ondeny) {
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
        if (ondeny !== null) {
            cb.on('click', ondeny);
        }
        $('#confDeny').html('').append(cb);
        $('#confModal').modal('show');
    };
    Nicolist.pushPrev = function () {
        Nicolist.prevy = Util.copyObj(Nicolist.y);
    };
    Nicolist.randomFromAll = function () {
        var _temp = {};
        var sum = 0;
        for (var genre in Nicolist.y) {
            _temp[genre] = Nicolist.y[genre].length;
            sum += _temp[genre];
        }
        if (sum === 0) {
            Nicolist.message('まだ一つも動画が登録されていません');
            return;
        }
        var rand = Math.random() * sum; //[0,sum)
        var sum2 = 0;
        var _tkeys = Object.keys(_temp);
        for (var i = 0; i < _tkeys.length; i++) {
            var genre2 = _tkeys[i];
            if (sum2 < rand && sum2 + _temp[genre2] >= rand) {
                Nicolist.random(Nicolist.y[genre2], genre2);
                break;
            }
            sum2 += _temp[genre2];
        }
    };
    Nicolist.random = function (list, genre) {
        if (list.length === 0) {
            Nicolist.message('まだ一つも動画が登録されていません');
            return;
        }
        var rand2 = Math.floor(Math.random() * (list.length / 2));
        var id = list[rand2 * 2];
        var title = list[rand2 * 2 + 1];
        if ($('#nicolist_rand').prop('checked')) {
            $('#randomVideo').html('');
        }
        if ($('#random button').length === 0) { // if #random button doesn't exist
            $('<button>', {
                'type': 'button',
                'class': 'close',
                'click': function (e) {
                    $('#random').fadeOut('slow', function () {
                        Nicolist.refreshStyle();
                        $('#randomVideo').html('');
                    });
                }
            }).append($('<span>', {
                html: '&times;'
            })).prependTo('#random');
        }
        var a = $('<a>', {
            'href': Nicolist.getVideoURL(id),
            'target': '_blank',
            'data-genre': genre,
            'data-id': id,
            'data-title': title,
            contextmenu: function (e) {
                Nicolist.showMenu(e.pageX, e.pageY, $(e.currentTarget), 'random');
                return false;
            },
            'click': function (e) {
                if ($('#click_action').val() !== 'official') {
                    e.preventDefault();
                }
                Nicolist.openVideo($(e.currentTarget), 'random');
            }
        });
        var div = $('<div>', {
            'class': 'd-flex align-items-center flex-row'
        });
        var favIcon = Nicolist.createFavIcon(id, title);
        div.append(favIcon);
        if ($('#nicolist_thumb_res').prop('checked')) {
            a.append(Nicolist.createThumbImgElem(id, $('#nicolist_rand').prop('checked')));
        }
        var span = $('<span>', { text: title });
        a.append(span);
        div.append(a);
        if (genre !== null) {
            div.append($('<span>', {
                text: '(' + genre + ')',
                'class': 'ml-2 text-muted'
            }));
        }
        div.prependTo('#randomVideo');
        $('#random').css('display', 'block');
    };
    Nicolist.randomFromRight = function () {
        var list = [];
        var genre = null;
        $('#right a[data-id]').each(function (i, elem) {
            list.push($(elem).attr('data-id'));
            list.push($(elem).attr('data-title'));
            if (genre == null) {
                var thisGenre = $(elem).attr('data-genre');
                if (!Util.isNull(thisGenre)) {
                    genre = thisGenre;
                }
            }
        });
        Nicolist.random(list, genre);
    };
    Nicolist.refreshStyle = function () {
        if ($('#history').css('display') !== 'none') {
            $('#history').css({
                'top': $('#searchQuery').offset().top + $('#searchQuery').outerHeight(),
                'left': $('#searchQuery').offset().left,
                'min-width': $('#searchQuery').outerWidth()
            });
        }
    };
    Nicolist.createThumbImgElem = function (id, isFullSize) {
        var $img = $('<img>', {
            'src': (Nicolist.getThumbURL(id)),
            'alt': 'No Image',
            'class': 'mr-4 img-thumbnail loading ' + (isFullSize ? 'full-thumb' : 'sm-thumb')
        });
        $img.on('load', function (e) {
            if ($.inArray($(e.currentTarget).attr('src'), Nicolist.loadedtn) === -1) {
                Nicolist.loadedtn.push($(e.currentTarget).attr('src'));
            }
            $(e.currentTarget).removeClass('loading');
        });
        return $img;
    };
    Nicolist.createStayUnloadedTNI = function (id, isFullSize) {
        var url = Nicolist.getThumbURL(id);
        if ($.inArray(url, Nicolist.loadedtn) === -1) {
            return $('<img>', {
                'data-src': url,
                'alt': 'No Image',
                'class': 'mr-4 img-thumbnail loading ' + (isFullSize ? 'full-thumb' : 'sm-thumb')
            });
        }
        else {
            return Nicolist.createThumbImgElem(id, isFullSize);
        }
    };
    Nicolist.reversePairList = function (list) {
        var _list = [];
        for (var i = list.length / 2 - 1; i >= 0; i--) {
            _list.push(list[2 * i]);
            _list.push(list[2 * i + 1]);
        }
        return _list;
    };
    Nicolist.$starImg = function (starred) {
        return (starred ? $('<img>', {
            'src': STAR_DATA_URL
        }) : $('<img>', {
            'src': UNSTAR_DATA_URL
        })).addClass('favIcon');
    };
    Nicolist.startStarAnimation = function ($elem) {
        var posx = $elem.offset().left - $elem.width() / 2;
        var posy = $elem.offset().top - $elem.height() / 2;
        var img = $('<img>', {
            'width': '32px',
            'height': '32px',
            'src': LARGE_STAR_DATA_URL
        });
        var div = $('<div>', {
            'id': 'starAnime'
        }).css({ 'top': posy, 'left': posx });
        div.append(img);
        $('#body').append(div);
        img.animate({ width: '2px', height: '2px', opacity: 0, 'margin-left': '15px', 'margin-top': '15px' }, 300, function () {
            $('#starAnime').remove();
        });
    };
    Nicolist.createFavIcon = function (id, title) {
        var starIndex = -1;
        for (var j = 0, _jlen = Nicolist.starred.length; j < _jlen; j += 2) {
            var stId = Nicolist.starred[j];
            if (stId === id) {
                starIndex = j;
                break;
            }
        } //j
        var favIcon = Nicolist.$starImg(starIndex !== -1);
        favIcon.addClass('mr-2 pointer').attr({
            'title': 'お気に入り',
            'data-id': id,
            'data-title': title
        }).on('click', function (e) {
            var thisId = $(e.currentTarget).attr('data-id');
            var thisTitle = $(e.currentTarget).attr('data-title');
            Nicolist.toggleFav(thisId, thisTitle);
            Nicolist.refreshFavsLeft();
            localStorage.setItem('nicolist_star', JSON.stringify(Nicolist.starred));
        });
        return favIcon;
    };
    Nicolist.MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    Nicolist.SEP_DEF_VAL = ' 　+';
    Nicolist.IGN_DEF_VAL = '';
    Nicolist.debug = false;
    Nicolist.y = { "とりあえず": [] };
    Nicolist.prevy = { "とりあえず": [] };
    Nicolist.searchHistory = [];
    Nicolist.selectedGenre = '';
    Nicolist.showingMenu = false;
    Nicolist.islocal = !Nicolist.debug && window.location.protocol === 'file:';
    Nicolist.starred = [];
    Nicolist.lastId = ''; //checkURLValidity()
    Nicolist.loadedtn = [];
    return Nicolist;
}());
