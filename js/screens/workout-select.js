// ═══ SCREEN: WORKOUT SELECT ═══

// ──────────────────────────────────────────────────────────────────────────
//  SCREEN 2 — Настройки упражнения (Plan Detail)
//  Открывается при тапе на упражнение в списке «План»
// ──────────────────────────────────────────────────────────────────────────
function _planDetailScreen(idx) {
  const p = State.diary.plan[idx];
  if (!p) { State.diary.planDetailIdx = null; App.render(); return ''; }

  // Опции углов скамьи по снаряду
  const _ANGLE_OPTS = {
    barbell:      [{id:'upper',icon:'↗',label:'Наклонная',    sub:'Верх · 30–45°'},
                   {id:'middle',icon:'→',label:'Горизонтальная',sub:'Середина груди'},
                   {id:'lower',icon:'↘',label:'Отрицательный',  sub:'Низ груди'}],
    dumbbells:    [{id:'upper',icon:'↗',label:'Наклонная',    sub:'Верх · 30–45°'},
                   {id:'middle',icon:'→',label:'Горизонтальная',sub:'Середина груди'},
                   {id:'lower',icon:'↘',label:'Отрицательный',  sub:'Низ груди'}],
    smith:        [{id:'upper',icon:'↗',label:'Наклонная',    sub:'Верх · 30–45°'},
                   {id:'middle',icon:'→',label:'Горизонтальная',sub:'Середина груди'},
                   {id:'lower',icon:'↘',label:'Отрицательный',  sub:'Низ груди'}],
    hammer:       [{id:'upper',icon:'↗',label:'Наклонная',    sub:'Верх груди'},
                   {id:'middle',icon:'→',label:'Горизонтальная',sub:'Середина груди'}],
    cable_single: [{id:'upper',icon:'↗',label:'Верх',         sub:'Блок снизу'},
                   {id:'middle',icon:'→',label:'Середина',     sub:'Блок на уровне'},
                   {id:'lower',icon:'↘',label:'Низ',           sub:'Блок сверху'}],
    bodyweight:   [{id:'upper',icon:'↗',label:'Ноги выше',    sub:'Верх груди'},
                   {id:'middle',icon:'→',label:'От пола',      sub:'Стандарт'}],
    dip_bars:     [{id:'upper',icon:'↗',label:'Корпус вперёд',sub:'Акцент грудь'},
                   {id:'middle',icon:'→',label:'Вертикально',  sub:'Трицепс + грудь'}],
  };
  const angleOpts = _ANGLE_OPTS[p.equip] || null;

  const _EQUIP_LBL = {barbell:'Штанга',dumbbells:'Гантели',smith:'Смит',hammer:'Хаммер',
                       cable_single:'Кроссовер',bodyweight:'Своим весом',dip_bars:'Брусья'};
  const equipLabel = _EQUIP_LBL[p.equip] || p.equip;
  const angleLabel = angleOpts && p.accent ? ((angleOpts.find(a=>a.id===p.accent)||{}).label||'') : '';

  // Ширина хвата — только для штанги и гантелей
  const showGripW = ['barbell','dumbbells','smith','ez'].includes(p.equip);
  const gw = p.gripWidth || 'medium';

  // Эффект
  const gripFxMap = (typeof EX_GRIP_WIDTH_FX !== 'undefined') ? (EX_GRIP_WIDTH_FX[p.exId] || EX_GRIP_WIDTH_FX._default) : {};
  const gripEffect = showGripW ? (gripFxMap[gw] || null) : null;

  // Избранное
  const _favEx = JSON.parse(localStorage.getItem('sb_fav_ex') || '[]');
  const isFav  = _favEx.some(f =>
    f.exId === p.exId && f.equip === p.equip &&
    (f.accent||'') === (p.accent||'') && f.gripWidth === gw
  );

  // TUT
  const tutOpts = (typeof TUT_EX_OPTIONS !== 'undefined')
    ? (TUT_EX_OPTIONS[p.exId] !== undefined ? TUT_EX_OPTIONS[p.exId] : ['pause1','negative3'])
    : [];
  const tutOn  = !!p.tutExpanded;
  const restOn = !!p.restExpanded;
  const TUT_EFF = {
    normal:'Натуральный темп · развитие силы', pause1:'Пауза 1 с · устраняет инерцию · стартовая сила',
    pause3:'Пауза 3 с · максимальный контроль', pause_mid:'Пауза в слабой точке · стабилизация',
    negative3:'Медленный негатив · гипертрофия', slow:'Темп 4-0-4 · максимальное напряжение',
  };
  const REST_EFF = {
    '45':'выносливость','60':'выносливость','90':'выносливость · плотность',
    '120':'баланс силы и объёма','180':'сила · восстановление','300':'максимум силы · полный отдых',
  };
  const tutEffect  = (tutOn  && p.tut !== 'normal') ? (TUT_EFF[p.tut]  || null) : null;
  const restEffect = (restOn && p.rest !== '120')    ? (REST_EFF[p.rest] || null) : null;
  const hasEffect  = !!(gripEffect || tutEffect || restEffect);
  const restLabel  = (typeof REST_LIST !== 'undefined') ? (REST_LIST.find(r=>r.id===p.rest)||null) : null;

  let html = '';

  // ── Top bar ────────────────────────────────────────────
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  html += '<button class="btn btn-ghost" style="padding:6px 10px" onclick="Diary.closePlanDetail()">‹ Назад</button>';
  html += '<button onclick="Diary.saveFavEx()" style="background:none;border:none;cursor:pointer;font-size:22px;padding:6px 8px;line-height:1;color:' + (isFav?'#e04060':'var(--mt)') + '" title="Сохранить в любимые">' + (isFav?'♥':'♡') + '</button>';
  html += '</div>';

  // ── Dynamic title ───────────────────────────────────────
  html += '<span class="lbl">' + (p.muscle||'') + '</span>';
  html += '<div class="ttl" style="font-size:26px;margin-bottom:2px">' + (p.name||'') + '</div>';
  html += '<div style="font-size:11px;color:var(--sb);margin-bottom:20px">' + equipLabel + (angleLabel ? ' · ' + angleLabel : '') + '</div>';

  // ── Угол скамьи ─────────────────────────────────────────
  if (angleOpts && angleOpts.length) {
    html += '<div style="margin-bottom:20px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2.5px;margin-bottom:10px">УГОЛ СКАМЬИ</div>';
    html += '<div style="display:flex;gap:8px">';
    angleOpts.forEach(a => {
      const on = p.accent === a.id;
      html += '<div onclick="Diary.setPlanAngle(\'' + a.id + '\')" style="flex:1;border-radius:12px;border:1.5px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';padding:10px 6px 9px;text-align:center;cursor:pointer">';
      html += '<div style="font-size:18px;margin-bottom:5px;line-height:1;color:' + (on?'var(--ac)':'var(--mt)') + '">' + a.icon + '</div>';
      html += '<div style="font-size:11px;font-weight:' + (on?'700':'500') + ';color:' + (on?'var(--ac)':'var(--tx)') + ';margin-bottom:3px">' + a.label + '</div>';
      html += '<div style="font-size:9px;color:' + (on?'var(--ac)':'var(--sb)') + ';line-height:1.3">' + a.sub + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ── Ширина хвата ────────────────────────────────────────
  if (showGripW) {
    html += '<div style="margin-bottom:20px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2.5px;margin-bottom:10px">ШИРИНА ХВАТА</div>';
    html += '<div style="display:flex;gap:8px">';
    GRIP_WIDTHS.forEach(g => {
      const on = gw === g.id;
      html += '<button onclick="Diary.setPlanField(\'gripWidth\',\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:10px;border:1.5px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';color:' + (on?'var(--ac)':'var(--tx)') + ';font-size:12px;font-weight:' + (on?'700':'400') + ';cursor:pointer;font-family:inherit">' + g.name + '</button>';
    });
    html += '</div></div>';
  }

  // ── Эффект ──────────────────────────────────────────────
  if (hasEffect) {
    html += '<div style="background:var(--ac06);border:1px solid var(--ac15);border-radius:12px;padding:12px 14px;margin-bottom:20px">';
    html += '<div style="font-size:8px;color:var(--ac);letter-spacing:2px;margin-bottom:8px;opacity:.8">ЭФФЕКТ</div>';
    if (gripEffect)  html += '<div style="font-size:12px;color:var(--tx);margin-bottom:' + (tutEffect||restEffect?'5px':'0') + '">' + (showGripW?'<span style="font-size:8px;color:var(--sb);letter-spacing:1px;margin-right:6px">ШИРИНА</span>':'') + '→ ' + gripEffect + '</div>';
    if (tutEffect)   html += '<div style="font-size:12px;color:var(--tx);margin-bottom:' + (restEffect?'5px':'0') + '"><span style="font-size:8px;color:var(--sb);letter-spacing:1px;margin-right:6px">ТЕМП</span>→ ' + tutEffect + '</div>';
    if (restEffect)  html += '<div style="font-size:12px;color:var(--tx)"><span style="font-size:8px;color:var(--sb);letter-spacing:1px;margin-right:6px">ОТДЫХ</span>→ ' + restEffect + '</div>';
    html += '</div>';
  }

  // ── PRO toggles ─────────────────────────────────────────
  html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:20px">';

  // Темп
  if (tutOpts.length > 0) {
    html += '<div style="padding:12px 0;border-bottom:1px solid var(--br)">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between' + (tutOn?';margin-bottom:10px':'') + '">';
    html += '<div><div style="font-size:13px;font-weight:500;color:' + (tutOn?'var(--tx2)':'var(--mt)') + '">Темп</div>';
    html += '<div style="font-size:10px;color:var(--sb)">Пауза · негатив · медленное движение</div></div>';
    html += '<div onclick="Diary.setPlanField(\'tutExpanded\',' + !tutOn + ')" style="width:38px;height:22px;border-radius:11px;background:' + (tutOn?'var(--ac)':'var(--br2)') + ';position:relative;cursor:pointer;flex-shrink:0;transition:background .2s">';
    html += '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (tutOn?'18px':'2px') + ';transition:left .15s"></div></div></div>';
    if (tutOn) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px;padding-bottom:4px">';
      (typeof TUT_LIST !== 'undefined' ? TUT_LIST : []).filter(t => t.id !== 'normal' && tutOpts.includes(t.id)).forEach(t => {
        const on = p.tut === t.id;
        html += '<button onclick="Diary.setPlanField(\'tut\',\'' + t.id + '\')" style="padding:6px 12px;border-radius:16px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'transparent') + ';color:' + (on?'var(--ac)':'var(--mt)') + ';font-size:11px;font-weight:' + (on?'700':'400') + ';cursor:pointer;font-family:inherit">' + t.name + '</button>';
      });
      html += '</div>';
    }
    html += '</div>';
  }

  // Время отдыха
  html += '<div style="padding:12px 0">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between' + (restOn?';margin-bottom:10px':'') + '">';
  html += '<div><div style="font-size:13px;font-weight:500;color:' + (restOn?'var(--tx2)':'var(--mt)') + '">Время отдыха</div>';
  html += '<div style="font-size:10px;color:var(--sb)">' + (restLabel && p.rest !== '120' ? restLabel.name : 'Сейчас: 2 мин (по умолчанию)') + '</div></div>';
  html += '<div onclick="Diary.setPlanField(\'restExpanded\',' + !restOn + ')" style="width:38px;height:22px;border-radius:11px;background:' + (restOn?'var(--ac)':'var(--br2)') + ';position:relative;cursor:pointer;flex-shrink:0;transition:background .2s">';
  html += '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (restOn?'18px':'2px') + ';transition:left .15s"></div></div></div>';
  if (restOn) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;padding-bottom:4px">';
    (typeof REST_LIST !== 'undefined' ? REST_LIST : []).forEach(r => {
      const on = (p.rest || '120') === r.id;
      html += '<button onclick="Diary.setPlanField(\'rest\',\'' + r.id + '\')" style="padding:6px 12px;border-radius:16px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'transparent') + ';color:' + (on?'var(--ac)':'var(--mt)') + ';font-size:11px;font-weight:' + (on?'700':'400') + ';cursor:pointer;font-family:inherit">' + r.name + '</button>';
    });
    html += '</div>';
  }
  html += '</div></div>';

  // ── Готово ─────────────────────────────────────────────
  html += '<button onclick="Diary.closePlanDetail()" style="width:100%;padding:14px;border-radius:14px;border:none;background:var(--gradient-primary);color:var(--btn-main-color);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.3px">Готово ✓</button>';
  html += '<div style="height:24px"></div>';
  return html;
}

Screens.workoutSelect = function() {
    // ── Screen 2: план → настройки упражнения ──
    if (State.diary.planDetailIdx !== null) return _planDetailScreen(State.diary.planDetailIdx);

    const sel  = State.selector;
    const plan = State.diary.plan;

    // Pre-compute canAdd for sticky button
    let _canAdd = false;
    let _hintMsg = '';
    if (sel.muscle) {
      const _cats = MOVEMENT_TREE[sel.muscle];
      if (_cats) {
        const _effCatId = sel.categoryId || (_cats.length === 1 ? _cats[0].id : null);
        const _cat = _effCatId ? _cats.find(c => c.id === _effCatId) : null;
        if (_cat) {
          const _effTypeId = sel.typeId || (_cat.types.length === 1 ? _cat.types[0].id : null);
          const _type = _effTypeId ? _cat.types.find(t => t.id === _effTypeId) : null;
          if (_type) {
            const _effAcc = (_type.equipAccents && sel.equip && _type.equipAccents[sel.equip]) || _type.accents;
            const _acReq  = _effAcc && _effAcc.length > 1 && !sel.accent;
            const _eqPool = (_type.accentEquips && sel.accent && _type.accentEquips[sel.accent]) || _type.equips;
            let _needsAcc, _needsEq;
            if (_type.equipFirst) {
              _needsEq  = _eqPool && _eqPool.length > 1 && !_type.fixedEquip && !sel.equip;
              _needsAcc = !_needsEq && _acReq;
            } else {
              _needsAcc = _acReq;
              _needsEq  = !_needsAcc && _eqPool && _eqPool.length > 1 && !_type.fixedEquip && !sel.equip;
            }
            _canAdd = !_needsAcc && !_needsEq;
            if (!_canAdd) {
              if (_needsAcc) _hintMsg = '↑ выбери тип';
              else if (_needsEq) _hintMsg = '↑ выбери снаряд';
            }
          }
        }
      } else {
        _canAdd = !!sel.typeId;
      }
    }

    const chip = (label, active, onclick, extra) =>
      '<button onclick="' + onclick + '" style="padding:9px 16px;border-radius:20px;border:1px solid ' +
      (active ? 'var(--ac)' : 'var(--br)') + ';background:' + (active ? 'var(--ad)' : 'var(--sf)') +
      ';color:' + (active ? 'var(--ac)' : 'var(--tx)') + ';font-size:13px;font-weight:' + (active ? '700' : '400') +
      ';cursor:pointer;font-family:inherit;' + (extra || '') + '">' + label + '</button>';

    let html = '';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">';
    html += '<button class="btn btn-ghost" onclick="const mid=State.diary.midWorkoutAdd;State.diary.midWorkoutAdd=false;State.diary.stage=mid?\'active\':\'browse\';App.render()">‹</button>';
    html += '<div><span class="lbl">КОНСТРУКТОР</span><div class="ttl" style="font-size:26px">Добавить упражнение</div></div>';
    html += '</div>';

    // ── Шаг 1: Мышца ──────────────────────────────
    html += '<div style="margin-bottom:20px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">МЫШЦА</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:7px">';
    MUSCLES.forEach(m => {
      html += chip(m, sel.muscle === m, 'Diary.selectorSetMuscle(\'' + m + '\')');
    });
    html += '</div></div>';

    if (sel.muscle) {
      const categories = MOVEMENT_TREE[sel.muscle] || null;

      if (categories) {
        // ── Шаг 2: Категория движения (скрывается если одна) ──
        const effectiveCatId = sel.categoryId || (categories.length === 1 ? categories[0].id : null);
        if (categories.length > 1) {
          html += '<div style="margin-bottom:20px">';
          html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">ДВИЖЕНИЕ</div>';
          html += '<div style="display:flex;flex-wrap:wrap;gap:7px">';
          categories.forEach(cat => {
            html += chip(cat.name, effectiveCatId === cat.id, 'Diary.selectorSetCategory(\'' + cat.id + '\')');
          });
          html += '</div></div>';
        }

        if (effectiveCatId) {
          const cat = categories.find(c => c.id === effectiveCatId);
          if (cat) {
            // Авто-выбор типа если он один
            const effectiveTypeId = sel.typeId || (cat.types.length === 1 ? cat.types[0].id : null);

            // ── Шаг 3: Тип (скрыть если только один) ───
            if (cat.types.length > 1) {
              html += '<div style="margin-bottom:20px">';
              html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">' + (cat.typeLabel || 'ТИП') + '</div>';
              html += '<div style="display:flex;flex-wrap:wrap;gap:7px">';
              cat.types.forEach(t => {
                const isOn = effectiveTypeId === t.id;
                if (t.sub) {
                  // Чип с micro-hint подсказкой
                  html += '<button onclick="Diary.selectorSetType(\'' + t.id + '\')" style="padding:8px 14px;border-radius:20px;border:1px solid ' +
                    (isOn ? 'var(--ac)' : 'var(--br)') + ';background:' + (isOn ? 'var(--ad)' : 'var(--sf)') +
                    ';cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:1px">' +
                    '<span style="font-size:13px;font-weight:' + (isOn ? '700' : '400') + ';color:' + (isOn ? 'var(--ac)' : 'var(--tx)') + '">' + t.name + '</span>' +
                    '<span style="font-size:9px;color:' + (isOn ? 'var(--ac)' : 'var(--sb)') + ';opacity:.7;letter-spacing:0">' + t.sub + '</span>' +
                    '</button>';
                } else {
                  html += chip(t.name, isOn, 'Diary.selectorSetType(\'' + t.id + '\')');
                }
              });
              html += '</div></div>';
            }

            if (effectiveTypeId) {
              const type = cat.types.find(t => t.id === effectiveTypeId);
              if (type) {

                // ── Шаги 4 & 5: рендерим Снаряд и Акцент в нужном порядке ──
                // type.equipFirst=true → Снаряд → Положение; иначе → Положение → Снаряд
                // effectiveAccents: фильтруем по выбранному снаряду (если есть equipAccents)
                const effectiveAccents = (type.equipAccents && sel.equip && type.equipAccents[sel.equip]) || type.accents;
                const _renderAccents = () => {
                  if (!effectiveAccents || !effectiveAccents.length) return;
                  if (effectiveAccents.length === 1) return; // авто-выбор, не показываем
                  html += '<div style="margin-bottom:20px">';
                  html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">' + (type.accentLabel || 'АКЦЕНТ') + '</div>';
                  html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
                  effectiveAccents.forEach(ac => {
                    const isOn = sel.accent === ac.id;
                    html += '<button onclick="Diary.selectorSetAccent(\'' + ac.id + '\')" style="padding:9px 16px;border-radius:20px;border:1px solid ' +
                      (isOn ? 'var(--ac)' : 'var(--br)') + ';background:' + (isOn ? 'var(--ad)' : 'var(--sf)') +
                      ';color:' + (isOn ? 'var(--ac)' : 'var(--tx)') + ';font-size:13px;font-weight:' + (isOn ? '700' : '400') +
                      ';cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:2px">' +
                      '<span>' + ac.name + '</span>' +
                      (ac.sub ? '<span style="font-size:9px;font-weight:400;opacity:.6;letter-spacing:0">' + ac.sub + '</span>' : '') +
                      '</button>';
                  });
                  html += '</div></div>';
                };
                const _renderEquips = () => {
                  const effEquips = (type.accentEquips && sel.accent && type.accentEquips[sel.accent]) || type.equips;
                  if (!effEquips || effEquips.length <= 1) return;
                  html += '<div style="margin-bottom:20px">';
                  html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">' + (type.equipLabel || 'СНАРЯД') + '</div>';
                  html += '<div style="display:flex;flex-wrap:wrap;gap:7px">';
                  effEquips.forEach(eqId => {
                    const eq = EQUIPMENT_LIST.find(e => e.id === eqId);
                    if (!eq) return;
                    const icon = CABLE_ICONS[eqId];
                    const active = sel.equip === eqId;
                    const fn = 'Diary.selectorSetEquip(\'' + eqId + '\')';
                    if (icon) {
                      const shortNames = {cable_wide:'Широкая',cable_v:'V-рукоять',cable_v_small:'V малая',cable_single:'Одиночный',cable_d:'D-рукоять',cable_rope:'Канат',cable_narrow:'Узкая',cable_straight:'Прямая',cable_handle:'Рукоятка',cable_rope_single:'Один. канат'};
                      const label = (type.equipNames && type.equipNames[eqId]) || shortNames[eqId] || eq.name;
                      html += '<button onclick="' + fn + '" style="position:relative;overflow:hidden;border-radius:12px;border:2px solid ' + (active ? 'var(--ac)' : '#2a2a2a') + ';width:90px;height:90px;cursor:pointer;padding:0;font-family:inherit;flex-shrink:0;background:#111;display:flex;flex-direction:column">' +
                        '<div style="flex:1;overflow:hidden">' +
                        '<img src="' + icon + '" style="width:100%;height:100%;object-fit:cover;display:block" />' +
                        '</div>' +
                        '<div style="background:#1c1c1c;padding:4px 3px 5px;text-align:center;border-top:1px solid #2a2a2a">' +
                        '<span style="font-size:10px;color:' + (active ? 'var(--ac)' : '#aaa') + ';font-weight:' + (active ? '700' : '400') + ';white-space:nowrap">' + label + '</span>' +
                        '</div>' +
                        (active ? '<div style="position:absolute;inset:0;border-radius:10px;box-shadow:inset 0 0 0 2px var(--ac)"></div>' : '') +
                        '</button>';
                    } else {
                      const label = (type.equipNames && type.equipNames[eqId]) || eq.name;
                      html += chip(label, active, fn);
                    }
                  });
                  html += '</div></div>';
                };
                if (type.equipFirst) {
                  _renderEquips();
                  if (sel.equip) _renderAccents();
                } else {
                  _renderAccents();
                  if (!type.accents || !type.accents.length || sel.accent) _renderEquips();
                }

                // Grip is now set at set level, not in constructor

                // ── Кнопка Добавить ───────────────────
                let needsAccent, needsEquip;
                // Акцент не нужен если вариант один (авто-выбор) или уже выбран
                const accentRequired = effectiveAccents && effectiveAccents.length > 1 && !sel.accent;
                // Снаряд фильтруется по направлению (accentEquips)
                const equipPool = (type.accentEquips && sel.accent && type.accentEquips[sel.accent]) || type.equips;
                if (type.equipFirst) {
                  needsEquip  = equipPool && equipPool.length > 1 && !type.fixedEquip && !sel.equip;
                  needsAccent = !needsEquip && accentRequired;
                } else {
                  needsAccent = accentRequired;
                  needsEquip  = !needsAccent && equipPool && equipPool.length > 1 && !type.fixedEquip && !sel.equip;
                }
                // canAdd is used by the sticky button below
              }
            }
          }
        }
      } else {
        // ── Фоллбэк для мышц без дерева ──────────
        html += '<div style="margin-bottom:20px">';
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:3px;margin-bottom:8px">УПРАЖНЕНИЕ</div>';
        (EXERCISES[sel.muscle] || []).forEach(ex => {
          const p = prevOf(ex.id);
          html += '<button onclick="Diary.selectorSetType(\'' + ex.id + '\')" style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid ' +
            (sel.typeId === ex.id ? 'var(--ac)' : 'var(--br)') + ';background:' +
            (sel.typeId === ex.id ? 'var(--ad)' : 'var(--sf)') + ';text-align:left;cursor:pointer;font-family:inherit;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">';
          html += '<div style="font-size:13px;font-weight:600;color:' + (sel.typeId === ex.id ? 'var(--ac)' : 'var(--tx)') + '">' + ex.name + '</div>';
          html += '<div style="font-size:10px;color:var(--sb)">' + p.w + '×' + p.r + '</div></button>';
        });
        html += '</div>';

        // canAdd handled by sticky button below
      }
    }

    // ── Кнопки: сначала они, потом список ────────────────────────
    const _hasPlan = plan.length > 0;
    html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;margin-bottom:20px">';
    // Кнопка 1: Добавить в план
    html += '<button ' + (_canAdd ? 'onclick="Diary.addToPlan()"' : 'disabled') +
      ' style="width:100%;padding:14px;border-radius:14px;border:none;font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.3px;' +
      (_canAdd
        ? 'background:var(--gradient-primary);color:var(--btn-main-color);cursor:pointer;box-shadow:0 4px 20px var(--ac25)'
        : 'background:#1a1a1a;color:#444;cursor:not-allowed') +
      '">+ Добавить в план</button>';
    if (!_canAdd && _hintMsg) {
      html += '<div style="text-align:center;font-size:10px;color:#555;letter-spacing:.3px;margin-top:-4px">' + _hintMsg + '</div>';
    }
    // Кнопка 2: Начать тренировку — показывает счётчик добавленных упражнений
    html += '<button ' + (_hasPlan ? 'onclick="Diary.startWorkout()"' : 'disabled') +
      ' style="width:100%;padding:14px;border-radius:14px;border:none;font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.3px;' +
      (_hasPlan
        ? 'background:var(--sf);color:var(--ac);cursor:pointer;border:1px solid var(--ac);box-shadow:0 2px 12px var(--ac15)'
        : 'background:#111;color:#333;cursor:not-allowed;border:1px solid #222') +
      '">▶ Начать тренировку' + (_hasPlan ? ' <span style="font-size:11px;opacity:.7;font-weight:400">· ' + plan.length + ' упр</span>' : '') + '</button>';
    html += '</div>';

    // ── Список упражнений в плане (после кнопок) ─────────────────
    if (plan.length > 0) {
      html += '<div style="border-top:1px solid var(--br);padding-top:16px;margin-bottom:24px">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
      html += '<span class="lbl">ПЛАН · ' + plan.length + ' упр</span>';
      html += '<span style="font-size:9px;color:var(--mt)">тап → настройки</span>';
      html += '</div>';
      plan.forEach((p, i) => {
        const displayName = formatExName(p.name, p.equip, p.accent, p.muscle, p.exId || p.id);
        const hasConfig = p.accent || p.gripWidth !== 'medium' || p.tut !== 'normal' || p.rest !== '120';
        html += '<div onclick="Diary.openPlanDetail(' + i + ')" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--br);cursor:pointer">';
        html += '<div style="flex:1;min-width:0">';
        html += '<div style="font-size:13px;font-weight:600;color:var(--tx)">' + displayName + '</div>';
        if (hasConfig) {
          const tags = [];
          if (p.accent) tags.push(['upper','Наклон','lower','Декл'].includes(p.accent) ? p.accent === 'upper' ? '↗' : p.accent === 'lower' ? '↘' : '→' : p.accent);
          if (p.gripWidth && p.gripWidth !== 'medium') tags.push({narrow:'Узкий',wide:'Широкий'}[p.gripWidth] || p.gripWidth);
          if (p.tut && p.tut !== 'normal') tags.push({pause1:'Пауза 1с',pause3:'Пауза 3с',negative3:'Негатив',slow:'4-0-4',pause_mid:'Пауза сер.'}[p.tut] || p.tut);
          if (p.rest && p.rest !== '120') { const rl = REST_LIST.find(r=>r.id===p.rest); if(rl) tags.push(rl.name); }
          if (tags.length) html += '<div style="font-size:9px;color:var(--ac);margin-top:2px">' + tags.join(' · ') + '</div>';
        }
        html += '</div>';
        html += '<span style="font-size:14px;color:var(--mt);flex-shrink:0">›</span>';
        html += '<button onclick="event.stopPropagation();Diary.removeFromPlan(' + i + ')" style="background:none;border:none;color:#333;cursor:pointer;font-size:15px;padding:4px;flex-shrink:0">✕</button>';
        html += '</div>';
      });
      html += '</div>';
    }

    return html;
};

Screens.workoutPlan = function() {
    const plan = State.diary.plan;
    let html = '';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">';
    html += '<button class="btn btn-ghost" onclick="State.diary.stage=\'select\';App.render()">‹</button>';
    html += '<div><span class="lbl">ТРЕНИРОВКА</span><div class="ttl" style="font-size:26px">План</div></div>';
    html += '</div>';

    if (!plan.length) {
      html += '<div style="text-align:center;padding:40px 0;color:var(--mt)">';
      html += '<div style="font-size:32px;margin-bottom:12px">📋</div>';
      html += '<div style="font-size:14px;margin-bottom:8px">Список пустой</div>';
      html += '<div style="font-size:12px;color:var(--sb)">Добавь упражнения через конструктор</div>';
      html += '</div>';
      html += '<button onclick="State.diary.stage=\'select\';App.render()" class="btn btn-accent btn-full" style="border-radius:14px;font-size:14px;padding:14px">+ Добавить упражнение</button>';
      return html;
    }

    plan.forEach((p, i) => {
      const displayName = formatExName(p.name, p.equip, p.accent, p.muscle, p.exId || p.id);
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-top:1px solid var(--br2);border-radius:12px;padding:14px;margin-bottom:8px;display:flex;align-items:center;gap:10px">';
      html += '<div style="display:flex;flex-direction:column;gap:4px">';
      html += '<button onclick="Diary.movePlan(' + i + ',-1)" ' + (i===0 ? 'disabled' : '') + ' style="background:var(--s2);border:1px solid var(--br);border-radius:6px;width:28px;height:26px;cursor:' + (i===0?'not-allowed':'pointer') + ';color:' + (i===0?'var(--mt)':'var(--sb)') + ';font-size:13px">↑</button>';
      html += '<button onclick="Diary.movePlan(' + i + ',1)" ' + (i===plan.length-1 ? 'disabled' : '') + ' style="background:var(--s2);border:1px solid var(--br);border-radius:6px;width:28px;height:26px;cursor:' + (i===plan.length-1?'not-allowed':'pointer') + ';color:' + (i===plan.length-1?'var(--mt)':'var(--sb)') + ';font-size:13px">↓</button>';
      html += '</div>';
      html += '<div style="flex:1">';
      html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">' + displayName + '</div>';
      html += '<div style="font-size:10px;color:var(--sb);margin-top:3px">' + p.muscle + '</div>';
      html += '</div>';
      html += '<button onclick="Diary.removeFromPlan(' + i + ')" style="background:none;border:none;color:#333;cursor:pointer;font-size:16px;padding:4px">✕</button>';
      html += '</div>';
    });

    html += '<div style="display:flex;gap:8px;margin-top:8px">';
    html += '<button onclick="State.diary.stage=\'select\';App.render()" class="btn btn-surface" style="flex:1;padding:13px">+ Ещё</button>';
    html += '<button onclick="Diary.startWorkout()" class="btn btn-accent" style="flex:2;padding:13px;border-radius:12px;font-size:14px">▶ Начать тренировку</button>';
    html += '</div>';

    return html;
};

Screens.workoutBuild = function() {
    const sel = State.diary.selections;
    const active = State.diary.muscles;
    const total = Object.values(sel).flat().length;

    let html = '<button class="btn btn-ghost" style="margin-bottom:16px" onclick="State.diary.stage=\'browse\';App.render()">‹ Назад</button>';
    html += '<span class="lbl">КОНСТРУКТОР</span>';
    html += '<div class="ttl" style="margin-bottom:4px">Что тренируем?</div>';
    html += '<div style="font-size:12px;color:var(--sb);margin-bottom:18px">Мышцы → упражнения</div>';

    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">';
    MUSCLES.forEach(m => {
      const cnt = (sel[m] || []).length;
      const on = active.includes(m);
      html += '<button class="chip' + (on ? ' active' : '') + '" onclick="Diary.toggleMuscle(\'' + m + '\')">' + m;
      if (cnt > 0) html += '<span style="background:var(--ac);color:#000;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center">' + cnt + '</span>';
      html += '</button>';
    });
    html += '</div>';

    active.forEach(muscle => {
      html += '<div style="margin-bottom:16px">';
      html += '<div style="font-size:9px;color:var(--ac);letter-spacing:2px;margin-bottom:8px">' + muscle.toUpperCase() + '</div>';
      (EXERCISES[muscle] || []).forEach(ex => {
        const selected = (sel[muscle] || []).includes(ex.id);
        const f = ex.last > 30;
        const p = prevOf(ex.id);
        html += '<button style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid ' + (selected ? 'var(--ac)' : 'var(--br)') + ';background:' + (selected ? 'var(--ad)' : 'var(--sf)') + ';text-align:left;cursor:pointer;font-family:inherit;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center" onclick="Diary.toggleExercise(\'' + muscle + '\',\'' + ex.id + '\')">';
        html += '<div><div style="font-size:13px;font-weight:600;color:' + (selected ? 'var(--ac)' : '#ccc') + '">' + ex.name;
        if (f) html += '<span style="font-size:9px;color:var(--am);border:1px solid rgba(245,158,11,.25);border-radius:4px;padding:1px 5px;margin-left:6px">ДАВНО</span>';
        html += '</div><div style="font-size:10px;color:var(--sb);margin-top:2px">Прошлый: ' + p.w + 'кг×' + p.r + ' · ' + p.s + ' подх</div></div>';
        html += '<div style="width:22px;height:22px;border-radius:50%;border:1.5px solid ' + (selected ? 'var(--ac)' : '#333') + ';background:' + (selected ? 'var(--ac)' : 'transparent') + ';display:flex;align-items:center;justify-content:center;font-size:11px;color:' + (selected ? '#000' : '#333') + ';flex-shrink:0">' + (selected ? '✓' : '') + '</div>';
        html += '</button>';
      });
      html += '</div>';
    });

    if (total > 0) {
      html += '<button class="btn btn-accent btn-full" style="border-radius:14px;font-size:14px;margin-top:8px" onclick="Diary.buildWorkout()">▶ Начать — ' + total + ' упражнений</button>';
    }
    return html;
};

