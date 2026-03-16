/**
 * ResumeForge — Automated Screenshot Capture
 * Captures all key views for the README showcase
 */
const puppeteer = require('puppeteer');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'docs', 'screenshots');
const BASE = 'http://localhost:3000';

const TEMPLATES = ['professional', 'modern', 'minimal', 'executive', 'creative', 'technical', 'elegant', 'bold'];

const TEMPLATE_COLORS = {
  professional: { primary: '#1e40af', secondary: '#1e293b', accent: '#3b82f6' },
  modern:       { primary: '#065f46', secondary: '#1e293b', accent: '#10b981' },
  minimal:      { primary: '#334155', secondary: '#0f172a', accent: '#64748b' },
  executive:    { primary: '#92400e', secondary: '#1e293b', accent: '#f59e0b' },
  creative:     { primary: '#5b21b6', secondary: '#1e293b', accent: '#8b5cf6' },
  technical:    { primary: '#115e59', secondary: '#1e293b', accent: '#14b8a6' },
  elegant:      { primary: '#991b1b', secondary: '#1e293b', accent: '#ef4444' },
  bold:         { primary: '#3730a3', secondary: '#1e293b', accent: '#6366f1' },
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function clickButton(page, text) {
  await page.evaluate((t) => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if ((b.textContent || '').includes(t)) { b.click(); return; }
    }
  }, text);
}

async function main() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // ─── 1. Landing Page ─────────────────────────────────
  console.log('📸 Capturing landing page hero...');
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2500);
  await page.screenshot({ path: path.join(OUT, '01-landing-hero.png') });

  console.log('📸 Capturing landing page features...');
  await page.evaluate(() => window.scrollBy(0, 850));
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT, '02-landing-features.png') });

  // ─── 2. Builder — load sample data ───────────────────
  console.log('📸 Loading builder with sample data...');
  await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle0', timeout: 60000 });
  await sleep(5000);

  // Click "Sample" button to load sample data via the store
  await clickButton(page, 'Sample');
  await sleep(3000);

  // Content editor tab
  console.log('📸 Capturing builder — content editor...');
  await page.screenshot({ path: path.join(OUT, '03-builder-content-editor.png') });

  // ─── 3. Design Panel ─────────────────────────────────
  console.log('📸 Capturing design panel...');
  await clickButton(page, 'Design');
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT, '04-builder-design-panel.png') });

  // ─── 4. ATS Score Panel ──────────────────────────────
  console.log('📸 Capturing ATS score panel...');
  await clickButton(page, 'ATS');
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT, '05-builder-ats-score.png') });

  // ─── 5. Dark Mode ────────────────────────────────────
  console.log('📸 Capturing dark mode...');
  // Find and click the dark mode toggle (moon icon button in header)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await clickButton(page, 'Content');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '06-builder-dark-mode.png') });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await sleep(500);

  // ─── 6. Template Showcase ────────────────────────────
  console.log('📸 Capturing all 8 templates...');
  for (const tmpl of TEMPLATES) {
    console.log(`   → ${tmpl}`);
    const c = TEMPLATE_COLORS[tmpl];
    // Use Zustand store actions to change template and colors
    await page.evaluate(({ template, primary, secondary, accent }) => {
      // Access Zustand store via the internal store
      const storeKey = 'resumeforge-storage';
      const stored = JSON.parse(localStorage.getItem(storeKey) || '{}');
      if (stored.state && stored.state.style) {
        stored.state.style.template = template;
        stored.state.style.primaryColor = primary;
        stored.state.style.secondaryColor = secondary;
        stored.state.style.accentColor = accent;
        localStorage.setItem(storeKey, JSON.stringify(stored));
      }
    }, { template: tmpl, ...c });

    // Reload to pick up localStorage changes
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(4000);
    await page.screenshot({ path: path.join(OUT, `template-${tmpl}.png`) });
  }

  // ─── 7. Export preview modal ─────────────────────────
  console.log('📸 Capturing export preview modal...');
  // Reset to professional
  await page.evaluate(() => {
    const storeKey = 'resumeforge-storage';
    const stored = JSON.parse(localStorage.getItem(storeKey) || '{}');
    if (stored.state && stored.state.style) {
      stored.state.style.template = 'professional';
      stored.state.style.primaryColor = '#1e40af';
      stored.state.style.secondaryColor = '#1e293b';
      stored.state.style.accentColor = '#3b82f6';
      localStorage.setItem(storeKey, JSON.stringify(stored));
    }
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(4000);

  await clickButton(page, 'Export');
  await sleep(800);
  await clickButton(page, 'Preview');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '07-export-preview.png') });
  await page.keyboard.press('Escape');
  await sleep(500);

  // ─── 8. Mobile landing ──────────────────────────────
  console.log('📸 Capturing mobile landing...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '08-mobile-landing.png') });

  await browser.close();
  console.log(`\n✅ All screenshots saved to: ${OUT}`);
}

main().catch((err) => {
  console.error('❌ Screenshot capture failed:', err);
  process.exit(1);
});
