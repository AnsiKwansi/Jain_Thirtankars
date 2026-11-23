/* Left bar lists one page per Tirthankara. Content files stay in content/. */
(function () {
  const STORY_FIELDS = [
    { key: "history", label: "Who was this teacher?", placeholder: "Placeholder. A short true story goes here." },
    { key: "keyTeaching", label: "What did they teach?", placeholder: "Placeholder. One big idea, in words a kid can say." },
    { key: "meaningToday", label: "What does it mean today?", placeholder: "Placeholder. A real place, like school, home, or friends." },
    { key: "youthPractice", label: "What can a kid try this week?", placeholder: "Placeholder. One small thing a kid can actually do." },
    { key: "alsoKnownAs", label: "Other names", placeholder: "Placeholder. Other names, after you have checked them." },
    { key: "emblem", label: "Their lanchan", placeholder: "Placeholder. Name the lanchan, the emblem on the base. Say if both traditions agree." },
    { key: "traditionNote", label: "Which telling we followed", placeholder: "Placeholder. If two tellings disagree, say which one you used." },
    { key: "openQuestion", label: "A question we still have", placeholder: "Placeholder. Something the team still wants to check." }
  ];

  const STORY_SOURCES = { key: "sources", label: "Where did we learn this?", placeholder: "Placeholder. The book, site, class, or person." };

  const SHARE_FIELDS = [
    { key: "appearsMoreThanOnce", label: "Ideas we saw more than once", placeholder: "Placeholder. Write this after some stories have words." },
    { key: "refusedToCopy", label: "Lines that were too vague", placeholder: "Placeholder. A sentence that could fit any teacher waits here." },
    { key: "ourPractice", label: "One thing our team will try", placeholder: "Placeholder. One small practice for the five of us." },
    { key: "stillUnfinished", label: "What we are still learning", placeholder: "Placeholder. It is okay to say what is not finished." }
  ];

  const SHARE_SOURCES = { key: "sources", label: "Extra sources", placeholder: "Placeholder. Only if this page used a source of its own." };

  const MAIN_KEYS = ["history", "keyTeaching", "meaningToday", "youthPractice", "sources"];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function blank(value) { return value == null || String(value).trim() === ""; }
  function seats() {
    return (window.SEATS || []).slice().sort(function (a, b) { return a.id - b.id; });
  }
  function roster() { return window.ROSTER || []; }
  function seatById(id) {
    return seats().find(function (seat) { return seat.id === Number(id); });
  }
  function statusOf(record, keys) {
    const ready = keys.every(function (key) { return !blank(record[key]); });
    const started = keys.some(function (key) { return !blank(record[key]); });
    if (ready) return "Ready to read";
    if (started) return "Being written";
    return "Coming soon";
  }

  function route() {
    const hash = location.hash || "#/";
    const story = hash.match(/^#(?:\/t\/|story\/|t\/)(\d+)$/);
    if (story) return { page: "story", id: Number(story[1]) };
    if (hash === "#/share" || hash === "#share") return { page: "share" };
    if (hash === "#/team" || hash === "#/about" || hash === "#team" || hash === "#about") return { page: "about" };
    if (hash === "#/" || hash === "#/home" || hash === "#top" || hash === "") return { page: "home" };
    return { page: "missing" };
  }

  function fieldBlock(field, value, extraClass) {
    const empty = blank(value);
    return (
      '<section class="block' + (extraClass ? " " + extraClass : "") + '"><h3>' + esc(field.label) + "</h3>" +
      '<div class="slot' + (empty ? "" : " filled") + '">' +
      esc(empty ? field.placeholder : value) +
      "</div></section>"
    );
  }

  function hero(title, sub, greet, pill) {
    return (
      '<header class="hero">' +
      "<h1>" + esc(title) + "</h1>" +
      (sub ? '<p class="sub">' + esc(sub) + "</p>" : "") +
      (greet ? '<p class="greet">' + greet + "</p>" : "") +
      (pill ? '<p class="pill">' + esc(pill) + "</p>" : "") +
      "</header>"
    );
  }

  const GROUPS = [
    { id: "a", label: "Stories 1–5", from: 1, to: 5 },
    { id: "b", label: "Stories 6–10", from: 6, to: 10 },
    { id: "c", label: "Stories 11–15", from: 11, to: 15 },
    { id: "d", label: "Stories 16–20", from: 16, to: 20 },
    { id: "e", label: "Stories 21–24", from: 21, to: 24 }
  ];

  const openGroups = { a: true, b: true, c: true, d: true, e: true };

  function storyItem(seat, current) {
    const on = current.page === "story" && current.id === seat.id;
    return (
      "<li><a class=\"story-link" + (on ? " is-current" : "") + "\" href=\"#/t/" + seat.id + "\"" +
      (on ? ' aria-current="page"' : "") + ">" +
      '<span class="num">' + pad(seat.id) + "</span><span>" + esc(seat.name) + "</span></a></li>"
    );
  }

  function setGroup(id, open) {
    openGroups[id] = open;
    const button = document.querySelector('#side-nav .group-toggle[data-group="' + id + '"]');
    const list = document.getElementById("stories-" + id);
    if (!button || !list) return;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    list.hidden = !open;
  }

  function renderNav() {
    const current = route();
    if (current.page === "story") {
      GROUPS.forEach(function (group) {
        if (current.id >= group.from && current.id <= group.to) openGroups[group.id] = true;
      });
    }
    const top = [
      { href: "#/", id: "home", label: "Home" },
      { href: "#/about", id: "about", label: "About" },
      { href: "#/share", id: "share", label: "What we share" }
    ].map(function (item) {
      const on = current.page === item.id;
      return '<a class="side-link' + (on ? " is-current" : "") + '" href="' + item.href + '"' +
        (on ? ' aria-current="page"' : "") + ">" + esc(item.label) + "</a>";
    }).join("");

    const groups = GROUPS.map(function (group) {
      const open = openGroups[group.id] !== false;
      const items = seats().filter(function (seat) {
        return seat.id >= group.from && seat.id <= group.to;
      }).map(function (seat) { return storyItem(seat, current); }).join("");
      return (
        '<button type="button" class="group-toggle" data-group="' + group.id + '" aria-expanded="' +
        (open ? "true" : "false") + '" aria-controls="stories-' + group.id + '">' +
        "<span>" + esc(group.label) + '</span><span class="chev" aria-hidden="true"></span></button>' +
        '<ul class="group-list" id="stories-' + group.id + '"' + (open ? "" : " hidden") + ">" + items + "</ul>"
      );
    }).join("");

    const missing = [];
    for (let i = 1; i <= 24; i += 1) {
      if (!seatById(i)) missing.push(pad(i));
    }
    const warn = missing.length
      ? '<p class="audit">Story ' + missing.join(", ") + " did not load. Check that file for a broken quote.</p>"
      : "";
    document.getElementById("side-nav").innerHTML = warn + top + groups;
  }

  function renderHome() {
    const starter = [1, 16, 24].map(seatById).filter(Boolean).map(function (seat) {
      return '<a class="pick" href="#/t/' + seat.id + '"><span>' + pad(seat.id) + "</span>" + esc(seat.name) + "</a>";
    }).join("");
    return (
      '<header class="hero">' +
      '<p class="hello-tag">Hello!</p>' +
      "<h1>Welcome</h1>" +
      '<p class="sub">Come meet 24 Jain teachers, one story at a time.</p>' +
      '<p class="greet">Jai Jinendra</p>' +
      "</header>" +
      '<article class="panel">' +
      "<h2>You are in the right place</h2>" +
      '<p class="lead">A Tirthankara is a Jain teacher. There are 24 of them. This site gives each teacher one page. The list on the left is how you get there.</p>' +
      '<div class="q-grid steps">' +
      '<article class="q-card"><span>1</span><h3>Look left</h3><p>Every teacher has a name in the list.</p></article>' +
      '<article class="q-card"><span>2</span><h3>Open a page</h3><p>Click a name. That story opens here.</p></article>' +
      '<article class="q-card"><span>3</span><h3>Read and try</h3><p>Learn one idea, then try it this week.</p></article>' +
      "</div>" +
      '<div class="welcome-actions">' +
      '<a class="go" href="#/t/1">Start with the first story</a>' +
      '<a class="quiet" href="#/about">See who is writing</a>' +
      "</div>" +
      "<h2 class=\"split-title\">Not sure where to start?</h2>" +
      '<p class="lead">These three are good first visits. Any other name works too.</p>' +
      '<div class="picks">' + starter + "</div>" +
      "<h2 class=\"split-title\">What every story page has</h2>" +
      '<div class="q-grid">' +
      '<article class="q-card"><span>1</span><h3>Who they were</h3><p>A short true story.</p></article>' +
      '<article class="q-card"><span>2</span><h3>What they taught</h3><p>One big idea.</p></article>' +
      '<article class="q-card"><span>3</span><h3>What it means now</h3><p>At school, at home, or with friends.</p></article>' +
      '<article class="q-card"><span>4</span><h3>What you can try</h3><p>One small thing this week.</p></article>' +
      "</div>" +
      '<p class="note welcome-note">If a page says Coming soon, the story is still being written. You can peek, and come back when the words are there.</p>' +
      "</article>"
    );
  }

  function safeUrl(url) {
    try {
      const parsed = new URL(String(url || "").trim());
      if (parsed.protocol !== "https:") return "";
      return parsed.href;
    } catch (error) {
      return "";
    }
  }

  function beats(value) {
    const text = String(value || "").trim();
    if (!text) return [];
    const parts = text.match(/[^.!?]+[.!?]+(?:"|”)?/g);
    if (!parts) return [text];
    const lines = parts.map(function (part) { return part.trim(); }).filter(Boolean);
    return lines.length ? lines : [text];
  }

  function storyField(key) {
    return STORY_FIELDS.find(function (field) { return field.key === key; });
  }

  function shown(field, value) {
    return esc(blank(value) ? field.placeholder : value);
  }

  const HORSE = '<svg viewBox="0 0 72 56" aria-hidden="true"><g fill="currentColor"><ellipse cx="30" cy="30" rx="18" ry="11"/><path d="M44 26c3-8 8-16 18-15-1 5-4 8-8 10 5 1 9 5 8 9-5 0-9-3-11-6-3 4-6 6-7 6z"/><rect x="16" y="38" width="5" height="14" rx="2"/><rect x="27" y="38" width="5" height="14" rx="2"/><rect x="39" y="38" width="5" height="14" rx="2"/><path d="M14 26c-8 1-12 8-8 13 5-3 8-6 10-9z"/></g></svg>';

  function storyBeats(value, placeholder) {
    if (blank(value)) return '<p class="story-empty">' + esc(placeholder) + "</p>";
    return '<ol class="story-steps">' + beats(value).map(function (line, index) {
      return "<li><span>" + (index + 1) + "</span><p>" + esc(line) + "</p></li>";
    }).join("") + "</ol>";
  }

  function learnCard(field, value, tone) {
    const empty = blank(value);
    return (
      '<article class="learn-card ' + tone + (empty ? " is-empty" : "") + '">' +
      "<h3>" + esc(field.label) + "</h3><p>" + shown(field, value) + "</p></article>"
    );
  }

  function mediaBlock(seat) {
    if (!seat.media || !seat.media.length) {
      return '<p class="picture-wait">Pictures and videos will show up here when this story has them.</p>';
    }
    const cards = seat.media.map(function (item) {
      const href = safeUrl(item.href);
      const src = safeUrl(item.src);
      const title = esc(item.title || "Picture");
      const caption = esc(item.caption || "");
      const credit = esc(item.credit || "");
      let visual = "";
      if (item.kind === "image" && src) {
        const img = '<img src="' + esc(src) + '" alt="' + title + '">';
        visual = href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + img + "</a>" : img;
      } else if (href) {
        visual = '<a class="media-link" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">Open this video list</a>';
      }
      return (
        '<article class="media-card' + (item.kind === "video" ? " is-video" : "") + '">' +
        visual +
        '<div class="cap"><h3>' + title + "</h3>" +
        (caption ? "<p>" + caption + "</p>" : "") +
        (credit ? '<p class="credit">' + credit + "</p>" : "") +
        "</div></article>"
      );
    }).join("");
    const note = seat.media && seat.media.length
      ? '<p class="file-note">Writers: copy the media list in this file. A picture needs a link, the maker’s name, and a license.</p>'
      : "";
    return '<div class="media-grid">' + cards + "</div>" + note;
  }

  function renderStory(id) {
    const seat = seatById(id);
    if (!seat) {
      return hero("That page is not here") +
        '<article class="panel"><p class="lead">The left bar lists stories 01 through 24.</p></article>';
    }
    const who = storyField("history");
    const taught = storyField("keyTeaching");
    const today = storyField("meaningToday");
    const practice = storyField("youthPractice");
    const names = storyField("alsoKnownAs");
    const emblem = storyField("emblem");
    const telling = storyField("traditionNote");
    const question = storyField("openQuestion");
    const horse = /horse/i.test(seat.emblem || "");
    const symbolWord = blank(seat.emblem) ? "" : (horse ? "Horse" : "Symbol");
    const symbolBanner = symbolWord
      ? '<div class="symbol-banner"><div class="symbol-mark">' + (horse ? HORSE : "<span>★</span>") + "</div><div><strong>" +
        esc(symbolWord) + "</strong><p>His lanchan. The mark that tells him apart.</p></div></div>"
      : "";
    const tabs = [
      ["story", "Story"],
      ["learn", "Learn"],
      ["pictures", "Pictures"],
      ["facts", "Facts"],
      ["sources", "Sources"]
    ].map(function (tab, index) {
      const on = index === 0;
      return '<button type="button" class="story-tab" role="tab" id="tab-' + tab[0] + '" data-tab="' + tab[0] +
        '" aria-selected="' + (on ? "true" : "false") + '" aria-controls="panel-' + tab[0] + '" tabindex="' + (on ? "0" : "-1") + '">' +
        '<span class="tab-num">' + (index + 1) + "</span>" + esc(tab[1]) + "</button>";
    }).join("");

    return (
      hero(seat.name, "Story " + pad(seat.id), "", statusOf(seat, MAIN_KEYS)) +
      '<article class="panel story-board">' +
      '<div class="story-tabs" role="tablist" aria-label="Parts of this story">' + tabs + "</div>" +
      '<div class="tab-panel is-on" role="tabpanel" id="panel-story" data-panel="story">' +
      storyBeats(seat.history, who.placeholder) + "</div>" +
      '<div class="tab-panel" role="tabpanel" id="panel-learn" data-panel="learn">' +
      '<div class="learn-grid">' +
      learnCard(taught, seat.keyTeaching, "idea") +
      learnCard(today, seat.meaningToday, "today") +
      learnCard(practice, seat.youthPractice, "try") +
      "</div></div>" +
      '<div class="tab-panel" role="tabpanel" id="panel-pictures" data-panel="pictures">' +
      mediaBlock(seat) + "</div>" +
      '<div class="tab-panel" role="tabpanel" id="panel-facts" data-panel="facts">' +
      symbolBanner +
      '<div class="fact-grid">' +
      '<article class="fact-card wide' + (blank(seat.emblem) ? " is-empty" : "") + '"><h3>' + esc(emblem.label) + "</h3><p>" + shown(emblem, seat.emblem) + "</p></article>" +
      '<article class="fact-card wide' + (blank(seat.alsoKnownAs) ? " is-empty" : "") + '"><h3>' + esc(names.label) + "</h3><p>" + shown(names, seat.alsoKnownAs) + "</p></article>" +
      '<article class="fact-card wide' + (blank(seat.traditionNote) ? " is-empty" : "") + '"><h3>' + esc(telling.label) + "</h3><p>" + shown(telling, seat.traditionNote) + "</p></article>" +
      '<article class="fact-card wide' + (blank(seat.openQuestion) ? " is-empty" : "") + '"><h3>' + esc(question.label) + "</h3><p>" + shown(question, seat.openQuestion) + "</p></article>" +
      "</div></div>" +
      '<div class="tab-panel" role="tabpanel" id="panel-sources" data-panel="sources">' +
      fieldBlock(STORY_SOURCES, seat.sources, "sources-last") +
      '<p class="file-note">Writers: type between the quotes in <code>content/tirthankaras/' +
      pad(seat.id) + "-" + esc(seat.slug) + ".js</code>, then refresh.</p></div>" +
      "</article>"
    );
  }

  function renderShare() {
    const shared = window.SHARED || {};
    return (
      hero("What the 24 share", "Written after the other pages have words", "One shared page") +
      '<article class="panel">' +
      '<p class="lead">This page is for ideas that show up in more than one story. It stays a placeholder until those stories exist.</p>' +
      SHARE_FIELDS.map(function (field) { return fieldBlock(field, shared[field.key]); }).join("") +
      '<p class="file-note">Writers: this is <code>content/shared.js</code>.</p>' +
      fieldBlock(SHARE_SOURCES, shared.sources, "sources-last") +
      "</article>"
    );
  }

  function tally() {
    const counts = { "Coming soon": 0, "Being written": 0, "Ready to read": 0 };
    seats().forEach(function (seat) { counts[statusOf(seat, MAIN_KEYS)] += 1; });
    return counts;
  }

  function renderAbout() {
    const counts = tally();
    const statusCards = [
      ["Coming soon", counts["Coming soon"]],
      ["Being written", counts["Being written"]],
      ["Ready to read", counts["Ready to read"]]
    ].map(function (pair) {
      return '<article class="q-card"><span>' + pair[1] + "</span><h3>" + esc(pair[0]) + "</h3><p>of 24 stories</p></article>";
    }).join("");
    const sharedStatus = statusOf(window.SHARED || {}, SHARE_FIELDS.map(function (field) { return field.key; }).concat("sources"));
    const cards = roster().map(function (person) {
      const mine = (person.seats || []).map(seatById).filter(Boolean);
      const started = mine.filter(function (seat) {
        return statusOf(seat, MAIN_KEYS) !== "Coming soon";
      }).length;
      const links = mine.map(function (seat) {
        return '<a href="#/t/' + seat.id + '">' + pad(seat.id) + " " + esc(seat.name) + "</a>";
      });
      if (person.id === "rishik") links.push('<a href="#/share">What we share</a>');
      const hello = blank(person.bio)
        ? '<div class="slot">Placeholder. A short hello can go here.</div>'
        : '<div class="slot filled">' + esc(person.bio) + "</div>";
      const extra = person.id === "rishik" ? " · shared page " + sharedStatus.toLowerCase() : "";
      return (
        '<article class="person"><h3>' + esc(person.name) + "</h3>" +
        '<p class="note">' + started + " of " + mine.length + " stories started" + esc(extra) + "</p>" +
        '<p class="holds">' + links.join(", ") + "</p>" + hello + "</article>"
      );
    }).join("");
    const mentors = ((window.PROJECT && window.PROJECT.mentors) || []).map(function (mentor) {
      return mentor.name;
    });
    const thanks = mentors.length
      ? "<p class=\"note\">" + esc(mentors.join(" and ")) + " helped the team get started.</p>"
      : "";
    return (
      hero("About", "Project status and who writes what") +
      '<article class="panel"><h2>Project status</h2>' +
      '<p class="lead">These counts update when a story page gets words.</p>' +
      '<div class="q-grid status-grid">' + statusCards + "</div>" +
      "<h2 class=\"split-title\">Who writes what</h2>" +
      '<p class="lead">Five people split the 24 pages. Four people write five stories. One person writes four stories and the shared page.</p>' +
      cards + thanks + "</article>"
    );
  }

  function renderMissing() {
    return hero("That page is not here") +
      '<article class="panel"><p class="lead">Use the left bar. Home, About, the shared page, and all 24 stories live there.</p></article>';
  }

  function render() {
    const current = route();
    let html = "";
    let title = "24 Tirthankaras";
    if (!roster().length) {
      html = '<article class="panel"><p class="audit">The team file did not load. Check content/team.js for a broken quote.</p></article>';
    } else if (current.page === "home") {
      html = renderHome();
    } else if (current.page === "story") {
      const seat = seatById(current.id);
      html = renderStory(current.id);
      title = seat ? pad(seat.id) + " " + seat.name : "Story";
    } else if (current.page === "share") {
      html = renderShare();
      title = "What we share";
    } else if (current.page === "about") {
      html = renderAbout();
      title = "About";
    } else {
      html = renderMissing();
    }
    document.title = title;
    document.getElementById("main").innerHTML = html;
    renderNav();
    const currentLink = document.querySelector("#side-nav .is-current");
    if (currentLink) currentLink.scrollIntoView({ block: "nearest" });
    document.getElementById("main").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.getElementById("main").addEventListener("click", function (event) {
    const tab = event.target.closest(".story-tab");
    if (!tab) return;
    const board = tab.closest(".story-board");
    const id = tab.getAttribute("data-tab");
    board.querySelectorAll(".story-tab").forEach(function (button) {
      const on = button === tab;
      button.setAttribute("aria-selected", on ? "true" : "false");
      button.tabIndex = on ? 0 : -1;
    });
    board.querySelectorAll(".tab-panel").forEach(function (panel) {
      panel.classList.toggle("is-on", panel.getAttribute("data-panel") === id);
    });
  });

  document.getElementById("main").addEventListener("keydown", function (event) {
    const tab = event.target.closest(".story-tab");
    if (!tab || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) return;
    const tabs = Array.prototype.slice.call(tab.parentElement.querySelectorAll(".story-tab"));
    const index = tabs.indexOf(tab);
    const next = event.key === "ArrowRight" ? tabs[(index + 1) % tabs.length] : tabs[(index - 1 + tabs.length) % tabs.length];
    next.focus();
    next.click();
    event.preventDefault();
  });

  document.getElementById("side-nav").addEventListener("click", function (event) {
    const toggle = event.target.closest(".group-toggle");
    if (toggle) {
      const id = toggle.getAttribute("data-group");
      setGroup(id, openGroups[id] === false);
      return;
    }
    if (event.target.closest("a")) closeMenu();
  });

  document.getElementById("expand-all").addEventListener("click", function () {
    GROUPS.forEach(function (group) { setGroup(group.id, true); });
  });

  document.getElementById("collapse-all").addEventListener("click", function () {
    GROUPS.forEach(function (group) { setGroup(group.id, false); });
  });

  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");

  function closeMenu() {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    const open = sidebar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  window.addEventListener("hashchange", function () {
    const hash = location.hash;
    if (hash.indexOf("#story/") === 0 || hash.indexOf("#t/") === 0) {
      history.replaceState(null, "", "#/t/" + hash.split("/").pop());
    }
    render();
  });

  render();
})();
