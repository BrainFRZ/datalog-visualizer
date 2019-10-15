const express = require('express');
const router = express.Router();
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');

router.post('/', (req, res, next) => {
  const dirPath = path.resolve('souffle/');
  const filePath = path.resolve('souffle/souffle.dl');
  fs.writeFile(filePath, req.body.code, (err) => {
    if (err) {
      console.log(`POST writeFile ${err.stack}`);
      throw err;
    }

    serveInterpreter(res, dirPath, filePath);
  });
});

router.get('/', (req, res, next) => {
  serveInterpreter(res);
});

const serveInterpreter = (res, dirPath, srcPath) => {
  exec(`souffle -D ${dirPath} ${srcPath}`, (err, stdout, stderr) => {
    fs.unlink(srcPath, (err) => {});
    const relations = {};
    const files = fs.readdirSync(dirPath);
    files
      .filter(fileName => {
        const length = fileName.length;
        const suffix = fileName.slice(fileName.lastIndexOf('.')+1, length);
        console.log(`${fileName} has suffix ${suffix}`);
        return (suffix === 'csv');
      })
      .forEach(fileName => {
        const name = fileName.slice(0, fileName.length - 4); // slice off .csv suffix
        const outPath = path.resolve('souffle/', fileName);
        relations[name] = parseFileTableSync(outPath);
        console.log(`Added ${relations[name]} to relations[${name}]`);
        fs.unlink(outPath, (err) => {});
      });
  
    return res.send(relations);
  });
}

const parseFileTableSync = fileName => {
  const data = fs.readFileSync(fileName, 'utf8');
  const table = [];
  console.log(data);
  const rows = data.split('\n');
  rows
    .filter(row => row.length != 0)
    .forEach(row => {
      table.push(row.split('\t'));
    })
  console.log(`Added ${JSON.stringify(table)} to table[${fileName}]`)
  return table;
}

module.exports = router;
