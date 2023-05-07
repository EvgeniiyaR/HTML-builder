const path = require('node:path');
const fs = require('fs');
const { stdin, stdout } = process;

const pathToFolder = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathToFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const pathToFile = path.join(pathToFolder, file);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        stdout.write(`${path.parse(file).name} - ${path.extname(file).slice(1)} - ${(stats.size / 1024).toFixed(3)}kb\n`);
      }
    })
  })
})