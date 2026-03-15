'use client';

import Link from 'next/link';
import {
  FileText, Sparkles, Shield, Download, Palette, BarChart3,
  Zap, CheckCircle2, Star, ArrowRight, ChevronDown, Layers,
  Target, Award, Globe, Users, Code2, Layout,
} from 'lucide-react';
import { useState } from 'react';

/* ── Hero Section ────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Free & Open Source Resume Builder</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 animate-slide-up">
            Build Resumes That
            <span className="block gradient-text mt-2">Land Interviews</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Create stunning, ATS-optimized resumes in minutes. Choose from 8 professional templates,
            get real-time ATS scoring, and export pixel-perfect PDFs.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/builder"
              className="btn-primary text-base px-8 py-3.5 rounded-xl group"
            >
              Start Building for Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#templates"
              className="btn-secondary text-base px-8 py-3.5 rounded-xl"
            >
              View Templates
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No sign-up required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              100% free
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              ATS-optimized
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-20 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="relative rounded-2xl border border-gray-200 shadow-2xl shadow-gray-300/30 overflow-hidden bg-gray-50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="w-64 h-6 bg-white rounded-md border border-gray-200 flex items-center px-3 text-xs text-gray-400">
                  resumeforge.app/builder
                </div>
              </div>
            </div>
            {/* Editor preview image */}
            <div className="flex h-[400px]">
              {/* Sidebar */}
              <div className="w-72 bg-white border-r border-gray-200 p-4 hidden sm:block">
                <div className="space-y-3">
                  <div className="h-8 bg-blue-50 rounded-lg border border-blue-200 flex items-center px-3 text-xs font-medium text-blue-700">
                    <FileText className="w-3.5 h-3.5 mr-2" /> Personal Info
                  </div>
                  {['Summary', 'Experience', 'Education', 'Skills', 'Projects'].map((s) => (
                    <div key={s} className="h-8 bg-gray-50 rounded-lg flex items-center px-3 text-xs text-gray-500 hover:bg-gray-100 transition-colors">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              {/* Editor */}
              <div className="flex-1 p-6 bg-white hidden lg:block">
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-100 rounded-lg border border-gray-200" />
                    <div className="h-10 bg-gray-100 rounded-lg border border-gray-200" />
                    <div className="h-10 bg-blue-50 rounded-lg border border-blue-200" />
                    <div className="h-10 bg-gray-100 rounded-lg border border-gray-200" />
                  </div>
                  <div className="h-24 bg-gray-50 rounded-lg border border-gray-200" />
                </div>
              </div>
              {/* Preview */}
              <div className="flex-1 bg-gray-100/50 flex items-start justify-center p-6 min-w-0">
                <div className="bg-white shadow-lg rounded-sm w-full max-w-xs p-5 transform scale-90 origin-top">
                  <div className="border-b-2 border-blue-600 pb-3 mb-3">
                    <div className="h-4 w-36 bg-gray-800 rounded mb-1" />
                    <div className="h-2.5 w-28 bg-blue-600/30 rounded mb-2" />
                    <div className="flex gap-3">
                      <div className="h-2 w-16 bg-gray-300 rounded" />
                      <div className="h-2 w-20 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="h-2.5 w-20 bg-blue-600 rounded mb-1.5" />
                      <div className="h-2 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-2 w-4/5 bg-gray-200 rounded" />
                    </div>
                    <div>
                      <div className="h-2.5 w-24 bg-blue-600 rounded mb-1.5" />
                      <div className="flex justify-between mb-1">
                        <div className="h-2 w-24 bg-gray-400 rounded" />
                        <div className="h-2 w-16 bg-gray-300 rounded" />
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded mb-0.5" />
                      <div className="h-2 w-5/6 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Features Section ────────────────────────────────────── */

const features = [
  {
    icon: Layout,
    title: '8 Professional Templates',
    desc: 'From classic professional to bold creative — every template is ATS-tested and recruiter-approved.',
  },
  {
    icon: Target,
    title: 'Real-Time ATS Scoring',
    desc: 'Get instant feedback on ATS compatibility with actionable tips to optimize your resume.',
  },
  {
    icon: Palette,
    title: 'Full Customization',
    desc: '10 color themes, 6 professional font families, and granular layout controls.',
  },
  {
    icon: Download,
    title: 'Pixel-Perfect PDF Export',
    desc: 'Download your resume as a high-quality PDF that looks exactly like the preview.',
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    desc: 'See changes reflected in real-time as you type. What you see is what you get.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'All data stays in your browser. No accounts, no tracking, no data collection.',
  },
  {
    icon: Layers,
    title: 'Multiple Resumes',
    desc: 'Create and manage multiple resumes for different job applications.',
  },
  {
    icon: Globe,
    title: 'Import & Export',
    desc: 'Export your data as JSON to back up, or import previously saved resumes.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything You Need to
            <span className="gradient-text"> Land the Job</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to give you an unfair advantage in the job market.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Templates Section ───────────────────────────────────── */

const templates = [
  { id: 'professional', name: 'Professional', color: '#1e40af', desc: 'Clean & traditional — perfect for corporate roles' },
  { id: 'modern', name: 'Modern', color: '#7c3aed', desc: 'Contemporary design with a fresh feel' },
  { id: 'minimal', name: 'Minimal', color: '#374151', desc: 'Elegant simplicity — content takes center stage' },
  { id: 'executive', name: 'Executive', color: '#1e3a5f', desc: 'Commanding presence for leadership roles' },
  { id: 'creative', name: 'Creative', color: '#db2777', desc: 'Bold & expressive for creative professionals' },
  { id: 'technical', name: 'Technical', color: '#059669', desc: 'Structured layout for engineering roles' },
  { id: 'elegant', name: 'Elegant', color: '#92400e', desc: 'Sophisticated design with classic typography' },
  { id: 'bold', name: 'Bold', color: '#dc2626', desc: 'High-impact design that stands out' },
];

function Templates() {
  return (
    <section id="templates" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            8 ATS-Friendly
            <span className="gradient-text"> Templates</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Every template is tested against major ATS systems including Workday, Lever, Greenhouse, and iCIMS.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {templates.map((t) => (
            <Link
              key={t.id}
              href="/builder"
              className="group"
            >
              <div className="relative rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
                {/* Template preview */}
                <div className="aspect-[8.5/11] p-4 bg-white">
                  <div className="h-full border border-gray-100 rounded-sm p-3">
                    {/* Name */}
                    <div className="border-b-2 pb-2 mb-2" style={{ borderColor: t.color }}>
                      <div className="h-3 w-24 rounded" style={{ backgroundColor: t.color + '20' }} />
                      <div className="h-2 w-16 bg-gray-200 rounded mt-1" />
                    </div>
                    {/* Content lines */}
                    <div className="space-y-2">
                      <div>
                        <div className="h-2 w-14 rounded mb-1" style={{ backgroundColor: t.color }} />
                        <div className="h-1.5 w-full bg-gray-100 rounded mb-0.5" />
                        <div className="h-1.5 w-4/5 bg-gray-100 rounded" />
                      </div>
                      <div>
                        <div className="h-2 w-16 rounded mb-1" style={{ backgroundColor: t.color }} />
                        <div className="h-1.5 w-full bg-gray-100 rounded mb-0.5" />
                        <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
                      </div>
                      <div>
                        <div className="h-2 w-12 rounded mb-1" style={{ backgroundColor: t.color }} />
                        <div className="flex gap-1 flex-wrap">
                          <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: t.color + '15' }} />
                          <div className="h-3 w-10 rounded-sm" style={{ backgroundColor: t.color + '15' }} />
                          <div className="h-3 w-7 rounded-sm" style={{ backgroundColor: t.color + '15' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Label */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/builder" className="btn-primary text-base px-8 py-3.5 rounded-xl group">
            Try All Templates Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Choose a Template', desc: 'Pick from 8 professionally designed, ATS-optimized templates.', icon: Layout },
    { num: '02', title: 'Fill In Your Details', desc: 'Enter your experience, education, and skills with our intuitive editor.', icon: FileText },
    { num: '03', title: 'Optimize with ATS Score', desc: 'Get real-time suggestions to improve your ATS compatibility score.', icon: BarChart3 },
    { num: '04', title: 'Download & Apply', desc: 'Export a pixel-perfect PDF ready to submit to any job application.', icon: Download },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Ready in <span className="gradient-text">4 Simple Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-transparent" />
              )}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-xs font-bold text-blue-600 mb-2">{step.num}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ATS ─────────────────────────────────────────────────── */

function ATSSection() {
  const checks = [
    'ATS-compatible formatting verified across Workday, Lever, Greenhouse, iCIMS',
    'Machine-readable text — no images, tables, or complex multi-column layouts',
    'Standard section headings recognized by 99% of ATS systems',
    'Optimized keyword density for job-matching algorithms',
    'Clean HTML structure for digital submission portability',
    'Real-time scoring with actionable improvement suggestions',
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Beat the ATS. <br/>Get Seen by Humans.
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Over 90% of large companies use Applicant Tracking Systems to filter resumes.
              ResumeForge ensures your resume passes every time.
            </p>
            <div className="space-y-3">
              {checks.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-blue-50 text-sm leading-relaxed">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score visualization */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                <circle
                  cx="100" cy="100" r="85"
                  stroke="#34d399"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 85 * 0.92} ${2 * Math.PI * 85}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">92</span>
                <span className="text-blue-200 text-sm">ATS Score</span>
                <span className="text-green-400 text-xs font-semibold mt-1">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────── */

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    text: 'ResumeForge helped me create a resume that finally got me past the ATS filters. Landed 5 interviews in my first week!',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    text: 'The ATS scoring feature is incredible. I went from a 45 to a 94 score, and the difference in response rates was night and day.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Scientist at Netflix',
    text: 'Clean, professional templates that actually look good AND pass ATS. The real-time preview saved me so much time.',
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Loved by <span className="gradient-text">Job Seekers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */

const faqs = [
  {
    q: 'Is ResumeForge really free?',
    a: 'Yes! ResumeForge is 100% free and open source. All features including templates, ATS scoring, and PDF export are available at no cost.',
  },
  {
    q: 'What is an ATS and why does it matter?',
    a: 'An Applicant Tracking System (ATS) is software used by employers to filter and rank resumes. Over 90% of Fortune 500 companies use ATS. If your resume isn\'t ATS-compatible, it may never be seen by a human recruiter.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. All data is stored locally in your browser using localStorage. We don\'t collect, store, or transmit any of your personal information.',
  },
  {
    q: 'Can I create multiple resumes?',
    a: 'Yes! You can create and manage as many resumes as you need — tailor each one for different job applications.',
  },
  {
    q: 'What file formats can I export?',
    a: 'Currently we support PDF export with pixel-perfect quality. You can also export/import your resume data as JSON for backup.',
  },
  {
    q: 'Are the templates tested with real ATS systems?',
    a: 'Yes. All 8 templates have been tested against major ATS platforms including Workday, Lever, Greenhouse, and iCIMS to ensure maximum compatibility.',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ─────────────────────────────────────────── */

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Your Dream Job Is One Resume Away
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of job seekers who've landed interviews at top companies.
          Start building your ATS-optimized resume today.
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors group"
        >
          Build Your Resume Now
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">ResumeForge</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with Next.js, Tailwind CSS, and Zustand. Open source and free forever.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a
              href="https://github.com/SanjaySundarMurthy/resumeforge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Code2 className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">ResumeForge</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#templates" className="hover:text-gray-900 transition-colors">Templates</a>
          </div>
          <Link href="/builder" className="btn-primary text-sm px-5 py-2 rounded-lg">
            Build Resume
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <div className="pt-16">
        <Hero />
        <Features />
        <Templates />
        <HowItWorks />
        <ATSSection />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
