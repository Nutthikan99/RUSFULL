// menuToggle is handled centrally by rus-nav.js to avoid duplicate toggles.
function openModal(t,h){document.getElementById('modalTitle').textContent=t;document.getElementById('modalBody').innerHTML=h;document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.getElementById('modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
function toast(m){const old=document.querySelector('.toast-msg');if(old)old.remove();const d=document.createElement('div');d.className='toast-msg';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.classList.add('show'),20);setTimeout(()=>{d.classList.remove('show');setTimeout(()=>d.remove(),250)},1800)}
function detailModal(title,body=''){return `<div class="notice">${body||'แสดงรายละเอียดรายการและข้อมูลที่เกี่ยวข้อง'}</div><div class="form-grid"><div class="field"><label>ผู้รับผิดชอบ</label><input value="เจ้าหน้าที่รับสมัคร" readonly></div><div class="field"><label>วันที่ปรับปรุงล่าสุด</label><input value="17 ส.ค. 2569 01:45 น." readonly></div><div class="field full"><label>หมายเหตุ</label><textarea rows="3" placeholder="ระบุหมายเหตุเพิ่มเติม"></textarea></div></div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ปิด</button><button class="btn btn-primary" onclick="toast('บันทึกข้อมูลแล้ว');closeModal()">บันทึก</button></div>`}
function reviewModal(name){return `<div class="notice">ตรวจสอบ ${name}</div><div class="checklist"><label><input type="checkbox" checked> ข้อมูลส่วนบุคคลครบถ้วน</label><label><input type="checkbox" checked> คุณวุฒิและ GPA ตรงตามเกณฑ์</label><label><input type="checkbox"> เอกสารหลักฐานครบถ้วน</label></div><div class="field"><label>ผลการตรวจ</label><select id="reviewResult"><option>Pass</option><option selected>Conditional</option><option>Fail</option></select></div><div class="field"><label>ความเห็น</label><textarea rows="3">รอเอกสารฉบับสมบูรณ์</textarea></div><div class="actions"><button class="btn btn-warn" onclick="toast('ส่งกลับให้ผู้สมัครแก้ไขแล้ว');closeModal()">ส่งกลับแก้ไข</button><button class="btn btn-success" onclick="toast('บันทึกผลการตรวจแล้ว');closeModal()">บันทึกผล</button></div>`}
function paymentModal(ref){return `<div class="notice">Payment Reference: <b>${ref}</b></div><div class="form-grid"><div class="field"><label>ยอดชำระ</label><input value="500.00 บาท" readonly></div><div class="field"><label>ช่องทาง</label><select><option>QR Payment</option><option>Pay-In</option><option>Bank</option></select></div><div class="field full"><label>หลักฐานการชำระ</label><input type="file" accept=".pdf,.jpg,.jpeg,.png"></div></div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ปิด</button><button class="btn btn-success" onclick="toast('ยืนยันการชำระแล้ว');closeModal()">ยืนยันการชำระ</button></div>`}
function confirmAction(msg){if(confirm(msg)){toast('ดำเนินการเรียบร้อย')}}

function applicantPaymentModal(appNo,name,round,program,payRef,ref1,ref2,amount,status){
  const paid=status==='ชำระสำเร็จ';
  const review=status==='ต้องตรวจสอบ';
  const tx = paid ? 'TXN-2569-0811-004812' : review ? 'TXN-PENDING-000126' : 'ยังไม่มี Transaction';
  const paidAt = paid ? '11 ส.ค. 2569 14:32 น.' : review ? '12 ส.ค. 2569 10:18 น.' : '-';
  const channel = paid ? 'PromptPay QR' : review ? 'Payment Gateway' : 'ยังไม่ชำระ';
  return `<div class="notice"><b>${appNo} — ${name}</b><br>${round} · ${program} · <b>${amount} บาท</b></div>
  <div class="tabbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
    <button class="btn btn-primary btn-sm" onclick="paymentTab('pay-info')">ข้อมูลการชำระ</button>
    <button class="btn btn-secondary btn-sm" onclick="paymentTab('pay-txn')">Transaction</button>
    <button class="btn btn-secondary btn-sm" onclick="paymentTab('pay-history')">ประวัติ</button>
  </div>
  <div id="pay-info" class="payment-pane">
    <div class="form-grid">
      <div class="field"><label>Payment Reference</label><input value="${payRef}" readonly></div>
      <div class="field"><label>ยอดที่ต้องชำระ</label><input value="${amount} บาท" readonly></div>
      <div class="field"><label>Ref.1</label><input value="${ref1}" readonly></div>
      <div class="field"><label>Ref.2</label><input value="${ref2}" readonly></div>
      <div class="field"><label>วันครบกำหนด</label><input value="20 ส.ค. 2569" readonly></div>
      <div class="field"><label>สถานะล่าสุด</label><input value="${status}" readonly></div>
      <div class="field full"><label>ช่องทางที่รองรับ</label><input value="PromptPay QR / ธนาคาร / Counter Service / Payment Gateway" readonly></div>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="toast('เปิดใบแจ้งหนี้ ${payRef}')">ดูใบแจ้งหนี้</button>
      ${paid?`<button class="btn btn-success" onclick="toast('เปิด e-Receipt ของ ${payRef}')">ดู e-Receipt</button>`:''}
      ${review?`<button class="btn btn-primary" onclick="toast('เปิดรายการเพื่อตรวจสอบและกระทบยอด')">ตรวจสอบรายการ</button>`:''}
    </div>
  </div>
  <div id="pay-txn" class="payment-pane" style="display:none">
    <div class="form-grid">
      <div class="field"><label>Transaction ID</label><input value="${tx}" readonly></div>
      <div class="field"><label>วันเวลา Transaction</label><input value="${paidAt}" readonly></div>
      <div class="field"><label>ช่องทาง</label><input value="${channel}" readonly></div>
      <div class="field"><label>ยอด Transaction</label><input value="${paid||review?amount+' บาท':'-'}" readonly></div>
      <div class="field"><label>สถานะ Gateway/ธนาคาร</label><input value="${paid?'SUCCESS':review?'PENDING REVIEW':'WAITING'}" readonly></div>
      <div class="field"><label>เลขอ้างอิงธนาคาร</label><input value="${paid?'BNK-881204812':review?'GW-CHK-126':'-'}" readonly></div>
    </div>
  </div>
  <div id="pay-history" class="payment-pane" style="display:none">
    <div class="table-wrap"><table><tr><th>วันเวลา</th><th>เหตุการณ์</th><th>สถานะ</th><th>ผู้ดำเนินการ</th></tr>
      <tr><td>10 ส.ค. 2569 09:00</td><td>สร้าง Invoice และ Payment Reference</td><td>สำเร็จ</td><td>ระบบ</td></tr>
      <tr><td>${paidAt}</td><td>${paid?'รับผลการชำระจากช่องทางกลาง':review?'รับ Transaction รอตรวจสอบ':'ยังไม่พบการชำระ'}</td><td>${status}</td><td>ระบบ</td></tr>
    </table></div>
  </div>
  <div class="actions"><button class="btn btn-secondary" onclick="location.href='10020_detail.html?app=${encodeURIComponent(appNo)}'">ดูข้อมูลผู้สมัคร</button><button class="btn btn-secondary" onclick="closeModal()">ปิด</button></div>`;
}
function paymentTab(id){document.querySelectorAll('.payment-pane').forEach(x=>x.style.display='none');const el=document.getElementById(id);if(el)el.style.display='block';}
function filterPaymentTable(){
 const r=document.getElementById('roundFilter')?.value||''; const st=document.getElementById('payStatus')?.value||''; const q=(document.getElementById('paySearch')?.value||'').trim().toLowerCase();
 document.querySelectorAll('#paymentTable tr[data-search]').forEach(row=>{const okR=r==='ทุกรอบรับสมัคร'||row.dataset.round===r; const okS=st==='ทุกสถานะการชำระ'||row.dataset.status===st; const okQ=!q||row.dataset.search.toLowerCase().includes(q); row.style.display=okR&&okS&&okQ?'':'none';});
 toast('กรองรายการชำระเงินแล้ว');
}
function clearPaymentFilter(){const r=document.getElementById('roundFilter'),st=document.getElementById('payStatus'),q=document.getElementById('paySearch'); if(r)r.selectedIndex=0;if(st)st.selectedIndex=0;if(q)q.value='';document.querySelectorAll('#paymentTable tr[data-search]').forEach(x=>x.style.display='');toast('ล้างตัวกรองแล้ว');}


function admissionRoundModal(mode='create',d={}){
 const v=(k,x='')=>d[k]??x; const edit=mode==='edit';
 return `<div class="notice">${edit?'แก้ไขข้อมูลรอบรับสมัคร โดยข้อมูลนี้สัมพันธ์กับรายการที่เลือก':'สร้างรอบรับสมัครใหม่'}</div>
 <div class="form-grid">
  <div class="field"><label>รหัสรอบ</label><input value="${v('code',edit?'':'สร้างอัตโนมัติ')}" ${edit?'readonly':''}></div>
  <div class="field"><label>ปีการศึกษา</label><select><option>2569</option><option>2570</option></select></div>
  <div class="field full"><label>ชื่อรอบรับสมัคร</label><input value="${v('name')}" placeholder="เช่น Portfolio รอบ 1"></div>
  <div class="field"><label>ประเภทการรับ</label><select><option ${v('type')==='Portfolio'?'selected':''}>Portfolio</option><option ${v('type')==='รับตรง'?'selected':''}>รับตรง</option></select></div>
  <div class="field"><label>ระดับการศึกษา</label><select><option ${v('level').includes('ปริญญาตรี')?'selected':''}>ปริญญาตรี</option><option ${v('level').includes('ปวส')?'selected':''}>ปวส.</option><option ${v('level').includes('ป.โท')?'selected':''}>ปริญญาโท</option><option ${v('level').includes('ป.เอก')?'selected':''}>ปริญญาเอก</option><option>หลายระดับ</option></select></div>
  <div class="field"><label>วันที่เปิดรับสมัคร</label><input type="date" value="${v('start')}"></div>
  <div class="field"><label>วันที่ปิดรับสมัคร</label><input type="date" value="${v('end')}"></div>
  <div class="field"><label>จำนวนหลักสูตร</label><input type="number" value="${v('programs','0')}" readonly></div>
  <div class="field"><label>จำนวนรับรวม</label><input type="number" value="${v('capacity','0')}" readonly></div>
  <div class="field"><label>สถานะ</label><select><option ${v('status')==='เตรียมเปิด'?'selected':''}>เตรียมเปิด</option><option ${v('status')==='เปิดรับ'?'selected':''}>เปิดรับ</option><option>ปิดรับ</option></select></div>
  <div class="field full"><label>หมายเหตุ</label><textarea rows="2" placeholder="หมายเหตุของรอบรับสมัคร"></textarea></div>
 </div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('${edit?'บันทึกการแก้ไขรอบรับสมัครแล้ว':'สร้างรอบรับสมัครแล้ว'}');closeModal()">บันทึก</button></div>`;
}
function admissionCriteriaModal(d={}){
 const v=(k,x='')=>d[k]??x;
 return `<div class="form-grid">
 <div class="field"><label>รอบรับสมัคร</label><select><option>${v('round','ADM-69-PF1')}</option><option>ADM-69-DIR1</option><option>GRAD-69-1</option></select></div>
 <div class="field"><label>หลักสูตร</label><select><option>${v('program','เลือกจาก Master SYSTEM 1')}</option><option>บริหารธุรกิจบัณฑิต</option><option>วิศวกรรมศาสตรบัณฑิต</option></select></div>
 <div class="field"><label>คุณวุฒิที่รับ</label><input value="${v('qualification')}" placeholder="เช่น ม.6 / ปวช."></div>
 <div class="field"><label>GPA ขั้นต่ำ</label><input type="number" step="0.01" value="${v('gpa','2.50')}"></div>
 <div class="field full"><label>เงื่อนไขเพิ่มเติม</label><textarea rows="3">${v('condition')}</textarea></div></div>
 <div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('บันทึกเกณฑ์การรับแล้ว');closeModal()">บันทึก</button></div>`;
}
function roundProgramModal(d={}){
 const v=(k,x='')=>d[k]??x;
 return `<div class="notice">คณะ/สาขา/หลักสูตรเลือกจาก Master กลางและ Master SYSTEM 1</div><div class="form-grid">
 <div class="field"><label>รอบรับสมัคร</label><select><option>ADM-69-PF1 — Portfolio รอบ 1</option><option>ADM-69-DIR1 — รับตรง รอบ 1</option></select></div>
 <div class="field"><label>คณะ</label><select><option>${v('faculty','เลือกคณะ')}</option><option>บริหารธุรกิจ</option><option>วิศวกรรมศาสตร์</option></select></div>
 <div class="field"><label>สาขา</label><select><option>${v('branch','เลือกสาขา')}</option></select></div>
 <div class="field"><label>หลักสูตร</label><select><option>${v('program','เลือกหลักสูตร')}</option></select></div>
 <div class="field"><label>ระดับ</label><input value="${v('level','ปริญญาตรี')}" readonly></div>
 <div class="field"><label>จำนวนรับ</label><input type="number" min="1" value="${v('capacity','50')}"></div></div>
 <div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('บันทึกหลักสูตรและจำนวนรับแล้ว');closeModal()">บันทึก</button></div>`;
}
function filterRoundTable(){const q=(document.getElementById('roundSearch')?.value||'').trim().toLowerCase();document.querySelectorAll('#roundTable tr[data-search]').forEach(r=>r.style.display=!q||r.dataset.search.toLowerCase().includes(q)?'':'none');toast('กรองรายการแล้ว')}

function roundDocumentModal(name=''){
 return `<div class="form-grid"><div class="field"><label>ประเภทเอกสาร</label><select><option ${name==='Transcript'?'selected':''}>Transcript</option><option ${name==='Portfolio'?'selected':''}>Portfolio</option><option>Passport</option><option>หลักฐานอื่น</option></select></div><div class="field"><label>ใช้กับ</label><select><option>ผู้สมัครทุกคน</option><option>เฉพาะรอบนี้</option><option>เฉพาะหลักสูตร</option></select></div><div class="field"><label>บังคับ</label><select><option>บังคับ</option><option>ไม่บังคับ</option><option>ตามเงื่อนไข</option></select></div><div class="field"><label>รูปแบบไฟล์</label><input value="PDF/JPG"></div><div class="field full"><label>หมายเหตุ</label><textarea rows="2"></textarea></div></div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('บันทึกเงื่อนไขเอกสารแล้ว');closeModal()">บันทึก</button></div>`;
}
function roundFeeModal(){
 return `<div class="notice">กำหนด Fee Rule ของรอบนี้ โดยช่องทางการชำระอ้างอิง Master กลาง SM6</div><div class="form-grid"><div class="field"><label>กฎค่าธรรมเนียม</label><select><option>FEE-ADM-UG-01 — ค่าสมัครปริญญาตรี</option></select></div><div class="field"><label>จำนวนเงิน</label><input type="number" value="500"></div><div class="field"><label>สกุลเงิน</label><input value="THB" readonly></div><div class="field"><label>สถานะ</label><select><option>ใช้งาน</option><option>ระงับ</option></select></div></div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('บันทึกค่าธรรมเนียมแล้ว');closeModal()">บันทึก</button></div>`;
}

function applicantFormModal(mode='create',d={}){
 const v=(k,x='')=>d[k]??x; const edit=mode==='edit';
 return `<div class="notice"><b>${edit?'แก้ไขใบสมัคร '+v('appNo'):'บันทึกใบสมัคร'}</b><br>กรอกเฉพาะข้อมูลจำเป็นก่อน ระบบจะแสดงช่องและเอกสารตามระดับ/คุณวุฒิ/รอบรับสมัครอัตโนมัติ</div>
 <div class="tabbar" style="display:flex;gap:8px;align-items:center;margin:0 0 16px">
   <span class="pill ok" id="af-step-label">1/3 รอบและหลักสูตร</span><span style="color:#718096">→</span><span>ข้อมูลผู้สมัคร</span><span style="color:#718096">→</span><span>การศึกษาและเอกสาร</span>
 </div>
 <div class="app-form-pane" id="af-1">
  <div class="form-grid">
   <div class="field"><label>รอบรับสมัคร *</label><select id="afRound" onchange="updateApplicantDynamicForm()"><option>ADM-69-PF1 — Portfolio รอบ 1</option><option>ADM-69-DIR1 — รับตรง รอบ 1</option><option>GRAD-69-1 — บัณฑิตศึกษา</option></select></div>
   <div class="field"><label>ระดับการศึกษา *</label><select id="afLevel" onchange="updateApplicantDynamicForm()"><option>ปริญญาตรี</option><option>ปวช.</option><option>ปวส.</option><option>ปริญญาโท</option><option>ปริญญาเอก</option></select></div>
   <div class="field"><label>คณะ *</label><select id="afFaculty" onchange="toast('โหลดสาขาจาก Master กลางแล้ว')"><option>บริหารธุรกิจ</option><option>วิศวกรรมศาสตร์</option></select></div>
   <div class="field"><label>สาขา / หลักสูตร *</label><select><option>การจัดการ — บริหารธุรกิจบัณฑิต</option><option>การบัญชี — บัญชีบัณฑิต</option></select></div>
  </div><div class="notice" id="afRuleHint">Portfolio · ปริญญาตรี — ระบบจะตรวจคุณวุฒิ/GPA และ Checklist ตามเกณฑ์ของรอบ</div>
 </div>
 <div class="app-form-pane" id="af-2" style="display:none">
  <div class="form-grid">
   <div class="field"><label>เลขประจำตัวประชาชน / Passport *</label><input value="${v('citizen','1103700XXXXXX')}"></div>
   <div class="field"><label>คำนำหน้า *</label><select><option>นาย</option><option selected>นางสาว</option><option>นาง</option></select></div>
   <div class="field"><label>ชื่อ *</label><input value="${v('first','กมลชนก')}"></div><div class="field"><label>นามสกุล *</label><input value="${v('last','วัฒนชัย')}"></div>
   <div class="field"><label>วันเกิด *</label><input type="date" value="${v('dob','2007-04-18')}"></div><div class="field"><label>สัญชาติ *</label><input value="${v('nationality','ไทย')}"></div>
   <div class="field"><label>โทรศัพท์ *</label><input value="${v('phone','08X-XXX-XXXX')}"></div><div class="field"><label>Email *</label><input type="email" value="${v('email','applicant@example.com')}"></div>
   <div class="field full"><label>ที่อยู่ปัจจุบัน *</label><textarea rows="2">${v('address','พระนครศรีอยุธยา')}</textarea></div>
  </div>
  <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600;color:#174a8b">ข้อมูลบิดา / มารดา / ผู้ปกครอง</summary><div class="form-grid" style="margin-top:12px"><div class="field"><label>ชื่อบิดา</label><input></div><div class="field"><label>ชื่อมารดา</label><input></div><div class="field"><label>ชื่อผู้ปกครอง</label><input></div><div class="field"><label>โทรศัพท์ผู้ปกครอง</label><input></div></div></details>
 </div>
 <div class="app-form-pane" id="af-3" style="display:none">
  <div class="form-grid">
   <div class="field"><label>คุณวุฒิเดิม *</label><select id="afQualification" onchange="updateApplicantDynamicForm()"><option>ม.6</option><option>ม.3</option><option>ปวช.</option><option>ปวส.</option><option>ปริญญาตรี</option></select></div>
   <div class="field"><label>สถานศึกษาเดิม *</label><input value="${v('school','โรงเรียนตัวอย่าง')}"></div>
   <div class="field"><label>ปีที่จบ *</label><input value="${v('gradYear','2568')}"></div><div class="field"><label>GPA *</label><input type="number" step="0.01" value="${v('gpa','3.42')}"></div>
  </div>
  <div class="notice" id="afEligibility">เกณฑ์รอบนี้: ม.6 / ปวช. · GPA ขั้นต่ำ 2.50</div>
  <div class="checklist" id="afDocs"><label><input type="checkbox" checked> รูปถ่ายผู้สมัคร</label><label><input type="checkbox" checked> Transcript</label><label><input type="checkbox"> Portfolio</label><label><input type="checkbox"> บัตรประชาชน / Passport</label></div>
  <div class="field"><label>แนบเอกสาร</label><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"></div>
 </div>
 <div class="actions"><button class="btn btn-secondary" id="afPrev" style="display:none" onclick="applicantFormStep(-1)">ย้อนกลับ</button><button class="btn btn-primary" id="afNext" onclick="applicantFormStep(1)">ถัดไป</button><button class="btn btn-success" id="afSave" style="display:none" onclick="toast('${edit?'บันทึกการแก้ไขใบสมัครแล้ว':'บันทึกใบสมัครแล้ว'}');closeModal()">${edit?'บันทึกการแก้ไข':'บันทึกใบสมัคร'}</button></div>`;
}
let applicantFormCurrentStep=1;
function applicantFormStep(delta){
 applicantFormCurrentStep=Math.max(1,Math.min(3,applicantFormCurrentStep+delta));
 document.querySelectorAll('.app-form-pane').forEach(x=>x.style.display='none');
 const pane=document.getElementById('af-'+applicantFormCurrentStep); if(pane)pane.style.display='block';
 const names=['','รอบและหลักสูตร','ข้อมูลผู้สมัคร','การศึกษาและเอกสาร'];
 const lab=document.getElementById('af-step-label'); if(lab)lab.textContent=applicantFormCurrentStep+'/3 '+names[applicantFormCurrentStep];
 const prev=document.getElementById('afPrev'),next=document.getElementById('afNext'),save=document.getElementById('afSave');
 if(prev)prev.style.display=applicantFormCurrentStep===1?'none':''; if(next)next.style.display=applicantFormCurrentStep===3?'none':''; if(save)save.style.display=applicantFormCurrentStep===3?'':'';
}
function updateApplicantDynamicForm(){
 const level=document.getElementById('afLevel')?.value||'ปริญญาตรี'; const round=document.getElementById('afRound')?.value||''; const q=document.getElementById('afQualification')?.value||'ม.6';
 const hint=document.getElementById('afRuleHint'); if(hint)hint.textContent=`${round.split('—').pop().trim()} · ${level} — โหลดเกณฑ์และ Checklist จากรอบรับสมัครแล้ว`;
 const elig=document.getElementById('afEligibility'); if(elig)elig.textContent=level.includes('โท')||level.includes('เอก')?'เกณฑ์บัณฑิตศึกษา: ตรวจวุฒิปริญญาตรี / GPA ตามหลักสูตร':'เกณฑ์รอบนี้: '+q+' · ตรวจ GPA ตามหลักสูตร';
}

function reviewerAssignmentModal(){return `<div class="form-grid"><div class="field"><label>บทบาท</label><select><option>ผู้คัดเลือก</option><option>กรรมการพิจารณา</option><option>ประธานกรรมการ</option></select></div><div class="field"><label>บุคลากร</label><select><option>ผศ.ดร.สมชาย ตัวอย่าง</option><option>อ.กิตติพงษ์ ตัวอย่าง</option><option>นางสาวอรทัย ตัวอย่าง</option></select></div><div class="field full"><label>ขอบเขตการพิจารณา</label><select><option>ทุกหลักสูตรในรอบ</option><option>เฉพาะหลักสูตรที่รับผิดชอบ</option></select></div></div><div class="actions"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="toast('เพิ่มผู้คัดเลือกแล้ว');closeModal()">บันทึก</button></div>`}


// v119 STEP 8 monitoring list
function filterStep8(){
  const st=document.getElementById('s8Status')?.value||'ทุกสถานะ';
  const q=(document.getElementById('s8Search')?.value||'').trim().toLowerCase();
  document.querySelectorAll('#step8Table tr[data-search]').forEach(r=>{
    const okS=st==='ทุกสถานะ'||r.dataset.status===st;
    const okQ=!q||r.dataset.search.toLowerCase().includes(q);
    r.style.display=okS&&okQ?'':'none';
  });
}
function clearStep8(){
  const st=document.getElementById('s8Status'),q=document.getElementById('s8Search');
  if(st)st.selectedIndex=0;if(q)q.value='';
  document.querySelectorAll('#step8Table tr[data-search]').forEach(r=>r.style.display='');
}


// v120 shared interactive actions -------------------------------------------------
function ensureActionModal(){
  let m=document.getElementById('actionModalV120');
  if(m)return m;
  m=document.createElement('div');m.id='actionModalV120';m.className='modal';
  m.innerHTML='<div class="modal-box" style="width:min(860px,94vw)"><div class="modal-h"><b id="actionModalTitleV120">รายละเอียด</b><button class="x" onclick="closeActionModal()">×</button></div><div class="modal-b" id="actionModalBodyV120"></div></div>';
  document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)closeActionModal()});return m;
}
function closeActionModal(){document.getElementById('actionModalV120')?.classList.remove('open')}
function showActionModal(title,html){const m=ensureActionModal();document.getElementById('actionModalTitleV120').textContent=title;document.getElementById('actionModalBodyV120').innerHTML=html;m.classList.add('open')}
function docPreview(title,meta={}){
 const rows=Object.entries(meta).map(([k,v])=>`<tr><th style="width:190px">${k}</th><td>${v}</td></tr>`).join('');
 showActionModal(title,`<div class="notice"><b>${title}</b><br>ตัวอย่างเอกสารจากข้อมูล Prototype</div><div class="table-wrap"><table>${rows}</table></div><div class="actions"><button class="btn btn-secondary" onclick="closeActionModal()">ปิด</button><button class="btn btn-primary" onclick="printPrototypeDoc('${String(title).replace(/'/g,"\\'")}')">พิมพ์ / บันทึกเป็น PDF</button></div>`)
}
function printPrototypeDoc(title){const body=document.getElementById('actionModalBodyV120')?.innerHTML||'';const w=window.open('','_blank');if(!w){alert('Browser ปิดกั้นหน้าต่างพิมพ์ กรุณาอนุญาต Pop-up');return}w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,'Noto Sans Thai',sans-serif;padding:32px;color:#111}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:9px;text-align:left}.actions,button{display:none}</style></head><body><h2>${title}</h2>${body}</body></html>`);w.document.close();w.focus();setTimeout(()=>w.print(),250)}

function openInvoicePage(app='A69000124'){
  const url='10030_invoice.html?app='+encodeURIComponent(app);
  const w=window.open(url,'_blank');
  if(!w) location.href=url;
}
function openInvoice(app='A69000124',invoice='INV-69-000124',payRef='PAY-69-000124',amount='500.00 บาท'){docPreview('ใบแจ้งหนี้ค่าสมัคร',{ 'เลขใบสมัคร':app,'เลขที่ใบแจ้งหนี้':invoice,'Payment Reference':payRef,'ยอดที่ต้องชำระ':amount,'วันครบกำหนด':'20 ส.ค. 2569','สถานะ':'รอชำระ' })}
function openReceipt(app='A69000125',receipt='RC-69-000125',amount='500.00 บาท'){docPreview('ใบเสร็จรับเงินอิเล็กทรอนิกส์ (e-Receipt)',{'เลขใบสมัคร':app,'เลขที่ใบเสร็จ':receipt,'ยอดชำระ':amount,'ช่องทาง':'PromptPay QR','วันเวลา':'18 ส.ค. 2569 09:42','สถานะ':'ชำระสำเร็จ'})}
function openApplicantFile(name,app='A69000124',state='แนบแล้ว'){docPreview(name,{'เลขใบสมัคร':app,'ประเภทเอกสาร':name,'สถานะ':state,'ไฟล์ตัวอย่าง':name.replace(/\s+/g,'_')+'.pdf','ตรวจสอบล่าสุด':'18 ส.ค. 2569'})}
function openEnrollmentReceipt(app='A69000124'){docPreview('หลักฐาน/ใบเสร็จค่าขึ้นทะเบียน',{'เลขใบสมัคร':app,'Payment Reference':'ENR-'+app.replace('A',''),'ยอด':'6,500.00 บาท','Transaction ID':'TXN-25690818-'+app.slice(-3),'ช่องทาง':'PromptPay QR','สถานะ':'ชำระแล้ว'})}
function exportTableExcel(table,title='export'){const t=typeof table==='string'?document.querySelector(table):table;if(!t){alert('ไม่พบตารางสำหรับส่งออก');return}const html='<html><head><meta charset="utf-8"></head><body>'+t.outerHTML+'</body></html>';const b=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=title+'.xls';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('ส่งออก Excel แล้ว')}
function markFollowup(btn,msg='ส่งแจ้งเตือนแล้ว'){if(!confirm('ยืนยันส่งการแจ้งเตือน?'))return;btn.textContent='แจ้งแล้ว';btn.disabled=true;toast(msg)}
function showUserProfile(){showActionModal('ข้อมูลผู้ใช้งาน','<div class="form-grid"><div class="field"><label>ชื่อผู้ใช้งาน</label><div>นางสาวกมลชนก วัฒนชัย</div></div><div class="field"><label>บทบาท</label><div>เจ้าหน้าที่รับสมัคร · SYSTEM 9</div></div><div class="field"><label>หน่วยงาน</label><div>งานรับสมัครและทะเบียน</div></div><div class="field"><label>สถานะ</label><span class="pill ok">ใช้งาน</span></div></div><div class="actions"><span></span><button class="btn btn-secondary" onclick="closeActionModal()">ปิด</button></div>')}

function syncPaymentStatus(btn){const old=btn.textContent;btn.disabled=true;btn.textContent='กำลังอัปเดต...';setTimeout(()=>{btn.disabled=false;btn.textContent=old;showActionModal('อัปเดตสถานะการชำระ','<div class="notice">ซิงก์สถานะจากช่องทางกลางสำเร็จ</div><div class="table-wrap"><table><tr><th>รายการ</th><th>ผล</th></tr><tr><td>ตรวจสอบล่าสุด</td><td>18 ส.ค. 2569 11:58 น.</td></tr><tr><td>รายการเปลี่ยนสถานะ</td><td>3 รายการ</td></tr><tr><td>รายการต้องตรวจสอบ</td><td>42 รายการ</td></tr></table></div><div class="actions"><span></span><button class="btn btn-secondary" onclick="closeActionModal()">ปิด</button></div>')},450)}
