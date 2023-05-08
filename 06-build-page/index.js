const path = require('node:path');
const fs = require('fs');

const pathToStylesFolder = path.resolve(__dirname, 'styles');
const pathToProjecFolder = path.resolve(__dirname, 'project-dist');
const pathToStyleCss = path.resolve(pathToProjecFolder, 'style.css');

const pathToAssetsFolders = path.resolve(__dirname, 'assets');
const pathToCopyAssets = path.resolve(pathToProjecFolder, 'assets');

const pathToTemplates = path.resolve(__dirname, 'template.html');
const pathToComponents = path.resolve(__dirname, 'components');

const streamReadTemplate = fs.createReadStream(pathToTemplates, 'utf8');
const streamWriteStyle = fs.createWriteStream(pathToStyleCss,
  {
  encoding: 'utf8',
  flags: 'a',
  }
);

const pathToProjectIndexHtml= path.resolve(pathToProjecFolder, 'index.html');

const fsPromises = fs.promises;

async function createDir() {
  await fsPromises.mkdir(pathToProjecFolder, {
    recursive: true,
    flags: 'w',
  }).catch(() => {});
}

createDir();

async function copyDir() {

  await fsPromises.rm(pathToCopyAssets, {
    recursive: true,
  }).catch(() => {});

  await fsPromises.mkdir(pathToCopyAssets, {
    recursive: true,
    flags: 'w',
  }).catch(() => {});

  await fsPromises.readdir(pathToAssetsFolders).then((dirs) => {
    dirs.forEach((dir) => {
      const pathToCopyAssetsFolder = path.resolve(pathToCopyAssets, dir);
      fs.promises.mkdir(pathToCopyAssetsFolder, {
        recursive: true,
        flags: 'w',
      });
      const pathToAssetsFolder = path.resolve(pathToAssetsFolders, dir);
      fs.promises.readdir(pathToAssetsFolder).then((files) => {
        files.forEach((file) => {
          fs.copyFile(path.join(pathToAssetsFolder, file), path.join(pathToCopyAssetsFolder, file), () => {});
        })
      }).catch(() => {});
    })
  }).catch(() => {});
}

async function copyCss() {
  await fsPromises.readdir(pathToStylesFolder).then((files) => {
    files.forEach((file) => {
      const pathToFile = path.join(pathToStylesFolder, file);
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        const streamRead = fs.createReadStream(pathToFile, 'utf8');
        if (stats.isFile() && path.extname(file).slice(1) === 'css') {
          fs.truncate(pathToStyleCss, (err) => {
            if (err) throw err;
          });
          streamRead.on('data', (data) => {
            streamWriteStyle.write(`${data}\n`);
          });
        }
      });
    })
  }).catch(() => {});
}

async function createHtml() {
  await fsPromises.readdir(pathToComponents).then((files) => {
    streamReadTemplate.on('data', (data) => {
      let template = data.toString();
      files.forEach((file) => {
        const pathToComponentsFile = path.resolve(pathToComponents, file);
        fs.stat(pathToComponentsFile, (err, stats) => {
          if (err) throw err;
          const streamReadComponent = fs.createReadStream(pathToComponentsFile, 'utf8');
          if (stats.isFile() && path.extname(file).slice(1) === 'html') {
            const tag = `{{${path.basename(file).slice(0, (path.basename(file).indexOf(path.extname(file).slice(1)) - 1))}}}`;
            streamReadComponent.on('data', (dataComponent) => {
              template = template.replace(tag, `\n${dataComponent.toString()}\n`);
              fs.writeFile(path.join(pathToProjectIndexHtml), template, (error) => {
                if (error) throw error;
              });
            });
          }
        });
      });
    });
  }).catch(() => {});
}

copyDir();
copyCss();
createHtml();