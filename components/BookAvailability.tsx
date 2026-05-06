"use client"

import { useState } from "react"
import { Library, CheckResponse } from "@/types"

interface Props {
  selectedLibraries: Library[]
}

interface AvailabilityResult {
  systemid: string
  systemname: string
  libkey?: Record<string, string>
  reserveurl?: string
  status: string
}

export default function BookAvailability({ selectedLibraries }: Props) {
  const [isbn, setIsbn] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AvailabilityResult[] | null>(null)
  const [error, setError] = useState("")

  const normalizeIsbn = (input: string) => input.replace(/[-\s]/g, "")

  const pollCheck = async (session: string): Promise<CheckResponse> => {
    await new Promise((r) => setTimeout(r, 2000))
    const res = await fetch(`/api/check?session=${session}`)
    const data: CheckResponse = await res.json()
    if (data.continue === 1) return pollCheck(data.session)
    return data
  }

  const handleCheck = async () => {
    const normalized = normalizeIsbn(isbn)
    if (!normalized || normalized.length < 10) {
      setError("正しいISBNを入力してください（例：9784000000000）")
      return
    }
    if (selectedLibraries.length === 0) {
      setError("図書館を選択してください")
      return
    }

    setLoading(true)
    setError("")
    setResults(null)

    const systemids = [...new Set(selectedLibraries.map((l) => l.systemid))].join(",")

    try {
      const res = await fetch(`/api/check?isbn=${normalized}&systemid=${encodeURIComponent(systemids)}`)
      let data: CheckResponse = await res.json()
      if (data.continue === 1) {
        data = await pollCheck(data.session)
      }

      const bookData = data.books[normalized] || {}
      const resultList: AvailabilityResult[] = selectedLibraries
        .filter((lib, idx, arr) => arr.findIndex((l) => l.systemid === lib.systemid) === idx)
        .map((lib) => {
          const systemData = bookData[lib.systemid]
          return {
            systemid: lib.systemid,
            systemname: lib.formal,
            libkey: systemData?.libkey,
            reserveurl: systemData?.reserveurl,
            status: systemData?.status || "不明",
          }
        })

      setResults(resultList)
    } catch {
      setError("蔵書確認に失敗しました。しばらくしてから再試行してください。")
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityText = (result: AvailabilityResult) => {
    if (!result.libkey || Object.keys(result.libkey).length === 0) {
      return { text: "蔵書なし", color: "text-gray-400" }
    }
    const entries = Object.entries(result.libkey)
    const available = entries.find(([, v]) => v === "貸出可")
    if (available) return { text: "貸出可", color: "text-green-600" }
    const reserved = entries.find(([, v]) => v.includes("予約"))
    if (reserved) return { text: reserved[1], color: "text-yellow-600" }
    return { text: entries[0][1], color: "text-orange-500" }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📖</span> 蔵書を確認する
      </h2>

      {selectedLibraries.length === 0 ? (
        <p className="text-sm text-gray-400">上の図書館リストから確認したい図書館を選んでください</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {[...new Set(selectedLibraries.map((l) => l.formal))].map((name) => (
              <span key={name} className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full">
                {name}
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="input-field"
              placeholder="ISBN（例：9784167110017）"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            <button className="btn-primary whitespace-nowrap" onClick={handleCheck} disabled={loading}>
              {loading ? "確認中..." : "確認"}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          {results && (
            <div className="space-y-2 mt-4">
              {results.map((result) => {
                const { text, color } = getAvailabilityText(result)
                return (
                  <div key={result.systemid} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                    <span className="text-sm text-gray-700 font-medium">{result.systemname}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${color}`}>{text}</span>
                      {result.reserveurl && text !== "蔵書なし" && (
                        <a
                          href={result.reserveurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs btn-secondary py-1 px-3"
                        >
                          予約
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
