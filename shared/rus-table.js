/* ============================================================
   rus-table.js — ลากหัวคอลัมน์เพื่อจัดลำดับเอง (drag-to-reorder)
   - ทำงานอัตโนมัติกับทุก <table> ที่อยู่ใน .tbl-wrap
   - ย้ายทั้งคอลัมน์ (หัว + ข้อมูลทุกแถว) ตามตำแหน่งที่ลากวาง
   - จำลำดับด้วย localStorage (ถ้าเปิดผ่าน http/https; แบบ file:// จะลากได้แต่ไม่จำ)
   - รองรับตารางที่ render ด้วย JS (tbody เปลี่ยนเมื่อ filter) ผ่าน MutationObserver
   ============================================================ */
(function () {
  'use strict';

  // ---- localStorage แบบปลอดภัย (file:// บางเบราว์เซอร์ throw) ----
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };

  // คีย์จำลำดับ: อิงจากชื่อไฟล์ + ลำดับตารางในหน้า
  function tableKey(table, idx) {
    var file = (location.pathname.split('/').pop() || 'index') ;
    return 'rusColOrder:' + file + ':' + idx;
  }

  // อ่านลำดับคอลัมน์ปัจจุบันจาก thead (เป็น array ของ original-index)
  function currentOrder(headRow) {
    return Array.prototype.map.call(headRow.children, function (th) {
      return parseInt(th.getAttribute('data-col'), 10);
    });
  }

  // ใส่ data-col (เลขคอลัมน์ดั้งเดิม) ครั้งแรก ครั้งเดียว
  function tagOriginalIndex(headRow) {
    if (headRow.getAttribute('data-tagged')) return;
    Array.prototype.forEach.call(headRow.children, function (th, i) {
      th.setAttribute('data-col', i);
    });
    headRow.setAttribute('data-tagged', '1');
  }

  // จัดเรียง cell ของแถวหนึ่งตาม order (array ของ original index)
  function reorderRow(row, order) {
    var cells = Array.prototype.slice.call(row.children);
    // map original-index -> cell  (ใช้ data-col ถ้ามี ไม่งั้นใช้ตำแหน่งปัจจุบัน)
    var byOrig = {};
    cells.forEach(function (c, i) {
      var oc = c.getAttribute('data-col');
      byOrig[oc !== null ? parseInt(oc, 10) : i] = c;
    });
    order.forEach(function (origIdx) {
      var c = byOrig[origIdx];
      if (c) row.appendChild(c); // appendChild ย้ายไปท้าย → เรียงตาม order
    });
  }

  // ปรับ tbody ทุกแถวให้ตรงกับ order ปัจจุบันของ thead
  function applyOrderToBody(table, headRow) {
    var order = currentOrder(headRow);
    var bodies = table.querySelectorAll('tbody');
    Array.prototype.forEach.call(bodies, function (tb) {
      Array.prototype.forEach.call(tb.rows, function (row) {
        // ติด data-col ให้ตรงกับลำดับ "ดั้งเดิม" ก่อน (อิงตำแหน่งปัจจุบันเทียบ thead)
        // เนื่องจาก tbody ที่เพิ่ง render ใหม่ จะเรียงตาม original 0..n
        if (!row.getAttribute('data-tagged')) {
          Array.prototype.forEach.call(row.children, function (td, i) {
            td.setAttribute('data-col', i);
          });
          row.setAttribute('data-tagged', '1');
        }
        reorderRow(row, order);
      });
    });
  }

  // บันทึกลำดับ
  function saveOrder(table, idx, headRow) {
    store.set(tableKey(table, idx), JSON.stringify(currentOrder(headRow)));
  }

  // คืนค่าลำดับที่จำไว้ (ถ้ามี) — ใช้ตอนโหลดหน้า
  function restoreOrder(table, idx, headRow) {
    var raw = store.get(tableKey(table, idx));
    if (!raw) return;
    var saved;
    try { saved = JSON.parse(raw); } catch (e) { return; }
    if (!Array.isArray(saved)) return;
    // จัด thead ตาม saved
    var byOrig = {};
    Array.prototype.forEach.call(headRow.children, function (th) {
      byOrig[parseInt(th.getAttribute('data-col'), 10)] = th;
    });
    saved.forEach(function (origIdx) {
      var th = byOrig[origIdx];
      if (th) headRow.appendChild(th);
    });
  }

  // ---- ตั้งค่า drag ให้ thead ----
  function setupHeader(table, idx) {
    var headRow = table.querySelector('thead tr');
    if (!headRow || headRow.getAttribute('data-dnd')) return;
    headRow.setAttribute('data-dnd', '1');

    tagOriginalIndex(headRow);
    restoreOrder(table, idx, headRow);
    applyOrderToBody(table, headRow);

    var dragTh = null;

    Array.prototype.forEach.call(headRow.children, function (th) {
      th.setAttribute('draggable', 'true');
      th.classList.add('rus-draggable-col');

      th.addEventListener('dragstart', function (e) {
        dragTh = th;
        th.classList.add('rus-col-dragging');
        try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); } catch (err) {}
      });

      th.addEventListener('dragend', function () {
        if (dragTh) dragTh.classList.remove('rus-col-dragging');
        clearMarkers(headRow);
        dragTh = null;
      });

      th.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (!dragTh || dragTh === th) return;
        clearMarkers(headRow);
        // ตัดสินซ้าย/ขวาจากตำแหน่งเมาส์
        var rect = th.getBoundingClientRect();
        var after = (e.clientX - rect.left) > rect.width / 2;
        th.classList.add(after ? 'rus-drop-after' : 'rus-drop-before');
      });

      th.addEventListener('drop', function (e) {
        e.preventDefault();
        if (!dragTh || dragTh === th) return;
        var rect = th.getBoundingClientRect();
        var after = (e.clientX - rect.left) > rect.width / 2;
        if (after) th.parentNode.insertBefore(dragTh, th.nextSibling);
        else th.parentNode.insertBefore(dragTh, th);
        clearMarkers(headRow);
        applyOrderToBody(table, headRow);
        saveOrder(table, idx, headRow);
      });
    });

    // re-apply เมื่อ tbody ถูก render ใหม่ (filter/search/context)
    var bodies = table.querySelectorAll('tbody');
    Array.prototype.forEach.call(bodies, function (tb) {
      var obs = new MutationObserver(function () {
        // tbody ใหม่ → ล้าง flag tagged ของแถวเพื่อ re-tag ตาม original
        Array.prototype.forEach.call(tb.rows, function (row) {
          if (!row.getAttribute('data-rus-seen')) {
            row.setAttribute('data-rus-seen', '1');
          }
        });
        applyOrderToBody(table, headRow);
      });
      obs.observe(tb, { childList: true });
    });
  }

  function clearMarkers(headRow) {
    Array.prototype.forEach.call(headRow.children, function (th) {
      th.classList.remove('rus-drop-before', 'rus-drop-after');
    });
  }

  function init() {
    var tables = document.querySelectorAll('.tbl-wrap table');
    Array.prototype.forEach.call(tables, function (t, i) {
      setupHeader(t, i);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // เผื่อหน้าที่ render ตารางหลัง DOMContentLoaded (เช่น context-bar) — ลองซ้ำอีกรอบ
  setTimeout(init, 300);
})();
