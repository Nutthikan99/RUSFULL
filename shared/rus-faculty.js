/* ============================================================
   RUS Faculty Master — ทะเบียนคณะ/สาขา (แหล่งข้อมูลกลาง)
   มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ — 6 คณะ
   ใช้ร่วมกันทุกหน้าใน STEP 1 (1011, 1012, 1013 และหน้าฟอร์ม)
   ปรับแก้คณะ/สาขาที่นี่ที่เดียว มีผลทุกหน้า
   ============================================================ */
window.RUS_FACULTIES = [
  { code:"01", short:"ครุศาสตร์ฯ", name:"คณะครุศาสตร์อุตสาหกรรม",
    majors:[
      {code:"0101", name:"วิศวกรรมเครื่องกล (ค.อ.บ.)"},
      {code:"0102", name:"คอมพิวเตอร์และเทคโนโลยี"},
      {code:"0103", name:"วิศวกรรมอิเล็กทรอนิกส์อัจฉริยะและโครงข่าย"},
    ]},
  { code:"02", short:"เกษตรฯ", name:"คณะเทคโนโลยีการเกษตรและอุตสาหกรรมเกษตร",
    majors:[
      {code:"0201", name:"พืชศาสตร์"},
      {code:"0202", name:"สัตวศาสตร์"},
      {code:"0203", name:"วิทยาศาสตร์และเทคโนโลยีการอาหาร"},
      {code:"0204", name:"เพาะเลี้ยงสัตว์น้ำ"},
    ]},
  { code:"03", short:"บริหารธุรกิจฯ", name:"คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ",
    majors:[
      {code:"0301", name:"การบัญชี"},
      {code:"0302", name:"การตลาด"},
      {code:"0303", name:"การจัดการ"},
      {code:"0304", name:"ระบบสารสนเทศและนวัตกรรมดิจิทัล"},
      {code:"0305", name:"เทคโนโลยีสารสนเทศธุรกิจ"},
    ]},
  { code:"04", short:"วิทยาศาสตร์ฯ", name:"คณะวิทยาศาสตร์และเทคโนโลยี",
    majors:[
      {code:"0401", name:"เทคโนโลยีสารสนเทศ"},
      {code:"0402", name:"วิทยาการคอมพิวเตอร์"},
      {code:"0403", name:"วิทยาศาสตร์และเทคโนโลยีสิ่งแวดล้อม"},
    ]},
  { code:"05", short:"วิศวกรรมฯ", name:"คณะวิศวกรรมศาสตร์และสถาปัตยกรรมศาสตร์",
    majors:[
      {code:"0501", name:"วิศวกรรมโยธา"},
      {code:"0502", name:"วิศวกรรมไฟฟ้า"},
      {code:"0503", name:"วิศวกรรมเครื่องกล"},
      {code:"0504", name:"วิศวกรรมอุตสาหการ"},
      {code:"0505", name:"สถาปัตยกรรม"},
    ]},
  { code:"06", short:"ศิลปศาสตร์", name:"คณะศิลปศาสตร์",
    majors:[
      {code:"0601", name:"การท่องเที่ยว"},
      {code:"0602", name:"การโรงแรม"},
      {code:"0603", name:"ภาษาอังกฤษเพื่อการสื่อสารสากล"},
    ]},
];

/* ---------- helper ---------- */
window.RUS = window.RUS || {};

/* เติม dropdown คณะ — เลือก by ชื่อเต็ม; useShort=true ใช้ชื่อย่อ */
window.RUS.fillFaculties = function(sel, opt){
  opt = opt || {};
  if(!sel) return;
  const placeholder = opt.placeholder; // เช่น "ทุกคณะ" หรือ "— เลือกคณะ —"
  let html = placeholder ? `<option value="">${placeholder}</option>` : "";
  window.RUS_FACULTIES.forEach(f=>{
    const label = opt.useShort ? f.short : f.name;
    html += `<option value="${f.code}">${label}</option>`;
  });
  sel.innerHTML = html;
};

/* เติม dropdown สาขา ตามคณะที่เลือก (facCode) — ถ้าไม่ส่ง = ทุกสาขา */
window.RUS.fillMajors = function(sel, facCode, opt){
  opt = opt || {};
  if(!sel) return;
  const placeholder = opt.placeholder;
  let html = placeholder ? `<option value="">${placeholder}</option>` : "";
  const pool = [];
  window.RUS_FACULTIES.forEach(f=>{
    if(!facCode || f.code===facCode){
      f.majors.forEach(m=> pool.push({...m, fac:f}));
    }
  });
  pool.forEach(m=>{
    html += `<option value="${m.code}">${m.name}</option>`;
  });
  sel.innerHTML = html;
  sel.disabled = pool.length===0;
};

/* ผูกคู่ คณะ→สาขา: เมื่อเปลี่ยนคณะ สาขาจะกรองอัตโนมัติ */
window.RUS.linkFacultyMajor = function(facSel, majorSel, opt){
  opt = opt || {};
  if(!facSel || !majorSel) return;
  RUS.fillFaculties(facSel, {placeholder: opt.facPlaceholder, useShort: opt.useShort});
  const refresh = ()=> RUS.fillMajors(majorSel, facSel.value, {placeholder: opt.majorPlaceholder});
  facSel.addEventListener('change', refresh);
  refresh();
};

/* คืนชื่อย่อคณะจาก code */
window.RUS.facShort = function(code){
  const f = window.RUS_FACULTIES.find(x=>x.code===code);
  return f ? f.short : "";
};
window.RUS.facName = function(code){
  const f = window.RUS_FACULTIES.find(x=>x.code===code);
  return f ? f.name : "";
};

/* สร้างแถบ context (ปี/ภาค/คณะ/สาขา) ลงใน element ที่ระบุ
   ใช้: RUS.buildContextBar('ctxBar', {years:[2569,2568,2567], onChange:fn}) */
window.RUS.buildContextBar = function(elId, opt){
  opt = opt || {};
  const host = document.getElementById(elId);
  if(!host) return;
  const years = opt.years || [2569,2568,2567,2566];
  const yearOpts = years.map(y=>`<option value="${y}">ปีการศึกษา ${y}</option>`).join('');
  host.className = 'context-bar';
  host.innerHTML = `
    <div class="ctx-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>บริบทข้อมูล</div>
    <div class="ctx-fld"><label>ปีการศึกษา</label><select id="ctxYear">${yearOpts}</select></div>
    <div class="ctx-fld"><label>ภาคการศึกษา</label><select id="ctxTerm"><option value="1">ภาคต้น (1)</option><option value="2">ภาคปลาย (2)</option><option value="3">ภาคฤดูร้อน (3)</option></select></div>
    <div class="ctx-fld"><label>คณะ</label><select id="ctxFaculty"></select></div>
    <div class="ctx-fld"><label>สาขา</label><select id="ctxMajor"></select></div>`;
  const fac = document.getElementById('ctxFaculty');
  const major = document.getElementById('ctxMajor');
  RUS.linkFacultyMajor(fac, major, {useShort:false, facPlaceholder:'ทุกคณะ', majorPlaceholder:'ทุกสาขา'});
  // อัปเดตป้ายสรุปบริบท (ctxTag) อัตโนมัติ ถ้ามี element นั้นในหน้า
  function readCtx(){return{
    year:document.getElementById('ctxYear').value,
    term:document.getElementById('ctxTerm').value,
    faculty:document.getElementById('ctxFaculty').value,
    major:document.getElementById('ctxMajor').value
  };}
  function syncTag(ctx){
    const tag=document.getElementById('ctxTag');if(!tag)return;
    const facName=ctx.faculty?(RUS.facShort?RUS.facShort(ctx.faculty):ctx.faculty):'ทุกคณะ';
    const majName=ctx.major&&ctx.major!==''?(' · '+(document.querySelector('#ctxMajor option:checked')||{}).textContent):'';
    const term={'1':'ภาคต้น','2':'ภาคปลาย','3':'ภาคฤดูร้อน'}[ctx.term]||'';
    tag.innerHTML='<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> '+ctx.year+' · '+term+' · '+facName+(majName||'');
  }
  ['ctxYear','ctxTerm','ctxFaculty','ctxMajor'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('change', ()=>{const c=readCtx();syncTag(c);if(opt.onChange)opt.onChange(c);});
  });
  // เรียกครั้งแรกเพื่อตั้งค่าป้ายเริ่มต้น
  syncTag(readCtx());
  if(opt.onChange)opt.onChange(readCtx());
};
