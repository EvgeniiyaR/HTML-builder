const path = require('node:path');
const fs = require('fs');

const pathToFile = path.resolve(__dirname, 'text.txt');
const stream = new fs.ReadStream(pathToFile, 'utf8');

stream.on('readable', () => {
  const data = stream.read();
  if (data != null) console.log(data.toString());
});

stream.on('error', (err) => {
  if (err.code == 'ENOENT') {
      console.log("Файл не найден");
  } else {
      console.error(err);
  }
});