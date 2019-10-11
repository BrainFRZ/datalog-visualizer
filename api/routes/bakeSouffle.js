const express = require('express');
const router = express.Router();
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');

router.post('/', (req, res, next) => {
  fs.writeFile('repl.dl', req.body.code, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Written code to repl file "${path.join(__dirname, 'repl.dl')}"`);
  });

  serveRepl(res);
});

router.get('/', (req, res, next) => {
  serveRepl(res);
});

const serveRepl = res => {
  let out = [];
  const proc = exec('souffle -D - repl.dl');
  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', data => {
    out.push(data);
  });
  proc.stdout.on('end', () => {
    const result = out.join();
    return res.end(result);
  });
}

module.exports = router;
