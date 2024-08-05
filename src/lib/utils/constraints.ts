export const DATE_TO_GROUP: {
  [key: number]: {
    interval: "month" | "week" | "day" | "hour",
    intl: Intl.DateTimeFormatOptions
  }
} = {
  4: { interval: "month", intl: { month: "long" } },
  7: { interval: "day", intl: { day: "2-digit" } },
  8: { interval: "day", intl: { weekday: "long" } },
  10: { interval: "hour", intl: { hour: "2-digit", hour12: true } },
};

export const AXES = [
  { axis: "x", icon: "iconamoon:sign-x", name: "Ancho" },
  { axis: "y", icon: "iconamoon:sign-y", name: "Largo" },
]