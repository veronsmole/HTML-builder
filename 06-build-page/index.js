const path = require('path');
const fs = require('fs');
const {stat} = require('fs');

function readFile(filename) {
  return new Promise((resolve) => {
    const stream = new fs.ReadStream(path.join(__dirname, filename), 'utf-8');
    stream.on('readable', function () {
      const data = stream.read();
      if (data !== null) {
        resolve(data.toString());
      }
    });
  });
}

function writeToFile(filename, src) {
  return new Promise((resolve) => {
    let writeableStream = fs.createWriteStream(path.join(__dirname, filename));
    writeableStream.write(src);
    writeableStream.close();
    resolve();
  });
}

function copyFile(dest, src) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, function (err) {
      if (err !== null) {
        reject(err);
      }
      resolve();
    });
  });
}

async function buildHtml() {
  let src = await readFile('template.html');

  const components = [
    {key: '{{articles}}', path: 'components/articles.html'},
    {key: '{{footer}}', path: 'components/footer.html'},
    {key: '{{header}}', path: 'components/header.html'}
  ];

  for (const tpl of components) {
    const content = await readFile(tpl.path);
    src = src.replace(tpl.key, content);
  }
  await writeToFile('project-dist/index.html', src);
}


async function cleanup(destDir) {
  return new Promise((resolve, reject) => {
    fs.rm(destDir, {recursive: true, force: true}, (err) => {
      if (err) {
        reject(err);
        return;
      }
      fs.mkdir(destDir,
        {recursive: true}, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
    });
  });

}

async function buildStyles() {
  let writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  fs.readdir(path.join(__dirname, 'styles'),
    {withFileTypes: true},
    (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          if (file.isFile() && path.extname(file.name) === '.css') {
            const stream = new fs.ReadStream(path.join(__dirname, 'styles', file.name));
            stream.on('data', function (chunk) {
              writeableStream.write(chunk.toString());
            });
          }
        });
      }
    });
}

async function copyAssets() {
  const destDir = path.join(__dirname, 'project-dist', 'assets');
  const sourceDir = path.join(__dirname, 'assets');

  await copyDir(destDir, sourceDir);
}

async function copyDir(destDir, sourceDir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(destDir,
      {recursive: true}, (err) => {
        if (err) {
          reject(err);
          return;
        }
        fs.readdir(sourceDir, (err, files) => {
          if (err) {
            reject(err);
            return;
          }
          files.forEach(file => {
            stat(path.join(sourceDir, file), async function (err, stat) {
              if (err !== null) {
                reject(err);
              }
              if (stat.isDirectory()) {
                await copyDir(path.join(destDir, file), path.join(sourceDir, file));
              } else {
                await copyFile(path.join(destDir, file), path.join(sourceDir, file));
              }
            });
          });
          resolve();
        });
      });
  });
}

async function build() {
  await cleanup(path.join(__dirname, 'project-dist'));
  await buildHtml();
  await buildStyles();
  await copyAssets();
}

build().then(() => {
  console.log('build successfully passed');
}).catch(e => {
  console.error(e);
  console.log('build failed');
});