
/* ============================================================
   MODULAR FOLDER ROUTER
   Each prototype system lives in /systemN/.
   Shared navigation remains in /shared/ and does not need to be
   copied into or edited inside individual system folders.
   ============================================================ */
function RUS_RESOLVE_HREF(href){
  if(!href || /^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) return href;

  const path=location.pathname.replace(/\\/g,'/');
  const inSystemMaster=/\/system[1-9]\/master\//i.test(path);
  const inSystem=/\/system[1-9]\//i.test(path);
  const inCentralMaster=/\/master\//i.test(path) && !inSystemMaster;
  const inLegacy=/\/legacy\//i.test(path);
  // ระยะจากหน้าปัจจุบันกลับไปยัง root ของ prototype
  const rootPrefix=inSystemMaster?'../../':((inSystem||inCentralMaster||inLegacy)?'../':'');

  if(String(href).startsWith('@root/')) return rootPrefix+String(href).slice(6);

  const m=String(href).match(/^([^?#]+)(.*)$/);
  const raw=m?m[1]:href;
  const suffix=m?m[2]:'';
  const file=raw.split('/').pop();
  if(!/\.html$/i.test(file)) return href;

  const rootFile=/^(?:main|login|logout|reg-student)\.html$/i.test(file);
  if(rootFile) return rootPrefix+file+suffix;

  let folder='';
  const num=parseInt((file.match(/^(\d+)/)||[])[1]||'0',10);
  if(num>=1000&&num<2000) folder='legacy';
  else if(num>=2000&&num<3000) folder='system1';
  else if(num>=3000&&num<4000) folder='system2';
  else if(num>=4000&&num<5000) folder='system3';
  else if(num>=5000&&num<6000) folder='system4';
  else if(num>=6000&&num<7000) folder='system5';
  else if(num>=7000&&num<8000) folder='system6';
  else if(num>=8000&&num<9000) folder='system7';
  else if(num>=9000&&num<10000) folder='system8';
  else if(num>=10000&&num<11000) folder='system9';
  if(!folder) return href;

  const currentFolder=(path.match(/\/(system[1-9]|legacy)\//i)||[])[1]||'';
  // หน้า Master ที่ซ้อนใน /systemN/master/ ต้องถอยขึ้น 1 ชั้นก่อนเข้าหน้าของระบบเดียวกัน
  if(inSystemMaster && currentFolder.toLowerCase()===folder.toLowerCase()) return '../'+file+suffix;
  // หน้าปกติภายในระบบเดียวกันใช้ไฟล์ระดับเดียวกัน
  if(!inSystemMaster && currentFolder.toLowerCase()===folder.toLowerCase()) return file+suffix;
  // ข้ามระบบหรือมาจาก Master กลาง: กลับ root ก่อนแล้วเข้าระบบปลายทาง
  return rootPrefix+folder+'/'+file+suffix;
}

/* ============================================================
   RUS Navigation — เมนูด้านซ้าย (แหล่งข้อมูลกลาง)
   ระบบทะเบียนและประมวลผล มทร.สุวรรณภูมิ
   แก้เมนู/STEP/หน้าจอ ที่ไฟล์นี้ที่เดียว มีผลทุกหน้า
   ------------------------------------------------------------
   วิธีใช้ในแต่ละหน้า HTML:
     (div id=navSystems)           <- ที่วางเมนู (ใน sidebar)
     (script) window.ACTIVE_LEAF="ชื่อเมนูย่อยของหน้านี้"; (/script)
     (script src=rus-faculty.js)
     (script src=rus-nav.js)     <- โหลดหลัง ACTIVE_LEAF
   ============================================================ */

const systems=[
 {n:1,name:"ระบบลงทะเบียน",icon:'<path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  groups:[
   {g:"ภาพรวมกระบวนการทำงาน",href:"2000.html",items:[{name:"Flowchart ระบบลงทะเบียน",href:"2000.html"}]},
   {g:"STEP 1.1 ปฏิทินการศึกษา",items:[
    {name:"รายการปฏิทินการศึกษา",href:"2010.html"},{name:"สร้างปฏิทินการศึกษา",href:"2010_add.html"},{name:"รายงานและ Dashboard",href:"2010_dashboard.html"}]},
   {g:"STEP 1.2 ปฏิทินค่าใช้จ่าย",items:[
    {name:"รายการปฏิทินค่าใช้จ่าย",href:"2012.html"},{name:"สร้างปฏิทินค่าใช้จ่าย",href:"2012_add.html"},{name:"รายงานและ Dashboard",href:"2012_dashboard.html"}]},
   {g:"STEP 2 กำหนดโครงสร้างหลักสูตรและแผนการศึกษา",items:[
    {name:"รายการโครงสร้างหลักสูตรและแผนการศึกษา",href:"2020.html"},
    {name:"สร้างโครงสร้างหลักสูตรและแผนการศึกษา",href:"2020_create.html"},
    {name:"รายงานและ Dashboard",href:"2020_report.html"}]},
   {g:"STEP 3 เปิดรายวิชาและ Section",items:[
    {name:"รายการรายวิชาที่เปิดสอน",href:"2030.html"},
    {name:"เปิดรายวิชา (TC4)",href:"2030_create.html"},
    {name:"รายงานและ Dashboard",href:"2030_report.html"}]},
   {g:"STEP 4 ตรวจสอบความพร้อมก่อนเปิดลงทะเบียน",items:[
{name:"รายการผลการตรวจสอบความพร้อม",href:"2040.html"},
{name:"ตรวจสอบความพร้อมก่อนเปิดลงทะเบียน (TC5)",href:"2040_check.html"},
{name:"รายงานและ Dashboard",href:"2040_dashboard.html"}]},
   {g:"STEP 5 ตรวจสิทธิ์การลงทะเบียน",items:[
{name:"รายการผลการตรวจสอบสิทธิ์",href:"2050.html"},
{name:"ตรวจสิทธิ์การลงทะเบียน (TC6)",href:"2050_check.html"},
{name:"รายงานและ Dashboard",href:"2050_dashboard.html"}]},
   {g:"STEP 6 ลงทะเบียนตามแผน",items:[
{name:"รายการผลการลงทะเบียนตามแผน",href:"2060.html"},
{name:"ลงทะเบียนตามแผน (TC7)",href:"2060_create.html"},
{name:"รายงานและ Dashboard",href:"2060_dashboard.html"}]},
   {g:"STEP 7 ลงทะเบียน Section/ต่างศูนย์",items:[
{name:"รายการลงทะเบียน Section/ต่างศูนย์",href:"2070.html"},
{name:"ลงทะเบียน Section/ต่างศูนย์ (TC8)",href:"2070_create.html"},
{name:"รายงานและ Dashboard",href:"2070_dashboard.html"}]},
   {g:"STEP 8 ตรวจสอบเงื่อนไขการลงทะเบียน",items:[
{name:"รายการผลการตรวจสอบเงื่อนไข",href:"2080.html"},
{name:"ตรวจสอบเงื่อนไขการลงทะเบียน (TC9)",href:"2080_check.html"},
{name:"รายงานและ Dashboard",href:"2080_dashboard.html"}]},
   {g:"STEP 9 พิจารณาอนุมัติการลงทะเบียน",items:[
{name:"รายการผลการพิจารณา",href:"2090.html"},
{name:"พิจารณาอนุมัติการลงทะเบียน (TC10)",href:"2090_review.html"},
{name:"รายงานและ Dashboard",href:"2090_dashboard.html"}]},
   {g:"STEP 10 ใบลงทะเบียนและ Pay-In",items:[
{name:"รายการใบลงทะเบียนและ Pay-In",href:"2100.html"},
{name:"สร้างใบลงทะเบียนและ Pay-In (TC11)",href:"2100_create.html"},
{name:"รายงานและ Dashboard",href:"2100_dashboard.html"}]},
   {g:"STEP 11 ชำระเงินและยืนยัน",items:[
{name:"รายการการชำระเงิน",href:"2110.html"},
{name:"ยืนยันการชำระเงิน (TC12)",href:"2110_confirm.html"},
{name:"รายงานและ Dashboard",href:"2110_dashboard.html"}]},
   {g:"STEP 12 ใบเสร็จและประวัติการเงิน",items:[
{name:"รายการใบเสร็จและประวัติการเงิน",href:"2120.html"},
{name:"ออกใบเสร็จรับเงิน (TC13)",href:"2120_create.html"},
{name:"รายงานและ Dashboard",href:"2120_dashboard.html"}]},
   {g:"STEP 13 เพิ่ม-ถอน-เปลี่ยนกลุ่ม",items:[
{name:"รายการคำขอเพิ่ม-ถอน-เปลี่ยนกลุ่ม",href:"2130.html"},
{name:"ยื่นคำขอเพิ่ม-ถอน-เปลี่ยนกลุ่ม (TC14)",href:"2130_create.html"},
{name:"รายงานและ Dashboard",href:"2130_dashboard.html"}]},
   {g:"STEP 14 ข้อมูลและสถานภาพนักศึกษา",items:[
{name:"รายการข้อมูลและสถานภาพนักศึกษา",href:"2140.html"},
{name:"ปรับปรุงข้อมูลและสถานภาพ (TC15)",href:"2140_update.html"},
{name:"รายงานและ Dashboard",href:"2140_dashboard.html"}]},
   {g:"รายงานและ Dashboard",items:[{name:"รายงานและ Dashboard",href:"2150.html"},{name:"รายงานการลงทะเบียน",href:"2150_registration.html"},{name:"รายงานการเงิน",href:"2150_finance.html"},{name:"รายงานเพิ่ม ถอน เปลี่ยนกลุ่ม",href:"2150_adddrop.html"},{name:"รายงานหลักสูตรและรายวิชา",href:"2150_curriculum.html"},{name:"Drill-down รายละเอียด",href:"2150_drilldown.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system1/master/2001.html",items:[
    {name:"ภาพรวม Master เฉพาะระบบลงทะเบียน",href:"@root/system1/master/2001.html"},
    {name:"M1 พารามิเตอร์โครงสร้างงานทะเบียน",href:"@root/system1/master/2171.html"},
    {name:"M2 หลักสูตรและรายวิชา",href:"@root/system1/master/2172.html"},
    {name:"M3 ปฏิทินและแผนการเรียน",href:"@root/system1/master/2173.html"},
    {name:"M4 บทบาทและการจัดการเรียน",href:"@root/system1/master/2174.html"},
    {name:"M5 กฎและเงื่อนไขการลงทะเบียน",href:"@root/system1/master/2175.html"},
    {name:"M6 การเงินและค่าธรรมเนียม",href:"@root/system1/master/2176.html"},
    {name:"M7 เอกสารงานทะเบียน",href:"@root/system1/master/2177.html"}]},
   {g:"การตั้งค่าระบบ",href:"2180.html",items:[
    {name:"สถานะกระบวนการระบบลงทะเบียน",href:"2180.html"}]},
  ]},
 {n:2,name:"ระบบประมวลผลการศึกษา",icon:'<path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/>',
  groups:[
   {g:"ภาพรวมกระบวนการทำงาน",href:"3000.html",items:[{name:"ภาพรวมกระบวนการทำงาน",href:"3000.html"}]},
   {g:"STEP 1 สร้างขอบเขตการประมวลผล",href:"3010.html",items:[{name:"รายการขอบเขตการประมวลผล",href:"3010.html"},{name:"สร้างขอบเขตตามหลักสูตร",href:"3010_create.html"}]},
   {g:"STEP 2 สร้างโครงสร้างคะแนน",href:"3020.html",items:[{name:"รายการโครงสร้างคะแนน",href:"3020.html"},{name:"สร้างโครงสร้างคะแนน",href:"3020_create.html"}]},
   {g:"STEP 3 บันทึกคะแนนระหว่างภาค",href:"3030.html",items:[{name:"รายการคะแนนระหว่างภาค",href:"3030.html"},{name:"บันทึกคะแนนระหว่างภาค",href:"3030_score.html"},{name:"รายงานความครบถ้วนของคะแนน",href:"3030_report.html"}]},
   {g:"STEP 4 บันทึกคะแนนสอบและคะแนนรวม",href:"3040.html",items:[{name:"รายการคะแนนสอบและคะแนนรวม",href:"3040.html"},{name:"บันทึกคะแนนสอบและสรุปคะแนน",href:"3040_score.html"},{name:"รายงานคะแนนสอบและคะแนนรวม",href:"3040_report.html"}]},
   {g:"STEP 5 ประมวลผลการเรียน",href:"3050.html",items:[{name:"รายการผลการประมวล",href:"3050.html"},{name:"ประมวลผลการเรียน",href:"3050_detail.html"},{name:"รายงานผลการประมวล",href:"3050_report.html"}]},
   {g:"STEP 6 ส่งผลการเรียน",href:"3060.html",items:[{name:"รายการและส่งผลการเรียน",href:"3060.html"}]},
   {g:"STEP 7 ตรวจสอบ รับรอง และอนุมัติผลการเรียน",href:"3070.html",items:[{name:"รายการ Workflow ผลการเรียน",href:"3070.html"}]},
   {g:"STEP 8 ประมวล GPA / GPAX และสถานภาพทางการศึกษา",href:"3080.html",items:[{name:"รายการขอบเขตการประมวล",href:"3080.html"}]},
   {g:"STEP 9 แก้ไขผลการเรียน",href:"3090.html",items:[{name:"รายการคำขอแก้ไขผลการเรียน",href:"3090.html"}]},
   {g:"STEP 10 ผลการศึกษาและประวัติ",href:"3100.html",items:[{name:"รายการผลการศึกษาและประวัติ",href:"3100.html"}]},
   {g:"STEP 11 สรุปผล รายงาน และ Dashboard",href:"3110.html",items:[{name:"Dashboard ภาพรวม",href:"3110.html"},{name:"รายงานผลการศึกษา",href:"3110_report.html"},{name:"ติดตามผล I และรายการผิดปกติ",href:"3110_monitor.html"}]},
   {g:"Master ประจำระบบ",href:"3150.html",items:[{name:"ภาพรวม Master ระบบประมวลผล",href:"3150.html"},{name:"M2.1 โครงสร้างคะแนน",href:"3151.html"},{name:"M2.2 เกณฑ์ตัดเกรด",href:"3152.html"},{name:"M2.3 กฎผล I / ผลพิเศษ",href:"3153.html"},{name:"M2.4 Workflow การส่ง/รับรอง/อนุมัติผล",href:"3154.html"},{name:"M2.5 กฎ GPA / GPAX และสถานภาพ",href:"3155.html"}]},
   {g:"การตั้งค่าระบบ",href:"3180.html",items:[{name:"สถานะกระบวนการประมวลผล",href:"3180.html"},{name:"สิทธิ์ผู้ใช้งานและ Audit Log",href:"3180.html"}]}
  ]},
 {n:3,name:"ระบบเอกสารและงานบริการ",icon:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
  groups:[
   {g:"ภาพรวมระบบเอกสารและงานบริการ",href:"4000.html",items:[{name:"ภาพรวมระบบเอกสารและงานบริการ",href:"4000.html"}]},
   {g:"STEP 1 รับคำขอเอกสารและบริการ",href:"4010.html",items:[{name:"รายการคำขอ",href:"4010.html"},{name:"สร้างคำขอ",href:"4010_create.html"}]},
   {g:"STEP 2 ตรวจสอบและพิจารณาคำขอ",href:"4020.html",items:[{name:"ตรวจสอบข้อมูลและสิทธิ์",href:"4020.html"},{name:"พิจารณาอนุมัติ",href:"4020_approval.html"}]},
   {g:"STEP 3 ค่าธรรมเนียมและการชำระเงิน",href:"4030.html",items:[{name:"รายการชำระเงิน",href:"4030.html"},{name:"ตรวจสอบรายการผิดปกติ",href:"4030_review.html"}]},
   {g:"STEP 4 ดำเนินการและรับรองผล",href:"4040.html",items:[{name:"ดำเนินการคำขอ",href:"4040.html"},{name:"ตรวจและรับรองผล",href:"4040_certify.html"}]},
   {g:"STEP 5 ส่งมอบและตรวจสอบเอกสาร",href:"4050.html",items:[{name:"ส่งมอบเอกสาร",href:"4050.html"},{name:"ตรวจสอบเอกสาร",href:"4050_verify.html"}]},
   {g:"STEP 6 ติดตามและประวัติ",href:"4060.html",items:[{name:"ติดตามคำขอ",href:"4060.html"},{name:"ประวัติคำขอและเอกสาร",href:"4060_history.html"}]},
   {g:"รายงานและ Dashboard",href:"4070.html",items:[{name:"Dashboard ภาพรวม",href:"4070.html"},{name:"รายงานงานบริการ",href:"4071.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system3/master/4150.html",items:[{name:"ภาพรวม Master SYSTEM 3",href:"@root/system3/master/4150.html"},{name:"M1 บริการและประเภทเอกสาร",href:"@root/system3/master/4151.html"},{name:"M2 รูปแบบและ Template เอกสาร",href:"@root/system3/master/4152.html"},{name:"M3 ประเภทเอกสารประกอบคำขอ",href:"@root/system3/master/4153.html"},{name:"M4 ช่องทางส่งมอบเอกสาร",href:"@root/system3/master/4154.html"}]},
   {g:"การตั้งค่าระบบ",href:"4180.html",items:[{name:"ค่าธรรมเนียม / SLA / Workflow",href:"4180.html"},{name:"สถานะ / การรับรอง / Integration",href:"4180.html"}]}
  ]},
 {n:4,name:"การเงินและค่าธรรมเนียม",icon:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  groups:[
   {g:"ภาพรวมระบบการเงินและค่าธรรมเนียม",href:"5000.html",items:[{name:"ภาพรวมระบบการเงินและค่าธรรมเนียม",href:"5000.html"}]},
   {g:"STEP 1 โครงสร้างค่าธรรมเนียม",href:"5010.html",items:[{name:"ชุดอัตราค่าธรรมเนียม",href:"5010.html"},{name:"ตรวจสอบและอนุมัติชุดอัตรา",href:"5011.html"}]},
   {g:"STEP 2 สร้างภาระค่าใช้จ่ายและบัญชีลูกหนี้",href:"5020.html",items:[{name:"รายการภาระค่าใช้จ่าย",href:"5020.html"},{name:"ตรวจสอบและสร้างภาระค่าใช้จ่าย",href:"5021.html"}]},
   {g:"STEP 3 ใบแจ้งหนี้และการรับชำระเงิน",href:"5030.html",items:[{name:"ใบแจ้งหนี้และรายการรอชำระ",href:"5030.html"},{name:"รายการรับชำระเงิน",href:"5031.html"}]},
   {g:"STEP 4 ตรวจสอบและกระทบยอดการชำระเงิน",href:"5040.html",items:[{name:"กระทบยอดการชำระเงิน",href:"5040.html"},{name:"ตรวจสอบรายการผิดปกติ",href:"5041.html"}]},
   {g:"STEP 5 ใบเสร็จและเอกสารการเงิน",href:"5050.html",items:[{name:"ใบเสร็จและเอกสารการเงิน",href:"5050.html"},{name:"ตรวจสอบเอกสารการเงิน",href:"5051.html"}]},
   {g:"STEP 6 ทุน ส่วนลด และการผ่อนชำระ",href:"5060.html",items:[{name:"ทุนและส่วนลด",href:"5060.html"},{name:"การผ่อนชำระ",href:"5061.html"}]},
   {g:"STEP 7 หนี้ค้าง คืนเงิน และปรับปรุงบัญชี",href:"5070.html",items:[{name:"หนี้ค้างและ Financial Hold",href:"5070.html"},{name:"คืนเงินและปรับปรุงบัญชี",href:"5071.html"}]},
   {g:"STEP 8 บัญชีการเงินและประวัติ",href:"5080.html",items:[{name:"บัญชีการเงินรายบุคคล",href:"5080.html"},{name:"Statement และประวัติทางการเงิน",href:"5081.html"}]},
   {g:"รายงานและ Dashboard",href:"5090.html",items:[{name:"รายงานและ Dashboard",href:"5090.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system4/master/5151.html",items:[{name:"M1 ประเภทภาระค่าใช้จ่าย",href:"@root/system4/master/5151.html"},{name:"M2 ชุดอัตราและกฎการคำนวณ",href:"@root/system4/master/5152.html"},{name:"M3 ประเภททุนและส่วนลด",href:"@root/system4/master/5153.html"},{name:"M4 ประเภทแผนผ่อนชำระ",href:"@root/system4/master/5154.html"},{name:"M5 ประเภทค่าปรับ",href:"@root/system4/master/5155.html"},{name:"M6 เหตุผลคืนเงินและปรับปรุงบัญชี",href:"@root/system4/master/5156.html"}]},
   {g:"Master ส่วนกลาง",href:"@root/master/9000.html",items:[{name:"Master ส่วนกลาง",href:"@root/master/9000.html"}]},
   {g:"การตั้งค่าระบบ",href:"5100.html",items:[{name:"การตั้งค่าระบบ",href:"5100.html"}]}
  ]},
 {n:5,name:"คำร้องออนไลน์",icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
  groups:[
   {g:"ภาพรวมระบบคำร้องออนไลน์",href:"6000.html",items:[{name:"ภาพรวมระบบคำร้องออนไลน์",href:"6000.html"}]},
   {g:"STEP 1 ประเภทคำร้องและเงื่อนไข",href:"6010.html",items:[{name:"ประเภทคำร้องและเงื่อนไข",href:"6010.html"},{name:"ตรวจสอบและอนุมัติการตั้งค่า",href:"6011.html"}]},
   {g:"STEP 2 รับและยื่นคำร้อง",href:"6020.html",items:[{name:"รายการคำร้อง",href:"6020.html"},{name:"สร้างคำร้อง",href:"6021.html"}]},
   {g:"STEP 3 ตรวจสอบคำร้อง",href:"6030.html",items:[{name:"รายการรอตรวจสอบ",href:"6030.html"},{name:"คำร้องที่ต้องแก้ไข",href:"6031.html"}]},
   {g:"STEP 4 พิจารณาและอนุมัติ",href:"6040.html",items:[{name:"รายการรอพิจารณา",href:"6040.html"},{name:"ประวัติการพิจารณา",href:"6041.html"}]},
   {g:"STEP 5 ดำเนินการตามคำร้อง",href:"6050.html",items:[{name:"รายการรอดำเนินการ",href:"6050.html"},{name:"ดำเนินการตามคำร้อง",href:"6051.html"}]},
   {g:"STEP 6 ตรวจสอบผล ติดตามและปิดคำร้อง",href:"6060.html",items:[{name:"รายการรอตรวจสอบผล",href:"6060.html"},{name:"ติดตามสถานะคำร้อง",href:"6061.html"},{name:"ประวัติคำร้อง",href:"6062.html"}]},
   {g:"รายงานและ Dashboard",href:"6080.html",items:[{name:"รายงานและ Dashboard",href:"6080.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system5/master/6151.html",items:[{name:"M1 ประเภทคำร้อง",href:"@root/system5/master/6151.html"},{name:"M2 หมวดหมู่คำร้อง",href:"@root/system5/master/6152.html"},{name:"M3 ประเภทเอกสารประกอบคำร้อง",href:"@root/system5/master/6153.html"},{name:"M4 เหตุผลส่งกลับ/ไม่อนุมัติ",href:"@root/system5/master/6154.html"}]}
  ]},
 {n:6,name:"ระบบเทียบโอนผลการศึกษา",icon:'<path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7"/>',
  groups:[
   {g:"ภาพรวมระบบเทียบโอนผลการศึกษา",href:"7000.html",items:[{name:"ภาพรวมระบบเทียบโอนผลการศึกษา",href:"7000.html"}]},
   {g:"STEP 1 รับคำขอและเอกสารเทียบโอน",href:"7010.html",items:[{name:"รายการคำขอเทียบโอน",href:"7010.html"},{name:"รายการรอตรวจเอกสาร",href:"7011.html"}]},
   {g:"STEP 2 นำเข้าและตรวจสอบข้อมูลการศึกษาเดิม",href:"7020.html",items:[{name:"รายการรอนำเข้าและตรวจสอบ",href:"7020.html"}]},
   {g:"STEP 3 วิเคราะห์และจับคู่รายวิชา",href:"7030.html",items:[{name:"รายการรอวิเคราะห์และจับคู่",href:"7030.html"}]},
   {g:"STEP 4 พิจารณาและอนุมัติผลเทียบโอน",href:"7040.html",items:[{name:"รายการรอพิจารณาและอนุมัติ",href:"7040.html"}]},
   {g:"STEP 5 ค่าธรรมเนียมและยืนยันผล",href:"7050.html",items:[]},
   {g:"STEP 6 บันทึกผลและประวัติ",href:"7060.html",items:[{name:"รายการผลเทียบโอน",href:"7060.html"}]},
   {g:"รายงานและ Dashboard",href:"7070.html",items:[{name:"รายงานและ Dashboard",href:"7070.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system6/master/7150.html",items:[{name:"ภาพรวม Master ระบบเทียบโอน",href:"@root/system6/master/7150.html"},{name:"M1 ประเภทการเทียบโอน",href:"@root/system6/master/7151.html"},{name:"M2 เกณฑ์การเทียบโอน",href:"@root/system6/master/7152.html"},{name:"M3 กฎการจับคู่รายวิชา",href:"@root/system6/master/7153.html"},{name:"M4 ประเภทเอกสารประกอบ",href:"@root/system6/master/7154.html"},{name:"M5 ชุดผู้พิจารณา/กรรมการ",href:"@root/system6/master/7155.html"},{name:"M6 อัตราค่าธรรมเนียม",href:"@root/system6/master/7156.html"}]}
  ]},
 {n:7,name:"สหกิจศึกษา",icon:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  groups:[
   {g:"ภาพรวมระบบสหกิจศึกษา",href:"8000.html",items:[{name:"ภาพรวมระบบสหกิจศึกษา",href:"8000.html"}]},
   {g:"STEP 1 รอบและการเตรียมสหกิจศึกษา",href:"8010.html",items:[{name:"รอบสหกิจศึกษา",href:"8010.html"}]},
   {g:"STEP 2 สถานประกอบการและตำแหน่งงาน",href:"8020.html",items:[{name:"สถานประกอบการ",href:"8020.html"}]},
   {g:"STEP 3 การสมัครสหกิจ",href:"8031.html",items:[{name:"ใบสมัครสหกิจ",href:"8031.html"},{name:"นักศึกษาที่มีสิทธิ์",href:"8030.html"}]},
   {g:"STEP 4 คัดเลือก สัมภาษณ์ และจับคู่",href:"8040.html",items:[{name:"คัดเลือกใบสมัคร",href:"8040.html"},{name:"การสอบสัมภาษณ์",href:"8041.html"},{name:"ผลคัดเลือกและการจับคู่",href:"8042.html"}]},
   {g:"STEP 5 พิจารณาและอนุมัติออกสหกิจ",href:"8050.html",items:[{name:"รายการพิจารณาและอนุมัติ",href:"8050.html"}]},
   {g:"STEP 6 ปฏิบัติงานและการนิเทศ",href:"8060.html",items:[{name:"นักศึกษาปฏิบัติงาน",href:"8060.html"}]},
   {g:"STEP 7 ประเมินผลและปิดสหกิจ",href:"8070.html",items:[{name:"รายการประเมินผล",href:"8070.html"},{name:"ผลสหกิจศึกษา",href:"8071.html"}]},
   {g:"STEP 8 ติดตามผลและรายงาน",href:"8080.html",items:[{name:"แดชบอร์ดและรายงาน",href:"8080.html"},{name:"ประวัติสหกิจศึกษา",href:"8082.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system7/master/8150.html",items:[{name:"ภาพรวม Master ระบบสหกิจศึกษา",href:"@root/system7/master/8150.html"},{name:"M1 ประเภทกิจกรรมเตรียมความพร้อม",href:"@root/system7/master/8151.html"},{name:"M2 รูปแบบการนิเทศ",href:"@root/system7/master/8152.html"},{name:"M3 แบบประเมินและเกณฑ์คะแนน",href:"@root/system7/master/8153.html"},{name:"M4 ประเภทเอกสารสหกิจ",href:"@root/system7/master/8154.html"},{name:"M5 เหตุผลติดตาม/สถานะปัญหา",href:"@root/system7/master/8155.html"}]}
  ]},
 {n:8,name:"บัณฑิตศึกษา",icon:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/>',
  groups:[
   {g:"ภาพรวมระบบบัณฑิตศึกษา",href:"9000.html",items:[{name:"ภาพรวมระบบบัณฑิตศึกษา",href:"9000.html"}]},
   {g:"STEP 1 นักศึกษาบัณฑิตศึกษาและสถานภาพ",href:"9010.html",items:[{name:"นักศึกษาบัณฑิตศึกษา",href:"9010.html"},{name:"ติดตามสถานภาพการศึกษา",href:"9011.html"}]},
   {g:"STEP 2 อาจารย์ที่ปรึกษาและคณะกรรมการ",href:"9020.html",items:[{name:"อาจารย์ที่ปรึกษาและคณะกรรมการ",href:"9020.html"},{name:"การเปลี่ยนแปลงและประวัติ",href:"9022.html"}]},
   {g:"STEP 3 หัวข้อและเค้าโครงวิทยานิพนธ์/สารนิพนธ์",href:"9030.html",items:[{name:"ยื่นหัวข้อ/เค้าโครง",href:"9030.html"},{name:"พิจารณา/แก้ไข",href:"9031.html"},{name:"อนุมัติหัวข้อ",href:"9032.html"}]},
   {g:"STEP 4 การสอบระดับบัณฑิตศึกษา",href:"9040.html",items:[{name:"รายการสอบ",href:"9040.html"},{name:"ตารางสอบ",href:"9041.html"},{name:"ผลการสอบ",href:"9042.html"}]},
   {g:"STEP 5 การแก้ไขและรับรองวิทยานิพนธ์",href:"9050.html",items:[{name:"แก้ไขและตรวจสอบ",href:"9050.html"},{name:"รับรองฉบับสมบูรณ์",href:"9053.html"}]},
   {g:"STEP 6 คำร้องบัณฑิตศึกษา",href:"9060.html",items:[{name:"รายการคำร้อง",href:"9060.html"},{name:"รายการรอพิจารณา",href:"9061.html"}]},
   {g:"STEP 7 ตรวจสอบและขอสำเร็จการศึกษา",href:"9070.html",items:[{name:"ตรวจสอบและขอสำเร็จการศึกษา",href:"9070.html"},{name:"งานพิจารณาและอนุมัติ",href:"9072.html"}]},
   {g:"STEP 8 ติดตามผลและรายงาน",href:"9080.html",items:[{name:"ติดตามสถานะนักศึกษา",href:"9080.html"},{name:"รายงาน",href:"9081.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system8/master/9250.html",items:[{name:"ภาพรวม Master ระบบบัณฑิตศึกษา",href:"@root/system8/master/9250.html"},{name:"M1 ประเภทคำร้องบัณฑิตศึกษา",href:"@root/system8/master/9251.html"},{name:"M2 ประเภทการสอบและผลสอบ",href:"@root/system8/master/9252.html"},{name:"M3 ประเภทเอกสารวิทยานิพนธ์",href:"@root/system8/master/9253.html"},{name:"M4 เกณฑ์ Milestone และสำเร็จการศึกษา",href:"@root/system8/master/9254.html"},{name:"M5 ชุดบทบาทอาจารย์/กรรมการ",href:"@root/system8/master/9255.html"}]},
  ]},


 {n:9,name:"ระบบรับสมัครและรายงานตัว",icon:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11l-3 3-1.5-1.5"/>',
  groups:[
   {g:"ภาพรวมระบบรับสมัครและรายงานตัว",href:"10000.html",items:[{name:"ภาพรวมระบบรับสมัครและรายงานตัว",href:"10000.html"}]},
   {g:"STEP 1 รอบรับสมัครและเกณฑ์การรับ",href:"10010.html",items:[]},
   {g:"STEP 2 รับสมัครและข้อมูลผู้สมัคร",href:"10020.html",items:[]},
   {g:"STEP 3 ชำระค่าสมัคร",href:"10030.html",items:[{name:"การชำระค่าสมัครรายผู้สมัคร",href:"10030.html"}]},
   {g:"STEP 4 ตรวจสอบใบสมัครและคุณสมบัติ",href:"10040.html",items:[]},
   {g:"STEP 5 คัดเลือกและประกาศผล",href:"10050.html",items:[]},
   {g:"STEP 6 ยืนยันสิทธิ์และกรอกข้อมูลรายงานตัว",href:"10060.html",items:[{name:"ติดตามการยืนยันสิทธิ์",href:"10060.html"},{name:"ข้อมูลรายงานตัว",href:"10062.html"}]},
   {g:"STEP 7 ตรวจและอนุมัติรายงานตัว",href:"10070.html",items:[{name:"ชำระและตรวจรายงานตัว",href:"10070.html"},{name:"อนุมัติรายงานตัว",href:"10071.html"}]},
   {g:"STEP 8 ขึ้นทะเบียนนักศึกษาและเชื่อมโยงระบบ",href:"10080.html",items:[{name:"ขึ้นทะเบียนนักศึกษาและเชื่อมโยงระบบ",href:"10080.html"}]},
   {g:"Master ประจำระบบ",href:"@root/system9/master/10500.html",items:[{name:"ภาพรวม Master ระบบรับสมัคร",href:"@root/system9/master/10500.html"},{name:"M9.1 ประเภทและรอบการรับสมัคร",href:"@root/system9/master/10501.html"},{name:"M9.2 เกณฑ์และคุณสมบัติการรับสมัคร",href:"@root/system9/master/10502.html"},{name:"M9.3 เอกสารการสมัครและรายงานตัว",href:"@root/system9/master/10503.html"},{name:"M9.4 กฎค่าธรรมเนียมรับสมัคร/รายงานตัว",href:"@root/system9/master/10504.html"},{name:"M9.5 กฎการคัดเลือกและผลการพิจารณา",href:"@root/system9/master/10505.html"},{name:"M9.6 Workflow และสถานะ",href:"@root/system9/master/10506.html"}]},
   {g:"การตั้งค่าระบบ",href:"10800.html",items:[{name:"การตั้งค่าระบบรับสมัคร",href:"10800.html"},{name:"Running No. / Payment Reference",href:"10800.html#running"},{name:"Notification / Integration",href:"10800.html#integration"}]},
  ]},
 ];


/* ---------- สร้างเมนูจาก systems[] ---------- */
(function(){
  const wrap=document.getElementById('navSystems');
  if(!wrap) return;
  const ACTIVE=window.ACTIVE_LEAF||'';
  const curFile=(location.pathname.split('/').pop()||'').toLowerCase();
  const normalizedPath=location.pathname.replace(/\\/g,'/');
  const folderMatch=normalizedPath.match(/\/(system([1-9]))\//i);
  const currentSystemNo=folderMatch?parseInt(folderMatch[2],10):0;
  const isCentralSettings=location.pathname.replace(/\\/g,'/').includes('/settings/');
  const isCentralMaster=/\/master\//i.test(normalizedPath) && !/\/system[1-9]\/master\//i.test(normalizedPath);

  
  const SYSTEM_MASTER_GROUP={g:"Master กลาง",href:"@root/master/9000.html",items:[
    {name:"ภาพรวม Master กลางมหาวิทยาลัย",href:"@root/master/9000.html"},
    {name:"SM1 โครงสร้างองค์กรและการศึกษา",href:"@root/master/sm1_organization.html"},
    {name:"SM2 ปีและภาคการศึกษา",href:"@root/master/sm2_academic_period.html"},
    {name:"SM3 บุคลากรกลาง",href:"@root/master/sm3_personnel.html"},
    {name:"SM4 อาคาร ห้อง และสถานที่",href:"@root/master/sm4_location_room.html"},
    {name:"SM5 สถานภาพนักศึกษา",href:"@root/master/sm5_student_status.html"},
    {name:"SM6 ช่องทางการชำระเงิน",href:"@root/master/sm6_payment_channel.html"}]};

  systems.forEach((s,si)=>{
    // ----- ชั้น 1: ระบบงาน -----
    const parent=document.createElement('button');
    parent.className='nav-parent';
    parent.setAttribute('data-label',s.n+'. '+s.name);
    parent.innerHTML=`<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.icon}</svg></span>
      <span class="txt">${s.name}</span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
    const submenu=document.createElement('div');
    submenu.className='submenu';

    (() => {
      // v161: ผู้ใช้งานและสิทธิ์ / ตั้งค่าระบบ / Master กลาง เป็นเมนูส่วนกลางด้านล่าง
      // ไม่แทรกไว้ภายในแต่ละ SYSTEM เพื่อให้ Pattern ของ SYSTEM 1/2/3/4/5/9 เหมือนกัน
      const GLOBAL_BOTTOM_SYSTEMS=[1,2,3,4,5,6,7,8,9];
      const orderedGroups=[...s.groups];
      if(GLOBAL_BOTTOM_SYSTEMS.includes(s.n)){
        return orderedGroups.filter(grp=>!grp.g.includes('Master ส่วนกลาง') && grp.g!=='การตั้งค่าระบบ');
      }
      return orderedGroups;
    })().forEach((grp,gi)=>{
      const single=!grp.items || grp.items.length<=1;
      const stepMatch=grp.g.match(/STEP\s+(\d+)/);
      const stepNo=stepMatch?String(stepMatch[1]).padStart(2,'0'):'00';
      const sysNo=s.n;
      const gBtn=document.createElement('button');
      gBtn.className=single?'nav-group2 single':'nav-group2';
      if(grp.g.includes('Master ส่วนกลาง')) gBtn.setAttribute('data-master-role','shared');
      if(grp.g.includes('Master ประจำระบบ')) gBtn.setAttribute('data-master-role','system');

      if(single){
        // STEP หน้าเดียว → ลิงก์ตรง รหัส = ระบบ+STEP+0
        const href=grp.href||`${sysNo}${stepNo}0.html`;
        gBtn.innerHTML=`<span class="g-cn">${grp.g}</span>`;
        gBtn.setAttribute('data-href',href);
        // ไฮไลต์เมื่อหน้าปัจจุบันคือหน้านี้ (รวมหน้าลูก เช่น 1020_manage)
        const baseCode=href.replace(/\.html$/,'');
        if(curFile===href.toLowerCase()||curFile.startsWith(baseCode+'_')||curFile.startsWith(baseCode+'.')){
          gBtn.classList.add('active-step');
          parent.classList.add('open','current-sys');
          submenu.classList.add('open');
        }
        gBtn.addEventListener('click',e=>{
          e.stopPropagation();
          document.querySelectorAll('.nav-group2.open').forEach(x=>{x.classList.remove('open');if(x.nextElementSibling)x.nextElementSibling.classList.remove('open');});
          document.querySelectorAll('.nav-group2.active-step,.nav-leaf.active').forEach(x=>x.classList.remove('active-step','active'));
          gBtn.classList.add('active-step');
          window.location.href=RUS_RESOLVE_HREF(href);
        });
        submenu.appendChild(gBtn);
        return;
      }

      // STEP หลายหน้า → กางได้
      gBtn.innerHTML=`<span class="g-cn">${grp.g}</span>
        <svg class="g-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
      const gWrap=document.createElement('div');
      gWrap.className='subsub';
      let hasActiveLeaf=false;
      gWrap.innerHTML=grp.items.map((it,ii)=>{
        const label=(typeof it==='object'?it.name:it);
        const href=(typeof it==='object'&&it.href)?it.href:`${sysNo}${stepNo}${ii+1}.html`;
        // ใช้ชื่อไฟล์จริงเป็นหลักในการไฮไลต์เมนู เพื่อไม่ให้ ACTIVE_LEAF ที่ตั้งคลาดเคลื่อนพาไปเปิดผิดเมนู
        const hrefFile=(href.split('/').pop()||'').toLowerCase();
        const activeByFile=(!isCentralMaster && curFile===hrefFile);
        const activeByLabel=(!activeByFile&&currentSystemNo===s.n&&ACTIVE&&label===ACTIVE);
        const active=(activeByFile||activeByLabel)?' active':'';
        if(active)hasActiveLeaf=true;
        return `<a class="nav-leaf${active}" href="${RUS_RESOLVE_HREF(href)}"><span class="bullet"></span><span class="cn">${label}</span></a>`;
      }).join('');
      gBtn.addEventListener('click',e=>{
        e.stopPropagation();
        const open=gBtn.classList.contains('open');
        submenu.querySelectorAll('.nav-group2.open').forEach(x=>{x.classList.remove('open');if(x.nextElementSibling)x.nextElementSibling.classList.remove('open');});
        if(!open){gBtn.classList.add('open');gWrap.classList.add('open');}
      });
      submenu.appendChild(gBtn);submenu.appendChild(gWrap);
      // เปิด group + parent อัตโนมัติ ถ้ามี leaf ที่ active อยู่ใน group นี้ (ไม่ต้อง hardcode ต่อหน้า)
      if(hasActiveLeaf){
        gBtn.classList.add('open');gWrap.classList.add('open');
        parent.classList.add('open','current-sys');submenu.classList.add('open');
      }
    });

    parent.addEventListener('click',()=>{
      const app=document.getElementById('app');
      // ถ้าเมนูหดอยู่ (desktop) → ขยายเมนูกลับก่อน แล้วเปิดระบบนี้
      if(app&&app.classList.contains('collapsed')){
        app.classList.remove('collapsed');
        document.querySelectorAll('.nav-parent.open').forEach(p=>{p.classList.remove('open');if(p.nextElementSibling)p.nextElementSibling.classList.remove('open');});
        parent.classList.add('open');submenu.classList.add('open');
        return;
      }
      const isOpen=parent.classList.contains('open');
      document.querySelectorAll('.nav-parent.open').forEach(p=>{p.classList.remove('open');p.nextElementSibling.classList.remove('open');});
      if(!isOpen){parent.classList.add('open');submenu.classList.add('open');}
    });
    wrap.appendChild(parent);wrap.appendChild(submenu);
  });

  // v161: เมนูส่วนกลาง/ตั้งค่าอยู่ด้านล่างนอกกลุ่มระบบ สำหรับ SYSTEM 1/2/3/4/5/9
  const GLOBAL_BOTTOM_SYSTEMS=[1,2,3,4,5,6,7,8,9];
  const SYSTEM_SETTING_HREF={1:'2180.html',2:'3180.html',3:'4180.html',4:'5100.html',5:'6090.html',6:'7180.html',7:'8180.html',8:'9090.html',9:'10800.html'};
  // v165: เมนูส่วนล่างต้องมองเห็นได้ทุกหน้าที่มี Sidebar รวมถึงหน้า Master กลาง
  // หน้าใน SYSTEM 1/2/3/4/5/9 แสดงครบ 3 รายการ; หน้า Master กลางเติม Master กลางต่อท้ายเมนูตั้งค่าที่มีอยู่
  {
    const sidebar=document.getElementById('sidebar');
    if(sidebar && !document.getElementById('globalSystemSettings')){
      const sec=document.createElement('div');
      sec.className='nav-section'; sec.id='globalSystemSettings';
      if(GLOBAL_BOTTOM_SYSTEMS.includes(currentSystemNo)){
        const settingHref=SYSTEM_SETTING_HREF[currentSystemNo]||'main.html';
        sec.innerHTML=`<div class="label">ตั้งค่า</div>
          <a class="nav-parent" data-label="ผู้ใช้งานและสิทธิ์" href="${RUS_RESOLVE_HREF(settingHref+'#users')}"><span class="ico">♙</span><span class="txt">ผู้ใช้งานและสิทธิ์</span></a>
          <a class="nav-parent" data-label="ตั้งค่าระบบ" href="${RUS_RESOLVE_HREF(settingHref)}"><span class="ico">⚙</span><span class="txt">ตั้งค่าระบบ</span></a>
          <a class="nav-parent" data-label="Master กลาง" href="${RUS_RESOLVE_HREF('@root/master/9000.html')}"><span class="ico">◇</span><span class="txt">Master กลาง</span></a>`;
        sidebar.appendChild(sec);
      } else if(isCentralMaster || isCentralSettings){
        // v166: หน้า Master กลางต้องมีเมนูส่วนล่างที่คลิกได้จริงครบชุด
        // ลบกลุ่มตั้งค่า static เดิมที่เป็น button ไม่มีปลายทาง
        [...sidebar.querySelectorAll('.nav-section')].forEach(x=>{if(x.querySelector('[data-label="ผู้ใช้งานและสิทธิ์"], [data-label="ตั้งค่าระบบ"]')) x.remove();});
        sec.innerHTML=`<div class="label">ตั้งค่า</div>
          <a class="nav-parent" data-label="ผู้ใช้งานและสิทธิ์" href="${RUS_RESOLVE_HREF('@root/settings/9001.html#users')}"><span class="ico">♙</span><span class="txt">ผู้ใช้งานและสิทธิ์</span></a>
          <a class="nav-parent" data-label="ตั้งค่าระบบ" href="${RUS_RESOLVE_HREF('@root/settings/9001.html')}"><span class="ico">⚙</span><span class="txt">ตั้งค่าระบบ</span></a>
          <a class="nav-parent" data-label="Master กลาง" href="${RUS_RESOLVE_HREF('@root/master/9000.html')}"><span class="ico">◇</span><span class="txt">Master กลาง</span></a>`;
        sidebar.appendChild(sec);
      }
    }
  }

  // หน้าแดชบอร์ด (main.html หรือตั้ง window.IS_DASHBOARD) → หุบเมนูระบบทั้งหมด ไม่เปิด default
  const isDashboard = window.IS_DASHBOARD===true || curFile==='main.html' || curFile==='' ;
  // ถ้าไม่ใช่แดชบอร์ด และไม่มีหน้าไหน active → เปิดระบบแรกเป็นค่าเริ่มต้น
  if(!isDashboard && !document.querySelector('.nav-parent.current-sys')){
    const parents=[...wrap.querySelectorAll('.nav-parent')];
    const fp=(currentSystemNo?parents[currentSystemNo-1]:null)||parents[0];
    if(fp){fp.classList.add('open','current-sys');if(fp.nextElementSibling)fp.nextElementSibling.classList.add('open');}
  }

  /* ---------- Toggle logic (responsive) ---------- */
  const app=document.getElementById('app');
  const backdrop=document.getElementById('backdrop');
  const MOBILE=()=>window.innerWidth<=980;
  const mt=document.getElementById('menuToggle');
  if(mt)mt.addEventListener('click',()=>{
    if(MOBILE()){app.classList.toggle('mobile-open');}
    else{app.classList.toggle('collapsed');}
  });
  if(backdrop)backdrop.addEventListener('click',()=>app.classList.remove('mobile-open'));
  window.addEventListener('resize',()=>{if(!MOBILE())app.classList.remove('mobile-open');});

  /* ---------- Breadcrumb: ทำให้ "หน้าแรก" / ชื่อระบบ / ชื่อ STEP คลิกได้ ---------- */
  (function(){
    const crumb=document.querySelector('.crumb');
    if(!crumb) return;
    // สร้าง map: ชื่อระบบ → href หน้าแรกของระบบ, ชื่อ STEP → href หน้าแรกของ STEP
    const sysHref={}, stepHref={};
    const firstGroupHref=(s,grp)=>{
      if(grp.href) return grp.href;
      const first=grp.items&&grp.items[0];
      if(first&&typeof first==='object'&&first.href) return first.href;
      const m=grp.g.match(/STEP\s+(\d+)/);const sn=m?String(m[1]).padStart(2,'0'):'01';
      return (!grp.items || grp.items.length<=1) ? `${s.n}${sn}0.html` : `${s.n}${sn}1.html`;
    };
    systems.forEach(s=>{
      const g0=s.groups[0];
      if(g0) sysHref[s.name]=firstGroupHref(s,g0);
      s.groups.forEach(grp=>{ stepHref[grp.g]=firstGroupHref(s,grp); });
    });
    // แตก breadcrumb เป็นส่วนๆ ด้วย › แล้วสร้างลิงก์
    const html=crumb.innerHTML;
    const parts=html.split('›');
    const out=parts.map((part,idx)=>{
      const isLast=idx===parts.length-1;
      const txt=part.trim();
      if(isLast) return part; // ตัวสุดท้าย (หน้าปัจจุบัน) ไม่ทำลิงก์ คงเดิม (อาจเป็น <b>)
      const plain=txt.replace(/<[^>]+>/g,'').trim(); // ตัด tag
      let href=null;
      if(plain==='หน้าแรก') href='main.html';
      else if(sysHref[plain]) href=sysHref[plain];
      else { // เทียบ STEP (ชื่อใน crumb อาจตัด "STEP N " ออกบางส่วน) — จับด้วย match บางส่วน
        for(const k in stepHref){ if(plain && (k===plain || k.indexOf(plain)===0 || plain.indexOf(k)===0)){href=stepHref[k];break;} }
      }
      if(href) return part.replace(plain, `<a href="${RUS_RESOLVE_HREF(href)}">${plain}</a>`);
      return part;
    });
    crumb.innerHTML=out.join('›');
  })();
})();


/* ---------- System 2 process context bar ---------- */
(function(){
  const file=(location.pathname.split('/').pop()||'').toLowerCase();
  const m=file.match(/^2(\d{2})/);
  if(!m) return;
  const stepMap={
    '00':['ภาพรวมกระบวนการทำงาน','ภาพรวม'],
    '01':['STEP 1.1 ปฏิทินการศึกษา','Layer 1 เตรียมข้อมูลกลาง'],
    '02':['STEP 2 กำหนดโครงสร้างหลักสูตรและแผนการศึกษา','Layer 1 เตรียมข้อมูลกลาง'],
    '03':['STEP 3 เปิดรายวิชาและ Section','Layer 2 เตรียมเปิดลงทะเบียน'],
    '04':['STEP 4 ตรวจสอบก่อนเปิดลงทะเบียน','Layer 2 เตรียมเปิดลงทะเบียน'],
    '05':['STEP 5 เข้าสู่ระบบลงทะเบียน','Layer 3 นักศึกษาดำเนินการ'],
    '06':['STEP 6 เลือกรายวิชาตามแผน','Layer 3 นักศึกษาดำเนินการ'],
    '07':['STEP 7 เลือก Section / ต่างศูนย์','Layer 3 นักศึกษาดำเนินการ'],
    '08':['STEP 8 ตรวจสอบเงื่อนไข','Layer 4 ตรวจสอบและอนุมัติ'],
    '09':['STEP 9 อาจารย์ที่ปรึกษาอนุมัติ','Layer 4 ตรวจสอบและอนุมัติ'],
    '10':['STEP 10 ใบลงทะเบียนและ Pay-In','Layer 5 การเงิน'],
    '11':['STEP 11 เจ้าหน้าที่การเงินยืนยันการชำระ','Layer 5 การเงิน'],
    '12':['STEP 12 ใบเสร็จและประวัติการเงิน','Layer 5 การเงิน'],
    '13':['STEP 13 เพิ่ม / ถอน / เปลี่ยนกลุ่ม','Layer 6 หลังลงทะเบียน'],
    '14':['STEP 14 ข้อมูลและสถานภาพนักศึกษา','Layer 6 หลังลงทะเบียน'],
    '15':['รายงานและ Dashboard','Layer 7 Dashboard']
  };
  let code=m[1];
  if(file.startsWith('2012')) code='01';
  const masterFiles=['2001.html','2020_add.html','2021.html','2023.html','2024.html','2025.html','2028.html','2161.html','2162.html','2163.html','2164.html','2165.html','2166.html','2167.html','2171.html','2172.html','2173.html','2174.html','2175.html','2176.html','2177.html'];
  const statusFiles=['2180.html'];
  const isMaster=masterFiles.includes(file);
  const isStatus=statusFiles.includes(file);
  const info=isStatus?['SYSTEM STATUS ระบบลงทะเบียน','สถานะควบคุม Workflow ไม่ใช่ STEP']:(isMaster?['MASTER SYSTEM 1','ข้อมูลกลาง ไม่ใช่ STEP']:(file.startsWith('2012')?['STEP 1.2 ปฏิทินค่าใช้จ่าย','Layer 1 เตรียมข้อมูลกลาง']:(stepMap[code]||['ระบบลงทะเบียน',''])));
  const main=document.querySelector('main.content');
  if(!main||main.querySelector('.s2-context')) return;
  const bar=document.createElement('div');
  bar.className='s2-context';
  const landingMap={
    '2000':'2000.html','2010':'2010.html','2012':'2012.html','2020':'2020.html','2021':'2021.html','2022':'2022.html','2023':'2023.html','2024':'2024.html','2025':'2025.html','2026':'2026.html','2027':'2027.html','2028':'2028.html','2029':'2029.html','2030':'2030.html','2040':'2040.html',
    '2050':'2050.html','2060':'2060.html','2070':'2070.html','2080':'2080.html','2090':'2090.html','2100':'2100.html',
    '2110':'2110.html','2120':'2120.html','2130':'2130.html','2140':'2140.html','2150':'2150.html'
  };
  const stem=(file.match(/^(2000|2010|2012|2020|2021|2022|2023|2024|2025|2026|2027|2028|2029|2030|2040|2050|2060|2070|2080|2090|2100|2110|2120|2130|2140|2150)/)||[])[1];
  const landing=isStatus?'2180.html':(isMaster?'2001.html':(landingMap[stem]||'2000.html'));
  const backToStep=(file!==landing)?`<a href="${RUS_RESOLVE_HREF(landing)}">${isStatus?'กลับ System Status':(isMaster?'กลับ Master System 1':'กลับหน้าหลัก STEP')}</a>`:'';
  const systemTitle = (location.pathname.split("/").pop() === "2000.html") ? "" : "<strong>SYSTEM 1: ระบบลงทะเบียน</strong>";
  bar.innerHTML=`<div>${systemTitle}<span>${info[1]}</span><b>${info[0]}</b></div><div class="s2-tags"><span>ปีการศึกษา 2569</span><span>ภาค 1</span>${backToStep}<a href="${RUS_RESOLVE_HREF('2000.html')}">ดู Flowchart</a></div>`;
  main.insertBefore(bar,main.firstChild);
  if(!document.getElementById('s2-context-style')){
    const st=document.createElement('style');st.id='s2-context-style';
    st.textContent='.s2-context{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:12px 16px;margin-bottom:14px;background:linear-gradient(90deg,#16305f,#2952a3);color:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(20,40,80,.12)}.s2-context>div:first-child{display:flex;gap:13px;align-items:center;flex-wrap:wrap}.s2-context strong{font-size:14px}.s2-context span{font-size:12px;opacity:.9}.s2-context b{font-size:13px}.s2-tags{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.s2-tags span,.s2-tags a{font-size:11.5px;color:#fff;background:rgba(255,255,255,.15);padding:5px 9px;border-radius:20px;text-decoration:none}.s2-tags a{background:#fff;color:#1e3d7a;font-weight:700}@media(max-width:800px){.s2-context{align-items:flex-start;flex-direction:column}}';
    document.head.appendChild(st);
  }
})();


/* ---------- v139 universal interaction guard for prototype ---------- */
(function(){
  function currentSystemLanding(){
    const p=(location.pathname||'').replace(/\\/g,'/');
    const m=p.match(/\/system(\d+)\//i); if(!m) return null;
    const n=Number(m[1]); const map={1:'2000.html',2:'3000.html',3:'4000.html',4:'5000.html',5:'6000.html',6:'7000.html',7:'8000.html',8:'9000.html',9:'10000.html'};
    return map[n]||null;
  }
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.nav-parent[data-label="แดชบอร์ด"]').forEach(function(b){
      if(b.dataset.v139Bound)return; b.dataset.v139Bound='1';
      b.addEventListener('click',function(){ const h=currentSystemLanding(); if(h) location.href=RUS_RESOLVE_HREF(h); });
    });
    function currentSystemSettingHref(){
      const p=(location.pathname||'').replace(/\\/g,'/');
      const m=p.match(/\/system([1-9])\//i);
      const n=m?parseInt(m[1],10):0;
      const map={1:'2180.html',2:'3180.html',3:'4180.html',4:'5100.html',5:'6090.html',6:'7180.html',7:'8180.html',8:'9090.html',9:'10800.html'};
      return map[n]||null;
    }
    document.querySelectorAll('button.nav-parent[data-label="ผู้ใช้งานและสิทธิ์"]').forEach(function(b){
      if(b.dataset.v139Bound)return; b.dataset.v139Bound='1';
      b.addEventListener('click',function(){ const h=currentSystemSettingHref(); if(h) location.href=RUS_RESOLVE_HREF(h+'#users'); });
    });
    document.querySelectorAll('button.nav-parent[data-label="ตั้งค่าระบบ"]').forEach(function(b){
      if(b.dataset.v139Bound)return; b.dataset.v139Bound='1';
      b.addEventListener('click',function(){ const h=currentSystemSettingHref(); if(h) location.href=RUS_RESOLVE_HREF(h); });
    });
    document.querySelectorAll('.user-chip').forEach(function(b){
      if(b.dataset.v139Bound)return; b.dataset.v139Bound='1';
      b.addEventListener('click',function(){
        const who=b.querySelector('.n')?.textContent?.trim()||'ผู้ใช้งาน';
        const role=b.querySelector('.r')?.textContent?.trim()||'';
        alert('ผู้ใช้งานปัจจุบัน: '+who+(role?' · '+role:''));
      });
    });
  });
})();
