(function(){
  const KEY='RUS_S4_PARTIAL_DEMO_V2';
  function initial(){return {
    invoiceId:'INV-6900812', chargeId:'CHG-6900124', payerId:'66012345', payerName:'กิตติพงษ์',
    total:12000, confirmedPaid:0, status:'pending', sequence:0,
    payments:[], receipts:[]
  }}
  function ensure(s){
    if(!Array.isArray(s.payments))s.payments=[];
    if(!Array.isArray(s.receipts))s.receipts=[];
    if(typeof s.confirmedPaid!=='number')s.confirmedPaid=Number(s.confirmedPaid||0);
    return s;
  }
  function load(){
    try{ const raw=localStorage.getItem(KEY); if(raw){ const s=JSON.parse(raw); if(s&&s.invoiceId) return ensure(s); } }catch(e){}
    const s=initial(); save(s); return s;
  }
  function save(s){ localStorage.setItem(KEY,JSON.stringify(ensure(s))); return s; }
  function money(n){return Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function outstanding(s){return Math.max(0, Number(s.total||0)-Number(s.confirmedPaid||0));}
  function addPayment(amount,channel){
    const s=load(), remain=outstanding(s), a=Number(amount);
    if(!(a>0)) throw new Error('กรุณาระบุยอดชำระมากกว่า 0 บาท');
    if(a>remain) throw new Error('ยอดชำระต้องไม่เกินยอดคงเหลือ '+money(remain)+' บาท');
    s.sequence=(s.sequence||0)+1;
    const suffix=String(940+s.sequence);
    const p={
      id:'PAY-690'+suffix,
      txn:'TXN-20260819-'+suffix,
      reference:'PAYREF-6900812',
      amount:a,
      channel:channel||'PromptPay / QR',
      createdAt:new Date().toISOString(),
      status:a<remain?'exception':'received',
      reconciled:false,
      partial:a<remain
    };
    s.payments.push(p); save(s); return p;
  }
  function findPayment(id){return load().payments.find(p=>p.id===id||p.txn===id)||null;}
  function reconcile(id){
    const s=load(); const p=s.payments.find(p=>p.id===id||p.txn===id); if(!p) throw new Error('ไม่พบรายการชำระเงิน');
    if(p.reconciled) return {state:s,payment:p};
    p.reconciled=true; p.status='reconciled';
    s.confirmedPaid=Math.min(s.total, Number(s.confirmedPaid||0)+Number(p.amount||0));
    s.status=s.confirmedPaid>=s.total?'paid':'partial';
    save(s); return {state:s,payment:p};
  }
  function receiptForPayment(paymentId,type){
    const t=type||'receipt'; return load().receipts.find(r=>r.paymentId===paymentId&&r.type===t)||null;
  }
  function issueReceipt(paymentId,type){
    const s=load(), p=s.payments.find(x=>x.id===paymentId||x.txn===paymentId); if(!p)throw new Error('ไม่พบรายการชำระเงิน');
    if(!p.reconciled)throw new Error('ต้องผ่าน STEP 4 กระทบยอดก่อนออกเอกสารการเงิน');
    const t=type||'receipt'; let r=s.receipts.find(x=>x.paymentId===p.id&&x.type===t); if(r)return r;
    const no=(s.receipts.filter(x=>x.type===t).length+711);
    const prefix=t==='tax'?'TAX':'RCPT';
    r={id:prefix+'-690'+no,paymentId:p.id,invoiceId:s.invoiceId,chargeId:s.chargeId,payerId:s.payerId,payerName:s.payerName,amount:Number(p.amount),channel:p.channel,type:t,status:'active',issuedAt:new Date().toISOString(),verification:'VR-'+prefix+'-690'+no};
    s.receipts.push(r); save(s); return r;
  }
  function findReceipt(id){return load().receipts.find(r=>r.id===id||r.verification===id)||null;}
  function cancelReceipt(id,reason){const s=load(),r=s.receipts.find(x=>x.id===id);if(!r)throw new Error('ไม่พบเอกสาร');r.status='cancelled';r.cancelReason=reason||'ยกเลิกเอกสาร';r.cancelledAt=new Date().toISOString();save(s);return r;}

  const samplePayments=[
    {id:'PAY-690901',txn:'TXN-20260818-0901',reference:'PAYREF-6900801',invoiceId:'INV-6900801',chargeId:'CHG-6900101',payerId:'66012345',payerName:'กิตติพงษ์ ศรีสุข',amount:4000,channel:'PromptPay / QR',createdAt:'2026-08-18T09:10:00+07:00',reconciled:true,status:'reconciled',source:'SYSTEM 1'},
    {id:'PAY-690902',txn:'TXN-20260818-0902',reference:'PAYREF-6900801',invoiceId:'INV-6900801',chargeId:'CHG-6900101',payerId:'66012345',payerName:'กิตติพงษ์ ศรีสุข',amount:8000,channel:'Mobile Banking',createdAt:'2026-08-18T14:35:00+07:00',reconciled:true,status:'reconciled',source:'SYSTEM 1'},
    {id:'PAY-690903',txn:'TXN-20260818-0903',reference:'PAYREF-6900802',invoiceId:'INV-6900802',chargeId:'CHG-6900102',payerId:'66020567',payerName:'พิมพ์ชนก แสงทอง',amount:2500,channel:'Counter Service',createdAt:'2026-08-18T15:20:00+07:00',reconciled:true,status:'reconciled',source:'SYSTEM 3'},
    {id:'PAY-690903A',txn:'TXN-20260816-0899',reference:'PAYREF-6900799',invoiceId:'INV-6900799',chargeId:'CHG-6900099',payerId:'66019876',payerName:'ณัฐวุฒิ ใจดี',amount:1500,channel:'PromptPay / QR',createdAt:'2026-08-16T10:15:00+07:00',reconciled:true,status:'reconciled',source:'SYSTEM 1'},
    {id:'PAY-690904',txn:'TXN-20260817-0904',reference:'PAYREF-6900803',invoiceId:'INV-6900803',chargeId:'CHG-6900103',payerId:'A69001234',payerName:'ธนกฤต มีสุข',amount:500,channel:'Bank',createdAt:'2026-08-17T11:05:00+07:00',reconciled:true,status:'reconciled',source:'SYSTEM 9'}
  ];
  const sampleReceipts=[
    {id:'RCPT-690701',paymentId:'PAY-690901',invoiceId:'INV-6900801',chargeId:'CHG-6900101',payerId:'66012345',payerName:'กิตติพงษ์ ศรีสุข',amount:4000,channel:'PromptPay / QR',type:'receipt',status:'active',issuedAt:'2026-08-18T09:15:00+07:00',verification:'VR-RCPT-690701'},
    {id:'RCPT-690702',paymentId:'PAY-690902',invoiceId:'INV-6900801',chargeId:'CHG-6900101',payerId:'66012345',payerName:'กิตติพงษ์ ศรีสุข',amount:8000,channel:'Mobile Banking',type:'receipt',status:'active',issuedAt:'2026-08-18T14:40:00+07:00',verification:'VR-RCPT-690702'},
    {id:'RCPT-690703',paymentId:'PAY-690903',invoiceId:'INV-6900802',chargeId:'CHG-6900102',payerId:'66020567',payerName:'พิมพ์ชนก แสงทอง',amount:2500,channel:'Counter Service',type:'receipt',status:'active',issuedAt:'2026-08-18T15:25:00+07:00',verification:'VR-RCPT-690703'},
    {id:'TAX-690301',paymentId:'PAY-690904',invoiceId:'INV-6900803',chargeId:'CHG-6900103',payerId:'A69001234',payerName:'ธนกฤต มีสุข',amount:500,channel:'Bank',type:'tax',status:'active',issuedAt:'2026-08-17T11:10:00+07:00',verification:'VR-TAX-690301'},
    {id:'RCPT-690699',paymentId:'PAY-690903A',invoiceId:'INV-6900799',chargeId:'CHG-6900099',payerId:'66019876',payerName:'ณัฐวุฒิ ใจดี',amount:1500,channel:'PromptPay / QR',type:'receipt',status:'cancelled',issuedAt:'2026-08-16T10:20:00+07:00',verification:'VR-RCPT-690699',cancelReason:'ออกเอกสารซ้ำโดยผิดรายการ'}
  ];
  function samplePayment(id){return samplePayments.find(p=>p.id===id||p.txn===id)||null;}
  function sampleReceipt(id){return sampleReceipts.find(r=>r.id===id||r.verification===id)||null;}
  function findAnyPayment(id){return findPayment(id)||samplePayment(id);}
  function findAnyReceipt(id){return findReceipt(id)||sampleReceipt(id);}

  function reset(){const s=initial(); save(s); return s;}
  window.S4PartialDemo={load,save,money,outstanding,addPayment,findPayment,reconcile,receiptForPayment,issueReceipt,findReceipt,cancelReceipt,reset,key:KEY,samplePayments,sampleReceipts,samplePayment,sampleReceipt,findAnyPayment,findAnyReceipt};
})();
