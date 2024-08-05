import { writable } from "svelte/store";
type Message = {
  details: string,
  message: string,
  error?: boolean
}

export const message = writable<Message | null>(null)
let timer: NodeJS.Timeout

message.subscribe((value) => {
  if (!value) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    message.update(() => null)
  }, 10000)
})