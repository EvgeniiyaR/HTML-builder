const path = require('node:path');
const fs = require('fs');

const pathToSrcFolder = path.resolve(__dirname, 'files');
const pathToCopyFolder = path.resolve(__dirname, 'files-copy');

const fsPromises = fs.promises;

async function copyDir() {
  await fsPromises.rm(pathToCopyFolder, {
    recursive: true,
  }).catch(() => {});

  await fsPromises.mkdir(pathToCopyFolder, {
    recursive: true,
  }).catch(() => {});

  await fsPromises.readdir(pathToSrcFolder).then((files) => {
    files.forEach((file) => {
      fs.copyFile(path.join(pathToSrcFolder, file), path.join(pathToCopyFolder, file), () => {});
    })
  }).catch(() => {});
}

copyDir();
