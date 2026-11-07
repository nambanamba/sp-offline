/* スペシャル計算（機内用）の入れ物（2026-11-08 ユーザー「飛行機でやって再読込しても使える仕組み」）
   - 問題の画像と出発前の記録は、読みこんだファイル（sp_kinai_*.json）から IndexedDB「sp-offline」に入れる。このページには入っていない
   - いつものアプリ（app.js）の claude.use("db") の代わりに、IndexedDB に読み書きする db をわたす（doc().get/set・collection().get だけ）
   - 機内で書いた・記録したものは「まだ書き出していない」に覚えておき、「記録を書き出す」でファイルにする。書き出しても消さない */
(() => {
  const DBN = "sp-offline", ST = "kv";
  const idb = () => new Promise((ok, ng) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => ok(r.result); r.onerror = () => ng(r.error); });
  const tx = (mode, f) => idb().then(d => new Promise((ok, ng) => { const t = d.transaction(ST, mode), s = t.objectStore(ST); const r = f(s); t.oncomplete = () => ok(r && r.result); t.onerror = () => ng(t.error); t.onabort = () => ng(t.error); }));
  const get = k => tx("readonly", s => s.get(k));
  const putMany = o => tx("readwrite", s => { Object.keys(o).forEach(k => s.put(o[k], k)); });
  const dirtyOf = d => (d && typeof d === "object" && !Array.isArray(d)) ? d : {};
  const cp = v => v == null ? v : JSON.parse(JSON.stringify(v));
  const $ = id => document.getElementById(id);
  const fmt = t => { const d = new Date(t); return (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"); };

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

  /* ---- ファイルを読みこむ（はじめて・読みこみなおし）。機内で書いたもの（まだ書き出していない）は上書きしない ---- */
  async function readFile(f) {
    const p = JSON.parse(await f.text());
    if (!p || p.app !== "special-keisan" || p.v !== 1 || !Array.isArray(p.pages) || p.pages.length !== 52 || typeof p.docs !== "object") throw new Error("スペシャル計算の機内用ファイルではありません");
    /* 機内で書いたもの（dirty）は上書きしない。ただし「書き出したあと」で「そのあとに作ったファイル」なら、ファイルの版を入れて dirty から外す
       （着いて db に足したあとに作り直したファイルには、機内の分も入っているため） */
    const dt = dirtyOf(await get("meta:dirty")), ex = (await get("meta:exported")) || 0, cr = +p.created || 0;
    const o = {"meta:pages": p.pages, "meta:info": {created: p.created, loaded: Date.now(), name: f.name}};
    Object.keys(dt).forEach(k => { if (dt[k] <= ex && dt[k] < cr) delete dt[k]; });
    Object.keys(p.docs).forEach(k => { if (!(k in dt)) o["doc:" + k] = p.docs[k]; });
    o["meta:dirty"] = dt;
    await putMany(o);
  }
  function gate(note) {
    const g = $("offGate");
    g.style.cssText = "display:block;position:fixed;inset:0;z-index:50;background:#f4f1ea;padding:24px;overflow:auto;font-size:17px;line-height:1.7";
    const solo = navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
    g.innerHTML = `<h2 style="margin:0 0 12px">スペシャル計算（機内用）</h2>
      ${note ? `<p style="color:#c0392b;font-weight:700">${note}</p>` : ""}
      ${solo ? "" : `<p style="background:#fff3cd;padding:10px;border-radius:8px">おうちの方へ：先に Safari の共有ボタン →「ホーム画面に追加」をして、<b>ホーム画面のアイコンから</b>開いてから、ファイルを読みこんでください（Safari のタブで読みこむと、アイコンの方には入りません）。</p>`}
      <p>「スペシャル計算_機内用」のファイル（sp_kinai_…json）をえらんでください。</p>
      <p><input type="file" id="offFile" accept=".json,application/json" style="font-size:17px"></p>
      <p id="offSt" style="color:#555"></p>`;
    $("offFile").onchange = async ev => { const f = ev.target.files[0]; if (!f) return; $("offSt").textContent = "読みこみ中…";
      try { await readFile(f); location.reload(); } catch (e) { $("offSt").textContent = "読みこめませんでした（" + (e.message || e) + "）。前の中身はそのままです"; } };
  }

  /* ---- いつものアプリにわたす db（IndexedDB）。書いたものは meta:dirty に覚える ---- */
  const MEM = new Map(); let dirty = {}, exported = 0;   // dirty: {path: 機内で最後に書いた時刻}
  const fdb = {
    doc: p => ({
      get: async () => { const v = MEM.get(p); return {exists: v !== undefined, id: p.split("/").pop(), data: () => cp(v)}; },
      set: async v => { v = cp(v); MEM.set(p, v); dirty[p] = Date.now(); await putMany({["doc:" + p]: v, "meta:dirty": dirty}); offShow(); }
    }),
    collection: c => ({ get: async () => { const docs = []; MEM.forEach((v, p) => { const i = p.indexOf("/"); if (p.slice(0, i) === c && p.indexOf("/", i + 1) < 0) docs.push({id: p.slice(i + 1), exists: true, data: () => cp(v)}); }); return {docs}; } })
  };
  const nDirty = () => Object.keys(dirty).filter(p => !p.startsWith("state/") && dirty[p] > exported).length;   // まだ書き出していない数

  /* ---- 記録を書き出す ---- */
  async function exportRecs() {
    const docs = {}; Object.keys(dirty).forEach(p => { if (MEM.has(p)) docs[p] = MEM.get(p); });
    const info = (await get("meta:info")) || {}, now = new Date();
    const name = "sp_kiroku_" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "_" + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0") + ".json";
    const body = JSON.stringify({app: "special-keisan", v: 1, kind: "recs", from: "offline", made: Date.now(), base: info.created || 0, docs});
    const file = new File([body], name, {type: "application/json"});
    try { if (navigator.canShare && navigator.canShare({files: [file]})) { await navigator.share({files: [file], title: name}); exported = Date.now(); await putMany({"meta:exported": exported}); offShow(); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
    exported = Date.now(); await putMany({"meta:exported": exported}); offShow();
  }

  /* ---- 上の帯の「✈機内用」と、その中の画面 ---- */
  async function offShow() { const b = $("offBtn"); if (b) { const n = nDirty(); b.textContent = "✈機内用" + (n ? "（まだ " + n + "）" : ""); } }
  async function offPanel() {
    const info = (await get("meta:info")) || {}, ex = await get("meta:exported"), n = nDirty();
    const g = $("offGate");
    g.style.cssText = "display:block;position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.35)";
    g.innerHTML = `<div style="position:absolute;left:50%;top:80px;transform:translateX(-50%);width:min(520px,92vw);background:#fff;border-radius:14px;padding:18px;font-size:16px;line-height:1.7">
      <b>スペシャル計算（機内用）</b><br>
      ファイル：${info.created ? fmt(info.created) + " に作ったもの" : "？"}（${info.loaded ? fmt(info.loaded) : ""} に読みこみ）<br>
      まだ書き出していない記録・線：<b>${n}</b> 件${ex ? "（前に書き出したのは " + fmt(ex) + "）" : ""}<br>
      <small>書き出したファイルは「ファイル」→ Google ドライブの「スペシャル計算\\機内用」に入れてください。書き出しても、この iPad の中の記録は消えません。</small>
      <p style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0">
      <button id="offEx" style="font:inherit;padding:10px 14px;border-radius:10px;border:1px solid #1f6f78;background:#1f6f78;color:#fff">記録を書き出す</button>
      <label style="font:inherit;padding:10px 14px;border-radius:10px;border:1px solid #d8d2c4">ファイルを読みこみなおす<input type="file" id="offFile" accept=".json,application/json" style="display:none"></label>
      <button id="offX" style="font:inherit;padding:10px 14px;border-radius:10px;border:1px solid #d8d2c4;background:#fff">とじる</button></p>
      <p id="offSt" style="color:#555;margin:6px 0 0"></p></div>`;
    $("offX").onclick = () => { g.style.display = "none"; g.innerHTML = ""; };
    $("offEx").onclick = () => exportRecs().catch(e => { $("offSt").textContent = "書き出せませんでした（" + (e.message || e) + "）"; });
    $("offFile").onchange = async ev => { const f = ev.target.files[0]; if (!f) return; $("offSt").textContent = "読みこみ中…";
      try { await readFile(f); location.reload(); } catch (e) { $("offSt").textContent = "読みこめませんでした（" + (e.message || e) + "）。前の中身はそのままです"; } };
  }

  /* ---- はじめ: 画像と db を IndexedDB から出して、いつものアプリ（app.js）を動かす ---- */
  (async () => {
    let pages = null;
    try { pages = await get("meta:pages"); } catch (e) { gate("この iPad の中を読めませんでした（" + (e.message || e) + "）"); return; }
    if (!Array.isArray(pages) || pages.length !== 52) { gate(""); return; }
    dirty = dirtyOf(await get("meta:dirty")); exported = (await get("meta:exported")) || 0;
    const R = IDBKeyRange.bound("doc:", "doc:￿");
    const docKs = await tx("readonly", s => s.getAllKeys(R)), vals = await tx("readonly", s => s.getAll(R));   // どちらも同じ順（キーの順）
    docKs.forEach((k, i) => MEM.set(k.slice(4), vals[i]));
    /* localStorage は nambanamba.github.io のほかのアプリ（算数・漢字・対戦）と同じ入れ物（5MB）。線は大きいので入れない（線は IndexedDB にある） */
    const set0 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (this === localStorage && /^sp-ink/.test(k)) return; return set0.call(this, k, v); };
    window.__SP_PAGES = pages;
    window.claude = {use: async n => n === "db" ? fdb : null};
    const sc = document.createElement("script"); sc.src = "app.js";
    sc.onload = () => { const b = document.createElement("button"); b.id = "offBtn"; b.style.cssText = "background:#fff3cd"; b.onclick = offPanel;
      const bar = $("bar"); bar.insertBefore(b, bar.firstChild); offShow(); };
    document.body.appendChild(sc);
  })();
})();
