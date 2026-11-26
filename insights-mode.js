// The test UI is an opt-in preference for this origin.
window.insightsTestEnabled = function () {
  try { return localStorage.getItem('pi-insights-test') === '1'; }
  catch { return false; }
};
window.setInsightsTest = function (enabled) {
  if (enabled === true) localStorage.setItem('pi-insights-test', '1');
  else localStorage.removeItem('pi-insights-test');
  location.reload();
};
