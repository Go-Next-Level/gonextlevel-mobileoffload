const endpoint = process.argv[2] || 'http://127.0.0.1:9224';
const baseUrl = process.argv[3];

if (!baseUrl) {
  console.error('Usage: node scripts/check-responsive.mjs <cdp-endpoint> <base-url>');
  process.exit(2);
}

const targets = await fetch(`${endpoint}/json`).then((response) => response.json());
const target = targets.find((entry) => entry.type === 'page');

if (!target?.webSocketDebuggerUrl) {
  throw new Error(`No page target available at ${endpoint}`);
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let id = 0;
const pending = new Map();
const eventWaiters = new Map();

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  const listeners = eventWaiters.get(message.method) || [];
  eventWaiters.delete(message.method);
  listeners.forEach((resolve) => resolve(message.params));
});

function send(method, params = {}) {
  const requestId = ++id;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
}

function waitFor(method) {
  return new Promise((resolve) => {
    const listeners = eventWaiters.get(method) || [];
    listeners.push(resolve);
    eventWaiters.set(method, listeners);
  });
}

await send('Page.enable');
await send('Runtime.enable');

const widths = [375, 768, 1024, 1280, 1440];
const routes = ['/', '/carrier-offload/', '/carrier-offload-companies/', '/network-assessment/', '/privacy-policy/'];
const failures = [];

for (const width of widths) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: width <= 768 ? 900 : 1000,
    deviceScaleFactor: 1,
    mobile: width <= 768,
  });

  for (const route of routes) {
    const loaded = waitFor('Page.loadEventFired');
    await send('Page.navigate', { url: new URL(route, baseUrl).href });
    await loaded;
    await new Promise((resolve) => setTimeout(resolve, 250));

    const { result } = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.documentElement;
        const body = document.body;
        const viewport = window.innerWidth;
        const scrollWidth = Math.max(root.scrollWidth, body?.scrollWidth || 0);
        return {
          viewport,
          scrollWidth,
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() || null,
          menuVisible: getComputedStyle(document.querySelector('.menu-btn')).display !== 'none'
        };
      })()`,
      returnByValue: true,
    });

    const measurement = result.value;
    const passed = measurement.scrollWidth <= measurement.viewport + 1;
    console.log(`${passed ? 'PASS' : 'FAIL'} ${width}px ${route} viewport=${measurement.viewport} scrollWidth=${measurement.scrollWidth}`);
    if (!passed) failures.push({ width, route, ...measurement });
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  await send('Browser.close');
  socket.close();
  process.exit(1);
}

await send('Browser.close');
socket.close();
