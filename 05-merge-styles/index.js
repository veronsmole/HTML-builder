const fs = require('fs');
const path = require('path');

fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'),  () => {
  let writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  fs.readdir(path.join(__dirname, 'styles'),
    {withFileTypes: true},
    (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          if (file.isFile() && path.extname(file.name) ==='.css') {
            const stream = new fs.ReadStream(path.join(__dirname, 'styles', file.name));
            stream.on('data', function (chunk) {
              writeableStream.write(chunk.toString());
            });
          }
        });
      }
    });
});
  
