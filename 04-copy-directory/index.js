const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'files-copy');
const sourceDir = path.join(__dirname, 'files');

fs.rmdir(destDir, {recursive: true}, (err) => {
  if (err) {
    return console.error(err);
  }
  fs.mkdir(destDir,
    {recursive: true}, (err) => {
      if (err) {
        return console.error(err);
      }
      fs.readdir(sourceDir, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
        files.forEach(file => {
          fs.copyFile(path.join(sourceDir, file), path.join(destDir, file), function (err) {
            if (err !== null) {
              console.error(err);
            }
          });
        });
      });
    });
});