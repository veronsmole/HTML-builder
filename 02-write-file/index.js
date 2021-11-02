const path = require('path');
const fs = require('fs');
const process = require('process');
process.stdout.write('Type your text:\n');
// exit
process.on('exit', () => {
  console.log('\nSee you!\n');
});
// handle ctrl+c
process.on('SIGINT', () => {
  process.exit();
});
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
process.stdin.on('data', function (chunk) {
  const input = chunk.toString().trim();
  if (input == 'exit') {
    process.exit();
  }
  output.write(chunk);
});
process.stdin.on('error', error => process.stdout.write('Error', error.message));