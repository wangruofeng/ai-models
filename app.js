/* Model Catalog — 数据加载、筛选、渲染与多语言 */
(function () {
  'use strict';

  var ORIGIN = 'https://pi.dev';
  var state = { query: '', provider: 'all' };
  var data = null;

  /* ---------- 多语言 ---------- */

  var I18N = {
    'en': {
      title: 'Model Catalog · Pi',
      description: 'Catalog of AI models across providers: context window, input/output and cache pricing.',
      navHome: 'Pi home',
      h1: 'Model Catalog',
      h2: 'All models',
      caption: 'All models',
      filterName: 'Filter by name',
      filterProvider: 'Filter by provider',
      allProviders: 'All providers',
      reset: '[ Reset ]',
      thModel: 'Model',
      thContext: 'Context',
      thInput: 'Input $/M',
      thOutput: 'Output $/M',
      thCacheRead: 'Cache read $/M',
      thCacheWrite: 'Cache write $/M',
      modelsCount: function (n) { return '(' + n + (n === 1 ? ' model)' : ' models)'); },
      empty: 'No models match the current filters.',
      loadError: 'Failed to load model data: ',
      themes: { auto: 'Auto', light: 'Light', dark: 'Dark' },
      themeTitle: 'Cycle theme',
      langTitle: 'Switch language',
      langLabel: '中文'
    },
    'zh-CN': {
      title: '模型目录 · Pi',
      description: '各大提供商的 AI 模型目录：上下文窗口、输入/输出与缓存价格。',
      navHome: 'Pi 首页',
      h1: '模型目录',
      h2: '全部模型',
      caption: '全部模型',
      filterName: '按名称筛选',
      filterProvider: '按提供商筛选',
      allProviders: '所有提供商',
      reset: '[ 重置 ]',
      thModel: '模型',
      thContext: '上下文',
      thInput: '输入 $/M',
      thOutput: '输出 $/M',
      thCacheRead: '缓存读 $/M',
      thCacheWrite: '缓存写 $/M',
      modelsCount: function (n) { return '(' + n + ' 个模型)'; },
      empty: '没有符合当前筛选条件的模型。',
      loadError: '加载模型数据失败：',
      themes: { auto: '自动', light: '浅色', dark: '深色' },
      themeTitle: '切换主题',
      langTitle: '切换语言',
      langLabel: 'EN'
    }
  };

  var LANGS = ['en', 'zh-CN'];

  function detectLang() {
    try {
      var saved = localStorage.getItem('pi-lang');
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    return /^zh\b|zh-/i.test(navigator.language || '') ? 'zh-CN' : 'en';
  }

  var lang = detectLang();

  function t(key) {
    var dict = I18N[lang];
    return dict[key] != null ? dict[key] : I18N['en'][key];
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = t('title');
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('description'));
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v != null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-title'));
      if (v != null) el.title = v;
    });
    // "All providers" 选项（其余 provider 名为专有名词，不翻译）
    var allOpt = els.providerFilter && els.providerFilter.querySelector('option[value="all"]');
    if (allOpt) allOpt.textContent = t('allProviders');
    refreshToggleLabels();
  }

  function setLang(next) {
    lang = next;
    try { localStorage.setItem('pi-lang', next); } catch (e) { /* ignore */ }
    applyI18n();
    if (data) render();
  }

  function refreshToggleLabels() {
    var theme = document.documentElement.dataset.theme || 'auto';
    if (els.themeToggle) {
      els.themeToggle.textContent = t('themes')[theme] || t('themes').auto;
    }
    if (els.langToggle) els.langToggle.textContent = t('langLabel');
  }

  var els = {
    tbody: document.getElementById('models-tbody'),
    count: document.getElementById('model-count'),
    nameFilter: document.getElementById('name-filter'),
    providerFilter: document.getElementById('provider-filter'),
    reset: document.getElementById('reset-filters'),
    themeToggle: document.getElementById('theme-toggle'),
    langToggle: document.getElementById('lang-toggle')
  };

  /* ---------- 工具 ---------- */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatContext(v) {
    return typeof v === 'number' ? v.toLocaleString('en-US') : escapeHtml(v == null ? '' : v);
  }

  function formatPrice(v) {
    if (v == null) return '';
    return typeof v === 'number' ? '$' + v : escapeHtml(v);
  }

  /* ---------- 渲染 ---------- */

  function filteredModels() {
    var q = state.query.trim().toLowerCase();
    return data.models.filter(function (m) {
      if (state.provider !== 'all' && m.p !== state.provider) return false;
      if (!q) return true;
      return m.n.toLowerCase().indexOf(q) !== -1 ||
             m.id.toLowerCase().indexOf(q) !== -1 ||
             m.p.toLowerCase().indexOf(q) !== -1;
    });
  }

  function render() {
    var models = filteredModels();

    // 按 provider 顺序分组（保持原站顺序）
    var groups = new Map();
    for (var i = 0; i < models.length; i++) {
      var m = models[i];
      if (!groups.has(m.p)) groups.set(m.p, []);
      groups.get(m.p).push(m);
    }

    var html = '';
    groups.forEach(function (items, provider) {
      html += '<tr class="models-provider-row"><th scope="rowgroup" colspan="6">' +
        '<a class="models-provider-link" href="?provider=' + encodeURIComponent(provider) + '">' +
        '<code>' + escapeHtml(provider) + '</code> ' +
        '<span class="models-provider-count">' + t('modelsCount')(items.length) + '</span></a></th></tr>';
      for (var j = 0; j < items.length; j++) {
        var d = items[j];
        html += '<tr><th scope="row" class="models-model-col">' +
          '<a href="' + ORIGIN + '/models/' + encodeURIComponent(d.p) + '/' + encodeURIComponent(d.id) + '">' + escapeHtml(d.n) + '</a>' +
          '<code>' + escapeHtml(d.id) + '</code></th>' +
          '<td class="data-table-col-num">' + formatContext(d.ctx) + '</td>' +
          '<td class="data-table-col-num">' + formatPrice(d.in) + '</td>' +
          '<td class="data-table-col-num">' + formatPrice(d.out) + '</td>' +
          '<td class="data-table-col-num">' + formatPrice(d.cr) + '</td>' +
          '<td class="data-table-col-num">' + formatPrice(d.cw) + '</td></tr>';
      }
    });

    if (!models.length) {
      html = '<tr><td colspan="6" class="table-empty">' + escapeHtml(t('empty')) + '</td></tr>';
    }

    els.tbody.innerHTML = html;
    els.count.textContent = models.length + ' / ' + data.models.length;
  }

  /* ---------- URL 状态（?provider=…，与原站一致） ---------- */

  function syncUrl() {
    var url = new URL(window.location.href);
    if (state.provider === 'all') {
      url.searchParams.delete('provider');
    } else {
      url.searchParams.set('provider', state.provider);
    }
    window.history.replaceState(null, '', url);
  }

  /* ---------- 事件 ---------- */

  function bindEvents() {
    els.nameFilter.addEventListener('input', function () {
      state.query = els.nameFilter.value;
      render();
    });

    els.providerFilter.addEventListener('change', function () {
      state.provider = els.providerFilter.value;
      syncUrl();
      render();
    });

    els.reset.addEventListener('click', function () {
      state = { query: '', provider: 'all' };
      els.nameFilter.value = '';
      els.providerFilter.value = 'all';
      syncUrl();
      render();
      els.nameFilter.focus();
    });

    // 点击 provider 分组行链接 → 本地筛选
    els.tbody.addEventListener('click', function (e) {
      var link = e.target.closest('.models-provider-link');
      if (!link) return;
      e.preventDefault();
      var provider = new URL(link.href, window.location.href).searchParams.get('provider');
      state.provider = provider;
      els.providerFilter.value = provider;
      syncUrl();
      render();
    });

    // 主题切换：Auto → Light → Dark 循环
    var themes = ['auto', 'light', 'dark'];
    els.themeToggle.addEventListener('click', function () {
      var current = document.documentElement.dataset.theme || 'auto';
      var next = themes[(themes.indexOf(current) + 1) % themes.length];
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('pi-theme', next); } catch (err) { /* ignore */ }
      refreshToggleLabels();
    });

    // 语言切换：EN ↔ 简体中文
    els.langToggle.addEventListener('click', function () {
      setLang(lang === 'en' ? 'zh-CN' : 'en');
    });
  }

  function buildProviderSelect() {
    var opts = ['<option value="all">' + escapeHtml(t('allProviders')) + '</option>'];
    for (var i = 0; i < data.providers.length; i++) {
      var p = data.providers[i];
      opts.push('<option value="' + escapeHtml(p.name) + '">' + escapeHtml(p.name) + '</option>');
    }
    els.providerFilter.innerHTML = opts.join('');
  }

  function readUrlState() {
    var provider = new URL(window.location.href).searchParams.get('provider');
    if (provider && data.providers.some(function (p) { return p.name === provider; })) {
      state.provider = provider;
      els.providerFilter.value = provider;
    }
  }

  /* ---------- 启动 ---------- */

  fetch('data.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (json) {
      data = json;
      buildProviderSelect();
      readUrlState();
      bindEvents();
      render();
    })
    .catch(function (err) {
      els.tbody.innerHTML = '<tr><td colspan="6" class="table-empty">' +
        escapeHtml(t('loadError') + err.message) + '</td></tr>';
      els.count.textContent = '—';
    });
  applyI18n();
})();
