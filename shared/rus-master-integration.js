(function(){
'use strict';
const CFG=window.RUS_MASTER_GROUPS||{};
const GROUP_FILES=['2171.html','2172.html','2173.html','2174.html','2175.html','2176.html','2177.html','2180.html'];
const STATUS_NAMES=new Set(['สถานะปฏิทิน','สถานะเอกสาร','สถานะ Section','สถานะสิทธิ์ลงทะเบียน','สถานะการลงทะเบียน','สถานะการอนุมัติ','สถานะ Pay-In','สถานะการชำระเงิน','ผล Validation','สถานะระบบกลาง']);
const SYSTEM_CONSTANTS={'วันในสัปดาห์':['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์']};
function readGroup(file){
  const defs=CFG[file]||[]; let stored={};
  try{stored=JSON.parse(localStorage.getItem('rus-master-group:v12:'+file)||'{}')}catch(e){}
  const out={};
  defs.forEach(([name,headers,rows])=>{
    const rr=stored[name]||rows.map(r=>({v:r,on:r[headers.indexOf('สถานะ')]!=='ปิดใช้งาน'}));
    out[name]={headers,rows:rr.filter(r=>r.on!==false && String(r.v[headers.indexOf('สถานะ')]||'ใช้งาน')!=='ปิดใช้งาน')};
  });return out;
}
const M=Object.assign({},...GROUP_FILES.map(readGroup));
const vals=(name,col=1)=>{const m=M[name];if(!m)return[];return m.rows.map(r=>String(r.v[col]??'')).filter(Boolean)};
const objs=(name)=>{const m=M[name];if(!m)return[];return m.rows.map(r=>Object.fromEntries(m.headers.map((h,i)=>[h,r.v[i]])))};
const file=location.pathname.split('/').pop();
function clean(s){return String(s||'').replace(/\s+/g,' ').replace(/\*/g,'').trim()}
function labelOf(el){
  if(el.id){const l=document.querySelector('label[for="'+CSS.escape(el.id)+'"]');if(l)return clean(l.textContent)}
  let p=el.parentElement;for(let i=0;i<3&&p;i++,p=p.parentElement){const l=p.querySelector(':scope > label');if(l)return clean(l.textContent)}
  return '';
}
function chooseMaster(label,el){
  const l=clean(label), opts=[...el.options].map(o=>clean(o.textContent)).join('|');
  if(/ทุกหมวดวิชา/.test(opts)) return ['หมวดวิชา',1];
  if(/ทุกสถานภาพ/.test(opts)) return ['สถานภาพนักศึกษา',1];
  if(/ปีการศึกษา/.test(l)) return ['ปีการศึกษา',1];
  if(/ภาคการศึกษา|ภาคเรียน/.test(l) && /ปกติ|สมทบ/.test(opts)) return ['รูปแบบ / ภาคการศึกษา',1];
  if(/ภาคการศึกษา|ภาคเรียน/.test(l) && !/รูปแบบ/.test(l)) return ['ภาคเรียน',1];
  if(/ระดับ/.test(l)) return ['ระดับการศึกษา',1];
  if(/^คณะ/.test(l)) return ['คณะ',1];
  if(/สาขาวิชา|ภาควิชา/.test(l)) return ['สาขาวิชา',1];
  if(/ศูนย์/.test(l)) return ['ศูนย์การศึกษา',1];
  if(/รูปแบบการศึกษา/.test(l)) return ['รูปแบบ / ภาคการศึกษา',1];
  if((/ภาค$|รูปแบบ.*ภาค/.test(l)) && /ปกติ|สมทบ/.test(opts)) return ['รูปแบบ / ภาคการศึกษา',1];
  if(/หลักสูตร \/ Version|ฉบับหลักสูตร (พ.ศ.)|ฉบับหลักสูตร/.test(l)) return ['ฉบับหลักสูตร (พ.ศ.)',0];
  if(/^หลักสูตร/.test(l)) return ['หลักสูตรกลาง',1];
  if(/หมวดวิชา/.test(l)) return ['หมวดวิชา',1];
  if(/กลุ่มวิชา/.test(l)) return ['กลุ่มวิชา',1];
  if(/ประเภทวิชา/.test(l)) return ['ประเภทวิชา',1];
  if(/วิธีนับรายวิชา/.test(l)) return ['วิธีนับรายวิชา',1];
  if(/^รายวิชา/.test(l)) return ['รายวิชากลาง',1];
  if(/รูปแบบการให้เกรด/.test(l)) return ['Grading Scheme',1];
  if(/รูปแบบแผน/.test(l)) return ['รูปแบบแผนการเรียน',1];
  if(/ชั้นปี/.test(l)) return ['ชั้นปี',1];
  if(/กลุ่มเป้าหมาย|กลุ่มนักศึกษา/.test(l)) return ['กลุ่มเป้าหมายปฏิทิน',1];
  if(/หน่วย$/.test(l) && /บาท\//.test(opts)) return ['หน่วยค่าปรับ',1];
  if(/ประเภทคำขอ|ประเภทคำร้อง/.test(l)) return ['ประเภทคำขอ',1];
  if(/ประเภทเอกสาร/.test(l)) return ['ประเภทเอกสารนักศึกษา',1];
  if(/ประเภทกิจกรรม|^กิจกรรม$/.test(l)) return ['ประเภทกิจกรรมปฏิทิน',1];
  if(/เหตุผล/.test(l)) return ['เหตุผลคำร้อง',1];
  if(/อาจารย์ผู้สอน|ผู้สอน/.test(l)) return ['__TEACHERS__',0];
  if(/อาจารย์ที่ปรึกษา|ที่ปรึกษา/.test(l)) return ['__ADVISORS__',0];
  if(/วันเรียน/.test(l)) return ['__DAYS__',0];
  if(/ห้องเรียน|สถานที่เรียน/.test(l)) return ['ห้องเรียน / สถานที่',2];
  if(/ประเภท Section/.test(l)) return ['ประเภท Section',1];
  if(/สถานภาพ/.test(l)) return ['สถานภาพนักศึกษา',1];
  if(/สถานะ/.test(l) || /ทุกสถานะ/.test(opts)){
    if(/^203|^2060_(preview|registered|success)|^2070_(select|confirm|history)/.test(file)) return ['สถานะ Section',1];
    if(/^204|^208/.test(file)) return ['ผล Validation',1];
    if(/^2070\.html|^209|^2130_(approval|history)/.test(file)) return ['สถานะการอนุมัติ',1];
    if(/^210/.test(file)) return ['สถานะ Pay-In',1];
    if(/^211/.test(file)) return ['สถานะการชำระเงิน',1];
    if(/^2140_documents/.test(file)) return ['สถานะเอกสาร',1];
    if(/^214/.test(file)) return ['สถานภาพนักศึกษา',1];
    if(/^205/.test(file)) return ['สถานะสิทธิ์ลงทะเบียน',1];
    if(/^2060\.html/.test(file)) return ['สถานะการลงทะเบียน',1];
    if(/^201|^202|^212|^2130_request|^215/.test(file)) return ['สถานะระบบกลาง',1];
  }
  if(/^2130\.html$/.test(file) && /ทุกประเภท/.test(opts)) return ['ประเภทคำขอ',1];
  return null;
}
function personnelByRole(role){
  const ps=objs('Personnel Master'), as=objs('Role Assignment');
  const active=as.filter(a=>clean(a['บทบาท'])===role && clean(a['สถานะ'])!=='ปิดใช้งาน');
  const ids=new Set(active.map(a=>clean(a['บุคลากร']).split(' - ')[0]));
  return ps.filter(p=>ids.has(clean(p['รหัสบุคลากร']))).map(p=>({value:p['รหัสบุคลากร'],label:[p['คำนำหน้า'],p['ชื่อ'],p['นามสกุล']].filter(Boolean).join(' ')}));
}
function optionsFor(spec){
  if(spec[0]==='__TEACHERS__') return personnelByRole('ผู้สอน');
  if(spec[0]==='__ADVISORS__') return personnelByRole('อาจารย์ที่ปรึกษา');
  if(spec[0]==='__DAYS__') return SYSTEM_CONSTANTS['วันในสัปดาห์'].map((x,i)=>({value:String(i+1),label:x}));
  const m=M[spec[0]]; if(!m)return[];
  return m.rows.map(r=>({value:String(r.v[0]??''),label:String(r.v[spec[1]]??r.v[0]??'')}));
}
function replaceSelect(sel){
  const lab=labelOf(sel), spec=chooseMaster(lab,sel); if(!spec)return false;
  const items=optionsFor(spec); if(!items.length)return false;
  const old=[...sel.options]; const oldVal=sel.value; const oldText=clean(sel.options[sel.selectedIndex]?.textContent);
  let placeholder=''; const first=clean(old[0]?.textContent); if(first && (/ทุก|เลือก|--|โปรด/.test(first)))placeholder=first;
  sel.innerHTML='';
  if(placeholder){const o=document.createElement('option');o.value='';o.textContent=placeholder;sel.appendChild(o)}
  items.forEach(x=>{const o=document.createElement('option');o.value=x.value;o.textContent=x.label;sel.appendChild(o)});
  let found=[...sel.options].find(o=>o.value===oldVal || clean(o.textContent)===oldText || clean(o.textContent).includes(oldText) || oldText.includes(clean(o.textContent)));
  if(found) found.selected=true;
  const isStatus=STATUS_NAMES.has(spec[0]); sel.dataset.rusMaster=spec[0]; sel.dataset.rusSource=isStatus?'STATUS':(spec[0]==='__DAYS__'?'CONSTANT':'MASTER'); sel.title=(isStatus?'ข้อมูลจาก SYSTEM STATUS → ':spec[0]==='__DAYS__'?'ค่าคงที่ระบบ → ':'ข้อมูลจาก MASTER SYSTEM 1 → ')+spec[0];
  return true;
}
function convertRoomInput(){
  if(!/^2030_(add|edit)\.html$/.test(file))return;
  [...document.querySelectorAll('input')].forEach(inp=>{
    if(!/ห้องเรียน/.test(labelOf(inp)))return;
    const items=optionsFor(['ห้องเรียน / สถานที่',2]); if(!items.length)return;
    const sel=document.createElement('select'); [...inp.attributes].forEach(a=>{if(a.name!=='type'&&a.name!=='value'&&a.name!=='placeholder')sel.setAttribute(a.name,a.value)});
    const ph=document.createElement('option');ph.value='';ph.textContent='เลือกห้องเรียน / สถานที่';sel.appendChild(ph);
    items.forEach(x=>{const o=document.createElement('option');o.value=x.value;o.textContent=x.label;sel.appendChild(o)});
    const cur=clean(inp.value); const hit=[...sel.options].find(o=>clean(o.textContent).includes(cur)||cur.includes(clean(o.textContent)));if(hit)hit.selected=true;
    sel.dataset.rusMaster='ห้องเรียน / สถานที่'; sel.title='ข้อมูลจาก MASTER DATA → ห้องเรียน / สถานที่'; inp.replaceWith(sel);
  });
}
function addMasterBadge(){
  const sels=[...document.querySelectorAll('select[data-rus-master]')];
  if(!sels.length)return;
  const st=document.createElement('style');st.textContent='.rus-master-note{display:inline-flex;align-items:center;margin-left:7px;padding:2px 7px;border-radius:999px;background:#eef6ff;color:#1d4ed8;border:1px solid #bfdbfe;font-size:10px;font-weight:700;vertical-align:middle}.rus-master-summary{margin:0 0 14px;padding:9px 12px;border:1px solid #bfdbfe;background:#eff6ff;border-radius:9px;color:#1e3a8a;font-size:12.5px}';document.head.appendChild(st);
  sels.forEach(s=>{const p=s.parentElement;if(!p||p.querySelector(':scope > .rus-master-note'))return;const b=document.createElement('span');b.className='rus-master-note';b.textContent=s.dataset.rusSource==='STATUS'?'STATUS':(s.dataset.rusSource==='CONSTANT'?'SYSTEM':'MASTER');p.appendChild(b)});
  const main=document.querySelector('main');if(main&&!main.querySelector('.rus-master-summary')){const x=document.createElement('div');x.className='rus-master-summary';x.innerHTML='<b>Data Integration:</b> Dropdown ในหน้านี้ดึงจาก MASTER SYSTEM 1 / SYSTEM STATUS หรือค่าคงที่ระบบตามประเภทข้อมูล';const card=main.querySelector('.card');if(card)main.insertBefore(x,card);}
}
function integrate(){document.querySelectorAll('select').forEach(replaceSelect);convertRoomInput();document.querySelectorAll('select').forEach(s=>{if(!s.dataset.rusMaster)replaceSelect(s)});addMasterBadge()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',integrate);else integrate();
})();
