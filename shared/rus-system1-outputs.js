(function(){
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function getMaster(file,name){
 const cfg=(window.RUS_MASTER_GROUPS||{})[file]||[];const d=cfg.find(x=>x[0]===name);if(!d)return null;
 let st={};try{st=JSON.parse(localStorage.getItem('rus-master-group:v8:'+file)||'{}')}catch(e){}
 const rows=(st[name]||d[2].map(r=>({v:r,on:true}))).filter(r=>r.on!==false);return {headers:d[1],rows:rows.map(r=>r.v)};
}
function downloadExcel(){
 const d=getMaster('2172.html','รายวิชากลาง');if(!d)return;
 const html='<html><head><meta charset="utf-8"></head><body><table border="1"><tr>'+d.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr>'+d.rows.map(r=>'<tr>'+r.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</table></body></html>';
 const blob=new Blob(['\ufeff',html],{type:'application/vnd.ms-excel'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Master_รายวิชา_SYSTEM1.xls';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function printDoc(title,body){const w=window.open('','_blank');if(!w)return;w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>'+esc(title)+'</title><style>body{font-family:Arial,"Noto Sans Thai",sans-serif;padding:32px;color:#111}h1{color:#173b73}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #bbb;padding:7px;text-align:left}th{background:#eef4fb}@media print{button{display:none}}</style></head><body><h1>'+esc(title)+'</h1>'+body+'<script>setTimeout(()=>window.print(),300)<\/script></body></html>');w.document.close()}
function curriculumPDF(){
 const c=getMaster('2172.html','หลักสูตรกลาง'),v=getMaster('2172.html','ฉบับหลักสูตร (พ.ศ.)'),cat=getMaster('2172.html','หมวดวิชา'),grp=getMaster('2172.html','กลุ่มวิชา');
 let body='<p>เอกสารสรุปจาก Master หลักสูตรกลางของ SYSTEM 1</p>';
 [[c,'หลักสูตร'],[v,'ฉบับหลักสูตร (พ.ศ.)'],[cat,'หมวดวิชา'],[grp,'กลุ่มวิชา']].forEach(([d,t])=>{if(!d)return;body+='<h2>'+esc(t)+'</h2><table><tr>'+d.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr>'+d.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</table>'});printDoc('โครงสร้างหลักสูตร SYSTEM 1',body)
}
function calendarPDF(){
 const y=getMaster('2173.html','ปีการศึกษา'),s=getMaster('2173.html','ภาคเรียน'),a=getMaster('2173.html','ประเภทกิจกรรมปฏิทิน');
 let body='<p>ข้อมูลอ้างอิงจาก Master ปีการศึกษา ภาคเรียน และประเภทกิจกรรม</p>';
 [[y,'ปีการศึกษา'],[s,'ภาคเรียน'],[a,'ประเภทกิจกรรมปฏิทิน']].forEach(([d,t])=>{if(!d)return;body+='<h2>'+esc(t)+'</h2><table><tr>'+d.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr>'+d.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</table>'});printDoc('ปฏิทินการศึกษา SYSTEM 1',body)
}
function studentGuide(){
 const steps=['ตรวจสิทธิ์และสถานภาพนักศึกษา','ตรวจแผนการเรียนและรายวิชาที่เปิด','เลือก Section / รายวิชาต่างศูนย์ตามสิทธิ์','ระบบตรวจ Prerequisite / Corequisite / Credit Limit','ส่งอาจารย์ที่ปรึกษาอนุมัติเมื่อเงื่อนไขกำหนด','ยืนยันการลงทะเบียน','พิมพ์ใบลงทะเบียนและ Pay-In / QR','ชำระเงินภายในกำหนด','ตรวจสอบสถานะการชำระเงิน','ดาวน์โหลด/พิมพ์ใบเสร็จ','ดำเนินการเพิ่ม-ถอน-เปลี่ยนกลุ่มตามปฏิทิน'];
 printDoc('คู่มือนักศึกษา — การลงทะเบียนเรียน','<p>คู่มือฉบับ Prototype อ้างอิง Workflow ของ SYSTEM 1</p><ol>'+steps.map(x=>'<li style="margin:10px 0">'+esc(x)+'</li>').join('')+'</ol><p><b>หมายเหตุ:</b> วันเวลาและเงื่อนไขให้ยึดข้อมูลจากปฏิทินการศึกษาและ Master Data ที่มหาวิทยาลัยกำหนด</p>')
}
function addCard(){if(location.pathname.split('/').pop()!=='2150_curriculum.html')return;const main=document.querySelector('main.content');if(!main||document.getElementById('sys1Outputs'))return;const card=document.createElement('div');card.id='sys1Outputs';card.className='card';card.innerHTML='<div class="card-head"><div class="ct"><span class="dot"></span><h2>เอกสารส่งออกตาม Comment กรรมการ</h2></div><span class="meta">PDF / Excel</span></div><div style="padding:18px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" data-o="curr">โครงสร้างหลักสูตร PDF</button><button class="btn btn-outline" data-o="course">รายวิชา Excel</button><button class="btn btn-outline" data-o="cal">ปฏิทินการศึกษา PDF</button><button class="btn btn-outline" data-o="guide">คู่มือนักศึกษา PDF</button></div>';
 main.appendChild(card);card.addEventListener('click',e=>{const x=e.target.dataset.o;if(x==='curr')curriculumPDF();if(x==='course')downloadExcel();if(x==='cal')calendarPDF();if(x==='guide')studentGuide()})}
window.RUS_SYS1_OUTPUTS={downloadExcel,curriculumPDF,calendarPDF,studentGuide};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addCard);else addCard();
})();
