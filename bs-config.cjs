module.exports = {
  server: { baseDir: '.', middleware: [require('./local-insights/server.cjs').middleware] },
  files: ['*.html', '*.css', '*.js', 'data.json', 'provider-apis.json', 'icon.svg', 'assets/**/*', 'local-insights/*'],
  port: 3456,
  open: false,
  ui: false,
  notify: false,
  ghostMode: false,
};
