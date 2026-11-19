(function arcadeCore(){
"use strict";
const W=390,H=450, $=id=>document.getElementById(id), clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), rand=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const defs=[
{id:"catch",name:"H₂O Catcher",file:"catcher.py",desc:"Kapd el az értékes adatokat. A kávé kritikus incidens.",type:"REFLEX",color:"#55e9ed",art:["water","python","csv"],help:"Húzd a kulacsot jobbra-balra, vagy használd a nyilakat. A zöld + jelű tárgyak jók, a piros − jelűek veszélyesek."},
{id:"runner",name:"Parquet Runner",file:"runner.py",desc:"Patcheld át magad a vállalati akadályokon.",type:"ENDLESS",color:"#ffc078",art:["avatar","parquet","excel"],help:"Érintsd a pályát, vagy nyomd a Space / ↑ gombot az ugráshoz. A CSV, Excel, kávé és NULL akadály. A víz, Python és Parquet bónusz."},
{id:"merge",name:"Parquet 2048",file:"merge.py",desc:"Azonos blokkok összevonása. Excel mint joker? Igen.",type:"PUZZLE",color:"#c7a2ff",art:["tile","excel","tile"],help:"Húzz egy blokkot közvetlenül egy másik, azonos számú blokkra. A célmező duplázódik. Üres mezőre mozgathatsz vagy új blokkot helyezhetsz. Az Excel joker bármely szám párja. Koppintással is működik."},
{id:"bug",name:"Bug Hunt",file:"debugger.exe",desc:"Egy rossz kattintás, és te leszel az incidens.",type:"30 SEC",color:"#ff8197",art:["bug","check","coffee"],help:"Kapd el a piros hibákat! Ne kattints a zöld, egészséges folyamatokra. A ritka arany kritikus hiba extra pontot ér."},
{id:"snake",name:"Data Snake",file:"snake.py",desc:"A Python mindent megeszik. Kivéve a koffeint.",type:"CLASSIC",color:"#adf18c",art:["python","water","coffee"],help:"Húzással vagy a nyilakkal irányítsd a kígyót. Minden adatfalat (a CSV is!) ehető. A kávébomba 7 másodperc után eltűnik, de addig végzetes. A fal és a saját tested is."},
{id:"breaker",name:"Parquet Breaker",file:"breakout.exe",desc:"Verd szét a legacy réteget. Multiball, boss, káosz.",type:"ARCADE",color:"#73b8ff",art:["excel","orb","parquet"],help:"Húzd az ütőt jobbra-balra. Érintéssel vagy Space-szel indítsd a labdát. Törd le az összes blokkot; gyűjtsd a zöld powerupokat, kerüld a kávésakat."},
{id:"corp",name:"Laci's Corporate Simulator",file:"workday.py",desc:"Éld túl a munkanapot. A meeting lehetett volna e-mail.",type:"STRATEGY",color:"#f6c96f",art:["avatar","report","coffee"],help:"Minden döntés időbe kerül. Tartsd fenn a hidratációt és a fókuszt, csökkentsd a backlogot, kezeld az eseményeket, és érd el a nap végét."}
];
const itemDefs={
water:["VÍZ","#55e9ed","💧"],bottle:["KULACS","#66e8de","H₂O"],python:["PYTHON","#adeb81","PY"],parquet:["PARQUET","#6df1ab","PQ"],report:["RIPORT","#72d8ff","▥"],arrow:["PYARROW","#a0b9ff","⇧"],csv:["CSV","#ff8395","CSV"],excel:["EXCEL","#ffae7b","XLS"],coffee:["KÁVÉ","#ff6789","☕"],null:["NULL","#ff8395","∅"],bug:["BUG","#ff8395","✳"],corrupt:["HIBÁS RIPORT","#ff8395","ERR"],check:["OK","#adf18c","✓"],boss:["BOSS","#ffcb78","!"],orb:["ORB","#55e9ed","●"],avatar:["LACI","#55e9ed","L"],tile:["2048","#c7a2ff","2K"],shield:["PAJZS","#83d7ff","⬡"],multi:["MULTI","#aef28c","×3"],laser:["LÉZER","#c7a2ff","↟"],burst:["BURST","#ffcf70","✦"],wide:["WIDE","#72e9bc","↔"],life:["ÉLET","#72e9bc","+"],slow:["LASSÍT","#72d8ff","≈"],shrink:["SZŰKÍT","#ff8296","↔"]
};
const css=`
#arcade{margin-top:20px;padding:17px;background:linear-gradient(145deg,#162938,#101726);--arc:#55e9ed}
#arcade .arc-top{display:flex;align-items:center;gap:12px;margin:13px 0}
#arcade h2{font-size:29px;line-height:1.08;letter-spacing:-.045em;margin:0 0 4px}
#arcade .arc-sub{font-size:12px;color:#9bb2c3;margin:0;line-height:1.45}
.arc-avatar{width:52px;height:52px;border-radius:15px;border:1px solid #53e5ec55;background:#102333;flex:none;display:block}
.arc-carousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;gap:10px;padding:3px 1px 9px;overscroll-behavior-inline:contain}
.arc-carousel::-webkit-scrollbar{display:none}
.arc-carousel::after{content:"";flex:0 0 max(0px,calc(100% - min(86%,340px) - 10px));pointer-events:none}
.arc-bug-icon{font-size:clamp(17px,5vw,27px);line-height:1.1;display:block;margin-bottom:6px}
.arc-bug-cell{display:grid;place-content:center;justify-items:center;box-shadow:inset 0 0 18px #050c1533;transition:background .12s,border-color .12s}
.arc-card{position:relative;flex:0 0 min(86%,340px);scroll-snap-align:start;border:1px solid color-mix(in srgb,var(--a),#172937 70%);border-radius:16px;overflow:hidden;background:#09141f}
.arc-art{display:block;width:100%;height:auto;aspect-ratio:2.2;opacity:.95}
.arc-cardbody{padding:12px 14px 14px}
.arc-type{font:10px var(--mono);color:var(--a);letter-spacing:.12em}
.arc-card h3{font-size:21px;letter-spacing:-.04em;margin:5px 0}
.arc-card p{font-size:12px;color:#a9bdcc;min-height:34px;line-height:1.45;margin:4px 0 10px}
.arc-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
.arc-btn{border:1px solid #385467;border-radius:9px;background:#132735;color:#e4f2fc;font:700 12px var(--mono);padding:10px 13px;min-height:42px;cursor:pointer;touch-action:manipulation}
.arc-btn:hover{border-color:var(--a,#55e9ed)}
.arc-btn.primary{background:var(--a,#55e9ed);border-color:transparent;color:#09151c}
.arc-btn:disabled{opacity:.4;cursor:default}
.arc-record{color:#a4bbc8;font:10px var(--mono);line-height:1.4}
.arc-record b{color:#eaf9ff;display:block;font-size:18px}
.arc-dots{display:flex;gap:5px;justify-content:center;align-items:center;flex:1}
.arc-dot{width:8px;height:8px;border:0;padding:0;border-radius:50%;background:#405667}
.arc-dot.on{background:#55e9ed;box-shadow:0 0 9px #55e9ed}
.arc-nav{display:flex;align-items:center;gap:10px;margin-top:3px}
.arc-nav .arc-btn{padding:6px 13px;min-height:34px}
.arc-trophy{font:10px var(--mono);color:#ffcf78;margin:9px 0 2px}
.arc-modal{position:fixed;inset:0;z-index:1000;background:#03090ff2;overflow:auto;overscroll-behavior:contain;display:flex;justify-content:center;align-items:flex-start;padding:12px max(8px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom));color:#edf6fa}
.arc-modal[hidden]{display:none}
.arc-dialog{width:min(100%,570px);border:1px solid #2e495d;border-radius:19px;background:linear-gradient(155deg,#152633,#09131d);padding:13px;box-shadow:0 20px 80px #0009;position:relative}
.arc-dialog h2{font-size:24px;letter-spacing:-.045em;margin:4px 0}
.arc-header{display:flex;gap:10px;align-items:center;justify-content:space-between}
.arc-hud{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0}
.arc-hud>div{border:1px solid #294052;background:#0a1723;border-radius:9px;padding:7px 9px;min-width:0;overflow:hidden}
.arc-hud small{font:9px var(--mono);color:#9cb3c2;display:block;white-space:nowrap}
.arc-hud b{font:800 19px var(--mono);color:var(--a);display:block;overflow:hidden;text-overflow:ellipsis}
.arc-gamehelp{font-size:12px;line-height:1.5;color:#a8bdcc;margin:6px 0 9px}
.arc-stage{position:relative;border:1px solid #304958;border-radius:13px;overflow:hidden;background:#07121d;min-height:120px}
.arc-canvas{width:100%;max-height:54vh;max-height:54dvh;object-fit:contain;display:block;touch-action:none;user-select:none}
.arc-canvas[hidden],.arc-dom[hidden]{display:none}
.arc-dom{padding:10px}
.arc-message{min-height:23px;margin:8px 0;color:var(--a);font:11px/1.4 var(--mono);overflow-wrap:anywhere}
.arc-controls{display:flex;gap:7px;justify-content:center;margin:8px 0}
.arc-controls button{flex:1;max-width:110px;min-height:44px;font-size:18px;touch-action:none}
.arc-controls[hidden]{display:none}
.arc-gamebuttons{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.arc-gamebuttons .arc-btn{flex:1;white-space:nowrap}
.arc-legend{display:flex;gap:5px;flex-wrap:wrap;font:10px var(--mono);margin:6px 0}
.arc-legend span{border:1px solid #354c59;border-radius:6px;padding:4px 6px;white-space:nowrap}
.arc-legend .good{color:#b1f29a;border-color:#477e59}.arc-legend .bad{color:#ff8c9c;border-color:#7c414b}
.arc-cover{position:absolute;inset:0;background:#08131ee8;z-index:2;display:grid;place-items:center;text-align:center;padding:15px;backdrop-filter:blur(3px)}
.arc-cover[hidden]{display:none}
.arc-cover h3{font-size:26px;letter-spacing:-.04em;margin:5px 0 8px;color:var(--a)}
.arc-cover p{color:#bacdd8;font-size:12px;line-height:1.5;margin:8px 0 15px}
.arc-unlock{position:fixed;z-index:1010;bottom:22px;left:50%;transform:translateX(-50%);width:min(92%,420px);padding:15px;color:#fff;border:1px solid #ffcf78;background:linear-gradient(130deg,#302646,#392813);border-radius:14px;box-shadow:0 0 42px #ffc85a55;text-align:center}
.arc-unlock[hidden]{display:none}.arc-unlock b{display:block;font:800 18px var(--mono);color:#ffcf78;letter-spacing:.06em}
.arc-unlock p{font-size:12px;margin:6px 0 10px}
.arc-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));width:100%;max-width:100%;aspect-ratio:1/1;gap:6px;touch-action:none;user-select:none;overflow:hidden;overflow-anchor:none}
.arc-cell{box-sizing:border-box;width:100%;height:100%;min-width:0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:9px;border:1px solid #39516a;background:#132333;color:#f0f9ff;font:800 clamp(14px,5.5vw,28px)/1.1 var(--mono);padding:2px;overflow:hidden;white-space:nowrap;touch-action:none;appearance:none}
.arc-cell .arc-value{max-width:100%;overflow:hidden;text-overflow:ellipsis}
.arc-cell[data-value="0"]{background:#0c1b27;border-color:#263d4e}
.arc-cell[data-value="0"] .arc-value{color:#3b586b;font-size:15px}
.arc-cell.arc-source{opacity:.55;outline:2px solid #c7a2ff;outline-offset:-3px}
.arc-cell.arc-target{outline:2px solid #b1f6c0;outline-offset:-3px}
.arc-cell.arc-invalid{outline:2px solid #ff8795;outline-offset:-3px}
.arc-cell.arc-pop .arc-value{animation:arc-merge-pop .24s ease-out}
@keyframes arc-merge-pop{0%{transform:scale(.70)}65%{transform:scale(1.12)}100%{transform:scale(1)}}
.arc-drag-ghost{position:fixed;z-index:1100;pointer-events:none;transform:translate(-50%,-50%);width:62px;height:62px;border-radius:11px;border:2px solid #c7a2ff;background:#263a55;display:grid;place-items:center;color:#f4edff;box-shadow:0 8px 30px #000a;font:800 25px var(--mono)}
.arc-drag-ghost[hidden]{display:none}
.arc-feed{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}
.arc-feed button{min-width:0;display:flex;align-items:center;justify-content:center;gap:7px;min-height:52px;touch-action:none}
.arc-feed button b{font:800 20px var(--mono)}
.arc-feed button span{font:10px var(--mono);color:#b2c5d5;text-align:left}
.arc-feed button[aria-pressed="true"]{outline:2px solid #d8b4ff;outline-offset:-2px}
.arc-feedhint{font-size:11px;color:#a6b9c7;min-height:32px;line-height:1.4;margin:7px 0 0}
.arc-modal[data-game="merge"] .arc-dom{touch-action:pan-y}
.arc-cell small{font:9px/1.2 var(--mono);opacity:.85;max-width:100%;overflow:hidden;text-overflow:ellipsis}.arc-cell.hit{outline:2px dashed #7af1b2;outline-offset:-3px}
.arc-modal[data-game="merge"]{overflow-anchor:none}
.arc-modal[data-game="merge"] .arc-dialog{overflow-anchor:none;min-width:0}
.arc-modal[data-game="merge"] .arc-message{height:36px;min-height:36px;max-height:36px;overflow:hidden}
.arc-modal[data-game="merge"] .arc-mergebar{flex-wrap:nowrap;min-height:42px}
.arc-modal[data-game="merge"] .arc-joker{min-height:66px}
.arc-modal[data-game="merge"] .arc-joker button{min-width:85px;flex-shrink:0}
.arc-modal[data-game="merge"] .arc-stage{overflow-anchor:none}
.arc-modal[data-game="merge"] .arc-hud b{white-space:nowrap}
.arc-mergebar{display:flex;gap:6px;margin:9px 0;align-items:center;flex-wrap:wrap}
.arc-mergebar .arc-btn{flex:1}
.arc-joker{display:flex;gap:8px;align-items:center;padding:8px;border:1px dashed #5d8860;border-radius:10px;color:#b9d6bf;font-size:12px}
.arc-joker button{background:#1a493d;color:#c8ffcf;border-color:#68b792;touch-action:none}
.arc-corphead{display:flex;gap:12px;align-items:center;margin-bottom:11px}
.arc-corphead .arc-avatar{width:68px;height:68px}
.arc-resources{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.arc-resource{border:1px solid #2a4357;border-radius:8px;padding:8px;background:#102130}
.arc-resource small{display:flex;justify-content:space-between;color:#c6d9e5;font:10px var(--mono)}
.arc-track{height:7px;background:#263b48;border-radius:5px;margin-top:7px;overflow:hidden}
.arc-track i{display:block;height:100%;border-radius:5px;transition:width .2s}
.arc-event{margin:11px 0;padding:12px;background:#182939;border:1px solid #385268;border-radius:10px}
.arc-event small{color:#ffc078;font:10px var(--mono)}
.arc-event h3{font-size:17px;margin:7px 0 3px}
.arc-event p{font-size:12px;line-height:1.5;color:#bacdd9;margin:4px 0}
.arc-decisions{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.arc-decisions button{text-align:left;min-height:55px;font-size:11px;white-space:normal}
.arc-decisions button small{display:block;font:10px/1.3 var(--mono);font-weight:400;margin-top:4px;color:#9fbece}
@media(max-width:380px){.arc-dialog{padding:8px}.arc-hud b{font-size:16px}.arc-cell small{font-size:7px}.arc-gamebuttons .arc-btn{padding:8px 5px;font-size:11px}}
@media(prefers-reduced-motion:reduce){.arc-track i{transition:none}}
`;
const avatarSVG=`<svg class="arc-avatar" viewBox="0 0 80 80" aria-label="Stilizált Laci-avatar" role="img" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="arcavbg" x2="1" y2="1"><stop stop-color="#1b4258"/><stop offset="1" stop-color="#12202f"/></linearGradient></defs><rect width="80" height="80" rx="14" fill="url(#arcavbg)"/><path d="M7 80Q9 57 30 54H50Q71 57 74 80" fill="#333f4e" stroke="#6a8699" stroke-width="1.5"/><path d="M22 55L40 76 57 55 51 50H29Z" fill="#222d3c"/><path d="M32 48L31 60 40 65 48 60 48 48" fill="#dca984"/><path d="M20 22Q18 51 38 56Q58 54 60 29L54 17 27 15Z" fill="#edbd97"/><path d="M19 32Q10 20 21 12Q16 4 29 8Q33-1 42 7Q53 0 58 11Q70 10 65 21L60 31 55 22 48 18 40 22 32 15 25 24 23 34Z" fill="#5e4235" stroke="#a77857" stroke-width="2" stroke-linejoin="round"/><path d="M22 30L37 31 38 41 25 40ZM43 31L58 30 55 40 43 41Z" fill="#a5d9dd33" stroke="#1b222c" stroke-width="2.6"/><path d="M38 34H43" stroke="#1b222c" stroke-width="2"/><path d="M39 36L36 44 41 45M34 48Q41 51 47 47" fill="none" stroke="#995f51" stroke-width="1.6" stroke-linecap="round"/><circle cx="31" cy="35" r="1.8" fill="#34424b"/><circle cx="49" cy="35" r="1.8" fill="#34424b"/><path d="M32 59L38 73 45 59" fill="none" stroke="#d5a754" stroke-width="2.4"/><circle cx="39" cy="73" r="5" fill="#59d9cf" stroke="#cfb264" stroke-width="1.5"/></svg>`;
function rr(c,x,y,w,h,r=8){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function rect(c,x,y,w,h,fill,stroke,r=8){rr(c,x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function txt(c,s,x,y,size=12,color="#e9f7ff",align="center",weight=700){c.fillStyle=color;c.font=weight+" "+size+"px ui-monospace,monospace";c.textAlign=align;c.textBaseline="middle";c.fillText(s,x,y)}
function backdrop(c,color,w=W,h=H,t=0){const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"#0d2433");g.addColorStop(.5,"#08131f");g.addColorStop(1,"#111b2a");c.fillStyle=g;c.fillRect(0,0,w,h);c.strokeStyle="#395b7028";c.lineWidth=1;for(let x=0;x<w;x+=26){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}for(let y=(t*12)%26;y<h;y+=26){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}for(let i=0;i<28;i++){c.fillStyle=color+"38";c.fillRect((i*137.9)%w,(i*79.4+t*6)%h,1.5,1.5)}}
function avatar(c,x,y,size=50){c.save();c.translate(x-size/2,y-size/2);c.scale(size/80,size/80);rect(c,1,1,78,78,"#153448","#4b7084",14);c.fillStyle="#34404d";c.beginPath();c.moveTo(7,80);c.quadraticCurveTo(8,58,30,54);c.lineTo(50,54);c.quadraticCurveTo(72,58,74,80);c.fill();rect(c,33,46,15,16,"#dca984",null,4);c.fillStyle="#edbd97";c.beginPath();c.ellipse(40,33,20,24,0,0,Math.PI*2);c.fill();c.fillStyle="#594237";for(const [px,py,r] of [[21,18,10],[27,10,10],[39,9,11],[50,11,10],[60,18,9],[18,24,6]]){c.beginPath();c.arc(px,py,r,0,Math.PI*2);c.fill()}c.strokeStyle="#19232c";c.lineWidth=2.6;rr(c,22,29,16,11,3);c.stroke();rr(c,43,29,16,11,3);c.stroke();c.beginPath();c.moveTo(38,34);c.lineTo(43,34);c.stroke();c.fillStyle="#34424b";for(const px of [31,50]){c.beginPath();c.arc(px,34,1.7,0,Math.PI*2);c.fill()}c.strokeStyle="#a26854";c.lineWidth=1.6;c.beginPath();c.moveTo(34,48);c.quadraticCurveTo(41,52,47,47);c.stroke();c.strokeStyle="#d7ac63";c.beginPath();c.moveTo(31,59);c.lineTo(40,74);c.lineTo(48,59);c.stroke();c.fillStyle="#57dcd1";c.beginPath();c.arc(40,73,5,0,Math.PI*2);c.fill();c.restore()}
function icon(c,key,x,y,size=36,sign=0,label=true){const d=itemDefs[key]||itemDefs.report, col=sign<0?"#ff8197":sign>0?"#83f1ad":d[1];c.save();c.translate(x,y);c.shadowColor=col+"99";c.shadowBlur=10;rect(c,-size/2,-size/2,size,size,"#122839",col,Math.max(5,size*.2));c.shadowBlur=0;if(key==="avatar"){avatar(c,0,0,size-4)}else if(key==="water"||key==="orb"){c.fillStyle="#55e9ed";c.beginPath();if(key==="water"){c.moveTo(0,-size*.31);c.bezierCurveTo(-size*.38,size*.08,-size*.28,size*.29,0,size*.29);c.bezierCurveTo(size*.28,size*.29,size*.38,size*.08,0,-size*.31)}else c.arc(0,0,size*.25,0,Math.PI*2);c.fill()}else if(key==="python"){rect(c,-size*.29,-size*.27,size*.43,size*.31,"#57a9e4",null,4);rect(c,-size*.14,-size*.02,size*.43,size*.31,"#f3d06b",null,4);c.fillStyle="#132a3d";c.fillRect(-size*.18,-size*.19,3,3);c.fillRect(size*.13,size*.14,3,3)}else if(key==="coffee"){rect(c,-size*.27,-size*.15,size*.43,size*.36,"#b47757","#ffc0a6",4);c.strokeStyle="#ffc0a6";c.lineWidth=2;c.beginPath();c.arc(size*.17,-size*.02,size*.14,-1.5,1.5);c.stroke();c.strokeStyle="#ffb39b";c.beginPath();c.moveTo(-size*.13,-size*.22);c.lineTo(-size*.1,-size*.34);c.moveTo(size*.02,-size*.22);c.lineTo(size*.05,-size*.34);c.stroke()}else if(key==="parquet"||key==="report"){for(let i=0;i<3;i++)rect(c,-size*.29+i*size*.205,-size*.23+(key==="report"?i*size*.08:0),size*.13,size*.46-(key==="report"?i*size*.08:0),d[1],null,2)}else if(key==="bottle"){rect(c,-size*.13,-size*.33,size*.26,size*.13,"#95afbf",null,2);rect(c,-size*.22,-size*.22,size*.44,size*.53,"#276876","#6edce7",5);rect(c,-size*.15,size*.02,size*.30,size*.22,"#55e9ed",null,3)}else if(key==="bug"){c.strokeStyle=d[1];c.lineWidth=2;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-size*.13,i*size*.13);c.lineTo(-size*.31,i*size*.19);c.moveTo(size*.13,i*size*.13);c.lineTo(size*.31,i*size*.19);c.stroke()}c.fillStyle=d[1];c.beginPath();c.ellipse(0,0,size*.17,size*.27,0,0,Math.PI*2);c.fill()}else{txt(c,d[2],0,0,Math.max(10,size*.31),d[1])}if(sign){rect(c,size*.28,-size*.62,size*.36,size*.36,sign>0?"#216746":"#803340",col,4);txt(c,sign>0?"+":"−",size*.46,-size*.44,size*.28,"#fff")}if(label)txt(c,d[0],0,size*.67,Math.max(8,size*.23),col);c.restore()}
const registry={},recordKey="hydro-laci-arcade-v2";
let saved={best:{},plays:{},awards:{}},sound=true;
try{const x=JSON.parse(localStorage.getItem(recordKey));if(x&&x.best&&x.plays&&x.awards)saved=x;if(typeof x?.sound==="boolean")sound=x.sound}catch{}
function persist(){try{localStorage.setItem(recordKey,JSON.stringify({...saved,sound}))}catch{}}
let frame=0,last=0,g=null,def=null,score=0,stage="–",state="closed",earned=false,prevFocus=null,ac=null,awardTimer=0,modal=null,cv=null,ctx=null,dom=null,cover=null;
function sfx(kind="good"){if(!sound||!ac||ac.state!=="running")return;try{const o=ac.createOscillator(),v=ac.createGain();o.type=kind==="bad"?"triangle":"sine";o.frequency.setValueAtTime(kind==="bad"?145:kind==="win"?740:480,ac.currentTime);o.frequency.exponentialRampToValueAtTime(kind==="bad"?75:kind==="win"?1100:790,ac.currentTime+.12);v.gain.setValueAtTime(.035,ac.currentTime);v.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.15);o.connect(v);v.connect(ac.destination);o.start();o.stop(ac.currentTime+.16)}catch{}}
function unlockSound(){if(!sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(C){ac=ac||new C();if(ac.state==="suspended")ac.resume().catch(()=>{})}}catch{}}
function refreshRecords(){for(const d of defs){const el=$("arc-best-"+d.id);if(el)el.textContent=(saved.best[d.id]||0).toLocaleString("hu-HU")}const el=$("arc-trophy");if(el)el.textContent="LÁSZLÓ PROTOKOLL  "+Object.keys(saved.awards).length+" / 7  ·  rekordok helyben mentve"}
function award(){if(earned)return;earned=true;saved.awards[def.id]=true;persist();refreshRecords();const box=$("arc-unlock");box.hidden=false;$("arc-unlocktext").textContent=def.name+" · 1000 pont · László hitelesítve! A hangot csak kérésre játsszuk le.";clearTimeout(awardTimer);awardTimer=setTimeout(()=>box.hidden=true,8500)}
function add(n){score=Math.max(0,Math.floor(score+n));if(score>(saved.best[def.id]||0)){saved.best[def.id]=score;persist();refreshRecords()}$("arc-score").textContent=score.toLocaleString("hu-HU");$("arc-hs").textContent=(saved.best[def.id]||0).toLocaleString("hu-HU");if(score>=1000)award();sfx(n<0?"bad":"good")}
function setStage(x){if(String(x)!==stage){stage=String(x);$("arc-level").textContent=stage}}
function note(s,bad=false){$("arc-message").textContent=s;$("arc-message").style.color=bad?"#ff8c9c":def.color}
function showCover(title,body,button){cover.hidden=false;$("arc-cover-title").textContent=title;$("arc-cover-body").textContent=body;$("arc-cover-btn").textContent=button}
function finish(msg,win=false){if(state!=="running")return;state="done";cancelAnimationFrame(frame);g?.onPause?.();$("arc-pause").disabled=true;showCover(win?"MISSION COMPLETE":"PROCESS EXITED",msg+" · "+score+" pont","ÚJ JÁTÉK");note(msg,!win);sfx(win?"win":"bad")}
const api={W,H,clamp,rand,pick,rect,rr,txt,backdrop,icon,avatar,avatarSVG,items:itemDefs,add,note,setStage,finish,sfx,state:()=>state,score:()=>score,dom:()=>dom,canvas:()=>cv};
function loop(ts){if(state!=="running")return;const dt=last?Math.min(.04,(ts-last)/1000):0;last=ts;try{g?.update?.(dt);if(!cv.hidden)g?.draw?.(ctx)}catch(e){console.error(e);finish("Runtime hiba – próbáld újra.");return}if(state==="running")frame=requestAnimationFrame(loop)}
function prepare(){cancelAnimationFrame(frame);g?.dispose?.();g=null;dom.replaceChildren();score=0;stage="–";earned=!!saved.awards[def.id];$("arc-score").textContent="0";$("arc-level").textContent="–";$("arc-hs").textContent=(saved.best[def.id]||0).toLocaleString("hu-HU");$("arc-pause").disabled=true;const isDom=["merge","corp","bug"].includes(def.id);cv.hidden=isDom;dom.hidden=!isDom;$("arc-controls").hidden=["bug","corp","merge"].includes(def.id);$("arc-up").hidden=["catch","breaker","runner"].includes(def.id);$("arc-down").hidden=["catch","breaker","runner"].includes(def.id);$("arc-go").hidden=!["runner","breaker"].includes(def.id);if(def.id==="runner"){$("arc-left").hidden=true;$("arc-right").hidden=true;$("arc-go").textContent="UGRÁS ↑"}else{$("arc-left").hidden=false;$("arc-right").hidden=false;$("arc-go").textContent="INDÍT ▶"}g=registry[def.id](api);g.init?.();if(!cv.hidden)g.draw?.(ctx)}
function start(){unlockSound();if(state==="paused"){state="running";cover.hidden=true;$("arc-pause").textContent="SZÜNET";g?.onResume?.();last=0;frame=requestAnimationFrame(loop);return}state="ready";prepare();state="running";cover.hidden=true;$("arc-pause").disabled=false;$("arc-pause").textContent="SZÜNET";saved.plays[def.id]=(saved.plays[def.id]||0)+1;persist();g?.start?.();last=0;frame=requestAnimationFrame(loop)}
function pause(){if(state!=="running")return;state="paused";cancelAnimationFrame(frame);g?.onPause?.();$("arc-pause").textContent="FOLYTAT";showCover("PAUSED","A pipeline vár. Egy korty víz most jól jönne.","FOLYTATÁS")}
function open(id){def=defs.find(d=>d.id===id);if(!def||!registry[id])return;prevFocus=document.activeElement;modal.dataset.game=id;modal.hidden=false;document.body.style.overflow="hidden";modal.scrollTop=0;modal.style.setProperty("--a",def.color);$("arc-title").textContent=def.name;$("arc-file").textContent=def.file+" / "+def.type;$("arc-help").textContent=def.help;const legends={catch:[["good","+ Víz · Python · PQ · riport"],["bad","− CSV · Excel · hibás riport"],["bad","! Kávé = GAME OVER"]],runner:[["good","+ Víz · PQ pajzs · Python boost"],["bad","− CSV · Excel · NULL · kávé"]],snake:[["good","+ Víz · Python · CSV · PQ · riport"],["bad","! Kávébomba · 7 mp"]],bug:[["bad","ÜSD: hibák · kávé · CSV"],["good","HAGYD: Python · víz · PQ"]],breaker:[["good","+ MULTI · PAJZS · LÉZER · WIDE"],["bad","− KÁVÉ · SZŰKÍT"]],merge:[["good","4 + 4 → 8 a célmezőn"],["good","XLSX + bármely szám"]]};$("arc-legend").innerHTML=(legends[id]||[]).map(([c,t])=>`<span class="${c}">${t}</span>`).join("");state="ready";prepare();note(">>> "+def.file+" // indításra vár");showCover("READY?",def.help,"JÁTÉK INDÍTÁSA");$("arc-close").focus()}
function close(){if(state==="closed")return;cancelAnimationFrame(frame);g?.dispose?.();g=null;state="closed";if($("arc-unlock"))$("arc-unlock").hidden=true;modal.hidden=true;delete modal.dataset.game;document.body.style.overflow="";prevFocus?.focus?.();refreshRecords()}
function input(k,v){if(state==="running")g?.input?.(k,v)}
function mount(){if(!Object.keys(registry).length||$("arcade"))return;const style=document.createElement("style");style.textContent=css;document.head.append(style);const section=document.createElement("section");section.id="arcade";section.className="panel";section.innerHTML=`<div class="panelhead"><span>05 / ARCADE MODE</span><span class="tag">7 MODUL</span></div><div class="arc-top">${avatarSVG}<div><h2>Waiting room<span style="color:#55e9ed">.</span></h2><p class="arc-sub">Amíg lefut a lekérdezés… Laci, ne csak a progress bart nézd.</p></div></div><div class="arc-carousel" id="arc-carousel">${defs.map((d,i)=>`<article class="arc-card" style="--a:${d.color}"><canvas class="arc-art" id="arc-art-${d.id}" width="340" height="155" aria-hidden="true"></canvas><div class="arc-cardbody"><span class="arc-type">0${i+1} / ${d.type} · ${d.file}</span><h3>${d.name}</h3><p>${d.desc}</p><div class="arc-row"><span class="arc-record">REKORD<b id="arc-best-${d.id}">0</b></span><button class="arc-btn primary" data-arc-open="${d.id}">▶ JÁTÉK</button></div></div></article>`).join("")}</div><div class="arc-nav"><button class="arc-btn" id="arc-prev" aria-label="Előző játék">‹</button><div class="arc-dots">${defs.map((d,i)=>`<button class="arc-dot${!i?" on":""}" data-arc-dot="${i}" aria-label="${d.name}"></button>`).join("")}</div><button class="arc-btn" id="arc-next" aria-label="Következő játék">›</button></div><p class="arc-trophy" id="arc-trophy"></p>`;
document.querySelector(".footnote").before(section);
modal=document.createElement("div");modal.id="arc-modal";modal.className="arc-modal";modal.hidden=true;modal.innerHTML=`<section class="arc-dialog" role="dialog" aria-modal="true" aria-labelledby="arc-title"><div class="arc-header"><div><span class="arc-type" id="arc-file" style="color:var(--a)"></span><h2 id="arc-title"></h2></div><button class="arc-btn" id="arc-close" aria-label="Vissza a játékválasztóhoz">✕</button></div><div class="arc-hud"><div><small>PONT</small><b id="arc-score">0</b></div><div><small>REKORD</small><b id="arc-hs">0</b></div><div><small>ÁLLAPOT</small><b id="arc-level">–</b></div></div><div id="arc-legend" class="arc-legend"></div><p class="arc-gamehelp" id="arc-help"></p><div class="arc-stage"><canvas class="arc-canvas" id="arc-canvas" width="780" height="900" aria-label="Játéktér"></canvas><div class="arc-dom" id="arc-dom"></div><div class="arc-cover" id="arc-cover"><div><div class="arc-type">HYDRO.RUNTIME / ARCADE</div><h3 id="arc-cover-title"></h3><p id="arc-cover-body"></p><button class="arc-btn primary" id="arc-cover-btn"></button></div></div></div><div class="arc-controls" id="arc-controls"><button class="arc-btn" id="arc-left" data-key="left" aria-label="Balra">←</button><button class="arc-btn" id="arc-up" data-key="up" aria-label="Fel">↑</button><button class="arc-btn" id="arc-down" data-key="down" aria-label="Le">↓</button><button class="arc-btn" id="arc-right" data-key="right" aria-label="Jobbra">→</button><button class="arc-btn" id="arc-go" data-key="action" aria-label="Ugrás vagy indítás">▶</button></div><p class="arc-message" id="arc-message"></p><div class="arc-gamebuttons"><button class="arc-btn" id="arc-pause">SZÜNET</button><button class="arc-btn" id="arc-restart">ÚJRÁZÁS</button><button class="arc-btn" id="arc-sound"></button></div></section>`;
document.body.append(modal);const un=document.createElement("div");un.className="arc-unlock";un.id="arc-unlock";un.hidden=true;un.innerHTML=`<b>LEGENDARY RUNTIME</b><p id="arc-unlocktext"></p><div class="arc-row"><button class="arc-btn primary" id="arc-awardplay">♪ LÁSZLÓ-PROTOKOLL</button><button class="arc-btn" id="arc-awardclose">OK</button></div>`;document.body.append(un);
cv=$("arc-canvas");ctx=cv.getContext("2d");ctx.scale(2,2);dom=$("arc-dom");cover=$("arc-cover");const car=$("arc-carousel"),cards=[...car.children];let active=0;
function select(i){active=clamp(i,0,cards.length-1);car.scrollTo({left:cards[active].offsetLeft-cards[0].offsetLeft,behavior:"smooth"});dots()}
function dots(){section.querySelectorAll(".arc-dot").forEach((e,i)=>e.classList.toggle("on",i===active))}
section.querySelectorAll("[data-arc-open]").forEach(b=>b.onclick=()=>open(b.dataset.arcOpen));section.querySelectorAll("[data-arc-dot]").forEach(b=>b.onclick=()=>select(+b.dataset.arcDot));$("arc-prev").onclick=()=>select(active-1);$("arc-next").onclick=()=>select(active+1);car.addEventListener("scroll",()=>{let i=0,best=Infinity;cards.forEach((c,j)=>{const d=Math.abs(c.offsetLeft-cards[0].offsetLeft-car.scrollLeft);if(d<best){best=d;i=j}});active=i;dots()},{passive:true});
for(const d of defs){const c=$("arc-art-"+d.id).getContext("2d");backdrop(c,d.color,340,155);c.strokeStyle=d.color+"55";c.beginPath();c.arc(170,78,63,0,Math.PI*2);c.stroke();c.beginPath();c.arc(170,78,52,0,Math.PI*2);c.stroke();d.art.forEach((k,i)=>{icon(c,k,65+i*105,i===1?64:86,i===1?58:45,0,false);txt(c,itemDefs[k][0],65+i*105,i===1?103:120,10,itemDefs[k][1])});txt(c,"// "+d.file,12,13,10,d.color,"left")}
$("arc-close").onclick=close;$("arc-cover-btn").onclick=start;$("arc-restart").onclick=()=>{state="ready";start()};$("arc-pause").onclick=()=>state==="paused"?start():pause();function soundLabel(){$("arc-sound").textContent=sound?"HANG: BE":"HANG: KI"}soundLabel();$("arc-sound").onclick=()=>{sound=!sound;if(sound)unlockSound();else $("themeAudio")?.pause();persist();soundLabel()};$("arc-awardclose").onclick=()=>un.hidden=true;$("arc-awardplay").onclick=()=>{const a=$("themeAudio");if(a){a.currentTime=0;a.play().catch(()=>{})}un.hidden=true};
let pid=null;function point(e,phase){const r=cv.getBoundingClientRect(),scale=Math.min(r.width/W,r.height/H);input("pointer",{x:clamp((e.clientX-r.left-(r.width-W*scale)/2)/scale,0,W),y:clamp((e.clientY-r.top-(r.height-H*scale)/2)/scale,0,H),phase})}cv.addEventListener("pointerdown",e=>{if(state!=="running")return;e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch{}point(e,"down")});cv.addEventListener("pointermove",e=>{if(e.pointerId===pid)point(e,"move")});for(const event of ["pointerup","pointercancel"])cv.addEventListener(event,e=>{if(e.pointerId===pid){point(e,event==="pointerup"?"up":"cancel");pid=null}});
const map={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"," ":"action",w:"up",a:"left",s:"down",d:"right"};document.addEventListener("keydown",e=>{if(state==="closed")return;if(e.key==="Escape"){e.preventDefault();close();return}if(e.key==="Tab"){const elems=[...modal.querySelectorAll("button:not([disabled])")].filter(b=>b.getClientRects().length);if(elems.length){const i=elems.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();elems.at(-1).focus()}else if(!e.shiftKey&&i===elems.length-1){e.preventDefault();elems[0].focus()}}return}if(e.key===" "&&document.activeElement?.tagName==="BUTTON"&&!(state==="running"&&["runner","breaker"].includes(def?.id)))return;const k=map[e.key];if(k){if(state!=="running")return;e.preventDefault();if(!e.repeat)input(k,true)}});document.addEventListener("keyup",e=>{if(map[e.key]&&state!=="closed")input(map[e.key],false)});
modal.querySelectorAll("[data-key]").forEach(b=>{const k=b.dataset.key;b.addEventListener("pointerdown",e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch{}input(k,true)});for(const ev of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(ev,()=>input(k,false));b.addEventListener("click",e=>{if(e.detail===0){input(k,true);input(k,false)}})});
document.addEventListener("visibilitychange",()=>{if(document.hidden)pause()});window.addEventListener("blur",pause);refreshRecords()}
window.HydroArcade={register:(id,f)=>{registry[id]=f},mount,defs,api};
})();
