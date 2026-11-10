const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const debugPort = 9227;
const htmlPath = path.resolve(__dirname, '..', 'documentation.html').replace(/\\/g, '/');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${debugPort}`,
  '--window-size=1200,900',
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
    await new Promise(r => setTimeout(r, 1500)); // allow images to render

    console.log('Printing to PDF...');
    const pdfData = await send('Page.printToPDF', {
      printBackground: true,
      paperWidth: 8.27, // A4 width inches
      paperHeight: 11.69, // A4 height inches
      marginTop: 0.4,
      marginBottom: 0.4,
      marginLeft: 0.4,
      marginRight: 0.4,
    });

    const pdfBuffer = Buffer.from(pdfData.data, 'base64');
    fs.writeFileSync(path.join(__dirname, '..', 'oliva_lab_exam_documentation.pdf'), pdfBuffer);
    fs.writeFileSync(path.join(__dirname, '..', 'stateless_lab_exam_documentation.pdf'), pdfBuffer);
    console.log('PDF documentation generated successfully! Bytes:', pdfBuffer.length);

    ws.close();
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
})();
