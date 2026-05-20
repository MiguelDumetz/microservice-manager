import http from 'http';

http.createServer((_, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
}).listen(3001, () => console.log('Auth service running on :3001'));
