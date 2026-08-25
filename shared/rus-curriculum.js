/* RMUTSB Curriculum Master Data v5 — โครงสร้างหลักสูตรเป็น Parent ของหลักสูตร */
(function(){
  const seed={
    meta:{source:'ระบบ 2 › STEP 2 โครงสร้างหลักสูตรและข้อมูลการศึกษา',version:'2569.6',campusDefault:'ศูนย์หันตรา (สำนักงานอธิการบดี)',updated:'4 สิงหาคม 2569',hierarchy:'STRUCTURE_PROGRAMME_CATEGORY_GROUP_TYPE_SUBJECT'},
    structures:[
      {id:'STR-UG-2566',code:'STRUCT-UG-2566',name:'โครงสร้างหลักสูตรระดับปริญญาตรี พ.ศ. 2566',level:'ปริญญาตรี',curriculumYear:'2566',totalCredits:120,graduationCondition:'เป็นไปตามเกณฑ์มาตรฐานหลักสูตรและข้อบังคับมหาวิทยาลัย',status:'ACTIVE'},
      {id:'STR-UG-2565',code:'STRUCT-UG-2565',name:'โครงสร้างหลักสูตรระดับปริญญาตรี พ.ศ. 2565',level:'ปริญญาตรี',curriculumYear:'2565',totalCredits:149,graduationCondition:'เป็นไปตามเกณฑ์มาตรฐานหลักสูตรและข้อบังคับมหาวิทยาลัย',status:'ACTIVE'}
    ],
    programmes:[
      {id:'PRG-BIT',structureId:'STR-UG-2566',code:'BBA-BIT',name:'บริหารธุรกิจบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศธุรกิจ',faculty:'คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ',department:'สาขาวิชาเทคโนโลยีสารสนเทศธุรกิจ',status:'ACTIVE'},
      {id:'PRG-CE',structureId:'STR-UG-2565',code:'ENG-CE',name:'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมโยธา',faculty:'คณะวิศวกรรมศาสตร์และสถาปัตยกรรมศาสตร์',department:'สาขาวิชาวิศวกรรมโยธา',status:'ACTIVE'}
    ],
    categoryMasters:[
      {id:'CAT-GE',code:'GE',name:'หมวดวิชาศึกษาทั่วไป',status:'ACTIVE'},
      {id:'CAT-SPEC',code:'SPEC',name:'หมวดวิชาเฉพาะ',status:'ACTIVE'},
      {id:'CAT-FREE',code:'FREE',name:'หมวดวิชาเลือกเสรี',status:'ACTIVE'}
    ],
    groupMasters:[
      {id:'GRP-GE-LANG',categoryId:'CAT-GE',code:'GE-LANG',name:'กลุ่มวิชาภาษาและการสื่อสาร',status:'ACTIVE'},
      {id:'GRP-GE-SCI',categoryId:'CAT-GE',code:'GE-SCI',name:'กลุ่มวิชาคณิตศาสตร์และวิทยาศาสตร์',status:'ACTIVE'},
      {id:'GRP-CORE',categoryId:'CAT-SPEC',code:'CORE',name:'กลุ่มวิชาชีพพื้นฐาน',status:'ACTIVE'},
      {id:'GRP-PROF',categoryId:'CAT-SPEC',code:'PROF',name:'กลุ่มวิชาชีพเฉพาะด้าน',status:'ACTIVE'},
      {id:'GRP-FREE',categoryId:'CAT-FREE',code:'FREE',name:'กลุ่มวิชาเลือกเสรี',status:'ACTIVE'}
    ],
    typeMasters:[
      {id:'TYPE-REQ',code:'REQUIRED',name:'วิชาบังคับ',status:'ACTIVE'},
      {id:'TYPE-SPEC',code:'SPECIFIC',name:'วิชาเฉพาะ',status:'ACTIVE'}
    ],
    subjectMasters:[
      {id:'SUB-THAI',code:'00-011-101',name:'ภาษาไทยเพื่อการสื่อสาร',status:'ACTIVE',detailStatus:'PENDING'},
      {id:'SUB-ENG',code:'00-012-101',name:'ภาษาอังกฤษเพื่อการสื่อสาร',status:'ACTIVE',detailStatus:'PENDING'},
      {id:'SUB-BIT101',code:'03-411-101',name:'หลักการเขียนโปรแกรม',status:'ACTIVE',detailStatus:'PENDING'},
      {id:'SUB-BIT102',code:'03-411-102',name:'ระบบฐานข้อมูล',status:'ACTIVE',detailStatus:'PENDING'},
      {id:'SUB-BIT301',code:'03-411-301',name:'การพัฒนาเว็บแอปพลิเคชัน',status:'ACTIVE',detailStatus:'PENDING'},
      {id:'SUB-FREE101',code:'00-000-901',name:'รายวิชาเลือกเสรี',status:'ACTIVE',detailStatus:'PENDING'}
    ],
    curriculumCategories:[
      {id:'CC-BIT-GE',programmeId:'PRG-BIT',categoryId:'CAT-GE',minCredits:30,sortOrder:1,status:'ACTIVE'},
      {id:'CC-BIT-SPEC',programmeId:'PRG-BIT',categoryId:'CAT-SPEC',minCredits:84,sortOrder:2,status:'ACTIVE'},
      {id:'CC-BIT-FREE',programmeId:'PRG-BIT',categoryId:'CAT-FREE',minCredits:6,sortOrder:3,status:'ACTIVE'}
    ],
    curriculumGroups:[
      {id:'CG-BIT-LANG',curriculumCategoryId:'CC-BIT-GE',groupId:'GRP-GE-LANG',minCredits:12,sortOrder:1,status:'ACTIVE'},
      {id:'CG-BIT-CORE',curriculumCategoryId:'CC-BIT-SPEC',groupId:'GRP-CORE',minCredits:30,sortOrder:1,status:'ACTIVE'},
      {id:'CG-BIT-PROF',curriculumCategoryId:'CC-BIT-SPEC',groupId:'GRP-PROF',minCredits:45,sortOrder:2,status:'ACTIVE'},
      {id:'CG-BIT-FREE',curriculumCategoryId:'CC-BIT-FREE',groupId:'GRP-FREE',minCredits:6,sortOrder:1,status:'ACTIVE'}
    ],
    curriculumTypes:[
      {id:'CT-LANG-REQ',curriculumGroupId:'CG-BIT-LANG',typeId:'TYPE-REQ',minCredits:6,rule:'ต้องเรียนครบตามที่หลักสูตรกำหนด',status:'ACTIVE'},
      {id:'CT-CORE-REQ',curriculumGroupId:'CG-BIT-CORE',typeId:'TYPE-REQ',minCredits:9,rule:'ต้องเรียนครบทุกวิชาที่กำหนด',status:'ACTIVE'},
      {id:'CT-PROF-SPEC',curriculumGroupId:'CG-BIT-PROF',typeId:'TYPE-SPEC',minCredits:3,rule:'เลือกเรียนตามจำนวนหน่วยกิตขั้นต่ำ',status:'ACTIVE'},
      {id:'CT-FREE-SPEC',curriculumGroupId:'CG-BIT-FREE',typeId:'TYPE-SPEC',minCredits:6,rule:'เลือกเรียนไม่น้อยกว่า 6 หน่วยกิต',status:'ACTIVE'}
    ],
    curriculumSubjects:[
      ['CS1','CT-LANG-REQ','SUB-THAI'],['CS2','CT-LANG-REQ','SUB-ENG'],['CS3','CT-CORE-REQ','SUB-BIT101'],['CS4','CT-CORE-REQ','SUB-BIT102'],['CS5','CT-PROF-SPEC','SUB-BIT301'],['CS6','CT-FREE-SPEC','SUB-FREE101']
    ].map(x=>({id:x[0],curriculumTypeId:x[1],subjectId:x[2],status:'ACTIVE'})),
    auditLog:[]
  };
  const key='RUS_CURRICULUM_V6';
  let data; try{data=JSON.parse(localStorage.getItem(key)||'null')}catch(e){data=null}
  if(!data || !data.meta || data.meta.version!==seed.meta.version){data=JSON.parse(JSON.stringify(seed));localStorage.setItem(key,JSON.stringify(data));}
  window.RUS_CURRICULUM=data;
  const by=(arr,id)=>arr.find(x=>x.id===id);
  const uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
  const map={structure:'structures',programme:'programmes',categoryMaster:'categoryMasters',groupMaster:'groupMasters',typeMaster:'typeMasters',subjectMaster:'subjectMasters',curriculumCategory:'curriculumCategories',curriculumGroup:'curriculumGroups',curriculumType:'curriculumTypes',curriculumSubject:'curriculumSubjects'};
  const api={data,uid,
    save(){localStorage.setItem(key,JSON.stringify(data));},reset(){localStorage.removeItem(key);location.reload();},
    structure:id=>by(data.structures,id),programme:id=>by(data.programmes,id),category:id=>by(data.categoryMasters,id),group:id=>by(data.groupMasters,id),type:id=>by(data.typeMasters,id),subject:id=>by(data.subjectMasters,id),
    programmesForStructure(id){return data.programmes.filter(x=>x.structureId===id)},
    categoriesForProgramme(id){return data.curriculumCategories.filter(x=>x.programmeId===id).sort((a,b)=>a.sortOrder-b.sortOrder)},
    groupsForCategory(id){return data.curriculumGroups.filter(x=>x.curriculumCategoryId===id).sort((a,b)=>a.sortOrder-b.sortOrder)},
    typesForGroup(id){return data.curriculumTypes.filter(x=>x.curriculumGroupId===id)},
    subjectsForType(id){return data.curriculumSubjects.filter(x=>x.curriculumTypeId===id).map(x=>Object.assign({},x,{subject:by(data.subjectMasters,x.subjectId)}))},
    add(entity,record){const arr=data[map[entity]];if(!arr) return false;record.id=record.id||uid(entity.toUpperCase());record.status=record.status||'ACTIVE';arr.push(record);data.auditLog.push({action:'CREATE',entity,id:record.id,at:new Date().toISOString()});this.save();return record;},
    update(entity,id,patch){const rec=by(data[map[entity]]||[],id);if(!rec)return false;Object.assign(rec,patch);data.auditLog.push({action:'UPDATE',entity,id,at:new Date().toISOString()});this.save();return rec;},
    setInactive(entity,id,reason){const rec=by(data[map[entity]]||[],id);if(!rec)return false;rec.status='INACTIVE';rec.inactiveAt=new Date().toISOString();rec.inactiveReason=reason||'ยกเลิกการใช้งาน';data.auditLog.push({action:'INACTIVE',entity,id,at:rec.inactiveAt,reason:rec.inactiveReason});this.save();return true;},
    reactivate(entity,id){const rec=by(data[map[entity]]||[],id);if(!rec)return false;rec.status='ACTIVE';delete rec.inactiveAt;delete rec.inactiveReason;data.auditLog.push({action:'REACTIVATE',entity,id,at:new Date().toISOString()});this.save();return true;}
  };
  window.RUSCurriculum=api;
})();
