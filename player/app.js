(() => {
'use strict';
const SI18N = window.SI18N;
const tr = (s, p) => SI18N.tr(s, p);

/* ================= utilità ================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const b64 = (u) => btoa(unescape(encodeURIComponent(u))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let TOKEN = '';
const prox = (u) => '/proxy?k=' + TOKEN + '&u=' + b64(u);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} }
};
const fmt = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0');
};
const SECTIONS = { live: 'Live TV', movies: 'Film', series: 'Serie TV' };

let creds = null, data = null, scope = '', prefs = newPrefs(), prog = {};
let SIP = null, LIC = null, BOOT = null, vault = null, profile = null, accId = '', unlocked = false;
function newPrefs() { return { fav: [], hidden: [], locked: [], pin: '' }; }
const L = () => (LIC && LIC.limits) || {};
const skey = (n) => `sp:${profile ? profile.id : 'p1'}:${accId}:${n}`;
let caps = { ffmpeg: false }, view = { name: 'home', cat: null };
let byId = new Map(), catMaps = {}, catNames = {}, observers = [], heroItem = null;
let ms = null; // stato modale

const savePrefs = () => LS.set(skey('prefs'), prefs);
const saveProgAll = () => { pruneHistory(); LS.set(skey('prog'), prog); };
const isFav = (id) => prefs.fav.includes(id);
const hiddenSet = () => new Set(prefs.hidden);

function toast(msg, label, fn) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${label ? `<button>${esc(label)}</button>` : ''}`;
  t.hidden = false;
  if (label) t.querySelector('button').onclick = () => { fn(); t.hidden = true; };
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.hidden = true; }, label ? 6000 : 2800);
}

async function api(path, body) {
  let r;
  try {
    r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Sipario': TOKEN }, body: JSON.stringify(body) });
  } catch { throw new Error(tr("Il server interno di Sipario non risponde. Riavvia l'app.")); }
  const j = await r.json().catch(() => ({ error: 'Risposta non valida dal server' }));
  if (!r.ok || j.error) throw new Error(tr(j.error || 'Errore {status}', j.params || { status: r.status }));
  return j;
}

/* ================= vault, licenza, profili, login ================= */
const COLORS = ['#f3b53f', '#ff8095', '#5fe3aa', '#62cdf5', '#b995ff', '#ff9a5a'];
const EULA_V = '1';
const hashStr = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
const idOf = (c) => hashStr(c.mode === 'm3u' ? c.m3u.trim() : (c.host || '').trim().toLowerCase() + '|' + (c.user || '').trim());
const labelOf = (c) => {
  try {
    if (c.mode === 'm3u') return new URL(c.m3u).host;
    return c.user + ' @ ' + new URL(/^https?:/i.test(c.host) ? c.host : 'http://' + c.host).host;
  } catch { return 'Playlist'; }
};
const saveVault = () => SIP.vaultSet(vault).catch(() => {});
const can = (f) => !!L()[f];
const blockSet = () => { const s = new Set(prefs.hidden); if (!unlocked) prefs.locked.forEach((k) => s.add(k)); return s; };
const blocked = (it) => blockSet().has(it.type + ':' + it.cat);
const pinHash = async (p) => {
  const b = new TextEncoder().encode(profile.id + ':' + p);
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', b))].map((x) => x.toString(16).padStart(2, '0')).join('');
};
function pruneHistory() {
  const n = L().history; if (!n || n > 1e6) return;
  const byTs = (a, b) => ((prog[b] || {}).ts || 0) - ((prog[a] || {}).ts || 0);
  Object.keys(prog).filter((k) => !k.startsWith('last:')).sort(byTs).slice(n).forEach((k) => delete prog[k]);
  Object.keys(prog).filter((k) => k.startsWith('last:')).sort(byTs).slice(n).forEach((k) => delete prog[k]);
}
function loadUserData() {
  prefs = Object.assign(newPrefs(), LS.get(skey('prefs'), {}));
  prog = LS.get(skey('prog'), {}); unlocked = false;
}

function applyTheme() { document.documentElement.dataset.theme = (can('themes') && vault && vault.theme) || 'sipario'; }
function updateBadge() {
  const b = $('#badge'); if (!LIC) return;
  b.className = 'badge ' + LIC.plan;
  b.textContent = LIC.plan === 'pro' ? '★ Premium' : LIC.plan === 'trial' ? tr('Prova Premium · {n} g', { n: LIC.daysLeft }) : tr('Free · Passa a Premium');
}
function updateAvatar() { const a = $('#avatar'); a.style.background = profile.color; a.textContent = profile.name.trim().charAt(0).toUpperCase(); a.title = profile.name; }
function banner(html, ms2) {
  const b = $('#banner'); b.innerHTML = html + '<button data-bclose aria-label="Chiudi">✕</button>'; b.hidden = false;
  clearTimeout(banner._t); if (ms2) banner._t = setTimeout(() => { b.hidden = true; }, ms2);
}
document.addEventListener('click', (e) => { if (e.target.closest('[data-bclose]')) $('#banner').hidden = true; });
document.addEventListener('error', (e) => { if (e.target && e.target.tagName === 'IMG') e.target.remove(); }, true);

/* ----- dialoghi ----- */
function openDlg(html, lock) { const d = $('#dlg'); d.innerHTML = html; d.hidden = false; if (lock) d.dataset.lock = '1'; else delete d.dataset.lock; }
function closeDlg() { const d = $('#dlg'); d.hidden = true; d.innerHTML = ''; delete d.dataset.lock; }
$('#dlg').addEventListener('click', (e) => {
  if (e.target.closest('[data-dclose]') || (e.target.id === 'dlg' && !$('#dlg').dataset.lock)) closeDlg();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#dlg').hidden) { e.stopImmediatePropagation(); if (!$('#dlg').dataset.lock) closeDlg(); }
}, true);

function askText(title, msg, type, init) {
  return new Promise((res) => {
    openDlg(`<div class="dlg-box"><h2>${esc(title)}</h2>${msg ? `<p>${esc(msg)}</p>` : ''}<input id="ask-i" type="${type || 'text'}" value="${esc(init || '')}" autocomplete="off" ${type === 'password' ? 'inputmode="numeric"' : ''}><div class="row-btns" style="margin-top:14px"><button class="btn" id="ask-no">Annulla</button><button class="btn primary" id="ask-ok">OK</button></div></div>`, true);
    const i = $('#ask-i'); i.focus(); i.select();
    const done = (v) => { closeDlg(); res(v); };
    $('#ask-ok').onclick = () => done(i.value); $('#ask-no').onclick = () => done(null);
    i.onkeydown = (e) => { if (e.key === 'Enter') done(i.value); if (e.key === 'Escape') done(null); };
  });
}
function showLegal(title, text) {
  openDlg(`<div class="dlg-box" style="width:min(680px,100%)"><h2>${esc(title)}</h2><div class="legal">${esc(text || 'Documento non disponibile.')}</div><div class="row-btns"><button class="btn primary" data-dclose>Chiudi</button></div></div>`);
}
let eulaRes = null;
const legalText = (n) => (SI18N.lang() === 'it' ? BOOT.legal[n] : (BOOT.legal[n + 'En'] || BOOT.legal[n])) || '';
function renderEula() {
  openDlg(`<div class="dlg-box" style="width:min(640px,100%)"><div class="dlg-top"><div class="logo sm">Sipario</div><select class="langsel" aria-label="Lingua"></select></div><h2 style="margin-top:10px">Prima di iniziare</h2>
    <p><b style="color:var(--text)">Sipario è un semplice lettore.</b> Non fornisce, non include e non distribuisce canali, film, serie o playlist. Puoi usarlo solo con contenuti per i quali hai un diritto legittimo di accesso, ed è tua la responsabilità di ciò che riproduci.</p>
    <div class="legal">${esc(legalText('eula'))}</div>
    <label class="chk" style="margin-top:12px"><input type="checkbox" id="eula-chk"> Ho letto e accetto i Termini d'uso e l'informativa sulla privacy</label>
    <div class="row-btns"><button class="btn" id="eula-priv">Informativa privacy</button><button class="btn" id="eula-no">Esci</button><button class="btn primary" id="eula-ok" disabled>Accetto e continuo</button></div></div>`, true);
  SI18N.fillSelects();
  $('#eula-chk').onchange = (e) => { $('#eula-ok').disabled = !e.target.checked; };
  $('#eula-no').onclick = () => SIP.quit();
  $('#eula-priv').onclick = () => showLegal('Informativa sulla privacy', legalText('privacy'));
  $('#eula-ok').onclick = () => { vault.eula = EULA_V; saveVault(); const r = eulaRes; eulaRes = null; closeDlg(); if (r) r(); };
}
function showEula() { return new Promise((res) => { eulaRes = res; renderEula(); }); }

/* ----- upgrade / licenza ----- */
function featRows() {
  const f = BOOT.cfg.free, p = BOOT.cfg.pro;
  return [
    ['Playlist salvate', String(f.accounts), 'Illimitate'],
    ['Profili (preferiti e cronologia separati)', String(f.profiles), tr('Fino a {n}', { n: p.profiles })],
    ['Preferiti', String(f.favorites), 'Illimitati'],
    ['Cronologia e "riprendi da dove eri"', tr('Ultimi {n}', { n: f.history }), 'Completa'],
    ['Categorie nascoste', tr('Fino a {n}', { n: f.hidden }), 'Illimitate'],
    ['Guida TV: in onda ora e a seguire', 0, 1],
    ['Controllo parentale con PIN', 0, 1],
    ['Episodio successivo automatico', 0, 1],
    ['Timer di spegnimento', 0, 1],
    ['Conversione automatica dei formati non supportati', 0, 1],
    ['Temi colore', 0, 1],
    ['Backup e ripristino', 0, 1],
    ['Aggiornamenti futuri', 0, 1]
  ];
}
function openUpgrade(reason) {
  const c = BOOT.cfg, pro = LIC.plan === 'pro';
  const cell = (v, cls) => v === 0 ? '<td class="n">—</td>' : v === 1 ? '<td class="p">✓</td>' : `<td class="${cls}">${esc(v)}</td>`;
  const rows = featRows().map((r) => `<tr><td>${esc(r[0])}</td>${cell(r[1], 'n')}${cell(r[2], 'p')}</tr>`).join('');
  const expTxt = LIC.exp ? tr('scade il {d}', { d: new Date(LIC.exp).toLocaleDateString(SI18N.locale()) }) : tr('licenza a vita');
  openDlg(`<div class="dlg-box up"><button class="x" data-dclose aria-label="Chiudi">✕</button>
    <div class="up-head"><div class="logo sm">Sipario</div><h2>${pro ? 'Grazie per il tuo supporto' : 'Sipario Premium'}</h2>
    <p>${esc(reason || (pro ? 'La tua licenza è attiva.' : LIC.plan === 'trial' ? tr('Stai usando la prova gratuita: {n} giorni rimasti.', { n: LIC.daysLeft }) : 'Sblocca tutto e goditi Sipario senza limiti.'))}</p></div>
    ${pro ? `<div class="lic-ok"><b>Licenza attiva</b><br><span class="hint">${esc(LIC.licensee || '')} · ${esc(expTxt)}</span></div>` : `
    <table class="cmp"><tr><th></th><th>Free</th><th>Premium</th></tr>${rows}</table>
    <div class="up-buy"><div class="price">${esc(c.price)}<small>${esc(c.priceNote)}</small></div><button class="btn primary" id="up-buy">Acquista la licenza</button></div>`}
    <div class="up-act">${pro ? '' : '<h4>Hai già una licenza?</h4><textarea id="up-key" placeholder="Incolla qui la tua licenza (SIPA1.…)" spellcheck="false"></textarea><div class="err" id="up-err" hidden></div><button class="btn" id="up-act">Attiva</button>'}
    ${LIC.error && !pro ? `<div class="err" style="margin-top:10px">${esc(LIC.error)}</div>` : ''}
    <div class="mc">Codice dispositivo: <code>${esc(LIC.machine)}</code><button id="up-copy">Copia</button><small>${pro ? '' : 'Indicalo al momento dell\'acquisto: la licenza sarà legata a questo computer.'}</small></div>
    ${pro ? '<div class="row-btns"><button class="btn sm" id="up-remove">Rimuovi la licenza da questo computer</button></div>' : ''}</div></div>`);
  $('#up-copy').onclick = () => { navigator.clipboard.writeText(LIC.machine).then(() => toast('Codice copiato')).catch(() => {}); };
  if (!pro) {
    $('#up-buy').onclick = () => SIP.open(c.buyUrl.includes('{machine}') ? c.buyUrl.split('{machine}').join(encodeURIComponent(LIC.machine)) : c.buyUrl + (c.buyUrl.includes('?') ? '&' : '?') + 'machine=' + encodeURIComponent(LIC.machine));
    $('#up-act').onclick = async () => {
      const r = await SIP.activate($('#up-key').value);
      if (!r.ok) { const e = $('#up-err'); e.textContent = r.error; e.hidden = false; return; }
      LIC = r.status; updateBadge(); applyTheme(); closeDlg(); toast('Licenza attivata. Grazie!'); if (data) render();
    };
  } else {
    $('#up-remove').onclick = async () => {
      if (!confirm(tr('Rimuovere la licenza da questo computer? Per riattivarla ti servirà di nuovo la chiave.'))) return;
      LIC = await SIP.removeLicense(); updateBadge(); applyTheme(); closeDlg(); if (data) render();
    };
  }
}
document.addEventListener('click', (e) => {
  const u = e.target.closest('[data-upgrade]'); if (u) return openUpgrade(u.dataset.upgrade);
  if (e.target.closest('#badge')) return openUpgrade('');
  if (e.target.closest('#pup')) return openUpgrade('La conversione automatica dei formati non supportati è inclusa in Premium.');
});

/* ----- menu profilo ----- */
function openMenu() {
  const m = $('#umenu'); if (!m.hidden) { m.hidden = true; return; }
  m.innerHTML = `<h4>Profili</h4>${vault.profiles.map((p, i) => `<button data-mp="${esc(p.id)}"><span class="dot" style="background:${p.color}"></span>${esc(p.name)}${p.id === profile.id ? ' ✓' : ''}${i >= L().profiles ? ' 🔒' : ''}</button>`).join('')}
    <button data-mpm>Gestisci profili…</button><hr><h4>Playlist</h4>
    ${vault.accounts.map((a, i) => `<button data-ma="${esc(a.id)}">${esc(a.label)}${a.id === accId ? ' ✓' : ''}${i >= L().accounts ? ' 🔒' : ''}</button>`).join('')}
    <button data-mpa>+ Aggiungi playlist</button><hr><button data-mset>Impostazioni</button><button data-mlic>Licenza e Premium</button>`;
  m.hidden = false;
}
$('#avatar').addEventListener('click', (e) => { e.stopPropagation(); openMenu(); });
document.addEventListener('click', (e) => {
  const m = $('#umenu'); if (m.hidden) return;
  const b = e.target.closest('#umenu button');
  if (!b && !e.target.closest('#avatar')) { m.hidden = true; return; }
  if (!b) return;
  m.hidden = true;
  if (b.dataset.mp) return switchProfile(b.dataset.mp);
  if (b.dataset.ma) return useAccount(b.dataset.ma);
  if ('mpm' in b.dataset) return showProfiles();
  if ('mpa' in b.dataset) return addAccount();
  if ('mset' in b.dataset) return go('settings');
  if ('mlic' in b.dataset) return openUpgrade('');
});

/* ----- profili ----- */
let manageMode = false;
function showProfiles() {
  closePlayer(true); closeModal();
  $('#login').hidden = true; $('#app').hidden = true; $('#profiles').hidden = false; manageMode = false; drawProfiles();
}
function drawProfiles() {
  $('#pgrid').innerHTML = vault.profiles.map((p, i) => `<div class="pav" data-pid="${esc(p.id)}" tabindex="0"><span class="c" style="background:${p.color};${i >= L().profiles ? 'opacity:.45' : ''}">${esc(p.name.trim().charAt(0).toUpperCase())}</span><b>${esc(p.name)}${i >= L().profiles ? ' 🔒' : ''}</b>${manageMode && vault.profiles.length > 1 ? `<button class="rm" data-prm="${esc(p.id)}" aria-label="Elimina profilo">×</button>` : ''}</div>`).join('')
    + '<div class="pav add" data-padd tabindex="0"><span class="c">+</span><b>Aggiungi</b></div>';
  $('#pmanage').textContent = manageMode ? 'Fatto' : 'Gestisci profili';
}
function switchProfile(id) {
  const i = vault.profiles.findIndex((p) => p.id === id);
  if (i >= L().profiles) return openUpgrade('Con la versione Free puoi usare un solo profilo.');
  if (id !== profile.id) { closePlayer(true); closeModal(); selectProfile(id); }
}
function selectProfile(id) {
  profile = vault.profiles.find((p) => p.id === id) || vault.profiles[0];
  vault.last.profile = profile.id; saveVault(); updateAvatar();
  $('#profiles').hidden = true;
  if (creds && data) { loadUserData(); $('#app').hidden = false; go('home'); } else startSession();
}
async function addProfile() {
  if (vault.profiles.length >= L().profiles) return openUpgrade(L().profiles <= 1 ? 'I profili multipli sono inclusi in Premium: ognuno ha preferiti e cronologia propri.' : 'Hai raggiunto il numero massimo di profili.');
  const n = await askText('Nome del nuovo profilo', '', 'text'); if (!n || !n.trim()) return;
  vault.profiles.push({ id: 'p' + Date.now().toString(36), name: n.trim().slice(0, 20), color: COLORS[vault.profiles.length % COLORS.length] });
  saveVault(); if (!$('#profiles').hidden) drawProfiles(); else if (view.name === 'settings') render();
}
function deleteProfile(id) {
  if (vault.profiles.length < 2) return;
  const p = vault.profiles.find((x) => x.id === id);
  if (!confirm(tr('Eliminare il profilo "{n}" con i suoi preferiti e la sua cronologia?', { n: p.name }))) return;
  vault.profiles = vault.profiles.filter((x) => x.id !== id);
  Object.keys(localStorage).filter((k) => k.startsWith(`sp:${id}:`)).forEach((k) => localStorage.removeItem(k));
  if (profile.id === id) { profile = vault.profiles[0]; vault.last.profile = profile.id; }
  saveVault(); updateAvatar(); if (!$('#profiles').hidden) drawProfiles(); else render();
}
async function renameProfile(id) {
  const p = vault.profiles.find((x) => x.id === id); const n = await askText('Rinomina profilo', '', 'text', p.name);
  if (n && n.trim()) { p.name = n.trim().slice(0, 20); saveVault(); updateAvatar(); if (!$('#profiles').hidden) drawProfiles(); else render(); }
}
$('#profiles').addEventListener('click', (e) => {
  const rm = e.target.closest('[data-prm]'); if (rm) return deleteProfile(rm.dataset.prm);
  if (e.target.closest('#pmanage')) { manageMode = !manageMode; return drawProfiles(); }
  if (e.target.closest('[data-padd]')) return addProfile();
  const pv = e.target.closest('[data-pid]'); if (!pv) return;
  if (manageMode) return renameProfile(pv.dataset.pid);
  const i = vault.profiles.findIndex((p) => p.id === pv.dataset.pid);
  if (i >= L().profiles) return openUpgrade('Con la versione Free puoi usare un solo profilo.');
  selectProfile(pv.dataset.pid);
});

/* ----- login e playlist ----- */
let mode = 'xtream';
function setMode(m) {
  mode = m;
  document.querySelectorAll('#modeTabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
  $('#fx').hidden = m !== 'xtream'; $('#fm').hidden = m !== 'm3u';
}
document.querySelectorAll('#modeTabs button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
$('#pwToggle').onclick = () => {
  const p = $('#f-pass'); const show = p.type === 'password';
  p.type = show ? 'text' : 'password'; $('#pwToggle').textContent = show ? 'Nascondi' : 'Mostra';
};
function busy(on, msg) { $('#lf').hidden = on; $('#lbusy').hidden = !on; if (msg) $('#lmsg').textContent = msg; }
function showLogin(err) {
  $('#login').hidden = false; $('#profiles').hidden = true; $('#app').hidden = true; busy(false);
  $('#lcancel').hidden = !(creds && data);
  const e = $('#lerr'); e.hidden = !err; e.textContent = err || '';
}
$('#lcancel').onclick = () => { $('#login').hidden = true; $('#app').hidden = false; };
function fillForm(c) {
  setMode((c && c.mode) || 'xtream');
  $('#f-host').value = (c && c.host) || ''; $('#f-user').value = (c && c.user) || ''; $('#f-pass').value = (c && c.pass) || ''; $('#f-m3u').value = (c && c.m3u) || '';
}

async function doLogin(c, opt) {
  opt = opt || {};
  closePlayer(true); closeModal();
  $('#login').hidden = false; $('#profiles').hidden = true; $('#app').hidden = true; $('#lerr').hidden = true;
  busy(true, 'Verifica delle credenziali…');
  try {
    const id = idOf(c), exists = vault.accounts.some((a) => a.id === id);
    if (opt.remember !== false && !exists && vault.accounts.length >= L().accounts) {
      openUpgrade('Con la versione Free puoi salvare una sola playlist. Con Premium ne aggiungi quante ne vuoi.');
      throw new Error('Limite playlist raggiunto: con Free puoi salvarne una sola. Togli la spunta "Ricorda" per usarla solo in questa sessione.');
    }
    await api('/api/login', c);
    $('#lmsg').textContent = 'Caricamento del catalogo… con liste grandi può richiedere un minuto.';
    const cat = await api('/api/catalog', c);
    creds = c; accId = id;
    scope = c.mode === 'm3u' ? c.m3u : (c.host || '') + '|' + c.user;
    if (opt.remember !== false) {
      const entry = { id, label: labelOf(c), creds: c };
      const i = vault.accounts.findIndex((a) => a.id === id);
      if (i >= 0) vault.accounts[i] = entry; else vault.accounts.push(entry);
      vault.last.account = id; saveVault();
    }
    loadUserData(); prepare(cat);
    $('#login').hidden = true; $('#app').hidden = false; updateAvatar();
    go('home'); trialNudge();
  } catch (e) {
    showLogin(e.message);
  }
}
function trialNudge() {
  if (trialNudge.done) return; trialNudge.done = true;
  if (LIC.plan === 'trial') banner(esc(tr(LIC.daysLeft === 1 ? 'Prova Premium attiva: 1 giorno rimasto.' : 'Prova Premium attiva: {n} giorni rimasti.', { n: LIC.daysLeft })) + ' <button data-upgrade="">Scopri Premium</button>', 9000);
  else if (LIC.plan === 'free' && LIC.trialEnded) banner('La prova Premium è terminata: Sipario è passato alla versione Free. <button data-upgrade="">Vedi cosa sblocca Premium</button>', 12000);
}
$('#lf').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const remember = $('#f-remember').checked;
  const c = mode === 'm3u'
    ? { mode: 'm3u', m3u: $('#f-m3u').value.trim() }
    : { mode: 'xtream', host: $('#f-host').value.trim(), user: $('#f-user').value.trim(), pass: $('#f-pass').value };
  doLogin(c, { remember });
});
function startSession() {
  const acc = vault.accounts.find((a) => a.id === vault.last.account) || vault.accounts[0];
  if (!acc) return showLogin();
  fillForm(acc.creds); doLogin(acc.creds, { remember: true });
}
function logout() { closePlayer(true); closeModal(); creds = null; data = null; accId = ''; showLogin(); }
function useAccount(id) {
  const i = vault.accounts.findIndex((a) => a.id === id); if (i < 0 || id === accId) return;
  if (i >= L().accounts) return openUpgrade('Con la versione Free puoi usare una sola playlist.');
  doLogin(vault.accounts[i].creds, { remember: true });
}
function addAccount() {
  if (vault.accounts.length >= L().accounts) return openUpgrade('Con la versione Free puoi salvare una sola playlist. Con Premium ne aggiungi quante ne vuoi.');
  fillForm(null); showLogin();
}
function removeAccount(id) {
  const a = vault.accounts.find((x) => x.id === id); if (!a) return;
  if (!confirm(tr('Rimuovere la playlist "{n}"? Preferiti e cronologia collegati verranno eliminati.', { n: a.label }))) return;
  vault.accounts = vault.accounts.filter((x) => x.id !== id);
  Object.keys(localStorage).filter((k) => k.startsWith('sp:') && k.split(':')[2] === id).forEach((k) => localStorage.removeItem(k));
  if (vault.last.account === id) vault.last.account = '';
  saveVault();
  if (id === accId) logout(); else render();
}

/* ================= dati ================= */
function prepare(cat) {
  data = cat; byId = new Map(); catMaps = {}; catNames = {};
  for (const sec of Object.keys(SECTIONS)) {
    const d = data[sec] || (data[sec] = { cats: [], items: [] });
    const m = new Map(); const names = new Map(d.cats.map((c) => [c.id, c.name]));
    for (const it of d.items) {
      it.type = sec; it._n = (it.name || '').toLowerCase();
      if (!names.has(it.cat)) names.set(it.cat, 'Altro');
      byId.set(it.id, it);
      if (!m.has(it.cat)) m.set(it.cat, []);
      m.get(it.cat).push(it);
    }
    const order = [];
    d.cats.forEach((c) => { if (m.has(c.id) && !order.includes(c.id)) order.push(c.id); });
    m.forEach((_, k) => { if (!order.includes(k)) order.push(k); });
    catMaps[sec] = m; catNames[sec] = names;
    d.catList = order.map((id) => ({ id, name: names.get(id) }));
  }
  const pool = [...data.movies.items, ...data.series.items].filter((i) => i.logo);
  heroItem = pool.length ? pool[Math.floor(Math.random() * Math.min(pool.length, 300))] : null;
}
const visCats = (sec) => { const h = blockSet(); return data[sec].catList.filter((c) => !h.has(sec + ':' + c.id)); };
const visItems = (sec) => { const h = blockSet(); return data[sec].items.filter((i) => !h.has(sec + ':' + i.cat)); };

/* ================= rendering ================= */
function card(it, pp, label) {
  const p = pp || prog[it.id];
  const pct = p && p.d && !p.done ? Math.min(100, (p.t / p.d) * 100) : 0;
  const f = isFav(it.id);
  return `<div class="card ${it.type}" data-id="${esc(it.id)}" title="${esc(it.name)}">
    <div class="art"><span class="ph">${esc((it.name || '?').trim().charAt(0).toUpperCase())}</span>
    ${it.logo ? `<img loading="lazy" referrerpolicy="no-referrer" src="${esc(it.logo)}" alt="">` : ''}
    <button class="fav ${f ? 'on' : ''}" data-fav="${esc(it.id)}" aria-label="Preferito">${f ? '★' : '☆'}</button>
    ${pct ? `<i class="bar"><b style="width:${pct}%"></b></i>` : ''}</div>
    <div class="cap">${esc(it.name)}</div>${label ? `<div class="sub">${esc(label)}</div>` : ''}</div>`;
}

function rowHtml(title, items, catKey) {
  const shown = items.slice(0, 40);
  return `<section class="row"><div class="rh"><h3 ${catKey ? `data-cat="${esc(catKey)}"` : ''}>${esc(title)}</h3>
    ${catKey ? `<button class="hide" data-hide="${esc(catKey)}">Nascondi categoria</button>` : ''}</div>
    <button class="arrow l" data-scroll="-1" aria-label="Indietro">‹</button>
    <div class="strip">${shown.map((i) => card(i)).join('')}</div>
    <button class="arrow r" data-scroll="1" aria-label="Avanti">›</button></section>`;
}

function mountGrid(el, items, cls) {
  el.className = 'grid ' + (cls || ''); el.innerHTML = '';
  let i = 0; const N = 90;
  const sent = document.createElement('div'); sent.className = 'more'; el.after(sent);
  const more = () => {
    el.insertAdjacentHTML('beforeend', items.slice(i, i + N).map((x) => card(x)).join(''));
    i += N;
    if (i >= items.length) { sent.remove(); io.disconnect(); }
  };
  const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) more(); }, { rootMargin: '600px' });
  observers.push(io); more();
  if (i < items.length) { sent.textContent = 'Caricamento…'; io.observe(sent); }
}

function lazyRows(host, list) {
  let i = 0; const N = 6;
  const sent = document.createElement('div'); host.after(sent);
  const more = () => {
    host.insertAdjacentHTML('beforeend', list.slice(i, i + N).map((r) => rowHtml(r.title, r.items, r.key)).join(''));
    i += N;
    if (i >= list.length) { sent.remove(); io.disconnect(); }
  };
  const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) more(); }, { rootMargin: '800px' });
  observers.push(io); more();
  if (i < list.length) io.observe(sent);
}

function go(name, cat) {
  view = { name, cat: cat || null };
  $('#q').value = '';
  render();
}

function render() {
  observers.forEach((o) => o.disconnect()); observers = [];
  window.scrollTo(0, 0);
  document.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('on', b.dataset.go === view.name));
  const q = $('#q').value.trim();
  $('#q').placeholder = SECTIONS[view.name] ? tr('Cerca in {s}…', { s: tr(SECTIONS[view.name]) }) : tr('Cerca ovunque…');
  if (q) return renderSearch(q);
  const v = $('#view');
  if (view.name === 'home') return renderHome(v);
  if (SECTIONS[view.name]) return renderSection(v, view.name);
  if (view.name === 'fav') return renderFav(v);
  if (view.name === 'settings') return renderSettings(v);
}

function continueList() {
  const out = []; const seen = new Set();
  Object.entries(prog).filter(([k, p]) => !k.startsWith('last:') && p && !p.done && p.t > 10).sort((a, b) => b[1].ts - a[1].ts).forEach(([k, p]) => {
    const it = byId.get(p.sid || k);
    if (it && !seen.has(it.id) && !blocked(it)) { seen.add(it.id); out.push({ it, p }); }
  });
  return out.slice(0, 30);
}

function renderHome(v) {
  let h = '';
  if (heroItem && !blocked(heroItem)) {
    const it = heroItem;
    h += `<div class="hero"><div class="hero-bg" style="background-image:url(&quot;${esc(it.logo)}&quot;)"></div>
      <img class="hero-poster" src="${esc(it.logo)}" alt="" referrerpolicy="no-referrer">
      <div class="hero-in"><span class="tag">${it.type === 'movies' ? 'Film' : 'Serie TV'}</span><h1>${esc(it.name)}</h1>
      ${it.plot ? `<p>${esc(it.plot)}</p>` : ''}
      <div class="btns"><button class="btn primary" data-open="${esc(it.id)}">▶ Guarda</button>
      <button class="btn" data-fav="${esc(it.id)}">${isFav(it.id) ? '★ Nei preferiti' : '☆ Aggiungi ai preferiti'}</button></div></div></div>`;
  }
  const cont = continueList();
  if (cont.length) {
    h += `<section class="row"><div class="rh"><h3>Continua a guardare</h3></div><button class="arrow l" data-scroll="-1">‹</button><div class="strip">${cont.map(({ it, p }) => card(it, p, p.label || tr('Riprendi da {t}', { t: fmt(p.t) }))).join('')}</div><button class="arrow r" data-scroll="1">›</button></section>`;
  }
  const favs = prefs.fav.map((id) => byId.get(id)).filter((i) => i && !blocked(i));
  if (favs.length) h += rowHtml('I tuoi preferiti', favs);
  const sample = (arr, n) => arr.length <= n ? arr : Array.from({ length: n }, (_, i) => arr[Math.floor(i * arr.length / n)]);
  const mv = visItems('movies').filter((i) => i.logo), sr = visItems('series').filter((i) => i.logo), lv = visItems('live');
  if (mv.length) h += rowHtml('Film da scoprire', sample(mv, 40));
  if (sr.length) h += rowHtml('Serie da scoprire', sample(sr, 40));
  if (lv.length) h += rowHtml('Canali live', lv.slice(0, 40));
  if (!h) h = '<div class="empty">Nessun contenuto visibile. Controlla le categorie nascoste nelle Impostazioni.</div>';
  v.innerHTML = h;
}

function renderSection(v, sec) {
  const cats = visCats(sec);
  v.innerHTML = `<div class="sec-head"><h2>${SECTIONS[sec]}</h2>
    <select id="catsel"><option value="">Tutte le categorie</option>${cats.map((c) => `<option value="${esc(c.id)}" ${view.cat === c.id ? 'selected' : ''}>${esc(c.name)} (${catMaps[sec].get(c.id).length})</option>`).join('')}</select></div><div id="sec-body"></div>`;
  $('#catsel').onchange = (e) => { view.cat = e.target.value || null; render(); };
  const body = $('#sec-body');
  if (!cats.length) { body.innerHTML = '<div class="empty">Nessuna categoria visibile in questa sezione.</div>'; return; }
  if (view.cat && catMaps[sec].has(view.cat)) return mountGrid(body, catMaps[sec].get(view.cat), sec === 'live' ? 'live' : '');
  lazyRows(body, cats.map((c) => ({ title: c.name, items: catMaps[sec].get(c.id), key: sec + ':' + c.id })));
}

function renderFav(v) {
  v.innerHTML = '<div class="sec-head"><h2>Preferiti</h2></div><div id="fav-body"></div>';
  const body = $('#fav-body'); let any = false;
  for (const sec of Object.keys(SECTIONS)) {
    const items = prefs.fav.map((id) => byId.get(id)).filter((i) => i && i.type === sec && !blocked(i));
    if (!items.length) continue; any = true;
    body.insertAdjacentHTML('beforeend', `<div class="res-sec"><h3>${SECTIONS[sec]} <small>${items.length}</small></h3><div id="fg-${sec}"></div></div>`);
    mountGrid($('#fg-' + sec), items, sec === 'live' ? 'live' : '');
  }
  if (!any) body.innerHTML = '<div class="empty">Ancora nessun preferito. Tocca la stella su un canale, film o serie per salvarlo qui.</div>';
}

function renderSearch(q) {
  const v = $('#view'); const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const here = $('#qs').value === 'here' && SECTIONS[view.name];
  const secs = here ? [view.name] : Object.keys(SECTIONS);
  v.innerHTML = `<div class="sec-head"><h2>${esc(tr('Risultati per “{q}”', { q }))}</h2></div><div id="res"></div>`;
  let any = false;
  for (const sec of secs) {
    const items = visItems(sec).filter((i) => tokens.every((t) => i._n.includes(t)));
    if (!items.length) continue; any = true;
    $('#res').insertAdjacentHTML('beforeend', `<div class="res-sec"><h3>${SECTIONS[sec]} <small>${esc(tr('{n} risultati', { n: items.length }))}</small></h3><div id="rs-${sec}"></div></div>`);
    mountGrid($('#rs-' + sec), items, sec === 'live' ? 'live' : '');
  }
  if (!any) $('#res').innerHTML = '<div class="empty">Nessun risultato. Prova con meno parole o cambia “Solo qui” in “Ovunque”.</div>';
}

function lockTag(f) { return can(f) ? '' : ' <span class="lock">🔒 Premium</span>'; }
const THEMES = [['sipario', 'Sipario', 'linear-gradient(135deg,#241d3b,#f3b53f)'], ['notte', 'Notte', 'linear-gradient(135deg,#1a2d44,#62cdf5)'], ['bosco', 'Bosco', 'linear-gradient(135deg,#1a3328,#5fe3aa)'], ['rubino', 'Rubino', 'linear-gradient(135deg,#381b27,#ff8095)']];

function renderSettings(v) {
  const h = hiddenSet(), hasPin = !!prefs.pin, cur = (can('themes') && vault.theme) || 'sipario';
  let html = '<div class="sec-head"><h2>Impostazioni</h2></div><div class="set-card"><h3>Lingua</h3><select class="langsel" aria-label="Lingua"></select></div>';

  html += `<div class="set-card"><h3>Aspetto${lockTag('themes')}</h3><div class="swatches">${THEMES.map(([id, n, g]) => `<button class="sw ${cur === id ? 'on' : ''}" data-s="theme:${id}"><i style="background:${g}"></i>${n}${id !== 'sipario' && !can('themes') ? ' 🔒' : ''}</button>`).join('')}</div></div>`;

  html += `<div class="set-card"><h3>Categorie visibili</h3><p class="hint">${esc(tr('Togli la spunta alle categorie che non vuoi vedere. Spariscono da navigazione, home e ricerca.'))}${isFinite(L().hidden) && L().hidden < 1e6 ? ' ' + esc(tr('Con Free puoi nasconderne fino a {n} (ora: {m}).', { n: L().hidden, m: prefs.hidden.length })) : ''}</p><input type="search" id="catfilter" placeholder="Filtra categorie…"></div>`;
  for (const sec of Object.keys(SECTIONS)) {
    html += `<div class="set-card" data-sec="${sec}"><h3>${SECTIONS[sec]}</h3><div class="row-btns"><button class="btn sm" data-all="${sec}:show">Mostra tutte</button><button class="btn sm" data-all="${sec}:hide">Nascondi tutte</button></div>
      <div class="cats">${data[sec].catList.map((c) => `<label data-n="${esc(c.name.toLowerCase())}"><input type="checkbox" data-cat="${esc(sec + ':' + c.id)}" ${h.has(sec + ':' + c.id) ? '' : 'checked'}> ${esc(c.name)} <span class="hint">(${catMaps[sec].get(c.id).length})</span></label>`).join('') || '<span class="hint">Nessuna categoria</span>'}</div></div>`;
  }

  html += `<div class="set-card"><h3>Controllo parentale${lockTag('parental')}</h3><p class="hint">Proteggi intere categorie con un PIN: restano nascoste da home, ricerca e preferiti finché non le sblocchi.</p>
    <div class="row-btns">${!hasPin ? '<button class="btn" data-s="pin-set">Imposta PIN</button>' : `<button class="btn" data-s="pin-change">Cambia PIN</button><button class="btn" data-s="pin-remove">Rimuovi PIN</button>${unlocked ? '<button class="btn" data-s="relock">Blocca di nuovo</button>' : '<button class="btn" data-s="unlock">Sblocca per questa sessione</button>'}`}</div>
    ${hasPin && unlocked ? `<p class="hint" style="margin-top:12px">Scegli le categorie da proteggere:</p>${Object.keys(SECTIONS).map((sec) => `<b>${SECTIONS[sec]}</b><div class="cats" style="max-height:200px">${data[sec].catList.map((c) => `<label><input type="checkbox" data-lock="${esc(sec + ':' + c.id)}" ${prefs.locked.includes(sec + ':' + c.id) ? 'checked' : ''}> ${esc(c.name)}</label>`).join('')}</div>`).join('')}` : hasPin ? '<p class="hint" style="margin-top:10px">Sblocca con il PIN per modificare le categorie protette.</p>' : ''}</div>`;

  html += `<div class="set-card"><h3>Playlist</h3>${vault.accounts.map((a, i) => `<div class="list-row"><div class="grow"><b>${esc(a.label)}</b>${a.id === accId ? ' <span class="hint">· in uso</span>' : ''}${i >= L().accounts ? ' <span class="lock">🔒</span>' : ''}</div>${a.id === accId ? '' : `<button class="btn sm" data-s="acc-use:${esc(a.id)}">Usa</button>`}<button class="btn sm" data-s="acc-del:${esc(a.id)}">Rimuovi</button></div>`).join('') || '<p class="hint">Nessuna playlist salvata.</p>'}
    <div class="row-btns"><button class="btn" data-s="acc-add">+ Aggiungi playlist</button><button class="btn" data-s="refresh">Aggiorna catalogo</button></div></div>`;

  html += `<div class="set-card"><h3>Profili</h3>${vault.profiles.map((p, i) => `<div class="list-row"><span class="dot" style="width:26px;height:26px;border-radius:50%;background:${p.color};flex:none"></span><div class="grow"><b>${esc(p.name)}</b>${p.id === profile.id ? ' <span class="hint">· attivo</span>' : ''}${i >= L().profiles ? ' <span class="lock">🔒</span>' : ''}</div><button class="btn sm" data-s="prof-ren:${esc(p.id)}">Rinomina</button>${vault.profiles.length > 1 ? `<button class="btn sm" data-s="prof-del:${esc(p.id)}">Elimina</button>` : ''}</div>`).join('')}
    <div class="row-btns"><button class="btn" data-s="prof-add">+ Nuovo profilo${can('profiles') && L().profiles > 1 ? '' : ' 🔒'}</button></div></div>`;

  html += `<div class="set-card"><h3>Backup${lockTag('backup')}</h3><p class="hint">Esporta o ripristina preferiti, categorie nascoste e cronologia del profilo attivo.</p>
    <div class="row-btns"><button class="btn" data-s="bk-export">Esporta backup</button><button class="btn" data-s="bk-import">Importa backup</button><button class="btn" data-s="clear">Cancella cronologia</button></div></div>`;

  const lp = LIC.plan;
  html += `<div class="set-card"><h3>Licenza</h3><p class="hint">${lp === 'pro' ? '★ ' + esc(tr('Premium attivo')) + (LIC.licensee ? ' · ' + esc(LIC.licensee) : '') : lp === 'trial' ? esc(tr('Prova Premium: {n} giorni rimasti', { n: LIC.daysLeft })) : esc(tr('Versione Free'))}</p><div class="row-btns"><button class="btn primary" data-s="lic">${lp === 'pro' ? 'Dettagli licenza' : 'Passa a Premium'}</button></div></div>`;

  html += `<div class="set-card"><h3>Informazioni</h3><p class="hint">${esc(tr('Sipario {v} · {c} canali, {m} film, {s} serie', { v: BOOT.version, c: data.live.items.length, m: data.movies.items.length, s: data.series.items.length }))} · ${esc(tr(caps.ffmpeg ? 'conversione video: ffmpeg rilevato' : 'conversione video: ffmpeg non installato (facoltativo)'))}${BOOT.cfg.support ? ' · ' + esc(tr('Assistenza: {e}', { e: BOOT.cfg.support })) : ''}</p>
    <div class="row-btns"><button class="btn sm" data-s="legal:eula">Termini d'uso</button><button class="btn sm" data-s="legal:privacy">Privacy</button><button class="btn sm" data-s="legal:third">Licenze di terze parti</button><button class="btn sm" data-s="logout">Esci dalla playlist</button></div></div>`;

  v.innerHTML = html; SI18N.fillSelects();
  $('#catfilter').oninput = (e) => {
    const t = e.target.value.toLowerCase();
    v.querySelectorAll('.cats label[data-n]').forEach((l) => { l.style.display = l.dataset.n.includes(t) ? '' : 'none'; });
  };
}

async function verifyPin(msg) {
  const p = await askText('Inserisci il PIN', msg || '', 'password'); if (p === null) return false;
  if ((await pinHash(p)) === prefs.pin) return true;
  toast('PIN errato'); return false;
}
async function newPin() {
  const a = await askText('Scegli un PIN', 'Da 4 a 8 cifre', 'password'); if (a === null) return;
  if (!/^\d{4,8}$/.test(a)) return toast('Il PIN deve avere da 4 a 8 cifre');
  const b = await askText('Ripeti il PIN', '', 'password'); if (b === null) return;
  if (a !== b) return toast('I due PIN non coincidono');
  prefs.pin = await pinHash(a); savePrefs(); unlocked = true; toast('PIN impostato'); render();
}

document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-s]'); if (!b) return;
  const s = b.dataset.s, i = s.indexOf(':'), act = i < 0 ? s : s.slice(0, i), arg = i < 0 ? '' : s.slice(i + 1);
  const need = (f, msg) => { if (can(f)) return true; openUpgrade(msg); return false; };
  switch (act) {
    case 'theme':
      if (arg !== 'sipario' && !need('themes', 'I temi colore sono inclusi in Premium.')) return;
      vault.theme = arg; saveVault(); applyTheme(); render(); break;
    case 'pin-set': if (need('parental', 'Il controllo parentale con PIN è incluso in Premium.')) newPin(); break;
    case 'pin-change': if (await verifyPin('Prima conferma il PIN attuale')) newPin(); break;
    case 'pin-remove': if (await verifyPin()) { prefs.pin = ''; prefs.locked = []; savePrefs(); unlocked = false; render(); } break;
    case 'unlock': if (await verifyPin()) { unlocked = true; toast('Categorie sbloccate per questa sessione'); render(); } break;
    case 'relock': unlocked = false; render(); break;
    case 'refresh':
      toast('Aggiornamento in corso…');
      try { const cat = await api('/api/catalog', Object.assign({ refresh: true }, creds)); prepare(cat); toast('Catalogo aggiornato'); render(); } catch (er) { toast(er.message); }
      break;
    case 'clear': if (confirm(tr('Cancellare tutta la cronologia di visione di questo profilo?'))) { prog = {}; saveProgAll(); toast('Cronologia cancellata'); } break;
    case 'logout': logout(); break;
    case 'acc-use': useAccount(arg); break;
    case 'acc-del': removeAccount(arg); break;
    case 'acc-add': addAccount(); break;
    case 'prof-add': addProfile(); break;
    case 'prof-ren': renameProfile(arg); break;
    case 'prof-del': deleteProfile(arg); break;
    case 'lic': openUpgrade(''); break;
    case 'legal': showLegal({ eula: 'Termini d\'uso', privacy: 'Informativa sulla privacy', third: 'Licenze di terze parti' }[arg], legalText(arg)); break;
    case 'bk-export': {
      if (!need('backup', 'Backup e ripristino sono inclusi in Premium.')) return;
      const payload = { app: 'sipario', v: 1, exported: new Date().toISOString(), profile: profile.name, prefs: { fav: prefs.fav, hidden: prefs.hidden, locked: prefs.locked }, prog };
      if (await SIP.saveFile('sipario-backup.json', JSON.stringify(payload, null, 1))) toast('Backup salvato');
      break;
    }
    case 'bk-import': {
      if (!need('backup', 'Backup e ripristino sono inclusi in Premium.')) return;
      const txt = await SIP.openFile(); if (!txt) return;
      try {
        const j = JSON.parse(txt); if (j.app !== 'sipario' || !j.prefs) throw new Error();
        const u = (a, b2) => [...new Set([...(a || []), ...(b2 || [])])];
        prefs.fav = u(prefs.fav, j.prefs.fav); prefs.hidden = u(prefs.hidden, j.prefs.hidden); prefs.locked = u(prefs.locked, j.prefs.locked);
        Object.entries(j.prog || {}).forEach(([k, p]) => { if (!prog[k] || (p.ts || 0) > (prog[k].ts || 0)) prog[k] = p; });
        savePrefs(); saveProgAll(); toast('Backup ripristinato'); render();
      } catch { toast('File di backup non valido'); }
      break;
    }
  }
});

/* ================= eventi globali ================= */
document.addEventListener('click', (e) => {
  const t = e.target;
  const fav = t.closest('[data-fav]');
  if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  const hide = t.closest('[data-hide]');
  if (hide) {
    const key = hide.dataset.hide;
    if (!prefs.hidden.includes(key)) {
      if (prefs.hidden.length >= L().hidden) return openUpgrade(tr('Con la versione Free puoi nascondere fino a {n} categorie. Con Premium sono illimitate.', { n: L().hidden }));
      prefs.hidden.push(key);
    }
    savePrefs();
    const y = window.scrollY; render(); window.scrollTo(0, y);
    toast('Categoria nascosta', 'Annulla', () => { prefs.hidden = prefs.hidden.filter((k) => k !== key); savePrefs(); render(); });
    return;
  }
  const sc = t.closest('[data-scroll]');
  if (sc) { const s = sc.parentElement.querySelector('.strip'); s.scrollBy({ left: Number(sc.dataset.scroll) * s.clientWidth * 0.85, behavior: 'smooth' }); return; }
  const gh = t.closest('[data-go]'); if (gh) { go(gh.dataset.go); return; }
  const op = t.closest('[data-open]'); if (op) { openItem(op.dataset.open); return; }
  const h3 = t.closest('h3[data-cat]');
  if (h3) { const [sec, ...r] = h3.dataset.cat.split(':'); go(sec, r.join(':')); return; }
  const cd = t.closest('.card'); if (cd) { openItem(cd.dataset.id); return; }
  const all = t.closest('[data-all]');
  if (all) {
    const [sec, act] = all.dataset.all.split(':'); const keys = data[sec].catList.map((c) => sec + ':' + c.id);
    const rest = prefs.hidden.filter((k) => !keys.includes(k));
    if (act === 'hide' && rest.length + keys.length > L().hidden) return openUpgrade(tr('Con la versione Free puoi nascondere fino a {n} categorie. Con Premium sono illimitate.', { n: L().hidden }));
    prefs.hidden = rest; if (act === 'hide') prefs.hidden.push(...keys);
    savePrefs(); render(); return;
  }
});
document.addEventListener('change', (e) => {
  const c = e.target.closest('input[data-cat]');
  if (c && c.type === 'checkbox') {
    const k = c.dataset.cat;
    prefs.hidden = prefs.hidden.filter((x) => x !== k);
    if (!c.checked) {
      if (prefs.hidden.length >= L().hidden) { c.checked = true; savePrefs(); return openUpgrade(tr('Con la versione Free puoi nascondere fino a {n} categorie. Con Premium sono illimitate.', { n: L().hidden })); }
      prefs.hidden.push(k);
    }
    savePrefs(); return;
  }
  const lk = e.target.closest('input[data-lock]');
  if (lk) { const k = lk.dataset.lock; prefs.locked = prefs.locked.filter((x) => x !== k); if (lk.checked) prefs.locked.push(k); savePrefs(); }
});

function toggleFav(id) {
  const it = byId.get(id); if (!it) return;
  if (!isFav(id) && prefs.fav.length >= L().favorites) return openUpgrade(tr('Con la versione Free puoi salvare fino a {n} preferiti. Con Premium sono illimitati.', { n: L().favorites }));
  if (isFav(id)) { prefs.fav = prefs.fav.filter((x) => x !== id); toast('Rimosso dai preferiti'); }
  else { prefs.fav.push(id); toast('Aggiunto ai preferiti'); }
  savePrefs();
  document.querySelectorAll(`[data-fav="${CSS.escape(id)}"]`).forEach((b) => {
    if (b.classList.contains('fav')) { b.classList.toggle('on', isFav(id)); b.textContent = isFav(id) ? '★' : '☆'; }
    else b.textContent = isFav(id) ? '★ Nei preferiti' : '☆ Aggiungi ai preferiti';
  });
  if (view.name === 'fav' && !$('#q').value) render();
  if (ms && ms.it.id === id) renderModal();
  if (ctx && (ctx.sid || ctx.id) === id) $('#pfav').textContent = isFav(id) ? '★' : '☆';
}

let qt;
$('#q').addEventListener('input', () => { clearTimeout(qt); qt = setTimeout(render, 220); });
$('#qs').addEventListener('change', () => { if ($('#q').value.trim()) render(); });
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && $('#player').hidden) { e.preventDefault(); $('#q').focus(); }
  if (e.key === 'Escape') {
    if (!$('#player').hidden) { if (!document.fullscreenElement) closePlayer(); }
    else if (!$('#modal').hidden) closeModal();
  }
  if ($('#player').hidden || /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'f') toggleFs();
  else if (k === ' ' && document.activeElement !== V) { e.preventDefault(); V.paused ? V.play() : V.pause(); }
  else if (ctx && ctx.kind === 'vod' && e.key === 'ArrowRight' && mode_ !== 'transcode') V.currentTime += 10;
  else if (ctx && ctx.kind === 'vod' && e.key === 'ArrowLeft' && mode_ !== 'transcode') V.currentTime -= 10;
  else if (e.key === 'PageDown') zap(1);
  else if (e.key === 'PageUp') zap(-1);
});
window.addEventListener('scroll', () => $('#top').classList.toggle('solid', window.scrollY > 40), { passive: true });

/* ================= modale dettaglio ================= */
function closeModal() { $('#modal').hidden = true; ms = null; document.body.classList.remove('noscroll'); }

async function openItem(id) {
  const it = byId.get(id); if (!it) return;
  if (it.type === 'live') {
    const list = (view.name === 'fav' ? prefs.fav.map((x) => byId.get(x)).filter((x) => x && x.type === 'live') : visItems('live').filter((x) => x.cat === it.cat));
    return playLive(it, list.length ? list : [it]);
  }
  ms = { it, info: null, season: null, err: null };
  document.body.classList.add('noscroll');
  $('#modal').hidden = false;
  if (it.type === 'series') {
    renderModal();
    try {
      if (it.seasons) ms.info = { info: {}, seasons: it.seasons };
      else if (it._info) ms.info = it._info;
      else { it._info = await api('/api/series', Object.assign({ sid: it.sid }, creds)); ms.info = it._info; }
      if (!ms.info.seasons.length) throw new Error('Nessun episodio disponibile per questa serie.');
      const t = seriesTarget(); ms.season = t ? t.ep.season : ms.info.seasons[0].n;
    } catch (e) { ms.err = e.message; }
  }
  renderModal();
}
$('#modal').addEventListener('click', (e) => {
  if (e.target.closest('[data-close]') || e.target.id === 'modal') return closeModal();
  const a = e.target.closest('[data-act]'); if (!a || !ms) return;
  const act = a.dataset.act, it = ms.it;
  if (act === 'fav') return toggleFav(it.id);
  if (it.type === 'movies') {
    const p = prog[it.id];
    return openPlayer({ kind: 'vod', id: it.id, title: it.name, url: it.url, startAt: act === 'resume' && p ? p.t : 0 });
  }
  const flat = flatEps();
  if (act === 'ep') { const i = flat.findIndex((x) => x.id === a.dataset.ep); return openPlayer(epCtx(it, flat, i, a.dataset.from === 'resume')); }
  if (act === 'target') { const t = seriesTarget(); return openPlayer(epCtx(it, flat, t.i, t.resume)); }
  if (act === 'restartAll') return openPlayer(epCtx(it, flat, 0, false));
});
$('#modal').addEventListener('change', (e) => {
  if (e.target.id === 'seasel' && ms) { ms.season = Number(e.target.value); renderModal(); }
});

const flatEps = () => ms.info.seasons.flatMap((s) => s.eps.map((e) => Object.assign({ season: s.n }, e)));
function epCtx(it, flat, i, resume) {
  const e = flat[i], p = prog[e.id];
  return {
    kind: 'vod', id: e.id, sid: it.id, dur: e.dur,
    title: `${it.name} · S${e.season}E${e.num}${e.title ? ' – ' + e.title : ''}`,
    label: `S${e.season} · E${e.num}`, url: e.url,
    startAt: resume && p && !p.done ? p.t : 0,
    next: i + 1 < flat.length ? () => epCtx(it, flat, i + 1, false) : null
  };
}
function seriesTarget() {
  if (!ms || !ms.info) return null;
  const flat = flatEps(), last = prog['last:' + ms.it.id];
  if (!last) return { i: 0, ep: flat[0], resume: false, kind: 'start' };
  const i = flat.findIndex((x) => x.id === last.ep);
  if (i < 0) return { i: 0, ep: flat[0], resume: false, kind: 'start' };
  const p = prog[last.ep];
  if (p && !p.done && p.t > 10) return { i, ep: flat[i], resume: true, kind: 'resume', t: p.t };
  if (i + 1 < flat.length) return { i: i + 1, ep: flat[i + 1], resume: false, kind: 'next' };
  return { i: 0, ep: flat[0], resume: false, kind: 'start' };
}

function renderModal() {
  if (!ms) return;
  const it = ms.it, isS = it.type === 'series', info = (ms.info && ms.info.info) || {};
  const plot = it.plot || info.plot || '';
  const meta = [it.year, it.rating && '★ ' + it.rating, info.genre, tr(isS ? 'Serie TV' : 'Film')].filter(Boolean).join('  ·  ');
  const bg = info.backdrop || it.logo;
  let body = '';
  const favBtn = `<button class="btn" data-act="fav">${isFav(it.id) ? '★ Nei preferiti' : '☆ Aggiungi ai preferiti'}</button>`;
  if (!isS) {
    const p = prog[it.id], res = p && !p.done && p.t > 10;
    body = `<div class="actions">${res
      ? `<button class="btn primary" data-act="resume">▶ ${esc(tr('Riprendi da {t}', { t: fmt(p.t) }))}</button><button class="btn" data-act="restart">↺ Ricomincia dall'inizio</button>`
      : '<button class="btn primary" data-act="restart">▶ Riproduci</button>'}${favBtn}</div>`;
  } else if (ms.err) {
    body = `<div class="err" style="margin-top:14px">${esc(ms.err)}</div><div class="actions">${favBtn}</div>`;
  } else if (!ms.info) {
    body = '<div class="empty"><div class="spin" style="margin:auto"></div><p style="margin-top:10px">Carico stagioni ed episodi…</p></div>';
  } else {
    const t = seriesTarget(), main = '▶ ' + (t.kind === 'resume' ? tr('Riprendi S{s}·E{e} da {t}', { s: t.ep.season, e: t.ep.num, t: fmt(t.t) })
      : t.kind === 'next' ? tr('Prossimo episodio: S{s}·E{e}', { s: t.ep.season, e: t.ep.num }) : tr('Inizia dalla prima puntata'));
    const seasons = ms.info.seasons, s = seasons.find((x) => x.n === ms.season) || seasons[0];
    body = `<div class="actions"><button class="btn primary" data-act="target">${main}</button>
      ${t.kind !== 'start' ? '<button class="btn" data-act="restartAll">↺ Ricomincia la serie da capo</button>' : ''}${favBtn}</div>
      <div class="seas"><h3 style="font:600 20px var(--serif)">Episodi</h3><select id="seasel" aria-label="Stagione">${seasons.map((x) => `<option value="${x.n}" ${x.n === s.n ? 'selected' : ''}>${esc(tr('Stagione {n}', { n: x.n }))}</option>`).join('')}</select></div>
      ${s.eps.map((e) => {
        const p = prog[e.id], res = p && !p.done && p.t > 10, pct = p && p.d && !p.done ? Math.min(100, p.t / p.d * 100) : 0;
        return `<div class="ep"><div class="en">${e.num}</div><div class="et"><b>${esc(e.title || tr('Episodio {n}', { n: e.num }))}</b><small>${esc(e.duration || '')}${p && p.done ? esc((e.duration ? ' · ' : '') + tr('Visto')) : ''}</small>${pct ? `<div class="bar"><b style="width:${pct}%"></b></div>` : ''}</div>
        <div class="ea">${res
          ? `<button class="btn sm primary" data-act="ep" data-ep="${esc(e.id)}" data-from="resume">▶ ${fmt(p.t)}</button><button class="btn sm" data-act="ep" data-ep="${esc(e.id)}" data-from="start" title="Dall'inizio">↺</button>`
          : `<button class="btn sm primary" data-act="ep" data-ep="${esc(e.id)}" data-from="start">▶ Riproduci</button>`}</div></div>`;
      }).join('')}`;
  }
  $('#modal').innerHTML = `<div class="sheet"><button class="x" data-close aria-label="Chiudi">✕</button>
    <div class="m-top"><div class="hero-bg" style="background-image:url(&quot;${esc(bg)}&quot;)"></div>
    <div class="m-head">${it.logo ? `<img src="${esc(it.logo)}" alt="" referrerpolicy="no-referrer">` : ''}<div><h2>${esc(it.name)}</h2><div class="meta">${esc(meta)}</div></div></div></div>
    <div class="m-body">${plot ? `<p class="plot">${esc(plot)}</p>` : ''}${body}</div></div>`;
}

/* ================= player ================= */
const V = $('#vid');
let hls = null, mp = null, ctx = null, gen = 0, reasons = [], chain = [], step = 0, failTimer = null, offset = 0, mode_ = '', saveTimer = null, nextTimer = null, idleTimer = null;
const isHls = (u) => /\.m3u8(\?|$)/i.test(u);
const curTime = () => offset + (V.currentTime || 0);

function stopEngines() {
  clearTimeout(failTimer);
  if (hls) { try { hls.destroy(); } catch {} hls = null; }
  if (mp) { try { mp.destroy(); } catch {} mp = null; }
  V.onerror = null; V.pause(); V.removeAttribute('src'); try { V.load(); } catch {}
}
const stat = (on, msg) => { $('#pstat').hidden = !on; if (msg) $('#pmsg').textContent = msg; };

function playLive(it, list) {
  const idx = Math.max(0, list.findIndex((x) => x.id === it.id));
  openPlayer({ kind: 'live', id: it.id, title: it.name, url: it.url, alt: it.alt, list, idx });
}
function zap(d) {
  if (!ctx || ctx.kind !== 'live') return;
  const i = ctx.idx + d; if (i < 0 || i >= ctx.list.length) return;
  playLive(ctx.list[i], ctx.list);
}

function openPlayer(c) {
  saveProg(); clearTimeout(nextTimer); $('#nextbox').hidden = true;
  ctx = c; offset = 0; reasons = [];
  $('#player').hidden = false; document.body.classList.add('noscroll');
  $('#ptitle').textContent = c.title;
  $('#pprev').hidden = c.kind !== 'live' || c.idx <= 0;
  $('#pnext').hidden = c.kind === 'live' ? c.idx >= c.list.length - 1 : !c.next;
  $('#pfav').hidden = c.kind !== 'live' && !byId.get(c.sid || c.id); $('#pfav').textContent = isFav(c.sid || c.id) ? '★' : '☆';
  $('#perr').hidden = true;
  if (c.kind === 'live') {
    chain = isHls(c.url) ? [['hls', c.url]] : [['mpegts', c.url], ['hls', c.url]];
    if (c.alt) chain.push(['mpegts', c.alt]);
    if (caps.ffmpeg && can('transcode')) chain.push(['transcode', c.alt || c.url]);
  } else {
    chain = isHls(c.url) ? [['hls', c.url]] : [['direct', c.url]];
    if (!isHls(c.url) && caps.ffmpeg && can('transcode')) chain.push(['transcode', c.url]);
  }
  runStep(0, c.startAt || 0);
  clearInterval(saveTimer); saveTimer = setInterval(saveProg, 5000);
  wake(); epgStart();
}

function runStep(i, pos) {
  const g = ++gen; step = i;
  if (i > 0 && ctx.kind === 'vod') pos = curTime() || pos;
  stopEngines(); offset = 0;
  const [kind, url] = chain[i]; mode_ = kind;
  stat(true, i ? 'Provo un metodo alternativo…' : 'Caricamento…');
  const next = (why) => { if (g !== gen) return; reasons.push(kind + ': ' + why); if (i + 1 < chain.length) runStep(i + 1, pos); else fail(why); };
  failTimer = setTimeout(() => next('timeout'), kind === 'transcode' ? 45000 : 25000);
  if (kind === 'direct' || kind === 'transcode') V.onerror = () => next('video' + (V.error ? ' (codice ' + V.error.code + ')' : ''));
  const tryPlay = () => { const p = V.play(); if (p && p.catch) p.catch(() => {}); };

  if (kind === 'hls') {
    if (window.Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 40, manifestLoadingMaxRetry: 2, levelLoadingMaxRetry: 2, fragLoadingMaxRetry: 3, startPosition: pos > 0 ? pos : -1 });
      hls.loadSource(prox(url)); hls.attachMedia(V);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      let rec = 0;
      hls.on(Hls.Events.ERROR, (_, d) => {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.MEDIA_ERROR && rec++ < 2) { hls.recoverMediaError(); return; }
        if (d.type === Hls.ErrorTypes.NETWORK_ERROR && rec++ < 1) { hls.startLoad(); return; }
        next('hls ' + d.details + (d.response && d.response.code ? ' HTTP ' + d.response.code : ''));
      });
    } else if (V.canPlayType('application/vnd.apple.mpegurl')) { V.src = prox(url); tryPlay(); }
    else next('nohls');
  } else if (kind === 'mpegts') {
    if (window.mpegts && mpegts.isSupported()) {
      mp = mpegts.createPlayer({ type: 'mpegts', isLive: true, url: prox(url) }, { enableWorker: true, liveBufferLatencyChasing: true, lazyLoadMaxDuration: 120 });
      mp.attachMediaElement(V); mp.load();
      mp.on(mpegts.Events.ERROR, (t, d, info) => next('mpegts ' + d + (info && info.code ? ' HTTP ' + info.code : '')));
      tryPlay();
    } else next('nompegts');
  } else if (kind === 'direct') {
    V.src = prox(url);
    if (pos > 0) V.addEventListener('loadedmetadata', () => { try { V.currentTime = pos; } catch {} }, { once: true });
    tryPlay();
  } else if (kind === 'transcode') {
    offset = Math.floor(pos || 0);
    V.src = '/transcode?k=' + TOKEN + '&u=' + b64(url) + '&start=' + offset; tryPlay();
  }
}

function fail(why) {
  stat(false); clearTimeout(failTimer);
  const live = ctx.kind === 'live';
  $('#perrt').textContent = live ? 'Il canale non risponde' : 'Impossibile riprodurre questo video';
  $('#perrm').textContent = live
    ? tr('Il canale potrebbe essere offline, il tuo abbonamento potrebbe aver raggiunto il numero massimo di connessioni contemporanee (chiudi altre app IPTV e riprova), oppure usa un formato che questo lettore non decodifica (ad esempio HEVC o audio AC3/E-AC3).')
    : tr('Il formato o il codec (ad esempio HEVC o MKV con audio particolari) potrebbe non essere supportato dal browser.') + (!can('transcode') ? ' ' + tr('La conversione automatica dei formati non supportati è inclusa in Premium.') : (caps.ffmpeg ? '' : ' ' + tr('Per la conversione automatica installa ffmpeg e riavvia Sipario.'))) + ' ' + tr('Può anche essere un problema temporaneo del server.');
  if (reasons.length) $('#perrm').textContent += '  [' + tr('Dettagli tecnici:') + ' ' + reasons.join(' · ') + ']';
  $('#perr').hidden = false;
  $('#pup').hidden = live || can('transcode');
}
$('#pretry').onclick = () => { $('#perr').hidden = true; reasons = []; runStep(0, ctx.startAt || 0); };
$('#pclose2').onclick = () => closePlayer();

V.addEventListener('playing', () => { clearTimeout(failTimer); stat(false); $('#perr').hidden = true; });
V.addEventListener('waiting', () => { if (ctx) stat(true, 'Buffering…'); });
V.addEventListener('pause', saveProg);
V.addEventListener('ended', () => {
  if (!ctx || ctx.kind === 'live') return;
  markDone();
  if (ctx.next) {
    const nc = ctx.next(); let s = 10;
    const tick = () => { $('#nexttxt').textContent = tr('Prossimo: {l} tra {s}s', { l: nc.label, s }); if (s-- <= 0) { $('#nextbox').hidden = true; openPlayer(nc); } else nextTimer = setTimeout(tick, 1000); };
    $('#nextbox').hidden = false; $('#nextgo').onclick = () => { clearTimeout(nextTimer); $('#nextbox').hidden = true; openPlayer(nc); };
    $('#nextno').onclick = () => { clearTimeout(nextTimer); $('#nextbox').hidden = true; }; if (can('autonext')) tick(); else $('#nexttxt').textContent = tr('Prossimo: {l}  ·  Riproduzione automatica: Premium', { l: nc.label });
  }
});

function saveProg() {
  if (!ctx || ctx.kind === 'live' || $('#player').hidden) return;
  const t = curTime(); if (t < 5) return;
  const known = isFinite(V.duration) && V.duration > 0 && mode_ !== 'transcode' ? V.duration : 0;
  const d = known || ctx.dur || (prog[ctx.id] && prog[ctx.id].d) || 0;
  if (d && t / d > 0.95) return markDone();
  prog[ctx.id] = { t, d, ts: Date.now(), sid: ctx.sid, label: ctx.label };
  if (ctx.sid) prog['last:' + ctx.sid] = { ep: ctx.id, ts: Date.now() };
  saveProgAll();
}
function markDone() {
  if (!ctx) return;
  prog[ctx.id] = { t: 0, d: (prog[ctx.id] && prog[ctx.id].d) || 0, ts: Date.now(), done: true, sid: ctx.sid, label: ctx.label };
  if (ctx.sid) prog['last:' + ctx.sid] = { ep: ctx.id, ts: Date.now() };
  saveProgAll();
}

function closePlayer(silent) {
  if ($('#player').hidden) return;
  saveProg(); clearInterval(saveTimer); clearTimeout(nextTimer);
  epgStop(); clearTimeout(sleepT); sleepIdx = 0; updSleep();
  gen++; stopEngines(); ctx = null;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  $('#player').hidden = true; $('#nextbox').hidden = true;
  if (ms) renderModal(); else document.body.classList.remove('noscroll');
  if (!silent && !ms && data) { const y = window.scrollY; render(); window.scrollTo(0, y); }
}
function toggleFs() {
  if (document.fullscreenElement) document.exitFullscreen(); else $('#player').requestFullscreen().catch(() => {});
}
$('#pback').onclick = () => closePlayer();
$('#pfs').onclick = toggleFs;
$('#pprev').onclick = () => zap(-1);
$('#pnext').onclick = () => {
  if (!ctx) return;
  if (ctx.kind === 'live') zap(1); else if (ctx.next) { saveProg(); openPlayer(ctx.next()); }
};
$('#pfav').onclick = () => { if (ctx) toggleFav(ctx.sid || ctx.id); };
V.addEventListener('dblclick', toggleFs);
function wake() { $('#player').classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!V.paused) $('#player').classList.add('idle'); }, 3000); }
$('#player').addEventListener('mousemove', wake);
$('#player').addEventListener('keydown', wake);
window.addEventListener('beforeunload', saveProg);

/* ================= funzioni Premium del player: guida TV, timer, PiP ================= */
let epgTimer = null, sleepT = null, sleepIdx = 0;
const SLEEP = [0, 15, 30, 60, 90];
function epgStop() { clearInterval(epgTimer); epgTimer = null; $('#pepg').hidden = true; }
async function epgStart() {
  epgStop();
  if (!ctx || ctx.kind !== 'live' || !creds || creds.mode !== 'xtream') return;
  const el = $('#pepg'); el.hidden = false;
  if (!can('epg')) { el.innerHTML = '<button data-upgrade="Con la Guida TV vedi cosa va in onda ora e cosa viene dopo, direttamente nel player.">🔒 Guida TV · Premium</button>'; return; }
  el.textContent = 'Guida TV…';
  const hm = (t) => new Date(t * 1000).toLocaleTimeString(SI18N.locale(), { hour: '2-digit', minute: '2-digit' });
  const run = async () => {
    if (!ctx) return;
    try {
      const r = await api('/api/epg', Object.assign({ sid: ctx.id.slice(1) }, creds));
      el.innerHTML = r.now ? `<b>Ora</b> ${esc(r.now.title)} <small>${hm(r.now.start)}–${hm(r.now.end)}</small>${r.next ? ` &nbsp;·&nbsp; <b>Dopo</b> ${esc(r.next.title)} <small>${hm(r.next.start)}</small>` : ''}` : 'Guida non disponibile per questo canale';
    } catch { el.textContent = 'Guida non disponibile'; }
  };
  run(); epgTimer = setInterval(run, 60000);
}
const updSleep = () => { $('#psleep').textContent = SLEEP[sleepIdx] ? `🌙 ${SLEEP[sleepIdx]}′` : '🌙'; };
$('#psleep').onclick = () => {
  if (!can('sleep')) return openUpgrade('Il timer di spegnimento è incluso in Premium.');
  clearTimeout(sleepT); sleepIdx = (sleepIdx + 1) % SLEEP.length; const m = SLEEP[sleepIdx];
  if (m) sleepT = setTimeout(() => { sleepIdx = 0; updSleep(); closePlayer(); toast('Timer di spegnimento: riproduzione fermata'); }, m * 60000);
  updSleep(); toast(m ? tr('Timer impostato: {m} minuti', { m }) : 'Timer disattivato');
};
$('#ppip').onclick = () => {
  if (document.pictureInPictureElement) document.exitPictureInPicture().catch(() => {});
  else if (document.pictureInPictureEnabled) V.requestPictureInPicture().catch(() => {});
};

/* ================= avvio ================= */
(async function boot() {
  if (!window.sipario) { $('#splash').remove(); $('#fatal').hidden = false; return; }
  SIP = window.sipario;
  try { BOOT = await SIP.boot(); } catch { $('#splash').remove(); $('#fatal').hidden = false; return; }
  TOKEN = BOOT.token; LIC = BOOT.status; caps = { ffmpeg: BOOT.ffmpeg };
  const saved = (await SIP.vaultGet()) || {};
  vault = Object.assign({ accounts: [], profiles: [], last: {}, theme: 'sipario', eula: '' }, saved);
  if (!vault.profiles.length) vault.profiles = [{ id: 'p1', name: 'Io', color: COLORS[0] }];
  if (!vault.last) vault.last = {};
  profile = vault.profiles.find((p) => p.id === vault.last.profile) || vault.profiles[0];
  applyTheme(); updateBadge(); updateAvatar();
  SIP.onLicense((s) => { LIC = s; updateBadge(); applyTheme(); if (data) render(); });
  SIP.onUpdate((i) => banner(esc(tr('È disponibile Sipario {v}.', { v: i.version })) + ' <button id="upd-go">Scarica</button>'));
  document.addEventListener('click', (e) => {
    if (e.target.id === 'upd-go') { const u = $('#banner').dataset.url; if (u) SIP.open(u); }
  });
  SIP.onUpdate((i) => { $('#banner').dataset.url = i.url; });

  SI18N.fillSelects();
  SI18N.onChange(() => {
    updateBadge(); updateAvatar();
    if (!$('#umenu').hidden) $('#umenu').hidden = true;
    if (data && !$('#app').hidden) { render(); if (ms && !$('#modal').hidden) renderModal(); }
    if (!$('#profiles').hidden) drawProfiles();
    if (eulaRes) renderEula();
  });
  await sleep(1900);
  $('#splash').classList.add('done');
  setTimeout(() => $('#splash').remove(), 1300);

  if (vault.eula !== EULA_V) await showEula();
  if (!vault.accounts.length) return showLogin();
  if (vault.profiles.length > 1 && L().profiles > 1) return showProfiles();
  startSession();
})();
})();
