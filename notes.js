/* Notes for Gordon: optional per-section "love it / change it" plus a note, collected in one drawer.
   Off until the reader turns on "Leave notes". Each note keeps the version it was written on.
   Saved only on this device. Copy, text or email the notes; no recipient is ever stored in the page. */
(function () {
  var cfg = window.NOTES_CONFIG || {};
  var KEY = 'notes-' + (cfg.site || location.pathname);
  var data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { data = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} paintCount(); }

  var css = document.createElement('style');
  css.textContent = [
    'html:not(.nf-on) .nf-bar{display:none!important}',
    '.nf-dock{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:70;display:flex;gap:8px}',
    '.nf-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:22px 0 0;padding:10px 12px;border:1px dashed currentColor;border-radius:14px;opacity:.92;font:600 14px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.nf-bar b{font-weight:800;margin-right:4px}',
    '.nf-bar button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:8px 12px;font:700 13px system-ui,-apple-system,sans-serif;cursor:pointer;min-height:40px}',
    '.nf-bar button[aria-pressed="true"]{background:currentColor}',
    '.nf-bar button[aria-pressed="true"] span{filter:invert(1)}',
    '.nf-bar input{flex:1 1 220px;min-width:0;border:1px solid currentColor;background:transparent;color:inherit;border-radius:10px;padding:9px 11px;font:400 15px system-ui,-apple-system,sans-serif;min-height:40px}',
    '.nf-fab{appearance:none;border:0;border-radius:999px;padding:12px 16px;background:#111;color:#fff;font:800 14px system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px #0006;cursor:pointer;min-height:46px}',
    '.nf-fab[aria-pressed="true"]{background:#ffd166;color:#111}',
    'html:not(.nf-on) .nf-send{display:none}',
    '.nf-fab i{font-style:normal;background:#ffd166;color:#111;border-radius:999px;padding:1px 8px;margin-left:8px}',
    '.nf-panel{position:fixed;right:14px;bottom:calc(70px + env(safe-area-inset-bottom,0px));z-index:71;width:min(420px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;background:#fff;color:#111;border-radius:18px;box-shadow:0 20px 60px #0007;padding:18px;display:grid;gap:12px;font:400 15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.nf-panel[hidden]{display:none!important}',
    '.nf-panel h2{font:800 20px system-ui,-apple-system,sans-serif;margin:0;text-transform:none;letter-spacing:0}',
    '.nf-panel ul{margin:0;padding-left:18px;display:grid;gap:6px}',
    '.nf-panel input{width:100%;border:1px solid #bbb;border-radius:10px;padding:10px;font:400 15px system-ui,-apple-system,sans-serif;min-height:44px}',
    '.nf-panel textarea{width:100%;min-height:80px;border:1px solid #bbb;border-radius:10px;padding:10px;font:400 15px system-ui,-apple-system,sans-serif}',
    '.nf-row{display:flex;flex-wrap:wrap;gap:8px}',
    '.nf-row a,.nf-row button{appearance:none;border:1px solid #111;background:#111;color:#fff;text-decoration:none;border-radius:999px;padding:10px 14px;font:700 14px system-ui,-apple-system,sans-serif;cursor:pointer;min-height:44px;display:inline-flex;align-items:center}',
    '.nf-row .ghost{background:#fff;color:#111}',
    '.nf-small{color:#555;font-size:13px}',
    '@media (max-width:560px){.nf-dock{bottom:calc(76px + env(safe-area-inset-bottom,0px))}.nf-panel{bottom:calc(132px + env(safe-area-inset-bottom,0px))}}'
  ].join('\n');
  document.head.appendChild(css);

  function look() { var l = document.documentElement.getAttribute('data-look'); return l ? ((cfg.lookNames || {})[l] || l) : (cfg.version || ''); }
  var secs = [].slice.call(document.querySelectorAll('[data-note]'));
  secs.forEach(function (sec) {
    var name = sec.getAttribute('data-note');
    var d = data[name] || {};
    var bar = document.createElement('div');
    bar.className = 'nf-bar';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Your notes on ' + name);
    bar.innerHTML = '<b>' + name + ':</b><button type="button" data-v="love"><span>Love it</span></button><button type="button" data-v="change"><span>Change it</span></button><input type="text" maxlength="240" placeholder="What would you keep or change?" aria-label="Note on ' + name + '">';
    var inp = bar.querySelector('input');
    inp.value = d.note || '';
    function paint() { [].forEach.call(bar.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', (data[name] || {}).v === b.dataset.v); }); }
    [].forEach.call(bar.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () { var cur = data[name] || {}; cur.v = cur.v === b.dataset.v ? '' : b.dataset.v; cur.look = look(); data[name] = cur; save(); paint(); });
    });
    inp.addEventListener('input', function () { var cur = data[name] || {}; cur.note = inp.value; cur.look = look(); data[name] = cur; save(); });
    paint();
    (sec.querySelector('[data-note-slot]') || sec).appendChild(bar);
  });

  var dock = document.createElement('div'); dock.className = 'nf-dock';
  var sw = document.createElement('button');
  sw.type = 'button'; sw.className = 'nf-fab'; sw.setAttribute('aria-pressed', 'false'); sw.textContent = 'Leave notes';
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'nf-fab nf-send'; fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = 'Send notes<i id="nf-count">0</i>';
  dock.appendChild(sw); dock.appendChild(fab);
  function setMode(on) { document.documentElement.classList.toggle('nf-on', on); sw.setAttribute('aria-pressed', on); sw.textContent = on ? 'Notes on' : 'Leave notes'; if (!on && !panel.hidden) toggle(); }
  sw.addEventListener('click', function () { setMode(!document.documentElement.classList.contains('nf-on')); });
  var panel = document.createElement('div');
  panel.className = 'nf-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Your notes');
  document.body.appendChild(dock); document.body.appendChild(panel);

  function text() {
    var lines = [(cfg.title || document.title) + ': notes from ' + (data._who || 'a reviewer')];
    secs.forEach(function (sec) {
      var n = sec.getAttribute('data-note'), d = data[n];
      if (!d || (!d.v && !d.note)) return;
      lines.push('- ' + n + ': ' + (d.v === 'love' ? 'LOVE IT' : d.v === 'change' ? 'CHANGE IT' : 'note') + (d.note ? ' · ' + d.note : '') + (d.look ? ' (on ' + d.look + ')' : ''));
    });
    if (data._overall) lines.push('Overall: ' + data._overall);
    return lines.join('\n');
  }
  function paintCount() {
    var n = 0; Object.keys(data).forEach(function (k) { if (k.charAt(0) !== '_' && data[k] && (data[k].v || data[k].note)) n++; });
    var c = document.getElementById('nf-count'); if (c) c.textContent = n;
  }
  function render() {
    var t = text();
    panel.innerHTML = '<h2>' + (cfg.label || 'Notes for Gordon') + '</h2>' +
      '<p class="nf-small">With notes on, tap Love it or Change it on any section, add a line, and send it all in one go. Saved only on this device.</p>' +
      '<label class="nf-small" for="nf-who">Who is reviewing?</label><input id="nf-who" maxlength="60" placeholder="Your name" autocomplete="off">' +
      '<label class="nf-small" for="nf-overall">Anything else?</label><textarea id="nf-overall" maxlength="600" placeholder="The big picture, in a sentence or two"></textarea>' +
      '<pre style="white-space:pre-wrap;margin:0;background:#f4f4f4;border-radius:10px;padding:10px;font:400 13px ui-monospace,Menlo,monospace" id="nf-preview"></pre>' +
      '<div class="nf-row"><button type="button" id="nf-copy">Copy notes</button><a id="nf-sms" href="#">Text them</a><a id="nf-mail" class="ghost" href="#">Email them</a><button type="button" class="ghost" id="nf-close">Close</button></div>' +
      '<p class="nf-small" id="nf-status" role="status"></p>';
    var ta = panel.querySelector('#nf-overall'); ta.value = data._overall || '';
    var wi = panel.querySelector('#nf-who'); wi.value = data._who || '';
    function refresh() { var tt = text(); panel.querySelector('#nf-preview').textContent = tt; panel.querySelector('#nf-sms').href = 'sms:&body=' + encodeURIComponent(tt); panel.querySelector('#nf-mail').href = 'mailto:?subject=' + encodeURIComponent((cfg.title || document.title) + ' notes') + '&body=' + encodeURIComponent(tt); }
    ta.addEventListener('input', function () { data._overall = ta.value; save(); refresh(); });
    wi.addEventListener('input', function () { data._who = wi.value; save(); refresh(); });
    panel.querySelector('#nf-copy').addEventListener('click', function () {
      var st = panel.querySelector('#nf-status'), tt = text();
      if (navigator.clipboard) navigator.clipboard.writeText(tt).then(function () { st.textContent = 'Copied. Paste it into your text to Gordon.'; }, function () { st.textContent = 'Select the notes above and copy them.'; });
      else st.textContent = 'Select the notes above and copy them.';
    });
    panel.querySelector('#nf-close').addEventListener('click', toggle);
    refresh();
  }
  function toggle() { var open = panel.hidden; if (open) render(); panel.hidden = !open; fab.setAttribute('aria-expanded', open); }
  fab.addEventListener('click', toggle);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) toggle(); });
  paintCount();
})();
