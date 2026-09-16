# dasai-festival-HP

大学祭HPの編集用リポジトリです。

- 公開ページ：https://yoshikiosedo.github.io/dasai-festival-HP/
- 公開元：main ブランチ / リポジトリ直下
- 掲載文言は content/、表示の組み立ては scripts/main.js、デザインは styles/main.css で管理します。

## 編集するファイル

| 編集内容 | ファイル |
| --- | --- |
| タイトル・ロゴ・冒頭紹介文 | [content/title.js](content/title.js) |
| タブの文言・順序・表示 | [content/tabs.js](content/tabs.js) |
| アクセスマップ・出典 | [content/access.js](content/access.js) |
| SNSなどのリンク | [content/links.js](content/links.js) |
| 企画内容 | [content/projects.js](content/projects.js) |
| 案内・注意事項 | [content/notices.js](content/notices.js) |
| 全体の統合・本文の表示順 | [scripts/main.js](scripts/main.js) |
| 色・余白・文字サイズ | [styles/main.css](styles/main.css) |

## 構成

```text
index.html            ページの入口
content/
  title.js            タイトル編集
  tabs.js             タブ編集
  access.js           アクセスマップ編集
  links.js            リンク編集
  projects.js         企画内容編集
  notices.js          案内・注意事項編集
scripts/
  main.js             上記6ファイルを統合
styles/
  main.css            共通デザイン
assets/
  logo.png            ロゴ画像（既存の画像）
```

index.html が6つの編集ファイルを順に読み込んだ後、main.js がページを組み立てます。ビルド操作は不要です。main ブランチは公開用のブランチ、main.js はページの統合処理であり、役割が異なります。

## 編集方法

1. 編集したいファイルを開き、引用符内の文字を変更します。
2. 複数項目を追加するときは items の配列内にある { ... } を複製し、項目の間にカンマを入れます。
3. 空欄は ""、項目がない場合は [] のままにします。企画・案内にはコメント内に記入例があります。例は公開されません。
4. ローカルで確認するときは、この構成一式を保持して index.html をブラウザーで開きます。単体のHTMLだけでは動作しません。
5. GitHubに反映し、Actionsの公開処理が成功したら公開ページを確認します。

文章はHTMLとして解釈せず、そのまま文字として表示します。文章内の改行は \\n で指定できます。画像パスは各編集ファイルではなく、index.html を基準に ./assets/画像名.png と記入してください。外部リンクは https:// から始まるURLを使用してください。

## タブと空欄の扱い

- 左上の「☰ メニュー」を押すと、左サイドバーにタブが展開します。各タブはページ内の項目へ移動するリンクです。
- 「閉じる ×」、背景クリック、Escapeキーで閉じられます。項目を選ぶとサイドバーを閉じて移動します。
- メニューボタンとサイドバー見出しは tabs.js の menuLabel / heading で編集できます。
- target は access / links / projects / notices から選びます。タブの順序は tabs.js の配列順です。
- enabled: false にするとタブ全体を非表示にできます。
- 企画は title、案内は title または body が記入されると表示します。リンクはURLとリンク文言が必要です。
- 本文のない項目と、その項目を指すタブは表示しません。未入力の項目は掲載しません。
- 本文の順序は main.js で「アクセスマップ → リンク → 企画内容 → 案内・注意事項」としています。

## 公開・運用

GitHub Pagesの設定は Settings → Pages → Deploy from a branch → main / (root) です。mainへの変更は公開対象になるため、確認前の編集は別ブランチで進め、確認後にmainへ統合できます。

掲載情報.md は原稿整理用です。変更を自動で取り込む仕組みはないため、確認した内容を対応する content/ のファイルへ反映します。未確定の内容や編集用メモは掲載しません。
