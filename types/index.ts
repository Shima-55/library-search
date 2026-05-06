export interface Library {
  systemid: string
  systemname: string
  libkey: string
  libid: string
  short: string
  formal: string
  url_pc: string
  address: string
  pref: string
  city: string
  post: string
  tel: string
  geocode: string
  category: string
}

export interface BookStatus {
  status: "OK" | "Running" | "Error" | "Cache"
  reserveurl?: string
  libkey?: Record<string, string>
}

export interface CheckResponse {
  session: string
  books: Record<string, Record<string, BookStatus>>
  continue: number
}
