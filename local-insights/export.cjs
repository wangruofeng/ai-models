const fs = require('node:fs/promises');
const path = require('node:path');
const { getInsights } = require('./history.cjs');

getInsights().then(snapshot => fs.writeFile(
  path.join(__dirname, 'snapshot.json'), JSON.stringify(snapshot) + '\n'
)).catch(error => { console.error(error.message); process.exitCode = 1; });
