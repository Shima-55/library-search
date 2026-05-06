import LibrarySearch from "@/components/LibrarySearch"

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ちかくの図書館を探そう</h2>
        <p className="text-gray-500 text-sm">
          現在地や地域から図書館を検索できます。図書館を選んでISBNを入力すると蔵書の有無も確認できます。
        </p>
      </div>
      <LibrarySearch />
    </div>
  )
}
