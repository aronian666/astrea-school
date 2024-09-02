type Axe = { x: number; y: number };
const moves = {
  ArrowLeft: (axes: Axe) => axes.x--,
  ArrowRight: (axes: Axe) => axes.x++,
  ArrowUp: (axes: Axe) => axes.y--,
  ArrowDown: (axes: Axe) => axes.y++,
};
export function setNote(value: number | undefined) {
  if (value === undefined) return "";
  if (value < 10.5) return "C";
  if (value < 13.5) return "B";
  if (value < 17.5) return "A";
  return "AD";
}

export function setColor(value: number | undefined) {
  if (value === undefined) return ""
  if (value < 10.5) return "var(--red)"
  return "var(--blue)"
}

export function onPasteExcel(e: ClipboardEvent & { currentTarget: EventTarget & HTMLInputElement }, axes: Axe) {
  e.preventDefault();
  const pastedData = e.clipboardData!.getData("text");
  const rows = pastedData.split("\r\n");
  const matrix = rows.map((row) => row.split("\t"));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const input = document.querySelector<HTMLInputElement>(`#input${j + axes.x}-${i + axes.y}`);
      console.log(input)
      if (input) {
        input.value = matrix[i][j];
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("change"));
      }
    }
  }
}

export function onKeyDownExcel(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }, axes: Axe) {
  if (!Object.keys(moves).includes(e.key)) return;
  e.preventDefault();
  // @ts-ignore
  moves[e.key](axes);
  const input = document.querySelector<HTMLInputElement>(`#input${axes.x}-${axes.y}`);
  if (input) input.focus();
}

export function opInputExcel(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
  const input = e.currentTarget;
  const value = Number(input.value);
  if (value < 0 || value > 20) return (input.value = "0");
  const td = input.parentNode! as HTMLElement;
  const span = input.nextElementSibling!;
  span.innerHTML = setNote(value);
  if (value < 10.5) {
    td.style.color = "var(--red)";
  } else {
    td.style.color = "var(--blue)";
  }
}