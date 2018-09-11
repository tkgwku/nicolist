
const domain = 'https://tkgwku.github.io/n';
const MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
var y = {"とりあえず":[]};
var prevy = {"とりあえず":[]};
var searchHistory = [];
var selectedGenre = '';
var showingMenu = false;
var playlist = [];
var playindex = -1;
var islocal = window.location.protocol === 'file:';
$('input[type=checkbox]').on('change', function(){
	var id = $(this).attr('id');
	if (typeof id != 'undefined'){
		window.localStorage.setItem(id, $(this).prop('checked'));
	}
});
$('#body').on('dragenter', function (e) {
	e.stopPropagation();
	e.preventDefault();
	if ($('html,body').scrollTop() > 100){
		$('html,body').stop().animate({scrollTop:0}, 'swing');
	}
});
$('#body').on('dragover', function (e) {
	e.stopPropagation();
	e.preventDefault();
	if (e.pageX > $('body').outerWidth(true)/2) {
		$('#title').addClass('dragging');
		if ($('#url').hasClass('dragging')) $('#url').removeClass('dragging');
	} else {
		$('#url').addClass('dragging');
		if ($('#title').hasClass('dragging')) $('#title').removeClass('dragging');
	}
});
$('#body').on('dragleave', function (e){
	e.stopPropagation();
	e.preventDefault();
	if ($('#url, #title').hasClass('dragging')){
		$('#url, #title').removeClass('dragging');
	}
});
$('#body').on('drop', function (e){
	e.preventDefault();
	var sel = '#url';
	if (e.pageX > $('body').outerWidth(true)/2) {
		sel = '#title';
		if ($('#registry').css('display') != 'none'){
			$('#registry').css('display', 'none');
		}
	}
	var data = e.originalEvent.dataTransfer.items;
	for (var i = 0; i < data.length; i += 1) {
		if ((data[i].kind == 'string') && (data[i].type.match('^text/plain'))) {
			data[i].getAsString(function (s){
				$(sel).val(s);
				checkValidity();
			});
		} else if ((data[i].kind == 'string') &&  (data[i].type.match('^text/html'))) {
			data[i].getAsString(function (s){
				var m = s.match(/<[^><]+>[^><]*(?=<)/g);
				var s2 = null;
				if (m != null){
					for (j = 0; j < m.length; j++){
						if (m[j].match(/<span id="video-title"/) != null){
							s2 = m[j].replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
							$('#title').val(s2);
						}
					}
				}
				if (s2 == null){
					var s2 = s.replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
					$('#title').val(s2);
				}
				checkValidity();
			});
		} else if ((data[i].kind == 'string') && (data[i].type.match('^text/uri-list'))) {
			data[i].getAsString(function (s){
				$('#url').val(s);
				checkValidity();
			});
		}
	} 
	$(sel).removeClass('dragging');
	$('html,body').stop();
});
$('#url, #title').on('input', function(e){
	checkValidity();
});
$('#genre').on('mousedown', function(){
	if ($('#registry').css('display') != 'none'){
		$('#registry').css('display', 'none');
	}
});
$('#url').on('click', function(){
	if ($(this).hasClass('is-valid') && $('#registry').css('display') === 'none' && $('#registry').html() !== ''){
		showAlready();
	}
});
$('#title').on('click', function(){
	if ($('#registry').css('display') != 'none'){
		$('#registry').css('display', 'none');
	}
});
$('body').on('click', function(e){
	if (showingMenu){
		closeMenu();
	}
	if ($('#history').css('display') != 'none'){
		$('#history').css('display', 'none');
	}
});
$('#menu').on('click', function(e){
	e.stopPropagation();
});
$('#addgenre').on('click', function (e){
	e.stopPropagation();
	if (addGenre($('#genrename').val())){
		setSelGen($('#genrename').val());
		$('#genreModal').modal('hide');
		$('#genrename').val('');
		refresh('gs');
	} else {
		$('#genrename').blur();
		$('#genrename').focus();
	}
});
$('#genrename').on("keypress", function(e) {
if (e.keyCode == 13) { // Enter
	e.preventDefault();
	e.stopPropagation();
	if (addGenre($('#genrename').val())){
		setSelGen($('#genrename').val());
		$('#genreModal').modal('hide');
		$('#genrename').val('');
		refresh('gs');
	} else {
		$('#genrename').blur();
		$('#genrename').focus();
	}
}
});
$('#button').on('click', function (e){
	sub();
});
$('#genreModal').on('shown.bs.modal', function () {
	$('#genrename').focus();
});
$('#genre').on('change', function (){
	setSelGen($(this).val());
	refresh('s');
});
$('#saveEdit').on('click', function(){
	var id = $('#editUrl').text();
	var title = $('#editTitle').val();
	var genre = $('#editGenre').val();
	var oldtitle = $(this).attr('data-title');
	var oldgenre = $(this).attr('data-genre');
	if (title == ''){
		message('タイトルが空欄です', 'warning', '#emalert');
		$('#editTitle').addClass('is-invalid');
	} else if (genre == ''){
		message('ジャンルが正しく選択されていません', 'warning', '#emalert');
		$('#editGenre').addClass('is-invalid');
	} else if (title == oldtitle && genre == oldgenre){
		message('変更なしになっています', 'warning', '#emalert');
		$('#editTitle').addClass('is-invalid');
		$('#editGenre').addClass('is-invalid');
	} else if ($.inArray(id, y[genre]) !== -1){
		message('既に移動先のジャンルに登録されている動画です', 'warning', '#emalert');
	} else {
		var mesElem = $('<div>');
		var table = $('<table>', {'class':'mb-4'});
		var tr1 = $('<tr>');
		tr1.append($('<td>', {text: 'タイトル: '}));
		var td1 = $('<td>');
		td1.append($('<strong>', {text: title}));
		if (oldtitle==title) td1.append($('<span>', {text: ' (変更なし)'}))
			td1.appendTo(tr1);
		tr1.appendTo(table);
		if (oldtitle!=title){
			var tr2 = $('<tr>', {'class': 'gray'});
			tr2.append($('<td>', {text: '変更前: '}));
			tr2.append($('<td>', {text: oldtitle}))
			tr2.appendTo(table);
		}
		var tr3 = $('<tr>');
		tr3.append($('<td>', {text: 'ジャンル: ','class':'confirmedit'}));
		var td2 = $('<td>',{'class':'confirmedit'});
		td2.append($('<strong>', {text: genre}));
		if (oldgenre==genre) td2.append($('<span>', {text: ' (変更なし)'}))
			td2.appendTo(tr3);
		tr3.appendTo(table);
		if (oldgenre!=genre){
			var tr4 = $('<tr>', {'class': 'gray'});
			tr4.append($('<td>', {text: '変更前: '}));
			tr4.append($('<td>', {text: oldgenre}))
			tr4.appendTo(table);
		}
		mesElem.append(table);
		mesElem.append($('<span>', {text:'変更を保存しますか?'}));
		conf(mesElem, function(){
			var _y = copy(y);
			var list = _y[oldgenre];
			var newlist = [];
			for (var i = 0; i < list.length/2; i++){
				if (list[2*i] != id){
					newlist.push(list[2*i]);
					newlist.push(list[2*i+1]);
				} else if (oldgenre == genre){
					newlist.push(id);
					newlist.push(title);
				}
			}
			_y[oldgenre] = newlist;
			if (oldgenre != genre){
				_y[genre].push(id);
				_y[genre].push(title);
			}
			pushPrev();
			y = _y;
			messageUndoable('動画「'+title+'」を編集しました', 'info');
			refresh('v');
			$('#editModal').modal('hide');
		});
	}
});
$('#editModal').on('hidden.bs.modal', function(){
	$('#editTitle').removeClass('is-invalid');
	$('#editGenre').removeClass('is-invalid');
	$('#emalert').html('');
})
$('#nicolist_historyCount').on('change', function(){
	var sh = $(this).val();
	if (int(sh) > 0){
		localStorage.setItem('nicolist_historyCount', sh);
	}
});
$('#nicolist_msc').on('change', function(){
	var sh = $(this).val();
	if (int(sh) > 0){
		localStorage.setItem('nicolist_msc', sh);
	}
});
$('#searchQuery').on('focus', function (e) {
	if (searchHistory.length === 0) return;
	$('#history').html('');
	for (var item of searchHistory) {
		$('<a>', {
			text: item,
			'class': 'dropdown-item pointer',
			click: function(e){
				$('#searchQuery').val($(this).text());
				search();
			}
		}).appendTo('#history');
	}
	$('#history').outerWidth($(this).outerWidth());
	$('#history').css({
		'display': 'inline-block',
		'top': $(this).offset().top + $(this).outerHeight(),
		'left': $(this).offset().left
	});
});
$('#searchQuery').on('click', function (e) {
	e.stopPropagation();
});
$('#search').on('click', function(e){
	search();
});
$('#ccopen').on('click', function(){
	$('#ccvideos').html('');
	$('#ccalert').html('');
	for(var genre in y){
		var wrapper = $('<div>');
		var genre_name = $('<p>',{
			click: function(){
				if ($('#nicolist_thumb_cc').prop('checked')){
					$(this).next().find('.img-thumbnail').each(function(i, elem){
						loadImg($(elem));
					});
				} else {
					$(this).next().find('.img-thumbnail').each(function(i, elem){
						$(elem).attr('data-loadstatus', 'ready');
					});
				}
				$(this).next().fadeToggle();
				return false;
			},
			text: genre,
			'class':'ccgenrename'
		});
		var genre_count = $('<span>',{
			'data-count':'0'
		});
		var ccwrapper = $('<div>', {
			'class':'ccwrapper'
		})
		var videos_table = $('<table>',{
			'class':'cctable'
		});
		var list = y[genre];
		if ($('#nicolist_sort').prop('checked')){
			list = reversePairList(list);
		}
		for (var i = 0; i < list.length/2; i++) {
			var id = list[2*i];
			var title = list[2*i+1];
			var tr = $('<tr>', {
				'class':'ccvideo',
				'data-title': title,
				'data-id':id,
				'data-genre':genre,
				click: function(){
					var elem = $(this).parent().parent().prev().find('span');
					var count = int(elem.attr('data-count'));
					if ($(this).hasClass('alert-success')){
						$(this).removeClass('alert-success');
						count--;
					} else {
						$(this).addClass('alert-success');
						count++;
					}
					elem.attr('data-count', count);
					elem.text((count>0?' ('+count+')':''))
				}
			});
			var td1 = $('<td>');
			var img = createStayUnloadedTNI(id, false);
			if (!$('#nicolist_thumb_cc').prop('checked')){
				img.addClass('silent');
			}
			td1.append(img);
			tr.append(td1);
			var td2 = $('<td>',{
				text: title
			});
			tr.append(td2);
			videos_table.append(tr);
		}
		genre_name.append(genre_count);
		wrapper.append(genre_name);
		ccwrapper.append(videos_table);
		wrapper.append(ccwrapper);
		$('#ccvideos').append(wrapper);
	}
	$('#ccModal').modal('show');
});
function cctntoggle(){
	$('#ccvideos .img-thumbnail').each(function(){
		if ($(this).hasClass('silent')){
			var ls = $(this).attr('data-loadstatus');
			if (ls != undefined && ls == 'ready'){
				loadImg($(this));
			}
		}
		$(this).toggleClass('silent');
	});
}
function loadImg(elem){
	var srcurl = elem.attr('data-src');
	if (srcurl != undefined){
		elem.attr('src', srcurl);
	}
}
$('#createcopy').on('click', function(){
	if ($('#ccvideos tr.alert-success').length === 0){
		message('動画が選択されていません。', 'warning', '#ccalert');
		$('#ccModal').stop().animate({scrollTop:0}, 'slow');
		return;
	}
	var mode = $('#ccnew').val();
	if (mode === 'copytoold' || mode === 'movetoold') {
		var targetgenre = $('#ccoldsel').val();
		if ($.inArray(targetgenre, Object.keys(y)) === -1){
			message('ジャンルを選択してください。', 'warning', '#ccalert');
			return;
		}
		var remove_cc = mode === 'movetoold';
		var failcount = 0;
		var successcount = 0;
		var _y = copy(y);
		$('#ccvideos tr.alert-success').each(function(){
			var id = $(this).attr('data-id');
			var title = $(this).attr('data-title');
			if ($.inArray(id, _y[targetgenre]) === -1){
				_y[targetgenre].push(id);
				_y[targetgenre].push(title);
				if (remove_cc){
					var genre = $(this).attr('data-genre');
					var list2 = _y[genre];
					var newlist = [];
					for (var i = 0; i < list2.length/2; i++){
						if (list2[2*i] != id){
							newlist.push(list2[2*i]);
							newlist.push(list2[2*i+1]);
						}
					}
					_y[genre] = newlist;
				}
				successcount++;
			} else {
				failcount++;
			}
		});
		var __a = remove_cc?'移動':'コピー';
		if (successcount > 0){
			pushPrev();
			y = _y;
			messageUndoable(successcount+'個の動画を「'+targetgenre+'」に'+__a+'しました'+(failcount>0?' ('+failcount+'個の動画は既に登録されているため'+__a+'されません)':''), 'success');
		} else {
			message('すべて「'+targetgenre+'」に登録済みの動画です', 'warning', '#ccalert');
			$('#ccModal').stop().animate({scrollTop:0}, 'slow');
			return;
		}
		setSelGen(targetgenre);
		refresh('gvs');
		$('#ccModal').modal('hide');
	} else if (mode === 'copytonew' || mode === 'movetonew') {
		var remove_cb = mode === 'movetonew';
		var ccname = $('#ccname').val();
		if (ccname === ''){
			message('作成するジャンルの名前を入力してください。', 'warning', '#ccalert');
			$('#ccModal').stop().animate({scrollTop:0}, 'slow');
			return;
		} else if (Object.keys(y).indexOf(ccname) !== -1){
			message('既に存在するジャンル名です。', 'warning', '#ccalert');
			$('#ccModal').stop().animate({scrollTop:0}, 'slow');
			return;
		} else {
			pushPrev();
			var list = new Array();
			$('#ccvideos tr.alert-success').each(function(){
				var title = $(this).attr('data-title');
				var id = $(this).attr('data-id');
				if (remove_cb){
					var genre = $(this).attr('data-genre');
					var list2 = y[genre];
					var newlist = [];
					for (var i = 0; i < list2.length/2; i++){
						if (list2[2*i] != id){
							newlist.push(list2[2*i]);
							newlist.push(list2[2*i+1]);
						}
					}
					y[genre] = newlist;
				}
				if ($.inArray(id, list) === -1){
					list.push(id);
					list.push(title);
				}
			});
			y[ccname] = list;
			var __a = remove_cc?'移動':'コピー';
			messageUndoable('「'+ccname+'」に'+(list.length/2)+'個の動画を'+__a+'しました', 'success');
			setSelGen(ccname);
			refresh('gvs');
			$('#ccModal').modal('hide');
			$('#ccname').val('');
		}
	}
});
function ccnew(){
	var val = $('#ccnew').val();
	localStorage.setItem('nicolist_ccnewval', val);
	if (val === 'copytoold' || val === 'movetoold'){
		$('#ccnewform').css('display', 'none');
		$('#ccoldform').css('display', 'block');
	} else {
		$('#ccnewform').css('display', 'block');
		$('#ccoldform').css('display', 'none');
	}
	if (val === 'copytoold' || val === 'copytoold'){
		$('#createcopy').text('コピー');
	} else {
		$('#createcopy').text('移動');
	}
}
$('#sgopen').on('click', function(){
	$('#sggenre').html('');
	var gs = Object.keys(y);
	for (i = 0; i< gs.length; i++){
		var g = gs[i];
		var clazz = 'sgg '+(i != 0 ? 'sgtarget' : 'sgdef');
		var div = $('<div>',{
			text: g,
			'class': clazz
		});
		$('#sggenre').append(div);
	}
	$('#genreSortModal').modal('show');
	Sortable.create(sggenre, {
		draggable: '.sgtarget',
		animation: 300
	});
});
$('#submitGenreSort').on('click', function(){
	pushPrev();
	var _y = {};
	$('.sgg').each(function(i, elem){
		var g = $(elem).text();
		_y[g] = y[g];
	});
	y = _y;
	refresh('g');
	messageUndoable('ジャンルを並び替えしました', 'success');
	$('#genreSortModal').modal('hide');
});
function search() {
	var value = $('#searchQuery').val();
	var sq = value.replace(/[\-^\\\[;:\],./=~|`{+\*}<>?_!"#$%&'()"！”＃＄％＆’（）＝～｜｀｛＋＊｝＜＞？＿【】『』「」［］〈〉《》ー＾￥；：」、。・／＼]/g, '$').replace(/\$+/g, '$').replace(/\$$|^\$/g, '').split('$');
	if (sq[0] == '') {
		message('検索クエリが空です。');
		return;
	}
	sqDesc = sq.join('」+「');
	$('#sr').html('');
	pushHistory(value);
	var count = 0;
	var mobj = {};
	var isand = $("#nicolist_and").prop('checked');
	var maxsearchcount = int($("#nicolist_msc").val());
	if (maxsearchcount == 0){
		maxsearchcount = Infinity;
	}
	for (var genre in y){
		var list = y[genre];
		for (var i = 0; i < list.length/2; i++){
			var id = list[2*i];
			var title = list[2*i+1];
			var isMatched = true;
			if (isand){//and
				isMatched = true;
				for (var queryStr of sq){
					var m = title.match(new RegExp(queryStr, 'gi'));
					if (m == null){
						isMatched = false;
						break;
					}
				}
			} else {//or
				isMatched = false;
				for (var queryStr of sq){
					var m = title.match(new RegExp(queryStr, 'gi'));
					if (m != null){
						isMatched = true;
						break;
					}
				}
			}
			if (isMatched){
				count ++;
				if (count > maxsearchcount){
					$('#sr').text('検索条件「'+sqDesc+'」に一致する動画が多すぎます!');
					$('#sr').append($('<button>', {
						html: '<span>&times;</span>',
						'class': 'close',
						'aria-label': 'Close',
						click: function(e){
							$('#sr').fadeOut('slow', refreshStyle);
						}
					}));
					$('#sr').fadeIn();
					return;
				}
				if (!mobj.hasOwnProperty(genre)){
					mobj[genre] = [];
				}
				mobj[genre].push(id);
				mobj[genre].push(title);
			}
		}
	}
	if (Object.keys(mobj).length == 0) {
		$('#sr').text('検索条件「'+sqDesc+'」に一致する動画はありませんでした。');
		$('#sr').append($('<button>', {
			html: '<span>&times;</span>',
			'class': 'close',
			'aria-label': 'Close',
			click: function(e){
				$('#sr').fadeOut('slow', refreshStyle);
			}
		}));
		$('#sr').fadeIn();
		return;
	}
	for (var _g in mobj){
		var _l = mobj[_g];
		$('<h5>', {
			text: _g
		}).appendTo('#sr');
		for (var k = 0; k < _l.length/2; k++){
			var _id = _l[2*k];
			var _t = _l[2*k+1];
			var div = $('<div>');
			var a = $('<a>', {
				'href': getVideoURL(_id),
				'target': '_blank',
				'data-genre' : _g,
				'data-id' : _id,
				'data-title' : _t,
				contextmenu: function(e){
					showMenu(e.pageX, e.pageY, $(this), 'search');
					return false;
				}
			});
			if ($('#nicolist_thumb_res').prop('checked')){
				a.append(createThumbImgElem(_id, false));
			}
			var span = $('<span>', {text:restr(_t,80)});
			a.append(span);
			a.appendTo(div);
			div.appendTo('#sr');
		}
	}
	$('<h4>', {
		text: '「'+sqDesc+'」の検索結果'
	}).prependTo('#sr');
	$('#sr').prepend($('<button>', {
		html: '<span>&times;</span>',
		'class': 'close',
		'aria-label': 'Close',
		click: function(e){
			$('#sr').fadeOut('slow', refreshStyle);
		}
	}));
	$('#sr').fadeIn();
}
function getVideoURL(id){
	if ((new RegExp("^sm\\d+$")).test(id)
		|| (new RegExp("^nm\\d+$")).test(id)
		|| (new RegExp("^so\\d+$")).test(id)
		|| (new RegExp("^\\d+$")).test(id)){
		return 'http://www.nicovideo.jp/watch/' + id;
	} else {
		return 'https://www.youtube.com/watch?v=' + id;
	}
}
function getThumbURL(id){
	if ((new RegExp("^sm\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^nm\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^so\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^\\d+$")).test(id)){
		var numid = int(id);
		return 'channel.jpg';
	} else {
		return 'https://img.youtube.com/vi/'+id+'/0.jpg'
	}
}
function videoIdMatch(str){
	var m_sm = str.match(/nicovideo\.jp\/watch\/(sm\d+)/);
	if (m_sm != null){
		return m_sm[1];
	}
	var m_nm = str.match(/nicovideo\.jp\/watch\/(nm\d+)/);
	if (m_nm != null){
		return m_nm[1];
	}
	var m_so = str.match(/nicovideo\.jp\/watch\/(so\d+)/);
	if (m_so != null){
		return m_so[1];
	}
	var m_cn = str.match(/nicovideo\.jp\/watch\/(\d+)/);
	if (m_cn != null){
		return m_cn[1];
	}
	var m_yt = str.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
	if (m_yt != null){
		return m_yt[1];
	}
	var m_yt2 = str.match(/youtube\.com\/watch\?[^&]+&v=([a-zA-Z0-9_-]+)/);
	if (m_yt2 != null){
		return m_yt2[1];
	}
}
function sub(){
	if (checkValidity()){
		var title = $('#title').val();
		var genre = $('#genre').val();
		var id = videoIdMatch($('#url').val());
		if (!has(genre, id)){
			pushPrev();
			y[genre].push(id);
			y[genre].push(title);
			refresh('v');//video change
			messageUndoable('動画「'+restr(title, 50)+'」を追加しました', 'success');
			$('#url').val("");
			$('#title').val("");
			$('#url, #title').removeClass('is-valid');
			$('#registry').fadeOut('slow', function(){$(this).html('')});
			lastId = '';
		} else {
			message('すでに登録されています');
			$('#registry').fadeOut();
		}
	}
}
function checkTitleValidity(node){
	if (node.val() === "" 
		|| node.val().length > 100 
		|| node.val().match(/^http:\/\//) != null 
		|| node.val().match(/^https:\/\//) != null ){
		if (node.hasClass('is-valid')){
			node.removeClass('is-valid');
		}
		node.addClass('is-invalid');
		return false;
	} else {
		if (node.hasClass('is-invalid')){
			node.removeClass('is-invalid');
		}
		node.addClass('is-valid');
		return true;
	}
}
var lastId = '';
function checkURLValidity(){
	var m = videoIdMatch($('#url').val());
	if (m != null){
		if ($('#url').hasClass('is-invalid')){
			$('#url').removeClass('is-invalid');
		}
		$('#url').addClass('is-valid');
		if (m !== lastId){
			$('#registry').html('');
			var already = $('<div>');
			for (var genre in y){
				var list = y[genre];
				for (var i = 0; i < list.length/2; i++) {
					var id = list[2*i];
					var title = list[2*i+1];
					if (id === m){
						already.append($('<div>', {
							html: genre+'<span class="ml-2 text-muted">('+restr(title, 50)+')</span>',
							'class': 'dropdown-item pointer',
							'data-genre': genre,
							click: function(){
								setSelGen($(this).attr('data-genre'));
								refresh('s');
								$('#registry').fadeOut();
							}
						}));
					}
				}
			}
			createThumbImgElem(m, false).addClass('ml-2').appendTo('#registry');
			if (already.html() != ''){
				$('#registry').append($('<div>', {
					'class': 'dropdown-divider'
				}));
				$('#registry').append($('<div>', {
					text: 'この動画は以下のジャンルに登録されています:',
					'class': 'bold dropdown-item'
				}));
				$('#registry').append($('<div>', {
					'class': 'dropdown-divider'
				}));
				$('#registry').append(already);
				$('#registry').append($('<div>', {
					'class': 'dropdown-divider'
				}));
				$('#registry').append($('<div>', {
					text: '閉じる',
					click: function(){
						$('#registry').fadeOut();
					},
					'class': 'dropdown-item pointer'
				}));
			}
			showAlready();
			lastId = m;
		}
		return true;
	} else {
		if ($('#url').hasClass('is-valid')){
			$('#url').removeClass('is-valid');
		}
		$('#url').addClass('is-invalid');
		return false;
	}
}
function showAlready(){
	//TODO add configuration which disables 'already-registered' popdown
	$('#registry').css({
		'display': 'inline-block',
		'top': $('#url').offset().top + $('#url').outerHeight(),
		'left': $('#url').offset().left,
		'min-width': $('#url').outerWidth()
	});
}
function checkGenreValidity(){
	if ($('#genre').val() === ""){
		$('#genre').addClass('is-invalid');
		return false;
	}
	return true;
}
function checkValidity(){
	var flag = checkGenreValidity();
	flag = checkURLValidity() && flag;
	flag = checkTitleValidity($('#title')) && flag;
	if (!flag){
		$('#button').prop('disabled', true);
	} else {
		$('#button').prop('disabled', false);
	}
	return flag;
}
function pushHistory(queryStr) {
	if ($.inArray(queryStr, searchHistory) === -1){
		var _a = [];
		_a.push(queryStr);
		var count = Math.min(int($('#nicolist_historyCount').val())-1, searchHistory.length);
		for (var i = 0; i < count; i++) {
			_a.push(searchHistory[i]);
		}
		searchHistory = _a;
	} else {
		var _a = [];
		_a.push(queryStr);
		for (var i = 0; i < searchHistory.length; i++) {
			if (i != $.inArray(queryStr, searchHistory)){
				_a.push(searchHistory[i]);
			}
		}
		searchHistory = _a;
	}
	localStorage.setItem('searchhistory', JSON.stringify(searchHistory));
}
function init(){
	$('input[type=checkbox]').each(function(){    
		var id = $(this).attr('id');
		if (typeof id != 'undefined'){
			var bool = window.localStorage.getItem(id);
			if (bool == 'true'){
				$(this).prop('checked', true);
			} else {
				$(this).prop('checked', false);
			}
		}
	});
	var tabs = localStorage.getItem('_nicolistTabCount');
	if (tabs != null){
		tabs = int(tabs);
		message('複数タブで同時に閲覧している可能性があります', 'danger', null, true);
		localStorage.setItem('_nicolistTabCount', tabs+1);
	} else {
		localStorage.setItem('_nicolistTabCount', 1);
	}
	var l = localStorage.getItem('nicolist');
	if (l != null){
		try {
			l = JSON.parse(l);
			y = l;
		} catch(e) {
			message(e, 'danger');
		}
	}
	var s = localStorage.getItem('selectedgenre');
	if (Object.keys(y).length > 0){
		if (s != null){
			setSelGen(s);
		} else {
			setSelGen(Object.keys(y)[0]);
		}
		refresh('s');
	}
	var cnew = localStorage.getItem('nicolist_ccnewval');
	if (cnew != null){
		$('#ccnew').val(cnew);
	}
	ccnew();
	var sh = localStorage.getItem('searchhistory');
	if (sh != null){
		searchHistory = JSON.parse(sh);
		if (!$.isArray(searchHistory)){
			searchHistory = [];
		}
	}
	var nh = localStorage.getItem('nicolist_historyCount');
	if (nh != null){
		$('#nicolist_historyCount').val(int(nh));
	}
	var nh2 = localStorage.getItem('nicolist_msc');
	if (nh2 != null){
		$('#nicolist_msc').val(int(nh2));
	}
	refresh('vgs');
}
function unload(){
	var tabs = int(localStorage.getItem('_nicolistTabCount'));
	if (tabs == 1){
	    localStorage.removeItem('_nicolistTabCount');
	} else if (tabs >= 2){
		localStorage.setItem('_nicolistTabCount', tabs-1);
	}
}
function refresh(whatChanged){
	if (!y.hasOwnProperty(selectedGenre)){
		setSelGen('とりあえず');
	}
	var videoChanged = whatChanged.indexOf('v') != -1;
	var genreChanged = whatChanged.indexOf('g') != -1;
	var selectChanged = whatChanged.indexOf('s') != -1;
	if (selectChanged || genreChanged){
	    //genreのselectの更新
	    //#leftの更新
	    $("select[role='genre']").html('');
	    $('#left').html('');
	    for (var genre in y){
	        //select更新
	        $("select[role='genre']").each(function(i, elem){
	        	$(elem).append($('<option>', {
	        		'value': genre,
	        		text: genre
	        	}));
	        });
	        //#left更新
	        //TODO : display how many videos are registered after each list in #left (configurable)
	        $('<li>', {
	        	'class': (genre === selectedGenre ? 'list-group-item selected' : 'list-group-item'),
	        	text: genre,
	        	click: function(){
	        		var genre2 = $(this).text();
	        		if (selectedGenre != genre2){
	        			setSelGen(genre2);
	        			refresh('s');
	        		}
	        	}
	        }).appendTo("#left");
	    }
	    var g = localStorage.getItem('selectedgenre');
	    if (g != null){
	    	$('select[role="genre"]').val(g);
	    }
	}
	if (selectChanged || genreChanged || videoChanged){
	    //#rightの更新
	    $("#right").html('');
	    if (selectedGenre === 'とりあえず'){
	    	$("<h4>", {
	    		text: selectedGenre
	    	}).appendTo("#right");
	    } else {
	    	$("<h4>", {
	    		text: selectedGenre
	    	}).append(
	    	$('<small>', {
	    		'class': 'removevideo',
	    		'data-genre' : selectedGenre,
	    		text: '×',
	    		click: function() {
	    			removeGenre($(this));
	    		}
	    	})
	    	).appendTo("#right");
	    }
	    var list = y[selectedGenre];
		if ($('#nicolist_sort').prop('checked')){
			list = reversePairList(list);
		}
	    for (var i = 0; i < list.length/2; i++){
	    	var id = list[2*i];
	    	var title = list[2*i+1];
	    	var div = $('<div>', {
	    		'class': 'd-flex flex-row'
	    	});
	    	var a = $( "<a>", {
	    		"href": getVideoURL(id),
	    		'target': '_blank',
	    		'data-genre' : selectedGenre,
	    		'data-id' : id,
	    		'data-title' : title,
	    		'class': 'rightvideo',
	    		contextmenu: function(e){
	    			var _b = $('#nicolist_sort').prop('checked') ? 'right_reversed' : 'right';
	    			showMenu(e.pageX, e.pageY, $(this), _b);
	    			return false;
	    		}
	    	});
	    	if ($('#nicolist_thumb').prop('checked')){
	    		a.append(createThumbImgElem(id, false));
	    	}
	    	a.append($('<span>',{
	    		text: restr2(title, 50)
	    	}))
	    	a.appendTo(div);
	    	div.appendTo("#right");
	    }
	}
	//TODO : what this does?
	if (genreChanged || videoChanged){
		if ($('#registry').html() !== ''){
			var m = videoIdMatch($('#url').val());
			if (m != null){
				if (m !== lastId){
					$('#registry').html('');
					var already = false;
					for (var genre in y){
						var list = y[genre];
						for (var i = 0; i < list.length/2; i++) {
							var id = list[2*i];
							var title = list[2*i+1];
							if (id === m){
								$('#registry').append($('<div>', {
									text: genre+'<span class="ml-2 text-muted">('+restr2(title, 50)+')</span>',
									'class': 'dropdown-item pointer',
									'data-genre': genre,
									click: function(){
										setSelGen($(this).attr('data-genre'));
										refresh('s');
										$('#registry').fadeOut();
									}
								}));
								already = true;
							}
						}
					}
					if (already){
						$('#registry').prepend($('<div>', {
							'class': 'dropdown-divider'
						}));
						$('#registry').prepend($('<div>', {
							text: 'この動画は以下のジャンルに登録されています:',
							'class': 'bold dropdown-item'
						}))
						$('#registry').append($('<div>', {
							'class': 'dropdown-divider'
						}));
						$('#registry').append($('<div>', {
							text: '閉じる',
							click: function(){
								$('#registry').fadeOut();
							},
							'class': 'dropdown-item pointer'
						}));
					}
					lastId = m;
				}
			}
		}
		$('#out').val(JSON.stringify(y, null, '    '));
		localStorage.setItem('nicolist', JSON.stringify(y));
		$('#length').text('('+bytesize(JSON.stringify(y))+'byte)');
	}
}
function showMenu(coord_x, coord_y, cont, mode){
	var id = cont.attr('data-id');
	var genre = cont.attr('data-genre');
	var title = cont.attr('data-title');
	var url = cont.attr('href');
	var hasurlattr = typeof url !== typeof undefined && url !== false;
	$("#menu").children('a').each(function(i, elem){
		var role = $(elem).attr('role');
		if (role === 'title'){
			if (hasurlattr){
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
			$(elem).on('click', function(){
				removeVideo(cont);
				closeMenu();
			});
		} else if (role === 'edit'){
			$(elem).on('click', function(){
				showEditModal(cont);
				closeMenu();
			});
		} else if (role === 'open'){
			$(elem).on('click', function(){
				window.open(getVideoURL(id), '_blank');
				closeMenu();
			});
		} else if (role === 'play'){
			$(elem).on('click', function(){
				$('#play').html('');
				playindex = -1;
				playlist = [id];
				createEmbedElem(id);
				refreshController();
				closeMenu();
			});
		} else if (role === 'playall'){
			$(elem).on('click', function(){
				$('#play').html('');
				if (mode === 'right' || mode === 'right_reversed'){
					if ($(elem).hasClass('disabled')){
						$(elem).removeClass('disabled');
					}
					var list = y[genre];
					var ids = [];
					for (var i = 0; i < list.length; i+=2) {
						ids.push(list[i]);
					}
					if (mode === 'right_reversed'){
						playlist = ids.reverse();
					} else {
						playlist = ids;
					}
				} else if (mode === 'random'){
					if ($(elem).hasClass('disabled')){
						$(elem).removeClass('disabled');
					}
					playlist = [];
					$('#randomVideo a[data-id]').each(function(i, elem2){
						playlist.push($(elem2).attr('data-id'));
					});
				} else if (mode === 'search'){
					if ($(elem).hasClass('disabled')){
						$(elem).removeClass('disabled');
					}
					playlist = [];
					$('#sr a[data-id]').each(function(i, elem2){
						playlist.push($(elem2).attr('data-id'));
					})
				} else {
					$(elem).addClass('disabled');
				}
				playindex = playlist.indexOf(id);
				createEmbedElem(id);
				refreshController();
				$('html,body').stop().animate({scrollTop:0}, 'swing');
				closeMenu();
			});
		}
	});
	$('#menu').css({
		'display': 'inline-block',
		'top': coord_y,
		'left': coord_x
	});
	showingMenu = true;
}
function showEditModal(cont){
	var id = cont.attr('data-id');
	var title = cont.attr('data-title');
	var genre = cont.attr('data-genre');
	$('#editThumb').attr('src', getThumbURL(id));
	$('#editUrl').text(id);
	$('#editUrl').parent().attr('href', getVideoURL(id));
	$('#editTitle').val(title);
	$('#editGenre').val(genre);
	$('#saveEdit').attr('data-title', title);
	$('#saveEdit').attr('data-genre', genre);
	$('#editModal').modal();
}
function closeMenu(){
	$('#menu').css('display', 'none');
	showingMenu = false;
}
function has(genre, id){
	var list = y[genre];
	for (var i = 0; i < list.length/2; i++){
		if (list[2*i] === id) return true;
	}
	return false;
}
function addGenre(name){
	if (bytesize(name) > 50){
		message('ジャンル名は49バイト以内に収める必要があります', 'warning', '#alert-genre');
		return false;
	}
	if (bytesize(name) === 0){
		message('作成するジャンルの名前を入力してください。', 'warning', '#alert-genre');
		return false;
	}
	if (!(name in y)){
		pushPrev();
		y[name] = [];
		messageUndoable('ジャンル「'+name+'」を追加しました', 'success');
		return true;
	} else {
		message('ジャンル「'+name+'」は既に存在しているようです。', 'warning', '#alert-genre');
		return false;
	}
}
function removeVideo(elem){
	var genre = elem.attr('data-genre');
	var id = elem.attr('data-id');
	var title = elem.attr('data-title');
	conf('本当に動画「'+restr(title, 50)+'」を削除しますか？', function(){
		pushPrev();
		var list = y[genre];
		var newlist = [];
		for (var i = 0; i < list.length/2; i++){
			if (list[2*i] != id){
				newlist.push(list[2*i]);
				newlist.push(list[2*i+1]);
			}
		}
		y[genre] = newlist;
		messageUndoable('動画「'+restr(title, 50)+'」を削除しました', 'danger');
	    refresh('v');//video change
	});
}
function removeGenre(elem){
	var genre = elem.attr('data-genre');
	confirm2('本当にジャンル「'+genre+'」を削除しますか？\n'+(y[genre].length/2)+'個の動画が登録されています。', function(){
		var newy = {}; 
		pushPrev();
		for (var oldgenre in y){
			if (genre != oldgenre){
				newy[oldgenre] = y[oldgenre];
			}
		}
		y = newy;
		messageUndoable('ジャンル「'+genre+'」を削除しました', 'danger');
		setSelGen(Object.keys(y)[0]);
	    refresh('gs');//genre change
	});
}
function setSelGen(genre){
	if (!y.hasOwnProperty(genre)) {
		setSelGen(Object.keys(y)[0]);
		message('前回選択していたジャンルの引き継ぎ時にエラーが発生しました', 'danger');
		return;
	}
	selectedGenre = genre;
	localStorage.setItem('selectedgenre', selectedGenre);
}
function redo() {
	var _c = copy(y);
	y = copy(prevy);
	prevy = _c;
	messageUndoable('REDOしました', 'primary');
	refresh('vgs');
}
function undo() {
	var _c = copy(y);
	y = copy(prevy);
	prevy = _c;
	messageUndoable('UNDOしました', 'primary', '#alert', false, 'redo');
	refresh('vgs');
}
function message(mes, type, wrapper, permanent, elem) {
	if (typeof type != 'string' || MESSAGE_TYPES.indexOf(type) == -1) type = 'warning';
	if (typeof wrapper != 'string' || wrapper === '') wrapper = '#alert';
	if (typeof permanent != 'boolean') permanent = false;
	var div = $('<div>', {
		'class': 'alert alert-'+type
	}).css('display', 'none');
	if (!permanent){
		$('<button>', {
			html: '<span>&times;</span>',
			'type':'button',
			'class':'close',
			click: function(){
				$(this).parent().fadeOut('slow', refreshStyle);
			}
		}).appendTo(div);
	}
	var span = $('<span>', {
		text: mes
	});
	if (elem != null && elem != undefined) {
		span.append(elem)
	};
	span.appendTo(div);
	$(wrapper).html('');
	$(wrapper).append(div);
	div.fadeIn();
}
function messageUndoable(mes, type, wrapper, permanent, toredo){
	var span;
	if (toredo === 'redo') {
		span = $('<span>', {
			text: '[REDO]',
			'class': 'undo',
			click : function(){
				redo();
			}
		});
	} else {
		span = $('<span>', {
			text: '[UNDO]',
			'class': 'undo',
			click : function(){
				undo();
			}
		});
	}
	message(mes, type, wrapper, permanent, span);
}
function conf(mes, func){
	if ($('#nicolist_del').prop('checked')){
		(func)();
	} else {
		if (typeof mes === 'string'){
			confirm2($('<span>',{text: mes}), func);
		} else {
			confirm2(mes, func);
		}
	}
}
function confirm2(mesElem, func){
	$('#confDialog').html('');
	$('#confDialog').append(mesElem);
	$('#confOK').html('').append($('<button>', {
		text: 'はい',
		'class': 'btn btn-primary',
		click: func,
		'data-dismiss': 'modal'
	}));
	$('#confModal').modal('show');
}
function pushPrev(){
	prevy = copy(y);
}
function copy(obj){
	return $.extend(true, {}, obj);
}
function randomFromAll(){
	var _temp = {};
	var sum = 0;
	for (var genre in y){
		_temp[genre] = y[genre].length;
		sum += _temp[genre];
	}
	var rand = Math.random()*sum;
	var sum2 = 0;
	for (var genre2 in _temp){
		if (sum2 < rand && sum2 + _temp[genre2] >= rand){
			random(genre2, true);
			break;
		}
		sum2 += _temp[genre2];
	}
}
function random(genre, showGenre){
	var list = y[genre];
	var rand2 = Math.floor(Math.random() * (list.length/2));
	var id = list[rand2*2];
	var title = list[rand2*2 + 1];
	if ($('#nicolist_rand').prop('checked')){
		$('#randomVideo').html('');
	}
	  if (!$('#random button').length){// if #random button doesn't exist
	  	$('#random').prepend($('<button>', {
	  		html: '<span>&times;</span>',
	  		'type':'button',
	  		'class':'close',
	  		click: function(){
	  			$(this).parent().fadeOut('slow', function(){refreshStyle();$('#randomVideo').html('')});
	  		}
	  	}));
	}
	var div = $('<div>');
	var a = $('<a>', {
		'href': getVideoURL(id),
		'target': '_blank',
		'data-genre' : genre,
		'data-id' : id,
		'data-title' : title,
		contextmenu: function(e){
			showMenu(e.pageX, e.pageY, $(this), 'random');
			return false;
		}
	});
	if ($('#nicolist_thumb_res').prop('checked')){
		a.append(createThumbImgElem(id, $('#nicolist_rand').prop('checked')));
	}
	var span = $('<span>', {text:title});
	a.append(span);
	div.append(a);
	if (showGenre){
		div.append($('<span>', {
			text: '('+genre+')',
			'class': 'ml-2 text-muted'
		}));
	}
	div.prependTo('#randomVideo');
	$('#random').css('display', 'block');
}
function randomFromSel(){
	random(selectedGenre, !$('#nicolist_rand').prop('checked'));
}
function refreshStyle(){
	if ($('#history').css('display') != 'none'){
		$('#history').css({
			'top': $('#searchQuery').offset().top + $('#searchQuery').outerHeight(),
			'left': $('#searchQuery').offset().left,
			'min-width': $('#searchQuery').outerWidth()
		});
	}
	if ($('#registry').css('display') !== 'none'){
		$('#registry').css({
			'top': $('#url').offset().top + $('#url').outerHeight(),
			'left': $('#url').offset().left,
			'min-width': $('#url').outerWidth()
		});
	}
}
function bytesize(str) {
	return encodeURIComponent(str).replace(/%../g, "a").length;
}
function int(str){
	var num = parseInt(str, 10);
	if (isNaN(num)){
		return parseInt(str.match(/\d+/)[0], 10);
	} else {
		return num;
	}
}
function restr(str, max){
	if (typeof max === 'undefined') max = 50;
	if (bytesize(str)>max){
		var count = 0;
		var newstr = ''
		for (var i = 0; i < str.length; i++) {
			var chara = str.charAt(i);
			count += bytesize(chara);
			if (count>max){
				return newstr + '...';
			} else {
				newstr += chara;
			}
		}
	} else {
		return str;
	}
}
function restr2(str, max){
	if (typeof max === 'undefined') max = 40;
	if (str.length>max){
		return str.substring(0, max)+'...';
	} else {
		return str;
	}
}
function createThumbImgElem(id, isFullSize){
	return $('<img>',{
		'src': (getThumbURL(id)),
		'alt': 'No Image',
		'class': 'mr-4 img-thumbnail '+(isFullSize?'full-thumb':'sm-thumb')
	});
}
function createStayUnloadedTNI(id, isFullSize){
	return $('<img>',{
		'data-src': (getThumbURL(id)),
		'alt': 'No Image',
		'class': 'mr-4 img-thumbnail '+(isFullSize?'full-thumb':'sm-thumb')
	});
}
var autoplay = false;
function createEmbedElem(id){
	if ((new RegExp("^sm\\d+$")).test(id)|| (new RegExp("^nm\\d+$")).test(id) || (new RegExp("^so\\d+$")).test(id) || (new RegExp("^\\d+$")).test(id)){
		setupNiconicoIframe(id);
	} else {
		setupYoutubeIframe(id);
	}
}
var player;
function setupYoutubeIframe(id){
	$('#play').html('');
	var div = $('<div>',{
		"id": "playeriframeyoutube",
	});
	$('#play').append(div);
	player = new YT.Player('playeriframeyoutube', {
		width: s[0],
		height: s[1],
		videoId: id,
    	playerVars: { 'autoplay': (autoplay ? 1 : 0)},
		events: {
			'onStateChange': function(event){
				if (event.data === YT.PlayerState.ENDED){
					autoplay = true;
					next();
				} else if (autoplay && event.data === YT.PlayerState.CUED){
					player.playVideo();
					autoplay = false;
				}
	        }
	    }
	});
}
function setupNiconicoIframe(id){
	$('#play').html('');
	var s = videoSize();
	var iframeElement = $('<iframe>',{
		"id": "playeriframenicovideo",
		"width": s[0]+'',
		"height": s[1]+'',
		"src": 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId='+playindex,
		"frameborder": "0",
		"allow": "autoplay; encrypted-media",
		"allowfullscreen": ""
	});
	$('#play').append(iframeElement);
	window.addEventListener('message', function (event) {
		if (event.origin === 'https://embed.nicovideo.jp'){
			if (event.data.eventName === 'playerStatusChange'){
				if (event.data.data.playerStatus === 4){
					autoplay = true;
					next();
				}
			} else if (autoplay && event.data.eventName === 'loadComplete'){
				$('#play iframe').get(0).contentWindow.postMessage({eventName:'play',playerId:playindex+"",sourceConnectorType:1}, 'https://embed.nicovideo.jp');
				autoplay = false;
			}
		}
	});
}
function videoSize(){
	var w = $('#play').outerWidth();
	var h = Math.ceil(w * 9 / 16);
	if (w < 640 || $('#nicolist_cinematic').prop('checked')){
		return [w, h];
	} else {
		return [640, 360];
	}
}
function videoResize(){
	var s = videoSize();
	$('#play iframe').css({
		'width': s[0],
		'height': s[1]
	});
}
function next(){
	if (hasNext()){
		playindex++;
		var id = playlist[playindex];
		if ((new RegExp("^sm\\d+$")).test(id)|| (new RegExp("^nm\\d+$")).test(id) || (new RegExp("^so\\d+$")).test(id) || (new RegExp("^\\d+$")).test(id)){
			if (!$('#play iframe').length || $('#play iframe').attr('id') === 'playeriframeyoutube'){
				setupNiconicoIframe(id);
			} else {
				$('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId='+(playindex));
			}
		} else {
			if (!$('#play iframe').length || $('#play iframe').attr('id') === 'playeriframenicovideo'){
				setupYoutubeIframe(id);
			} else {
				player.cueVideoById({videoId: id});
			}
		}
		refreshController();
	}
}
function hasNext(){
	return playindex !== -1 && playlist.length > playindex + 1;
}
function hasPrevious(){
	return playindex > 0;
}
function previous(){
	if (hasPrevious()){
		playindex--;
		var id = playlist[playindex];
		if ((new RegExp("^sm\\d+$")).test(id)|| (new RegExp("^nm\\d+$")).test(id) || (new RegExp("^so\\d+$")).test(id) || (new RegExp("^\\d+$")).test(id)){
			if (!$('#play iframe').length || $('#play iframe').attr('id') === 'playeriframeyoutube'){
				setupNiconicoIframe(id);
			} else {
				$('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId='+(playindex));
			}
		} else {
			if (!$('#play iframe').length || $('#play iframe').attr('id') === 'playeriframenicovideo'){
				setupYoutubeIframe(id);
			} else {
				player.loadVideoById({videoId: id});
			}
		}
		refreshController();
	}
}
function refreshController(){
	if (hasNext()){
		if ($('#pcnext').hasClass('silent')){
			$('#pcnext').removeClass('silent');
		}
	} else {
		if (!$('#pcnext').hasClass('silent')){
			$('#pcnext').addClass('silent');
		}
	}
	if (hasPrevious()){
		if ($('#pcprev').hasClass('silent')){
			$('#pcprev').removeClass('silent');
		}
	} else {
		if (!$('#pcprev').hasClass('silent')){
			$('#pcprev').addClass('silent');
		}
	}
	if ($('#play').html() !== '' && $('#pcclose').hasClass('silent')){
		$('#pcclose').removeClass('silent');
	}
	//if (islocal && playlist.length > 0){
	if (playlist.length > 0){
		if ($('#pcnewtab').hasClass('silent')){
			$('#pcnewtab').removeClass('silent');
		}
	} else {
		if (!$('#pcnewtab').hasClass('silent')){
			$('#pcnewtab').removeClass('silent');
		}
	}
}
$('#pcclose').on('click', function(){
	$('#play').html('');
	$('#pcclose').addClass('silent');
	$('#pcnext').addClass('silent');
	$('#pcprev').addClass('silent');
	playindex = -1;
	playlist = [];
});
$('#pcnewtab').on('click', function(){
	window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex, 'nlplayer');
});
function reversePairList(list){
	var _list = [];
	for (var i = list.length/2 - 1; i >= 0; i--) {
		_list.push(list[2*i]);
		_list.push(list[2*i+1]);
	}
	return _list;
}
$(window).resize(function() {
	if ($('#nicolist_cinematic').prop('checked')){
		videoResize();
	}
});
function promptWinExplorer(filename, content){
    var file = new Blob([content], {type: 'text/plane;'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
        var a = document.createElement('a');
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
$('#issueRaw').on('click', function(){
	var d = new Date();
	promptWinExplorer('backup_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'.json', JSON.stringify(y));
});
$('#fromRawFile').on('change', function (e){
	var files = e.target.files;
	if (files.length !== 1) {
		message('正しいファイルを選択してください', 'warning', '#prefalert');
		return;
	}
	if (!files[0].type.match(/json/)){
		message('jsonファイルを選択してください', 'warning', '#prefalert');
		return;
	}

	var reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = function (){
    	try {
			var toload = JSON.parse(reader.result);
    	} catch (e){
			message('フォーマットが正しくありません', 'warning', '#prefalert');
			return;
    	}
		var videocount = 0;
		var genrecount = 0;
		if (!(toload instanceof Object)){
			message('フォーマットが正しくありません', 'warning', '#prefalert');
			return;
		}
		var _y = copy(y);
		for (var genre in toload){
			var list = toload[genre];
			if (!(list instanceof Array)){
				message('フォーマットが正しくありません', 'warning', '#prefalert');
				return;
			}
			for (var i = 0; i < list.length/2; i++){
				var id = list[2*i];
				var title = list[2*i+1];
				if (!_y.hasOwnProperty(genre)) {
					_y[genre] = [];
					genrecount++;
				}
				if ($.inArray(id, _y[genre]) === -1){
					_y[genre].push(id);
					_y[genre].push(title);
					videocount++;
				}
			}
		}
		if (videocount===0&&genrecount===0){
			message('すべて登録済みの動画です', 'warning', '#prefalert');
		} else {
			pushPrev();
			y = _y;
			messageUndoable('JSONから'+(videocount>0?videocount+'個の動画':'')+(genrecount>0&&videocount>0?'、':'')+(genrecount>0?genrecount+'個のジャンル':'')+'を新たに読み込みました', 'success');
			refresh((genrecount>0?'g':'')+(videocount>0?'v':''));
		}
	};
})
/* TODO : 
 * - ランダム連続再生 (今のジャンル / 全ジャンル)
 * - (half done) 再生に関する設定
 * - 一覧に項目が多い場合、スクロール時に情報をロード (configurable)
 * - 画像のキャッシュを作成
 * - add configuration which disables 'already-registered' popdown
 * - display how many videos are registered after each list in #left (configurable)
 * - 次に再生 (キューに追加)
 * - プレイリストを表示
 * - プレイリストをジャンルとして保存
 * - (done)  if location.protocol === 'file:' then disable video player and provide player.html instead
 * - 登録件数が多い順にジャンルを並び替え
 * - 更新が新しい順にジャンルを並び替え
 * - お気に入り
 * - 前回のプレイリストを表示
 */