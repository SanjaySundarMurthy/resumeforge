import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ResumeForge — Build ATS-Friendly Resumes That Land Interviews',
  description:
    'Create stunning, ATS-optimized resumes in minutes. Choose from 8 professional templates, get real-time ATS scoring, and export pixel-perfect PDFs. Free and open source.',
  keywords: [
    'resume builder',
    'ATS resume',
    'resume templates',
    'CV maker',
    'professional resume',
    'job application',
    'career',
  ],
  authors: [{ name: 'Sanjay Sundar Murthy' }],
  openGraph: {
    title: 'ResumeForge — Build ATS-Friendly Resumes That Land Interviews',
    description: 'Create stunning, ATS-optimized resumes in minutes with 8 professional templates and real-time ATS scoring.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
