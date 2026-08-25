(function(){
  'use strict';
  function toast(msg){
    let t=document.getElementById('rcToast');
    if(!t){t=document.createElement('div');t.id='rcToast';Object.assign(t.style,{position:'fixed',right:'24px',bottom:'24px',zIndex:'99999',background:'#173b73',color:'#fff',padding:'12px 16px',borderRadius:'10px',boxShadow:'0 8px 24px #0003',fontFamily:'Sarabun,sans-serif',maxWidth:'360px',display:'none'});document.body.appendChild(t)}
    t.textContent=msg;t.style.display='block';clearTimeout(t._tm);t._tm=setTimeout(()=>t.style.display='none',2200);
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('button.icon-btn');
    if(b && !b.dataset.rcBound){b.dataset.rcBound='1';toast(b.title==='แจ้งเตือน'?'ไม่มีการแจ้งเตือนใหม่':'เปิดการค้นหาแบบจำลอง');}
    const u=e.target.closest('button.user-chip');if(u){toast('ผู้ใช้งานปัจจุบัน: เจ้าหน้าที่ทะเบียน');}
  });
  window.rcToast=toast;
})();
