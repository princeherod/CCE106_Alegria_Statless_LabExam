const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const debugPort = 9226;
const htmlPath = path.resolve(__dirname, 'console_output.html').replace(/\\/g, '/');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${debugPort}`,
  '--window-size=920,800',
  `file:///${htmlPath}`,
]);

const getWebSocketUrl = async () => {
  for (let i = 0; i < 30; i++) {
    try {
      const json = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${debugPort}/json`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      const page = json.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Failed to find Chrome debugging target');
};

(async () => {
  try {
    const wsUrl = await getWebSocketUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const send = (method, params = {}) => {
      const msgId = id++;
      return new Promise((resolve) => {
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise(r => ws.addEventListener('open', r));
    await new Promise(r => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'console_output.png'), Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(path.join(__dirname, '..', 'oliva_console_output.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved console_output.png and oliva_console_output.png successfully!');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
})();
