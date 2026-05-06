import { NextRequest, NextResponse } from "next/server"

const CALIL_API_BASE = "https://api.calil.jp/library"
const API_KEY = process.env.CALIL_API_KEY || "demo"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const pref = searchParams.get("pref")
  const city = searchParams.get("city")
  const limit = searchParams.get("limit") || "20"

  const params = new URLSearchParams({
    appkey: API_KEY,
    format: "json",
    limit,
  })

  if (lat && lng) {
    params.set("geocode", `${lng},${lat}`)
  } else if (pref) {
    params.set("pref", pref)
    if (city) params.set("city", city)
  } else {
    return NextResponse.json({ error: "lat/lng または pref が必要です" }, { status: 400 })
  }

  try {
    const res = await fetch(`${CALIL_API_BASE}?${params}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`CALIL API error: ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "図書館データの取得に失敗しました" }, { status: 500 })
  }
}
