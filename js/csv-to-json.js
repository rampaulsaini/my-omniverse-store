// js/csv-to-json.js
// Usage: node csv-to-json.js input.csv output.json
const fs = require('fs');
const path = require('path');

const [,,inFile,outFile] = process.argv;
if(!inFile || !outFile){ console.log('Usage: node csv-to-json.js input.csv output.json'); process.exit(1); }

const csv = fs.readFileSync(inFile,'utf8').trim();
const lines = csv.split(/\r?\n/);
const headers = lines.shift().split(',').map(h=>h.trim());
const arr = lines.map(line => {
  const cols = line.split(',').map(c=>c.trim());
  const obj = {};
  headers.forEach((h,i)=> obj[h] = cols[i] || '');
  // convert numeric fields
  if(obj.price) obj.price = Number(obj.price);
  if(obj.previewSec) obj.previewSec = Number(obj.previewSec);
  return obj;
});
fs.writeFileSync(outFile, JSON.stringify(arr,null,2));
console.log('Written', outFile);
