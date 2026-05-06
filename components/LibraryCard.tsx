"use client"

import { Library } from "@/types"

interface Props {
  library: Library
  isSelected?: boolean
  onSelect?: (lib: Library) => void
}

const categoryColor: Record<string, string> = {
  都道府県立: "bg-purple-100 text-purple-700",
  市区町村立: "bg-blue-100 text-blue-700",
  大学図書館: "bg-green-100 text-green-700",
  専門図書館: "bg-orange-100 text-orange-700",
}

export default function LibraryCard({ library, isSelected, onSelect }: Props) {
  const color = categoryColor[library.category] || "bg-gray-100 text-gray-700"
  const [lng, lat] = library.geocode.split(",")
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <div
      className={`card cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-sky-500 shadow-md" : ""
      }`}
      onClick={() => onSelect?.(library)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{library.formal}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
              {library.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            〒{library.post}　{library.address}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {library.tel && (
              <a
                href={`tel:${library.tel}`}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>📞</span> {library.tel}
              </a>
            )}
            {library.url_pc && (
              <a
                href={library.url_pc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600 hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>🔗</span> ウェブサイト
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-600 hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span>🗺️</span> 地図
            </a>
          </div>
        </div>
        {onSelect && (
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
            isSelected ? "border-sky-500 bg-sky-500" : "border-gray-300"
          }`}>
            {isSelected && <span className="text-white text-xs flex items-center justify-center h-full">✓</span>}
          </div>
        )}
      </div>
    </div>
  )
}
