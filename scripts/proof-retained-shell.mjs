import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import api from '../.work/api-prototype/dist/server/index.js';
const layoutProof = process.argv.includes('--layout');
assert.ok(!layoutProof || process.argv.includes('--ssr'), 'Documentation layout proof requires --ssr');
const candidate = path.resolve('.work/shell-prototype/dist/client'),
  original = path.resolve('../tanstack-rewrite-baseline/reference-production-build1/client');
const entry = fs.readdirSync(path.join(candidate, 'assets/js')).find(file => file.startsWith('index.'));
assert.ok(entry);
const {
  renderDocument,
  renderDocumentProjection
} = await import('../.work/render-document.mjs');
const article = await renderDocument(fs.readFileSync('sources/representative/tanstack--query--overview.md', 'utf8'), '/query/latest/docs/framework/react/overview', {}, layoutProof ? {
  feedbackWrapper: false
} : {});
const documentSources=[
 {name:'overview',source:'tanstack--query--overview.md',pathname:'/query/latest/docs/framework/react/overview',filePath:'docs/framework/react/overview.md'},
 {name:'comparison',source:'tanstack--query--comparison.md',pathname:'/query/latest/docs/framework/react/comparison',filePath:'docs/framework/react/comparison.md'},
 ...(layoutProof?[{name:'react-native',source:'query-react-native.md',pathname:'/query/latest/docs/framework/react/react-native',filePath:'docs/framework/react/react-native.md'},{name:'anthropic',source:'anthropic.md',pathname:'/ai/latest/docs/adapters/anthropic',filePath:'docs/adapters/anthropic.md'},{name:'agentic-cycle',source:'agentic-cycle.md',pathname:'/ai/latest/docs/chat/agentic-cycle',filePath:'docs/chat/agentic-cycle.md'}]:[])
];
const documentByPath=new Map(documentSources.map(record=>[record.pathname,record]));
const publicationRoot = path.resolve('.work/shell-publications');
for (const dir of ['.nift', 'content', 'templates', 'rendered', 'public']) fs.mkdirSync(path.join(publicationRoot, dir), {
  recursive: true
});
fs.writeFileSync(path.join(publicationRoot, '.nift/config.json'), JSON.stringify({
  config: {
    'content-dir': 'content/',
    'content-ext': '.html',
    'output-dir': 'public/',
    'output-ext': '.html',
    'default-template': 'templates/template.html',
    'build-threads': 1,
    'incremental-mode': 'modified',
    'minify-exts': []
  }
}));
fs.writeFileSync(path.join(publicationRoot, '.nift/tracked.json'), JSON.stringify({
  tracked: documentSources.map(record=>({name:record.name,title:record.name,template:'templates/template.html'}))
}));
fs.writeFileSync(path.join(publicationRoot, 'templates/template.html'), '@script { fn(rawHtml(path)) { f := file(path); f.open(); value := f.read_all(); f.close(); return value; } }@content');
for (const record of documentSources) {
 const html=await renderDocument(fs.readFileSync('sources/representative/'+record.source,'utf8'),record.pathname,{},layoutProof?{feedbackWrapper:false}:{});
 fs.writeFileSync(path.join(publicationRoot,'rendered',record.name+'.html'),html+`<p id="owner-marker">${record.name==='overview'?'@content $[nativePublishedLiteral]':'SECOND_NIFT_ARTICLE'}</p>`);
 fs.writeFileSync(path.join(publicationRoot,'content',record.name+'.html'),`@dep("rendered/${record.name}.html")$[rawHtml("rendered/${record.name}.html")]`);
}
const nift = path.resolve('../tanstack-rewrite-baseline/toolchain/nift-v4.10.0');
function compose() {
  const result = spawnSync(nift, ['build'], {
    cwd: publicationRoot,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
compose();
const publishedArticle = fs.readFileSync(path.join(publicationRoot, 'public/overview.html'), 'utf8');
const reference = fs.readFileSync('../tanstack-rewrite-baseline/reference-capture/' + encodeURIComponent('/query/latest/docs/framework/react/overview') + '-1440-dark.html', 'utf8');
const styles = [...reference.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map(match => match[0]).filter(tag => !tag.includes('https://'));
const inline = [...reference.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[0]);
const ssrProof = process.argv.includes('--ssr');
let requestData = {};
if (layoutProof) {
  const {
      parseSiteMarkdown
    } = await import('../.work/parser.mjs'),
    runtimeRequire = createRequire(path.resolve('package.json')),
    {
      parse
    } = runtimeRequire('yaml'),
    metadata = {};
  for (const record of documentSources) {
   const raw=fs.readFileSync('sources/representative/'+record.source,'utf8'),front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/),projection=await renderDocumentProjection(raw,record.pathname,{}, {feedbackWrapper:false});
   metadata[record.pathname]={...parse(front[1]),headings:projection.headings,filePath:record.filePath,pathname:record.pathname,controls:projection.controls};
  }
  requestData = {
    metadata,
    config: JSON.parse(fs.readFileSync('sources/representative/query-config.json', 'utf8')),
    configs:{ai:JSON.parse(fs.readFileSync('sources/representative/ai-config.json','utf8'))},
    partnerSeed: 'representative-layout-fixture-seed'
  };
}
let shellMarkup = '';
if (ssrProof) {
  const {
    renderShell
  } = await import('../.work/publication-ssr/index.mjs');
  shellMarkup = await renderShell('/query/latest/docs/framework/react/overview', publishedArticle, null, requestData);
  assert.ok(shellMarkup.includes('owner-marker'));
  assert.ok(shellMarkup.includes('Search'));
}
const pageHtmlFor = (markup, user, pageContext = requestData) => `<!doctype html><html class="dark"><head><meta charset="utf-8">${styles.join('')}${inline.join('')}<script type="application/json" id="shell-request-context">${JSON.stringify({
  user,
  ...pageContext
}).replaceAll('<', '\\u003c')}</script></head><body class="overflow-x-hidden"><template id="publication">${publishedArticle}</template><div id="shell"${ssrProof ? ' data-ssr="true"' : ''}>${markup}</div><script defer src="/assets/js/${entry}"></script></body></html>`;
const source = fs.readdirSync('.work/api-prototype/dist/server').filter(name => name.endsWith('.js')).map(name => fs.readFileSync('.work/api-prototype/dist/server/' + name, 'utf8')).join('\n'),
  ownedIds = new Set([...source.matchAll(/id: "([a-f0-9]+)",\s+name:/g)].map(match => match[1])),
  upstreamCalls = [];
const {
    AuthService
  } = await import('../.work/auth/auth.server.js'),
  {
    SessionService
  } = await import('../.work/session.mjs');
const sessionService = new SessionService('local-api-fixture-only-secret', true),
  fixtureUser = {
    id: 'fixture-user',
    email: 'fixture@example.invalid',
    name: 'Fixture',
    image: null,
    oauthImage: null,
    displayUsername: 'fixture',
    adsDisabled: false,
    interestedInHidingAds: false,
    lastUsedFramework: 'react',
    signupSources: [],
    sessionVersion: 2
  };
const sessionAuth = new AuthService(sessionService, {
  findById: async id => id === fixtureUser.id ? fixtureUser : null
}, {
  getEffectiveCapabilities: async () => ['builder']
}, async () => true);
let releaseBrowserEntry;
const browserEntryGate = new Promise(resolve => releaseBrowserEntry = resolve);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname.startsWith('/_serverFn/')) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks),
        owned = ownedIds.has(pathname.split('/').at(-1));
      const target = (owned ? 'http://localhost:4122' : 'http://localhost:4121') + req.url;
      const headers = new Headers(req.headers);
      headers.set('host', owned ? 'localhost:4122' : 'localhost:4121');
      if (!owned) {
        if (!(req.method === 'GET' && ['/_serverFn/b9ec6ebffe71881613f7d1e66d9126b4f7a9390f5be2d567f1ebaf09da5cfc18', ...(layoutProof ? ['/_serverFn/ea2393866980b46cb28107ff99af5a48134f5af1f38516e2f81d595cf3bf9eeb'] : [])].includes(pathname) || layoutProof && req.method === 'POST' && pathname === '/_serverFn/293006cecb96430e3d9ee8503b84e3f2e4e3b621a17f605748ed66a33b053ca8')) {
          res.writeHead(403);
          res.end('Unapproved service oracle call');
          return;
        }
        if (headers.get('origin') && headers.get('origin') !== 'http://localhost:4122') {
          res.writeHead(403);
          res.end('Foreign fixture origin rejected');
          return;
        }
        headers.set('origin', 'http://localhost:4121');
      }
      ;
      const request = new Request(target, {
        method: req.method,
        headers,
        ...(body.length ? {
          body
        } : {})
      });
      if (!owned) upstreamCalls.push({
        path: pathname,
        method: req.method,
        scope: 'Read-only controlled upstream service oracle for isolated UI proof; replacement pending'
      });
      const response = owned ? await api.fetch(request) : await fetch(request);
      const responseHeaders = new Headers(response.headers);
      responseHeaders.delete('content-encoding');
      responseHeaders.delete('content-length');
      res.writeHead(response.status, Object.fromEntries(responseHeaders));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (documentByPath.has(pathname) || pathname === '/') {
      const pageArticle=fs.readFileSync(path.join(publicationRoot,'public',(documentByPath.get(pathname)?.name??'overview')+'.html'),'utf8');
      res.setHeader('content-type', 'text/html');
      let markup = shellMarkup,
        user = null,
        pageContext = {
          ...requestData
        };
      if (layoutProof) {
        const {
          createPartnerPlacementSessionSeed
        } = await import('../.work/publication-ssr/index.mjs');
        pageContext.partnerSeed = req.headers['x-layout-proof-seed'] ?? createPartnerPlacementSessionSeed();
      }
      if (ssrProof) {
        const request = new Request('http://localhost:4122' + req.url, {
          headers: req.headers
        });
        user = await sessionAuth.getCurrentUser(request);
        const {
          renderShell
        } = await import('../.work/publication-ssr/index.mjs');
        markup = await renderShell(pathname, pageArticle, user, pageContext);
      }
      res.end(pageHtmlFor(markup, user, pageContext));
      return;
    }
    if (pathname.startsWith('/publication/')) {
      const record=documentByPath.get(pathname.slice('/publication'.length,-'.html'.length));
      const name=record?.name+'.html';
      if (!record) {
        res.writeHead(404);
        res.end('Not supplied by this bounded proof');
        return;
      }
      res.setHeader('content-type', 'text/html');
      res.end(fs.readFileSync(path.join(publicationRoot, 'public', name)));
      return;
    }
    if(pathname.startsWith('/_a/')){res.writeHead(204);res.end();return;}
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (ssrProof && pathname === '/assets/js/' + entry) await browserEntryGate;
    const file = [candidate, path.resolve('.work/publication-ssr'), original].map(root => path.resolve(root, '.' + pathname)).find(file => fs.existsSync(file) && fs.statSync(file).isFile());
    if (!file) {
      console.log('MISSING_LOCAL', req.method, pathname);
      res.writeHead(404);
      res.end();
      return;
    }
    res.setHeader('content-type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream');
    res.end(fs.readFileSync(file));
  } catch (error) {
    res.writeHead(500);
    res.end(error.message);
  }
});
await new Promise(resolve => server.listen(4122, '127.0.0.1', resolve));
const tools = process.env.TANSTACK_TOOLCHAIN,
  {
    chromium
  } = await import(path.join(tools, 'browser/node_modules/playwright/index.mjs')),
  browser = await chromium.launch({
    headless: true,
    executablePath: path.join(tools, 'chromium-1234/chrome-linux64/chrome')
  });
try {
  if (ssrProof) {
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: {
        width: 1440,
        height: 1000
      }
    });
    const staticPage = await noJs.newPage();
    await staticPage.goto('http://localhost:4122/query/latest/docs/framework/react/overview');
    await staticPage.locator('#owner-marker').waitFor();
    assert.equal(await staticPage.locator('[data-published-region]').count(), 1);
    await staticPage.getByRole('button', {
      name: /Search/i
    }).first().waitFor();
    await noJs.close();
  }
  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 1000
    },
    colorScheme: 'dark'
  });
  const searchFixtures = [];
  const installCopyEvents=[];
  await context.route('**/*', async route => {
    const request = route.request(),
      url = new URL(request.url());
    if(url.hostname==='tanstack.gateway.scarf.sh'&&url.pathname==='/site-events'){installCopyEvents.push(Object.fromEntries(url.searchParams));return route.fulfill({status:204,body:''});}
    if (url.origin === 'http://localhost:4122') return route.continue();
    if (/\.algolia(net\.com|\.net)$/.test(url.hostname) && url.pathname === '/1/indexes/*/queries' && request.method() === 'POST') {
      const input = request.postDataJSON(),
        key = createHash('sha256').update(JSON.stringify(input)).digest('hex'),
        dir = 'fixtures/algolia-search';
      fs.mkdirSync(dir, {
        recursive: true
      });
      const file = path.join(dir, key + '.json');
      let fixture;
      if (fs.existsSync(file)) fixture = JSON.parse(fs.readFileSync(file, 'utf8'));else {
        assert.equal(process.env.CAPTURE_PUBLIC_FIXTURES, '1', 'Uncaptured search fixture: ' + key);
        const response = await route.fetch();
        assert.equal(response.status(), 200, 'Public read-only search transport failed');
        fixture = {
          input,
          response: await response.json(),
          fetched_at: new Date().toISOString(),
          origin: url.origin,
          scope: 'Public read-only Algolia query snapshot; no writes or private key used'
        };
        fs.writeFileSync(file, JSON.stringify(fixture, null, 2) + '\n');
      }
      searchFixtures.push({
        key,
        fixture_sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex')
      });
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*'
        },
        body: JSON.stringify(fixture.response)
      });
    }
    if (request.method() === 'GET' && ['img.shields.io', 'badgen.net'].includes(url.hostname)) {
      const key = createHash('sha256').update(request.url()).digest('hex'),
        dir = 'fixtures/public-badges',
        file = path.join(dir, key + '.json');
      fs.mkdirSync(dir, {
        recursive: true
      });
      let fixture;
      if (fs.existsSync(file)) fixture = JSON.parse(fs.readFileSync(file, 'utf8'));else {
        assert.equal(process.env.CAPTURE_PUBLIC_FIXTURES, '1', 'Uncaptured badge fixture: ' + request.url());
        const response = await route.fetch();
        assert.equal(response.status(), 200);
        fixture = {
          url: request.url(),
          fetched_at: new Date().toISOString(),
          content_type: response.headers()['content-type'],
          body_base64: (await response.body()).toString('base64')
        };
        fs.writeFileSync(file, JSON.stringify(fixture, null, 2) + '\n');
      }
      return route.fulfill({
        status: 200,
        contentType: fixture.content_type,
        body: Buffer.from(fixture.body_base64, 'base64')
      });
    }
    if (layoutProof && request.method() === 'GET' && url.hostname === 'static.scarf.sh' && url.pathname === '/a.png') {
      return route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5nUAAAAASUVORK5CYII=', 'base64')
      });
    }
    throw Error('Uncaptured browser external request: ' + request.method() + ' ' + request.url());
  });
  await context.addInitScript(() => localStorage.setItem('theme', 'dark'));
  const page = await context.newPage(),
    errors = [],
    consoleErrors = [];
  page.on('response',response=>{if(response.status()>=400)console.log('FAILED_RESPONSE',response.status(),response.request().method(),response.url())});
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('pageerror', error.message);
  });
  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
      console.log('console error', message.text());
    }
  });
  await page.goto('http://localhost:4122/query/latest/docs/framework/react/overview', {
    waitUntil: ssrProof ? 'commit' : 'networkidle'
  });
  if (ssrProof) {
    await page.locator('#owner-marker').waitFor();
    await page.locator('#owner-marker').evaluate(element => {
      window.beforeHydrationOwner = element;
      element.textContent = 'HTML_ONLY_BEFORE_HYDRATION';
    });
    releaseBrowserEntry();
    await page.waitForLoadState('networkidle');
  }
  await page.waitForFunction(() => document.documentElement.dataset.shellProof === 'ready');
  await page.locator('#owner-marker').waitFor();
  assert.equal(await page.locator('#owner-marker').textContent(), ssrProof ? 'HTML_ONLY_BEFORE_HYDRATION' : '@content $[nativePublishedLiteral]');
  if (ssrProof) assert.equal(await page.locator('#owner-marker').evaluate(element => element === window.beforeHydrationOwner), true);
  await page.locator('#owner-marker').evaluate(element => {
    window.publishedOwner = element;
    element.textContent = 'PUBLISHED_OWNER_EDIT';
  });
  await page.screenshot({
    path: '../tanstack-rewrite-baseline/' + (layoutProof ? 'documentation-layout' : ssrProof ? 'retained-shell-ssr' : 'retained-shell') + '-initial.png',
    fullPage: true
  });
  const theme = page.getByRole('button', {
    name: /Theme:/i
  });
  await theme.click();
  await theme.click();
  await page.waitForFunction(() => !document.documentElement.classList.contains('dark'));
  assert.equal(await page.locator('#owner-marker').evaluate(element => element === window.publishedOwner && element.textContent === 'PUBLISHED_OWNER_EDIT'), true);
  if (layoutProof) {
    await page.getByRole('heading', {
      name: 'Overview',
      exact: true,
      level: 1
    }).waitFor();
    await page.getByRole('heading', {
      name: 'On this page',
      exact: true
    }).waitFor();
    assert.ok((await page.locator('a[href*="#motivation"]').count()) > 0);
  }
  const search = page.getByRole('button', {
    name: /Search/i
  }).first();
  await search.click();
  await page.locator('input[aria-label="Search TanStack"]').waitFor();
  await page.locator('input[aria-label="Search TanStack"]').fill('query client');
  await page.waitForResponse(response => response.url().includes('/1/indexes/*/queries') && response.status() === 200 && response.request().postDataJSON()?.requests?.some(request => request.query === 'query client'));
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'));
  assert.ok(searchFixtures.length > 0);
  await page.getByRole('option').filter({
    hasText: /QueryClient/i
  }).first().waitFor();
  await page.keyboard.press('Escape');
  await page.setViewportSize({
    width: 390,
    height: 844
  });
  if (layoutProof) {
    const docsMenu = page.getByRole('button', {
      name: 'Documentation menu',
      exact: true
    });
    await docsMenu.click();
    assert.equal(await docsMenu.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await docsMenu.getAttribute('aria-expanded'), null);
    assert.equal(await page.locator('#docs-mobile-menu-toggle').isChecked(), false);
  }
  const menu = page.getByRole('button', {
    name: /Open.*menu/i
  });
  await menu.click();
  assert.equal(await page.getByRole('button', {
    name: 'Close Menu'
  }).getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', {
    name: 'Open Menu'
  }).getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('#owner-marker').evaluate(element => element === window.publishedOwner && element.textContent === 'PUBLISHED_OWNER_EDIT'), true);
  await page.locator('[data-published-region]').evaluate(host => {
    const link = document.createElement('a');
    link.id = 'native-navigation';
    link.href = '/query/latest/docs/framework/react/comparison';
    link.textContent = 'Comparison navigation probe';
    host.appendChild(link);
  });
  await page.locator('#native-navigation').click();
  await page.waitForFunction(() => document.querySelector('#owner-marker')?.textContent === 'SECOND_NIFT_ARTICLE');
  assert.equal(new URL(page.url()).pathname, '/query/latest/docs/framework/react/comparison');
  assert.equal(await page.locator('table').count(), 1);
  await page.waitForLoadState('networkidle');
  fs.appendFileSync(path.join(publicationRoot, 'rendered/overview.html'), '<p id="fresh-publication">FRESH_NIFT_REPUBLICATION</p>');
  compose();
  await page.locator('[data-published-region]').evaluate(host => {
    const link = document.createElement('a');
    link.id = 'native-navigation';
    link.href = '/query/latest/docs/framework/react/overview';
    link.textContent = 'Overview navigation probe';
    host.appendChild(link);
  });
  await page.locator('#native-navigation').click();
  await page.locator('#fresh-publication').waitFor();
  await page.waitForLoadState('networkidle');
  assert.deepEqual(errors, []);
  assert.deepEqual(consoleErrors, []);
  if (ssrProof) {
    const token = await sessionService.signCookie({
        userId: fixtureUser.id,
        expiresAt: Date.now() + 60000,
        version: 2
      }),
      address = 'http://localhost:4122/query/latest/docs/framework/react/overview';
    const sessionHtml = await (await fetch(address, {
        headers: {
          cookie: 'session_token=' + token
        }
      })).text(),
      anonymousHtml = await (await fetch(address)).text();
    const bootstrap = html => JSON.parse(html.match(/<script type="application\/json" id="shell-request-context">([\s\S]*?)<\/script>/)[1]);
    assert.equal(bootstrap(sessionHtml).user.userId, fixtureUser.id);
    assert.equal(bootstrap(anonymousHtml).user, null);
    if (layoutProof) assert.notEqual(bootstrap(sessionHtml).partnerSeed, bootstrap(anonymousHtml).partnerSeed);
    assert.ok(!sessionHtml.includes('local-api-fixture-only-secret'));
    const signed = await browser.newContext({
      viewport: {
        width: 1440,
        height: 1000
      }
    });
    await signed.addCookies([{
      name: 'session_token',
      value: token,
      url: 'http://localhost:4122'
    }]);
    const signedPage = await signed.newPage(),
      signedErrors = [];
    signedPage.on('pageerror', error => signedErrors.push(error.message));
    signedPage.on('console', message => {
      if (message.type() === 'error') signedErrors.push(message.text());
    });
    await signedPage.goto(address, {
      waitUntil: 'networkidle'
    });
    await signedPage.waitForFunction(() => document.documentElement.dataset.shellProof === 'ready');
    await signedPage.waitForFunction(() => !document.querySelector('a[aria-label="Log In"]'));
    assert.ok((await signedPage.locator('#shell-request-context').textContent()).includes('fixture-user'));
    await signedPage.locator('[aria-haspopup="menu"]').filter({
      hasText: 'FI'
    }).click();
    await signedPage.getByRole('menuitem', {
      name: 'Account',
      exact: true
    }).waitFor();
    await signedPage.getByText('fixture@example.invalid', {
      exact: true
    }).waitFor();
    await signedPage.keyboard.press('Escape');
    assert.deepEqual(signedErrors, []);
    await signed.close();
  }
  let integratedArticleControls=false;
  if(layoutProof&&process.argv.includes('--interactions')){
   await context.grantPermissions(['clipboard-read','clipboard-write']);
   await page.setViewportSize({width:1440,height:1000});
   const navigate=async pathname=>{await page.locator('[data-published-region]').evaluate((host,path)=>{const link=document.createElement('a');link.id='native-next-document';link.href=path;link.textContent='Native document navigation';host.appendChild(link)},pathname);await page.locator('#native-next-document').click();await page.waitForURL('http://localhost:4122'+pathname);await page.waitForLoadState('networkidle');};
   await navigate('/ai/latest/docs/adapters/anthropic');
   const lists=page.locator('[data-published-region] [role=tablist]');assert.equal(await lists.count(),3);
   await lists.first().getByRole('tab').first().focus();await page.keyboard.press('End');
   for(let index=0;index<3;index++)assert.equal(await lists.nth(index).getByRole('tab').last().getAttribute('aria-selected'),'true');
   assert.equal(await page.evaluate(()=>localStorage.getItem('packageManager')),'bun');
   const copyButton=page.locator('[data-published-region] .codeblock button[aria-label="Copy code to clipboard"]:visible').first();
   const code=copyButton.locator('xpath=ancestor::div[contains(@class,"codeblock")]').locator('pre code');const copiedCode=await code.textContent();await copyButton.click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),copiedCode);await page.getByText('Copied code',{exact:true}).waitFor();assert.equal(await copyButton.textContent(),'Copied!');
   await page.waitForFunction(()=>document.querySelector('.package-manager-tabs [role=tabpanel][data-tab=bun] button').textContent!=='Copied!');
   assert.ok(installCopyEvents.some(event=>event.event==='install_command_copied'&&event.package_manager==='bun'&&event.framework==='react'&&event.packages==='@tanstack/ai-anthropic'));
   await code.evaluate(element=>{window.nativeEditedCode=element;element.textContent='HTML_ONLY_NATIVE_CODE @content $[literal]\n'});await copyButton.click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'HTML_ONLY_NATIVE_CODE @content $[literal]\n');assert.equal(await code.evaluate(element=>element===window.nativeEditedCode),true);
   await navigate('/ai/latest/docs/chat/agentic-cycle');await page.waitForFunction(()=>document.querySelectorAll('[data-island=mermaid] svg').length===2);await page.evaluate(()=>window.previousDiagramHost=document.querySelector('[data-island=mermaid]'));
   const previous=await page.locator('[data-island=mermaid]').first().innerHTML();await page.getByRole('button',{name:/Theme:/i}).click();await page.waitForFunction(previous=>document.querySelector('[data-island=mermaid] svg')&&document.querySelector('[data-island=mermaid]').innerHTML!==previous,previous);
   await navigate('/query/latest/docs/framework/react/overview');await page.locator('#fresh-publication').waitFor();assert.equal(await page.evaluate(()=>window.previousDiagramHost.isConnected),false);assert.equal(await page.evaluate(()=>window.previousDiagramHost.querySelectorAll('svg').length),0);assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);integratedArticleControls=true;
  }
  // Restore the intentional incremental-test fixture before comparing the unchanged upstream page.
  if(layoutProof&&process.argv.includes('--pixels')){
   fs.writeFileSync(path.join(publicationRoot,'rendered/overview.html'),article+'<p id="owner-marker">@content $[nativePublishedLiteral]</p>');compose();
  }
  let layoutPixelRows = [];
  if (layoutProof && process.argv.includes('--pixels')) {
    const {
      captureDocLayoutPixels
    } = await import('./proof-doc-layout-pixels.mjs');
    layoutPixelRows = await captureDocLayoutPixels(browser);
  }
  fs.writeFileSync(layoutProof ? 'evidence/r3/documentation-layout-proof.json' : ssrProof ? 'evidence/r3/retained-shell-ssr-proof.json' : 'evidence/r3/retained-shell-proof.json', JSON.stringify({
    scope: layoutProof ? 'Owned retained documentation layout controls and native Nift article ownership; strict layout pixels, full route/SEO/service parity pending' : ssrProof ? 'Owned retained Navbar/providers server-rendered and hydrated with native Nift article ownership; full layout/route/service parity remains pending' : 'Owned byte-preserved Navbar/providers in a CSR-only feasibility shell, owned publication boundary and local auth API; complete SSR/HTML/shell/route/search/service parity remains pending',
    ssr_article_and_navigation_available_without_javascript: ssrProof,
    documentation_title_toc_and_mobile_menu: layoutProof,
    matched_layout_pixel_capture_states: layoutPixelRows.length,
    analytics_pixel_transport: layoutProof ? 'Local transparent-pixel fixture; no external analytics event sent' : 'Not exercised',
    html_only_edit_and_node_identity_survive_hydration: ssrProof,
    publication_serializer_passes: ssrProof ? 2 : 0,
    request_local_router_and_query_client: ssrProof,
    fresh_signed_and_anonymous_request_contexts: ssrProof,
    signed_context_hydrates_without_errors: ssrProof,
    integrated_package_tabs_clipboard_toast_install_analytics_and_mermaid_navigation:integratedArticleControls,
    install_copy_analytics_transport:installCopyEvents.length?'Locally intercepted; no external events sent':'Not exercised',
    nift_composed_article_html: true,
    actual_router_navigation_uses_published_html: true,
    return_navigation_reads_fresh_publication: true,
    desktop_theme_toggle: true,
    search_open_escape: true,
    mobile_menu_open_escape: true,
    article_node_identity_and_native_edit_survive: true,
    read_only_algolia_search_fixtures: searchFixtures,
    upstream_service_oracle_calls: upstreamCalls,
    console_errors: consoleErrors,
    browser_page_errors: errors
  }, null, 2) + '\n');
  console.log('Retained Navbar theme/search/mobile controls preserve the published HTML owner');
} finally {
  for (const context of browser.contexts()) await context.unrouteAll({
    behavior: 'wait'
  });
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
