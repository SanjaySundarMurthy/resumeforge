# ResumeForge

**Build ATS-Friendly Resumes That Land Interviews**

A powerful, free, open-source resume builder with real-time preview, 8 professional templates, ATS scoring, and pixel-perfect PDF export. Built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **8 Professional Templates** — Professional, Modern, Minimal, Executive, Creative, Technical, Elegant, and Bold
- **Real-Time ATS Scoring** — Instant feedback with actionable tips to optimize your resume
- **Live Preview** — See changes reflected instantly as you type
- **Pixel-Perfect PDF Export** — Download high-quality PDFs using html2canvas + jsPDF
- **10 Color Themes** — Royal Blue, Emerald, Crimson, Purple, Teal, Amber, Slate, Rose, Indigo, Classic Black
- **6 Font Families** — Inter, Merriweather, Georgia, Helvetica, Times New Roman, Calibri
- **Multiple Resumes** — Create and manage multiple resumes for different applications
- **Import/Export** — Save and load resume data as JSON
- **Privacy First** — All data stays in your browser via localStorage
- **No Sign-Up Required** — Start building immediately, no accounts needed
- **Dark/Light Mode** — Full theme support
- **Responsive Design** — Works on desktop and tablet

## Templates

| Template | Best For | Style |
|----------|----------|-------|
| **Professional** | Corporate, Finance, Law | Clean, traditional |
| **Modern** | Tech, Startups, Marketing | Contemporary, vibrant |
| **Minimal** | Any field | Elegant simplicity |
| **Executive** | C-Suite, Directors | Commanding presence |
| **Creative** | Design, Media, Marketing | Bold, expressive |
| **Technical** | SWE, DevOps, SRE | Code-like aesthetic |
| **Elegant** | Law, Consulting, Academia | Sophisticated serif |
| **Bold** | Sales, Management | High-impact design |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 4.5 with localStorage persistence
- **PDF Generation:** html2canvas + jsPDF
- **Icons:** Lucide React
- **Build Tool:** Next.js compiler (SWC)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SanjaySundarMurthy/resumeforge.git
cd resumeforge

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles + animations
│   └── builder/
│       └── page.tsx        # Main resume editor
├── components/
│   ├── editor/
│   │   ├── SectionEditors.tsx   # All section form editors
│   │   ├── DesignPanel.tsx      # Template, color, font settings
│   │   └── ATSScorePanel.tsx    # ATS score visualization
│   └── resume/
│       ├── ResumePreview.tsx    # Preview wrapper with scaling
│       └── templates/          # 8 resume template components
├── store/
│   └── useResumeStore.ts  # Zustand store with persistence
├── types/
│   └── resume.ts          # TypeScript type definitions
└── lib/
    ├── utils.ts           # Utility functions
    ├── ats-scorer.ts      # ATS scoring engine
    └── pdf-generator.ts   # PDF export logic
```

## ATS Scoring

ResumeForge includes a comprehensive ATS scoring engine that analyzes:

- **Contact Information** — Name, email, phone, location, LinkedIn
- **Professional Summary** — Word count, action verbs, metrics
- **Work Experience** — Bullet points, quantifiable achievements, action verbs
- **Education** — Degree, field, institution
- **Skills** — Quantity, categorization, relevance
- **Formatting** — Section structure, completeness
- **Content Length** — Optimal word count for 1-page resumes

## Sections Supported

1. Personal Information
2. Professional Summary
3. Work Experience
4. Education
5. Skills (categorized)
6. Projects
7. Certifications
8. Languages
9. Awards & Honors
10. Volunteering
11. Publications
12. References

## Author

**Sanjay Sundar Murthy**

- GitHub: [@SanjaySundarMurthy](https://github.com/SanjaySundarMurthy)
- Email: sanjaysundarmurthy@gmail.com

## License

MIT License — free for personal and commercial use.
