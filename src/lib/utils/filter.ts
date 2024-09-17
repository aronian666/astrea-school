import { ExtendedDate } from "./extendedDate";

export const formToJson = <T = { [key: string]: string | null }>(formData: FormData | URLSearchParams) => {
  const formObject: { [key: string]: any } = {};
  for (let [key, value] of formData.entries()) {
    const regex = /([^[]+)|\[(.*?)\]/g
    const keys = Array.from(key.matchAll(regex), match => match[1] || match[2]);
    let objRef = formObject;
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      const isLastKey = i === keys.length - 1;
      const isNumber = !isNaN(Number(currentKey))
      if (isLastKey) {
        if (currentKey === "") objRef.push(value)
        else if (isNumber) objRef[Number(currentKey)] = value
        else objRef[currentKey] = value;
      } else {
        const algo = objRef[currentKey] || (keys[i + 1] === "" || !isNaN(Number(keys[i + 1])) ? [] : {});
        if (currentKey === "") objRef.push(algo)
        else if (isNumber) objRef[Number(currentKey)] = algo
        else objRef[currentKey] = algo;
        objRef = algo;
      }
    }
  }
  return formObject as T;
};

export const setNull = (object: { [key: string]: string | null }) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value === "null" || value === "") object[key] = null
  })
  return object
}
export class Filter {
  ascending: "true" | "false" = "true"
  order?: string
  page = 0
  perPage = 10
  search = ""
  matches: { column: string, sign1: string, sign2: string, value: string | string[], type: string }[] = []
  constructor(url: URL) {
    const { ascending, order, page, perPage, search, matches } = formToJson<tPaginate>(url.searchParams)
    if (ascending) this.ascending = ascending
    if (order) this.order = order
    if (page) this.page = Number(page)
    if (perPage) this.perPage = Number(perPage)
    if (search) this.search = search
    if (matches) this.matches = matches.filter(match => match.value).map(match => {
      const [column, sign1, sign2, type] = match.params.split(' ')
      return { value: match.value, column, sign1, sign2, type }
    })
  }
  paginate<QueryType>(query: QueryType, column = "search") {
    const page = Number(this.page)
    const perPage = Number(this.perPage)
    //@ts-ignore
    query.range(page * perPage, (page + 1) * perPage - 1)
    //@ts-ignore
    if (this.order) query.order(this.order, { ascending: this.ascending === 'true' })
    //@ts-ignore

    if (this.search) query.textSearch(column, this.search.split(" ").filter(Boolean).map(word => `'${word}':*`).join(' | '), { config: "spanish" })
    const filterString = this.getFilterString("JS")
    //@ts-ignore
    if (filterString) query.or(`and(${filterString})`)
    return query
  }
  getFilterString(db: "JS" | "SQL") {
    return this.matches.map(({ column, sign1 = "eq", sign2 = "=", value, type = "text" }) => {
      if (Array.isArray(value)) value = `(${value.join(",")})`
      else if (type === "date") value = new ExtendedDate(value).toISOString()
      if (db === "JS") return `${column}.${sign1}.${value}`
      return `${column} ${sign2} '${value}'`
    }).join(db === "JS" ? "," : " AND ")
  }
}