/// <reference path="images.ts"/>
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
    Nicolist.ccnew = function () {
        var val = $('#ccnew').val();
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
            $('#createcopy').text('コピー');
        }
        else {
            $('#createcopy').text('移動');
        }
    };
    Nicolist.escapeREInsideBracket = function (str) {
        return str.replace(/[\[\]\-\\\*\^]/g, function (x) {
            return '\\' + x;
        });
    };
    Nicolist.loadImgOnScreen = function () {
        var horizon = $(window).height() + $('html,body').scrollTop();
        $('#right, #sr').find('img[data-src]').each(function (i, elem) {
            if (!$(elem).is(':hidden')) {
                if ($(elem).offset().top < horizon) {
                    Nicolist.loadImg($(elem));
                }
            }
        });
    };
    Nicolist.escapeRegExp = function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, function (x) { return '\\' + x; });
    };
    Nicolist.search = function (query) {
        var separator = Nicolist.escapeREInsideBracket($('#nicolist_separator').val());
        var queryArray = [];
        if (separator === '') {
            queryArray = [query];
        }
        else {
            var ga = separator.charAt(0);
            queryArray = query
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
            html: '<span>&times;</span>',
            'class': 'close',
            'aria-label': 'Close',
            'click': function (e) {
                $('#sr').fadeOut('slow', function () {
                    Nicolist.refreshStyle();
                    $('#sr').html('');
                });
            }
        }).appendTo('#sr');
        Nicolist.pushHistory(query);
        var count = 0; //count all
        var mobj = {}; //matched video tree
        var isand = $("#nicolist_and").prop('checked'); // true: AND false: OR
        var maxsearchcount = Nicolist.int($("#nicolist_msc").val());
        if (maxsearchcount <= 0) {
            maxsearchcount = Infinity;
        }
        var ignore = Nicolist.escapeREInsideBracket($('#nicolist_ignore').val());
        for (var genre in Nicolist.y) {
            var list = Nicolist.y[genre];
            if ($('#nicolist_sort').prop('checked')) {
                list = Nicolist.reversePairList(list);
            }
            for (var l = 0; l < list.length / 2; l++) {
                var id = list[2 * l];
                var title = list[2 * l + 1];
                var isMatched = true;
                if (isand) { //and
                    isMatched = true;
                    for (var _b = 0, queryArray_1 = queryArray; _b < queryArray_1.length; _b++) {
                        var searchQuery = queryArray_1[_b];
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
                    for (var _e = 0, queryArray_2 = queryArray; _e < queryArray_2.length; _e++) {
                        var searchQuery = queryArray_2[_e];
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
        if (mkeys.length === 0) {
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
        var manyMatched = mkeys.length > 2 && count > 20;
        for (var i = 0; i < mkeys.length; i++) {
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
                    $("#sr [data-for=wrapperGenre][data-genre!=\"" + thisGenre + "\"]").each(function (_i, elem) {
                        $(elem).addClass('silent');
                    });
                    $("#sr [data-for=wrapperGenre][data-genre=\"" + thisGenre + "\"]").each(function (_i, elem) {
                        $(elem).toggleClass('silent');
                        Nicolist.loadImgOnScreen();
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
            for (var k = 0; k < list.length / 2; k++) {
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
                    title = Nicolist.escapeHtmlSpecialChars(title);
                    for (var _f = 0, queryArray_3 = queryArray; _f < queryArray_3.length; _f++) {
                        var searchQuery = queryArray_3[_f];
                        title = title.replace(new RegExp(Nicolist.compoundRe(Nicolist.escapeRegExp(searchQuery), '[' + ignore + ']*'), 'gi'), function (x) {
                            return '<mark>' + x + '</mark>';
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
        Nicolist.loadImgOnScreen();
        Nicolist.dismissAllWarningAlerts();
    };
    //compoundRe('xxxx', '.') -> 'x.x.x.x'
    Nicolist.compoundRe = function (text, re) {
        var str = '';
        for (var i = 0; i < text.length; i++) {
            str += text.charAt(i);
            if (i < text.length - 1) {
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
            var numid = Nicolist.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^nm\d+$/.test(id)) {
            var numid = Nicolist.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^so\d+$/.test(id)) {
            var numid = Nicolist.int(id);
            return 'http://tn.smilevideo.jp/smile?i=' + numid;
        }
        else if (/^\d+$/.test(id)) {
            var numid = Nicolist.int(id);
            return 'channel.jpg';
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
                Nicolist.dismissAllWarningAlerts();
                if ($('#nicolist_stayopen').prop('checked')) {
                    Nicolist.messageUndoable("\u52D5\u753B\u300C" + Nicolist.restrBytesize(title, 50) + "\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F", 'success', '#alert-addvideo', 'v');
                }
                else {
                    Nicolist.messageUndoable("\u52D5\u753B\u300C" + Nicolist.restrBytesize(title, 50) + "\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F", 'success', null, 'v');
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
        var m = Nicolist.videoIdMatch($('#url').val());
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
                    for (var i = 0; i < list.length / 2; i++) {
                        var id = list[2 * i];
                        var title = list[2 * i + 1];
                        if (id === m) {
                            already.append($('<li>', {
                                text: genre
                            }).append($('<span>', {
                                text: '(' + Nicolist.restrBytesize(title, 80) + ')',
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
            var _a = [];
            _a.push(queryStr);
            var count = Math.min(Nicolist.int($('#nicolist_historyCount').val()) - 1, Nicolist.searchHistory.length);
            for (var i = 0; i < count; i++) {
                _a.push(Nicolist.searchHistory[i]);
            }
            Nicolist.searchHistory = _a;
        }
        else {
            var _a = [];
            _a.push(queryStr);
            for (var i = 0; i < Nicolist.searchHistory.length; i++) {
                if (i !== _hindex) {
                    _a.push(Nicolist.searchHistory[i]);
                }
            }
            Nicolist.searchHistory = _a;
        }
        localStorage.setItem('searchhistory', JSON.stringify(Nicolist.searchHistory));
    };
    Nicolist.handleVideoDrop = function (e) {
        var sel = '#url';
        if (e.pageX > $('#addVideoModal').outerWidth(true) / 2) {
            sel = '#title';
        }
        var data = e.originalEvent.dataTransfer.items;
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
                        for (var j = 0; j < m.length; j++) {
                            if (/<span id="video-title"/.test(m[j])) {
                                s2 = m[j].replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
                                $('#title').val(s2);
                            }
                        }
                    }
                    if (s2 === null) {
                        var s2 = s.replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
                        $('#title').val(s2);
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
        $(window).resize(function () {
            if ($('#play iframe').length === 0) {
                return;
            }
            Nicolist.videoResize();
        });
        $(window).on('unload', function () {
            Nicolist.unload();
        });
        $(window).scroll(function () {
            Nicolist.loadImgOnScreen();
        });
        $('input[type=checkbox]').on('change', function (e) {
            var id = $(e.currentTarget).attr('id');
            if (!Nicolist.isNullOrUndefined(id)) {
                window.localStorage.setItem(id, $(e.currentTarget).prop('checked'));
            }
        });
        $('#nicolist_thumb_cc').on('change', function () {
            var ls;
            $('#ccvideos .img-thumbnail').each(function (_i, elem) {
                if ($().hasClass('silent')) {
                    ls = $(elem).attr('data-loadstatus');
                    if (ls && ls === 'ready') {
                        Nicolist.loadImg($(elem));
                    }
                }
                $(elem).toggleClass('silent');
            });
        });
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
                if (Nicolist.isNullOrUndefined(data[i].kind)) {
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
                if (Nicolist.isNullOrUndefined(data[i].kind)) {
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
                    var _y = Nicolist.copy(Nicolist.y);
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
                    Nicolist.dismissAllWarningAlerts();
                });
            }
        });
        $('#editModal').on('hidden.bs.modal', function () {
            $('#editTitle').removeClass('is-invalid');
            $('#editGenre').removeClass('is-invalid');
            $('#emalert').html('');
        });
        $('#nicolist_historyCount').on('change', function (e) {
            var sh = Nicolist.int($(e.currentTarget).val());
            if (!isNaN(sh) && sh > 0) {
                localStorage.setItem('nicolist_historyCount', sh + '');
            }
        });
        $('#nicolist_msc').on('change', function (e) {
            var sh2 = Nicolist.int($(e.currentTarget).val());
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
                Nicolist.registerTooltip($('#pcloop'));
                Nicolist.refreshController();
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
                Nicolist.registerTooltip($('#pcwidth'));
                Nicolist.refreshController();
            }
            Nicolist.videoResize();
        });
        $('#searchQuery').on('focus', function (e) {
            console.log(e.currentTarget);
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
        $('#ccopen').on('click', function (e) {
            $('#ccvideos').html('');
            $('#ccalert').html('');
            for (var genre in Nicolist.y) {
                var genre_name = $('<p>', {
                    'click': function (e2) {
                        var thisElem = $(e2.currentTarget);
                        if ($('#nicolist_thumb_cc').prop('checked')) {
                            thisElem.next().find('.img-thumbnail').each(function (i, elem) {
                                Nicolist.loadImg($(elem));
                            });
                        }
                        else {
                            thisElem.next().find('.img-thumbnail').each(function (i, elem) {
                                $(elem).attr('data-loadstatus', 'ready');
                            });
                        }
                        if (thisElem.next().css('display') === 'none') {
                            thisElem.next().fadeIn();
                            thisElem.parent().find('.ccgenrename').each(function (i, elem) {
                                if ($(elem).text() !== thisElem.text() && $(elem).next().css('display') !== 'none') {
                                    $(elem).next().css('display', 'none');
                                    $(elem).find('.genre_indicator').text('-');
                                }
                            });
                            thisElem.find('.genre_indicator').text('+');
                        }
                        else {
                            thisElem.next().fadeOut();
                            thisElem.find('.genre_indicator').text('-');
                        }
                        return false;
                    },
                    text: genre,
                    'class': 'ccgenrename'
                });
                genre_name.prepend($('<span>', {
                    text: '-',
                    'class': 'genre_indicator mr-1'
                }));
                var genre_count = $('<span>', {
                    'data-count': '0',
                    'class': 'badge badge-pill badge-secondary2 ml-2'
                });
                var ccwrapper = $('<div>', {
                    'class': 'ccwrapper'
                });
                var videos_table = $('<table>', {
                    'class': 'cctable'
                });
                var list = Nicolist.y[genre];
                if ($('#nicolist_sort').prop('checked')) {
                    list = Nicolist.reversePairList(list);
                }
                for (var i = 0; i < list.length / 2; i++) {
                    var id = list[2 * i];
                    var title = list[2 * i + 1];
                    var tr = $('<tr>', {
                        'class': 'ccvideo',
                        'data-title': title,
                        'data-id': id,
                        'data-genre': genre,
                        'click': function (e3) {
                            var elem = $(e3.currentTarget).parent().parent().prev().find('span[data-count]'); //gomi
                            var count = Nicolist.int(elem.attr('data-count'));
                            if ($(e3.currentTarget).hasClass('alert-success')) {
                                $(e3.currentTarget).removeClass('alert-success');
                                count--;
                            }
                            else {
                                $(e3.currentTarget).addClass('alert-success');
                                count++;
                            }
                            elem.attr('data-count', count);
                            if (count === 0) {
                                elem.css('display', 'none');
                            }
                            else {
                                elem.css('display', 'inline-block');
                                elem.text(count + '');
                            }
                        }
                    });
                    var td1 = $('<td>');
                    var img = Nicolist.createStayUnloadedTNI(id, false);
                    if (!$('#nicolist_thumb_cc').prop('checked')) {
                        img.addClass('silent');
                    }
                    td1.append(img);
                    tr.append(td1);
                    var td2 = $('<td>', {
                        text: title
                    });
                    tr.append(td2);
                    videos_table.append(tr);
                } //i
                genre_name.append(genre_count);
                $('#ccvideos').append(genre_name);
                ccwrapper.append(videos_table);
                $('#ccvideos').append(ccwrapper);
            }
            $('#ccModal').modal('show');
        });
        $('#pcclose').on('click', function () {
            $('#play').html('');
            $('#pclist').addClass('silent').html('');
            $('#controller').addClass('silent');
            Nicolist.playindex = -1;
            Nicolist.playlist = [];
        });
        $('#pcnewtab').on('click', function () {
            window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(Nicolist.playlist)) + '&i=' + Nicolist.playindex);
        });
        $('#pclist').on('change', function () {
            Nicolist.playindex = Nicolist.int($('#pclist').val() + '');
            if (isNaN(Nicolist.playindex)) {
                Nicolist.playindex = 0; //wont happen
            }
            Nicolist.autoplay = false;
            Nicolist.refreshPlayer();
        });
        $('#pcnext').on('click', function (e) {
            if ($(e.currentTarget).hasClass('disabled')) {
                return;
            }
            Nicolist.autoplay = true;
            Nicolist.next();
        });
        $('#pcprev').on('click', function (e) {
            if ($(e.currentTarget).hasClass('disabled')) {
                return;
            }
            Nicolist.autoplay = true;
            Nicolist.previous();
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
            Nicolist.refreshController();
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
            Nicolist.videoResize();
        });
        $('#sgopen').on('click', function () {
            $('#sggenre').html('');
            var gs = Object.keys(Nicolist.y);
            for (var i = 0; i < gs.length; i++) {
                var g = gs[i];
                var clazz = 'sgg ' + (i != 0 ? 'sgtarget' : 'sgdef');
                var div = $('<div>', {
                    text: g,
                    'class': clazz
                });
                $('#sggenre').append(div);
            } //i
            $('#genreSortModal').modal('show');
            Sortable.create($('#sggenre').get(0), {
                draggable: '.sgtarget',
                animation: 300
            });
        });
        $('#submitGenreSort').on('click', function () {
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
        $('#createcopy').on('click', function () {
            if ($('#ccvideos tr.alert-success').length === 0) {
                Nicolist.message('動画が選択されていません。', 'warning', '#ccalert');
                $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                return;
            }
            var mode = $('#ccnew').val();
            if (mode === 'copytoold' || mode === 'movetoold') {
                var targetgenre = $('#ccoldsel').val() + '';
                if (!Nicolist.y.hasOwnProperty(targetgenre)) {
                    Nicolist.message('ジャンルを選択してください。', 'warning', '#ccalert');
                    return;
                }
                var remove_cc = mode === 'movetoold';
                var failcount = 0;
                var successcount = 0;
                var _y = Nicolist.copy(Nicolist.y);
                $('#ccvideos tr.alert-success').each(function (_i, elem) {
                    var id = $(elem).attr('data-id');
                    var title = $(elem).attr('data-title');
                    if ($.inArray(id, _y[targetgenre]) === -1) {
                        _y[targetgenre].push(id);
                        _y[targetgenre].push(title);
                        if (remove_cc) {
                            var genre = $(elem).attr('data-genre');
                            var list2 = _y[genre];
                            var newlist = [];
                            for (var i = 0; i < list2.length / 2; i++) {
                                if (list2[2 * i] !== id) {
                                    newlist.push(list2[2 * i]);
                                    newlist.push(list2[2 * i + 1]);
                                }
                            }
                            _y[genre] = newlist;
                        }
                        successcount++;
                    }
                    else {
                        failcount++;
                    }
                });
                var __a = remove_cc ? '移動' : 'コピー';
                if (successcount > 0) {
                    Nicolist.pushPrev();
                    Nicolist.y = _y;
                    Nicolist.messageUndoable(successcount + '個の動画を「' + targetgenre + '」に' + __a + 'しました' + (failcount > 0 ? ' (' + failcount + '個の動画は既に登録されているため' + __a + 'されません)' : ''), 'success', null, 'vgs');
                }
                else {
                    Nicolist.message('すべて「' + targetgenre + '」に登録済みの動画です', 'warning', '#ccalert');
                    $('#ccModal').stop().animate({ scrollTop: 0 }, 'slow');
                    return;
                }
                Nicolist.setSelGen(targetgenre);
                Nicolist.refresh('gvs');
                Nicolist.dismissAllWarningAlerts();
                $('#ccModal').modal('hide');
            }
            else if (mode === 'copytonew' || mode === 'movetonew') {
                var remove_cb = mode === 'movetonew';
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
                    var list = new Array();
                    $('#ccvideos tr.alert-success').each(function (_i, elem) {
                        var title = $(elem).attr('data-title');
                        var id = $(elem).attr('data-id');
                        if (remove_cb) {
                            var genre = $(elem).attr('data-genre');
                            var list2 = Nicolist.y[genre];
                            var newlist = [];
                            for (var i = 0; i < list2.length / 2; i++) {
                                if (list2[2 * i] !== id) {
                                    newlist.push(list2[2 * i]);
                                    newlist.push(list2[2 * i + 1]);
                                }
                            }
                            Nicolist.y[genre] = newlist;
                        }
                        if ($.inArray(id, list) === -1) {
                            list.push(id);
                            list.push(title);
                        }
                    });
                    Nicolist.y[ccname] = list;
                    var __a = remove_cc ? '移動' : 'コピー';
                    Nicolist.messageUndoable('「' + ccname + '」に' + (list.length / 2) + '個の動画を' + __a + 'しました', 'success', null, 'gvs');
                    Nicolist.setSelGen(ccname);
                    Nicolist.refresh('gvs');
                    Nicolist.dismissAllWarningAlerts();
                    $('#ccModal').modal('hide');
                    $('#ccname').val('');
                }
            }
        });
        $('#issueRaw').on('click', function () {
            var d = new Date();
            Nicolist.promptWinExplorer('backup_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '.json', JSON.stringify(Nicolist.y));
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
                    var _y = Nicolist.copy(Nicolist.y);
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
                        Nicolist.dismissAllWarningAlerts();
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
        Nicolist.registerEventListener();
        if (Nicolist.isNullOrUndefined(localStorage)) {
            if (!Nicolist.isNullOrUndefined(document.cookie)) {
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
        $('input[type=checkbox]').each(function (_i, elem) {
            var id = $(elem).attr('id');
            if (!Nicolist.isNullOrUndefined(id)) {
                var bool = window.localStorage.getItem(id);
                if (bool === 'true') {
                    $(elem).prop('checked', true);
                }
                else if (bool) {
                    $(elem).prop('checked', false);
                }
            }
        });
        var sepls = localStorage.getItem('nicolist_separator');
        if (sepls !== null) {
            $('#nicolist_separator').val(sepls);
        }
        else {
            $('#nicolist_separator').val(Nicolist.SEP_DEF_VAL);
        }
        var ignls = localStorage.getItem('nicolist_ignore');
        if (ignls !== null) {
            $('#nicolist_ignore').val(ignls);
        }
        else {
            $('#nicolist_ignore').val(Nicolist.IGN_DEF_VAL);
        }
        var cals = localStorage.getItem('nicolist_click_action');
        if (cals !== null && cals !== '') {
            $('#click_action').val(cals);
        }
        var tabs = Nicolist.int(localStorage.getItem('_nicolistTabCount'));
        if (!isNaN(tabs)) {
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
            localStorage.setItem('_nicolistTabCount', (tabs + 1) + '');
        }
        else {
            localStorage.setItem('_nicolistTabCount', '1');
        }
        var l = localStorage.getItem('nicolist');
        if (l !== null) {
            try {
                l = JSON.parse(l);
                if (typeof l !== 'object') {
                    throw new Error('JSON syntax error'); //wont happen
                }
                Nicolist.y = l;
            }
            catch (e) {
                Nicolist.message(e, 'danger');
            }
        }
        var s = localStorage.getItem('selectedGenre');
        if (Object.keys(Nicolist.y).length > 0) {
            if (s !== null) {
                Nicolist.setSelGen(s);
            }
            else {
                Nicolist.setSelGen(Object.keys(Nicolist.y)[0]);
            }
        }
        var cnew = localStorage.getItem('nicolist_ccnewval');
        if (cnew !== null) {
            $('#ccnew').val(cnew);
        }
        Nicolist.ccnew();
        var sh = localStorage.getItem('searchhistory');
        if (sh !== null) {
            Nicolist.searchHistory = JSON.parse(sh);
            if ($.type(Nicolist.searchHistory) !== 'array') {
                Nicolist.searchHistory = [];
            }
        }
        var nh = Nicolist.int(localStorage.getItem('nicolist_historyCount'));
        if (!isNaN(nh)) {
            $('#nicolist_historyCount').val(nh);
        }
        var nh2 = Nicolist.int(localStorage.getItem('nicolist_msc'));
        if (!isNaN(nh2)) {
            $('#nicolist_msc').val(nh2);
        }
        var ld = localStorage.getItem('nicolist_deleted');
        if (ld !== null) {
            try {
                Nicolist.deletedVideoArray = JSON.parse(ld);
                if ($.type(Nicolist.deletedVideoArray) !== 'array') {
                    Nicolist.deletedVideoArray = [];
                }
            }
            catch (e) {
            }
        }
        var ls = localStorage.getItem('nicolist_star');
        if (ls !== null) {
            try {
                Nicolist.starred = JSON.parse(ls);
                if ($.type(Nicolist.starred) !== 'array') {
                    Nicolist.starred = [];
                }
            }
            catch (e) {
            }
        }
        var lz = localStorage.getItem('nicolist_volumemap');
        if (lz !== null) {
            try {
                lz = JSON.parse(lz);
                if ($.type(lz) === 'object') {
                    Nicolist.volumemap = lz;
                }
            }
            catch (e) {
                Nicolist.message(e, 'danger');
            }
        }
        Nicolist.registerTooltip($('#controller span[title]'));
        Nicolist.refresh('vgs');
    };
    Nicolist.registerTooltip = function ($elem) {
        $elem.tooltip({
            'placement': 'bottom',
            'animation': false,
            'template': '<div class="tooltip mt-2" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
    };
    Nicolist.unload = function () {
        var tabs = Nicolist.int(localStorage.getItem('_nicolistTabCount'));
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
            $('#length').text('(' + Nicolist.sizeString(Nicolist.bytesize(JSON.stringify(Nicolist.y))) + ')');
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
                        Nicolist.refreshController();
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
            Nicolist.playindex = 0;
            Nicolist.playlist = [id];
            Nicolist.playlistTitleMap = {};
            Nicolist.playlistTitleMap[id] = title;
            if (Nicolist.islocal) {
                window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(Nicolist.playlist)) + '&i=' + Nicolist.playindex);
            }
            else {
                Nicolist.createEmbedElem();
                Nicolist.refreshController();
            }
        }
        else if (caval === 'cont' || caval === 'randomcont') {
            $('#play').html('');
            if (mode === 'right') {
                Nicolist.playlist = [];
                Nicolist.playlistTitleMap = {};
                $('#right a[data-id]').each(function (_i, elem2) {
                    var rvid = $(elem2).attr('data-id');
                    Nicolist.playlist.push(rvid);
                    Nicolist.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                });
            }
            else if (mode === 'random') {
                Nicolist.playlist = [];
                Nicolist.playlistTitleMap = {};
                $('#randomVideo a[data-id]').each(function (_i, elem2) {
                    var rvid = $(elem2).attr('data-id');
                    Nicolist.playlist.push(rvid);
                    Nicolist.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                });
            }
            else if (mode === 'search') {
                Nicolist.playlist = [];
                Nicolist.playlistTitleMap = {};
                $('#sr a[data-id]').each(function (_i, elem2) {
                    var svid = $(elem2).attr('data-id');
                    Nicolist.playlist.push(svid);
                    Nicolist.playlistTitleMap[svid] = $(elem2).attr('data-title');
                });
            }
            else {
                //wont happen
                return;
            }
            if (caval === 'randomcont') {
                Nicolist.playlist = Nicolist.randomize(Nicolist.playlist, id);
            }
            Nicolist.playindex = $.inArray(id, Nicolist.playlist);
            if (Nicolist.playindex === -1) {
                Nicolist.playindex = 0;
            }
            if (Nicolist.islocal) {
                window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(Nicolist.playlist)) + '&i=' + Nicolist.playindex);
            }
            else {
                Nicolist.createEmbedElem();
                Nicolist.refreshController();
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
                    Nicolist.playindex = 0;
                    Nicolist.playlist = [id];
                    Nicolist.playlistTitleMap = {};
                    Nicolist.playlistTitleMap[id] = title;
                    if (Nicolist.islocal) {
                        window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(Nicolist.playlist)) + '&i=' + Nicolist.playindex);
                    }
                    else {
                        Nicolist.createEmbedElem();
                        Nicolist.refreshController();
                    }
                    Nicolist.closeMenu();
                });
            }
            else if (role === 'playall' || role === 'playall-random') {
                $(elem).on('click', function () {
                    $('#play').html('');
                    if (mode === 'right') {
                        $(elem).removeClass('disabled');
                        Nicolist.playlist = [];
                        Nicolist.playlistTitleMap = {};
                        $('#right a[data-id]').each(function (_i, elem2) {
                            var rvid = $(elem2).attr('data-id');
                            Nicolist.playlist.push(rvid);
                            Nicolist.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                        });
                    }
                    else if (mode === 'random') {
                        $(elem).removeClass('disabled');
                        Nicolist.playlist = [];
                        Nicolist.playlistTitleMap = {};
                        $('#randomVideo a[data-id]').each(function (_i, elem2) {
                            var rvid = $(elem2).attr('data-id');
                            Nicolist.playlist.push(rvid);
                            Nicolist.playlistTitleMap[rvid] = $(elem2).attr('data-title');
                        });
                    }
                    else if (mode === 'search') {
                        $(elem).removeClass('disabled');
                        Nicolist.playlist = [];
                        Nicolist.playlistTitleMap = {};
                        $('#sr a[data-id]').each(function (_i, elem2) {
                            var svid = $(elem2).attr('data-id');
                            Nicolist.playlist.push(svid);
                            Nicolist.playlistTitleMap[svid] = $(elem2).attr('data-title');
                        });
                    }
                    else {
                        //wont happen
                        $(elem).addClass('disabled');
                        return;
                    }
                    if (role === 'playall-random') {
                        Nicolist.playlist = Nicolist.randomize(Nicolist.playlist, id);
                    }
                    Nicolist.playindex = $.inArray(id, Nicolist.playlist);
                    if (Nicolist.playindex === -1) {
                        Nicolist.playindex = 0;
                    }
                    if (Nicolist.islocal) {
                        window.open(Nicolist.domain + '/player.html?pl=' + escape(JSON.stringify(Nicolist.playlist)) + '&i=' + Nicolist.playindex);
                    }
                    else {
                        Nicolist.createEmbedElem();
                        Nicolist.refreshController();
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
    Nicolist.randomize = function (array, first) {
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
        if (Nicolist.bytesize(name) > 50) {
            Nicolist.message('ジャンル名は49バイト以内に収める必要があります', 'warning', '#alert-genre');
            return false;
        }
        if (Nicolist.bytesize(name) === 0) {
            Nicolist.message('作成するジャンルの名前を入力してください。', 'warning', '#alert-genre');
            return false;
        }
        if (!Nicolist.y.hasOwnProperty(name)) {
            Nicolist.pushPrev();
            Nicolist.y[name] = [];
            Nicolist.dismissAllWarningAlerts();
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
        Nicolist.confAvoidable('本当に動画「' + Nicolist.restrBytesize(title, 50) + '」を削除しますか？', function () {
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
            Nicolist.messageUndoable('動画「' + Nicolist.restrBytesize(title, 50) + '」を削除しました', 'danger', null, 'v');
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
        var _c = Nicolist.copy(Nicolist.y);
        Nicolist.y = Nicolist.copy(Nicolist.prevy);
        Nicolist.prevy = _c;
        Nicolist.messageUndoable('やり直しました', 'primary', $elem.attr('data-wrapper'), $elem.attr('data-refarg'));
        Nicolist.refresh($elem.attr('data-refarg'));
    };
    Nicolist.undo = function ($elem) {
        var _c = Nicolist.copy(Nicolist.y);
        Nicolist.y = Nicolist.copy(Nicolist.prevy);
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
            console.error("[at message()] Invalid Argument \"type\" : " + type);
        }
        if (wrapper === '' || $(wrapper).length === 0) {
            wrapper = '#alert';
            console.error("[at message()] Invalid Argument \"wrapper\" : " + wrapper);
        }
        var div = $('<div>', {
            'class': 'alert alert-' + type
        }).css('display', 'none');
        if (!permanent) {
            $('<button>', {
                'type': 'button',
                'class': 'close'
            }).append($('<span>', {
                html: '&times;',
                'click': function (e) {
                    $(e.currentTarget).parent().parent().fadeOut('slow', Nicolist.refreshStyle);
                }
            })).appendTo(div);
        }
        var span = $('<span>', {
            text: mes
        });
        if (elem)
            span.append(elem);
        span.appendTo(div);
        $(wrapper).html('');
        $(wrapper).append(div);
        div.fadeIn();
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
        Nicolist.prevy = Nicolist.copy(Nicolist.y);
    };
    Nicolist.copy = function (obj) {
        return $.extend(true, {}, obj);
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
                'class': 'close'
            }).append($('<span>', {
                html: '&times;',
                'click': function (e) {
                    $('#random').fadeOut('slow', function () {
                        Nicolist.refreshStyle();
                        $('#randomVideo').html('');
                    });
                }
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
                if (!Nicolist.isNullOrUndefined(thisGenre)) {
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
    Nicolist.bytesize = function (str) {
        return encodeURIComponent(str).replace(/%../g, "a").length;
    };
    Nicolist.int = function (str) {
        if (str === null) {
            return NaN;
        }
        var num = parseInt(str, 10);
        if (isNaN(num)) {
            return parseInt(str.match(/\d+/)[0], 10);
        }
        else {
            return num;
        }
    };
    Nicolist.restrBytesize = function (str, max) {
        max = max || 50;
        if (Nicolist.bytesize(str) > max) {
            var count = 0;
            var newstr = '';
            for (var i = 0; i < str.length; i++) {
                var chara = str.charAt(i);
                count += Nicolist.bytesize(chara);
                if (count > max) {
                    return newstr + '...';
                }
                else {
                    newstr += chara;
                }
            }
        }
        else {
            return str;
        }
    };
    /**
     * @unused
     */
    Nicolist.restrLength = function (str, max) {
        max = max || 40;
        if (str.length > max) {
            return str.substring(0, max) + '...';
        }
        else {
            return str;
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
    Nicolist.createEmbedElem = function () {
        var id = Nicolist.playlist[Nicolist.playindex];
        if (/^sm\d+$/.test(id) || /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)) {
            Nicolist.setupNiconicoIframe(id);
        }
        else {
            Nicolist.setupYoutubeIframe(id);
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
        Nicolist.initPlaylistSel();
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
    Nicolist.setupYoutubeIframe = function (id) {
        $('#play').html('');
        var div = $('<div>', {
            'id': 'playeriframeyoutube'
        });
        $('#play').append(div);
        Nicolist.player = new YT.Player('playeriframeyoutube', {
            videoId: id,
            playerVars: { 'autoplay': (Nicolist.autoplay ? 1 : 0) },
            events: {
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        Nicolist.autoplay = true;
                        Nicolist.next();
                    }
                    else if (event.data === YT.PlayerState.CUED) {
                        Nicolist.removeFromDeletedVideoList(id);
                        if (Nicolist.autoplay) {
                            Nicolist.player.playVideo();
                            Nicolist.autoplay = false;
                        }
                    }
                },
                'onError': function (event) {
                    Nicolist.addToDeletedVideoList(id);
                    Nicolist.autoplay = true;
                    Nicolist.next();
                }
            }
        });
        Nicolist.videoResize();
    };
    Nicolist.setupNiconicoIframe = function (id) {
        $('#play').html('');
        var iframeElement = $('<iframe>', {
            "id": "playeriframenicovideo",
            "src": 'https://embed.nicovideo.jp/watch/' + id + '?jsapi=1&playerId=0',
            "frameborder": "0",
            "allow": "autoplay; encrypted-media",
            "allowfullscreen": ""
        });
        $('#play').append(iframeElement);
        Nicolist.videoResize();
        window.onmessage = function (event) {
            if (event.origin === 'https://embed.nicovideo.jp') {
                if (event.data.eventName === 'error') {
                    //if the video has been dead
                    Nicolist.addToDeletedVideoList(id);
                    Nicolist.autoplay = true;
                    Nicolist.next();
                }
                else if (event.data.eventName === 'playerStatusChange') {
                    if (event.data.data.playerStatus === 4) {
                        Nicolist.autoplay = true;
                        Nicolist.next();
                    }
                }
                else if (event.data.eventName === 'loadComplete') {
                    if (Nicolist.autoplay) {
                        $('#play iframe').get(0).contentWindow.postMessage({ eventName: 'play', playerId: "0", sourceConnectorType: 1 }, 'https://embed.nicovideo.jp');
                        Nicolist.autoplay = false;
                    }
                    Nicolist.removeFromDeletedVideoList(id);
                    //set volume
                    if ($('#nicolist_savevolume').prop('checked')) {
                        var playing = Nicolist.playlist[Nicolist.playindex];
                        if (Nicolist.volumemap.hasOwnProperty(playing)) {
                            $('#play iframe').get(0).contentWindow.postMessage({
                                eventName: 'volumeChange',
                                playerId: "0",
                                sourceConnectorType: 1,
                                data: {
                                    volume: Nicolist.volumemap[playing]
                                }
                            }, 'https://embed.nicovideo.jp');
                        }
                        Nicolist.skip_flag = true;
                    }
                }
                else if ($('#nicolist_savevolume').prop('checked') && event.data.eventName === 'playerMetadataChange') {
                    if (Nicolist.skip_flag) {
                        Nicolist.skip_flag = false;
                    }
                    else {
                        var v = Math.round(event.data.data.volume * 1000) / 1000;
                        var playing = Nicolist.playlist[Nicolist.playindex];
                        if (!Nicolist.volumemap.hasOwnProperty(playing) || Nicolist.volumemap[playing] !== v) {
                            Nicolist.volumemap[playing] = v;
                            localStorage.setItem('nicolist_volumemap', JSON.stringify(Nicolist.volumemap));
                        }
                    }
                }
            }
        };
    };
    Nicolist.addToDeletedVideoList = function (id) {
        if ($.inArray(id, Nicolist.deletedVideoArray) === -1) {
            Nicolist.deletedVideoArray.push(id);
            localStorage.setItem('nicolist_deleted', JSON.stringify(Nicolist.deletedVideoArray));
            var $elem = $('#pclist option[value=' + Nicolist.playindex + ']');
            if ($elem.length !== 0) {
                $elem.text('[x] ' + (Nicolist.playindex + 1) + ': ' + Nicolist.playlistTitleMap[id]);
            }
        }
    };
    Nicolist.removeFromDeletedVideoList = function (id) {
        var _delindex = $.inArray(id, Nicolist.deletedVideoArray);
        if (_delindex !== -1) {
            Nicolist.deletedVideoArray.splice(_delindex, 1);
            localStorage.setItem('nicolist_deleted', JSON.stringify(Nicolist.deletedVideoArray));
            var $elem = $('#pclist option[value=' + Nicolist.playindex + ']');
            if ($elem.length !== 0) {
                $elem.text((Nicolist.playindex + 1) + ': ' + Nicolist.playlistTitleMap[id]);
            }
        }
    };
    Nicolist.videoSize = function () {
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
    Nicolist.videoResize = function () {
        var s = Nicolist.videoSize();
        $('#play iframe').css({
            'width': s[0],
            'height': s[1]
        });
        $('#controller').css({
            'width': s[0]
        });
    };
    Nicolist.next = function () {
        if (Nicolist.hasNext()) {
            Nicolist.playindex++;
            Nicolist.refreshPlayer();
        }
        else {
            if ($('#nicolist_loop').prop('checked')) {
                Nicolist.playindex = 0;
                Nicolist.refreshPlayer();
            }
        }
    };
    Nicolist.hasNext = function () {
        return Nicolist.playindex > -1 && Nicolist.playlist.length > Nicolist.playindex + 1;
    };
    Nicolist.hasPrevious = function () {
        return Nicolist.playindex > 0;
    };
    Nicolist.previous = function () {
        if (Nicolist.hasPrevious()) {
            Nicolist.playindex--;
            Nicolist.refreshPlayer();
        }
        else {
            if ($('#nicolist_loop').prop('checked')) {
                Nicolist.playindex = Nicolist.playlist.length - 1;
                Nicolist.refreshPlayer();
            }
        }
    };
    Nicolist.refreshPlayer = function () {
        var id = Nicolist.playlist[Nicolist.playindex];
        if (/^sm\d+$/.test(id) || /^nm\d+$/.test(id) || /^so\d+$/.test(id) || /^\d+$/.test(id)) {
            if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframeyoutube') {
                Nicolist.setupNiconicoIframe(id);
            }
            else {
                $('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/' + id + '?jsapi=1&playerId=0');
            }
        }
        else {
            if ($('#play iframe').length === 0 || $('#play iframe').attr('id') === 'playeriframenicovideo') {
                Nicolist.setupYoutubeIframe(id);
            }
            else {
                Nicolist.player.loadVideoById({ videoId: id });
            }
        }
        Nicolist.refreshController();
    };
    Nicolist.refreshController = function () {
        if (Nicolist.hasNext() || $('#nicolist_loop').prop('checked')) {
            $('#pcnext').removeClass('disabled');
        }
        else {
            $('#pcnext').addClass('disabled');
        }
        if (Nicolist.hasPrevious() || $('#nicolist_loop').prop('checked')) {
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
        if (Nicolist.playlist.length > 1) {
            $('#pclist').removeClass('silent');
            $('#pclist').val(Nicolist.playindex + '');
        }
        else {
            $('#pclist').addClass('silent');
        }
        $('#pcfav').html('');
        $('#pcfav').append(Nicolist.createFavIcon(Nicolist.playlist[Nicolist.playindex], Nicolist.playlistTitleMap[Nicolist.playlist[Nicolist.playindex]]).removeClass('mr-2'));
        Nicolist.registerTooltip($('#pcfav .favIcon'));
    };
    Nicolist.initPlaylistSel = function () {
        $('#pclist').html('');
        var opt, suffix, i;
        for (i = 0; i < Nicolist.playlist.length; i++) {
            if (Nicolist.playlistTitleMap.hasOwnProperty(Nicolist.playlist[i])) {
                suffix = ($.inArray(Nicolist.playlist[i], Nicolist.deletedVideoArray) === -1) ? '' : '[x] ';
                opt = $('<option>', {
                    text: suffix + (i + 1) + ': ' + Nicolist.playlistTitleMap[Nicolist.playlist[i]],
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
    Nicolist.reversePairList = function (list) {
        var _list = [];
        for (var i = list.length / 2 - 1; i >= 0; i--) {
            _list.push(list[2 * i]);
            _list.push(list[2 * i + 1]);
        }
        return _list;
    };
    Nicolist.promptWinExplorer = function (filename, content) {
        var file = new Blob([content], { type: 'text/plane;' });
        if (!Nicolist.isNullOrUndefined(window.navigator.msSaveOrOpenBlob)) {
            window.navigator.msSaveOrOpenBlob(file, filename);
        }
        else {
            var a = document.createElement('a');
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    };
    Nicolist.isNullOrUndefined = function (smthng) {
        return $.type(smthng) === 'undefined' || smthng === null;
    };
    Nicolist.escapeHtmlSpecialChars = function (text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
    Nicolist.dismissAllWarningAlerts = function () {
        $('.alert-warning').fadeOut();
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
        for (var j = 0; j < Nicolist.starred.length; j += 2) {
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
    Nicolist.domain = 'https://tkgwku.github.io/n';
    Nicolist.MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    Nicolist.SEP_DEF_VAL = ' 　+';
    Nicolist.IGN_DEF_VAL = '';
    Nicolist.debug = false;
    Nicolist.y = { "とりあえず": [] };
    Nicolist.prevy = { "とりあえず": [] };
    Nicolist.searchHistory = [];
    Nicolist.selectedGenre = '';
    Nicolist.showingMenu = false;
    Nicolist.playlist = [];
    Nicolist.playlistTitleMap = {};
    Nicolist.playindex = -1;
    Nicolist.islocal = !Nicolist.debug && window.location.protocol === 'file:';
    Nicolist.deletedVideoArray = [];
    Nicolist.volumemap = {};
    Nicolist.starred = [];
    Nicolist.lastId = ''; //checkURLValidity()
    Nicolist.autoplay = false; //createEmbedElem()
    Nicolist.skip_flag = false; //setupNiconicoIframe()
    Nicolist.loadedtn = [];
    return Nicolist;
}());
//# sourceMappingURL=_dom.js.map