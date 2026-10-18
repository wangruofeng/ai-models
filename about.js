(function () {
  'use strict';
  var lang = /^zh/i.test(navigator.language) ? 'zh-CN' : 'en';
  try { lang = localStorage.getItem('pi-lang') || lang; } catch (e) {}
  var view = 'price';
  var models = null;
  var samples = [ ['openai', 'gpt-6-astra', 'openai', 'OpenAI'], ['anthropic', 'claude-fable-5-1', 'claude', 'Anthropic'], ['google', 'gemini-4-argon', 'gemini', 'Google'], ['deepseek', 'deepseek-v4-pro', 'deepseek', 'DeepSeek'], ['moonshotai', 'kimi-k3', 'kimi', 'Moonshot AI'] ];
  var english = {
    skip: 'Skip to content', brand: 'Model Catalog', navPreview: 'Preview', navFeatures: 'Features', navFaq: 'FAQ',
    hero: 'Know the price. Find the right model.',
    detail: 'Context windows, token prices, flagship models and open weights. One catalog to find a model for your next writing session, coding task or experiment.',
    models: 'model entries', providers: 'provider endpoints', currencies: '6 pricing currencies', noSignup: 'No account needed',
    browse: 'Browse the catalog', explore: 'Take a look first', previewKicker: '00 · See it',
    previewTitle: 'Many models. A clearer comparison.', previewDescription: 'Bring the details together, filter what matters, then make your choice.',
    previewLive: 'Catalog data preview', sample: 'Selected models', priceTab: 'Pricing', contextTab: 'Context', model: 'Model', loading: 'Loading catalog…',
    previewNote: 'Standard USD pricing · Check provider terms', fullCatalog: 'Open the full catalog →', andMore: 'And more familiar models',
    featuresKicker: '01 · Make the choice easier', featuresTitle: 'Start with the task. Find the model.',
    f1Title: 'Room for longer tasks.', f1Text: 'Choose multiple, non-overlapping context ranges, from below 32K to 1M and beyond. Check how much fits before working with documents or code.',
    f2Title: 'One currency. Clearer costs.', f2Text: 'Switch between USD, CNY, HKD, EUR, JPY and KRW. Compare and sort input, output and cache prices. Conversion uses the latest available exchange rates, dated and cached locally.',
    f3Title: 'Flagships and open weights, side by side.', f3Text: 'Narrow the list with SOTA, open-weight and Chinese-model filters. Flagships are manually checked by capability. Unverified details stay unknown.',
    f4Title: 'Pick up where you left off.', f4Text: 'Favorite the providers you use and keep them at the top. Filters, currency and sorting are saved locally. Choose light or dark mode, in English or Chinese.',
    openTag: 'Open weights', chinaTag: 'Chinese', faqKicker: '02 · A few questions', faqTitle: 'Good to know before you start.',
    q1: 'Where does the model data come from?', a1: 'The catalog primarily references Pi, with selected official model details added. Entries represent models on individual providers. The same model can appear on multiple platforms, so the entry count is not a count of unique models.',
    q2: 'How should I read prices and exchange rates?', a2: 'Prices are generally per million tokens. Conversion uses the latest available exchange rates, not intraday quotes. Image models distinguish text and image tokens. Check the provider for actual billing and availability.',
    q3: 'What do SOTA and open-weight labels mean?', a3: 'SOTA identifies manually verified provider flagships by capability, rather than a cross-vendor ranking. The open label includes released weights with possible usage restrictions. Read the model license before use.',
    q4: 'Where are my filters and favorites saved?', a4: 'In local storage in this browser, with no account needed. Reset clears filters but keeps favorites. Clearing site data removes these records.',
    closing: 'Your next model starts here.', blog: 'Blog', source: 'Data primarily references'
  };
  var nodes = Array.from(document.querySelectorAll('[data-copy]'));
  nodes.forEach(function (node) { node.dataset.original = node.textContent; });
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function context(value) { return typeof value !== 'number' ? '—' : value >= 1000000 ? Number((value / 1000000).toFixed(2)) + 'M' : value >= 1000 ? Number((value / 1000).toFixed(2)) + 'K' : String(value); }
  function price(value) { return typeof value === 'number' ? '$' + value.toFixed(1) : esc(value == null ? '—' : value); }
  function renderPreview() {
    var en = lang === 'en';
    document.getElementById('preview-col-two').textContent = view === 'price' ? (en ? 'Input / 1M tokens' : '输入 / 1M tokens') : (en ? 'Context' : '上下文');
    document.getElementById('preview-col-three').textContent = view === 'price' ? (en ? 'Output / 1M tokens' : '输出 / 1M tokens') : (en ? 'Labels' : '标识');
    if (!models) return;
    document.getElementById('intro-preview').innerHTML = samples.map(function (sample) {
      var model = models.find(function (m) { return m.p === sample[0] && m.id === sample[1]; });
      if (!model) model = models.find(function (m) { return m.p === sample[0] && m.sota && m.sota.categories.indexOf('general') !== -1; });
      if (!model) return '';
      var labels = [];
      if (model.sota) labels.push('SOTA');
      if (model.traits && model.traits.openWeights) labels.push(en ? 'Open' : '开源');
      if (model.traits && model.traits.china) labels.push(en ? 'Chinese' : '国产');
      return '<tr><td><div class="preview-model"><img src="assets/brands/' + sample[2] + '.svg" width="25" height="25" alt=""><div>' + esc(model.n) + '<small>' + sample[3] + '</small></div></div></td><td>' + (view === 'price' ? price(model.in) : context(model.ctx)) + '</td><td>' + (view === 'price' ? price(model.out) : esc(labels.join(' · ') || '—')) + '</td></tr>';
    }).join('');
  }
  function applyLanguage() {
    var en = lang === 'en';
    document.documentElement.lang = en ? 'en' : 'zh-CN';
    document.title = en ? 'Model Catalog — Find your next AI model' : '模型目录 — 找到适合你的 AI 模型';
    document.querySelector('meta[name="description"]').content = en ? 'Compare AI model prices, context windows and flagship labels. Filter open-weight and Chinese models, with pricing in six currencies.' : '在一处查看 AI 模型的价格、上下文和旗舰标识，筛选开源与国产模型，以多种货币比较成本。';
    nodes.forEach(function (node) { node.textContent = en ? english[node.dataset.copy] : node.dataset.original; });
    document.getElementById('intro-lang').textContent = en ? '中文' : 'EN';
    document.getElementById('intro-theme').setAttribute('aria-label', en ? 'Toggle color theme' : '切换明暗主题');
    document.querySelector('nav').setAttribute('aria-label', en ? 'Main navigation' : '主导航');
    document.querySelector('.preview-tabs').setAttribute('aria-label', en ? 'Preview content' : '预览内容');
    renderPreview();
  }
  document.getElementById('intro-lang').addEventListener('click', function () {
    lang = lang === 'en' ? 'zh-CN' : 'en';
    try { localStorage.setItem('pi-lang', lang); } catch (e) {}
    applyLanguage();
  });
  document.getElementById('intro-theme').addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('pi-theme', next); } catch (e) {}
  });
  document.querySelectorAll('[data-view]').forEach(function (button) {
    button.addEventListener('click', function () {
      view = button.dataset.view;
      document.querySelectorAll('[data-view]').forEach(function (tab) { tab.setAttribute('aria-pressed', tab === button ? 'true' : 'false'); });
      renderPreview();
    });
  });
  document.querySelectorAll('.faq-section details').forEach(function (details) {
    var summary = details.querySelector('summary');
    var animation = null;
    var expanded = details.open;
    summary.addEventListener('click', function (event) {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      var startHeight = details.getBoundingClientRect().height;
      expanded = animation ? !expanded : !details.open;
      if (animation) animation.cancel();
      details.open = true;
      details.style.overflow = 'hidden';
      var style = getComputedStyle(details);
      var endHeight = expanded ? details.getBoundingClientRect().height :
        summary.getBoundingClientRect().height + parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      animation = details.animate([
        { height: startHeight + 'px' },
        { height: endHeight + 'px' }
      ], { duration: 240, easing: 'ease-in-out' });
      animation.onfinish = function () {
        details.open = expanded;
        details.style.overflow = '';
        animation = null;
      };
    });
  });
  applyLanguage();
  fetch('data.json').then(function (response) { if (!response.ok) throw Error('HTTP ' + response.status); return response.json(); }).then(function (data) {
    models = data.models;
    document.getElementById('intro-model-count').textContent = models.length.toLocaleString(lang);
    document.getElementById('intro-provider-count').textContent = data.providers.length;
    renderPreview();
  }).catch(function () {
    document.getElementById('intro-preview').innerHTML = '<tr><td colspan="3">' + (lang === 'en' ? 'Preview unavailable. Please open the full catalog.' : '预览暂时不可用，请打开完整目录。') + '</td></tr>';
  });
})();
