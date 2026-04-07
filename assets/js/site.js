(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalisePath(pathname) {
    pathname = (pathname || '').split('?')[0].split('#')[0];
    if (pathname.endsWith('/')) pathname += 'index.html';
    return pathname.toLowerCase();
  }

  function initActiveNav() {
    const current = normalisePath(location.pathname);
    document.querySelectorAll('a[data-nav], .nav a[href]').forEach(function (a) {
      try {
        const href = a.getAttribute('href') || '';
        if (/^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
        const hrefPath = normalisePath(new URL(href, location.origin).pathname);
        if (hrefPath === current) {
          a.classList.add('active');
          a.classList.add('is-active');
          a.setAttribute('aria-current', 'page');
        }
      } catch (e) {}
    });
  }

  function initLanguageMenu() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangText = document.getElementById('currentLangText');
    const currentLangFlag = document.getElementById('currentLangFlag');
    const langOptions = document.querySelectorAll('.lang-option');
    if (!langBtn || !langDropdown || !currentLangText || !currentLangFlag || !langOptions.length) return;

    const path = window.location.pathname.toLowerCase();
    const fileName = (path.split('/').pop() || 'index.html').toLowerCase();
    let currentCode = 'en';
    if (path.indexOf('/vi/') !== -1) currentCode = 'vi';
    else if (path.indexOf('/cn/') !== -1) currentCode = 'zh';
    else if (path.indexOf('/hi/') !== -1) currentCode = 'hi';
    else if (path.indexOf('/es/') !== -1) currentCode = 'es';

    langOptions.forEach(function (option) {
      const code = option.getAttribute('data-lang');
      const label = option.getAttribute('data-label');
      const optionIcon = option.querySelector('img, svg');
      if (code === currentCode) {
        currentLangText.textContent = label;
        currentLangText.setAttribute('aria-hidden', 'false');
        if (optionIcon && optionIcon.tagName && optionIcon.tagName.toLowerCase() === 'img') {
          currentLangFlag.src = optionIcon.getAttribute('src');
          currentLangFlag.alt = label;
          currentLangFlag.hidden = false;
        } else {
          currentLangFlag.hidden = true;
        }
        option.classList.add('active');
      }
      option.addEventListener('click', function () {
        let target = 'index.html';
        if (code === 'vi') target = 'vi/' + fileName;
        else if (code === 'zh') target = 'cn/' + fileName;
        else if (code === 'hi') target = 'hi/' + fileName;
        else if (code === 'es') target = 'es/' + fileName;
        if (currentCode !== 'en') {
          target = code === 'en' ? '../' + fileName : '../' + target;
        }
        window.location.href = target;
      });
    });

    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !langDropdown.hasAttribute('hidden');
      if (isOpen) {
        langDropdown.setAttribute('hidden', '');
        langBtn.setAttribute('aria-expanded', 'false');
      } else {
        langDropdown.removeAttribute('hidden');
        langBtn.setAttribute('aria-expanded', 'true');
      }
    });

    langDropdown.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () {
      langDropdown.setAttribute('hidden', '');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function initQuicklinks() {
    document.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-open');
        var target = document.getElementById(id);
        if (!target) return;
        if (target.tagName && target.tagName.toLowerCase() === 'details') target.open = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initPricingTool() {
    if (!document.getElementById('priceBody')) return;

    var pathLower = window.location.pathname.toLowerCase();
    var docLang = (document.documentElement.lang || '').toLowerCase();
    var bodyLang = ((document.body && document.body.getAttribute('data-page-lang')) || '').toLowerCase();
    var forcedLang = ((window.__MMM_LANG || '') + '').toLowerCase();

    function startsWithAny(value, prefixes) {
      return prefixes.some(function (prefix) { return value.indexOf(prefix) === 0; });
    }

    var pageIsZh = (document.body && document.body.classList.contains('page-cn')) || pathLower.indexOf('/cn/') !== -1 || startsWithAny(bodyLang, ['zh','cn']) || startsWithAny(docLang, ['zh','cn']) || startsWithAny(forcedLang, ['zh','cn']);
    var pageIsVi = !pageIsZh && ((document.body && document.body.classList.contains('page-vi')) || pathLower.indexOf('/vi/') !== -1 || startsWithAny(bodyLang, ['vi']) || startsWithAny(docLang, ['vi']) || startsWithAny(forcedLang, ['vi']));
    var isVi = pageIsVi;
    var isZh = pageIsZh;

    function t(en, vi, zh) {
      return isVi ? vi : (isZh ? zh : en);
    }

    var rows = isVi ? [
      { icon:'👩‍🏫', program:'1 kèm 1', p30:{ online:55, inperson:60 }, p60:{ online:100, inperson:110 } },
      { icon:'👩‍👦', program:'2 học sinh', p30:{ online:45, inperson:50 }, p60:{ online:80, inperson:90 } },
      { icon:'👨‍👩‍👧', program:'3 học sinh', p30:{ online:35, inperson:40 }, p60:{ online:60, inperson:70 } },
      { icon:'👨‍👩‍👧‍👦', program:'4 học sinh', p30:{ online:30, inperson:35 }, p60:{ online:50, inperson:60 } },
      { icon:'👨‍👩‍👧‍👦🧑', program:'5 học sinh', p30:{ online:25, inperson:30 }, p60:{ online:40, inperson:50 }, min60:true },
      { icon:'👨‍👩‍👧‍👦🧑+', program:'5+ học sinh', p30:{ online:20, inperson:25 }, p60:{ online:35, inperson:45 }, min60:true }
    ] : isZh ? [
      { icon:'👩‍🏫', program:'一对一', p30:{ online:55, inperson:60 }, p60:{ online:100, inperson:110 } },
      { icon:'👩‍👦', program:'2 位学生', p30:{ online:45, inperson:50 }, p60:{ online:80, inperson:90 } },
      { icon:'👨‍👩‍👧', program:'3 位学生', p30:{ online:35, inperson:40 }, p60:{ online:60, inperson:70 } },
      { icon:'👨‍👩‍👧‍👦', program:'4 位学生', p30:{ online:30, inperson:35 }, p60:{ online:50, inperson:60 } },
      { icon:'👨‍👩‍👧‍👦🧑', program:'5 位学生', p30:{ online:25, inperson:30 }, p60:{ online:40, inperson:50 }, min60:true },
      { icon:'👨‍👩‍👧‍👦🧑+', program:'5 位以上学生', p30:{ online:20, inperson:25 }, p60:{ online:35, inperson:45 }, min60:true }
    ] : [
      { icon:'👩‍🏫', program:'One-to-One', p30:{ online:55, inperson:60 }, p60:{ online:100, inperson:110 } },
      { icon:'👩‍👦', program:'2 students', p30:{ online:45, inperson:50 }, p60:{ online:80, inperson:90 } },
      { icon:'👨‍👩‍👧', program:'3 students', p30:{ online:35, inperson:40 }, p60:{ online:60, inperson:70 } },
      { icon:'👨‍👩‍👧‍👦', program:'4 students', p30:{ online:30, inperson:35 }, p60:{ online:50, inperson:60 } },
      { icon:'👨‍👩‍👧‍👦🧑', program:'5 students', p30:{ online:25, inperson:30 }, p60:{ online:40, inperson:50 }, min60:true },
      { icon:'👨‍👩‍👧‍👦🧑+', program:'5+ students', p30:{ online:20, inperson:25 }, p60:{ online:35, inperson:45 }, min60:true }
    ];

    var adjustments = isVi ? {
      primary:{ add30:-5, add60:-10, badge:'Điều chỉnh Tiểu học', rule:'Toán Tiểu học: –$5 (30 phút) và –$10 (60 phút) mỗi học sinh.', extra:'Gợi ý: nếu con bạn cần bồi dưỡng hoặc nâng cao, hãy hỏi về lộ trình phù hợp.' },
      mid:{ add30:0, add60:0, badge:'Giá chuẩn', rule:'Toán Lớp 7–10: giá chuẩn (không điều chỉnh).', extra:'Gợi ý: buổi 60 phút có thêm thời gian luyện tập + phản hồi.' },
      vce:{ extra:'Với Toán VCE, chúng tôi khuyến nghị mạnh mẽ buổi 60 phút.' }
    } : isZh ? {
      primary:{ add30:-5, add60:-10, badge:'小学阶段调整', rule:'小学数学：每位学生 30 分钟减 $5，60 分钟减 $10。', extra:'提示：如果孩子需要巩固或拔高，请咨询适合的学习方案。' },
      mid:{ add30:0, add60:0, badge:'标准收费', rule:'7–10 年级数学：标准收费（不作调整）。', extra:'提示：60 分钟课程能提供更多练习与反馈。' },
      vce:{ extra:'对于 VCE 数学，我们强烈建议选择 60 分钟课程。' }
    } : {
      primary:{ add30:-5, add60:-10, badge:'Primary adjustment', rule:'Primary Maths: –$5 (30 min) and –$10 (60 min) per student.', extra:'Tip: If your child needs enrichment or extension, ask about a tailored plan.' },
      mid:{ add30:0, add60:0, badge:'Standard pricing', rule:'Years 7–10 Maths: standard pricing (no adjustment).', extra:'Tip: 60-minute sessions allow more practice + feedback.' },
      vce:{ extra:'For VCE Maths, 60-minute sessions are strongly recommended.' }
    };

    var vceSubjects = isVi ? {
      general:{ add30:+10, add60:+15, label:'VCE Toán Tổng quát: +$10 (30) và +$15 (60) mỗi học sinh.' },
      methods:{ add30:+15, add60:+20, label:'VCE Toán Phương pháp: +$15 (30) và +$20 (60) mỗi học sinh.' },
      specialist:{ add30:+20, add60:+25, label:'VCE Toán Chuyên sâu: +$20 (30) và +$25 (60) mỗi học sinh.' }
    } : isZh ? {
      general:{ add30:+10, add60:+15, label:'VCE 普通数学：每位学生 30 分钟加 $10，60 分钟加 $15。' },
      methods:{ add30:+15, add60:+20, label:'VCE 数学方法：每位学生 30 分钟加 $15，60 分钟加 $20。' },
      specialist:{ add30:+20, add60:+25, label:'VCE 专业数学：每位学生 30 分钟加 $20，60 分钟加 $25。' }
    } : {
      general:{ add30:+10, add60:+15, label:'VCE General Maths: +$10 (30) and +$15 (60) per student.' },
      methods:{ add30:+15, add60:+20, label:'VCE Maths Methods: +$15 (30) and +$20 (60) per student.' },
      specialist:{ add30:+20, add60:+25, label:'VCE Specialist Maths: +$20 (30) and +$25 (60) per student.' }
    };

    var tracks = isVi ? {
      standard:{ add30:0, add60:0, name:'Chuẩn', label:'Dạy kèm chuẩn: +$0.', min60:false, extra:'Trọng tâm: bám sát ở trường, hỗ trợ bài tập, xây tự tin.' },
      extension:{ add30:+5, add60:+10, name:'Nâng cao', label:'Nâng cao: +$5 (30) và +$10 (60) mỗi học sinh.', min60:false, extra:'Trọng tâm: bồi dưỡng, hiểu sâu, bài nâng cao.' },
      selective:{ add30:+10, add60:+20, name:'Thi tuyển chọn', label:'Thi tuyển chọn: +$10 (30) và +$20 (60) mỗi học sinh.', min60:true, extra:'Trọng tâm: kỹ thuật làm bài, tốc độ, lập luận, luyện đề.' },
      amc:{ add30:+15, add60:+25, name:'AMC/AMO', label:'AMC/AMO: +$15 (30) và +$25 (60) mỗi học sinh.', min60:true, extra:'Trọng tâm: chiến lược thi, tư duy nâng cao, giải quyết vấn đề.' },
      amointensive:{ add30:+20, add60:+30, name:'AMO Chuyên sâu', label:'AMO Chuyên sâu: +$20 (30) và +$30 (60) mỗi học sinh.', min60:true, extra:'Trọng tâm: luyện Olympiad nâng cao, chứng minh, bộ bài khó.' }
    } : isZh ? {
      standard:{ add30:0, add60:0, name:'标准课程', label:'标准课程辅导：+$0。', min60:false, extra:'重点：跟进学校学习、作业支持与建立信心。' },
      extension:{ add30:+5, add60:+10, name:'拓展课程', label:'拓展课程：每位学生 30 分钟加 $5，60 分钟加 $10。', min60:false, extra:'重点：拓展提升、更深入理解与更高阶题目。' },
      selective:{ add30:+10, add60:+20, name:'选拔考试', label:'选拔考试：每位学生 30 分钟加 $10，60 分钟加 $20。', min60:true, extra:'重点：做题技巧、速度、推理与模拟练习。' },
      amc:{ add30:+15, add60:+25, name:'数学竞赛', label:'数学竞赛：每位学生 30 分钟加 $15，60 分钟加 $25。', min60:true, extra:'重点：竞赛解题、策略与高阶推理。' },
      amointensive:{ add30:+20, add60:+30, name:'竞赛强化', label:'竞赛强化：每位学生 30 分钟加 $20，60 分钟加 $30。', min60:true, extra:'重点：高阶奥赛训练、证明与高难度题组。' }
    } : {
      standard:{ add30:0, add60:0, name:'Standard', label:'Standard tutoring: +$0.', min60:false, extra:'Focus: school learning, homework support, confidence building.' },
      extension:{ add30:+5, add60:+10, name:'Extension', label:'Extension: +$5 (30) and +$10 (60) per student.', min60:false, extra:'Focus: enrichment, deeper understanding, higher-level questions.' },
      selective:{ add30:+10, add60:+20, name:'Selective tests', label:'Selective tests: +$10 (30) and +$20 (60) per student.', min60:true, extra:'Focus: test technique, speed, reasoning, practice papers.' },
      amc:{ add30:+15, add60:+25, name:'AMC/AMO', label:'AMC/AMO: +$15 (30) and +$25 (60) per student.', min60:true, extra:'Focus: competition problem solving, strategies, advanced reasoning.' },
      amointensive:{ add30:+20, add60:+30, name:'AMO Intensive', label:'AMO Intensive: +$20 (30) and +$30 (60) per student.', min60:true, extra:'Focus: advanced Olympiad training, proofs, and high-difficulty problem sets.' }
    };

    var currentLevel='primary', currentVce='general', currentTrack='standard';

    function money(n){ return '$'+Math.max(0,n); }
    function yearAdj(){ return currentLevel === 'vce' ? vceSubjects[currentVce] : adjustments[currentLevel]; }
    function totalAdd30(){ var y=yearAdj(), tr=tracks[currentTrack]; return (y.add30||0)+(tr.add30||0); }
    function totalAdd60(){ var y=yearAdj(), tr=tracks[currentTrack]; return (y.add60||0)+(tr.add60||0); }
    function setText(id, txt){ var el=document.getElementById(id); if(el) el.textContent=txt; }
    function setHTML(id, html){ var el=document.getElementById(id); if(el) el.innerHTML=html; }
    function priceCells(online, inperson){
      return '<div class="cells"><div class="pricebox"><div class="price">'+money(online)+'</div><div class="tag online">'+t('🌐 Online','Trực tuyến','🌐 线上')+'</div></div><div class="pricebox"><div class="price">'+money(inperson)+'</div><div class="tag inperson">'+t('📍 In-person','Trực tiếp','📍 线下')+'</div></div></div>';
    }
    function selectionLabel(){
      var yearLabel;
      if (currentLevel === 'primary') yearLabel = t('Primary','Tiểu học','小学阶段');
      else if (currentLevel === 'mid') yearLabel = t('Years 7–10','Lớp 7–10','7–10 年级');
      else {
        yearLabel = isVi ? 'VCE ('+(currentVce==='general'?'Tổng quát':currentVce==='methods'?'Phương pháp':'Chuyên sâu')+')' :
          isZh ? 'VCE ' + (currentVce==='general'?'普通数学':currentVce==='methods'?'数学方法':'专业数学') :
          'VCE ' + currentVce.charAt(0).toUpperCase() + currentVce.slice(1);
      }
      return yearLabel + ' • ' + tracks[currentTrack].name;
    }
    function updateFeesAtGlance(){
      var add30=totalAdd30(), add60=totalAdd60(), oneToOne=rows[0], force60_1to1=!!oneToOne.min60 || tracks[currentTrack].min60;
      setText('glance-price-online', '$'+(oneToOne.p60.online+add60));
      setText('glance-price-inperson', '$'+(oneToOne.p60.inperson+add60));
      var label=selectionLabel();
      setText('glance-badge-online', t('1-to-1 • 60 min • ','1 kèm 1 • 60 phút • ','一对一 • 60 分钟 • ') + label);
      setText('glance-badge-inperson', t('1-to-1 • 60 min • ','1 kèm 1 • 60 phút • ','一对一 • 60 分钟 • ') + label);
      setText('glance-badge-30', t('1-to-1 • 30 min • ','1 kèm 1 • 30 phút • ','一对一 • 30 分钟 • ') + label);
      if(force60_1to1){
        setText('glance-price-30', t('60-min required','Bắt buộc 60 phút','必须为 60 分钟'));
        setText('glance-30-note', t('This selection requires 60-minute sessions for quality/results.','Lựa chọn này yêu cầu buổi 60 phút để đảm bảo chất lượng/kết quả.','此选项需要 60 分钟课程，以保证质量和学习效果。'));
        setHTML('glance-30-helper', t('<strong>Why?</strong> These programs need time for strategy + deep practice + feedback.','<strong>Vì sao?</strong> Cần đủ thời gian cho chiến lược + luyện sâu + phản hồi.','<strong>为什么？</strong> 这些课程需要足够时间进行策略讲解、深入练习与反馈。'));
      } else {
        setText('glance-price-30', '$'+(oneToOne.p30.online+add30)+' / $'+(oneToOne.p30.inperson+add30));
        setText('glance-30-note', t('Online / In-person (per student)','Trực tuyến / trực tiếp (mỗi học sinh)','线上 / 线下（每位学生）'));
        setText('glance-30-helper', t('Tip: 60 minutes usually gives better progress (more time for practice + feedback).','Gợi ý: 60 phút thường hiệu quả hơn (nhiều thời gian luyện tập + phản hồi).','提示：60 分钟课程通常效果更好（有更多时间进行练习与反馈）。'));
      }
      var fivePlus=rows[5];
      setText('glance-badge-5plus', t('5+ students • 60 min • ','5+ học sinh • 60 phút • ','5 人以上 • 60 分钟 • ') + label);
      setText('glance-price-5plus', '$'+(fivePlus.p60.online+add60)+' / $'+(fivePlus.p60.inperson+add60));
      setText('glance-per-5plus', t('per 60 minutes (online / in-person • per student)','mỗi 60 phút (trực tuyến / trực tiếp • mỗi học sinh)','每 60 分钟（线上 / 线下 • 每位学生）'));
    }
    function render(){
      var y=yearAdj(), tr=tracks[currentTrack], vceBox=document.getElementById('vceBox');
      if(vceBox) vceBox.style.display = currentLevel === 'vce' ? 'block' : 'none';
      setText('badgeYear', currentLevel === 'vce' ? t('VCE subject','Môn VCE','VCE 科目') : adjustments[currentLevel].badge);
      setText('badgeTrack', tr.name);
      setHTML('ruleLine', (currentLevel === 'vce' ? y.label : adjustments[currentLevel].rule) + '<br>' + tr.label);
      setText('extraLine', ((currentLevel === 'vce' ? adjustments.vce.extra : adjustments[currentLevel].extra) + ' ' + tr.extra).trim());
      var add30=totalAdd30(), add60=totalAdd60(), tbody=document.getElementById('priceBody');
      if(!tbody) return;
      tbody.innerHTML='';
      rows.forEach(function(r){
        var trEl=document.createElement('tr');
        var tdIcon=document.createElement('td'); tdIcon.className='icon'; tdIcon.textContent=r.icon;
        var tdProg=document.createElement('td'); tdProg.innerHTML='<div class="program">'+r.program+'</div>';
        var td30=document.createElement('td'); var force60=!!r.min60 || tracks[currentTrack].min60;
        if(force60){
          td30.innerHTML='<div class="locked"><div class="label">'+t('60-minute minimum','Tối thiểu 60 phút','至少 60 分钟')+'</div><div class="small">'+(r.min60 ? t('For 5+ students we only offer 60-minute sessions to keep lesson quality high.','Với nhóm 5+ học sinh, chỉ áp dụng buổi 60 phút để đảm bảo chất lượng buổi học.','对于 5 人以上小组，为保证课程质量，我们仅提供 60 分钟课程。') : t('For this program type, 60-minute sessions are required for best results.','Với loại chương trình này, buổi 60 phút là bắt buộc để đạt kết quả tốt.','对于这种课程类型，为取得最佳效果需要 60 分钟课程。'))+'</div></div>';
        } else {
          td30.innerHTML=priceCells(r.p30.online+add30, r.p30.inperson+add30);
        }
        var td60=document.createElement('td'); td60.innerHTML=priceCells(r.p60.online+add60, r.p60.inperson+add60);
        trEl.appendChild(tdIcon); trEl.appendChild(tdProg); trEl.appendChild(td30); trEl.appendChild(td60); tbody.appendChild(trEl);
      });
      updateFeesAtGlance();
    }

    document.querySelectorAll('[data-level]').forEach(function(btn){ btn.addEventListener('click', function(){ currentLevel=btn.dataset.level; document.querySelectorAll('[data-level]').forEach(function(b){ var active=b.dataset.level===currentLevel; b.classList.toggle('active',active); b.setAttribute('aria-selected', active?'true':'false'); }); render(); }); });
    document.querySelectorAll('[data-vce]').forEach(function(btn){ btn.addEventListener('click', function(){ currentVce=btn.dataset.vce; document.querySelectorAll('[data-vce]').forEach(function(b){ var active=b.dataset.vce===currentVce; b.classList.toggle('active',active); b.setAttribute('aria-selected', active?'true':'false'); }); render(); }); });
    document.querySelectorAll('[data-track]').forEach(function(btn){ btn.addEventListener('click', function(){ currentTrack=btn.dataset.track; document.querySelectorAll('[data-track]').forEach(function(b){ var active=b.dataset.track===currentTrack; b.classList.toggle('active',active); b.setAttribute('aria-selected', active?'true':'false'); }); render(); }); });
    render();
  }

  function isVietnamesePage() {
    return document.documentElement.lang === 'vi' ||
      document.body.classList.contains('page-vi') ||
      window.location.pathname.toLowerCase().indexOf('/vi/') !== -1;
  }

  function setModalOpen(modal, open) {
    if (!modal) return;
    if (open) {
      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
    } else {
      if (modal.classList.contains('modal-backdrop')) modal.hidden = true;
      else modal.setAttribute('hidden', '');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  function wireModalClose(modal, closeBtn) {
    if (!modal) return;
    if (closeBtn && !closeBtn.dataset.boundClose) {
      closeBtn.dataset.boundClose = 'true';
      closeBtn.addEventListener('click', function () {
        setModalOpen(modal, false);
      });
    }
    if (!modal.dataset.boundBackdrop) {
      modal.dataset.boundBackdrop = 'true';
      modal.addEventListener('click', function (event) {
        if (event.target === modal) setModalOpen(modal, false);
      });
    }
  }

  function syncSelectOther(select) {
    var targetId = select && select.dataset ? select.dataset.target : '';
    var otherValue = select && select.dataset ? select.dataset.otherValue : '';
    if (!targetId || !otherValue) return;
    var target = document.getElementById(targetId);
    if (!target) return;

    var isActive = select.value === otherValue;
    target.classList.toggle('show', isActive);

    var field = target.querySelector('input, textarea, select');
    if (field) {
      field.required = isActive;
      if (!isActive && 'value' in field) field.value = '';
    }
  }

  function initSelectOtherFields(root) {
    (root || document).querySelectorAll('select[data-target]').forEach(function (select) {
      if (select.dataset.boundOther === 'true') return;
      select.dataset.boundOther = 'true';
      select.addEventListener('change', function () {
        syncSelectOther(select);
      });
      syncSelectOther(select);
    });
  }

  function initRegisterForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var isVi = isVietnamesePage();
    var checkboxGroup = Array.prototype.slice.call(form.querySelectorAll('input[name="register_for"]'));
    var registerError = document.getElementById('registerError');
    var submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    var modal = document.getElementById('registerThankYouModal') || document.getElementById('thankYouModal');
    var closeBtn = document.getElementById('registerThankYouOkBtn') || document.getElementById('closeThankYou') || document.getElementById('thankYouOkBtn');
    var copyEmailBtn = document.getElementById('copyEmailBtn');
    var copyNote = document.getElementById('copyNote');
    var supportEmail = 'magicmathmasters@gmail.com';
    var submitFrame = null;
    var submitTarget = form.getAttribute('target');
    var submissionPending = false;

    if (submitTarget) submitFrame = document.querySelector('iframe[name="' + submitTarget + '"]');

    function validatePrograms() {
      if (!checkboxGroup.length) return true;
      var hasSelection = checkboxGroup.some(function (box) { return box.checked; });
      if (registerError) registerError.classList.toggle('show', !hasSelection);
      checkboxGroup.forEach(function (box) {
        box.setCustomValidity(hasSelection ? '' : (isVi ? 'Vui lòng chọn ít nhất một chương trình.' : 'Please select at least one program.'));
      });
      return hasSelection;
    }

    function resetFormState() {
      form.reset();
      initSelectOtherFields(form);
      validatePrograms();
      if (copyNote) copyNote.textContent = '';
    }

    function showThanks() {
      if (!modal) return;
      setModalOpen(modal, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    checkboxGroup.forEach(function (box) {
      if (box.dataset.boundRegisterChange === 'true') return;
      box.dataset.boundRegisterChange = 'true';
      box.addEventListener('change', validatePrograms);
    });

    initSelectOtherFields(form);
    validatePrograms();
    wireModalClose(modal, closeBtn);

    if (submitFrame && !submitFrame.dataset.boundRegisterLoad) {
      submitFrame.dataset.boundRegisterLoad = 'true';
      submitFrame.addEventListener('load', function () {
        if (!submissionPending) return;
        submissionPending = false;
        resetFormState();
        showThanks();
      });
    }

    if (copyEmailBtn && !copyEmailBtn.dataset.boundCopy) {
      copyEmailBtn.dataset.boundCopy = 'true';
      copyEmailBtn.addEventListener('click', function () {
        var writePromise;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          writePromise = navigator.clipboard.writeText(supportEmail);
        } else {
          writePromise = new Promise(function (resolve, reject) {
            try {
              var temp = document.createElement('input');
              temp.value = supportEmail;
              document.body.appendChild(temp);
              temp.select();
              document.execCommand('copy');
              document.body.removeChild(temp);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }
        writePromise.then(function () {
          if (copyNote) copyNote.textContent = (isVi ? 'Đã sao chép email: ' : 'Copied email: ') + supportEmail;
        }).catch(function () {
          if (copyNote) copyNote.textContent = (isVi ? 'Không thể sao chép tự động. Vui lòng sao chép thủ công: ' : 'Could not copy automatically. Please copy manually: ') + supportEmail;
        });
      });
    }

    if (!form.dataset.boundSubmit) {
      form.dataset.boundSubmit = 'true';
      form.addEventListener('submit', function (event) {
        var programsValid = validatePrograms();
        if (!programsValid || !form.checkValidity()) {
          event.preventDefault();
          form.reportValidity();
          return;
        }

        if (submitFrame) {
          submissionPending = true;
          return;
        }

        event.preventDefault();
        var originalLabel = submitButton ? submitButton.textContent : '';
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = isVi ? 'Đang gửi...' : 'Submitting...';
        }

        fetch(form.action, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(form)
        }).then(function () {
          resetFormState();
          showThanks();
        }).catch(function () {
          alert(isVi ? 'Có lỗi khi gửi biểu mẫu. Vui lòng thử lại hoặc liên hệ qua điện thoại / email.' : 'There was a problem submitting the form. Please try again or contact us by phone/email.');
        }).finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalLabel;
          }
        });
      });
    }
  }

  function initEnquiryForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var isVi = isVietnamesePage();
    var submitFrame = null;
    var submitTarget = form.getAttribute('target');
    var modal = document.getElementById('thankYouModal');
    var closeBtn = modal ? modal.querySelector('button') : null;
    var submissionPending = false;

    if (submitTarget) submitFrame = document.querySelector('iframe[name="' + submitTarget + '"]');

    wireModalClose(modal, closeBtn);

    if (submitFrame && !submitFrame.dataset.boundEnquiryLoad) {
      submitFrame.dataset.boundEnquiryLoad = 'true';
      submitFrame.addEventListener('load', function () {
        if (!submissionPending) return;
        submissionPending = false;
        form.reset();
        setModalOpen(modal, true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (!form.dataset.boundSubmit) {
      form.dataset.boundSubmit = 'true';
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.reportValidity();
          return;
        }

        if (submitFrame) {
          submissionPending = true;
          return;
        }

        event.preventDefault();
        fetch(form.action, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(form)
        }).then(function () {
          form.reset();
          setModalOpen(modal, true);
        }).catch(function () {
          alert(isVi ? 'Có lỗi khi gửi biểu mẫu. Vui lòng thử lại.' : 'There was a problem submitting the form. Please try again.');
        });
      });
    }
  }

  function initMathsClubRegisterForm() {
    var form = document.getElementById('mathsClubRegisterForm');
    if (!form) return;

    var tableBody = document.querySelector('#studentTable tbody');
    if (!tableBody || !tableBody.rows.length) return;

    var firstRowTemplate = tableBody.rows[0].cloneNode(true);
    var clubOptions = document.querySelectorAll('.club-option');
    var clubRadios = document.querySelectorAll('input[name="clubStream"]');
    var prep6Radio = document.getElementById('club-prep6');
    var prepSubgroupWrap = document.getElementById('prepSubgroupWrap');
    var prepSubgroupRadios = document.querySelectorAll('input[name="prepSubgroup"]');
    var submitFrame = document.querySelector('iframe[name="' + (form.getAttribute('target') || '') + '"]');
    var successMessage = document.getElementById('successMessage');
    var competitionMode = document.getElementById('competitionMode');
    var competitionLocationGroup = document.getElementById('competitionLocationGroup');
    var competitionLocation = document.getElementById('competitionLocation');
    var clubStreamField = document.getElementById('clubStreamField');
    var prepSubgroupField = document.getElementById('prepSubgroupField');
    var studentsField = document.getElementById('studentsField');
    var clubModal = document.getElementById('clubThankYouModal');
    var clubOkBtn = document.getElementById('clubThankYouOkBtn');
    var submissionPending = false;

    function clearRowValues(row) {
      row.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (field.type === 'checkbox' || field.type === 'radio') field.checked = false;
        else field.value = '';
      });
    }

    function updateRowNumbers() {
      document.querySelectorAll('#studentTable tbody tr').forEach(function (row, index) {
        var num = row.querySelector('.row-number');
        if (num) num.textContent = index + 1;
      });
    }

    function addRow() {
      var newRow = firstRowTemplate.cloneNode(true);
      clearRowValues(newRow);
      tableBody.appendChild(newRow);
      updateRowNumbers();
    }

    function removeRow(button) {
      if (tableBody.rows.length === 1) {
        alert('At least one student row must remain in the register.');
        return;
      }
      var row = button && button.closest ? button.closest('tr') : null;
      if (row) row.remove();
      updateRowNumbers();
    }

    function resetTable() {
      while (tableBody.rows.length > 1) tableBody.deleteRow(1);
      clearRowValues(tableBody.rows[0]);
      updateRowNumbers();
    }

    function resetClubSelection() {
      clubRadios.forEach(function (radio) { radio.checked = false; });
      prepSubgroupRadios.forEach(function (radio) {
        radio.checked = false;
        radio.required = false;
      });
      clubOptions.forEach(function (card) { card.classList.remove('active'); });
      if (prepSubgroupWrap) prepSubgroupWrap.classList.remove('show');
    }

    function updateClubUI() {
      clubOptions.forEach(function (card) {
        var radio = card.querySelector('input[type="radio"]');
        card.classList.toggle('active', !!(radio && radio.checked));
      });

      if (prep6Radio && prep6Radio.checked) {
        if (prepSubgroupWrap) prepSubgroupWrap.classList.add('show');
        prepSubgroupRadios.forEach(function (radio) { radio.required = true; });
      } else {
        if (prepSubgroupWrap) prepSubgroupWrap.classList.remove('show');
        prepSubgroupRadios.forEach(function (radio) {
          radio.required = false;
          radio.checked = false;
        });
      }
    }

    function updateCompetitionLocation() {
      var needsLocation = competitionMode && competitionMode.value === 'In-person (if available)';
      if (!competitionLocationGroup || !competitionLocation) return;
      competitionLocationGroup.style.display = needsLocation ? 'block' : 'none';
      competitionLocation.required = !!needsLocation;
      if (!needsLocation) competitionLocation.value = '';
    }

    function collectPayload() {
      var selectedClub = document.querySelector('input[name="clubStream"]:checked');
      var selectedPrepSubgroup = document.querySelector('input[name="prepSubgroup"]:checked');
      var rows = Array.prototype.slice.call(document.querySelectorAll('#studentTable tbody tr'));
      return {
        clubStream: selectedClub ? selectedClub.value : '',
        prepSubgroup: selectedPrepSubgroup ? selectedPrepSubgroup.value : '',
        students: rows.map(function (row, index) {
          return {
            rowNumber: index + 1,
            studentName: (row.querySelector('input[name="studentName[]"]') || {}).value || '',
            preferredName: (row.querySelector('input[name="preferredName[]"]') || {}).value || '',
            grade: (row.querySelector('select[name="grade[]"]') || {}).value || '',
            school: (row.querySelector('input[name="school[]"]') || {}).value || '',
            mathsFocus: (row.querySelector('select[name="mathsFocus[]"]') || {}).value || '',
            studentNotes: (row.querySelector('input[name="studentNotes[]"]') || {}).value || ''
          };
        })
      };
    }

    function afterSuccess() {
      if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      setModalOpen(clubModal, true);
      form.reset();
      resetTable();
      resetClubSelection();
      updateCompetitionLocation();
    }

    window.addRow = addRow;
    window.removeRow = removeRow;
    window.resetTable = resetTable;

    clubRadios.forEach(function (radio) {
      if (radio.dataset.boundClubUi === 'true') return;
      radio.dataset.boundClubUi = 'true';
      radio.addEventListener('change', updateClubUI);
    });
    if (competitionMode && competitionMode.dataset.boundComp !== 'true') {
      competitionMode.dataset.boundComp = 'true';
      competitionMode.addEventListener('change', updateCompetitionLocation);
    }

    wireModalClose(clubModal, clubOkBtn);

    if (submitFrame && !submitFrame.dataset.boundClubLoad) {
      submitFrame.dataset.boundClubLoad = 'true';
      submitFrame.addEventListener('load', function () {
        if (!submissionPending) return;
        submissionPending = false;
        afterSuccess();
      });
    }

    if (!form.dataset.boundSubmit) {
      form.dataset.boundSubmit = 'true';
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var clubChosen = document.querySelector('input[name="clubStream"]:checked');
        var prepSubChosen = document.querySelector('input[name="prepSubgroup"]:checked');

        if (!clubChosen) {
          alert('Please choose one Maths Club stream before submitting.');
          return;
        }
        if (prep6Radio && prep6Radio.checked && !prepSubChosen) {
          alert('Please choose either Prep–2 or Years 3–6 for Primary Maths Club.');
          return;
        }
        var paymentPlan = document.getElementById('paymentPlan');
        var startDate = document.getElementById('startDate');
        if (paymentPlan && !paymentPlan.value) {
          if (typeof paymentPlan.reportValidity === 'function') paymentPlan.reportValidity();
          alert('Please choose a preferred payment plan.');
          return;
        }
        if (startDate && !startDate.value) {
          if (typeof startDate.reportValidity === 'function') startDate.reportValidity();
          alert('Please choose a preferred start date.');
          return;
        }
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        var payload = collectPayload();
        if (clubStreamField) clubStreamField.value = payload.clubStream;
        if (prepSubgroupField) prepSubgroupField.value = payload.prepSubgroup;
        if (studentsField) studentsField.value = JSON.stringify(payload.students);

        if (submitFrame) {
          submissionPending = true;
          HTMLFormElement.prototype.submit.call(form);
          return;
        }

        fetch(form.action, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(form)
        }).then(function () {
          afterSuccess();
        }).catch(function () {
          alert('There was a problem submitting the Maths Club registration. Please try again.');
        });
      });
    }

    updateClubUI();
    updateCompetitionLocation();
  }

  onReady(function () {
    initActiveNav();
    initLanguageMenu();
    initQuicklinks();
    initSelectOtherFields(document);
    initRegisterForm();
    initEnquiryForm();
    initMathsClubRegisterForm();
    initPricingTool();
  });
})();
