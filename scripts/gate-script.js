/* 前端访问密码门（静态站点，仅阻挡普通访客，非服务端鉴权）。
   逻辑：SHA-256 校验，未通过时全屏遮罩 + 隐藏正文；通过后本次会话放行。 */
(function () {
  var SESSION_KEY = 'kb_access_ok';
  var HASH = 'de853f506e40e09bbe662e3801dac9b44272366354436a460701c5e14b694fcc';

  var K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256(msg) {
    var words = [], len = msg.length, i;
    for (i = 0; i < len; i++) { words[i >> 2] |= (msg.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8); }
    words[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
    var bitLen = len * 8;
    var paddedWords = ((((len + 8) >> 6) + 1) << 4);
    words[paddedWords - 2] = Math.floor(bitLen / 4294967296);
    words[paddedWords - 1] = bitLen | 0;
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var w = new Array(64);
    for (var off = 0; off < words.length; off += 16) {
      for (i = 0; i < 16; i++) { w[i] = words[off + i] || 0; }
      for (i = 16; i < 64; i++) {
        var x = w[i - 15], y = w[i - 2];
        var s0 = rr(x, 7) ^ rr(x, 18) ^ (x >>> 3);
        var s1 = rr(y, 17) ^ rr(y, 19) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0;
      H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
    }
    var out = '';
    for (i = 0; i < 8; i++) { out += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8); }
    return out;
  }

  var GATE_CSS = [
    'html.kb-locked #app{visibility:hidden!important}',
    '#kb-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;',
      'background:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px) 0 0/28px 28px,',
      'linear-gradient(120deg,#15172c 0%,#1c1f38 48%,#121428 100%);',
      '-webkit-backdrop-filter:blur(22px) saturate(160%);backdrop-filter:blur(22px) saturate(160%);',
      'font-family:var(--vp-font-family-base,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif);',
      'animation:kb-gate-fade .35s ease both}',
    '#kb-gate::before,#kb-gate::after{content:"";position:absolute;border-radius:50%;pointer-events:none;filter:blur(24px)}',
    '#kb-gate::before{top:-18%;left:-8%;width:56vw;height:56vw;',
      'background:radial-gradient(circle,var(--vp-c-brand-1,#42b883) 0%,transparent 66%);opacity:.32}',
    '#kb-gate::after{bottom:-28%;right:-8%;width:54vw;height:54vw;',
      'background:radial-gradient(circle,#5b6ef5 0%,transparent 66%);opacity:.30}',
    '@keyframes kb-gate-fade{from{opacity:0}to{opacity:1}}',
    '.kb-gate-card{position:relative;z-index:1;width:min(92vw,420px);padding:44px 40px 34px;border-radius:24px;overflow:hidden;text-align:center;',
      'background:var(--vp-c-bg,#fff);',
      'background:color-mix(in srgb,var(--vp-c-bg,#fff) 82%,transparent);',
      'border:1px solid color-mix(in srgb,var(--vp-c-bg,#fff) 55%,transparent);',
      '-webkit-backdrop-filter:blur(26px) saturate(180%);backdrop-filter:blur(26px) saturate(180%);',
      'box-shadow:0 30px 90px -24px rgba(0,0,0,.45),0 2px 8px rgba(0,0,0,.06);',
      'animation:kb-gate-rise .5s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes kb-gate-rise{from{opacity:0;transform:translateY(26px) scale(.96)}to{opacity:1;transform:none}}',
    '.kb-gate-icon{width:70px;height:70px;margin:0 auto 22px;border-radius:22px;display:flex;align-items:center;justify-content:center;',
      'background:linear-gradient(135deg,var(--vp-c-brand-2),var(--vp-c-brand-3));',
      'box-shadow:0 12px 26px -10px var(--vp-c-brand-1)}',
    '.kb-gate-icon svg{width:32px;height:32px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.kb-gate-title{margin:0 0 8px;font-size:22px;font-weight:700;letter-spacing:-.01em;color:var(--vp-c-text-1,#1f2937)}',
    '.kb-gate-desc{margin:0 0 26px;font-size:13px;line-height:1.6;color:var(--vp-c-text-2,#6b7280)}',
    '.kb-gate-field{position:relative;margin-bottom:6px}',
    '.kb-gate-field>svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);width:18px;height:18px;',
      'fill:none;stroke:var(--vp-c-text-3,#9ca3af);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}',
    '.kb-gate-input{width:100%;box-sizing:border-box;padding:14px 16px 14px 45px;border-radius:12px;',
      'border:1.5px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg-soft,#f9fafb);',
      'color:var(--vp-c-text-1,#1f2937);font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s}',
    '.kb-gate-input::placeholder{color:var(--vp-c-text-3,#9ca3af)}',
    '.kb-gate-input:focus{border-color:var(--vp-c-brand-1);box-shadow:0 0 0 4px var(--vp-c-brand-soft)}',
    '.kb-gate-msg{min-height:18px;margin:8px 0 14px;font-size:12.5px;color:#ef4444;text-align:left;display:flex;align-items:center;gap:6px}',
    '.kb-gate-btn{width:100%;padding:14px;border:0;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px;',
      'background:linear-gradient(135deg,var(--vp-c-brand-1),var(--vp-c-brand-3));color:#fff;font-size:15px;font-weight:600;cursor:pointer;',
      'box-shadow:0 10px 22px -10px var(--vp-c-brand-1);transition:transform .2s,box-shadow .2s}',
    '.kb-gate-btn:hover{transform:translateY(-2px);box-shadow:0 14px 28px -10px var(--vp-c-brand-1)}',
    '.kb-gate-btn:active{transform:translateY(0)}',
    '.kb-gate-btn svg{width:17px;height:17px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.kb-gate-foot{margin-top:22px;font-size:11px;color:var(--vp-c-text-3,#9ca3af)}'
  ].join('');

  function unlock() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    var box = document.getElementById('kb-gate');
    if (box && box.parentNode) box.parentNode.removeChild(box);
    document.documentElement.classList.remove('kb-locked');
    document.documentElement.style.overflow = '';
    if (document.body) document.body.style.overflow = '';
  }

  function showGate() {
    if (document.getElementById('kb-gate')) return;
    var style = document.createElement('style');
    style.id = 'kb-gate-style';
    style.textContent = GATE_CSS;
    document.head.appendChild(style);
    document.documentElement.classList.add('kb-locked');
    document.documentElement.style.overflow = 'hidden';
    if (document.body) document.body.style.overflow = 'hidden';

    var box = document.createElement('div');
    box.id = 'kb-gate';
    box.innerHTML =
      '<div class="kb-gate-card">' +
        '<div class="kb-gate-icon">' +
          '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>' +
        '</div>' +
        '<h3 class="kb-gate-title">知识库需要密码</h3>' +
        '<p class="kb-gate-desc">请输入访问密码后继续阅读</p>' +
        '<div class="kb-gate-field">' +
          '<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="M11 12l8-8m-3 3l2 2m-5-1l2 2"/></svg>' +
          '<input id="kb-gate-pwd" class="kb-gate-input" type="password" autocomplete="off" placeholder="访问密码">' +
        '</div>' +
        '<div id="kb-gate-msg" class="kb-gate-msg"></div>' +
        '<button id="kb-gate-ok" class="kb-gate-btn">进入知识库' +
          '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6l6 6-6 6"/></svg>' +
        '</button>' +
        '<div class="kb-gate-foot">🔒 受密码保护的内容</div>' +
      '</div>';
    (document.body || document.documentElement).appendChild(box);

    var input = document.getElementById('kb-gate-pwd');
    var msg = document.getElementById('kb-gate-msg');
    var card = box.querySelector('.kb-gate-card');
    function submit() {
      var val = input.value;
      if (!val) { msg.textContent = '⚠ 请输入密码'; return; }
      if (sha256(val) === HASH) { unlock(); return; }
      msg.textContent = '⚠ 密码不正确，请重试';
      input.value = '';
      input.focus();
      if (card.animate) {
        card.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(0)' }],
          { duration: 300 }
        );
      }
    }
    document.getElementById('kb-gate-ok').addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 80);
  }

  var passed = false;
  try { passed = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
  if (!passed) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showGate);
    } else {
      showGate();
    }
  }
})();
