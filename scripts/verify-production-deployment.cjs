const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function verifyProduction() {
  console.log('🚀 Verifying Production Vercel Deployment...\n');
  const baseUrl = 'https://anuj-portfolio-beryl-rho.vercel.app';
  const routes = ['/', '/work', '/info', '/contact'];

  console.log('--- 1. Testing Core Routes ---');
  for (const route of routes) {
    const res = await fetchUrl(`${baseUrl}${route}`);
    console.log(`Route [${route}]: HTTP ${res.statusCode} (length: ${res.body.length})`);
    if (route === '/') {
      console.log('--- HOMEPAGE BODY PREVIEW ---');
      console.log(res.body.substring(0, 500));
    }
    if (res.statusCode !== 200) {
      throw new Error(`Route ${route} returned status ${res.statusCode}`);
    }
    if (!res.body.includes('<!doctype html>') && !res.body.includes('<!DOCTYPE html>')) {
      throw new Error(`Route ${route} did not return valid HTML`);
    }
  }
  console.log('✅ All 4 main routes (/ , /work , /info , /contact) return HTTP 200 OK.');

  console.log('\n--- 2. Checking Static Assets & Media ---');
  const mediaChecks = [
    '/media/info/anuj-portrait.png',
    '/media/videos/trident/trident-christmas-film.mp4',
    '/media/IMAGES/trident/trident-christmas-poster.png',
    '/media/IMAGES/shyamoli/whatsapp-image-2026-09-19-at-11-54-01-am-1.jpeg',
    '/media/IMAGES/standard electricals/20th sept copy.jpg'
  ];

  for (const mediaPath of mediaChecks) {
    const res = await fetchUrl(`${baseUrl}${mediaPath}`);
    console.log(`Asset [${mediaPath}]: HTTP ${res.statusCode} (content-length: ${res.headers['content-length']})`);
    if (res.statusCode !== 200) {
      console.warn(`⚠️ Warning: Media ${mediaPath} returned ${res.statusCode}`);
    }
  }

  console.log('\n--- 3. Verifying Latest Code on Production ---');
  // Fetch home HTML to locate script bundle
  const homeRes = await fetchUrl(baseUrl);
  const scriptMatch = homeRes.body.match(/src="(\/assets\/[^"]+\.js)"/);
  if (scriptMatch) {
    const scriptUrl = `${baseUrl}${scriptMatch[1]}`;
    console.log(`Checking live JS bundle: ${scriptUrl}`);
    const scriptRes = await fetchUrl(scriptUrl);
    console.log(`Bundle HTTP: ${scriptRes.statusCode} (length: ${scriptRes.body.length})`);
    
    const hasBehance = scriptRes.body.includes('anujkumar564');
    const hasLinkedIn = scriptRes.body.includes('anuj-335098281');
    const hasHeroSpacer = scriptRes.body.includes('hero-bottom-spacer');
    
    console.log(`- Latest Behance link present: ${hasBehance}`);
    console.log(`- Latest LinkedIn link present: ${hasLinkedIn}`);
    console.log(`- Latest mobile hero fix present: ${hasHeroSpacer}`);

    if (hasBehance && hasLinkedIn && hasHeroSpacer) {
      console.log('🎉 Production is running the LATEST build with all refinements!');
    } else {
      console.log('⏳ Vercel may still be building the latest push. Wait a moment.');
    }
  } else {
    console.log('Script tag not found in home HTML');
  }
}

verifyProduction().catch(err => {
  console.error('❌ Verification error:', err);
  process.exit(1);
});
