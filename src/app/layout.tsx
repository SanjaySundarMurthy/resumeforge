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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Fonts for extended typography options */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Merriweather:wght@300;400;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&family=Source+Sans+3:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
