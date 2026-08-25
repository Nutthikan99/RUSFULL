(function(){
  const pageKey = 'rus-master-crud:' + location.pathname.split('/').pop();
  const normalize = s => (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  const escapeHtml = s => String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const getTables = () => Array.from(document.querySelectorAll('main .data-table'));

  function ensureStyles(){
    if(document.getElementById('masterCrudStyle')) return;
    const st=document.createElement('style'); st.id='masterCrudStyle'; st.textContent=`
      .crud-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.crud-btn{border:1px solid #cbd5e1;background:#fff;color:#1d4ed8;border-radius:7px;padding:5px 9px;font-family:inherit;font-weight:600;font-size:12px;cursor:pointer}.crud-btn:hover{background:#eff6ff}.crud-btn.edit{color:#92400e}.crud-btn.toggle{color:#b91c1c}.crud-btn.restore{color:#166534}.crud-status{display:inline-flex;padding:4px 9px;border-radius:999px;font-size:12px;font-weight:600;background:#dcfce7;color:#166534}.crud-status.off{background:#fee2e2;color:#991b1b}
      .crud-modal{border:0;border-radius:14px;padding:0;width:min(760px,94vw);max-height:90vh;box-shadow:0 24px 70px rgba(15,23,42,.32);position:fixed;left:50%;top:50%;margin:0;transform:translate(-50%,-50%)}.crud-modal::backdrop{background:rgba(15,23,42,.55)}.crud-head{padding:16px 20px;background:#163d78;color:#fff;display:flex;justify-content:space-between;align-items:center}.crud-head h3{margin:0;font-size:18px}.crud-close{border:0;background:#fff;color:#163d78;border-radius:8px;width:36px;height:36px;cursor:pointer;font-size:20px}.crud-body{padding:20px;max-height:68vh;overflow:auto}.crud-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}.crud-field{display:flex;flex-direction:column;gap:6px}.crud-field label{font-size:13px;font-weight:600;color:#334155}.crud-field input,.crud-field select,.crud-field textarea{font:inherit;border:1px solid #cbd5e1;border-radius:8px;padding:9px 10px;min-height:40px;background:#fff}.crud-field textarea{min-height:78px;resize:vertical}.crud-field.full{grid-column:1/-1}.crud-foot{padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;gap:9px}.crud-foot .btn{min-width:90px}.crud-read{padding:11px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;min-height:40px}.crud-toast{position:fixed;right:24px;bottom:24px;z-index:9999;background:#163d78;color:#fff;padding:11px 16px;border-radius:10px;box-shadow:0 12px 30px rgba(15,23,42,.25);font-family:inherit;opacity:0;transform:translateY(8px);transition:.2s}.crud-toast.show{opacity:1;transform:none}
      @media(max-width:700px){.crud-grid{grid-template-columns:1fr}.crud-field.full{grid-column:auto}.crud-actions{min-width:150px}}
    `; document.head.appendChild(st);
  }
  function toast(msg){let t=document.getElementById('crudToast');if(!t){t=document.createElement('div');t.id='crudToast';t.className='crud-toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
  function load(){try{return JSON.parse(localStorage.getItem(pageKey)||'{}')}catch(e){return {}}}
  function save(data){try{localStorage.setItem(pageKey,JSON.stringify(data))}catch(e){}}
  function getHeaders(table){return Array.from(table.tHead?.rows[0]?.cells||[]).map(th=>normalize(th.textContent)).filter(h=>h!=='จัดการ');}
  function rowValues(tr, headers){return headers.map((_,i)=>normalize(tr.cells[i]?.innerText||''));}
  function applySaved(){
    const data=load(); getTables().forEach((table,ti)=>{
      const records=data[ti]; if(!Array.isArray(records)) return;
      const headers=getHeaders(table); const tbody=table.tBodies[0]; if(!tbody) return;
      tbody.innerHTML=''; records.forEach(rec=>appendRecord(table,headers,rec,false));
    });
  }
  function serialize(){
    const out={}; getTables().forEach((table,ti)=>{const headers=getHeaders(table); out[ti]=Array.from(table.tBodies[0]?.rows||[]).map(tr=>({values:rowValues(tr,headers),active:tr.dataset.active!=='0'}));}); save(out);
  }
  function ensureActionColumn(table){
    const head=table.tHead?.rows[0]; if(!head) return;
    if(normalize(head.cells[head.cells.length-1]?.textContent)==='จัดการ') return;
    const th=document.createElement('th');th.textContent='จัดการ';th.style.minWidth='210px';head.appendChild(th);
    Array.from(table.tBodies[0]?.rows||[]).forEach(tr=>addActions(tr));
  }
  function addActions(tr){
    if(tr.querySelector('.crud-actions')) return;
    tr.dataset.active = tr.dataset.active ?? '1';
    const td=document.createElement('td');td.innerHTML=`<div class="crud-actions"><button class="crud-btn view" type="button">ดู</button><button class="crud-btn edit" type="button">แก้ไข</button><button class="crud-btn toggle" type="button">ปิดใช้งาน</button></div>`;tr.appendChild(td); updateToggle(tr);
  }
  function updateToggle(tr){
    const b=tr.querySelector('.crud-btn.toggle'); if(!b) return;
    const on=tr.dataset.active!=='0'; b.textContent=on?'ปิดใช้งาน':'เปิดใช้งาน'; b.classList.toggle('restore',!on); b.classList.toggle('toggle',true); tr.style.opacity=on?'1':'.58';
    // If there is a status-looking cell, update it, but do not overwrite arbitrary content.
    Array.from(tr.cells).slice(0,-1).forEach(td=>{const txt=normalize(td.textContent);if(['ใช้งาน','ไม่ใช้งาน','ปิดใช้งาน'].includes(txt)||td.querySelector('.tag.ok,.crud-status')){td.innerHTML=`<span class="crud-status${on?'':' off'}">${on?'ใช้งาน':'ปิดใช้งาน'}</span>`;}});
  }
  function appendRecord(table,headers,rec,doSave=true){
    const tr=document.createElement('tr');tr.dataset.active=rec.active===false?'0':'1';
    headers.forEach((h,i)=>{const td=document.createElement('td');let v=rec.values?.[i]||''; if(i===0) td.innerHTML='<b>'+escapeHtml(v)+'</b>'; else if(h.includes('สถานะ')) td.innerHTML=`<span class="crud-status${tr.dataset.active==='0'?' off':''}">${tr.dataset.active==='0'?'ปิดใช้งาน':(v||'ใช้งาน')}</span>`; else td.textContent=v; tr.appendChild(td);});
    table.tBodies[0].appendChild(tr);addActions(tr); if(doSave){serialize();toast('เพิ่มข้อมูลเรียบร้อย')}
  }
  function modal(mode,table,tr){
    const headers=getHeaders(table); const vals=tr?rowValues(tr,headers):headers.map(()=> '');
    let dlg=document.getElementById('crudModal'); if(dlg) dlg.remove(); dlg=document.createElement('dialog');dlg.id='crudModal';dlg.className='crud-modal';
    const title=mode==='add'?'เพิ่มข้อมูล':mode==='edit'?'แก้ไขข้อมูล':'รายละเอียดข้อมูล';
    const fields=headers.map((h,i)=>{
      const full=headers.length%2===1 && i===headers.length-1?' full':''; const id='crudF'+i; const val=vals[i]||'';
      if(mode==='view') return `<div class="crud-field${full}"><label>${escapeHtml(h)}</label><div class="crud-read">${escapeHtml(val)||'-'}</div></div>`;
      if(h.includes('สถานะ')) return `<div class="crud-field${full}"><label for="${id}">${escapeHtml(h)}</label><select id="${id}"><option value="ใช้งาน" ${val!=='ปิดใช้งาน'?'selected':''}>ใช้งาน</option><option value="ปิดใช้งาน" ${val==='ปิดใช้งาน'?'selected':''}>ปิดใช้งาน</option></select></div>`;
      const long=h.includes('รายละเอียด')||h.includes('ขอบเขต')||h.includes('บทบาท'); return `<div class="crud-field${long?' full':full}"><label for="${id}">${escapeHtml(h)}</label>${long?`<textarea id="${id}">${escapeHtml(val)}</textarea>`:`<input id="${id}" value="${escapeHtml(val)}"/>`}</div>`;
    }).join('');
    dlg.innerHTML=`<div class="crud-head"><h3>${title}</h3><button class="crud-close" type="button">×</button></div><div class="crud-body"><div class="crud-grid">${fields}</div></div><div class="crud-foot"><button class="btn btn-ghost" type="button" data-close>ปิด</button>${mode==='view'?'':`<button class="btn btn-primary" type="button" data-save>บันทึก</button>`}</div>`;
    document.body.appendChild(dlg); dlg.querySelectorAll('[data-close],.crud-close').forEach(b=>b.onclick=()=>dlg.close());
    if(mode!=='view') dlg.querySelector('[data-save]').onclick=()=>{
      const newVals=headers.map((h,i)=>dlg.querySelector('#crudF'+i)?.value.trim()||'');
      if(!newVals[0]){toast('กรุณากรอกข้อมูลช่องแรก');return}
      const active=!headers.some((h,i)=>h.includes('สถานะ')&&newVals[i]==='ปิดใช้งาน');
      if(mode==='add'){appendRecord(table,headers,{values:newVals,active},true)} else {headers.forEach((h,i)=>{const td=tr.cells[i]; if(i===0)td.innerHTML='<b>'+escapeHtml(newVals[i])+'</b>'; else if(h.includes('สถานะ'))td.innerHTML=`<span class="crud-status${active?'':' off'}">${active?'ใช้งาน':'ปิดใช้งาน'}</span>`; else td.textContent=newVals[i];});tr.dataset.active=active?'1':'0';updateToggle(tr);serialize();toast('บันทึกการแก้ไขแล้ว')}
      dlg.close();
    };
    dlg.showModal();
  }
  function bindTable(table,ti){
    ensureActionColumn(table);
    table.addEventListener('click',e=>{const btn=e.target.closest('.crud-btn');if(!btn)return;const tr=btn.closest('tr');if(btn.classList.contains('view'))modal('view',table,tr);else if(btn.classList.contains('edit'))modal('edit',table,tr);else if(btn.classList.contains('toggle')){tr.dataset.active=tr.dataset.active==='0'?'1':'0';updateToggle(tr);serialize();toast(tr.dataset.active==='0'?'ปิดใช้งานแล้ว':'เปิดใช้งานแล้ว')}});
    const card=table.closest('.card'); if(card){let add=card.querySelector('.card-head .btn-primary');if(!add){add=document.createElement('button');add.className='btn btn-primary btn-sm';add.type='button';add.textContent='+ เพิ่มข้อมูล';card.querySelector('.card-head')?.appendChild(add)} add.type='button';add.onclick=()=>modal('add',table,null);}
  }
  function init(){ensureStyles();applySaved();getTables().forEach(bindTable);serialize();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
