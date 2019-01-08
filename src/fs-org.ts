import * as path from 'path';
import * as fs from 'fs';
import moment from 'moment';
import * as shell from 'shelljs';
const colors = require('colors');
import { resolve } from 'url';

const dir = path.join(__dirname, '../files/source');
const destDir = path.join(__dirname, '../files/dest');

let extensions = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'tiff', 'mp4'];

shell
  .find(dir)
  .filter(file => extensions.reduce((prev, next) => (prev = prev || file.toLowerCase().match(`\.${next}$`)), false))
  .map(file => {
    let res = fs.statSync(file);
    res['path'] = file;
    res['name'] = path.basename(file);
    return res;
  })
  .forEach(file => {
    console.log(colors.green('processing file: '), colors.yellow(file.path));

    if (!file.isDirectory()) {
      shell.mkdir('-p', path.join(destDir, moment(file.mtimeMs).format('YYYY-MM-DD')));

      let currentlocation = file.path;
      let newlocation = path.join(destDir, moment(file.mtimeMs).format('YYYY-MM-DD'), file.name);

      if (shell.test('-f', newlocation)) {
        console.log('Exists');
      } else {
        console.log(
          colors.green('moving: '),
          colors.yellow(currentlocation),
          colors.grey('==>'),
          colors.yellow(newlocation)
        );
        shell.mv(currentlocation, newlocation);
      }
    }
  });

// shell.ls('-l', dir).forEach(file => {
//   if (!file.isDirectory()) {
//     shell.mkdir('-p', path.join(dir, moment(file.birthtimeMs).format('YYYY-MM-DD')));

//     let currentlocation = path.join(dir, file.name);
//     let newlocation = path.join(dir, moment(file.birthtimeMs).format('YYYY-MM-DD'), file.name);

//     if (shell.test('-f', newlocation)) {
//       console.log('Exists');
//     } else {
//       console.log('moving to ', newlocation);
//       shell.mv(currentlocation, newlocation);
//     }
//   }
// });

// // console.log(dir);
// // readDir(dir).then(data => console.log(data));

// function readDir(dir) {
//   return new Promise((res, rej) => {
//     fs.readdir(dir, (err, files) => {
//       if (err) {
//         rej(err);
//       }
//       let fileList = [];
//       // TODO promise All or async
//       files.forEach(file => {
//         const filepath = path.join(dir, file);
//         fs.stat(filepath, (err, stat) => {
//           if (err) {
//             fileList = [...fileList, null];
//           }

//           fileList = [
//             ...fileList,
//             {
//               file,
//               filepath,
//               access: new Date(stat.atimeMs),
//               modified: new Date(stat.mtimeMs),
//               statusTime: new Date(stat.ctimeMs),
//               created: new Date(stat.birthtimeMs)
//             }
//           ];
//         });
//       });
//       res(fileList);
//     });
//   });
// }

// function dirExists(dirpath) {
//   return new Promise((res, rej) => {
//     fs.stat(dirpath, (err, stat) => {
//       if (err) {
//         res(false);
//       }
//       if (stat.isDirectory()) {
//         res(true);
//       } else {
//         rej('Is a file');
//       }
//     });
//   });
// }

// function createDir(dirpath) {
//   return new Promise((res, rej) => {
//     fs.mkdir(
//       dirpath,
//       {
//         recursive: true
//       },
//       err => {
//         if (err) rej(err);
//         res(true);
//       }
//     );
//   });
// }
