(function corporateExtras(){
"use strict";
const phrases=[
"Szinergia","Quick win","Ezt még egyeztessük","Stakeholder","Roadmap","Nem az én területem","Proaktivitás","Tegyük parkolópályára","KPI","Erre nincs kapacitás","End-to-end","Scope","Offline folytassuk","Win-win","Holistic approach","Agilis működés","Deadline","Eszkaláció","Alignment","Van erről Excel?","Hatékonyságnövelés","Backlog","Vigyük tovább","Senior management","Lessons learned","Beszéljünk róla","Action item","Business case","Következő sprint","Mérföldkő","Ownership","Transzparencia","Best practice","Nincs rá budget","Validáljuk","Küldök egy meghívót","Governance","Deep dive","Ez csak egy gyors kérdés","Erre térjünk vissza",
"Nem hallunk","Némítva vagy","Látjátok a képernyőmet?","Akadozik a Teams","Még várunk valakire","Kezdhetünk?","Csak öt percem van","Ez lehetett volna e-mail","Megosztom a képernyőt","Köszi mindenkinek","Fussunk neki újra","Hol tartottunk?","Bocsi, előző meeting","Kifutottunk az időből","Van még kérdés?","Én csak hallgatni jöttem","Küldöm a jegyzetet","Felvétel indul","Nem látom a chatet","Nálam működik",
"Folyamatgazda","Gyökérok","PDCA","Lean","Kaizen","SLA","FTE","Kapacitástervezés","Standardizálás","Racionalizáció","Szűk keresztmetszet","Értékáram","Hozzáadott érték","Veszteségfeltárás","Működési modell","Akcióterv","Kockázatelemzés","Hatáselemzés","Jóváhagyási kör","Kontrollpont","Pilot","Proof of concept","MVP","Go-live","UAT","Change request","Scope creep","Business owner","Projektstátusz","Függőség",
"Single source of truth","Data governance","Adatminőség","Dashboard","Refresh","Automatizáljuk","Python","Parquet","Power Query","Power BI","CSV","Excel","Adatgazda","Adattisztítás","Adatmodell","ETL","Pipeline","Production","Gateway","Riportálás","Nincs adat","Rossz a szűrő","Más szám jön ki","Manuálisan frissül","Nyissunk ticketet","Jira","Technikai adósság","Rollback","Tesztkörnyezet","Séma",
"People first","Empowerment","Feedback","Kompetenciamátrix","Onboarding","Coaching","Mentorálás","Talent management","Change management","Work-life balance","Engagement","Reziliencia","Tudásmegosztás","Growth mindset","Performance review","Employee experience","Pszichológiai biztonság","Szervezeti kultúra","Upskilling","Cross-functional",
"Benchmark","CAPEX","OPEX","ROI","Prioritás","Operatív szint","Stratégiai szint","Értékteremtés","Fenntarthatóság","Skálázhatóság","Compliance","Audit","Executive summary","Decision maker","Steering committee","Working group","Workstream","Deliverable","Dependency","Forecast","Actuals","Gap analysis","Target operating model","Resource allocation","Change champion","Showstopper","Blue sky thinking","Low-hanging fruit","Move the needle","Think outside the box",
"Erre most nincs válasz","Kérdezzük meg az IT-t","Majd a vezetőség eldönti","Ezt még pontosítjuk","Ez nem új igény","Most nem aktuális","Függőben van","Megnézem és visszajelzek","Ez csak egy ötlet","Szerintem konszenzus van","Ez már tavaly is téma volt","Ezt felírom","Kellene egy felelős","Nézzük meg a tavalyit","Nem ígérek határidőt","Ez out of scope","Ezt külön kezeljük","Még nem végleges","Egyszerűsítsük le","Legyen róla egy slide","Küldd át a linket","Tudunk erről számot?","Egyelőre maradjon így","Ez nem blocker","Keressünk rá megoldást","A következő körben","Kicsit zoomolj rá","Ezt még nem kommunikáljuk","Jövő héten folytatjuk","Van erre egy folyamatunk?"];
const pool=[...new Set(phrases)];
const lines=[...Array.from({length:5},(_,i)=>Array.from({length:5},(_,j)=>i*5+j)),...Array.from({length:5},(_,i)=>Array.from({length:5},(_,j)=>i+5*j)),[0,6,12,18,24],[4,8,12,16,20]];
const wins=m=>lines.filter(row=>row.every(i=>m.includes(i)));
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function makeBoard(prev=[]){const excluded=new Set(prev);const fresh=pool.filter(x=>!excluded.has(x));const selected=shuffle(fresh.length>=24?fresh:pool).slice(0,24);selected.splice(12,0,"FREE / H₂O");return selected}
const $=id=>document.getElementById(id),read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const BK="hydro-laci-bingo-v1";
let b=read(BK,{});
if(!Array.isArray(b.board)||b.board.length!==25||b.board[12]!=="FREE / H₂O"||!b.board.every(v=>typeof v==="string")||new Set(b.board).size!==25)b.board=null;
if(!Array.isArray(b.marked))b.marked=[12];else b.marked=[...new Set([12,...b.marked.filter(x=>Number.isInteger(x)&&x>=0&&x<25)])];
if(!Number.isFinite(b.sessions))b.sessions=0;if(!Number.isFinite(b.bingos))b.bingos=0;b.credited=!!b.credited;
let cells=[],bOpen=false;
const css=`
#corp-extras{display:grid;gap:17px;margin-top:18px}
.ce-panel{padding:16px;overflow:hidden}
.ce-top{display:flex;align-items:center;justify-content:space-between;gap:8px;font:10px var(--mono);letter-spacing:.08em;color:var(--ce)}
.ce-chip{border:1px solid var(--ce);padding:4px 7px;border-radius:5px;white-space:nowrap;font-size:9px}
.ce-title{margin:11px 0 5px;font-size:29px;letter-spacing:-.055em;line-height:1.08;color:#eef7fa}
.ce-desc{font-size:12px;color:#adc0cb;line-height:1.5;margin:0 0 12px}
.ce-btn{border:1px solid #455c68;border-radius:9px;background:#172b38;color:#dceaf1;min-height:44px;padding:9px 12px;font:700 11px var(--mono);touch-action:manipulation}
.ce-primary{background:var(--ce);color:#101e24;border-color:transparent}
.ce-btn:focus-visible,.ce-cell:focus-visible{outline:2px solid #fff;outline-offset:2px}
.ce-actions{display:flex;gap:7px;margin-top:11px;flex-wrap:wrap}.ce-actions button{flex:1}
.ce-bingo{--ce:#53e5ec;background:radial-gradient(ellipse at top right,#49d2d519,transparent 60%),linear-gradient(140deg,#142733,#101927)}
.ce-bingo-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}
.ce-letter{font:800 22px var(--mono);text-align:center;color:#53e5ec;padding:4px 0}
.ce-cell{aspect-ratio:1/1.09;min-width:0;border:1px solid #314b5b;background:#102432;border-radius:7px;padding:4px 2px;color:#c6dbe6;font-size:clamp(9px,2.55vw,12px);line-height:1.15;font-weight:600;overflow-wrap:anywhere;hyphens:auto;display:grid;place-items:center;text-align:center;position:relative;touch-action:manipulation}
.ce-cell.marked{background:#214737;color:#c1ffb1;border-color:#68b383}
.ce-cell.won{background:#2b6750;border-color:#bbf5a3;box-shadow:inset 0 0 10px #b0f27a22}
.ce-cell.free{background:#18404b;color:#8feef3;border-color:#4d99a9;cursor:default}
.ce-cell.marked:not(.free)::after{content:"✓";position:absolute;top:2px;right:3px;font-size:9px;color:#b0f27a}
.ce-bingo-msg{min-height:40px;margin:12px 0 0;font:12px/1.45 var(--mono);color:#a9becd}
.ce-bingo-msg.win{color:#b0f27a;font-weight:700}
.ce-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:10px 0}
.ce-stats>div{background:#0c1923;border:1px solid #304552;border-radius:8px;padding:7px;min-width:0}
.ce-stats b{display:block;color:var(--ce);font:700 17px var(--mono)}.ce-stats small{font:9px var(--mono);color:#9fb2bf;overflow-wrap:anywhere}
.ce-hidden[hidden]{display:none!important}
.ce-label{font:10px/1.5 var(--mono);color:#9ab0bc;margin:9px 0 0}
@media(max-width:360px){.ce-panel{padding:10px}.ce-cell{font-size:9px}.ce-btn{padding:8px 5px;font-size:10px}}
`;
function newMeeting(){b.board=makeBoard(b.board||[]);b.marked=[12];b.credited=false;b.sessions++;bOpen=true;save(BK,b);renderBingo()}
function renderBingo(){const active=!!b.board&&bOpen;const area=$("ce-bingo-area");area.hidden=!active;$("ce-new").textContent=active?"↻ ÚJ MEETING":"▶ ÚJ MEETING INDÍTÁSA";$("ce-resume").hidden=active||!b.board;$("ce-bingo-sessions").textContent=b.sessions;$("ce-bingo-total").textContent=b.bingos;$("ce-bingo-hits").textContent=active?b.marked.length-1:"—";
 if(!active)return;const won=wins(b.marked),highlight=new Set(won.flat());cells.forEach((c,i)=>{c.textContent=i===12?"💧\nSZABAD":b.board[i];c.classList.toggle("marked",b.marked.includes(i));c.classList.toggle("won",highlight.has(i));c.classList.toggle("free",i===12);c.setAttribute("aria-pressed",String(b.marked.includes(i)));c.setAttribute("aria-label",b.board[i]);c.disabled=i===12});const m=$("ce-bingo-msg");m.classList.toggle("win",!!won.length);m.textContent=won.length?(won.length===12?"FULL HOUSE! A vállalat minden buzzwordöt elhasznált.":"BINGO! "+won.length+" teljes vonal. Ez a meeting hivatalosan is lehetett volna e-mail."):"Hallott kifejezések: "+(b.marked.length-1)+"/24 · 5 egy vonalban = BINGO."}
function toggleCell(i){if(!bOpen||i===12)return;b.marked=b.marked.includes(i)?b.marked.filter(x=>x!==i):[...b.marked,i];if(wins(b.marked).length&&!b.credited){b.credited=true;b.bingos++}save(BK,b);renderBingo()}
function mount(){if($("corp-extras"))return;const style=document.createElement("style");style.textContent=css;document.head.append(style);const host=document.createElement("div");host.id="corp-extras";host.innerHTML=`<section class="panel ce-panel ce-bingo" aria-label="Meeting Bingo"><div class="ce-top"><span>04 / MEETING BINGO</span><span class="ce-chip">v1.0 · LIVE</span></div><h2 class="ce-title">Ez lehetett volna e-mail.</h2><p class="ce-desc">Új meeting, új tábla. Koppints arra, amit tényleg kimondtak. Öt találat egy sorban, oszlopban vagy átlóban = BINGO, a középső H₂O mező ajándék.</p><div class="ce-stats"><div><b id="ce-bingo-hits">—</b><small>TALÁLAT</small></div><div><b id="ce-bingo-sessions">0</b><small>MEETING</small></div><div><b id="ce-bingo-total">0</b><small>BINGÓS MEETING</small></div></div><div id="ce-bingo-area" class="ce-hidden" hidden><div class="ce-bingo-grid">${"BINGO".split("").map(x=>`<span class="ce-letter">${x}</span>`).join("")}${Array.from({length:25},(_,i)=>`<button type="button" class="ce-cell" data-cell="${i}"></button>`).join("")}</div><p class="ce-bingo-msg" id="ce-bingo-msg" aria-live="polite"></p><button type="button" class="ce-btn" id="ce-bingo-clear">Találatok nullázása</button></div><div class="ce-actions"><button type="button" class="ce-btn ce-primary" id="ce-new"></button><button type="button" class="ce-btn ce-hidden" id="ce-resume" hidden>Előző meeting folytatása</button></div><p class="ce-label">${pool.length} kifejezés · 24 véletlen mező · Két egymást követő táblán nincs azonos kifejezés. A játék állapota helyben mentve.</p></section>`;
 const arcade=$("arcade"),foot=document.querySelector(".footnote");if(arcade)arcade.before(host);else if(foot)foot.before(host);else document.querySelector("main").append(host);
 cells=[...host.querySelectorAll(".ce-cell")];
 cells.forEach((el,i)=>el.onclick=()=>toggleCell(i));$("ce-new").onclick=newMeeting;$("ce-resume").onclick=()=>{bOpen=true;renderBingo()};$("ce-bingo-clear").onclick=()=>{b.marked=[12];save(BK,b);renderBingo()};
renderBingo()}
if(typeof window!=="undefined"&&window.__corporateExtrasTest){window.__corporateExtrasTest({pool,makeBoard,wins});return}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
