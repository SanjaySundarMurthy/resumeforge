/**
 * ResumeForge — Automated Screenshot Capture
 * Captures all key views for the README showcase
 */
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'docs', 'screenshots');
const BASE = 'http://localhost:3000';

const TEMPLATES = ['professional', 'modern', 'minimal', 'executive', 'creative', 'technical', 'elegant', 'bold'];

const SAMPLE_RESUME = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev',
    title: 'Senior Full-Stack Engineer',
  },
  summary: 'Results-driven Senior Full-Stack Engineer with 7+ years of experience building scalable web applications. Led engineering teams that delivered $2.4M in annual revenue through product innovations. Expert in React, Node.js, TypeScript, and cloud architectures with a proven track record of reducing system latency by 40% and improving deployment frequency by 3x.',
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Full-Stack Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      bullets: [
        'Architected and deployed a microservices platform serving 2M+ daily active users, reducing response times by 45%',
        'Led a cross-functional team of 8 engineers to deliver a real-time analytics dashboard, increasing user engagement by 32%',
        'Implemented CI/CD pipelines using GitHub Actions and Docker, reducing deployment time from 4 hours to 15 minutes',
        'Mentored 5 junior developers through code reviews and pair programming sessions, improving team velocity by 25%'
      ]
    },
    {
      id: '2',
      company: 'InnovateSoft',
      position: 'Full-Stack Developer',
      location: 'Austin, TX',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      bullets: [
        'Built a customer-facing SaaS platform from scratch using React and Node.js, acquiring 50K+ users in the first year',
        'Designed RESTful APIs handling 10K+ requests per second with 99.9% uptime SLA',
        'Reduced cloud infrastructure costs by 35% through optimization of AWS services and implementing auto-scaling',
        'Collaborated with product and design teams to ship 12 major features using agile methodologies'
      ]
    },
    {
      id: '3',
      company: 'DataVerse Solutions',
      position: 'Junior Developer',
      location: 'Remote',
      startDate: '2016-08',
      endDate: '2018-05',
      current: false,
      bullets: [
        'Developed responsive web applications using React and TypeScript serving 100K+ monthly visitors',
        'Integrated third-party APIs including Stripe, Twilio, and SendGrid, processing $500K in monthly transactions',
        'Wrote comprehensive unit and integration tests achieving 92% code coverage across 3 major projects'
      ]
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: "Bachelor of Science",
      field: 'Computer Science',
      startDate: '2012',
      endDate: '2016',
      gpa: '3.8',
      achievements: ['Dean\'s List — 6 semesters', 'ACM Programming Contest — Regional Finalist']
    }
  ],
  skills: [
    { id: '1', category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Redux'] },
    { id: '2', category: 'Backend', skills: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { id: '3', category: 'DevOps & Cloud', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'GitHub Actions'] },
    { id: '4', category: 'Tools & Methods', skills: ['Git', 'Agile/Scrum', 'Jira', 'Figma', 'REST APIs', 'GraphQL'] }
  ],
  projects: [
    {
      id: '1',
      name: 'CloudDeploy',
      description: 'Open-source deployment automation tool with 2.5K GitHub stars. Streamlines multi-cloud deployments with a single configuration file.',
      technologies: ['Go', 'Docker', 'AWS', 'GCP'],
      url: 'github.com/alexmorgan/clouddeploy',
      highlights: ['2,500+ GitHub stars', 'Used by 150+ teams worldwide']
    },
    {
      id: '2',
      name: 'AnalyticsPro',
      description: 'Real-time web analytics dashboard with privacy-first design. Self-hosted alternative to Google Analytics.',
      technologies: ['React', 'Node.js', 'ClickHouse', 'Redis'],
      url: 'analyticspro.dev',
      highlights: ['Processes 1M+ events/day', '50ms average query time']
    }
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect – Professional', issuer: 'Amazon Web Services', date: '2023-06', url: '' },
    { id: '2', name: 'Google Cloud Professional Developer', issuer: 'Google Cloud', date: '2022-11', url: '' }
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Intermediate' }
  ],
  awards: [],
  volunteering: [],
  publications: [],
  references: [],
  customSections: [],
};


async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Seed localStorage BEFORE navigating to the builder page */
async function seedStore(page, data, style) {
  // We set localStorage on the base domain first
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.evaluate(
    (d, s) => {
      const obj = {
        state: {
          currentId: '',
          data: d,
          style: s,
          jobDescription: { title: '', company: '', text: '' },
          versions: [],
          documents: [],
        },
        version: 0,
      };
      localStorage.setItem('resumeforge-storage', JSON.stringify(obj));
    },
    data,
    style
  );
}

const DEFAULT_STYLE = {
  template: 'professional',
  primaryColor: '#1e40af',
  secondaryColor: '#1e293b',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineHeight: 1.5,
  sectionSpacing: 16,
  showPhoto: false,
  showIcons: true,
  sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','awards','volunteering','publications','references'],
  hiddenSections: ['awards','volunteering','publications','references'],
  pageMargin: 40,
  pageMode: 'auto',
  marginTop: 48,
  marginBottom: 48,
  marginLeft: 56,
  marginRight: 56,
  paragraphSpacing: 4,
  showPageBreakIndicators: true,
  bulletStyle: 'disc',
  headerStyle: 'border-bottom',
  skillDisplayMode: 'pills',
  dateAlignment: 'right',
  nameSize: 'large',
  letterSpacing: 0,
  headerLetterSpacing: 1,
};

async function main() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // ─── 1. Landing Page ───
  console.log('📸 Capturing landing page...');
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);
  // Trigger scroll-reveal animations by scrolling briefly
  await page.evaluate(() => { window.scrollTo(0, 1); window.scrollTo(0, 0); });
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, '01-landing-hero.png'), fullPage: false });

  // Scroll to features
  await page.evaluate(() => window.scrollBy(0, 800));
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT, '02-landing-features.png'), fullPage: false });

  // ─── 2. Builder Page — seed data first, then navigate ───
  console.log('📸 Setting up builder with sample data...');
  await seedStore(page, SAMPLE_RESUME, DEFAULT_STYLE);
  await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle0', timeout: 60000 });
  await sleep(4000);

  // Content editor tab
  console.log('📸 Capturing builder — content editor...');
  await page.screenshot({ path: path.join(OUT, '03-builder-content-editor.png'), fullPage: false });

  // ─── 3. Design Panel ───
  console.log('📸 Capturing design panel...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.includes('Design')) {
        tab.click();
        break;
      }
    }
  });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '04-builder-design-panel.png'), fullPage: false });

  // ─── 4. ATS Score Panel ───
  console.log('📸 Capturing ATS score panel...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.includes('ATS')) {
        tab.click();
        break;
      }
    }
  });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '05-builder-ats-score.png'), fullPage: false });

  // ─── 5. Dark Mode ───
  console.log('📸 Capturing dark mode...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await sleep(500);

  // Go back to content tab for dark mode shot
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.includes('Content')) {
        tab.click();
        break;
      }
    }
  });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '06-builder-dark-mode.png'), fullPage: false });

  // Turn off dark mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await sleep(1000);

  // ─── 6. Template Showcase — fresh seed for each template ───
  console.log('📸 Capturing all 8 templates...');
  const templateColors = {
    professional: { primary: '#1e40af', secondary: '#1e293b', accent: '#3b82f6' },
    modern: { primary: '#065f46', secondary: '#1e293b', accent: '#10b981' },
    minimal: { primary: '#334155', secondary: '#0f172a', accent: '#64748b' },
    executive: { primary: '#92400e', secondary: '#1e293b', accent: '#f59e0b' },
    creative: { primary: '#5b21b6', secondary: '#1e293b', accent: '#8b5cf6' },
    technical: { primary: '#115e59', secondary: '#1e293b', accent: '#14b8a6' },
    elegant: { primary: '#991b1b', secondary: '#1e293b', accent: '#ef4444' },
    bold: { primary: '#3730a3', secondary: '#1e293b', accent: '#6366f1' },
  };

  for (const tmpl of TEMPLATES) {
    console.log(`   → ${tmpl}`);
    const c = templateColors[tmpl];
    const tmplStyle = { ...DEFAULT_STYLE, template: tmpl, primaryColor: c.primary, secondaryColor: c.secondary, accentColor: c.accent };
    await seedStore(page, SAMPLE_RESUME, tmplStyle);
    await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle0', timeout: 60000 });
    await sleep(4000);

    // Full page screenshot for template
    await page.screenshot({ path: path.join(OUT, `template-${tmpl}.png`), fullPage: false });
  }

  // ─── 7. Export preview modal ───
  console.log('📸 Capturing export preview modal...');
  await seedStore(page, SAMPLE_RESUME, DEFAULT_STYLE);
  await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle0', timeout: 60000 });
  await sleep(4000);

  // Click the export dropdown
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.textContent || '';
      if (text.includes('Export') || text.includes('Download')) {
        btn.click();
        break;
      }
    }
  });
  await sleep(1000);

  // Click "Preview Before Export"
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if ((btn.textContent || '').includes('Preview')) {
        btn.click();
        break;
      }
    }
  });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '07-export-preview.png'), fullPage: false });

  // Close preview
  await page.keyboard.press('Escape');
  await sleep(500);

  // ─── 8. Mobile-ish view of landing ───
  console.log('📸 Capturing mobile landing...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT, '08-mobile-landing.png'), fullPage: false });

  await browser.close();
  console.log(`\n✅ All screenshots saved to: ${OUT}`);
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
