import http from 'http';

http.createServer((_, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
}).listen(3002, () => console.log('User service running on :3002'));
