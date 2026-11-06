import fs from 'node:fs';
const pages = await (await fetch('http://127.0.0.1:9255/json')).json();
const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let serial = 0; const pending = new Map(); const errors = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); });
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const run = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
await send('Runtime.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
await sleep(3500);
fs.mkdirSync('qa', { recursive: true });
const results = [];
for (const [width,height] of [[1440,1000],[390,844],[320,640]]) {
 await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 800 });
 await sleep(400);
 await run(`document.querySelector('#work').scrollIntoView()`);
 await sleep(250);
 for (let i=0;i<6;i++) {
  await run(`document.querySelectorAll('.work__slide')[${i}].click()`);
  await sleep(1100);
  await run(`document.querySelectorAll('.work__cta')[${i}].focus();document.querySelectorAll('.work__cta')[${i}].click()`);
  await sleep(400);
  const details = await run(`(async()=>{await Promise.all([...document.querySelectorAll('.cm img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));const s=document.querySelector('.cm__scroll');return {title:document.querySelector('#cm-title').getAttribute('aria-label'),images:[...document.querySelectorAll('.cm img')].every(i=>i.complete&&i.naturalWidth>0),overflow:s.scrollWidth>s.clientWidth+1,inert:document.querySelector('#root').inert,locked:document.documentElement.classList.contains('modal-open'),focused:document.activeElement.className,source:document.querySelector('.cm__source-link').href,metrics:document.querySelectorAll('.cm__result').length}})()`);
  if (i === 0) { const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`qa/case-hero-${width}.png`, Buffer.from(shot.data,'base64')); }
  await run(`{const s=document.querySelector('.cm__scroll');s.scrollTop+=document.querySelector('#cm-outcomes').getBoundingClientRect().top-s.getBoundingClientRect().top-110}`);
  await sleep(300);
  if (i === 1 || i === 5) { const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`qa/case-results-${width}-${i}.png`, Buffer.from(shot.data,'base64')); }
  await run(`[...document.querySelectorAll('.cm button,.cm a[href]')].find(e=>e.getClientRects().length).focus()`);
  await send('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9, modifiers:8 });
  const trapped = await run(`!!document.activeElement.closest('.cm')`);
  await send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27 });
  await sleep(250);
  const closed = await run(`!document.querySelector('.cm')&&!document.querySelector('#root').inert&&!document.documentElement.classList.contains('modal-open')&&document.activeElement.classList.contains('work__cta')`);
  results.push({width,index:i,...details,trapped,closed});
 }
}
// Exercise project navigation and the animated transition path.
await send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion',value:'no-preference' }] });
await send('Page.reload'); await sleep(5000);
await run(`document.querySelector('#work').scrollIntoView();document.querySelector('.work__cta').click()`); await sleep(1600);
await run(`document.querySelector('.cm__next').click()`); await sleep(800);
const navigation = await run(`document.querySelector('#cm-title').getAttribute('aria-label')==='A stronger seat in AI search.'&&document.querySelector('.cm__scroll').scrollTop===0`);
await run(`document.querySelector('.cm__close').click()`); await sleep(2200);
const animatedClose = await run(`!document.querySelector('.cm')`);
fs.writeFileSync('qa/case-studies.json', JSON.stringify({results,navigation,animatedClose,errors},null,2));
console.log(JSON.stringify({checks:results.length,failed:results.filter(r=>!r.images||r.overflow||!r.inert||!r.locked||!r.trapped||!r.closed),navigation,animatedClose,errors},null,2));
ws.close();
