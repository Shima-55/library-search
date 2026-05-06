import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ちかくの図書館 | CALIL図書館検索",
  description: "現在地や地域から近くの図書館を探せます。本の蔵書確認もできます。",
  openGraph: {
    title: "ちかくの図書館",
    description: "現在地から近くの図書館を探そう",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">ちかくの図書館</h1>
              <p className="text-xs text-gray-500">Powered by カーリル図書館API</p>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="mt-12 border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
            図書館データは{" "}
            <a href="https://calil.jp" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">
              カーリル
            </a>{" "}
            が提供しています
          </div>
        </footer>
      </body>
    </html>
  )
}
