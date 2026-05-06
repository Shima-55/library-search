import { NextRequest, NextResponse } from "next/server"

const CALIL_CHECK_BASE = "https://api.calil.jp/check"
const API_KEY = process.env.CALIL_API_KEY || "demo"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isbn = searchParams.get("isbn")
  const systemid = searchParams.get("systemid")
  const session = searchParams.get("session")

  const params = new URLSearchParams({
    appkey: API_KEY,
    format: "json",
  })

  if (session) {
    params.set("session", session)
  } else if (isbn && systemid) {
    params.set("isbn", isbn)
    params.set("systemid", systemid)
  } else {
    return NextResponse.json({ error: "isbn と systemid、または session が必要です" }, { status: 400 })
  }

  try {
    const res = await fetch(`${CALIL_CHECK_BASE}?${params}`)
    if (!res.ok) throw new Error(`CALIL API error: ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "蔵書確認に失敗しました" }, { status: 500 })
  }
}
