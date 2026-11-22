(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const profileKey = 'orbit-profile-v1';
  const dbKey = 'orbit-data-v1';
  const readProfile = () => {
    try { return JSON.parse(localStorage.getItem(profileKey) || '{}'); }
    catch { return {}; }
  };
  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const style = document.createElement('style');
  style.textContent = `
    .orbit-settings-card{background:#fff;border:1px solid #e9ece6;border-radius:20px;padding:20px;margin-bottom:14px;box-shadow:0 12px 35px #2134260b}
    .orbit-settings-card h2{font-size:14px;margin:0 0 6px}.orbit-settings-card p{font-size:10px;color:#7c8882;line-height:1.9;margin:0 0 14px}
    .orbit-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .orbit-settings-field label{display:block;font-size:9px;color:#7c8882;margin:0 0 6px}.orbit-settings-field input{width:100%;border:1px solid #e9ece6;border-radius:11px;padding:11px;background:#fbfcfa;font:inherit;font-size:10px}
    .orbit-settings-row{display:flex;align-items:center;gap:12px}.orbit-settings-avatar{width:58px;height:58px;object-fit:cover;border-radius:18px;background:#d8f18e;display:grid;place-items:center;color:#274c3a;font-weight:700;flex:none}
    .orbit-settings-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}.orbit-settings-actions button,.orbit-settings-card button{border:1px solid #e9ece6;background:#fff;border-radius:10px;padding:10px 12px;font:inherit;font-size:10px;color:#18221f}
    .orbit-settings-actions .danger{border-color:#f2d3ca;color:#9a3d2a}.orbit-settings-note{background:#f5f8f1;border-radius:13px;padding:12px;color:#53645a;font-size:9px;line-height:1.9}
    .orbit-settings-status{display:inline-flex;align-items:center;gap:6px;border-radius:20px;background:#fff1e8;color:#92502f;padding:5px 9px;font-size:9px;margin-bottom:10px}.orbit-settings-status.orbit-ai-ready{background:#edf5e7;color:#274c3a}
    .orbit-mic{border:1px solid #e9ece6!important;background:#fff!important;color:#274c3a!important;padding:0 12px!important;min-width:42px}
    .orbit-mic.listening{background:#fff1e8!important;color:#9a3d2a!important;border-color:#ef936c!important}
    @media(max-width:650px){.orbit-settings-grid{grid-template-columns:1fr}.orbit-settings-card{padding:16px}}
  `;
  document.head.append(style);

  const main = $('main.main');
  const assistant = $('#page-assistant');
  if (!main || !assistant) return;
  const section = document.createElement('section');
  section.className = 'page';
  section.id = 'page-settings';
  section.innerHTML = `
    <div class="welcome"><div><div class="kicker">مساحتك الخاصة</div><h1>الإعدادات</h1><p>تحكم في ملفك وبيانات Orbit من هنا.</p></div></div>
    <div class="orbit-settings-card">
      <h2>الملف الشخصي</h2><p>الاسم والصورة في هذه النسخة يُحفظان على هذا الجهاز فقط.</p>
      <div class="orbit-settings-row"><img class="orbit-settings-avatar" id="orbitAvatarPreview" alt="صورتك الشخصية"><div class="orbit-settings-grid" style="flex:1">
        <div class="orbit-settings-field"><label for="orbitProfileName">الاسم الظاهر</label><input id="orbitProfileName" maxlength="40" placeholder="اكتب اسمك"></div>
        <div class="orbit-settings-field"><label for="orbitProfilePhoto">الصورة الشخصية</label><input id="orbitProfilePhoto" type="file" accept="image/*"></div>
      </div></div>
      <div class="orbit-settings-actions"><button id="orbitSaveProfile" class="primary">حفظ الملف</button></div>
    </div>
    <div class="orbit-settings-card">
      <h2>اللغة</h2><p>لغة الواجهة الحالية: العربية. دعم الإنجليزية يحتاج ترجمة كاملة للواجهات قبل تفعيله.</p>
      <div class="orbit-settings-status">العربية · مفعّلة</div>
    </div>
    <div class="orbit-settings-card">
      <h2>الخصوصية والحماية</h2>
      <div class="orbit-settings-note"><b>حالة النسخة الحالية:</b> لا يوجد تسجيل دخول أو كلمة مرور للتطبيق. بياناتك تُحفظ في مساحة المتصفح على هذا الجهاز، والرابط ومصدر التطبيق عامان. لا تضع بيانات عقارات حقيقية أو أرقام عملاء هنا قبل إعداد حساب وقاعدة بيانات محمية.</div>
      <p style="margin-top:12px">قفل الحساب ومزامنة الأجهزة سيُضافان مع إعداد تسجيل الدخول وقواعد حماية البيانات. كلمة مرور داخل نسخة المتصفح وحدها لن تكون حماية كافية.</p>
      <div class="orbit-settings-actions"><button id="orbitExportData">تنزيل نسخة من بيانات هذا الجهاز</button><button id="orbitClearData" class="danger">مسح بيانات Orbit من هذا الجهاز</button></div>
    </div>
    <div class="orbit-settings-card">
      <h2>مساعد Orbit الذكي</h2><div class="orbit-settings-status orbit-ai-ready">إعداد تجريبي جاهز · سجّل الدخول للاختبار</div>
      <p>وافقت على اختبار Gemini المجاني ببيانات وهمية فقط. لن تُرسل بياناتك أو بيانات العملاء للاختبار. مفتاح الخدمة يجب أن يُحفظ في الخادم، وليس داخل ملفات التطبيق العامة.</p>
      <div class="orbit-settings-note">المتاح الآن ٣ أمثلة خيالية عبر Gemini. الأسئلة المفتوحة والبحث داخل سجلاتك لا تستخدم Gemini بعد، فلا تدخل بيانات عملاء حقيقية في الاختبار.</div>
    </div>
  `;
  main.insertBefore(section, assistant.nextSibling);

  const addNav = (nav, label, compact = false) => {
    if (!nav || nav.querySelector('[data-page="settings"]')) return;
    const button = document.createElement('button');
    button.dataset.page = 'settings';
    button.innerHTML = compact ? '<b>⚙</b>الإعدادات' : '<span class="ico">⚙</span>الإعدادات';
    button.addEventListener('click', () => window.nav?.('settings'));
    nav.append(button);
  };
  addNav($('#sidenav'));
  addNav($('#bottomnav'), 'الإعدادات', true);
  const settingsButton = document.createElement('button');
  settingsButton.className = 'iconbtn';
  settingsButton.type = 'button';
  settingsButton.title = 'الإعدادات';
  settingsButton.setAttribute('aria-label', 'الإعدادات');
  settingsButton.textContent = '⚙';
  settingsButton.addEventListener('click', () => window.nav?.('settings'));
  const actions = $('.topbar .actions');
  if (actions) actions.prepend(settingsButton);

  const profile = readProfile();
  const nameInput = $('#orbitProfileName');
  const photoInput = $('#orbitProfilePhoto');
  const avatarPreview = $('#orbitAvatarPreview');
  nameInput.value = profile.name || '';
  if (profile.photo && /^data:image\/jpeg;base64,/.test(profile.photo)) avatarPreview.src = profile.photo;
  else { profile.photo = ''; avatarPreview.src = 'icon.svg'; }
  const paintProfile = () => {
    const name = profile.name || 'حسابي';
    const sideProfile = $('.side-bottom .profile');
    if (sideProfile) {
      const label = $('b', sideProfile);
      const avatar = $('.avatar', sideProfile);
      if (label) label.textContent = name;
      if (avatar) {
        avatar.replaceChildren();
        if (profile.photo && /^data:image\/jpeg;base64,/.test(profile.photo)) {
          const image = document.createElement('img');
          image.alt = ''; image.src = profile.photo;
          image.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:12px';
          avatar.append(image);
        } else avatar.textContent = name.slice(0, 1).toUpperCase();
      }
    }
  };
  paintProfile();

  photoInput.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { window.toast?.('اختار ملف صورة'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        profile.photo = canvas.toDataURL('image/jpeg', 0.78);
        avatarPreview.src = profile.photo;
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  $('#orbitSaveProfile').addEventListener('click', () => {
    profile.name = nameInput.value.trim().slice(0, 40);
    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
      paintProfile();
      window.toast?.('اتحفظ الملف على هذا الجهاز');
    } catch { window.toast?.('مساحة التخزين ممتلئة؛ جرّب صورة أصغر'); }
  });
  $('#orbitExportData').addEventListener('click', () => {
    const payload = { exportedAt: new Date().toISOString(), profile, data: JSON.parse(localStorage.getItem(dbKey) || '{"events":[],"workouts":[],"leads":[]}') };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `orbit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click(); URL.revokeObjectURL(url);
    window.toast?.('اتجهز ملف النسخة الاحتياطية');
  });
  $('#orbitClearData').addEventListener('click', () => {
    if (!confirm('هتمسح المواعيد والتمرين والعملاء المحفوظين في هذا المتصفح. هل تريد المتابعة؟')) return;
    localStorage.removeItem(dbKey);
    localStorage.removeItem(profileKey);
    localStorage.removeItem('orbit-location');
    window.location.reload();
  });

  const form = $('#chatForm');
  const send = $('button', form);
  const mic = document.createElement('button');
  mic.type = 'button'; mic.className = 'orbit-mic'; mic.id = 'orbitVoiceInput';
  mic.title = 'إملاء صوتي بالعربية'; mic.setAttribute('aria-label', 'إملاء صوتي بالعربية'); mic.textContent = '🎙';
  form.insertBefore(mic, send);
  let recognition;
  let listening = false;
  mic.addEventListener('click', () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { window.toast?.('الإملاء الصوتي غير متاح في هذا المتصفح حاليًا'); return; }
    if (listening) { recognition?.stop(); return; }
    if (!confirm('قبل استخدام الميكروفون: قد يعالج المتصفح الصوت عبر خدمة التعرف على الكلام. للاختبار، لا تملي أسماء عملاء أو بيانات خاصة. هل تريد المتابعة؟')) return;
    recognition = new Recognition();
    recognition.lang = 'ar-EG'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => { listening = true; mic.classList.add('listening'); mic.textContent = '■'; };
    recognition.onresult = event => {
      const text = Array.from(event.results).map(result => result[0]?.transcript || '').join('');
      $('#chatText').value = text;
    };
    recognition.onerror = () => window.toast?.('ماقدرتش أتعرف على الصوت؛ جرّب الكتابة');
    recognition.onend = () => { listening = false; mic.classList.remove('listening'); mic.textContent = '🎙'; };
    try { recognition.start(); } catch { window.toast?.('تعذر تشغيل الميكروفون'); }
  });
})();
