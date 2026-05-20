import http from 'http';

http.createServer((_, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
}).listen(3003, () => console.log('Payment service running on :3003'));
