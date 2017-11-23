# nicol;st

### 概要
ニコニコ動画の動画タイトルをIDとともに保存するJavascript。  
公式のマイリストではできないマイリスト内検索など、面白い機能や便利なツールを自由に追加できる(ようにしていきたい)  

### デモページ
[jar.oiran.org](http://jar.oiran.org/app/nicolist/)

### 基本的な使い方
1. index.htmlをGoogle Chromeなどで開く
2. 動画のURLとタイトルをコピーまたはドラッグ&ドロップ(以降D&Dと記す)
3. URLはChromeのURLバーの左のiマークをD&Dすると便利
4. 「Submit」を押し保存

### 現在の機能一覧
* D&Dがし易いよう、ページの左側にドロップしたらURLのフォームにURLが入力される
* タイトルも同様にしてD&Dでページの右半分にドロップすれば入力される
* 動画の編集/削除 (右クリックによりcontext menuから編集)
* Genreによる区分
* Genreの削除
* Genre内、または全Genreに渡って無作為に動画を選ぶ (Randomボタン)
* サムネの表示
* 全動画から検索 (部分一致)
* JSONによるデータの外部出力/入力 (下のTextarea)
* URLのD&D時にサムネやその動画が既に登録されているGenreの情報を表示する
* 基本操作のUNDOやREDO
* 既存の動画を選択してGenreを作成

### 追加を検討している機能
* チェックボックスにて複数個の移動
* EditをRenameとMoveに分割
* チェックボックスにて複数個の削除
* Ctrlによる選択 (チェックボックスの手間を省く工夫)
* 選択モード (チェックボックスの手間を省く工夫)
* クエリによるGenre (ex: from all contains '実況') formによるクエリ作成

### ハードルが高い
* 連続再生
* 検索機能向上