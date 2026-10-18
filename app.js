/* Model Catalog — 数据加载、筛选、渲染与多语言 */
(function () {
  'use strict';

  document.getElementById('footer-github').hidden = !(
    window.location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '[::1]'].indexOf(window.location.hostname) !== -1
  );

  var ORIGIN = 'https://pi.dev';
  var state = { query: '', provider: 'all', contextRanges: [], sota: 'all', openWeights: 'all', china: 'all' };
  var FILTER_CACHE_KEY = 'pi-model-filters';
  var FAVORITES_CACHE_KEY = 'pi-favorite-providers';
  var favoriteProviders = [];
  var data = null;
  var currency = 'USD';
  var priceSort = { key: null, direction: 'none' };
  var exchange = null;
  var exchangeLoading = false;
  var exchangeError = false;
  var exchangeCacheFailed = false;
  var EXCHANGE_CACHE_KEY = 'pi-usd-exchange-rates';
  var CURRENCY_SYMBOLS = { USD: '$', CNY: 'CN¥', HKD: 'HK$', EUR: '€', JPY: 'JP¥', KRW: '₩' };
  var RATE_CURRENCIES = ['CNY', 'HKD', 'EUR', 'JPY', 'KRW'];
  var EXCHANGE_TTL = 60 * 60 * 1000;

  /* ---------- 多语言 ---------- */

  var I18N = {
    'en': {
      title: 'Model Catalog · Pi',
      description: 'Catalog of AI models across providers: context window, input/output and cache pricing.',
      navHome: 'Pi model catalog',
      navAbout: 'About',
      footerBlog: 'Blog',
      footerSource: 'Data primarily sourced from',
      h1: 'Model Catalog',
      h2: 'All models',
      caption: 'All models',
      filterName: 'Filter by name',
      filterPlaceholder: 'Search model name, ID or provider…',
      filterProvider: 'Filter by provider',
      favoriteProvider: 'Favorite provider',
      unfavoriteProvider: 'Remove favorite',
      filterContext: 'Context size',
      contextAny: 'Any',
      filterSota: 'SOTA status',
      filterOpen: 'Open weights',
      filterChina: 'Chinese model',
      traitYes: 'Yes',
      traitNo: 'No',
      badgeOpen: 'Open',
      badgeChina: 'Chinese',
      openHelp: 'Includes released model weights with usage restrictions; check the original license.',
      chinaHelp: 'Based on the model developer, regardless of API hosting provider.',
      sotaAll: 'All',
      sotaYes: 'SOTA only',
      sotaNo: 'Unmarked',
      sotaHelp: 'Manually verified flagship models by capability; not a cross-vendor ranking. Unmarked models may be unverified.',
      sotaCategories: { general: 'General', reasoning: 'Reasoning', coding: 'Coding', image: 'Image' },
      sotaDetail: function (categories, date) { return 'Flagship: ' + categories + ' · Verified ' + date; },
      contextUnknown: 'Unknown',
      contextSelected: function (n) { return n + ' selected'; },
      allProviders: 'All providers',
      priceCurrency: 'Price currency',
      sortNext: { none: 'Sort low to high', ascending: 'Sort high to low', descending: 'Restore default order' },
      currencyUSD: 'USD — US dollar',
      currencyCNY: 'CNY — Chinese yuan',
      currencyHKD: 'HKD — Hong Kong dollar',
      currencyEUR: 'EUR — Euro',
      currencyJPY: 'JPY — Japanese yen',
      currencyKRW: 'KRW — South Korean won',
      refreshRate: 'Refresh rate',
      rateLoading: 'Fetching the latest exchange rate…',
      rateFailed: 'Exchange rate unavailable. Prices remain in USD. Please retry.',
      rateStale: 'Refresh failed; using the last saved rate.',
      rateCacheFailed: 'Local cache unavailable; rate is valid for this visit only.',
      rateInfo: function (rate, date, code) { return '1 USD ≈ ' + rate + ' ' + code + ' · Rate date: ' + date + ' · Updated daily · Prices per 1M tokens'; },
      reset: '[ Reset ]',
      imageText: 'Text',
      imageImage: 'Image',
      thModel: 'Model',
      thContext: 'Context',
      thInput: 'Input $/M',
      thOutput: 'Output $/M',
      thCacheRead: 'Cache read $/M',
      thCacheWrite: 'Cache write $/M',
      modelsCount: function (n) { return '(' + n + (n === 1 ? ' model)' : ' models)'); },
      modelCountSummary: function (shown, total) { return shown + ' / ' + total + ' models'; },
      empty: 'No models match the current filters.',
      loadError: 'Failed to load model data: ',
      themeLight: 'Switch to light theme',
      themeDark: 'Switch to dark theme',
      langTitle: 'Switch language',
      langLabel: '中文'
    },
    'zh-CN': {
      title: '模型目录 · Pi',
      description: '各大提供商的 AI 模型目录：上下文窗口、输入/输出与缓存价格。',
      navHome: 'Pi 模型目录',
      navAbout: '介绍',
      footerBlog: '博客',
      footerSource: '数据主要参考',
      h1: '模型目录',
      h2: '全部模型',
      caption: '全部模型',
      filterName: '按名称筛选',
      filterPlaceholder: '输入模型名称、ID 或提供商…',
      filterProvider: '按提供商筛选',
      favoriteProvider: '收藏厂商',
      unfavoriteProvider: '取消收藏',
      filterContext: '上下文大小',
      contextAny: '不限',
      filterSota: '是否是 SOTA',
      filterOpen: '是否开源',
      filterChina: '是否国产',
      traitYes: '是',
      traitNo: '否',
      badgeOpen: '开源',
      badgeChina: '国产',
      openHelp: '包含已开放权重但带使用限制的模型，使用时请查阅原始许可证。',
      chinaHelp: '按模型研发方判断，与 API 托管平台无关。',
      sotaAll: '不限',
      sotaYes: '仅 SOTA',
      sotaNo: '未标记',
      sotaHelp: '按主要能力人工核实的供应商旗舰，不代表跨厂商排名；未标记也可能是尚未核实。',
      sotaCategories: { general: '通用', reasoning: '推理', coding: '编程', image: '图像' },
      sotaDetail: function (categories, date) { return '旗舰能力：' + categories + ' · 核对日期：' + date; },
      contextUnknown: '未知',
      contextSelected: function (n) { return '已选 ' + n + ' 项'; },
      allProviders: '所有提供商',
      priceCurrency: '价格货币',
      sortNext: { none: '按价格从低到高排序', ascending: '按价格从高到低排序', descending: '恢复默认顺序' },
      currencyUSD: 'USD — 美元',
      currencyCNY: 'CNY — 人民币',
      currencyHKD: 'HKD — 港币',
      currencyEUR: 'EUR — 欧元',
      currencyJPY: 'JPY — 日元',
      currencyKRW: 'KRW — 韩元',
      refreshRate: '刷新汇率',
      rateLoading: '正在查询最新可用汇率…',
      rateFailed: '汇率查询失败，价格仍以美元显示，请重试。',
      rateStale: '刷新失败，正在使用上次缓存的汇率。',
      rateCacheFailed: '本地缓存不可用，汇率仅在本次访问中生效。',
      rateInfo: function (rate, date, code) { return '1 美元 ≈ ' + rate + ' ' + t('currency' + code).split(' — ')[1] + ' · 汇率日期：' + date + ' · 按日更新 · 价格单位：每百万 tokens'; },
      reset: '[ 重置 ]',
      imageText: '文本',
      imageImage: '图片',
      thModel: '模型',
      thContext: '上下文',
      thInput: '输入 $/M',
      thOutput: '输出 $/M',
      thCacheRead: '缓存读 $/M',
      thCacheWrite: '缓存写 $/M',
      modelsCount: function (n) { return '(' + n + ' 个模型)'; },
      modelCountSummary: function (shown, total) { return shown + ' / ' + total + ' 个模型'; },
      empty: '没有符合当前筛选条件的模型。',
      loadError: '加载模型数据失败：',
      themeLight: '切换为浅色主题',
      themeDark: '切换为深色主题',
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
    els.nameFilter.placeholder = t('filterPlaceholder');
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
    updateCurrencyUI();
    updateSortUI();
    updateContextSummary();
  }

  function setLang(next) {
    lang = next;
    try { localStorage.setItem('pi-lang', next); } catch (e) { /* ignore */ }
    applyI18n();
    if (data) {
      buildProviderSelect();
      render();
    }
  }

  function refreshToggleLabels() {
    var theme = document.documentElement.dataset.theme || 'auto';
    if (els.themeToggle) {
      var label = t(theme === 'dark' ? 'themeLight' : 'themeDark');
      els.themeToggle.setAttribute('aria-label', label);
      els.themeToggle.title = label;
    }
    if (els.langToggle) els.langToggle.textContent = t('langLabel');
  }

  var els = {
    tbody: document.getElementById('models-tbody'),
    count: document.getElementById('model-count'),
    nameFilter: document.getElementById('name-filter'),
    providerFilter: document.getElementById('provider-filter'),
    contextFilter: document.getElementById('context-filter'),
    sotaFilter: document.getElementById('sota-filter'),
    openWeightsFilter: document.getElementById('open-weights-filter'),
    chinaFilter: document.getElementById('china-filter'),
    reset: document.getElementById('reset-filters'),
    themeToggle: document.getElementById('theme-toggle'),
    langToggle: document.getElementById('lang-toggle'),
    currencySelect: document.getElementById('currency-select'),
    rateStatus: document.getElementById('exchange-status'),
    rateRefresh: document.getElementById('refresh-rate')
  };

  /* ---------- 工具 ---------- */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatContext(v) {
    if (typeof v !== 'number') return escapeHtml(v == null ? '—' : v);
    if (v >= 1000000) return Number((v / 1000000).toFixed(2)) + 'M';
    if (v >= 1000) return Number((v / 1000).toFixed(2)) + 'K';
    return String(v);
  }

  function formatPrice(v) {
    if (v == null) return '—';
    if (typeof v !== 'number') return escapeHtml(v);
    if (currency === 'USD' || !exchange) return '$' + v.toFixed(1);
    return CURRENCY_SYMBOLS[currency] + (v * exchange.rates[currency]).toFixed(1);
  }

  /* ---------- 汇率：美元原价保持不变，仅在展示时换算 ---------- */

  function validExchange(value) {
    return value && value.rates && RATE_CURRENCIES.every(function (code) {
      return Number.isFinite(value.rates[code]) && value.rates[code] > 0;
    }) &&
      /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
      Number.isFinite(value.fetchedAt) && value.fetchedAt > 0 && value.fetchedAt <= Date.now();
  }

  function updateCurrencyUI() {
    var converted = currency !== 'USD' && exchange;
    ['thInput', 'thOutput', 'thCacheRead', 'thCacheWrite'].forEach(function (key) {
      document.querySelector('[data-i18n="' + key + '"]').textContent =
        t(key).replace('$/M', converted ? CURRENCY_SYMBOLS[currency] + '/M' : '$/M');
    });
    els.rateRefresh.hidden = currency === 'USD';
    els.rateRefresh.disabled = exchangeLoading;
    var messages = [];
    if (currency !== 'USD') {
      if (exchange) messages.push(t('rateInfo')(exchange.rates[currency], exchange.date, currency));
      if (exchangeLoading) messages.push(t('rateLoading'));
      if (exchangeError) messages.push(t(exchange ? 'rateStale' : 'rateFailed'));
      if (exchange && exchangeCacheFailed) messages.push(t('rateCacheFailed'));
    }
    els.rateStatus.textContent = messages.join(' ');
    els.rateStatus.hidden = messages.length === 0;
  }

  async function loadExchange(force) {
    if (exchangeLoading) return;
    if (!exchange) {
      try {
        var saved = JSON.parse(localStorage.getItem(EXCHANGE_CACHE_KEY));
        if (validExchange(saved)) exchange = saved;
      } catch (err) { /* 缓存损坏或存储被禁用，继续查询 */ }
    }
    if (!force && exchange && Date.now() - exchange.fetchedAt < EXCHANGE_TTL) {
      updateCurrencyUI();
      if (data) render();
      return;
    }
    exchangeLoading = true;
    exchangeError = false;
    updateCurrencyUI();
    if (data) render();
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    try {
      var response = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=' + RATE_CURRENCIES.join(','), {
        signal: controller.signal, cache: 'no-store'
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var result = await response.json();
      var next = { rates: result.rates, date: result.date, fetchedAt: Date.now() };
      if (result.base !== 'USD' || result.amount !== 1 || !validExchange(next)) {
        throw new Error('Invalid exchange rate');
      }
      exchange = next;
      exchangeCacheFailed = false;
      try { localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify(exchange)); }
      catch (err) { exchangeCacheFailed = true; }
    } catch (err) {
      exchangeError = true;
    } finally {
      clearTimeout(timeout);
      exchangeLoading = false;
      updateCurrencyUI();
      if (data) render();
    }
  }

  function updateSortUI() {
    document.querySelectorAll('[data-sort]').forEach(function (button) {
      var direction = button.dataset.sort === priceSort.key ? priceSort.direction : 'none';
      button.closest('th').setAttribute('aria-sort', direction);
      button.querySelector('.sort-indicator').textContent =
        direction === 'ascending' ? '↑' : direction === 'descending' ? '↓' : '↕';
      button.title = t('sortNext')[direction];
    });
  }

  function comparePrices(a, b) {
    var left = a[priceSort.key];
    var right = b[priceSort.key];
    var leftValid = typeof left === 'number' && Number.isFinite(left);
    var rightValid = typeof right === 'number' && Number.isFinite(right);
    if (!leftValid || !rightValid) return Number(rightValid) - Number(leftValid);
    return (left - right) * (priceSort.direction === 'ascending' ? 1 : -1);
  }

  /* 平台标识与模型品牌分开匹配，避免将聚合平台当成模型研发方。 */
  var PROVIDER_BRANDS = {
    'amazon-bedrock': 'amazon-web-services', 'ant-ling': 'antgroup',
    anthropic: 'anthropic', azure: 'microsoft-azure', baseten: 'baseten', cerebras: 'cerebras',
    'cloudflare-ai-gateway': 'cloudflare', 'cloudflare-workers-ai': 'cloudflare',
    deepseek: 'deepseek', fireworks: 'fireworks', 'github-copilot': 'github-copilot',
    google: 'google', 'google-vertex': 'google', groq: 'groq', huggingface: 'huggingface',
    'kimi-coding': 'kimi', meta: 'meta', minimax: 'minimax', 'minimax-cn': 'minimax',
    mistral: 'mistral', moonshotai: 'moonshot', 'moonshotai-cn': 'moonshot', nvidia: 'nvidia',
    openai: 'openai', 'openai-codex': 'openai', opencode: 'opencode', 'opencode-go': 'opencode',
    openrouter: 'openrouter', 'qwen-token-plan': 'qwen', 'qwen-token-plan-cn': 'qwen',
    'qwen-token-plan-individual': 'qwen', radius: 'radius', together: 'together-ai',
    'vercel-ai-gateway': 'vercel', xai: 'xai', xiaomi: 'xiaomi',
    'xiaomi-token-plan-ams': 'xiaomi', 'xiaomi-token-plan-cn': 'xiaomi', 'xiaomi-token-plan-sgp': 'xiaomi',
    zai: 'zhipu', 'zai-coding-cn': 'zhipu'
  };
  var MODEL_BRANDS = [
    [/deepseek/i, 'deepseek'], [/claude/i, 'claude'], [/gemini/i, 'gemini'], [/gemma/i, 'gemma-google'],
    [/qwen|qwq|qvq/i, 'qwen'], [/glm|z-ai\//i, 'zhipu'], [/kimi|moonshot/i, 'kimi'],
    [/minimax/i, 'minimax'], [/mimo|xiaomi/i, 'xiaomi'], [/gpt|chatgpt|\bo[134](?:[- /]|$)/i, 'openai'],
    [/llama|muse[- ]|meta\//i, 'meta'], [/grok/i, 'xai'],
    [/mistral|mixtral|ministral|magistral|codestral|devstral|pixtral|voxtral/i, 'mistral'],
    [/nemotron|nvidia|cosmos/i, 'nvidia'], [/nova[- .]|amazon\//i, 'amazon-web-services'],
    [/bytedance|seed[- ]/i, 'bytedance'], [/hunyuan|tencent|\bhy[34]/i, 'tencent'],
    [/stepfun|step-[235]/i, 'stepfun'], [/longcat/i, 'longcat'], [/cohere|command[- ]/i, 'cohere'],
    [/ai21|jamba/i, 'ai21labs-jamba'], [/perplexity|sonar/i, 'perplexity'],
    [/inclusionai|\b(?:ling|ring)-/i, 'antgroup']
  ];

  function brandIcon(brand) {
    return '<img class="brand-icon" src="assets/brands/' + (brand || 'model') + '.svg" width="18" height="18" alt="" aria-hidden="true" loading="lazy" decoding="async">';
  }

  function modelBrand(model) {
    var name = model.id + ' ' + model.n;
    for (var i = 0; i < MODEL_BRANDS.length; i++) {
      if (MODEL_BRANDS[i][0].test(name)) return MODEL_BRANDS[i][1];
    }
    return null;
  }

  /* ---------- 渲染 ---------- */

  function updateContextSummary() {
    document.getElementById('context-summary').textContent = state.contextRanges.length ? t('contextSelected')(state.contextRanges.length) : t('contextAny');
  }

  function filteredModels() {
    var q = state.query.trim().toLowerCase();
    return data.models.filter(function (m) {
      if (state.provider !== 'all' && m.p !== state.provider) return false;
      if (['openWeights', 'china'].some(function (key) {
        var value = m.traits && m.traits[key];
        if (state[key] === 'all') return false;
        if (state[key] === 'unknown') return typeof value !== 'undefined' && value !== null;
        return value !== (state[key] === 'yes');
      })) return false;
      if (state.sota === 'yes' && !m.sota) return false;
      if (state.sota === 'no' && m.sota) return false;
      if (state.contextRanges.length && !state.contextRanges.some(function (range) {
        if (range === 'unknown') return typeof m.ctx !== 'number';
        var bounds = range.split(':').map(Number);
        return typeof m.ctx === 'number' && m.ctx >= bounds[0] && m.ctx < bounds[1];
      })) return false;
      if (!q) return true;
      return m.n.toLowerCase().indexOf(q) !== -1 ||
             m.id.toLowerCase().indexOf(q) !== -1 ||
             m.p.toLowerCase().indexOf(q) !== -1;
    });
  }

  function render() {
    updateProviderSummary();
    saveFilters();
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
      if (priceSort.direction !== 'none') items.sort(comparePrices);
      html += '<tr class="models-provider-row"><th scope="rowgroup" colspan="6">' +
        '<a class="models-provider-link" href="?provider=' + encodeURIComponent(provider) + '">' +
        '<code>' + escapeHtml(provider) + '</code>' + brandIcon(PROVIDER_BRANDS[provider]) + ' ' +
        '<span class="models-provider-count">' + t('modelsCount')(items.length) + '</span></a></th></tr>';
      for (var j = 0; j < items.length; j++) {
        var d = items[j];
        html += '<tr><th scope="row" class="models-model-col">' +
          '<a href="' + escapeHtml(d.source || (ORIGIN + '/models/' + encodeURIComponent(d.p) + '/' + encodeURIComponent(d.id))) + '">' + escapeHtml(d.n) + '</a>' + brandIcon(modelBrand(d)) +
          (d.sota ? ' <a class="sota-badge" href="' + escapeHtml(d.sota.source) + '" target="_blank" rel="noopener noreferrer" title="' + escapeHtml(t('sotaDetail')(d.sota.categories.map(function (key) { return t('sotaCategories')[key]; }).join(' / '), d.sota.verifiedAt)) + '">SOTA</a>' : '') +
          (d.traits && d.traits.openWeights === true ? ' <span class="trait-badge" title="' + escapeHtml(t('openHelp')) + '">' + t('badgeOpen') + '</span>' : '') +
          (d.traits && d.traits.china === true ? ' <span class="trait-badge" title="' + escapeHtml(t('chinaHelp')) + '">' + t('badgeChina') + '</span>' : '') +
          (d.description ? '<span class="model-info" tabindex="0" role="img" aria-label="' + escapeHtml(d.description) + '">ⓘ<span class="model-info-tooltip" aria-hidden="true">' + escapeHtml(d.description) + '</span></span>' : '') +
          '<code>' + escapeHtml(d.id) + '</code>' +
          '</th>' +
          '<td class="data-table-col-num">' + formatContext(d.ctx) + '</td>' +
          '<td class="data-table-col-num">' + (d.imagePricing ? t('imageText') + ' ' + formatPrice(d.in) + '<br>' + t('imageImage') + ' ' + formatPrice(d.imagePricing.input) : formatPrice(d.in)) + '</td>' +
          '<td class="data-table-col-num">' + (d.imagePricing ? t('imageImage') + ' ' : '') + formatPrice(d.out) + '</td>' +
          '<td class="data-table-col-num">' + (d.imagePricing ? t('imageText') + ' ' + formatPrice(d.cr) + '<br>' + t('imageImage') + ' ' + formatPrice(d.imagePricing.cachedInput) : formatPrice(d.cr)) + '</td>' +
          '<td class="data-table-col-num">' + formatPrice(d.cw) + '</td></tr>';
      }
    });

    if (!models.length) {
      html = '<tr><td colspan="6" class="table-empty">' + escapeHtml(t('empty')) + '</td></tr>';
    }

    els.tbody.innerHTML = html;
    els.count.textContent = t('modelCountSummary')(models.length, data.models.length);
  }

  /* ---------- 本地筛选记录 ---------- */

  function saveFilters() {
    try {
      var defaults = !state.query && state.provider === 'all' && !state.contextRanges.length &&
        state.sota === 'all' && state.openWeights === 'all' && state.china === 'all' &&
        currency === 'USD' && priceSort.direction === 'none';
      if (defaults) localStorage.removeItem(FILTER_CACHE_KEY);
      else localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify({ state: state, currency: currency, priceSort: priceSort }));
    } catch (err) { /* 本地存储不可用时仍可正常筛选 */ }
  }

  function restoreFilters() {
    try {
      var saved = JSON.parse(localStorage.getItem(FILTER_CACHE_KEY));
      if (!saved || !saved.state) return;
      var prior = saved.state;
      if (typeof prior.query === 'string') state.query = prior.query;
      if (prior.provider === 'all' || data.providers.some(function (provider) { return provider.name === prior.provider; })) state.provider = prior.provider;
      ['sota', 'openWeights', 'china'].forEach(function (key) {
        var select = els[key + 'Filter'];
        if (Array.from(select.options).some(function (option) { return option.value === prior[key]; })) state[key] = prior[key];
      });
      if (Array.isArray(prior.contextRanges)) {
        var ranges = Array.from(els.contextFilter.querySelectorAll('input'), function (input) { return input.value; });
        state.contextRanges = ranges.filter(function (range) { return prior.contextRanges.indexOf(range) !== -1; });
      }
      if (Object.prototype.hasOwnProperty.call(CURRENCY_SYMBOLS, saved.currency)) currency = saved.currency;
      var sort = saved.priceSort;
      if (sort && ['in', 'out', 'cr', 'cw'].indexOf(sort.key) !== -1 &&
          ['ascending', 'descending'].indexOf(sort.direction) !== -1) priceSort = { key: sort.key, direction: sort.direction };
    } catch (err) { /* 忽略损坏或不可用的本地记录 */ }
  }

  function updateFilterControls() {
    els.nameFilter.value = state.query;
    ['sota', 'openWeights', 'china'].forEach(function (key) { els[key + 'Filter'].value = state[key]; });
    updateProviderSummary();
    els.contextFilter.querySelectorAll('input').forEach(function (input) { input.checked = state.contextRanges.indexOf(input.value) !== -1; });
    els.currencySelect.value = currency;
    updateContextSummary();
    updateCurrencyUI();
    updateSortUI();
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
    document.querySelectorAll('[data-sort]').forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.dataset.sort;
        var current = priceSort.key === key ? priceSort.direction : 'none';
        var directions = ['none', 'ascending', 'descending'];
        priceSort = { key: key, direction: directions[(directions.indexOf(current) + 1) % 3] };
        updateSortUI();
        render();
      });
    });
    els.currencySelect.addEventListener('change', function () {
      currency = els.currencySelect.value;
      updateCurrencyUI();
      render();
      if (currency !== 'USD') loadExchange(false);
    });
    els.rateRefresh.addEventListener('click', function () { loadExchange(true); });

    els.nameFilter.addEventListener('input', function () {
      state.query = els.nameFilter.value;
      render();
    });

    els.providerFilter.addEventListener('click', function (event) {
      var button = event.target.closest('[data-favorite-provider]');
      if (!button) return;
      event.stopPropagation();
      var provider = button.dataset.favoriteProvider;
      var index = favoriteProviders.indexOf(provider);
      if (index === -1) favoriteProviders.push(provider);
      else favoriteProviders.splice(index, 1);
      try { localStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(favoriteProviders)); } catch (err) { /* ignore */ }
      buildProviderSelect();
      updateProviderSummary();
      Array.from(els.providerFilter.querySelectorAll('[data-favorite-provider]')).find(function (item) {
        return item.dataset.favoriteProvider === provider;
      }).focus();
    });

    els.providerFilter.addEventListener('change', function () {
      state.provider = els.providerFilter.querySelector('input:checked').value;
      els.providerFilter.open = false;
      els.providerFilter.querySelector('summary').focus();
      syncUrl();
      render();
    });

    els.reset.addEventListener('click', function () {
      state = { query: '', provider: 'all', contextRanges: [], sota: 'all', openWeights: 'all', china: 'all' };
      priceSort = { key: null, direction: 'none' };
      currency = 'USD';
      els.currencySelect.value = currency;
      updateCurrencyUI();
      updateSortUI();
      els.nameFilter.value = '';
      els.providerFilter.open = false;
      els.sotaFilter.value = 'all';
      els.openWeightsFilter.value = 'all';
      els.chinaFilter.value = 'all';
      els.contextFilter.querySelectorAll('input').forEach(function (input) { input.checked = false; });
      els.contextFilter.open = false;
      updateContextSummary();
      syncUrl();
      render();
      els.nameFilter.focus();
    });

    els.contextFilter.addEventListener('change', function () {
      state.contextRanges = Array.from(els.contextFilter.querySelectorAll('input:checked'), function (input) { return input.value; });
      updateContextSummary();
      render();
    });

    ['openWeights', 'china'].forEach(function (key) {
      els[key + 'Filter'].addEventListener('change', function () {
        state[key] = els[key + 'Filter'].value;
        render();
      });
    });

    els.sotaFilter.addEventListener('change', function () {
      state.sota = els.sotaFilter.value;
      render();
    });

    document.addEventListener('click', function (event) {
      if (!els.contextFilter.contains(event.target)) els.contextFilter.open = false;
      if (!els.providerFilter.contains(event.target)) els.providerFilter.open = false;
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && els.providerFilter.open) {
        els.providerFilter.open = false;
        els.providerFilter.querySelector('summary').focus();
      }
    });

    // 点击 provider 分组行链接 → 本地筛选
    els.tbody.addEventListener('click', function (e) {
      var link = e.target.closest('.models-provider-link');
      if (!link) return;
      e.preventDefault();
      var provider = new URL(link.href, window.location.href).searchParams.get('provider');
      state.provider = provider;
      syncUrl();
      render();
    });

    // 太阳／月亮图标在浅色与深色之间切换
    els.themeToggle.addEventListener('click', function () {
      var current = document.documentElement.dataset.theme || 'auto';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('pi-theme', next); } catch (err) { /* ignore */ }
      refreshToggleLabels();
    });

    // 语言切换：EN ↔ 简体中文
    els.langToggle.addEventListener('click', function () {
      setLang(lang === 'en' ? 'zh-CN' : 'en');
    });
  }

  function updateProviderSummary() {
    document.getElementById('provider-summary').innerHTML = state.provider === 'all' ? escapeHtml(t('allProviders')) :
      brandIcon(PROVIDER_BRANDS[state.provider]) + '<span>' + escapeHtml(state.provider) + '</span>';
    els.providerFilter.querySelectorAll('input').forEach(function (input) { input.checked = input.value === state.provider; });
  }

  function buildProviderSelect() {
    var options = '<label><input type="radio" name="provider" value="all" checked><span data-i18n="allProviders">' + escapeHtml(t('allProviders')) + '</span></label>';
    var providers = data.providers.slice().sort(function (a, b) {
      return Number(favoriteProviders.indexOf(b.name) !== -1) - Number(favoriteProviders.indexOf(a.name) !== -1);
    });
    providers.forEach(function (provider) {
      var favorite = favoriteProviders.indexOf(provider.name) !== -1;
      var favoriteLabel = t(favorite ? 'unfavoriteProvider' : 'favoriteProvider') + ' · ' + provider.name;
      options += '<div class="provider-option"><label title="' + escapeHtml(provider.name) + '"><input type="radio" name="provider" value="' + escapeHtml(provider.name) + '">' +
        brandIcon(PROVIDER_BRANDS[provider.name]) + '<span>' + escapeHtml(provider.name) + '</span></label>' +
        '<button class="provider-favorite" type="button" data-favorite-provider="' + escapeHtml(provider.name) + '" aria-pressed="' + favorite + '" aria-label="' + escapeHtml(favoriteLabel) + '" title="' + escapeHtml(favoriteLabel) + '">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9Z"/></svg></button></div>';
    });
    els.providerFilter.querySelector('.provider-options').innerHTML = options;
  }

  function restoreFavoriteProviders() {
    try {
      var saved = JSON.parse(localStorage.getItem(FAVORITES_CACHE_KEY));
      if (Array.isArray(saved)) favoriteProviders = data.providers.map(function (provider) { return provider.name; }).filter(function (name) { return saved.indexOf(name) !== -1; });
    } catch (err) { /* 忽略损坏或不可用的收藏记录 */ }
  }

  function readUrlState() {
    var provider = new URL(window.location.href).searchParams.get('provider');
    if (provider && data.providers.some(function (p) { return p.name === provider; })) {
      state.provider = provider;
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
      restoreFavoriteProviders();
      buildProviderSelect();
      restoreFilters();
      readUrlState();
      updateFilterControls();
      syncUrl();
      bindEvents();
      render();
      if (currency !== 'USD') loadExchange(false);
    })
    .catch(function (err) {
      els.tbody.innerHTML = '<tr><td colspan="6" class="table-empty">' +
        escapeHtml(t('loadError') + err.message) + '</td></tr>';
      els.count.textContent = '—';
    });
  applyI18n();
})();
