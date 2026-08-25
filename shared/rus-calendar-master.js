(function(){
'use strict';
window.RUSCalendarMaster=(function(){
 const CFG=window.RUS_MASTER_GROUPS||{};
 function readGroup(file){const defs=CFG[file]||[];let stored={};try{stored=JSON.parse(localStorage.getItem('rus-master-group:v12:'+file)||'{}')}catch(e){};const out={};defs.forEach(([name,headers,rows])=>{const rr=stored[name]||rows.map(r=>({v:r,on:true}));out[name]={headers,rows:rr.filter(r=>r.on!==false&&String(r.v[headers.indexOf('สถานะ')]||'ใช้งาน')!=='ปิดใช้งาน')}});return out}
 const M=Object.assign({},...['2171.html','2172.html','2173.html','2174.html','2175.html','2176.html','2177.html','2180.html'].map(readGroup));
 const rows=name=>(M[name]?.rows||[]).map(r=>r.v);
 const values=(name,col=1)=>rows(name).map(r=>String(r[col]??'')).filter(Boolean);
 function fillSelect(el,name,col=1,placeholder='',current=''){if(!el)return;const cur=current||el.value;el.innerHTML='';if(placeholder){const o=document.createElement('option');o.value='';o.textContent=placeholder;el.appendChild(o)}values(name,col).forEach((v,i)=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)});if(cur && ![...el.options].some(o=>o.value===cur)){const o=document.createElement('option');o.value=cur;o.textContent=cur+' (ข้อมูลเดิม)';el.appendChild(o)};el.value=cur||el.options[0]?.value||'';el.dataset.rusMaster=name;el.title='ข้อมูลจาก MASTER SYSTEM 1 → '+name}
 function fillCodeSelect(el,name,labelCol=1,placeholder='',current='',codeMap=null){if(!el)return;const cur=String(current||el.value||'');el.innerHTML='';if(placeholder){const o=document.createElement('option');o.value='';o.textContent=placeholder;el.appendChild(o)}rows(name).forEach(r=>{const o=document.createElement('option');let code=String(r[0]??'');if(codeMap&&codeMap[code])code=codeMap[code];o.value=code;o.textContent=String(r[labelCol]??r[0]??'');el.appendChild(o)});if(cur && ![...el.options].some(o=>o.value===cur)){const o=document.createElement('option');o.value=cur;o.textContent=cur+' (ข้อมูลเดิม)';el.appendChild(o)};el.value=cur||el.options[0]?.value||'';el.dataset.rusMaster=name}
 function fillStatus(el,name,current=''){fillCodeSelect(el,name,1,'',current);if(el){el.dataset.rusSource='STATUS';el.title='ข้อมูลจาก SYSTEM STATUS → '+name}}
 function renderChecks(box,name,col=1,selected=[]){if(!box)return;const cur=new Set((selected||[]).map(String));box.innerHTML='';values(name,col).forEach(v=>{const l=document.createElement('label');l.className='check-chip';const i=document.createElement('input');i.type='checkbox';i.value=v;i.checked=cur.has(v);l.appendChild(i);l.appendChild(document.createTextNode(' '+v));box.appendChild(l)});box.dataset.rusMaster=name}
 function selected(box){return [...box.querySelectorAll('input:checked')].map(i=>i.value)}
 return {values,fillSelect,fillCodeSelect,fillStatus,renderChecks,selected};
})();
})();