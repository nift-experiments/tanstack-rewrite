import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const require=createRequire(path.resolve('../tanstack/runtime/package.json'))
const {transformSync}=require('esbuild')
const feedbackCode=transformSync(fs.readFileSync('frontend/retained/src/utils/docFeedback.ts','utf8'),{loader:'ts',format:'esm'}).code.replace(/^import .*?;$/gm,'').replace(/export \{[\s\S]*?\};/g,'')
const inspectFeedback=new Function(feedbackCode+';return findReferenceableBlocks(document.querySelector(".styled-markdown-content > .relative")).map(element=>({selector:generateBlockSelector(element),text:element.textContent.trim()}))').toString()
const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5nUAAAAASUVORK5CYII=','base64')
export async function captureDocLayoutPixels(browser){
 const directory=path.resolve('../tanstack-rewrite-baseline/documentation-layout-pixels');fs.mkdirSync(directory,{recursive:true});const rows=[]
 const pathname='/query/latest/docs/framework/react/overview'
 for(const width of [1440,390])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});let seed;const errors=[]
  await context.addInitScript(theme=>{if(window.top===window)localStorage.setItem('theme',theme)},theme)
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url())
   if(url.origin==='http://localhost:4121'&&url.pathname===pathname&&request.resourceType()==='document'){
    const response=await route.fetch();assert.equal(response.status(),200);const html=await response.text();seed=html.match(/partnerPlacementSessionSeed:"([^"]+)"/)[1];fs.writeFileSync(path.join(directory,`${width}-${theme}-reference-raw.html`),html);return route.fulfill({response,body:html})
   }
   if(url.origin==='http://localhost:4122'&&url.pathname===pathname&&request.resourceType()==='document')return route.continue({headers:{...request.headers(),'x-layout-proof-seed':seed}})
   if(['http://localhost:4121','http://localhost:4122'].includes(url.origin)){
    if(url.pathname.startsWith('/_a/'))return route.fulfill({status:200,contentType:'text/javascript',body:''})
    return route.continue()
   }
   if(url.hostname==='static.scarf.sh'&&url.pathname==='/a.png')return route.fulfill({status:200,contentType:'image/png',body:pixel})
   if(url.hostname==='namethathost.com'&&url.pathname==='/tracker.js')return route.fulfill({status:200,contentType:'text/javascript',body:''})
   return route.fulfill({status:503,body:'External transport unavailable in this matched fallback-font proof'})
  })
  const reference=await context.newPage();reference.on('pageerror',error=>errors.push({owner:'reference',message:error.message}));await reference.goto('http://localhost:4121'+pathname,{waitUntil:'networkidle'});await reference.evaluate(()=>document.fonts.ready);assert.ok(seed)
  const candidate=await context.newPage();candidate.on('pageerror',error=>errors.push({owner:'candidate',message:error.message}));await candidate.goto('http://localhost:4122'+pathname,{waitUntil:'networkidle'});await candidate.waitForFunction(()=>document.documentElement.dataset.shellProof==='ready');await candidate.evaluate(()=>document.fonts.ready);await candidate.locator('#owner-marker').evaluate(element=>element.remove());assert.equal(JSON.parse(await candidate.locator('#shell-request-context').textContent()).partnerSeed,seed)
  await reference.screenshot({path:path.join(directory,`${width}-${theme}-reference.png`),fullPage:true,animations:'disabled'});await candidate.screenshot({path:path.join(directory,`${width}-${theme}-candidate.png`),fullPage:true,animations:'disabled'});fs.writeFileSync(path.join(directory,`${width}-${theme}-reference.html`),await reference.content());fs.writeFileSync(path.join(directory,`${width}-${theme}-candidate.html`),await candidate.content())
  const referenceBlocks=await reference.evaluate(code=>new Function('return ('+code+')()')(),inspectFeedback),candidateBlocks=await candidate.evaluate(code=>new Function('return ('+code+')()')(),inspectFeedback);assert.ok(referenceBlocks.length>0);assert.deepEqual(candidateBlocks,referenceBlocks,'Stored feedback selectors and block content must match upstream');
  const geometry=page=>page.locator('.styled-markdown-content').evaluate(element=>({rect:element.getBoundingClientRect().toJSON(),font:getComputedStyle(element).font,bodyHeight:document.body.scrollHeight,headings:[...document.querySelectorAll('h1,h2,h3')].map(node=>({text:node.textContent,rect:node.getBoundingClientRect().toJSON()}))}))
  rows.push({width,theme,placement_seed:seed,reference:await geometry(reference),candidate:await geometry(candidate),feedback_blocks_compared:referenceBlocks.length,feedback_selectors_exact:true,browser_page_errors:errors});assert.deepEqual(errors,[]);await context.unrouteAll({behavior:'wait'});await context.close()
 }
 fs.writeFileSync(path.join(directory,'receipts.json'),JSON.stringify({scope:'Full Query overview rendering in a matched placement-seed/fallback-font controlled environment; no frozen reference artifacts overwritten; pixel acceptance assessed separately',rows},null,2)+'\n');return rows
}
