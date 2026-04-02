import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  APP_URL,
  CATEGORIES,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 日本人のためのスペイン語学習`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'GOOGLE_VERIFICATION_CODE', // placeholder - replace after Search Console setup
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2373350933367990"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold text-spanish-red hover:opacity-80 transition-opacity"
            >
              🇪🇸 {SITE_NAME}
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              {Object.values(CATEGORIES).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-gray-600 hover:text-spanish-red transition-colors"
                >
                  {cat.nameJa}
                </Link>
              ))}
            </div>
            <div className="sm:hidden">
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">カテゴリ</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {Object.values(CATEGORIES).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/${cat.slug}`}
                        className="hover:text-spanish-red"
                      >
                        {cat.nameJa}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">アプリ</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Español Masterアプリでスペイン語を効率的に学習しましょう。
                </p>
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-spanish-red hover:underline"
                >
                  アプリを試す →
                </a>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">About</h3>
                <p className="text-sm text-gray-600">
                  日本人スペイン語学習者のための無料学習リソース。
                  文法・単語・フレーズ・構文を体系的に学べます。
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function MobileMenu() {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer p-2 text-gray-600">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
        {Object.values(CATEGORIES).map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {cat.nameJa}
          </Link>
        ))}
      </div>
    </details>
  );
}
