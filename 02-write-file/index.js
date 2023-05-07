const path = require('node:path');
const fs = require('fs');
const { stdin, stdout } = process;

const pathToFile = path.resolve(__dirname, 'text.txt');
const streamWrite = fs.createWriteStream(pathToFile,
  {
  encoding: 'utf8',
  flags: 'a',
  }
);

stdout.write('Добавьте текст в файл:\n');

process.on('exit', () => stdout.write('\nТекст добавлен.'));

stdin.on('data', (chunk) => {
  const data = chunk.toString().trim();
  data === 'exit' ? process.exit() : streamWrite.write(`${data}\n`);
});

process.on('SIGINT', () => process.exit());
