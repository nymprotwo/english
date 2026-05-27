// ═══ SCREEN: SETTINGS ═══

Screens.settings = function() {
    const page = State.settingsPage || null;
    if (page === 'appearance') return _settingsAppearance();
    if (page === 'workout')    return _settingsWorkout();
    if (page === 'account')    return _settingsAccount();
    if (page === 'help')       return _settingsHelp();
    return _settingsMain();
};

// ── Back button + section label ────────────────────────────
function _settingsBack(label) {
    return '<button onclick="State.settingsPage=null;App.render()" style="display:flex;align-items:center;gap:4px;background:none;border:none;color:var(--ac);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;padding:0;margin-bottom:20px">‹ Назад</button>' +
        '<div style="font-size:9px;letter-spacing:2.5px;color:var(--sb);margin-bottom:4px">' + label + '</div>';
}

// ══════════════════════════════════════════════════════════
// ГЛАВНОЕ МЕНЮ
// ══════════════════════════════════════════════════════════
function _settingsMain() {
    let html = '<span class="lbl">МЕНЮ</span>';
    html += '<div class="ttl" style="font-size:28px;margin-bottom:20px">Настройки</div>';

    const items = [
        { page:'appearance', icon:'🎨', title:'Внешний вид',  hint:'Акцент и цвет фона' },
        { page:'workout',    icon:'💪', title:'Тренировка',   hint:'Таймер, RPE, темп, режим' },
        { page:'account',    icon:'☁️', title:'Аккаунт',      hint:'Синхронизация и данные' },
        { page:'help',       icon:'ℹ️', title:'Помощь',       hint:'Версия и контакты' },
    ];

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px">';
    items.forEach((it, i) => {
        const last = i === items.length - 1;
        html += '<div onclick="State.settingsPage=\'' + it.page + '\';App.render()" style="display:flex;align-items:center;gap:14px;padding:14px 0;cursor:pointer' + (last ? '' : ';border-bottom:1px solid var(--br)') + '">';
        html += '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac12);border:1px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">' + it.icon + '</div>';
        html += '<div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--tx2)">' + it.title + '</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-top:2px">' + it.hint + '</div></div>';
        html += '<span style="color:var(--mt);font-size:20px">›</span>';
        html += '</div>';
    });
    html += '</div>';
    return html;
}

// ══════════════════════════════════════════════════════════
// ВНЕШНИЙ ВИД
// ══════════════════════════════════════════════════════════

// Хелперы для превью пресетов
function _presetBgHex(bg) {
    return {dark:'#0a0b0e', grey:'#1c1c1e', light:'#f5f2ed'}[bg] || '#0a0b0e';
}
function _presetAccentHex(theme, accent) {
    if (accent) return accent.startsWith('#') ? accent : '#'+accent;
    return {gold:'#C9A84C', green:'#1DB954', premium:'#F2F2F2', orange:'#d4a843', brutal:'#C9A84C'}[theme] || '#C9A84C';
}
function _isDarkBg(bg) { return bg === 'dark' || bg === 'grey'; }

function _settingsAppearance() {
    let html = _settingsBack('ОФОРМЛЕНИЕ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Внешний вид</div>';

    const _curBg    = localStorage.getItem('sb_bg')    || 'dark';
    const _curTheme = localStorage.getItem('sb_theme') || 'gold';
    const _curAcc   = localStorage.getItem('sb_accent') || null;
    const _curText  = localStorage.getItem('sb_text')  || 'auto';

    // ── БЫСТРЫЕ ПРЕСЕТЫ ──────────────────────────────────
    const _qp = window._PRESETS || [];
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:14px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:13px">БЫСТРЫЕ</div>';
    html += '<div style="display:flex;gap:9px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:2px">';
    _qp.forEach((p, i) => {
        const pBgHex = _presetBgHex(p.bg);
        const pAccHex = _presetAccentHex(p.theme, p.accent);
        const dotColor = _isDarkBg(p.bg) ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.12)';
        const isActive = (_curBg === p.bg) && (_curTheme === p.theme) && !_curAcc;
        html += '<div onclick="applyPreset(' + i + ')" style="flex-shrink:0;cursor:pointer;text-align:center">';
        html += '<div style="width:68px;height:54px;border-radius:11px;background:' + pBgHex + ';border:2px solid ' + (isActive ? 'var(--ac)' : 'rgba(128,128,128,.22)') + ';' + (isActive ? 'box-shadow:0 0 0 1px var(--ac30);' : '') + 'margin-bottom:6px;display:flex;flex-direction:column;justify-content:flex-end;padding:8px;overflow:hidden;position:relative">';
        // mini content lines
        html += '<div style="height:5px;border-radius:2px;background:' + pAccHex + ';margin-bottom:3px"></div>';
        html += '<div style="height:3px;border-radius:2px;background:' + dotColor + ';width:65%"></div>';
        // checkmark
        if (isActive) html += '<div style="position:absolute;top:5px;right:5px;width:15px;height:15px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--btn-main-color);font-weight:700">✓</div>';
        html += '</div>';
        html += '<div style="font-size:8px;font-weight:700;letter-spacing:.5px;color:' + (isActive ? 'var(--ac)' : 'var(--sb)') + '">' + p.label + '</div>';
        html += '</div>';
    });
    html += '</div></div>';

    // ── ИЗБРАННОЕ ─────────────────────────────────────────
    const _favs = JSON.parse(localStorage.getItem('sb_favs') || '[]');
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:14px">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">ИЗБРАННОЕ</div>';
    html += '<button onclick="saveFavorite()" style="background:var(--ac08);border:1px solid var(--ac25);border-radius:8px;color:var(--ac);font-size:9px;font-weight:700;padding:4px 10px;cursor:pointer;font-family:inherit;letter-spacing:.3px">+ Сохранить</button>';
    html += '</div>';
    if (_favs.length === 0) {
        html += '<div style="font-size:11px;color:var(--mt);text-align:center;padding:6px 0 2px">Сохрани любимую комбинацию →</div>';
    } else {
        html += '<div style="display:flex;gap:10px">';
        _favs.forEach((f, i) => {
            const fBgHex  = _presetBgHex(f.bg);
            const fAccHex = _presetAccentHex(f.theme, f.accent);
            const fDot    = _isDarkBg(f.bg) ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.12)';
            html += '<div style="flex:1;position:relative">';
            html += '<div onclick="applyFavorite(' + i + ')" style="cursor:pointer;border-radius:10px;background:' + fBgHex + ';border:1px solid rgba(128,128,128,.22);height:50px;display:flex;flex-direction:column;justify-content:flex-end;padding:7px;overflow:hidden">';
            html += '<div style="height:4px;border-radius:2px;background:' + fAccHex + ';margin-bottom:3px"></div>';
            html += '<div style="height:3px;border-radius:2px;background:' + fDot + ';width:60%"></div>';
            html += '</div>';
            html += '<button onclick="removeFavorite(' + i + ')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--sf);border:1px solid var(--br2);color:var(--mt);font-size:9px;cursor:pointer;line-height:1;padding:0;display:flex;align-items:center;justify-content:center;font-family:inherit">✕</button>';
            html += '</div>';
        });
        html += '</div>';
    }
    html += '</div>';

    // ── ФОН ──────────────────────────────────────────────
    const bgOpts = [
        { id:'dark',  label:'Тёмный',  bg:'#0b0b0d', dotA:'rgba(255,255,255,.18)', dotB:'rgba(255,255,255,.08)' },
        { id:'grey',  label:'Серый',   bg:'#2c2c2e', dotA:'rgba(255,255,255,.18)', dotB:'rgba(255,255,255,.08)' },
        { id:'light', label:'Светлый', bg:'#f2f2f7', dotA:'rgba(0,0,0,.15)',       dotB:'rgba(0,0,0,.07)' },
    ];
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:14px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:14px">ФОН</div>';
    html += '<div style="display:flex;gap:10px">';
    bgOpts.forEach(opt => {
        const on = _curBg === opt.id;
        html += '<div onclick="applyBgTheme(\'' + opt.id + '\')" style="flex:1;cursor:pointer">';
        html += '<div style="height:60px;border-radius:12px;background:' + opt.bg + ';border:2.5px solid ' + (on ? 'var(--ac)' : 'rgba(128,128,128,.2)') + ';' + (on ? 'box-shadow:0 0 0 1px var(--ac);' : '') + 'margin-bottom:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;position:relative;overflow:hidden">';
        html += '<div style="display:flex;flex-direction:column;gap:5px;width:60%;opacity:.7">';
        html += '<div style="height:6px;border-radius:3px;background:' + opt.dotA + '"></div>';
        html += '<div style="height:4px;border-radius:3px;background:' + opt.dotB + ';width:70%"></div>';
        html += '<div style="height:4px;border-radius:3px;background:' + opt.dotB + ';width:50%"></div>';
        html += '</div>';
        if (on) html += '<div style="position:absolute;top:5px;right:5px;width:16px;height:16px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--btn-main-color);font-weight:700">✓</div>';
        html += '</div>';
        html += '<div style="font-size:10px;text-align:center;color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-weight:' + (on ? '700' : '400') + '">' + opt.label + '</div>';
        html += '</div>';
    });
    html += '</div></div>';

    // ── ТЕКСТ ────────────────────────────────────────────
    const _textOpts = [
        { id:'auto',  label:'Авто',    previewFg:'#bbc4d0', previewBg:'#0a0b0e' },
        { id:'white', label:'Белый',   previewFg:'#ffffff', previewBg:'#0a0b0e' },
        { id:'black', label:'Чёрный',  previewFg:'#000000', previewBg:'#f0eeea' },
    ];
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:14px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:13px">ТЕКСТ</div>';
    html += '<div style="display:flex;gap:9px">';
    _textOpts.forEach(opt => {
        const on = _curText === opt.id;
        html += '<div onclick="applyTextColor(\'' + opt.id + '\')" style="flex:1;cursor:pointer">';
        html += '<div style="height:52px;border-radius:11px;background:' + opt.previewBg + ';border:2.5px solid ' + (on ? 'var(--ac)' : 'rgba(128,128,128,.2)') + ';' + (on ? 'box-shadow:0 0 0 1px var(--ac);' : '') + 'margin-bottom:6px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:9px;gap:5px;position:relative">';
        html += '<div style="height:5px;border-radius:3px;width:80%;background:' + opt.previewFg + ';opacity:.95"></div>';
        html += '<div style="height:3px;border-radius:3px;width:55%;background:' + opt.previewFg + ';opacity:.4"></div>';
        if (on) html += '<div style="position:absolute;top:5px;right:5px;width:15px;height:15px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--btn-main-color);font-weight:700">✓</div>';
        html += '</div>';
        html += '<div style="font-size:10px;text-align:center;color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-weight:' + (on ? '700' : '400') + '">' + opt.label + '</div>';
        html += '</div>';
    });
    html += '</div></div>';

    // ── АКЦЕНТ ───────────────────────────────────────────
    const _savedAccent = (_curAcc || '#C9A84C').replace('#', '');
    // Chromatic presets
    const _accentChromatic = [
        {hex:'C9A84C', name:'Gold'},
        {hex:'4ade80', name:'Green'},
        {hex:'a855f7', name:'Purple'},
        {hex:'22d3ee', name:'Cyan'},
        {hex:'3b82f6', name:'Blue'},
        {hex:'f97316', name:'Orange'},
        {hex:'ef4444', name:'Red'},
    ];
    // Neutral / B&W shades
    const _accentNeutrals = [
        {hex:'F2F2F2', name:'Белый'},
        {hex:'B0B8CC', name:'Серебро'},
        {hex:'6E7488', name:'Серый'},
        {hex:'363850', name:'Антрацит'},
    ];
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:20px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:12px">АКЦЕНТ</div>';
    // Row 1 – chromatic
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">';
    _accentChromatic.forEach(p => {
        const isActive = _savedAccent.toLowerCase() === p.hex.toLowerCase();
        html += '<div onclick="applyAccent(\'' + p.hex + '\')" title="' + p.name + '" style="width:30px;height:30px;border-radius:50%;background:#' + p.hex + ';cursor:pointer;flex-shrink:0;border:2.5px solid ' + (isActive ? 'white' : 'transparent') + ';box-shadow:' + (isActive ? '0 0 0 2px #' + p.hex + ',0 0 10px #' + p.hex + '55' : '0 0 0 1px rgba(255,255,255,.1)') + ';transition:box-shadow .15s,border-color .15s"></div>';
    });
    html += '</div>';
    // Row 2 – neutrals (B&W)
    html += '<div style="display:flex;gap:8px;margin-bottom:14px;padding-top:2px;border-top:1px solid var(--br)">';
    html += '<div style="font-size:8px;color:var(--mt);letter-spacing:1px;line-height:1;align-self:center;flex-shrink:0;margin-top:8px">Б/Ч</div>';
    _accentNeutrals.forEach(p => {
        const isActive = _savedAccent.toLowerCase() === p.hex.toLowerCase();
        // Checkerboard ring for white to make it visible
        const dotBorder = p.hex.toLowerCase() === 'f2f2f2' ? '2.5px solid rgba(150,150,150,.5)' : '2.5px solid ' + (isActive ? 'white' : 'transparent');
        html += '<div onclick="applyAccent(\'' + p.hex + '\')" title="' + p.name + '" style="width:30px;height:30px;border-radius:50%;background:#' + p.hex + ';cursor:pointer;flex-shrink:0;border:' + dotBorder + ';box-shadow:' + (isActive ? '0 0 0 2px #' + p.hex + ',0 0 8px rgba(180,180,180,.4)' : '0 0 0 1px rgba(255,255,255,.1)') + ';transition:box-shadow .15s,border-color .15s;margin-top:8px"></div>';
    });
    html += '</div>';

    // Hue slider
    const _r = parseInt(_savedAccent.slice(0,2),16)/255,
          _g = parseInt(_savedAccent.slice(2,4),16)/255,
          _b = parseInt(_savedAccent.slice(4,6),16)/255;
    const _max = Math.max(_r,_g,_b), _min = Math.min(_r,_g,_b);
    let _h = 0;
    if (_max !== _min) {
        const _d = _max - _min;
        if (_max === _r)      _h = 60*((_g-_b)/_d + (_g<_b?6:0));
        else if (_max === _g) _h = 60*((_b-_r)/_d + 2);
        else                  _h = 60*((_r-_g)/_d + 4);
    }
    const _pct = (Math.round(_h) / 360 * 100).toFixed(1);

    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:1.5px">СВОЙ ЦВЕТ — ПОТЯНИ</div>';
    html += '<button onclick="saveAccentColor()" style="background:var(--ac08);border:1px solid var(--ac25);border-radius:8px;color:var(--ac);font-size:9px;font-weight:700;padding:4px 10px;cursor:pointer;font-family:inherit;letter-spacing:.3px">♥ Сохранить</button>';
    html += '</div>';
    html += '<div id="hue-track" style="position:relative;height:28px;border-radius:14px;cursor:pointer;background:linear-gradient(to right,hsl(0,80%,55%),hsl(30,80%,55%),hsl(60,80%,55%),hsl(90,80%,55%),hsl(120,80%,55%),hsl(150,80%,55%),hsl(180,80%,55%),hsl(210,80%,55%),hsl(240,80%,55%),hsl(270,80%,55%),hsl(300,80%,55%),hsl(330,80%,55%),hsl(360,80%,55%));box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);user-select:none;-webkit-user-select:none" ontouchstart="_hueDrag(event)" ontouchmove="_hueDrag(event)" ontouchend="_hueCommit(event)" onmousedown="_hueDrag(event)" onmousemove="event.buttons&&_hueDrag(event)" onmouseup="_hueCommit(event)">';
    html += '<div id="hue-thumb" style="position:absolute;top:50%;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50%;border:3px solid white;background:#' + _savedAccent + ';left:' + _pct + '%;box-shadow:0 1px 4px rgba(0,0,0,.5);pointer-events:none"></div>';
    html += '</div>';

    // Saved / favourite accent colors
    const _favColors = JSON.parse(localStorage.getItem('sb_fav_colors') || '[]');
    if (_favColors.length > 0) {
        html += '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--br)">';
        html += '<div style="font-size:8px;color:var(--mt);letter-spacing:1px;margin-bottom:8px">СОХРАНЁННЫЕ</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
        _favColors.forEach((hex, i) => {
            const h = hex.replace('#', '');
            const isActive = _savedAccent.toLowerCase() === h.toLowerCase();
            html += '<div style="position:relative;flex-shrink:0">';
            html += '<div onclick="applyAccent(\'' + h + '\')" style="width:30px;height:30px;border-radius:50%;background:#' + h + ';cursor:pointer;border:2.5px solid ' + (isActive ? 'white' : 'transparent') + ';box-shadow:' + (isActive ? '0 0 0 2px #' + h + ',0 0 8px #' + h + '55' : '0 0 0 1px rgba(255,255,255,.12)') + '"></div>';
            html += '<div onclick="removeAccentColor(' + i + ')" style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:var(--sf);border:1px solid var(--br2);color:var(--mt);font-size:8px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit">✕</div>';
            html += '</div>';
        });
        html += '</div></div>';
    }
    html += '</div>';

    return html;
}

// ══════════════════════════════════════════════════════════
// ТРЕНИРОВКА
// ══════════════════════════════════════════════════════════
function _settingsWorkout() {
    const tglRow = (key, label, hint, customFn, isLast) => {
        const on = State.settings[key];
        const fn = customFn || ('State.settings[\'' + key + '\']=!' + on + ';App.render()');
        return '<div onclick="' + fn + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;' + (isLast ? '' : 'border-bottom:1px solid var(--br);') + 'cursor:pointer">' +
            '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:' + (on ? 'var(--tx2)' : 'var(--mt)') + ';margin-bottom:1px">' + label + '</div>' +
            '<div style="font-size:10px;color:var(--sb)">' + hint + '</div></div>' +
            '<div style="width:38px;height:22px;border-radius:11px;background:' + (on ? 'var(--ac)' : 'var(--br2)') + ';position:relative;flex-shrink:0;transition:background .2s">' +
            '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (on ? '18px' : '2px') + ';transition:left .15s"></div>' +
            '</div></div>';
    };

    const isLb = State.settings.unit === 'lb';
    const simpleOn = State.settings.simpleMode;

    let html = _settingsBack('ПАРАМЕТРЫ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Тренировка</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:20px">';

    // Units row
    html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--br)">';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:1px">Единицы веса</div>';
    html += '<div style="font-size:10px;color:var(--sb)">Килограммы или фунты</div></div>';
    html += '<div style="display:flex;gap:4px">';
    html += '<button onclick="saveUnit(\'kg\');App.render()" style="padding:5px 12px;border-radius:8px;border:1px solid ' + (!isLb ? 'var(--ac)' : 'var(--br)') + ';background:' + (!isLb ? 'var(--ac12)' : 'transparent') + ';color:' + (!isLb ? 'var(--ac)' : 'var(--sb)') + ';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">кг</button>';
    html += '<button onclick="saveUnit(\'lb\');App.render()" style="padding:5px 12px;border-radius:8px;border:1px solid ' + (isLb ? 'var(--ac)' : 'var(--br)') + ';background:' + (isLb ? 'var(--ac12)' : 'transparent') + ';color:' + (isLb ? 'var(--ac)' : 'var(--sb)') + ';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">lb</button>';
    html += '</div></div>';

    html += tglRow('timer', 'Таймер отдыха',        'Показывать таймер между подходами', null, false);
    html += tglRow('rpe',   'RPE / Усилие',         'Оценка нагрузки в каждом подходе',  null, false);
    html += tglRow('tempo', 'Темп выполнения',      'Выбор темпа: негатив, пауза и т.д.', null, false);
    html += tglRow('hints', 'Подсказки по технике', 'Советы под каждым упражнением',     null, false);

    // Simple mode
    html += '<div onclick="toggleSimpleMode()" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--br);cursor:pointer">' +
        '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:' + (simpleOn ? 'var(--tx2)' : 'var(--mt)') + ';margin-bottom:1px">Только вес · повторы</div>' +
        '<div style="font-size:10px;color:var(--sb)">Убирает типы подходов и RPE</div></div>' +
        '<div style="width:38px;height:22px;border-radius:11px;background:' + (simpleOn ? 'var(--ac)' : 'var(--br2)') + ';position:relative;flex-shrink:0;transition:background .2s">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (simpleOn ? '18px' : '2px') + ';transition:left .15s"></div>' +
        '</div></div>';

    // Focus mode — last row, no border
    const focusOn = State.settings.focusMode;
    html += '<div onclick="State.settings.focusMode=!State.settings.focusMode;try{localStorage.setItem(\'sb_focus\',State.settings.focusMode?\'1\':\'0\')}catch(e){};App.render()" style="display:flex;align-items:center;gap:12px;padding:12px 0;cursor:pointer">' +
        '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:' + (focusOn ? 'var(--tx2)' : 'var(--mt)') + ';margin-bottom:1px">Режим фокуса</div>' +
        '<div style="font-size:10px;color:var(--sb)">Только вес и повторы · без фото, тегов и подсказок</div></div>' +
        '<div style="width:38px;height:22px;border-radius:11px;background:' + (focusOn ? 'var(--ac)' : 'var(--br2)') + ';position:relative;flex-shrink:0;transition:background .2s">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (focusOn ? '18px' : '2px') + ';transition:left .15s"></div>' +
        '</div></div>';

    html += '</div>';
    return html;
}

// ══════════════════════════════════════════════════════════
// АККАУНТ
// ══════════════════════════════════════════════════════════
function _settingsAccount() {
    const au = State.auth;
    let html = _settingsBack('СИНХРОНИЗАЦИЯ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Аккаунт</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:16px">';
    if (au.status === 'authed' && au.user) {
        const AVATARS = ['💪','🔥','👑','⚡','🏆'];
        const prof    = au.profile;
        const ava     = AVATARS[prof ? (prof.avatar_idx || 0) : 0];
        const nick    = prof ? prof.nickname : (au.user.email || '');
        html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--br)">';
        html += '<div style="width:44px;height:44px;border-radius:50%;background:var(--ac15);border:2px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">' + ava + '</div>';
        html += '<div style="flex:1;min-width:0">';
        html += '<div style="font-size:15px;font-weight:700;color:var(--tx);margin-bottom:2px;letter-spacing:.3px">' + nick + '</div>';
        html += '<div style="font-size:10px;color:var(--ac);letter-spacing:1px">ОБЛАКО АКТИВНО ☁️</div>';
        if (au.user.email) html += '<div style="font-size:10px;color:var(--sb);margin-top:1px">' + au.user.email + '</div>';
        html += '</div></div>';
        html += '<div style="padding:12px 0;display:flex;align-items:center;justify-content:space-between">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--mt)">Выйти из аккаунта</div>';
        html += '<button onclick="AuthActions.signOut()" style="background:transparent;border:1px solid var(--br);border-radius:8px;color:var(--sb);font-size:11px;padding:5px 12px;cursor:pointer;font-family:inherit">Выйти</button>';
        html += '</div>';
    } else if (au.status === 'guest') {
        html += '<div style="padding:14px 0">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:4px">Гостевой режим</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-bottom:12px">Данные хранятся только на этом устройстве</div>';
        html += '<button onclick="State.auth.showScreen=true;State.auth.status=\'unauthed\';localStorage.removeItem(\'sb_guest\');State.auth.error=\'\';App.render()" style="width:100%;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--gradient-primary);color:var(--btn-main-color)">Войти / Зарегистрироваться</button>';
        html += '</div>';
    } else {
        html += '<div style="padding:14px 0">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:4px">Облачная синхронизация</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-bottom:12px">Сохраняй историю тренировок на всех устройствах</div>';
        html += '<button onclick="State.auth.showScreen=true;State.auth.error=\'\';App.render()" style="width:100%;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--gradient-primary);color:var(--btn-main-color)">Войти / Зарегистрироваться</button>';
        html += '</div>';
    }
    html += '</div>';

    // Danger zone
    html += '<div style="background:rgba(180,40,40,.05);border:1px solid rgba(180,40,40,.18);border-radius:14px;padding:0 14px;margin-bottom:20px">';
    html += '<div style="font-size:9px;color:#b44040;letter-spacing:2px;padding:10px 0 6px">ОПАСНАЯ ЗОНА</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(180,40,40,.12)">';
    html += '<div><div style="font-size:13px;font-weight:500;color:#d06060;margin-bottom:1px">Очистить данные</div>';
    html += '<div style="font-size:10px;color:#8a5555">Удаляет тренировки и прогресс, аккаунт остаётся</div></div>';
    html += '<button onclick="State.modal={type:\'confirmClear\'};App.renderModal()" style="background:transparent;border:1px solid rgba(180,40,40,.3);border-radius:8px;color:#d06060;font-size:11px;padding:5px 10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;margin-left:10px">Очистить</button>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(180,40,40,.12)">';
    html += '<div><div style="font-size:13px;font-weight:500;color:#e05050;margin-bottom:1px">Удалить аккаунт</div>';
    html += '<div style="font-size:10px;color:#8a5555">Удаляет всё без возможности восстановления</div></div>';
    html += '<button onclick="State.modal={type:\'confirmDelete\'};App.renderModal()" style="background:rgba(180,40,40,.15);border:1px solid rgba(180,40,40,.4);border-radius:8px;color:#e05050;font-size:11px;padding:5px 10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;margin-left:10px">Удалить</button>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ══════════════════════════════════════════════════════════
// ПОМОЩЬ
// ══════════════════════════════════════════════════════════
function _settingsHelp() {
    let html = _settingsBack('ИНФОРМАЦИЯ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Помощь</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:20px">';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--br);cursor:pointer">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--tx2)">Как пользоваться</div>';
    html += '<span style="color:var(--mt);font-size:18px">›</span>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--br);cursor:pointer">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--tx2)">Связаться с нами</div>';
    html += '<span style="color:var(--mt);font-size:18px">›</span>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--mt)">Версия</div>';
    html += '<div style="font-size:12px;color:var(--mt);font-family:monospace">1.0.0</div>';
    html += '</div>';

    html += '</div>';
    return html;
}
