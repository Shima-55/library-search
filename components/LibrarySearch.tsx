"use client"

import { useState, useCallback } from "react"
import { Library } from "@/types"
import LibraryCard from "./LibraryCard"
import BookAvailability from "./BookAvailability"

const PREFS = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
]

export default function LibrarySearch() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedLibraries, setSelectedLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pref, setPref] = useState("")
  const [city, setCity] = useState("")
  const [searchMode, setSearchMode] = useState<"geo" | "area">("geo")
  const [searched, setSearched] = useState(false)

  const fetchLibraries = async (url: string) => {
    setLoading(true)
    setError("")
    setSearched(true)
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setLibraries(Array.isArray(data) ? data : [])
      setSelectedLibraries([])
    } catch (e: any) {
      setError(e.message || "図書館の取得に失敗しました")
      setLibraries([])
    } finally {
      setLoading(false)
    }
  }

  const handleGeoSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません")
      return
    }
    setLoading(true)
    setError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetchLibraries(`/api/libraries?lat=${latitude}&lng=${longitude}&limit=20`)
      },
      () => {
        setLoading(false)
        setError("位置情報の取得が拒否されました。地域から検索してみてください。")
      }
    )
  }, [])

  const handleAreaSearch = () => {
    if (!pref) {
      setError("都道府県を選択してください")
      return
    }
    const params = new URLSearchParams({ pref })
    if (city.trim()) params.set("city", city.trim())
    fetchLibraries(`/api/libraries?${params}`)
  }

  const toggleLibrary = (lib: Library) => {
    setSelectedLibraries((prev) =>
      prev.find((l) => l.libid === lib.libid)
        ? prev.filter((l) => l.libid !== lib.libid)
        : [...prev, lib]
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔍</span> 図書館を探す
        </h2>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4 w-fit">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              searchMode === "geo"
                ? "bg-sky-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSearchMode("geo")}
          >
            📍 現在地から
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              searchMode === "area"
                ? "bg-sky-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSearchMode("area")}
          >
            🗾 地域から
          </button>
        </div>

        {searchMode === "geo" ? (
          <div>
            <p className="text-sm text-gray-500 mb-3">ブラウザの位置情報を使って近くの図書館を探します</p>
            <button className="btn-primary" onClick={handleGeoSearch} disabled={loading}>
              {loading ? "検索中..." : "現在地の図書館を検索"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="input-field sm:w-48"
              value={pref}
              onChange={(e) => setPref(e.target.value)}
            >
              <option value="">都道府県を選択</option>
              {PREFS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="text"
              className="input-field sm:flex-1"
              placeholder="市区町村（省略可）"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAreaSearch()}
            />
            <button className="btn-primary" onClick={handleAreaSearch} disabled={loading}>
              {loading ? "検索中..." : "検索"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="inline-block w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">図書館を検索中...</p>
          </div>
        </div>
      )}

      {!loading && searched && libraries.length === 0 && !error && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">この地域の図書館が見つかりませんでした</p>
        </div>
      )}

      {!loading && libraries.length > 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{libraries.length}</span> 件見つかりました
                {selectedLibraries.length > 0 && (
                  <span className="ml-2 text-sky-600">（{selectedLibraries.length} 件選択中）</span>
                )}
              </p>
              {selectedLibraries.length > 0 && (
                <button
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedLibraries([])}
                >
                  選択解除
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-3">蔵書を確認したい図書館をタップして選択できます</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {libraries.map((lib) => (
                <LibraryCard
                  key={lib.libid}
                  library={lib}
                  isSelected={selectedLibraries.some((l) => l.libid === lib.libid)}
                  onSelect={toggleLibrary}
                />
              ))}
            </div>
          </div>

          <BookAvailability selectedLibraries={selectedLibraries} />
        </>
      )}
    </div>
  )
}
