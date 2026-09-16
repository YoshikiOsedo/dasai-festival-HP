// 各編集ファイルの内容を統合します。通常の文言編集は content/ で行います。
(() => {
  "use strict";
  const content = window.festivalContent || {};
  const root = document.getElementById("page");
  const sections = new Map();

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function safeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function addText(parent, tag, text, className) {
    if (text && text.trim()) parent.append(element(tag, text, className));
  }
  function addLink(parent, url, label) {
    const href = safeUrl(url);
    if (!href || !label) return;
    const link = element("a", label, "link-label");
    link.href = href;
    parent.append(link);
  }
  function section(id, heading) {
    const node = element("section", "", "section");
    node.id = id;
    const title = element("h2", heading);
    title.id = id + "-heading";
    node.setAttribute("aria-labelledby", title.id);
    node.append(title);
    sections.set(id, node);
    return node;
  }

  const title = content.title || {};
  if (title.pageTitle) document.title = title.pageTitle;
  const header = element("header", "", "page-header");
  const logoUrl = safeUrl(title.logo);
  if (logoUrl) {
    const image = element("img", "", "logo");
    image.src = logoUrl;
    image.alt = title.logoAlt || "";
    header.append(image);
  }
  const heading = element("h1", title.heading || title.pageTitle || "大学祭宣伝", title.heading ? "" : "visually-hidden");
  header.append(heading);
  addText(header, "p", title.introduction, "multiline");
  const overview = element("dl", "", "event-details");
  [["festivalName", "名称"], ["date", "開催日"], ["time", "開催時間"], ["venue", "会場"]].forEach(([key, label]) => {
    if (title[key]?.trim()) overview.append(element("dt", label), element("dd", title[key]));
  });
  if (overview.childElementCount) header.append(overview);
  root.replaceChildren(header);

  const access = content.access || {};
  if (safeUrl(access.image)) {
    const block = section("access", access.heading || "アクセスマップ");
    const figure = element("figure", "", "access-map");
    const link = element("a");
    link.href = safeUrl(access.image);
    link.setAttribute("aria-label", "キャンパスマップを拡大して表示");
    const image = element("img", "", "map-image");
    image.src = safeUrl(access.image);
    image.alt = access.imageAlt || "キャンパスマップ";
    link.append(image);
    figure.append(link);
    addText(figure, "figcaption", access.credit, "map-credit");
    block.append(figure);
    addText(block, "p", access.description, "multiline");
  }

  const links = (content.links?.items || []).filter(item => safeUrl(item.url) && item.label);
  if (links.length) {
    const block = section("links", content.links.heading || "リンク");
    const list = element("div", "", "card-list");
    links.forEach(item => {
      const link = element("a", "", "social-link");
      link.href = safeUrl(item.url);
      const platform = element("span", "", "platform");
      if (safeUrl(item.icon)) {
        const icon = element("img", "", "social-icon");
        icon.src = safeUrl(item.icon);
        icon.alt = "";
        platform.append(icon);
      }
      addText(platform, "span", item.platform);
      link.append(platform);
      addText(link, "span", item.account, "account");
      addText(link, "span", item.label, "link-label");
      list.append(link);
    });
    block.append(list);
  }

  const projects = (content.projects?.items || []).filter(item => item.title?.trim());
  if (projects.length) {
    const block = section("projects", content.projects.heading || "企画内容");
    const list = element("div", "", "card-list");
    projects.forEach(item => {
      const card = element("article", "", "card");
      addText(card, "h3", item.title);
      if (safeUrl(item.image)) {
        const image = element("img", "", "project-image");
        image.src = safeUrl(item.image);
        image.alt = item.imageAlt || "";
        image.loading = "lazy";
        card.append(image);
      }
      addText(card, "p", item.description, "multiline");
      const details = element("dl");
      [["date", "開催日"], ["time", "開催時間"], ["location", "場所"], ["price", "料金・価格"], ["participation", "参加方法"]].forEach(([key, label]) => {
        if (item[key]?.trim()) details.append(element("dt", label), element("dd", item[key]));
      });
      if (details.childElementCount) card.append(details);
      addLink(card, item.url, item.linkLabel);
      list.append(card);
    });
    block.append(list);
  }

  const notices = (content.notices?.items || []).filter(item => item.title?.trim() || item.body?.trim());
  if (notices.length) {
    const block = section("notices", content.notices.heading || "案内・注意事項");
    const list = element("div", "", "card-list");
    notices.forEach(item => {
      const card = element("article", "", "card");
      addText(card, "h3", item.title);
      addText(card, "p", item.body, "multiline");
      addLink(card, item.url, item.linkLabel);
      list.append(card);
    });
    block.append(list);
  }

  // タブを、開閉できる左サイドバーにまとめます。
  const tabs = content.tabs || {};
  const visibleTabs = (tabs.items || []).filter(item => sections.has(item.target) && item.label);
  if (tabs.enabled && visibleTabs.length) {
    root.classList.add("has-sidebar");
    const opener = element("button", tabs.menuLabel || "☰ メニュー", "menu-toggle");
    opener.type = "button";
    opener.setAttribute("aria-controls", "site-sidebar");
    opener.setAttribute("aria-expanded", "false");
    opener.setAttribute("aria-haspopup", "dialog");

    const dialog = element("dialog", "", "sidebar");
    dialog.id = "site-sidebar";
    dialog.setAttribute("aria-labelledby", "sidebar-heading");
    const bar = element("div", "", "sidebar-header");
    const label = element("h2", tabs.heading || "メニュー");
    label.id = "sidebar-heading";
    const closer = element("button", "閉じる ×", "menu-close");
    closer.type = "button";
    bar.append(label, closer);
    const nav = element("nav", "", "sidebar-links");
    nav.setAttribute("aria-label", "ページ内ナビゲーション");
    visibleTabs.forEach(item => {
      const link = element("a", item.label);
      link.href = "#" + item.target;
      link.addEventListener("click", () => {
        dialog.close();
        // ダイアログを閉じてから、リンク先の見出しへフォーカスを移します。
        requestAnimationFrame(() => {
          const heading = sections.get(item.target).querySelector("h2");
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        });
      });
      nav.append(link);
    });
    dialog.append(bar, nav);
    opener.addEventListener("click", () => {
      dialog.showModal();
      opener.setAttribute("aria-expanded", "true");
      document.body.classList.add("sidebar-open");
      closer.focus();
    });
    closer.addEventListener("click", () => dialog.close());
    // 背景クリックで閉じます。Escape とフォーカス制御は dialog の標準動作です。
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      opener.setAttribute("aria-expanded", "false");
      document.body.classList.remove("sidebar-open");
    });
    root.append(opener, dialog);
  }
  // ページ本文の表示順：アクセスマップ → リンク → 企画内容 → 案内・注意事項
  sections.forEach(node => root.append(node));
})();
