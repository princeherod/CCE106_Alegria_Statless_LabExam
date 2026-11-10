const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const WEB_DIR = path.join(__dirname, '..', 'build', 'web');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wasm': 'application/wasm',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(WEB_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const debugPort = 9224;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${debugPort}`,
    '--window-size=430,1200',
    `http://localhost:${PORT}`,
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

    // Wait for Flutter initialization
    await new Promise(r => setTimeout(r, 4000));

    // 1. Mobile viewport 390 x 844 (Top section)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Capturing oliva_output_1.png (390x844 Top View)...');
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'oliva_output_1.png'), Buffer.from(shot1.data, 'base64'));

    // 2. Scroll down on 390 x 844 to capture bottom section
    console.log('Scrolling to bottom...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 195,
      y: 400,
      deltaX: 0,
      deltaY: 900,
    });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Capturing oliva_output_2.png (390x844 Bottom View)...');
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'oliva_output_2.png'), Buffer.from(shot2.data, 'base64'));

    // 3. Complete full tall page view (similar to reference image 512x1024 / mobile long page)
    console.log('Capturing oliva_output_full.png (Full page view)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 1080,
      deviceScaleFactor: 2,
      mobile: true,
    });
    // Scroll back to top
    await send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 195,
      y: 400,
      deltaX: 0,
      deltaY: -3000,
    });
    await new Promise(r => setTimeout(r, 1200));

    const shotFull = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'oliva_output_full.png'), Buffer.from(shotFull.data, 'base64'));

    ws.close();
    console.log('All screenshots saved successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
