
function s7v206Open(id){document.getElementById(id)?.classList.remove('s7-hidden')}
function s7v206Close(id){document.getElementById(id)?.classList.add('s7-hidden')}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.detail-tabs').forEach(tabs=>{
  const buttons=[...tabs.querySelectorAll('button[data-tab]')]; if(!buttons.length)return;
  function show(id){buttons.forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.s7-tab-panel').forEach(p=>p.classList.toggle('active',p.id===id));}
  buttons.forEach(b=>b.addEventListener('click',()=>{show(b.dataset.tab);history.replaceState(null,'','#'+b.dataset.tab)}));
  const hash=location.hash.slice(1); if(hash&&document.getElementById(hash))show(hash); else show(buttons.find(b=>b.classList.contains('active'))?.dataset.tab||buttons[0].dataset.tab);
 });
});
