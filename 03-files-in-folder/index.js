const fs = require('fs');
const path = require('path');
const {stat} = require('fs');
fs.readdir(path.join(__dirname, 'secret-folder'),
  {withFileTypes: true},
  (err, files) => {
    console.log('\nCurrent directory files:');
    if (err) {
      //     console.log(err);
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          stat(path.join(__dirname, 'secret-folder', file.name), function (err, stat) {
            // console.log(err, stat);
            console.log(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name)} - ${stat.size/1000}kb`);
          });
        }
      }
      );
    }
  });
