import fs from 'node:fs/promises';
const studies = [
 ['holiday','conversion-focussed-content-strategy-for-holiday-parks'],
 ['seating','share-of-voice-ai-overviews-for-seating-manufacturer'],
 ['pool','ai-overview-visibility-for-pool-rental'],
 ['product','product-page-optimisation-seo'],
 ['geo','llm-ai-visibility'],
 ['coffee','ecommerce-revenue-from-ai'],
];
await fs.mkdir('qa/source-pages',{recursive:true});
const manifest = {};
for (const [id,slug] of studies) {
 const url=`https://www.seoworks.co.uk/case-studies/${slug}/`;
 const r=await fetch(url); if(!r.ok) throw Error(`${r.status} ${url}`);
 const html=await r.text(); await fs.writeFile(`qa/source-pages/${id}.html`,html);
 const content=html.slice(0,html.indexOf('Go back'));
 const seen=new Set(); const images=[];
 for(const match of content.matchAll(/<img\b[^>]*>/gi)) {
  const tag=match[0];
  const src=(tag.match(/data-lazy-src="([^"]+)/)||tag.match(/\ssrc="([^"]+)/)||[])[1];
  if(!src || src.startsWith('data:') || src.includes('/themes/')) continue;
  const remote=new URL(src,url).href;
  if(seen.has(remote)) continue; seen.add(remote);
  const filename=new URL(remote).pathname.split('/').pop();
  const local=`src/assets/cases/originals/${id}/${filename}`;
  await fs.mkdir(`src/assets/cases/originals/${id}`,{recursive:true});
  const response=await fetch(remote); if(!response.ok) throw Error(`${response.status} ${remote}`);
  if(!response.headers.get('content-type')?.startsWith('image/')) throw Error(`Not an image: ${remote}`);
  const bytes=Buffer.from(await response.arrayBuffer()); await fs.writeFile(local,bytes);
  images.push({file:local,remote,alt:(tag.match(/alt="([^"]*)/)||[])[1]||'',bytes:bytes.length});
 }
 manifest[id]={source:url,hero:images[0],logo:images[1],gallery:images.slice(2)};
 console.log(id, images.map(i=>`${i.file} (${i.bytes} bytes)`).join('\n'));
}
await fs.writeFile('src/assets/cases/originals/sources.json',JSON.stringify(manifest,null,2));
const asset = i => `{ src: new URL('./${i.file.replace('src/','')}', import.meta.url).href, original: ${JSON.stringify(i.remote)}, alt: ${JSON.stringify(i.alt)} }`;
await fs.writeFile('src/case-image-assets.ts',`// Downloaded from each published study; provenance in assets/cases/originals/sources.json.\nexport const CASE_IMAGES = {\n${Object.entries(manifest).map(([id,v])=>`  ${id}: { hero: ${asset(v.hero)}, logo: ${asset(v.logo)}, gallery: [${v.gallery.map(asset).join(', ')}] },`).join('\n')}\n};\n`);
