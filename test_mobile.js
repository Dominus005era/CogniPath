import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';

// Start server.ts on port 3006 using compiled server.cjs
console.log('Starting compiled server on port 3006...');
const serverProcess = spawn('node', ['dist/server.cjs'], {
  cwd: 'e:\\CogniPath',
  env: { ...process.env, PORT: '3006' }
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[Server]: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data}`);
});

// Wait for server to be ready
await new Promise(resolve => setTimeout(resolve, 5000));

try {
  console.log('Launching local Google Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: {
      width: 375,
      height: 812,
      isMobile: true,
      hasTouch: true
    }
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3006...');
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle2' });

  // 1. Take landing page screenshot
  console.log('Taking landing page screenshot...');
  await page.screenshot({ path: 'C:\\Users\\RAHUL\\.gemini\\antigravity\\brain\\98daa244-0855-4d9d-a793-e8332afabfad\\landing_mobile.png' });

  // 2. Click "Launch Platform"
  console.log('Clicking Launch Platform...');
  const buttons = await page.$$('button');
  let launchBtn = null;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Launch Platform')) {
      launchBtn = btn;
      break;
    }
  }
  if (launchBtn) {
    await launchBtn.click();
  } else {
    throw new Error('Launch Platform button not found');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Fill in the form
  console.log('Filling form inputs...');
  const inputs = await page.$$('input');
  if (inputs.length >= 2) {
    await inputs[0].type('Test User');
    await inputs[1].type('25');
  } else {
    throw new Error('Name/Age inputs not found');
  }

  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.type('Introduction to HTML5 coding basics');
  } else {
    throw new Error('Subject textarea not found');
  }

  // Click "Begin Cognitive Expedition"
  console.log('Starting expedition...');
  const submitButtons = await page.$$('button');
  let submitBtn = null;
  for (const btn of submitButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Begin Cognitive Expedition')) {
      submitBtn = btn;
      break;
    }
  }
  if (submitBtn) {
    await submitBtn.click();
  } else {
    throw new Error('Submit button not found');
  }

  // 4. Wait for roadmap to generate (give it 120 seconds for API retry)
  console.log('Waiting for roadmap generation (up to 120 seconds)...');
  await page.waitForSelector('#roadmap_view', { timeout: 120000 });
  console.log('Roadmap generated! Waiting 2 seconds for visual settle...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 5. Take roadmap page screenshot
  console.log('Taking roadmap screenshot...');
  await page.screenshot({ path: 'C:\\Users\\RAHUL\\.gemini\\antigravity\\brain\\98daa244-0855-4d9d-a793-e8332afabfad\\roadmap_mobile.png' });

  // 6. Navigate to Library to check delete button
  console.log('Clicking Go to Dashboard...');
  const backButtons = await page.$$('button');
  let backBtn = null;
  for (const btn of backButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Go to Dashboard')) {
      backBtn = btn;
      break;
    }
  }
  if (backBtn) {
    await backBtn.click();
  } else {
    throw new Error('Go to Dashboard button not found');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Open sidebar using hamburger button
  console.log('Opening sidebar...');
  const headerButtons = await page.$$('header button');
  let hamburgerBtn = null;
  for (const btn of headerButtons) {
    const titleAttr = await page.evaluate(el => el.getAttribute('title'), btn);
    if (titleAttr && titleAttr.includes('Open Navigation Menu')) {
      hamburgerBtn = btn;
      break;
    }
  }
  if (hamburgerBtn) {
    await hamburgerBtn.click();
  } else {
    throw new Error('Hamburger button not found');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Click 'My Library' navigation item in sidebar
  console.log('Clicking My Library...');
  const sidebarItems = await page.$$('aside div');
  let libraryLink = null;
  for (const item of sidebarItems) {
    const text = await page.evaluate(el => el.textContent, item);
    if (text && text.includes('My Library')) {
      libraryLink = item;
      break;
    }
  }
  if (libraryLink) {
    await libraryLink.click();
  } else {
    throw new Error('My Library sidebar link not found');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 7. Take Library screenshot
  console.log('Taking Library screenshot...');
  await page.screenshot({ path: 'C:\\Users\\RAHUL\\.gemini\\antigravity\\brain\\98daa244-0855-4d9d-a793-e8332afabfad\\library_mobile.png' });

  console.log('Automation successful! Screenshots saved.');
  await browser.close();

} catch (error) {
  console.error('Automation failed:', error);
} finally {
  console.log('Stopping dev server...');
  serverProcess.kill('SIGKILL');
}
