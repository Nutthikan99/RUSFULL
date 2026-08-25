(function(){
window.RUSCalendarContext={
  get:function(){try{return JSON.parse(localStorage.getItem('rus_current_calendar')||'null')}catch(e){return null}},
  set:function(x){localStorage.setItem('rus_current_calendar',JSON.stringify(x));},
  clear:function(){localStorage.removeItem('rus_current_calendar')},
  sem:function(s){return String(s)==='3'?'ฤดูร้อน':'ภาค '+s},
  status:function(s){return s==='PUBLISHED'?'ประกาศใช้':s==='CANCELLED'?'ยกเลิก':s==='DRAFT'?'ร่าง':s||'ร่าง'},
  require:function(){let c=this.get();if(!c){alert('กรุณาเลือกปฏิทินจาก “รายการปฏิทินการศึกษา” ก่อน');location.href='2010.html';return null}return c},
  tabs:function(active){let c=this.get();if(!c)return '';let h=c.header||{};let links=[['activities','2010_activities.html','กำหนดกิจกรรมการศึกษา'],['info','2010_info_edit.html','แก้ไขข้อมูลปฏิทิน'],['detail','2010_detail.html','รายละเอียดและตัวอย่างเอกสาร'],['calendar','2010_calendar.html','มุมมองปฏิทิน / Timeline'],['history','2010_history.html','ประวัติการเปลี่ยนแปลง']];return `<div class="calendar-context"><div class="cc-top"><div><b>ปฏิทินที่เลือก:</b> ${h.title||'-'} · ${h.year||'-'} / ${this.sem(h.sem||'')}</div><a class="btn btn-ghost btn-sm" href="2010.html">เปลี่ยนปฏิทิน</a></div><div class="cc-tabs">${links.map(x=>`<a class="${active===x[0]?'on':''}" href="${x[1]}">${x[2]}</a>`).join('')}</div></div>`}
};
})();