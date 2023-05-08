const path = require('node:path');
const fs = require('fs');

const pathToSrcFolder = path.resolve(__dirname, 'styles');
const pathToProjectFolder = path.resolve(__dirname, 'project-dist');
const pathToBundleCss = path.resolve(pathToProjectFolder, 'bundle.css');
const streamWrite = fs.createWriteStream(pathToBundleCss,
  {
  encoding: 'utf8',
  flags: 'a',
  }
);

const fsPromises = fs.promises;

async function copyCss() {
  await fsPromises.readdir(pathToSrcFolder).then((files) => {
    files.forEach((file) => {
      const pathToFile = path.join(pathToSrcFolder, file);
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        const streamRead = fs.createReadStream(pathToFile, 'utf8');
        if (stats.isFile() && path.extname(file).slice(1) === 'css') {
          fs.truncate(pathToBundleCss, err => {
            if (err) throw err;
          });
          streamRead.on('data', (data) => {
            streamWrite.write(`${data}\n`);
          });
        }
      });
    })
  }).catch(() => {});
}

copyCss();
