(function(){
function norm(s){return (s||'').toLowerCase().trim()}
document.addEventListener('DOMContentLoaded',function(){
  // Plain tabs that previously had no href/handler: make them interactive and visibly change context.
  document.querySelectorAll('.tabs a.tab:not([href]), .detail-tabs a.tab:not([href])').forEach(function(tab){
    tab.setAttribute('role','button'); tab.setAttribute('tabindex','0');
    function activate(){
      var bar=tab.parentElement; bar.querySelectorAll('a.tab').forEach(x=>x.classList.remove('active')); tab.classList.add('active');
      var main=document.querySelector('main.content'); if(!main)return;
      var box=main.querySelector('.qa-tab-view'); if(!box){box=document.createElement('div');box.className='section qa-tab-view';bar.insertAdjacentElement('afterend',box)}
      var name=tab.textContent.trim();
      var content={
       'ภาพรวม':'สรุปข้อมูลสำคัญและสถานะปัจจุบันของนักศึกษาในรายการนี้',
       'ผลการศึกษา':'ผลการศึกษา หน่วยกิต GPA/GPAX และเงื่อนไขทางวิชาการที่เชื่อมโยงจากระบบประมวลผล',
       'วิทยานิพนธ์':'สถานะหัวข้อ การสอบ การแก้ไข และการรับรองวิทยานิพนธ์/สารนิพนธ์',
       'ภาษา/การสอบ':'สถานะเงื่อนไขภาษาและการสอบระดับบัณฑิตศึกษาที่เกี่ยวข้อง',
       'การเงิน/คำร้อง':'สถานะภาระการเงินและคำร้องบัณฑิตศึกษาที่เกี่ยวข้อง',
       'ประวัติ':'ประวัติการเปลี่ยนแปลงและ Audit Trail ของรายการ',
       'Timeline':'Timeline ความก้าวหน้าตั้งแต่ STEP 1–7',
       'อาจารย์/กรรมการ':'อาจารย์ที่ปรึกษาและคณะกรรมการที่ได้รับการแต่งตั้ง',
       'การสอบ':'รายการสอบ สถานะการสอบ และผลสอบ',
       'คำร้อง':'คำร้องบัณฑิตศึกษาและสถานะการพิจารณา',
       'ผลสำเร็จ':'ผลการตรวจสอบและการอนุมัติสำเร็จการศึกษา',
       'Workflow และ SLA':'กำหนดลำดับ Workflow และกรอบเวลาการดำเนินงาน',
       'การแจ้งเตือน':'กำหนดเหตุการณ์และผู้รับการแจ้งเตือนของ SYSTEM 8',
       'Integration':'กำหนดจุดเชื่อมโยงข้อมูลกับ SYSTEM 1–4 และระบบที่เกี่ยวข้อง',
       'เลขที่เอกสาร':'กำหนดรูปแบบเลขที่เอกสารและเลขอ้างอิงของระบบ'
      }[name]||('รายละเอียด '+name);
      box.innerHTML='<h2>'+name+'</h2><p>'+content+'</p>';
    }
    tab.addEventListener('click',activate); tab.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})
  });
  // Search buttons without handlers: filter the nearest table in prototype.
  document.querySelectorAll('button').forEach(function(btn){
    if(norm(btn.textContent)!=='ค้นหา' || btn.onclick)return;
    btn.addEventListener('click',function(){
      var scope=btn.closest('.section')||document; var inputs=[...scope.querySelectorAll('input,select')];
      var q=inputs.filter(x=>x.tagName==='INPUT').map(x=>norm(x.value)).filter(Boolean).join(' ');
      var rows=scope.querySelectorAll('tbody tr'); rows.forEach(function(r){r.style.display=!q||norm(r.textContent).includes(q)?'':'none'});
    });
  });
  // Confirmation buttons that were visually active but had no behavior.
  [['ยืนยันผ่านคุณสมบัติ','ผ่านคุณสมบัติแล้ว'],['ยืนยันผลผ่านการคัดเลือก','ยืนยันผลแล้ว']].forEach(function(pair){
    document.querySelectorAll('button').forEach(function(btn){if(norm(btn.textContent)===norm(pair[0])&&!btn.onclick){btn.addEventListener('click',function(){btn.textContent=pair[1];btn.disabled=true;btn.classList.remove('btn-primary');btn.classList.add('btn-success');var pill=document.querySelector('.status-pill');if(pill)pill.textContent=pair[1]})}})
  });
});})();