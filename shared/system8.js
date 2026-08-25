const mt=document.getElementById('menuToggle');if(mt)mt.addEventListener('click',()=>{const a=document.getElementById('app');if(innerWidth<=980)a.classList.toggle('mobile-open');else a.classList.toggle('collapsed')});

function showTab(id,btn){
  const panel=document.getElementById(id);
  if(!panel)return false;
  const tabs=btn?.closest('.detail-tabs')||document.querySelector('.detail-tabs');
  const scope=tabs?.parentElement||document;
  scope.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
  if(tabs)tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
  panel.classList.add('active');
  if(btn)btn.classList.add('active');
  try{history.replaceState(null,'','#'+id)}catch(e){}
  return false;
}

function closeModal(){document.getElementById('modal')?.classList.remove('open')}
function toast(m){let t=document.getElementById('rusToast');if(!t){t=document.createElement('div');t.id='rusToast';Object.assign(t.style,{position:'fixed',right:'24px',top:'88px',zIndex:'99999',background:'#0f766e',color:'#fff',padding:'12px 18px',borderRadius:'10px',boxShadow:'0 8px 30px rgba(0,0,0,.18)',fontFamily:'Kanit,sans-serif',transition:'opacity .2s'});document.body.appendChild(t)}t.textContent=m;t.style.opacity='1';clearTimeout(window.__rusToast);window.__rusToast=setTimeout(()=>t.style.opacity='0',1800)}
function toggleAdvanced(id='advancedFilters'){const e=document.getElementById(id); if(e)e.classList.toggle('open')}
function demoSearch(btn){const root=(btn&&btn.closest('.section'))||document.querySelector('.section')||document;const q=(root.querySelector('input')?.value||'').trim().toLowerCase();const sels=[...root.querySelectorAll('select')].map(x=>x.value).filter(v=>v&&!/^ทุก|ทั้งหมด|2569$/.test(v));let shown=0;root.querySelectorAll('table tbody tr').forEach(tr=>{const tx=tr.innerText.toLowerCase();const okQ=!q||tx.includes(q);const okS=sels.every(v=>tx.includes(v.toLowerCase())||['รอดำเนินการ','ดำเนินการแล้ว','เปิดรับสมัคร','ปิดรับสมัคร'].includes(v));tr.style.display=(okQ&&okS)?'':'none';if(okQ&&okS)shown++});toast('แสดงผล '+shown+' รายการตามเงื่อนไข')}
function clearFilters(btn){const root=(btn&&btn.closest('.section'))||document;root.querySelectorAll('input').forEach(x=>{if(x.type!=='date'&&x.type!=='file')x.value=''});root.querySelectorAll('select').forEach(x=>x.selectedIndex=0);root.querySelectorAll('table tbody tr').forEach(tr=>tr.style.display='');toast('ล้างตัวกรองแล้ว')}
function submitAndGo(msg,url){toast(msg);setTimeout(()=>location.href=url,450);return false}
function updateStatus(msg,status='ดำเนินการแล้ว'){toast(msg);const badge=document.querySelector('.status-pill,.badge,.pill');if(badge)badge.textContent=status;document.querySelectorAll('[data-status-target]').forEach(e=>e.textContent=status);return false}
function exportNearest(btn,filename='report.csv'){const table=(btn.closest('.section')||document).querySelector('table');if(!table){toast('ไม่พบตารางสำหรับ Export');return}const rows=[...table.querySelectorAll('tr')].map(r=>[...r.children].map(c=>'"'+c.innerText.replace(/"/g,'""').replace(/\n/g,' ')+'"').join(','));const blob=new Blob(['\ufeff'+rows.join('\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('สร้างไฟล์รายงานแล้ว')}
function setTabFromHash(){const h=location.hash.replace('#','');if(!h)return;const b=[...document.querySelectorAll('.detail-tabs button')].find(x=>x.getAttribute('onclick')?.includes("'"+h+"'"));if(b)b.click()}
window.addEventListener('DOMContentLoaded',()=>{setTabFromHash();document.querySelectorAll('button').forEach(b=>{if(b.textContent.trim()==='ค้นหา'&&b.getAttribute('onclick')==='demoSearch()')b.setAttribute('onclick','demoSearch(this)');if(b.textContent.includes('ล้างตัวกรอง')&&b.getAttribute('onclick')?.includes('toast('))b.setAttribute('onclick','clearFilters(this)')});});

function filterSemester(value,btn,scopeId){
  const scope=scopeId?document.getElementById(scopeId):btn?.closest('.section'); if(!scope)return;
  scope.querySelectorAll('.semester-tab').forEach(x=>x.classList.remove('active')); if(btn)btn.classList.add('active');
  scope.querySelectorAll('[data-semester]').forEach(el=>{el.style.display=(value==='all'||el.dataset.semester===value)?'':'none'});
}

/* v227 entity autocomplete */
(function(){
const DATA={student:[
{id:'669120001',name:'กมลชนก วัฒนชัย',meta:'ปริญญาโท · วศ.ม. วิศวกรรมคอมพิวเตอร์ · เข้า 2569'},
{id:'668230014',name:'พิมพ์ชนก แก้วดี',meta:'ปริญญาเอก · ปร.ด. เทคโนโลยีสารสนเทศ · เข้า 2568'},
{id:'667310088',name:'ณัฐวุฒิ สุขใจ',meta:'ปริญญาโท · บธ.ม. บริหารธุรกิจ · เข้า 2567'},
{id:'669220015',name:'ธนภัทร ศรีสุข',meta:'ปริญญาเอก · ปร.ด. วิศวกรรมไฟฟ้า · เข้า 2569'},
{id:'668120022',name:'ชนิกานต์ มีชัย',meta:'ปริญญาโท · วศ.ม. วิศวกรรมคอมพิวเตอร์ · เข้า 2568'},
{id:'669330041',name:'ศิริพร แก้วดี',meta:'ปริญญาโท · บธ.ม. บริหารธุรกิจ · เข้า 2569'},
{id:'668410067',name:'ธนกร มีสุข',meta:'ปริญญาเอก · ปร.ด. เทคโนโลยีสารสนเทศ · เข้า 2568'}],teacher:[
{id:'T001',name:'ผศ.ดร.สมชาย ใจดี',meta:'วิศวกรรมคอมพิวเตอร์ · ภาระควบคุม 5/8 คน'},
{id:'T002',name:'รศ.ดร.กมลพร พรชัย',meta:'เทคโนโลยีสารสนเทศ · ภาระควบคุม 4/8 คน'},
{id:'T003',name:'อ.ดร.นภัสกร สุขใจ',meta:'วิทยาการข้อมูล · ภาระควบคุม 3/8 คน'},
{id:'T004',name:'ศ.ดร.ปริญญา วัฒนะ',meta:'วิศวกรรมไฟฟ้า · ภาระควบคุม 6/8 คน'},
{id:'T005',name:'รศ.ดร.สุรีย์ พรชัย',meta:'บริหารธุรกิจ · ภาระควบคุม 2/8 คน'}]};
window.SYSTEM8_ENTITY_DATA=DATA;
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function init(box){if(box.dataset.ready==='1')return;box.dataset.ready='1';const type=box.dataset.entity||'student',input=box.querySelector('.entity-search-input'),hidden=box.querySelector('input[type=hidden]'),results=box.querySelector('.entity-results'),selected=box.querySelector('.entity-selected'),data=DATA[type]||[];function render(q){const term=(q||'').trim().toLowerCase();if(!term){results.classList.remove('open');return;}const list=data.filter(x=>(x.id+' '+x.name+' '+x.meta).toLowerCase().includes(term)).slice(0,8);results.innerHTML=list.length?list.map(x=>`<button type="button" class="entity-option" data-id="${x.id}"><b>${x.id} · ${x.name}</b><small>${x.meta}</small></button>`).join(''):`<div class="entity-empty">ไม่พบข้อมูล</div>`;results.classList.add('open');results.querySelectorAll('.entity-option').forEach(btn=>btn.onclick=()=>{const x=data.find(v=>v.id===btn.dataset.id);input.value=x.id+' '+x.name;if(hidden)hidden.value=x.id;if(selected){selected.hidden=false;selected.innerHTML=`<b>${x.id} · ${x.name}</b><br><small>${x.meta}</small>`;}results.classList.remove('open');box.dispatchEvent(new CustomEvent('entityselected',{bubbles:true,detail:x}));});}input.addEventListener('input',()=>render(input.value));input.addEventListener('focus',()=>{if(input.value.trim())render(input.value)});document.addEventListener('click',e=>{if(!box.contains(e.target))results.classList.remove('open')});}
function boot(){document.querySelectorAll('.entity-search').forEach(init)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.initSystem8EntitySearch=boot;})();
