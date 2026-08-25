
function s6Toast(m){const x=document.createElement('div');x.textContent=m;x.style='position:fixed;right:22px;bottom:22px;background:#173b6d;color:#fff;padding:11px 16px;border-radius:9px;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.18)';document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
function s6Adv(){document.querySelector('.advanced')?.classList.toggle('open')}
function s6Reset(){document.querySelectorAll('.filter input,.filter select,.advanced input,.advanced select').forEach(e=>{if(e.tagName==='SELECT')e.selectedIndex=0;else e.value='' });s6Toast('ล้างตัวกรองแล้ว')}
function s6Search(){s6Toast('ค้นหาและกรองรายการแล้ว')}
function s6Confirm(msg,href){if(confirm(msg)){s6Toast('บันทึกสำเร็จ');if(href)setTimeout(()=>location.href=href,500)}}
function s6AddDoc(){const box=document.getElementById('docRows');if(!box)return;const d=document.createElement('div');d.className='docrow';d.innerHTML='<div class="field"><select><option>เอกสารอื่น</option><option>Transcript</option><option>Course Description</option></select></div><div class="field"><input type="file"></div><span class="badge warn">รอแนบ</span><button class="btn btn-d" onclick="this.parentElement.remove()">ลบ</button>';box.appendChild(d)}
function s6Import(mode){document.getElementById('importResult')?.classList.remove('hide');const x=document.getElementById('importMode');if(x)x.textContent=mode;s6Toast('นำเข้าข้อมูลตัวอย่างแล้ว — กรุณาตรวจสอบก่อนยืนยัน')}
function s6AddMap(){const box=document.getElementById('mappingRows');if(!box)return;const d=document.createElement('div');d.className='maprow';d.innerHTML='<div><b>ENG101 English I</b><br><small>3 หน่วยกิต · B</small></div><div style="text-align:center">→</div><div class="field"><select><option>เลือกวิชาปลายทาง</option><option>01-320-101 ภาษาอังกฤษเพื่อการสื่อสาร</option></select></div><span class="badge warn">รอตรวจ</span><button class="btn btn-d" onclick="this.parentElement.remove()">ลบ</button>';box.appendChild(d)}
function s6Toggle(id){document.getElementById(id)?.classList.toggle('hide')}

function s6FindStudent(){
  const q=(document.getElementById('studentQuery')?.value||'').trim();
  if(!q){s6Toast('กรุณาระบุรหัสนักศึกษา ชื่อ-นามสกุล หรือเลขบัตรประชาชน');return;}
  const card=document.getElementById('studentResult'); if(card) card.classList.remove('hide');
  const hint=document.getElementById('studentSearchHint'); if(hint) hint.textContent='พบข้อมูลจากระบบทะเบียนและประวัตินักศึกษา';
  s6Toast('ค้นหานักศึกษาและดึงข้อมูลล่าสุดแล้ว');
}
function s6ViewFile(name){
  const old=document.querySelector('.s6-modal'); if(old) old.remove();
  const m=document.createElement('div');m.className='s6-modal';
  m.innerHTML='<div class="s6-modal-card"><div class="s6-modal-head"><h3>ตัวอย่างเอกสาร</h3><button type="button" class="s6-modal-close" onclick="this.closest(\'.s6-modal\').remove()">ปิด</button></div><div class="infobox">ไฟล์: <b>'+name+'</b></div><div style="margin-top:14px;padding:28px;border:1px dashed #cbd5e1;border-radius:10px;text-align:center;color:#64748b">Prototype แสดงพื้นที่ Preview เอกสาร / PDF Viewer</div></div>';
  document.body.appendChild(m);
}
function s6GenericAction(label){s6Toast(label+' — Prototype ทำงานแล้ว')}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.s6-page button').forEach(b=>{
    if(b.id==='menuToggle'||b.classList.contains('user-chip'))return;
    if(!b.getAttribute('onclick')&&!b.closest('.s6-modal')){
      b.type='button'; b.addEventListener('click',()=>s6GenericAction((b.textContent||'ดำเนินการ').trim()));
    }
  });
});

// v189 final interactions
function s6ImportFile(mode,input){if(!input.files||!input.files[0])return;s6Import(mode+' · '+input.files[0].name)}
function s6DownloadTemplate(){const csv='course_code,course_name,credits,grade\nACC201,Intermediate Accounting,3,B+\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='credit_transfer_import_template.csv';a.click();URL.revokeObjectURL(a.href);s6Toast('ดาวน์โหลด Template แล้ว')}
function s6AddCourseRow(){const tb=document.querySelector('#courseImportTable tbody');if(!tb)return;const tr=document.createElement('tr');tr.innerHTML='<td contenteditable="true">NEW001</td><td contenteditable="true">ชื่อรายวิชา</td><td contenteditable="true">3</td><td contenteditable="true">C</td><td>เจ้าหน้าที่เพิ่ม</td><td>—</td><td><input type="checkbox"></td>';tb.appendChild(tr);s6Toast('เพิ่มแถวรายวิชาแล้ว')}
function s6ConfirmImport(){if(!document.getElementById('confirmAllRows')?.checked){alert('กรุณายืนยันว่าตรวจข้อมูลครบทุกแถวแล้ว');return}s6Confirm('ยืนยันข้อมูลการศึกษาเดิมและส่ง STEP 3?','7030.html')}
function s6SelectCandidate(btn,code,score){document.querySelectorAll('.candidate').forEach(x=>x.classList.remove('active'));btn.classList.add('active');s6Toast('เลือก '+code+' · คะแนนตามเกณฑ์ '+score+'%')}
function s6OpenReviewDrawer(src,tgt,score,seq){const d=document.getElementById('reviewDrawer');if(!d)return;d.classList.remove('hide');document.getElementById('drawerTitle').textContent=src+' → '+tgt;document.getElementById('drawerSub').textContent='คะแนนตามเกณฑ์ '+score+' · ลำดับ '+seq;window._s6drawer={src,tgt,score,seq};s6DrawerRender('summary')}
function s6CloseReviewDrawer(){document.getElementById('reviewDrawer')?.classList.add('hide')}
function s6DrawerTab(btn,tab){document.querySelectorAll('.drawer-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');s6DrawerRender(tab)}
function s6DrawerRender(tab){const c=document.getElementById('drawerContent');if(!c)return;const d=window._s6drawer||{};const map={summary:'<h3>สรุปการเทียบ</h3><p><b>'+d.src+'</b> เสนอเทียบ <b>'+d.tgt+'</b></p><p>คะแนนความสอดคล้องตามเกณฑ์ '+d.score+' และผลตรวจความต่อเนื่อง: '+d.seq+'</p>',transcript:'<h3>Transcript</h3><div class="infobox">Preview Transcript ต้นฉบับ · รหัสวิชา / เกรด / หน่วยกิต</div>',course:'<h3>Course Description</h3><p>แสดง Course Description ต้นทางและปลายทางพร้อม Version หลักสูตร เพื่อใช้ประกอบการพิจารณา</p>',analysis:'<h3>ผลวิเคราะห์ Rule-based</h3><p>เนื้อหา 40% · Learning Outcomes 25% · หน่วยกิต 15% · ชั่วโมง 10% · คำสำคัญ 10%</p><p>คะแนนเป็นตัวช่วย ไม่ใช่การอนุมัติอัตโนมัติ</p>'};c.innerHTML=map[tab]||map.summary}
function s6ApprovalNext(){const c=document.getElementById('approvalComment');if(c&&!c.value.trim()){alert('กรุณาระบุความเห็นสรุปก่อนยืนยัน');return}let st=parseInt(localStorage.getItem('s6ApprovalStage')||'1');if(st<3){st++;localStorage.setItem('s6ApprovalStage',String(st));s6ApplyApprovalStage();s6Toast('บันทึกผลแล้ว ส่งลำดับ '+st+'/3')}else{localStorage.removeItem('s6ApprovalStage');s6Confirm('อนุมัติผลเทียบโอนขั้นสุดท้ายและส่ง STEP 5?','7050.html')}}
function s6ReturnMapping(){if(confirm('ส่งกลับ STEP 3 เพื่อแก้ Mapping พร้อมบันทึกเหตุผล?'))location.href='7030.html'}
function s6ApplyApprovalStage(){const stages=document.querySelectorAll('#approvalStages .stage');if(!stages.length)return;const st=parseInt(localStorage.getItem('s6ApprovalStage')||'1');stages.forEach((x,i)=>{x.classList.toggle('current',i===st-1);x.querySelector('small').textContent=i<st-1?'พิจารณาแล้ว':(i===st-1?'รอพิจารณา':'รอลำดับก่อนหน้า')});const b=document.getElementById('approvalPrimary');if(b)b.textContent=st===3?'อนุมัติผลเทียบโอน':'ยืนยันผลและส่งลำดับถัดไป'}
function s6CreateCharge(){document.getElementById('paymentPanel')?.classList.remove('hide');s6Toast('สร้าง Charge และส่งระบบการเงินแล้ว')}
document.addEventListener('DOMContentLoaded',s6ApplyApprovalStage);

// v192 STEP 5: SYSTEM 6 calculates; SYSTEM 4 owns billing/payment
function s6FeeCase(){
  const id=new URLSearchParams(location.search).get('id')||'TRF-2569-0018';
  const cases={
    'TRF-2569-0018':{student:'66012345 · กิตติพงษ์ ใจดี',approval:'อนุมัติ 2 วิชา / 6 หน่วยกิต',count:2,fee:1000,exempt:false,sent:true,paid:true,charge:'CHG-6901042',invoice:'INV-6900818'},
    'TRF-2569-0021':{student:'66014567 · พิมพ์ชนก แสงทอง',approval:'อนุมัติ 3 วิชา / 9 หน่วยกิต',count:3,fee:1500,exempt:false,sent:false,paid:false,charge:'—',invoice:'—'},
    'TRF-2569-0024':{student:'66017890 · ธนกฤต ศรีสุข',approval:'อนุมัติ 4 วิชา / 12 หน่วยกิต',count:4,fee:0,exempt:true,sent:false,paid:true,charge:'ไม่ต้องสร้าง',invoice:'ยกเว้นค่าธรรมเนียม'}
  };
  return {id,data:cases[id]||cases['TRF-2569-0018']};
}
function s6RenderStep5(){
  if(!location.pathname.endsWith('7050_detail.html'))return;
  const {id,data:d}=s6FeeCase();
  const set=(i,v)=>{const e=document.getElementById(i);if(e)e.textContent=v};
  set('reqNo',id); set('financeRef',id); set('studentLine',d.student); set('approvalSummary',d.approval);
  set('feeBase',d.count+' วิชา');
  const formula=document.getElementById('feeFormula'), final=document.getElementById('finalTransferBtn'), badge=document.getElementById('syncBadge');
  if(d.exempt){
    set('feeRuleCode','FEE-TRANSFER-EXEMPT'); set('feeRuleText','ยกเว้นค่าธรรมเนียมตามประเภทการเทียบโอน'); set('feeCalcStatus','ยกเว้น');
    if(formula)formula.innerHTML='ผลจาก Master = <strong>ยกเว้นค่าธรรมเนียม (0 บาท)</strong>';
    set('financeDoc','ไม่ต้องสร้างรายการเรียกเก็บ'); set('paymentStatus','ยกเว้นค่าธรรมเนียม');
    set('system4Note','การทำงานอัตโนมัติ: Master ระบุว่ารายการนี้ยกเว้นค่าธรรมเนียม จึงไม่ต้องสร้างรายการเรียกเก็บ และสามารถส่งเข้าคิวบันทึกผลได้');
    if(badge){badge.textContent='ไม่ต้องชำระ';badge.className='badge info'}; if(final)final.disabled=false;
  }else{
    set('feeRuleCode','FEE-TRANSFER-01'); set('feeRuleText','500 บาท / รายวิชาที่อนุมัติ'); set('feeCalcStatus','คำนวณแล้ว');
    if(formula)formula.innerHTML=d.count+' วิชา × 500 บาท = <strong>'+d.fee.toLocaleString('th-TH')+' บาท</strong>';
    if(d.paid){
      set('financeDoc',d.charge+' / '+d.invoice); set('paymentStatus','ชำระแล้ว '+d.fee.toLocaleString('th-TH')+' บาท');
      if(badge){badge.textContent='ชำระเงินเรียบร้อย';badge.className='badge ok'}; if(final)final.disabled=false;
      set('finalHint','ชำระค่าธรรมเนียมครบถ้วนแล้ว สามารถส่งเข้าคิวบันทึกผลได้');
    }else{
      const charge=d.charge!=='—'?d.charge:'CHG-'+id.replace(/\D/g,'').slice(-7);
      const inv=d.invoice!=='—'?d.invoice:'INV-'+id.replace(/\D/g,'').slice(-7);
      set('financeDoc',charge+' / '+inv); set('paymentStatus','รอชำระ '+d.fee.toLocaleString('th-TH')+' บาท');
      if(badge){badge.textContent='รอการชำระ';badge.className='badge warn'}; if(final)final.disabled=true;
      set('finalHint','ยังส่งเข้าคิวบันทึกผลไม่ได้ — รอการชำระค่าธรรมเนียม ระบบจะปรับปรุงสถานะอัตโนมัติ');
    }
  }
}
function s6FinalTransfer(){
  const b=document.getElementById('finalTransferBtn');if(b&&b.disabled){s6Toast('ยังไม่ครบเงื่อนไขการชำระเงิน');return;}
  s6Confirm('ยืนยันเงื่อนไขและส่งคำขอนี้เข้าคิวบันทึกผลใน STEP 6?','7060.html');
}
document.addEventListener('DOMContentLoaded',s6RenderStep5);
