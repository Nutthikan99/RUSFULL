(function(){
 const file=location.pathname.split('/').pop(); const groups=window.RUS_MASTER_GROUPS||{}; const masters=groups[file]; if(!masters) return;
 const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
 const key='rus-master-group:v12:'+file; let store={}; try{store=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){};
 function save(){localStorage.setItem(key,JSON.stringify(store));}
 function ensure(){masters.forEach(([name,headers,rows])=>{if(!store[name])store[name]=rows.map(r=>({v:r,on:r[headers.indexOf('สถานะ')]!=='ปิดใช้งาน'}));});save();}
 ensure();
 const style=document.createElement('style');style.textContent=`
 .mg-wrap{margin-top:16px}.mg-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.mg-tab{border:1px solid #cbd5e1;background:#fff;color:#163d78;border-radius:9px;padding:9px 12px;font:inherit;font-weight:700;cursor:pointer}.mg-tab.active{background:#163d78;color:#fff;border-color:#163d78}.mg-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.mg-search{min-width:280px;padding:9px 11px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}.mg-actions{display:flex;gap:6px;flex-wrap:wrap}.mg-btn{border:1px solid #cbd5e1;background:#fff;color:#1d4ed8;border-radius:7px;padding:5px 9px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.mg-btn.edit{color:#92400e}.mg-btn.off{color:#b91c1c}.mg-btn.on{color:#166534}.mg-status{display:inline-block;padding:4px 9px;border-radius:999px;background:#dcfce7;color:#166534;font-size:12px;font-weight:700}.mg-status.inactive{background:#fee2e2;color:#991b1b}
 dialog.mg-modal{border:0;border-radius:16px;padding:0;width:min(900px,94vw);max-height:90vh;box-shadow:0 24px 70px rgba(15,23,42,.35);position:fixed;left:50%;top:50%;margin:0;transform:translate(-50%,-50%)}dialog.mg-modal::backdrop{background:rgba(15,23,42,.55)}.mg-head{padding:17px 20px;background:#163d78;color:#fff;display:flex;justify-content:space-between;align-items:center}.mg-head h3{margin:0;font-size:19px}.mg-close{border:0;background:#fff;color:#163d78;border-radius:8px;width:36px;height:36px;font-size:20px;cursor:pointer}.mg-body{padding:20px;max-height:68vh;overflow:auto}.mg-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}.mg-field{display:flex;flex-direction:column;gap:6px}.mg-field label{font-size:13px;font-weight:700;color:#334155}.mg-field input,.mg-field select,.mg-field textarea{font:inherit;border:1px solid #cbd5e1;border-radius:8px;padding:9px 10px;min-height:40px}.mg-field textarea{min-height:78px}.mg-field.wide{grid-column:1/-1}.mg-read{padding:10px 11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;min-height:40px}.mg-foot{padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;gap:9px}.mg-toast{position:fixed;right:24px;bottom:24px;z-index:9999;background:#163d78;color:#fff;padding:11px 16px;border-radius:10px;opacity:0;transform:translateY(8px);transition:.2s}.mg-toast.show{opacity:1;transform:none}.mg-note{padding:10px 12px;border-radius:9px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a;font-size:12.5px;margin-bottom:14px}.mg-required:after{content:' *';color:#dc2626}.mg-error{grid-column:1/-1;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:9px 11px;display:none}@media(max-width:760px){.mg-grid{grid-template-columns:1fr}.mg-field.wide{grid-column:auto}.mg-search{min-width:0;width:100%}}
 `;document.head.appendChild(style);
 const section=document.querySelector('main section.card'); if(!section)return;
 const box=section.querySelector('div[style*="padding:18px"]')||section;
 const specialNote=file==='2174.html'?'<div class="mg-note"><b>M4 หลักการบุคลากร:</b> Personnel Master เก็บตัวบุคคลเพียงครั้งเดียว ส่วนหน้าที่ต้องกำหนดผ่าน Role Assignment แบบหลายรายการต่อ 1 คน พร้อมขอบเขตและช่วงเวลาที่มีผล</div>':'';
 box.innerHTML='<div class="mg-wrap">'+specialNote+'<div class="mg-tabs"></div><div class="mg-toolbar"><input class="mg-search" placeholder="ค้นหาใน Master Data..."><button class="btn btn-primary" id="mgAdd">+ เพิ่มข้อมูล</button></div><div class="table-wrap"><table class="data-table" id="mgTable"><thead></thead><tbody></tbody></table></div><div class="warnbox"><b>หลักการ:</b> ค่า Dropdown ของ STEP 1–14 ต้องอ้างอิง Master Data กลาง และรายการที่ปิดใช้งานจะไม่แสดงเป็นตัวเลือกใหม่ แต่ยังคงประวัติเดิมไว้</div></div>';
 const tabs=box.querySelector('.mg-tabs'), table=box.querySelector('#mgTable'), search=box.querySelector('.mg-search'); let current=0;
 masters.forEach((m,i)=>{const b=document.createElement('button');b.className='mg-tab'+(i===0?' active':'');b.textContent=m[0];b.onclick=()=>{current=i;tabs.querySelectorAll('.mg-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');search.value='';render();};tabs.appendChild(b)});
 function toast(t){let e=document.querySelector('.mg-toast');if(!e){e=document.createElement('div');e.className='mg-toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
 function rowText(r){return r.v.join(' ').toLowerCase()}
 function render(){const [name,headers]=masters[current], rows=store[name]||[];table.tHead.innerHTML='<tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'<th style="min-width:210px">จัดการ</th></tr>'; const q=search.value.trim().toLowerCase();table.tBodies[0].innerHTML='';rows.forEach((r,idx)=>{if(q&&!rowText(r).includes(q))return;const tr=document.createElement('tr');tr.style.opacity=r.on?'1':'.58';headers.forEach((h,i)=>{const td=document.createElement('td');const val=r.v[i]??'';if(h==='สถานะ')td.innerHTML='<span class="mg-status '+(r.on?'':'inactive')+'">'+(r.on?'ใช้งาน':'ปิดใช้งาน')+'</span>';else td.textContent=val;tr.appendChild(td)});const td=document.createElement('td');td.innerHTML='<div class="mg-actions"><button class="mg-btn" data-a="view">ดู</button><button class="mg-btn edit" data-a="edit">แก้ไข</button><button class="mg-btn '+(r.on?'off':'on')+'" data-a="toggle">'+(r.on?'ปิดใช้งาน':'เปิดใช้งาน')+'</button></div>';td.onclick=e=>{const a=e.target.dataset.a;if(a==='view'||a==='edit')openModal(a,idx);if(a==='toggle'){r.on=!r.on;const si=headers.indexOf('สถานะ');if(si>=0)r.v[si]=r.on?'ใช้งาน':'ปิดใช้งาน';save();render();toast(r.on?'เปิดใช้งานแล้ว':'ปิดใช้งานแล้ว')}};tr.appendChild(td);table.tBodies[0].appendChild(tr)});}
 search.oninput=render;box.querySelector('#mgAdd').onclick=()=>openModal('add',-1);
 function masterRows(name){return (store[name]||[]).filter(r=>r.on)}
 function displayPersonnel(r){return [r.v[0],'-',((r.v[1]||'')+(r.v[2]||'')+' '+(r.v[3]||'')).trim()].join(' ')}
 function displayRole(r){return r.v[1]||r.v[0]}
 function selectHtml(i,value,options,placeholder){return '<select data-i="'+i+'"><option value="">'+esc(placeholder||'-- เลือก --')+'</option>'+options.map(o=>'<option value="'+esc(o.value)+'" '+(o.value===value?'selected':'')+'>'+esc(o.label)+'</option>').join('')+'</select>'}
 function inputTypeFor(h){if(/วันที่/.test(h))return 'date';if(/อีเมล/.test(h))return 'email';if(/ความจุ|ลำดับ|หน่วยกิต|คะแนน/.test(h))return 'number';return 'text'}
 function thaiDateToIso(v){const m=String(v||'').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!m)return v;return `${+m[3]-543}-${m[2]}-${m[1]}`}
 function isoToThaiDate(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return v;return `${m[3]}/${m[2]}/${+m[1]+543}`}
 function fieldControl(name,h,i,v,mode){
   if(mode==='view')return '<div class="mg-read">'+esc(v||'-')+'</div>';
   if(h==='สถานะ')return selectHtml(i,v||'ใช้งาน',[{value:'ใช้งาน',label:'ใช้งาน'},{value:'ปิดใช้งาน',label:'ปิดใช้งาน'}]);
   if(file==='2174.html'&&name==='Role Assignment'&&h==='บุคลากร'){
     const opts=masterRows('Personnel Master').map(r=>({value:displayPersonnel(r),label:displayPersonnel(r)}));return selectHtml(i,v,opts,'-- เลือกบุคลากร --');
   }
   if(file==='2174.html'&&name==='Role Assignment'&&h==='บทบาท'){
     const opts=masterRows('Role Master').map(r=>({value:displayRole(r),label:displayRole(r)}));return selectHtml(i,v,opts,'-- เลือกบทบาท --');
   }
   if(file==='2174.html'&&name==='Role Assignment'&&h==='ประเภทขอบเขต'){
     const vals=['ทั้งมหาวิทยาลัย','คณะ/หน่วยงาน','สาขา/ฝ่าย','หลักสูตร','รายวิชา','Section','รุ่นนักศึกษา','Workflow'];return selectHtml(i,v,vals.map(x=>({value:x,label:x})),'-- เลือกประเภทขอบเขต --');
   }
   if(file==='2174.html'&&name==='Personnel Master'&&h==='ประเภทหน่วยงาน'){
     const vals=['คณะ','สำนัก/สถาบัน','กอง/สำนักงาน','หน่วยงานอื่น'];return selectHtml(i,v,vals.map(x=>({value:x,label:x})),'-- เลือกประเภทหน่วยงาน --');
   }
   if(file==='2174.html'&&name==='Role Master'&&h==='กลุ่มบทบาท'){
     const vals=['การเรียนการสอน','การให้คำปรึกษา','หลักสูตร','Workflow','การบริหาร'];return selectHtml(i,v,vals.map(x=>({value:x,label:x})),'-- เลือกกลุ่มบทบาท --');
   }
   const wide=/รายละเอียด|คำอธิบาย|เงื่อนไข|ขอบเขต|Workflow|ใช้ในกระบวนการ/.test(h);if(wide)return '<textarea data-i="'+i+'">'+esc(v)+'</textarea>';
   let val=v;if(/วันที่/.test(h))val=thaiDateToIso(v);return '<input type="'+inputTypeFor(h)+'" data-i="'+i+'" value="'+esc(val)+'">';
 }
 function validate(name,headers,vals,mode,idx){
   if(!vals[0])return 'กรุณากรอกรหัส/ข้อมูลช่องแรก';
   const rows=store[name]||[];
   if(rows.some((r,j)=>j!==idx && String(r.v[0]).trim()===String(vals[0]).trim()))return 'รหัสนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น';
   if(file==='2174.html'&&name==='Role Assignment'){
     const p=headers.indexOf('บุคลากร'), ro=headers.indexOf('บทบาท'), st=headers.indexOf('ประเภทขอบเขต'), sd=headers.indexOf('รายละเอียดขอบเขต'), ds=headers.indexOf('วันที่เริ่ม'), de=headers.indexOf('วันที่สิ้นสุด');
     if(!vals[p])return 'กรุณาเลือกบุคลากร';if(!vals[ro])return 'กรุณาเลือกบทบาท';if(!vals[st])return 'กรุณาเลือกประเภทขอบเขต';if(!vals[sd])return 'กรุณาระบุรายละเอียดขอบเขต';
     if(vals[ds]&&vals[de]){const a=thaiDateToIso(vals[ds]),b=thaiDateToIso(vals[de]);if(a>b)return 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่ม';}
     const dup=rows.some((r,j)=>j!==idx&&r.on&&r.v[p]===vals[p]&&r.v[ro]===vals[ro]&&r.v[st]===vals[st]&&r.v[sd]===vals[sd]);if(dup)return 'มี Role Assignment ของบุคลากร บทบาท และขอบเขตนี้อยู่แล้ว';
   }
   return '';
 }
 function openModal(mode,idx){const [name,headers]=masters[current], rows=store[name], rec=idx>=0?rows[idx]:{v:headers.map(()=>''),on:true};let d=document.querySelector('.mg-modal');if(d)d.remove();d=document.createElement('dialog');d.className='mg-modal';const title=(mode==='add'?'เพิ่มข้อมูล':mode==='edit'?'แก้ไขข้อมูล':'ดูรายละเอียด')+' — '+name;
   const fields=headers.map((h,i)=>{let v=rec.v[i]||'';if(h==='สถานะ')v=rec.on?'ใช้งาน':'ปิดใช้งาน';const required=(i===0)||(file==='2174.html'&&name==='Role Assignment'&&['บุคลากร','บทบาท','ประเภทขอบเขต','รายละเอียดขอบเขต','วันที่เริ่ม'].includes(h));return '<div class="mg-field '+(/รายละเอียด|คำอธิบาย|เงื่อนไข|ขอบเขต|Workflow|ใช้ในกระบวนการ/.test(h)?'wide':'')+'"><label class="'+(required?'mg-required':'')+'">'+esc(h)+'</label>'+fieldControl(name,h,i,v,mode)+'</div>'}).join('');
   const explain=(file==='2174.html'&&name==='Role Assignment')?'<div class="mg-field wide"><div class="mg-note"><b>ตัวอย่าง:</b> บุคลากรคนเดียวสามารถเพิ่ม Assignment ได้หลายรายการ เช่น ผู้สอนใน Section 01 + อาจารย์ที่ปรึกษารุ่น 2570 + ผู้รับผิดชอบหลักสูตรฉบับ 2569 โดยแต่ละ Assignment มีขอบเขตและช่วงเวลาของตนเอง</div></div>':'';
   d.innerHTML='<div class="mg-head"><h3>'+esc(title)+'</h3><button class="mg-close">×</button></div><div class="mg-body"><div class="mg-grid">'+explain+fields+'<div class="mg-error"></div></div></div><div class="mg-foot"><button class="btn btn-ghost" data-close>ปิด</button>'+(mode==='view'?'':'<button class="btn btn-primary" data-save>บันทึก</button>')+'</div>';document.body.appendChild(d);d.querySelector('.mg-close').onclick=()=>d.close();d.querySelector('[data-close]').onclick=()=>d.close();
   if(mode!=='view')d.querySelector('[data-save]').onclick=()=>{const vals=headers.map((h,i)=>{const el=d.querySelector('[data-i="'+i+'"]');let x=el?el.value.trim():rec.v[i]||'';if(/วันที่/.test(h)&&el&&el.type==='date')x=isoToThaiDate(x);return x});const err=validate(name,headers,vals,mode,idx);const ee=d.querySelector('.mg-error');if(err){ee.textContent=err;ee.style.display='block';return}ee.style.display='none';const si=headers.indexOf('สถานะ');const on=si<0||vals[si]!=='ปิดใช้งาน';if(si>=0)vals[si]=on?'ใช้งาน':'ปิดใช้งาน';if(mode==='add')rows.push({v:vals,on});else rows[idx]={v:vals,on};save();render();d.close();toast(mode==='add'?'เพิ่มข้อมูลเรียบร้อย':'บันทึกการแก้ไขแล้ว')};d.showModal();
 }
 render();
})();
