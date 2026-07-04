const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const filePath = path.join(__dirname, 'dist_test.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/dist_test.html' || req.url.startsWith('/?')) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('HTML 파일을 읽을 수 없습니다.');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/dist_test.html`);
});
