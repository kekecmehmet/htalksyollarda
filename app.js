'use strict';
const $ = s => document.querySelector(s);
const ns = 'http://www.w3.org/2000/svg';
let cities=[], visits=[], onlyVisited=true, expanded=false, query='';
const normalize=s=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
const safeVideo = value => {try {const u=new URL(value);return u.protocol==='https:' && ['youtube.com','www.youtube.com','youtu.be','m.youtube.com'].includes(u.hostname) ? u.href : null;}catch{return null;}};
const records=()=>visits;
const record=c=>records().find(v=>v.plate===c.plate);
const matches=c=>!query||normalize(c.name).includes(normalize(query))||c.plate.includes(query);
function node(tag,attrs={}){const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
function showCity(c){
 const v=record(c);
 if(v&&safeVideo(v.videoUrl)){window.open(safeVideo(v.videoUrl),'_blank','noopener,noreferrer');return;}
 $('#dialog-plate').textContent=c.plate;$('#dialog-name').textContent=c.name;$('#city-dialog').showModal();
}
function tooltip(c,event){const v=record(c),tip=$('#tooltip');tip.replaceChildren();const title=document.createElement('strong');title.textContent=`${c.plate} · ${c.name}`;tip.append(title,document.createTextNode(v?`${v.team} · Yayını izle ↗`:'Henüz ziyaret videosu eklenmedi'));tip.hidden=false;const rect=event.currentTarget.getBoundingClientRect();const x=event.clientX||rect.x+rect.width/2,y=event.clientY||rect.y;tip.style.left=`${Math.max(8,Math.min(x+14,innerWidth-tip.offsetWidth-12))}px`;tip.style.top=`${Math.max(8,Math.min(y+18,innerHeight-tip.offsetHeight-12))}px`;}
function render(){
 const svg=$('#map svg');svg.querySelector('defs')?.remove();const defs=node('defs');svg.prepend(defs);
 cities.forEach(c=>{
  const v=record(c);
  c.groups.forEach((g,i)=>{
   g.classList.toggle('dim',!matches(c));g.classList.toggle('match',!!query&&matches(c));
   g.setAttribute('aria-label',`${c.name}, ${v?v.team+', yayını izle':'ziyaret videosu eklenmedi'}`);
   g.querySelectorAll('path').forEach(p=>p.style.removeProperty('fill'));
   if(v?.logo){const b=g.getBBox(),id=`crest-${c.plate}-${i}`;const pat=node('pattern',{id,patternUnits:'userSpaceOnUse',x:b.x,y:b.y,width:b.width,height:b.height,viewBox:`0 0 ${b.width} ${b.height}`});pat.append(node('rect',{width:b.width,height:b.height,fill:v.color||'#f3eedc'}),node('image',{href:v.logo,x:0,y:0,width:b.width,height:b.height,preserveAspectRatio:'xMidYMid slice'}));defs.append(pat);g.querySelectorAll('path').forEach(p=>p.style.fill=`url(#${id})`);}
  });
 });
 $('#visited-count').textContent=visits.length;
 for(const [id,on] of [['visited',onlyVisited],['all',!onlyVisited]]){$('#'+id).classList.toggle('selected',on);$('#'+id).setAttribute('aria-pressed',on);}
 const filtered=cities.filter(c=>matches(c)&&(!onlyVisited||query||record(c))).sort((a,b)=>(onlyVisited ? (record(b)?.visitOrder ?? 0)-(record(a)?.visitOrder ?? 0) : 0)||Number(a.plate)-Number(b.plate));
 const visible=expanded||query||onlyVisited?filtered:filtered.slice(0,8);const container=$('#results');container.replaceChildren();
 visible.forEach(c=>{const v=record(c),button=document.createElement('button');button.className='city';button.setAttribute('aria-label',`${c.name}: ${v?'yayını izle':'ziyaret videosu eklenmedi'}`);const plate=document.createElement('span');plate.className='plate';plate.textContent=c.plate;const info=document.createElement('span'),name=document.createElement('strong'),sub=document.createElement('small');name.textContent=c.name;sub.textContent=v?v.team:'Henüz gezilmedi';info.append(name,sub);button.append(plate,info);if(v?.logo){const img=document.createElement('img');img.src=v.logo;img.alt=v.team;button.append(img);}const arrow=document.createElement('span');arrow.className='arrow';arrow.textContent=v?'↗':'＋';button.append(arrow);button.addEventListener('click',()=>showCity(c));container.append(button);});
 if(!visible.length){const p=document.createElement('p');p.className='empty';p.textContent=query?'Bu aramayla eşleşen şehir bulunamadı. Başka bir şehir adı veya plaka deneyebilirsin.':'Henüz yayın eklenmedi.';container.append(p);}
 $('#show-all').hidden=!!query||onlyVisited||filtered.length<=8;$('#show-all').textContent=expanded?'Daha az göster ↑':`${filtered.length} şehrin tamamını göster ↓`;
}
async function init(){
 try{
  const [mapRes,dataRes]=await Promise.all([fetch('assets/turkiye.svg'),fetch('visits.json')]);if(!mapRes.ok||!dataRes.ok)throw Error('Dosyalar yüklenemedi');
  const svg=new DOMParser().parseFromString(await mapRes.text(),'image/svg+xml').documentElement;
  if(svg.localName!=='svg')throw Error('Geçersiz harita');$('#map').replaceChildren(document.importNode(svg,true));
  const all=[...$('#map').querySelectorAll('[data-plakakodu]')];
  all.forEach(g=>{const plate=g.dataset.plakakodu;let c=cities.find(x=>x.plate===plate);if(!c){c={plate,name:plate==='34'?'İstanbul':g.dataset.iladi,groups:[]};cities.push(c);}c.groups.push(g);g.setAttribute('tabindex','0');g.setAttribute('role','button');g.addEventListener('click',()=>showCity(c));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showCity(c);}});g.addEventListener('pointermove',e=>tooltip(c,e));g.addEventListener('focus',e=>tooltip(c,e));for(const event of ['pointerleave','blur'])g.addEventListener(event,()=>$('#tooltip').hidden=true);});
  const data=await dataRes.json();if(!Array.isArray(data.visits))throw Error('Ziyaret listesi geçersiz');const seen=new Set();visits=data.visits.map(v=>{v={...v,plate:String(v.plate).padStart(2,'0')};if(!cities.some(c=>c.plate===v.plate)||seen.has(v.plate)||!v.team||!v.logo||!safeVideo(v.videoUrl))throw Error('Ziyaret kaydı geçersiz');seen.add(v.plate);return v;});
  render();
 }catch(e){$('#map').textContent='Harita yüklenemedi. Sayfayı yenileyerek tekrar deneyebilirsin.';console.error(e);}
}
$('#all').onclick=()=>{onlyVisited=false;render();};$('#visited').onclick=()=>{onlyVisited=true;render();};$('#search').addEventListener('input',e=>{query=e.target.value.trim();render();});$('#show-all').onclick=()=>{expanded=!expanded;render();};document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('#city-dialog').open){e.preventDefault();$('#search').focus();}if(e.key==='Escape')$('#tooltip').hidden=true;});for(const el of [$('.close'),$('#dialog-ok')])el.onclick=()=>$('#city-dialog').close();$('#city-dialog').addEventListener('click',e=>{if(e.target===$('#city-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});init();
