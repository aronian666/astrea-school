type tInputEvent<El = HTMLInputElement, E = Event> = E & { currentTarget: EventTarget & El }
type tOnSubmit = ((e: tInputEvent<HTMLFormElement, SubmitEvent>) => Promise<any> | any)
type tOnChange<EL = HTMLInputElement> = ((this: EL, e: tInputEvent<EL>) => Promise<void> | void) | undefined
type tOnInput = ((this: HTMLInputElement, e: tInputEvent<HTMLInputElement>) => Promise<void> | void) | undefined
type tOnKeypress = ((this: HTMLInputElement, e: tInputEvent<HTMLInputElement, KeyboardEvent>) => Promise<void> | void) | undefined


// Types for filter

type tMatch<Table> = {
  sign?: string
  value: string
  property: keyof Table
} // Input for anything

type tPaginate = {
  order?: string
  ascending?: "true" | "false"
  page?: string
  perPage?: string
  search?: string
  matches?: { params: string, value: string }[]
}

type AsideOption = {
  title?: string
  paths: {
    icon?: string
    href: string
    name: string,
    match?: boolean
  }[]
}


type tMessage = {
  body: string
  type: "success" | "error" | "warning"
  title?: string
}