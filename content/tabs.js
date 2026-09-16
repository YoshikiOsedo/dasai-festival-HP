// サイドバー内でページ内を移動するナビゲーションです。配列の順番で表示します。
// target は access / links / projects / notices。本文が空の移動先は自動で非表示です。
window.festivalContent = window.festivalContent || {};
window.festivalContent.tabs = {
  enabled: true,
  menuLabel: "☰ メニュー", // サイドバーを開くボタン
  heading: "メニュー", // サイドバー内の見出し
  items: [
    { label: "企画内容", target: "projects" },
    { label: "アクセスマップ", target: "access" },
    { label: "SNSリンク", target: "links" },
    { label: "案内・注意事項", target: "notices" }
  ]
};
