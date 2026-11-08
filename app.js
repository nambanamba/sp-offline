
/* 11-02（ユーザー）: 1問1ページ（式を書く場所が足りない）・いつ・何分・〇だったかを入れる枠。
   本のページ（PAGES）の中の問題の位置（Q）を切り出して、問題ごとのページを作る。
   11-02 午後（ユーザー「計算を書く場所が足りない」）: 問題は上の帯に固定（小さめの字。「大きく」で切りかえ）。
   帯の中にもペンでメモが書ける（帯といっしょに固定）。その下の計算用紙だけが上下に動き、「紙を足す」で下に伸びる。
   線は問題ごと ink2/q<ページ>_<問題> {s: 計算用紙の線, m: 帯のメモの線, h: 用紙の長さ}（座標は 用紙／帯 の左上から、幅で割った値）。
   前の形の線 ink/q<ページ>_<問題>（1枚の紙の座標）は書きかえない。ink2 がまだ無い問題は、読むときに新しい形へ直して出す
   （問題の上に書いた線→帯のメモ、「式と計算」の線より下→計算用紙の上から）。
   記録はページごと rec/p<ページ> {tries:[{d,sec,marks:[4つ],t}]}（下の「記録」）。
   前のページごとの線（ink/p<ページ>）は消さない。「問題」の一覧の「前の書きこみ」から見られる（見るだけ） */
const PAGES = window.__SP_PAGES;   // 機内用: 画像は読みこんだファイルから（off.js）
const Q = [{"p":2,"k":1,"y0":246,"y1":300},{"p":2,"k":2,"y0":610,"y1":630},{"p":2,"k":3,"y0":929,"y1":990},{"p":2,"k":4,"y0":1241,"y1":1296},{"p":3,"k":1,"y0":243,"y1":301},{"p":3,"k":2,"y0":590,"y1":646},{"p":3,"k":3,"y0":935,"y1":989},{"p":3,"k":4,"y0":1233,"y1":1296},{"p":4,"k":1,"y0":245,"y1":301},{"p":4,"k":2,"y0":592,"y1":646},{"p":4,"k":3,"y0":933,"y1":992},{"p":4,"k":4,"y0":1258,"y1":1279},{"p":5,"k":1,"y0":240,"y1":282},{"p":5,"k":2,"y0":588,"y1":646},{"p":5,"k":3,"y0":933,"y1":991},{"p":5,"k":4,"y0":1240,"y1":1297},{"p":6,"k":1,"y0":245,"y1":303},{"p":6,"k":2,"y0":592,"y1":647},{"p":6,"k":3,"y0":936,"y1":993},{"p":6,"k":4,"y0":1236,"y1":1298},{"p":7,"k":1,"y0":248,"y1":305},{"p":7,"k":2,"y0":595,"y1":649},{"p":7,"k":3,"y0":938,"y1":994},{"p":7,"k":4,"y0":1239,"y1":1302},{"p":8,"k":1,"y0":248,"y1":307},{"p":8,"k":2,"y0":595,"y1":649},{"p":8,"k":3,"y0":932,"y1":995},{"p":8,"k":4,"y0":1245,"y1":1301},{"p":9,"k":1,"y0":243,"y1":299},{"p":9,"k":2,"y0":589,"y1":644},{"p":9,"k":3,"y0":932,"y1":989},{"p":9,"k":4,"y0":1237,"y1":1295},{"p":10,"k":1,"y0":245,"y1":302},{"p":10,"k":2,"y0":608,"y1":631},{"p":10,"k":3,"y0":935,"y1":992},{"p":10,"k":4,"y0":1243,"y1":1300},{"p":11,"k":1,"y0":247,"y1":305},{"p":11,"k":2,"y0":588,"y1":649},{"p":11,"k":3,"y0":932,"y1":996},{"p":11,"k":4,"y0":1244,"y1":1302},{"p":12,"k":1,"y0":248,"y1":307},{"p":12,"k":2,"y0":595,"y1":650},{"p":12,"k":3,"y0":938,"y1":996},{"p":12,"k":4,"y0":1246,"y1":1300},{"p":13,"k":1,"y0":246,"y1":302},{"p":13,"k":2,"y0":587,"y1":647},{"p":13,"k":3,"y0":935,"y1":992},{"p":13,"k":4,"y0":1240,"y1":1299},{"p":14,"k":1,"y0":250,"y1":305},{"p":14,"k":2,"y0":594,"y1":652},{"p":14,"k":3,"y0":940,"y1":997},{"p":14,"k":4,"y0":1246,"y1":1304},{"p":15,"k":1,"y0":251,"y1":308},{"p":15,"k":2,"y0":598,"y1":653},{"p":15,"k":3,"y0":942,"y1":998},{"p":15,"k":4,"y0":1240,"y1":1306},{"p":16,"k":1,"y0":252,"y1":308},{"p":16,"k":2,"y0":598,"y1":655},{"p":16,"k":3,"y0":944,"y1":998},{"p":16,"k":4,"y0":1241,"y1":1306},{"p":17,"k":1,"y0":248,"y1":306},{"p":17,"k":2,"y0":593,"y1":651},{"p":17,"k":3,"y0":937,"y1":996},{"p":17,"k":4,"y0":1246,"y1":1301},{"p":18,"k":1,"y0":247,"y1":305},{"p":18,"k":2,"y0":595,"y1":652},{"p":18,"k":3,"y0":957,"y1":979},{"p":18,"k":4,"y0":1240,"y1":1303},{"p":19,"k":1,"y0":241,"y1":299},{"p":19,"k":2,"y0":587,"y1":646},{"p":19,"k":3,"y0":931,"y1":989},{"p":19,"k":4,"y0":1233,"y1":1296},{"p":20,"k":1,"y0":243,"y1":301},{"p":20,"k":2,"y0":585,"y1":646},{"p":20,"k":3,"y0":932,"y1":990},{"p":20,"k":4,"y0":1239,"y1":1296},{"p":21,"k":1,"y0":241,"y1":300},{"p":21,"k":2,"y0":589,"y1":644},{"p":21,"k":3,"y0":923,"y1":988},{"p":21,"k":4,"y0":1230,"y1":1297},{"p":22,"k":1,"y0":265,"y1":284},{"p":22,"k":2,"y0":590,"y1":630},{"p":22,"k":3,"y0":938,"y1":991},{"p":22,"k":4,"y0":1238,"y1":1280},{"p":23,"k":1,"y0":259,"y1":280},{"p":23,"k":2,"y0":580,"y1":645},{"p":23,"k":3,"y0":950,"y1":973},{"p":23,"k":4,"y0":1255,"y1":1278},{"p":24,"k":1,"y0":265,"y1":284},{"p":24,"k":2,"y0":593,"y1":647},{"p":24,"k":3,"y0":955,"y1":973},{"p":24,"k":4,"y0":1239,"y1":1283},{"p":25,"k":1,"y0":241,"y1":295},{"p":25,"k":2,"y0":579,"y1":640},{"p":25,"k":3,"y0":925,"y1":968},{"p":25,"k":4,"y0":1253,"y1":1275},{"p":26,"k":1,"y0":257,"y1":278},{"p":26,"k":2,"y0":603,"y1":623},{"p":26,"k":3,"y0":949,"y1":968},{"p":26,"k":4,"y0":1237,"y1":1292},{"p":27,"k":1,"y0":254,"y1":275},{"p":27,"k":2,"y0":581,"y1":637},{"p":27,"k":3,"y0":944,"y1":964},{"p":27,"k":4,"y0":1250,"y1":1304},{"p":28,"k":1,"y0":241,"y1":296},{"p":28,"k":2,"y0":604,"y1":624},{"p":28,"k":3,"y0":926,"y1":969},{"p":28,"k":4,"y0":1231,"y1":1314},{"p":29,"k":1,"y0":258,"y1":281},{"p":29,"k":2,"y0":586,"y1":643},{"p":29,"k":3,"y0":949,"y1":969},{"p":29,"k":4,"y0":1232,"y1":1352},{"p":30,"k":1,"y0":239,"y1":294},{"p":30,"k":2,"y0":584,"y1":640},{"p":30,"k":3,"y0":948,"y1":972},{"p":30,"k":4,"y0":1252,"y1":1278},{"p":31,"k":1,"y0":261,"y1":315},{"p":31,"k":2,"y0":584,"y1":643},{"p":31,"k":3,"y0":932,"y1":988},{"p":31,"k":4,"y0":1240,"y1":1294},{"p":32,"k":1,"y0":238,"y1":299},{"p":32,"k":2,"y0":603,"y1":626},{"p":32,"k":3,"y0":948,"y1":971},{"p":32,"k":4,"y0":1237,"y1":1293},{"p":33,"k":1,"y0":238,"y1":297},{"p":33,"k":2,"y0":605,"y1":625},{"p":33,"k":3,"y0":930,"y1":985},{"p":33,"k":4,"y0":1254,"y1":1445},{"p":34,"k":1,"y0":239,"y1":412},{"p":34,"k":2,"y0":604,"y1":628},{"p":34,"k":3,"y0":950,"y1":973},{"p":34,"k":4,"y0":1232,"y1":1278},{"p":35,"k":1,"y0":263,"y1":324},{"p":35,"k":2,"y0":590,"y1":650},{"p":35,"k":3,"y0":954,"y1":975},{"p":35,"k":4,"y0":1259,"y1":1319},{"p":36,"k":1,"y0":266,"y1":287},{"p":36,"k":2,"y0":595,"y1":653},{"p":36,"k":3,"y0":934,"y1":977},{"p":36,"k":4,"y0":1263,"y1":1321},{"p":37,"k":1,"y0":246,"y1":307},{"p":37,"k":2,"y0":615,"y1":635},{"p":37,"k":3,"y0":942,"y1":995},{"p":37,"k":4,"y0":1263,"y1":1553},{"p":38,"k":1,"y0":252,"y1":308},{"p":38,"k":2,"y0":590,"y1":653},{"p":38,"k":3,"y0":958,"y1":981},{"p":38,"k":4,"y0":1240,"y1":1364},{"p":39,"k":1,"y0":246,"y1":305},{"p":39,"k":2,"y0":591,"y1":650},{"p":39,"k":3,"y0":954,"y1":974},{"p":39,"k":4,"y0":1260,"y1":1395},{"p":40,"k":1,"y0":240,"y1":305},{"p":40,"k":2,"y0":609,"y1":631},{"p":40,"k":3,"y0":930,"y1":996},{"p":40,"k":4,"y0":1260,"y1":1359},{"p":41,"k":1,"y0":247,"y1":300},{"p":41,"k":2,"y0":589,"y1":649},{"p":41,"k":3,"y0":954,"y1":973},{"p":41,"k":4,"y0":1245,"y1":1415},{"p":42,"k":1,"y0":246,"y1":305},{"p":42,"k":2,"y0":594,"y1":648},{"p":42,"k":3,"y0":940,"y1":998},{"p":42,"k":4,"y0":1244,"y1":1302},{"p":43,"k":1,"y0":261,"y1":280},{"p":43,"k":2,"y0":581,"y1":644},{"p":43,"k":3,"y0":933,"y1":987},{"p":43,"k":4,"y0":1238,"y1":1297},{"p":44,"k":1,"y0":244,"y1":300},{"p":44,"k":2,"y0":607,"y1":630},{"p":44,"k":3,"y0":929,"y1":992},{"p":44,"k":4,"y0":1232,"y1":1295},{"p":45,"k":1,"y0":244,"y1":303},{"p":45,"k":2,"y0":609,"y1":629},{"p":45,"k":3,"y0":933,"y1":992},{"p":45,"k":4,"y0":1241,"y1":1294},{"p":46,"k":1,"y0":244,"y1":299},{"p":46,"k":2,"y0":581,"y1":648},{"p":46,"k":3,"y0":933,"y1":992},{"p":46,"k":4,"y0":1240,"y1":1299},{"p":47,"k":1,"y0":262,"y1":284},{"p":47,"k":2,"y0":585,"y1":647},{"p":47,"k":3,"y0":933,"y1":990},{"p":47,"k":4,"y0":1241,"y1":1296},{"p":48,"k":1,"y0":245,"y1":299},{"p":48,"k":2,"y0":590,"y1":644},{"p":48,"k":3,"y0":933,"y1":988},{"p":48,"k":4,"y0":1256,"y1":1278},{"p":49,"k":1,"y0":261,"y1":283},{"p":49,"k":2,"y0":583,"y1":646},{"p":49,"k":3,"y0":949,"y1":974},{"p":49,"k":4,"y0":1238,"y1":1297},{"p":50,"k":1,"y0":264,"y1":286},{"p":50,"k":2,"y0":593,"y1":648},{"p":50,"k":3,"y0":938,"y1":992},{"p":50,"k":4,"y0":1242,"y1":1300},{"p":51,"k":1,"y0":237,"y1":296},{"p":51,"k":2,"y0":589,"y1":643},{"p":51,"k":3,"y0":934,"y1":988},{"p":51,"k":4,"y0":1229,"y1":1297}];   // [{p: ページ番号(1から), k: 問題番号, y0, y1}]（絵の画素）
const PW = 1366, PH = 1947, CR = 1.5;
const HEAD = [20, 215];               // ページの上の見出し（チャレンジ◯・目標タイム）
const QR = [[194, 478], [193, 588], [190, 516], [188, 534], [209, 592], [210, 564], [210, 560], [209, 604], [195, 554], [193, 620], [191, 518], [189, 634], [217, 694], [217, 572], [216, 700], [216, 564], [188, 619], [186, 527], [184, 607], [183, 584], [217, 570], [215, 597], [214, 488], [214, 678], [188, 510], [187, 470], [185, 655], [184, 503], [212, 684], [211, 536], [211, 599], [210, 639], [192, 517], [190, 757], [189, 559], [187, 635], [213, 799], [212, 630], [211, 695], [210, 699], [192, 618], [191, 508], [190, 619], [189, 539], [217, 618], [216, 568], [215, 574], [215, 892], [187, 482], [185, 598], [184, 615], [183, 719], [217, 582], [217, 616], [216, 614], [216, 758], [186, 573], [185, 635], [183, 554], [181, 767], [215, 619], [216, 681], [216, 640], [217, 585], [188, 1139], [185, 625], [183, 517], [181, 751], [219, 704], [218, 638], [218, 647], [218, 820], [183, 541], [183, 601], [182, 647], [182, 590], [219, 687], [217, 622], [214, 623], [212, 951], [183, 605], [183, 599], [183, 530], [182, 610], [219, 712], [217, 753], [214, 682], [213, 648], [183, 513], [182, 676], [181, 525], [180, 905], [221, 660], [220, 921], [218, 649], [217, 944], [181, 613], [180, 765], [179, 610], [177, 680], [217, 1168], [218, 606], [219, 597], [221, 1117], [186, 570], [184, 814], [182, 671], [180, 1080], [220, 1013], [221, 737], [221, 566], [222, 936], [185, 549], [182, 620], [179, 522], [176, 719], [219, 1025], [219, 559], [218, 656], [218, 800], [186, 548], [183, 679], [181, 535], [178, 515], [218, 639], [218, 657], [218, 723], [218, 598], [188, 1139], [185, 530], [182, 628], [180, 550], [219, 1008], [218, 738], [216, 594], [215, 721], [188, 541], [186, 649], [184, 597], [183, 1008], [211, 543], [212, 1164], [213, 697], [214, 969], [190, 647], [188, 589], [185, 631], [183, 1135], [216, 836], [215, 661], [215, 562], [214, 1167], [191, 749], [189, 563], [186, 884], [185, 1126], [216, 611], [215, 631], [214, 549], [214, 1193], [189, 653], [187, 454], [185, 753], [183, 574], [215, 695], [214, 743], [213, 621], [213, 865], [193, 539], [190, 636], [188, 835], [185, 501], [210, 655], [209, 608], [208, 969], [207, 653], [198, 579], [196, 830], [193, 584], [190, 766], [210, 799], [208, 674], [206, 636], [204, 541], [201, 829], [199, 439], [197, 546], [195, 568], [215, 1195], [213, 639], [210, 652], [207, 730], [197, 661], [196, 614], [194, 585], [192, 637], [215, 720], [212, 516], [209, 863], [206, 693]];   // 問題ごとの式の左はし・右はし（学校名の手前。11-07 に絵から測った）
const QH = 1947;                      // 前の形の1問のページの高さ（古い線を直すのに使う）
const PAPER = 2800, ADD = 1100, ADDH = 200;   // 計算用紙のはじめの長さ・「紙を足す」でのびる長さ・下のボタンの場所（11-07 ユーザー「紙をたさなくてもいいように」: はじめ 1700→2800）
const BOXM = 1800;   // 箱の式の下に広げられる書く場所のいちばん大きいところ（11-07 ユーザー「大きくはならない」: 前はメモの広さ 440〜620 まで）
const BX0 = 50, BX1 = PW - 50;    // 帯に出す横のはば（絵の画素）
// 問題の下の木（計算の順番 ①②③…）を書く余白。式の高さの2.5〜3.5倍（11-02 ユーザーの実物から）
const memoH = i => Math.round(Math.max(440, Math.min(620, 7 * (Q[i].y1 - Q[i].y0))));   // 11-07（ユーザー「問題の下に数字を入れる広さが足りない」）: 前の倍
const memoH0 = i => Math.round(Math.max(220, Math.min(360, 3.5 * (Q[i].y1 - Q[i].y0))));   // 前の広さ（前の形の線を分けるのに使う。書きかえない）
const $ = id => document.getElementById(id);
const view = $("view"), stage = $("stage"), band = $("band"), bstage = $("bstage");
const cv = document.createElement("canvas"), g = cv.getContext("2d");
const mcv = document.createElement("canvas"), mg = mcv.getContext("2d");
let cur = 0, oldPage = -1, ink = {}, recs = {}, color = "#111", erase = false, finger = false, penSeen = false, undo = [];
let Z = 1, TX = 0, TY = 0, SH = QH, db = null, big = false, BS = 0.5, BF = 1, BOX = null;   // BF: 箱の大きさ（1=ふつう）・BOX: 箱の場所
const LW = 2.2 / PW;
const SAT = () => { const d = document.createElement("div"); d.style.cssText = "position:fixed;top:0;height:var(--st)"; document.body.append(d); const h = d.getBoundingClientRect().height; d.remove(); return h || 0; };
function msg(t) { const m = $("msg"); m.textContent = t; m.style.display = "block"; clearTimeout(msg.t); msg.t = setTimeout(() => m.style.display = "none", 1800); }
// 11-03: 止まったときに何が起きたか分かるように、エラーは画面に出して db の err/ にも残す（記録が保存されなかった件の調べ）
const errLog = t => { try { msg("うまくいきませんでした（" + String(t).slice(0, 60) + "）"); } catch (e) {} try { if (db) db.doc("err/e" + Date.now()).set({m: String(t).slice(0, 500), q: cur, ua: navigator.userAgent.slice(0, 200), t: Date.now()}).catch(() => {}); } catch (e) {} };
window.addEventListener("error", ev => errLog(ev.message || ev.error));
window.addEventListener("unhandledrejection", ev => errLog((ev.reason && (ev.reason.message || ev.reason.code)) || ev.reason));
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const p2 = n => String(n).padStart(2, "0");
const r4 = v => Math.round(v * 10000) / 10000;
const qkey = i => "q" + p2(Q[i].p) + "_" + Q[i].k;
const ikey = () => oldPage >= 0 ? "p" + p2(oldPage) : qkey(cur);
const blank = () => ({s: [], m: [], h: PAPER});
function cq() { const k = qkey(cur); return ink[k] || (ink[k] = blank()); }
// 線の入れもの。question のときは 計算用紙(s)／帯(m)。前の書きこみは ink[p◯◯]（前の形の配列のまま）
function arrOf(sf) { if (oldPage >= 0) { const k = ikey(); return ink[k] || (ink[k] = []); } return sf === "m" ? cq().m : cq().s; }
const nOf = o => o ? (Array.isArray(o) ? o.length : (o.s || []).length + (o.m || []).length) : 0;
function ymd(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
function geo(i) { const q = Q[i], hh = HEAD[1] - HEAD[0], a = Math.max(HEAD[1], q.y0 - 45), b = q.y1 + 30, top = hh + 10; return {a, b, top, wy: top + (b - a) + 20, me: memoH(i), me0: memoH0(i)}; }

/* 前の形（1枚の紙）の線 → 新しい形。保存されているものは書きかえない（読んだあと、画面の中だけで直す） */
function fromOld(arr, i) {
  const G = geo(i), m = [], s = [];
  (arr || []).forEach(st => { if (!st || !st.p || !st.p.length) return; const ys = st.p.map(p => p[1] * PW);
    if (Math.min(...ys) >= G.top - 10 && Math.max(...ys) < G.top + (G.b - G.a) + G.me0) m.push({c: st.c, p: st.p.map(p => [p[0], r4(p[1] - G.top / PW)])}); else s.push(st); });
  let off = G.wy + G.me0; s.forEach(st => st.p.forEach(p => { off = Math.min(off, p[1] * PW - 70); }));
  let mx = 0; const s2 = s.map(st => ({c: st.c, p: st.p.map(p => { const y = r4(p[1] - off / PW); mx = Math.max(mx, y * PW); return [p[0], y]; })}));
  return {s: s2, m, h: Math.max(PAPER, Math.ceil((mx + 300) / 100) * 100), old: true};
}
function norm(o) { return {s: Array.isArray(o.s) ? o.s : [], m: Array.isArray(o.m) ? o.m : [], h: Math.max(PAPER, +o.h || PAPER)}; }

/* ---- 表示 ---- */
function apply() { stage.style.transform = `translate(${TX}px,${TY}px) scale(${Z})`; }
function fit() { const w = view.clientWidth, h = view.clientHeight; Z = Math.min(w / PW, h / SH) * 0.98; TX = (w - PW * Z) / 2; TY = 4; apply(); }
function fitWidth() { Z = view.clientWidth / PW; TX = 0; TY = 0; apply(); }
function clampPan() { const w = view.clientWidth, h = view.clientHeight, sw = PW * Z, sh = SH * Z;
  TX = sw < w ? (w - sw) / 2 : Math.min(0, Math.max(w - sw, TX)); TY = sh < h ? Math.max(0, Math.min(TY, h - sh)) : Math.min(60, Math.max(h - sh - 60, TY)); }
function zoomAt(nz, cx, cy) { nz = Math.max(0.3, Math.min(6, nz)); TX = cx - (cx - TX) * nz / Z; TY = cy - (cy - TY) * nz / Z; Z = nz; clampPan(); apply(); }
function line(s, gg, c) { if (!s.p.length) return; const W = c.width; gg.strokeStyle = s.c; gg.lineWidth = LW * W; gg.lineCap = gg.lineJoin = "round";
  gg.beginPath(); gg.moveTo(s.p[0][0] * W, s.p[0][1] * W); s.p.forEach(q => gg.lineTo(q[0] * W, q[1] * W)); if (s.p.length === 1) gg.lineTo(s.p[0][0] * W + .1, s.p[0][1] * W); gg.stroke(); }
function draw() { g.clearRect(0, 0, cv.width, cv.height); arrOf("s").forEach(s => line(s, g, cv));
  if (oldPage < 0) { mg.clearRect(0, 0, mcv.width, mcv.height); arrOf("m").forEach(s => line(s, mg, mcv)); } }
function crop(src, y0, y1, top) { const d = document.createElement("div"); d.className = "crop";
  d.style.top = top + "px"; d.style.height = (y1 - y0) + "px"; d.style.backgroundImage = `url(${src})`; d.style.backgroundSize = PW + "px " + PH + "px"; d.style.backgroundPosition = `0 ${-y0}px`; return d; }
function build(h, parts) { stage.innerHTML = ""; SH = h; stage.style.width = PW + "px"; stage.style.height = h + "px";
  cv.width = Math.round(PW * CR); cv.height = Math.round(h * CR); parts.forEach(x => stage.append(x)); stage.append(cv); }
// 帯（問題の絵＋メモの線）。小さい＝字を小さめにして計算用紙を広く／大きい＝見出しもつけて大きく
function buildBand() {
  const q = Q[cur], src = PAGES[q.p - 1], G = geo(cur), ch = G.b - G.a, mh = ch + BOXM, hh = HEAD[1] - HEAD[0];
  const W = window.innerWidth, avail = window.innerHeight - 154 - SAT(), bw = BX1 - BX0, top = big ? hh + 8 : 0;
  // ふつう: 字を小さめ（はばの8割）にして、帯は画面の45%まで／大きく: 見出しもつけて画面の半分まで
  BS = big ? Math.min(W / bw, window.innerHeight * 0.5 / (top + mh)) : Math.min(W * 0.8 / bw, window.innerHeight * 0.45 / mh);
  bstage.innerHTML = ""; bstage.style.width = PW + "px"; bstage.style.height = (top + mh) + "px";
  if (big) bstage.append(crop(src, HEAD[0], HEAD[1], 0));
  bstage.append(crop(src, G.a, G.b, top));
  mcv.width = Math.round(PW * CR); mcv.height = Math.round(mh * CR); mcv.style.top = top + "px"; mcv.style.width = PW + "px"; mcv.style.height = mh + "px"; bstage.append(mcv);
  bandSize();
  $("bBig").textContent = big ? "小さく" : "大きく";
}
// 箱の大きさと場所。右は式の右はし（前に書いたメモの線がそれより右にあれば、そこまで）
const HD = 36;
let BXH = 10;   // 式の下の書く場所（絵の画素。下のつまみで 10〜メモの広さまで）
// 箱のはば・高さ＝式のまわりだけ（前に書いたメモの線があれば、それも入るように広げる）
function boxRect() { const G = geo(cur), ch = G.b - G.a, top = big ? HEAD[1] - HEAD[0] + 8 : 0; let l = QR[cur][0] - 30, r = QR[cur][1] + 30, b = ch + BXH;
  (cq().m || []).forEach(s => s.p.forEach(p => { l = Math.min(l, p[0] * PW - 20); r = Math.max(r, p[0] * PW + 20); b = Math.max(b, p[1] * PW + 20); }));
  if (big) { l = Math.min(l, 50); r = Math.max(r, 1260); }   // 見出しのはば
  return {l: Math.max(0, l), r: Math.min(PW, r), b: top + Math.min(ch + BOXM, b), b0: top + ch + 10}; }
function bandSize() { if (oldPage >= 0 || !Q[cur]) return; const W = window.innerWidth, H = window.innerHeight, x = boxRect(), bwi = x.r - x.l;
  BS = Math.max(0.15, Math.min(BF * W * (big ? 1 : 0.8) / (BX1 - BX0), (W - 12) / bwi, (H - 220) / x.b0));   // 字の大きさは式だけで決める（下を広げても字は小さくならない）
  const bw = Math.ceil(bwi * BS), bh = Math.ceil(x.b * BS) + HD, top0 = 154 + SAT();
  bstage.style.transform = `translate(${-x.l * BS}px,${HD}px) scale(${BS})`;
  band.style.width = bw + "px"; band.style.height = bh + "px";
  if (!BOX) BOX = {x: 6, y: top0 + 6};
  BOX.x = Math.max(60 - bw, Math.min(W - 60, BOX.x)); BOX.y = Math.max(top0, Math.min(H - 40, BOX.y));
  band.style.left = BOX.x + "px"; band.style.top = BOX.y + "px"; view.style.top = top0 + "px"; }
function showPaper(keepView) { const h = cq().h, wl = document.createElement("div"); wl.className = "wlab"; wl.style.top = "8px"; wl.textContent = "式と計算";
  const ad = document.createElement("button"); ad.className = "addp"; ad.textContent = "＋ 紙を足す"; ad.style.top = (h + 50) + "px";
  ad.addEventListener("pointerup", ev => { ev.stopPropagation(); const o = cq(); o.h += ADD; save(); const ty = TY; showPaper(true); TY = ty; clampPan(); apply(); draw(); msg("紙を足したよ"); });   // 指のあとの click が出ないことがあるので、はなしたときに
  const end = document.createElement("div"); end.className = "wline"; end.style.top = h + "px";
  build(h + ADDH, [wl, end, ad]); if (!keepView) fitWidth(); else { clampPan(); apply(); } }
function show(i, keepView) {
  oldPage = -1; document.body.classList.remove("oldmode");
  cur = Math.max(0, Math.min(Q.length - 1, i)); const q = Q[cur];
  big = false; BF = 1; BOX = null; BXH = 10; buildBand(); showPaper(keepView);
  $("pg").textContent = q.p + "ページ (" + q.k + ")"; planBar(); undo = []; draw();
  lsSet("sp-q", String(cur)); if (db) db.doc("state/last").set({q: cur, t: Date.now()}).catch(() => {});
  loadInk(ikey()); recOpen();
}
function showOld(p) {   // 前のページごとの書きこみ（見るだけ）
  oldPage = p; document.body.classList.add("oldmode");
  const im = document.createElement("img"); im.src = PAGES[p - 1]; im.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%";
  build(PH, [im]); $("pg").textContent = p + "ページ（前の書きこみ）"; undo = []; draw(); fitWidth(); loadInk(ikey());
}
function toggleBig() { if (oldPage >= 0) return; big = !big; buildBand(); draw(); clampPan(); apply(); }
$("bBig").addEventListener("pointerup", ev => { ev.stopPropagation(); toggleBig(); });

/* ---- 保存（端末と db。iPad は開き直すと端末の分が消えることがあるので db にも置く） ---- */
let saveT = null, dirty = new Set(), loaded = new Set();
function pack(o) { return {s: o.s, m: o.m, h: o.h}; }
const edits = {};   // 11-08: 問題ごとの「書いた回数」。読みこみの返事がおそいとき、そのあいだに書いていたら返事を使わない（下の loadInk）
function save() { if (oldPage >= 0) return; const k = ikey(), o = cq(); delete o.old; edits[k] = (edits[k] || 0) + 1; dirty.add(k); lsSet("sp-ink2-" + k, JSON.stringify(pack(o))); pendMark("ink2/" + k, true); clearTimeout(saveT); saveT = setTimeout(flush, 800); }
function flush() { dirty.forEach(k => put("ink2/" + k)); dirty.clear(); }   // 11-06: 送れなかったら sp-pend に残り、あとで送り直す（下の「送り直す」）
function repaint(k) { if (k !== ikey()) return; bandSize(); if (oldPage < 0) { const ty = TY; showPaper(true); TY = ty; clampPan(); apply(); } draw(); }
async function loadInk(k) {
  const isQ = k[0] === "q", qi = isQ ? Q.findIndex((q, i) => qkey(i) === k) : -1;
  if (!loaded.has(k)) { loaded.add(k);
    if (!isQ) { try { const a = JSON.parse(lsGet("sp-ink-" + k) || "[]"); if (a.length || !ink[k]) ink[k] = a; } catch (e) {} }
    else { const n = lsGet("sp-ink2-" + k);
      if (n) { try { ink[k] = norm(JSON.parse(n)); } catch (e) {} }
      else { try { const a = JSON.parse(lsGet("sp-ink-" + k) || "[]"); if (a.length) ink[k] = fromOld(a, qi); } catch (e) {} } }
    repaint(k); }
  if (!db) return;
  const e0 = edits[k] || 0, fresh = () => (edits[k] || 0) === e0;   // 11-08（ユーザー「やってる途中できえた」）: 読んでいるあいだに書いたら、古い返事で入れかえない
  try {
    if (!isQ) { const d = await db.doc("ink/" + k).get(); if (d.exists && k === ikey() && fresh()) { const a = JSON.parse(d.data().s || "[]"); if (a.length >= (ink[k] || []).length) { ink[k] = a; lsSet("sp-ink-" + k, d.data().s); draw(); } } return; }
    const d = await db.doc("ink2/" + k).get();
    if (d.exists) { if (!fresh() || dirty.has(k) || pendGet().includes("ink2/" + k)) return; const x = d.data(), o = norm({s: JSON.parse(x.s || "[]"), m: JSON.parse(x.m || "[]"), h: x.h});
      if (!ink[k] || ink[k].old || nOf(o) >= nOf(ink[k])) { ink[k] = o; lsSet("sp-ink2-" + k, JSON.stringify(pack(o))); repaint(k); } return; }
    if (lsGet("sp-ink2-" + k) || dirty.has(k) || (ink[k] && !ink[k].old && nOf(ink[k]))) return;   // 新しい形がもう手元にある
    const od = await db.doc("ink/" + k).get();   // 前の形（読むだけ）
    if (od.exists && !dirty.has(k) && fresh()) { const a = JSON.parse(od.data().s || "[]"); if (a.length && (!ink[k] || ink[k].old || !nOf(ink[k]))) { ink[k] = fromOld(a, qi); repaint(k); } }
  } catch (e) {}
}

/* ---- 記録（11-02 ユーザー「時間はページ単位で1個。同じページを何度もやるので、履歴で〇✕と時間を残したい」）
   ページ（本の1ページ＝4問）ごとに、1回ぶん {d: 日付, sec: このページの時間, marks: [(1)〜(4) の true/false/null], t} を tries に足していく。
   時間はそのページの4問を行き来しても止まらない。ちがうページへ行くと0から ---- */
let rPage = 0, rMarks = [], rEdited = false;
const tSec = k => { const o = tmOf(k); return Math.floor((o.ms + (o.la && !o.ps ? Math.min(Date.now() - o.la, GAP) : 0)) / 1000); };
const pkey = p => "p" + p2(p);
const qsOf = p => Q.filter(q => q.p === p);
function recOf(k) { return recs[k] || (recs[k] = {tries: []}); }
function fmtSec(s) { return Math.floor(s / 60) + "分" + p2(s % 60) + "秒"; }
const mkCh = m => m === true ? "〇" : m === false ? "✕" : "・";
// 11-03 直し: 記録するたびに tries に1回ぶん足すので、1問ずつ記録すると前の〇✕は前の try に残る。
// 画面では、問題ごとに「いちばん新しい、null でない〇✕」を出す。前の記録の一覧は、同じ日の try を1つにまとめる（新しいほうが勝つ・時間は足す）。保存されている tries は書きかえない
const isMk = m => m === true || m === false;
function savedMark(p, j) { const t = (recs[pkey(p)] || {}).tries || []; for (let n = t.length - 1; n >= 0; n--) { const m = (t[n].marks || [])[j]; if (isMk(m)) return m; } return null; }
function byDay(t, n) { const g = []; t.forEach(x => { let y = g.find(z => z.d === x.d); if (!y) g.push(y = {d: x.d, sec: 0, marks: Array(n).fill(null)}); y.sec += +x.sec || 0; (x.marks || []).forEach((m, j) => { if (isMk(m)) y.marks[j] = m; }); });
  return g.sort((a, b) => a.d < b.d ? 1 : a.d > b.d ? -1 : 0); }
function histText() { const t = recOf(pkey(rPage)).tries; if (!t.length) return "このページの記録：まだなし";
  return "前の記録：" + byDay(t, qsOf(rPage).length).slice(0, 3).map(x => (x.d || "").slice(5).replace("-", "/") + " " + (x.sec ? fmtSec(x.sec) + " " : "") + x.marks.map(mkCh).join("")).join("　／　"); }
// 〇✕は1問ずつ（いま開いている問題の〇・✕だけを出す）。ほかの問題の〇✕は小さく並べて見せる
function recPaint() { const box = $("marks"); box.innerHTML = ""; const qs = qsOf(rPage), j = qs.findIndex(q => Q[cur] && q.k === Q[cur].k);
  if (j >= 0 && oldPage < 0) {
    const lab = document.createElement("span"); lab.textContent = "(" + qs[j].k + ")"; lab.style.fontWeight = "700"; box.append(lab, " ");
    const sv = isMk(rMarks[j]) ? null : savedMark(rPage, j);   // まだ押していないときは、記録ずみの〇✕をうすく出す
    [[true, "〇", "o"], [false, "✕", "x"]].forEach(([v, t, c]) => { const b = document.createElement("button"); b.className = "mk" + (rMarks[j] === v ? " " + c : sv === v ? " " + c + " sv" : ""); b.textContent = t;
      b.onclick = () => { rMarks[j] = rMarks[j] === v ? null : v; recPaint(); }; box.append(b, " "); });
  }
  const sm = document.createElement("span"); sm.style.cssText = "font-size:14px;color:#555;margin-left:6px"; sm.textContent = "このページ " + qs.map((q, i) => "(" + q.k + ")" + mkCh(isMk(rMarks[i]) ? rMarks[i] : savedMark(rPage, i))).join(" "); box.append(sm);
  $("hist").textContent = histText(); }
function recFill() {}   // 時間は画面に出さない（11-02 ユーザー「今何分か見えると、気になってしまう」）。裏で測って記録だけする
function recOpen() { const p = Q[cur].p; if (p !== rPage) { tmFlush(); rPage = p; rMarks = qsOf(p).map(() => null); rEdited = false; $("rDate").value = ymd(new Date()); loadRec(pkey(p)); } tShow(); recFill(); recPaint(); }
// 11-06: db の記録と端末だけの記録（まだ送れていない分）を t で1つにする（どちらも消さない）
async function loadRec(k) {
  try { const a = JSON.parse(lsGet("sp-rec-" + k) || "null"); if (a && a.tries) recs[k] = a; } catch (e) {}
  try { const a = JSON.parse(lsGet("sp-tm-" + k) || "null"); if (a && (+a.t || 0) > (tmOf(k).t || 0)) tms[k] = tmNorm(a); } catch (e) {}
  if (k === pkey(rPage)) { recPaint(); tShow(); }
  if (!db) return;
  try { const d = await db.doc("tm/" + k).get(); if (d.exists) { const a = tmNorm(d.data()); if (a.t > (tmOf(k).t || 0)) { tms[k] = a; lsSet("sp-tm-" + k, JSON.stringify(a)); if (k === pkey(rPage)) tShow(); } } } catch (e) {}
  try { const d = await db.doc("rec/" + k).get(); if (d.exists && Array.isArray(d.data().tries)) { recs[k] = {tries: mergeTries(d.data().tries, recOf(k).tries)}; lsSet("sp-rec-" + k, JSON.stringify(recs[k])); if (k === pkey(rPage) && oldPage < 0) recPaint(); } } catch (e) {}
}
// 11-03 直し（ユーザー「記録するを押しても記録されない・何も出ない」）: 時間の保存でつまずいても、〇✕は先に残して「記録したよ」を出す
$("rSave").onclick = async () => {
  if (rMarks.every(m => m === null || m === undefined)) { msg("1問ずつ、〇か✕をおしてね"); return; }
  const k = pkey(rPage), r = recOf(k); r.tries = Array.from(r.tries || []); let sec = 0; try { sec = tSec(k) || 0; } catch (e) {}   // 11-05 直し: db から読んだ tries は書きかえ不可（iPad Safari で push が止まった）。写してから足す
  r.tries.push({d: $("rDate").value || ymd(new Date()), sec, marks: rMarks.map(m => m === undefined ? null : m), t: Date.now()});
  lsSet("sp-rec-" + k, JSON.stringify(r)); rMarks = qsOf(rPage).map(() => null); rEdited = false; msg("記録したよ");
  try { tReset(k); } catch (e) {}
  try { recPaint(); } catch (e) {}
  if (!(await put("rec/" + k))) msg("この iPad に残しました。ネットにつながったら送ります");
};
let rclr = 0; $("rClear").onclick = () => { if (Date.now() - rclr > 3000) { rclr = Date.now(); msg("もう一度おすと、このページの4問の線を全部消します（記録は消えません）"); return; }
  rclr = 0; qsOf(rPage).forEach(q => { const k = "q" + p2(q.p) + "_" + q.k; ink[k] = blank(); loaded.add(k); dirty.add(k); lsSet("sp-ink2-" + k, JSON.stringify(pack(ink[k]))); });
  undo = []; repaint(ikey()); clearTimeout(saveT); saveT = setTimeout(flush, 300); msg("4問の線を消しました"); };

/* ---- ペンと指（計算用紙と帯のメモ。どちらもペンで書く・指は用紙を動かす） ---- */
const pts = new Map(); let drawing = null, pinch = null, pan = null, btap = null;
function ptIn(el, ev) { const r = el.getBoundingClientRect(); return [r4((ev.clientX - r.left) / r.width), r4((ev.clientY - r.top) / r.width)]; }
const elOf = sf => sf === "m" ? mcv : stage;
function eraseAt(sf, p) { const a = arrOf(sf), r = sf === "m" ? 0.02 : 0.012; const i = a.findIndex(s => s.p.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < r));
  if (i >= 0) { undo.push({t: "del", a, s: a[i], i}); a.splice(i, 1); draw(); save(); } }
function penDown(ev, el, sf) {
  try { el.setPointerCapture(ev.pointerId); } catch (e) {}
  const p = ptIn(elOf(sf), ev); if (erase) { drawing = {erase: true, id: ev.pointerId, sf}; eraseAt(sf, p); return; }
  tTick();   // 書いているあいだの時間を、そのページに足す
  const a = arrOf(sf), s = {c: color, p: [p]}; a.push(s); drawing = {s, a, sf, id: ev.pointerId}; draw(); }
function penMove(ev) { let es = ev.getCoalescedEvents ? ev.getCoalescedEvents() : []; if (!es.length) es = [ev];
  if (drawing.erase) { es.forEach(e => eraseAt(drawing.sf, ptIn(elOf(drawing.sf), e))); return; }
  es.forEach(e => drawing.s.p.push(ptIn(elOf(drawing.sf), e))); draw(); }
function penUp() { if (!drawing.erase) { tTick(); undo.push({t: "add", a: drawing.a, s: drawing.s}); if (undo.length > 80) undo.shift(); save(); } drawing = null; }
const writes = ev => oldPage < 0 && (ev.pointerType === "pen" || ev.pointerType === "mouse" || (finger && !penSeen && ev.pointerType === "touch"));
view.addEventListener("pointerdown", ev => {
  if (ev.pointerType === "pen") penSeen = true;
  if (ev.target.closest && ev.target.closest(".addp")) return;   // 「紙を足す」はおすだけ
  if (writes(ev) && !pinch && pts.size === 0 && !drawing) { penDown(ev, view, "s"); return; }
  if (ev.pointerType !== "touch") return;
  pts.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});
  if (pts.size === 2) { pan = null; const [a, b] = [...pts.values()]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), z: Z, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx: TX, ty: TY}; }
  else if (pts.size === 1) pan = {x: ev.clientX, y: ev.clientY, tx: TX, ty: TY};
});
view.addEventListener("pointermove", ev => {
  if (drawing && ev.pointerId === drawing.id) { penMove(ev); return; }
  if (!pts.has(ev.pointerId)) return; pts.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});
  const vr = view.getBoundingClientRect();
  if (pinch && pts.size >= 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    const nz = Math.max(0.3, Math.min(6, pinch.z * d / pinch.d)); const ox = pinch.cx - vr.left, oy = pinch.cy - vr.top;
    TX = ox - (ox - pinch.tx) * nz / pinch.z + (cx - pinch.cx); TY = oy - (oy - pinch.ty) * nz / pinch.z + (cy - pinch.cy); Z = nz; clampPan(); apply(); }
  else if (pan) { TX = pan.tx + ev.clientX - pan.x; TY = pan.ty + ev.clientY - pan.y; clampPan(); apply(); }
});
function up(ev) {
  if (drawing && ev.pointerId === drawing.id) { penUp(); return; }
  pts.delete(ev.pointerId); if (pts.size < 2) pinch = null;
  if (pts.size === 1) { const [a] = [...pts.values()]; pan = {x: a.x, y: a.y, tx: TX, ty: TY}; } else if (!pts.size) pan = null;
}
view.addEventListener("pointerup", up); view.addEventListener("pointercancel", up); view.addEventListener("lostpointercapture", ev => { if (drawing && ev.pointerId === drawing.id) up(ev); });
// 箱: ペンはメモを書く。上の帯（または指）で動かす・右下の角／2本指のピンチで大きさを変える
const bpts = new Map(); let bpinch = null, bmove = null, bsize = null, btall = null;
band.addEventListener("pointerdown", ev => {
  if (ev.pointerType === "pen") penSeen = true;
  if (ev.target === $("bBig")) return;
  if (ev.target === $("bTall")) { btall = {id: ev.pointerId, y: ev.clientY, h: BXH}; try { band.setPointerCapture(ev.pointerId); } catch (e) {} return; }
  if (ev.target === $("bSize")) { bsize = {id: ev.pointerId, x: ev.clientX, y: ev.clientY, w: band.offsetWidth, f: BF}; try { band.setPointerCapture(ev.pointerId); } catch (e) {} return; }
  if (ev.pointerType === "touch") { bpts.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});
    if (bpts.size === 2) { bmove = null; if (drawing && drawing.sf === "m" && !drawing.erase) { const j = drawing.a.indexOf(drawing.s); if (j >= 0) drawing.a.splice(j, 1); drawing = null; draw(); }   // 2本目の指＝ピンチ（1本目で書きはじめた線は消す）
      const [a, b] = [...bpts.values()]; bpinch = {d: Math.hypot(a.x - b.x, a.y - b.y) || 1, f: BF}; return; } }
  if (bpinch) return;
  if (ev.target !== $("bHead") && writes(ev) && !drawing) { penDown(ev, band, "m"); return; }
  bmove = {id: ev.pointerId, x: ev.clientX, y: ev.clientY, bx: BOX.x, by: BOX.y}; try { band.setPointerCapture(ev.pointerId); } catch (e) {}
});
band.addEventListener("pointermove", ev => { if (bpts.has(ev.pointerId)) bpts.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});
  if (bpinch && bpts.size >= 2) { const [a, b] = [...bpts.values()]; BF = Math.max(0.3, Math.min(3, bpinch.f * Math.hypot(a.x - b.x, a.y - b.y) / bpinch.d)); bandSize(); return; }
  if (btall && ev.pointerId === btall.id) { BXH = Math.max(10, Math.min(BOXM, btall.h + (ev.clientY - btall.y) / BS)); bandSize(); return; }
  if (bsize && ev.pointerId === bsize.id) { BF = Math.max(0.3, Math.min(3, bsize.f * (bsize.w + ev.clientX - bsize.x) / bsize.w)); bandSize(); return; }
  if (bmove && ev.pointerId === bmove.id) { BOX.x = bmove.bx + ev.clientX - bmove.x; BOX.y = bmove.by + ev.clientY - bmove.y; bandSize(); return; }
  if (drawing && ev.pointerId === drawing.id) penMove(ev); });
function bup(ev) { bpts.delete(ev.pointerId); if (bpinch) { if (!bpts.size) bpinch = null; return; }
  if (btall && ev.pointerId === btall.id) { btall = null; return; }
  if (bsize && ev.pointerId === bsize.id) { bsize = null; return; }
  if (bmove && ev.pointerId === bmove.id) { bmove = null; return; }
  if (drawing && ev.pointerId === drawing.id) { penUp(); return; } }
band.addEventListener("pointerup", bup); band.addEventListener("pointercancel", bup); band.addEventListener("lostpointercapture", ev => { if (drawing && ev.pointerId === drawing.id) penUp(); });
view.addEventListener("wheel", ev => { ev.preventDefault(); const r = view.getBoundingClientRect();
  if (ev.ctrlKey) zoomAt(Z * (ev.deltaY < 0 ? 1.1 : 0.9), ev.clientX - r.left, ev.clientY - r.top); else { TX -= ev.deltaX; TY -= ev.deltaY; clampPan(); apply(); } }, {passive: false});
document.addEventListener("gesturestart", e => e.preventDefault());

/* ---- ボタン ---- */
function setColor(c, id) { color = c; erase = false; ["cBlack", "cRed", "bErase"].forEach(b => $(b).classList.toggle("on", b === id)); }
$("cBlack").onclick = () => setColor("#111", "cBlack"); $("cRed").onclick = () => setColor("#d0021b", "cRed");
$("bErase").onclick = () => { erase = true; ["cBlack", "cRed", "bErase"].forEach(b => $(b).classList.toggle("on", b === "bErase")); };
$("bUndo").onclick = () => { if (oldPage >= 0) return; const u = undo.pop(); if (!u) return;
  if (u.t === "add") { const j = u.a.lastIndexOf(u.s); if (j >= 0) u.a.splice(j, 1); } else u.a.splice(u.i, 0, u.s); draw(); save(); };
$("bFinger").onclick = () => { finger = !finger; penSeen = false; $("bFinger").textContent = "指で書く：" + (finger ? "オン" : "オフ"); $("bFinger").classList.toggle("on", finger); };
$("bPrev").onclick = () => oldPage >= 0 ? show(Math.max(0, Q.findIndex(q => q.p === oldPage))) : (planStep(-1) || show(cur - 1));
$("bNext").onclick = () => oldPage >= 0 ? show(Math.max(0, Q.findIndex(q => q.p === oldPage))) : (planStep(1) || show(cur + 1));
const vc = () => [view.clientWidth / 2, view.clientHeight / 2];
$("bZin").onclick = () => zoomAt(Z * 1.3, ...vc()); $("bZout").onclick = () => zoomAt(Z / 1.3, ...vc()); $("bFit").onclick = fit;
let clr = 0; $("bClear").onclick = () => { if (oldPage >= 0) return; if (Date.now() - clr > 3000) { clr = Date.now(); msg("もう一度おすと、この問題の線を全部消します（メモも）"); return; }
  clr = 0; const o = cq(); if (!o.s.length && !o.m.length) return;
  [o.s, o.m].forEach(a => { undo.push(...a.map((s, i) => ({t: "del", a, s, i})).reverse()); a.length = 0; }); draw(); save(); msg("消しました"); };
const OLD = [3, 4, 12];   // 前にページごとに書いたページ番号（db に ink/p◯◯ があるもの。開いたときに足す）
function lastMark(i) { const j = qsOf(Q[i].p).findIndex(q => q.k === Q[i].k); return savedMark(Q[i].p, j); }   // 11-03: 最後の try だけでなく、問題ごとにいちばん新しい〇✕
function hasInk(k) { if (ink[k]) return nOf(ink[k]) > 0; const n = lsGet("sp-ink2-" + k); if (n) { try { return nOf(JSON.parse(n)) > 0; } catch (e) { return false; } } return (lsGet("sp-ink-" + k) || "").length > 2; }
/* ---- 今日の問題（11-03 ユーザー「今日やる問題を 1ページの(2)(3)、5ページの(1)(4) のように親が指定して、子どもができるように」）
   db plan/today {d: 日付, qs: ["01_2", ...], t}。その日のうちだけ有効。決めた日は ◀▶ が今日の問題の中だけを動く ---- */
let plan = {d: "", qs: []}, picking = false, pickSel = [];
try { const a = JSON.parse(lsGet("sp-plan") || "null"); if (a && Array.isArray(a.qs)) plan = a; } catch (e) {}
const pqk = i => p2(Q[i].p) + "_" + Q[i].k;
const planOn = () => plan.d === ymd(new Date()) && plan.qs.length > 0;
const planIdx = () => plan.qs.map(k => Q.findIndex((q, i) => pqk(i) === k)).filter(i => i >= 0);
const planName = k => { const [pp, kk] = k.split("_"); return (+pp) + "ページ(" + kk + ")"; };
function planSet(qs) { plan = {d: ymd(new Date()), qs, t: Date.now()}; lsSet("sp-plan", JSON.stringify(plan));
  put("plan/today").then(ok => { if (!ok) msg("今日の問題は この iPad に残しました。ネットにつながったら送ります"); }); planBar(); }
async function planLoad() { if (!db) return; try { const d = await db.doc("plan/today").get(); if (d.exists && Array.isArray(d.data().qs) && (+d.data().t || 0) >= (+plan.t || 0)) { plan = d.data(); lsSet("sp-plan", JSON.stringify(plan)); planBar(); } } catch (e) {} }
function planBar() { if (!Q[cur]) return; const ix = planIdx(), j = ix.indexOf(cur);
  $("pg").textContent = (planOn() && j >= 0 ? "今日 " + (j + 1) + "/" + ix.length + "・" : "") + Q[cur].p + "ページ (" + Q[cur].k + ")"; }
function planStep(d) { const ix = planIdx(), j = ix.indexOf(cur);
  if (!planOn() || j < 0) return false;
  if (j + d < 0 || j + d >= ix.length) { msg(d > 0 ? "今日の問題は これで おわり。記録したかな？" : "今日の最初の問題です"); return true; }
  show(ix[j + d]); return true; }
function renderPlan(L) { const box = document.createElement("div"); box.className = "plan";
  const h = document.createElement("h3"); h.textContent = picking ? "今日の問題をえらんでいます（下の問題を押す）" : "今日の問題"; box.append(h);
  const row = document.createElement("div"); row.className = "row"; box.append(row);
  if (picking) {
    const t = document.createElement("span"); t.textContent = pickSel.length ? pickSel.map(planName).join("・") : "まだ えらんでいません"; row.append(t);
    const ok = document.createElement("button"); ok.className = "act"; ok.textContent = "これで決める（" + pickSel.length + "問）";
    ok.onclick = () => { picking = false; planSet(pickSel.slice()); renderList(); if (plan.qs.length) msg("今日の問題を決めました"); };
    const cl = document.createElement("button"); cl.textContent = "やめる"; cl.onclick = () => { picking = false; renderList(); };
    row.append(ok, cl);
  } else {
    if (planOn()) planIdx().forEach(i => { const b = document.createElement("button"); b.className = "pl"; b.textContent = planName(pqk(i));
      const m = lastMark(i); if (m !== null) { const s = document.createElement("span"); s.className = "m " + (m ? "o" : "x"); s.textContent = m ? "〇" : "✕"; b.append(s); }
      b.onclick = () => { L.classList.remove("show"); show(i); }; row.append(b); });
    else { const t = document.createElement("span"); t.textContent = "まだ決まっていません"; row.append(t); }
    const ed = document.createElement("button"); ed.textContent = "今日の問題を決める（おうちの人）";
    ed.onclick = () => { picking = true; pickSel = planOn() ? plan.qs.slice() : []; renderList(); }; row.append(ed);
    if (planOn()) { const n = document.createElement("div"); n.className = "note"; n.textContent = "◀ ▶ で、今日の問題だけを順に開けます"; box.append(n); }
  }
  L.append(box); }
function renderList() { const L = $("list"); L.innerHTML = ""; let row = null, lp = 0; renderPlan(L);
  Q.forEach((q, i) => { if (q.p !== lp) { lp = q.p; row = document.createElement("div"); row.className = "pgrow"; const s = document.createElement("span"); s.className = "pgno"; s.textContent = q.p + "ページ"; row.append(s); L.append(row);
      if (OLD.includes(q.p)) { const o = document.createElement("button"); o.className = "old"; o.textContent = "前の書きこみ"; o.onclick = () => { L.classList.remove("show"); showOld(q.p); }; row.append(o); } }
    const b = document.createElement("button"); b.textContent = "(" + q.k + ")"; if (i === cur && oldPage < 0) b.classList.add("cur");
    const m = lastMark(i); if (m !== null) { const s = document.createElement("span"); s.className = "m " + (m ? "o" : "x"); s.textContent = m ? "〇" : "✕"; b.append(s); }
    else if (hasInk(qkey(i))) b.append(" ✏️");
    if (picking) { if (pickSel.includes(pqk(i))) b.classList.add("sel"); b.onclick = () => { const k = pqk(i), j = pickSel.indexOf(k); if (j >= 0) pickSel.splice(j, 1); else pickSel.push(k); renderList(); }; }
    else { if (planOn() && plan.qs.includes(pqk(i))) b.classList.add("pl"); b.onclick = () => { L.classList.remove("show"); show(i); }; }
    row.append(b); }); }
$("bList").onclick = () => { const L = $("list"); if (L.classList.toggle("show")) renderList(); };
// タイマー（ページごと。そのページで書きはじめると動き、「記録する」で止まって記録に入る。時間は画面に出さない）
// 11-03 直し: 前は画面の中だけで測っていたので、開き直す・ほかのページへ行って戻る・ほかの端末で「記録する」を押すと 0秒 になっていた（11-03 の p13 は3回とも 0秒）。
// いまは ページごとに tm/p◯◯ {ms: 足した時間, la: 最後に書いた時刻, ps: 一時停止中, t} を端末と db に置き、ペンを置く・はなすたびに前からの間（GAP まで）を足す。
// 「記録する」で ms と、最後に書いてから押すまで（GAP まで）を sec に入れて 0 にもどす。ちがう日に続きを書いたら 0 から
const GAP = 5 * 60 * 1000;
let tms = {}, tmT = null;
const tmNorm = o => ({ms: Math.max(0, +o.ms || 0), la: +o.la || 0, ps: !!o.ps, t: +o.t || 0});
function tmOf(k) { return tms[k] || (tms[k] = tmNorm({})); }
function tmPut(k) { try { put("tm/" + k); } catch (e) {} }
function tmSave(k) { const o = tmOf(k); o.t = Date.now(); lsSet("sp-tm-" + k, JSON.stringify(o)); pendMark("tm/" + k, true); clearTimeout(tmT); tmT = setTimeout(() => { tmT = null; tmPut(k); }, 1500); }
function tShow() { const o = rPage ? tmOf(pkey(rPage)) : tmNorm({}), b = $("bTimer"); b.textContent = o.ps ? "再開" : (o.ms || o.la) ? "一時停止" : "はじめ"; b.classList.toggle("on", o.ps); }
function tTick() { if (oldPage >= 0 || !rPage) return; const k = pkey(rPage), o = tmOf(k), n = Date.now(); if (o.ps) return;
  if (o.la && ymd(new Date(o.la)) !== ymd(new Date(n))) { o.ms = 0; o.la = 0; }   // ちがう日の続きは 0 から
  if (o.la && n - o.la < GAP) o.ms += n - o.la; o.la = n; tmSave(k); tShow(); }
function tReset(k) { tms[k] = tmNorm({}); tmSave(k); clearTimeout(tmT); tmT = null; tmPut(k); tShow(); }
$("bTimer").onclick = () => { if (oldPage >= 0 || !rPage) return; const k = pkey(rPage), o = tmOf(k), n = Date.now();
  if (!o.ps) { if (o.la) o.ms += Math.min(n - o.la, GAP); o.la = 0; o.ps = true; tmSave(k); tShow(); msg("時間を止めました"); }
  else { o.ps = false; o.la = n; tmSave(k); tShow(); msg("時間をまた はかりはじめました"); } };
window.addEventListener("resize", () => { if (oldPage < 0) { buildBand(); draw(); } clampPan(); apply(); });
const tmFlush = () => { if (tmT && rPage) { clearTimeout(tmT); tmT = null; tmPut(pkey(rPage)); } };
document.addEventListener("visibilitychange", () => { if (document.hidden) { flush(); tmFlush(); } else pendFlush(); });
window.addEventListener("pagehide", () => { flush(); tmFlush(); });

/* ---- 送り直す（11-06 ユーザー「結果が保存できない時間が続いた。オンラインに復帰したら送って。ブラウザを閉じても消えないように」）
   送る前に端末の sp-pend に「まだ送っていない」を書き、送れたら消す。送る中身は、そのとき端末にあるものから作る。
   ネットに戻ったとき・開き直したとき・画面にもどったとき・30秒ごとに送り直す。
   記録（rec）は db の tries と端末の tries を t で1つにして送る（どちらも消さない）。送れない間は上に「まだ送れていない記録」を出す ---- */
const pendGet = () => { try { const a = JSON.parse(lsGet("sp-pend") || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
let pendFail = false;
function pendMark(p, on) { const a = pendGet().filter(x => x !== p); if (on) a.push(p); lsSet("sp-pend", JSON.stringify(a)); pendShow(); }
function pendShow() { const n = pendGet().length, e = $("pend"); if (!e) return; if (!n) pendFail = false; e.style.display = n && pendFail ? "" : "none"; e.textContent = "まだ送れていない記録 " + n + "（ネットにつながったら送ります）"; }
const lsTries = k => { try { const a = JSON.parse(lsGet("sp-rec-" + k) || "null"); return a && Array.isArray(a.tries) ? a.tries : []; } catch (e) { return []; } };
const mergeTries = (...ls) => { const m = new Map(); ls.forEach(a => (a || []).forEach(x => { if (x && x.t) m.set(x.t, JSON.parse(JSON.stringify(x))); })); return [...m.values()].sort((x, y) => x.t - y.t); };
function pendData(p) { const [c, k] = p.split("/");
  if (c === "ink2") { let o = ink[k]; if (!o) { try { o = JSON.parse(lsGet("sp-ink2-" + k) || "null"); } catch (e) {} } if (!o || Array.isArray(o)) return null;
    return {s: JSON.stringify(o.s || []), m: JSON.stringify(o.m || []), h: o.h || PAPER, t: Date.now()}; }
  if (c === "tm") { const o = tmOf(k); return {ms: o.ms, la: o.la, ps: o.ps, t: o.t}; }
  if (c === "plan") return {d: plan.d, qs: plan.qs, t: plan.t};
  return null; }
const sending = new Set();
const tmo = pr => Promise.race([pr, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 10000))]);   // 機内モードで返事が来ないときも10秒で「送れなかった」にする
async function pendSend(p) { if (!db) { pendFail = true; pendShow(); return false; } if (sending.has(p)) return false; sending.add(p);
  try { const [c, k] = p.split("/");
    if (c === "rec") { const d = await tmo(db.doc(p).get()), dt = d.exists && Array.isArray(d.data().tries) ? d.data().tries : [];
      const t = mergeTries(dt, lsTries(k), recOf(k).tries); recs[k] = {tries: t}; lsSet("sp-rec-" + k, JSON.stringify(recs[k]));
      await tmo(db.doc(p).set({tries: t, t: Date.now()})); if (k === pkey(rPage) && oldPage < 0) recPaint(); }
    else { const v = pendData(p); if (v) await tmo(db.doc(p).set(v)); }
    pendMark(p, false); return true;
  } catch (e) { pendFail = true; pendShow(); return false; } finally { sending.delete(p); } }
function put(p) { pendMark(p, true); return pendSend(p); }
async function pendFlush() { if (!db) { try { db = await tmo(claude.use("db")); } catch (e) { db = null; } if (!db) { if (pendGet().length) { pendFail = true; pendShow(); } return; } start(); }
  for (const p of pendGet()) await pendSend(p); pendShow(); }
window.addEventListener("online", pendFlush);
setInterval(pendFlush, 30000);

/* ---- はじめ ---- */
show(+(lsGet("sp-q") || 0) || 0);
let started = false;
async function start() { if (started) return; started = true;
  try { const s = await db.collection("ink").get(); s.docs.forEach(d => { const m = /^p(\d+)$/.exec(d.id); if (m && !OLD.includes(+m[1]) && (d.data().s || "").length > 2) OLD.push(+m[1]); }); } catch (e) {}
  try { const s = await db.collection("rec").get(); s.docs.forEach(d => { if (Array.isArray(d.data().tries)) recs[d.id] = {tries: mergeTries(d.data().tries, lsTries(d.id))}; }); } catch (e) {}
  try { const s = await db.collection("tm").get(); s.docs.forEach(d => { const a = tmNorm(d.data()); if (a.t > tmOf(d.id).t) { tms[d.id] = a; lsSet("sp-tm-" + d.id, JSON.stringify(a)); } }); tShow(); } catch (e) {}
  await planLoad(); if (planOn() && !planIdx().includes(cur)) { show(planIdx()[0]); }
  try { const d = await db.doc("state/last").get(); if (d.exists && typeof d.data().q === "number" && lsGet("sp-q") == null && !planOn()) show(d.data().q); else { loadInk(ikey()); recPaint(); } } catch (e) { loadInk(ikey()); } }
(async () => { try { db = await claude.use("db"); } catch (e) { db = null; } if (db) await start(); pendFlush(); })();
