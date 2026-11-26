(function () {
  'use strict';
  if (!window.insightsTestEnabled()) { location.replace('/'); return; }
  const $ = id => document.getElementById(id);
  let data, lang = 'zh-CN';
  try { if (localStorage.getItem('pi-lang') === 'en') lang = 'en'; } catch (_) {}
  const copy = {
    'zh-CN': { brand:'模型目录',profile:'当前目录构成',local:'测试模式',title:'数据洞察',intro:'目录收录变化与 SOTA 模型发布间隔。',loading:'正在读取目录快照…',models:'当前模型',providers:'供应商入口',samples:'历史观测日',last:'最新快照',growth:'目录数量趋势',from:'开始日期',to:'结束日期',reset:'全部',countNote:'供应商按 provider ID 统计，地区与套餐分别计数；模型按 (provider, id) 计数。曲线连接真实观测点，未记录日期不补零。',modelTrend:'模型数量',providerTrend:'供应商入口数量',rawData:'查看观测数据',date:'日期',snapshot:'快照',cadence:'SOTA 发版节奏',developer:'研发方',cadenceNote:'使用曾被标为 SOTA 的型号的发布日期，不是核对日期。同厂商各能力方向合并统计，同日发布合并一次，跨平台入口去重；月份或未知日期不参与天数计算。记录不完整，不代表厂商全部发版历史。',events:'有记录的发布',latestGap:'最近两次间隔',medianGap:'间隔中位数',releaseModels:'发布型号与依据',gap:'距上次发布',privacyNote:'统计来自目录历史快照。',reload:'重新读取历史',days:'天',insufficient:'暂无足够记录：至少需要两次有精确日期的发布，才能计算间隔。',noData:'所选范围内没有观测记录。',invalidRange:'开始日期不能晚于结束日期。',secondary:'次级来源',first:'首次记录',current:'当前工作区',error:'快照读取失败，请重试。',coverage:c=>`读取 ${c.commits} 个历史提交。历史旗舰入口中，${c.partialDate} 条只有月份、${c.missingDate} 条没有精确日期、${c.unknownDeveloper} 条研发方未确认，均不参与精确间隔计算。`,theme:'切换明暗主题',change:'区间变化'},
    en: {brand:'Model Catalog',profile:'Catalog composition',local:'Test mode',title:'Data insights',intro:'Catalog history and SOTA release intervals.',loading:'Loading catalog snapshots…',models:'Current models',providers:'Provider entries',samples:'Observation days',last:'Latest snapshot',growth:'Catalog trends',from:'From',to:'To',reset:'All',countNote:'Providers are counted by provider ID, including regional and plan variants. Models use unique (provider, id) pairs. Lines connect observed snapshots; missing dates are not filled with zero.',modelTrend:'Model count',providerTrend:'Provider entry count',rawData:'View observations',date:'Date',snapshot:'Snapshot',cadence:'SOTA release cadence',developer:'Developer',cadenceNote:'Release dates of models ever labeled SOTA, not verification dates. All capability tracks are combined. Same-day releases are one event per developer; platform duplicates are merged. Month-only or unknown dates are excluded from day calculations. This is not a complete release history.',events:'Recorded releases',latestGap:'Latest interval',medianGap:'Median interval',releaseModels:'Models and sources',gap:'Since previous release',privacyNote:'Statistics are based on catalog snapshots.',reload:'Read history again',days:'days',insufficient:'Not enough records: at least two releases with exact dates are needed to calculate an interval.',noData:'No observations within this range.',invalidRange:'The start date must not be later than the end date.',secondary:'Secondary source',first:'First recorded',current:'Working tree',error:'Unable to load the snapshot. Try again.',coverage:c=>`Read ${c.commits} historical commits. Historical flagship entries excluded from exact intervals: ${c.partialDate} month-only dates, ${c.missingDate} missing exact dates, ${c.unknownDeveloper} unconfirmed developers.`,theme:'Toggle theme',change:'Range change'}
  };
  const t = key => copy[lang][key];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => new Intl.NumberFormat(lang).format(value);
  const days = value => value === null ? '—' : `${number(value)} ${t('days')}`;
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = `${t('title')} · ${t('brand')}`;
    document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = t(el.dataset.copy); });
    $('insight-lang').textContent = lang === 'en' ? '中文' : 'EN';
    $('insight-lang').setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    $('insight-theme').setAttribute('aria-label', t('theme'));
    if (data) render();
  }
  function chart(rows, key, title) {
    if (!rows.length) return `<p class="insight-note">${esc(t('noData'))}</p>`;
    const w=520,h=250,left=52,right=18,top=32,bottom=40,plotW=w-left-right,plotH=h-top-bottom;
    const values=rows.map(r=>r[key]);
    const low=Math.min(...values),high=Math.max(...values),pad=Math.max(1,(high-low)*.18);
    const min=Math.max(0,Math.floor(low-pad)),max=Math.ceil(high+pad);
    const first=Date.parse(rows[0].date),last=Date.parse(rows.at(-1).date);
    const x = r => last===first ? left+plotW/2 : left+(Date.parse(r.date)-first)/(last-first)*plotW;
    const y = v => top+plotH-(v-min)/(max-min)*plotH;
    const points=rows.map(r=>`${x(r)},${y(r[key])}`).join(' ');
    let svg=`<svg viewBox="0 0 ${w} ${h}" role="group" aria-label="${esc(title)}"><title>${esc(title)}</title>`;
    for(let i=0;i<4;i++) {
      const v=Math.round(min+(max-min)*i/3),yy=y(v);
      svg+=`<line class="chart-grid" x1="${left}" x2="${w-right}" y1="${yy}" y2="${yy}"/><text class="chart-label" x="${left-10}" y="${yy+4}" text-anchor="end">${number(v)}</text>`;
    }
    svg+=`<polygon class="chart-area" points="${left},${top+plotH} ${points} ${x(rows.at(-1))},${top+plotH}"/><polyline class="chart-line" points="${points}"/>`;
    for(const r of rows) {
      const xx=x(r),yy=y(r[key]),bx=Math.min(w-163,Math.max(3,xx-76)),by=Math.max(2,yy-51);
      const label=`${r.date}: ${number(r[key])}`;
      svg+=`<g><circle class="chart-point" cx="${xx}" cy="${yy}" r="3"/><circle class="chart-hit" cx="${xx}" cy="${yy}" r="8" tabindex="0" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title></circle><g class="chart-tooltip"><rect x="${bx}" y="${by}" width="160" height="38" rx="4"/><text x="${bx+10}" y="${by+16}">${r.date}</text><text x="${bx+10}" y="${by+30}">${number(r[key])}</text></g></g>`;
    }
    svg+=`<text class="chart-label" x="${left}" y="${h-10}">${rows[0].date}</text>`;
    if(rows.length>1)svg+=`<text class="chart-label" x="${w-right}" y="${h-10}" text-anchor="end">${rows.at(-1).date}</text>`;
    return svg+'</svg>';
  }
  function renderGrowth() {
    if(!data)return;
    const from=$('date-from').value,to=$('date-to').value;
    const invalid=from&&to&&from>to;
    $('range-error').textContent=invalid?t('invalidRange'):'';
    const rows=invalid?[]:data.history.filter(r=>(!from||r.date>=from)&&(!to||r.date<=to));
    for(const [key,prefix,title] of [['models','model','modelTrend'],['providers','provider','providerTrend']]) {
      $(prefix+'-chart').innerHTML=chart(rows,key,t(title));
      const change=rows.length?rows.at(-1)[key]-rows[0][key]:null;
      $(prefix+'-change').textContent=change===null?'':`${t('change')} ${change>0?'+':''}${number(change)}`;
    }
    $('history-rows').innerHTML=rows.slice().reverse().map(r=>`<tr><td>${r.date}</td><td>${number(r.models)}</td><td>${number(r.providers)}</td><td>${esc(r.revision==='working-tree'?t('current'):r.revision)}</td></tr>`).join('');
  }
  function renderCadence() {
    const vendor=data.releases.find(v=>v.name===$('developer').value);
    if(!vendor) { $('release-rows').innerHTML='';$('cadence-empty').textContent=t('insufficient');return; }
    $('release-count').textContent=number(vendor.events.length);
    $('latest-gap').textContent=days(vendor.latestGap);
    $('median-gap').textContent=days(vendor.medianGap);
    $('cadence-empty').textContent=vendor.events.length<2?t('insufficient'):'';
    $('release-rows').innerHTML=vendor.events.slice().reverse().map(event=>`<tr><td>${event.date}</td><td>${event.releases.map(release=>{
      const source=/^https:\/\//.test(release.source)?release.source:null;
      const displayName=(release.names || [release.name]).reduce((a,b)=>a.length<=b.length?a:b);
      return `<div class="release-ref">${source?`<a href="${esc(source)}" target="_blank" rel="noopener noreferrer">${esc(displayName)}</a>`:esc(displayName)}${release.secondary?`<small>${esc(t('secondary'))}</small>`:''}<details><summary>${lang==='en'?'Model names and IDs':'型号名称与 ID'}</summary><ul>${release.names.map(name => '<li>' + esc(name) + '</li>').join('')}</ul><small>ID<br>${release.ids.map(esc).join('<br>')}</small></details></div>`;
    }).join('')}</td><td>${event.gapDays===null?esc(t('first')):esc(days(event.gapDays))}</td></tr>`).join('');
  }
  function renderCatalogProfile() {
    let section = $('catalog-profile');
    if (!section) {
      section = document.createElement('section');
      section.id = 'catalog-profile';
      section.className = 'insight-section';
      $('release-cadence').before(section);
    }
    const en = lang === 'en';
    const { total, largest, context: windows, weights: availability } = data.profile;
    const share = n => total ? new Intl.NumberFormat(lang, {
      style: 'percent', maximumFractionDigits: 1
    }).format(n / total) : '—';
    const context = [
      ['< 128k', windows.short], ['128k – < 1M', windows.medium],
      ['≥ 1M', windows.long], [en ? 'Unknown' : '未记录', windows.unknown]
    ];
    const weights = [
      [en ? 'Open weights' : '已公开权重', availability.open],
      [en ? 'Closed weights' : '未公开权重', availability.closed],
      [en ? 'Unconfirmed' : '待确认', availability.unknown]
    ];
    function table(title, rows) {
      return '<article><h3>' + title + '</h3><table><thead><tr><th>' +
        (en ? 'Group' : '分组') + '</th><th>' + (en ? 'Entries' : '入口数') +
        '</th><th>' + (en ? 'Share' : '占比') + '</th></tr></thead><tbody>' +
        rows.map(([label, count]) => '<tr><td class="share-label" style="--share:' + (total ? 100 * count / total : 0) + '%">' + esc(label) + '</td><td>' + number(count) +
          '</td><td>' + share(count) + '</td></tr>').join('') + '</tbody></table></article>';
    }
    const concentration = share(largest.reduce((sum, row) => sum + row[1], 0));
    section.innerHTML = '<h2>' + (en ? 'Catalog composition' : '当前目录构成') +
      '</h2><p class="insight-note">' + (en
        ? 'The five largest providers account for ' + concentration + ' of current catalog entries. All shares use provider–model pairs.'
        : '收录入口最多的五个供应商合计占 ' + concentration + '。以下占比均按当前目录中的供应商与模型 ID 组合计算。') +
      '</p><div class="profile-tables">' +
      table(en ? 'Largest providers' : '供应商收录前五', largest) +
      table(en ? 'Context window (tokens)' : '上下文窗口（tokens）', context) +
      table(en ? 'Weight availability' : '权重开放情况', weights) + '</div>';
  }
  function render() {
    const last=data.history.at(-1);
    $('stat-models').textContent=number(last.models);$('stat-providers').textContent=number(last.providers);
    $('stat-samples').textContent=number(data.history.length);$('stat-last').textContent=last.date;
    $('coverage-note').textContent=t('coverage')(data.coverage);
    renderGrowth();renderCadence();renderCatalogProfile();
  }
  const refreshNote = document.createElement('span');
  refreshNote.setAttribute('role', 'status');
  refreshNote.style.marginInlineStart = '12px';
  $('reload-insights').after(refreshNote);
  async function load() {
    const prior = data;
    if (prior) refreshNote.textContent = lang === 'en' ? 'Checking…' : '正在检查…';
    $('insight-status').hidden=Boolean(prior);$('insight-status').textContent=t('loading');$('reload-insights').disabled=true;
    try {
      const response = await fetch('local-insights/snapshot.json', {cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const next = await response.json();
      if (!next.history?.length) throw new Error('No snapshots');
      const from = $('date-from').value, to = $('date-to').value;
      data = next;
      for(const id of ['date-from','date-to']) {$(id).min=data.history[0].date;$(id).max=data.history.at(-1).date;}
      $('date-from').value = prior && from !== prior.history[0].date ? from : data.history[0].date;
      $('date-to').value = prior && to !== prior.history.at(-1).date ? to : data.history.at(-1).date;
      const previous=$('developer').value;
      $('developer').innerHTML=data.releases.map(v=>`<option value="${esc(v.name)}">${esc(v.name)} · ${v.events.length}</option>`).join('');
      if(data.releases.some(v=>v.name===previous))$('developer').value=previous;
      else if(data.releases.some(v=>v.name==='OpenAI'))$('developer').value='OpenAI';
      $('insight-content').hidden=false;$('insight-status').hidden=true;render();
      if (prior) {
        const unchanged = ['history', 'profile', 'releases', 'coverage'].every(key =>
          JSON.stringify(prior[key]) === JSON.stringify(next[key]));
        const time = new Date().toLocaleTimeString(lang);
        const result = unchanged ? (lang === 'en' ? 'No changes' : '数据无变化') :
          (lang === 'en' ? 'Data updated' : '数据已更新');
        refreshNote.textContent = time + ' · ' + result;
      }
    } catch(error) {
      if (prior) {
        data = prior;
        refreshNote.textContent = lang === 'en' ? 'Refresh failed. Try again.' : '刷新失败，请重试。';
        return;
      }
      $('insight-status').textContent=t('error');$('insight-content').hidden=true;
      const retry=document.createElement('button');retry.type='button';retry.textContent=t('reload');retry.addEventListener('click',load);$('insight-status').append(' ',retry);
    } finally {$('reload-insights').disabled=false;}
  }
  $('insight-lang').addEventListener('click',()=>{lang=lang==='en'?'zh-CN':'en';try{localStorage.setItem('pi-lang',lang)}catch(_){}applyLanguage()});
  $('insight-theme').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('pi-theme',theme)}catch(_){}});
  for(const id of ['date-from','date-to'])$(id).addEventListener('change',renderGrowth);
  $('range-reset').addEventListener('click',()=>{$('date-from').value=data.history[0].date;$('date-to').value=data.history.at(-1).date;renderGrowth()});
  $('developer').addEventListener('change',renderCadence);$('reload-insights').addEventListener('click',load);
  applyLanguage();load();
})();
