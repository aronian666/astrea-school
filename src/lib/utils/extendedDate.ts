type InputDate = "year" | "month" | "week" | "date"
export class ExtendedDate extends Date {
  toInput(type: InputDate = "date") {
    if (type === "year") return this.getFullYear().toString()
    if (type === "date") return this.toISOString().split('T')[0];
    if (type === "week") {
      const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
      const dayNum = d.getUTCDay() || 7;
      const year = this.getFullYear();
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return year + '-W' + weekNumber.toString().padStart(2, '0');
    }
    const year = this.getFullYear();
    const month = this.getMonth() + 1;
    return year + '-' + month.toString().padStart(2, '0');
  }
  toIntl(params: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: '2-digit', hour: "2-digit", minute: "2-digit", hour12: true }) {
    const intl = new Intl.DateTimeFormat('es-ES', params)
    return intl.format(this)
  }
  static getInputRanges(date: string, column = "created_at") {
    const ranges = this.getRanges(date)
    const signs = ['gt >', 'lt <']
    return ranges.map((date, index) => {
      return [{ value: date.toISOString(), name: `matches[${index}][value]` }, { value: `${column} ${signs[index]}`, name: `matches[${index}][params]` }]
    }).flat()
  }
  static getRanges(input: string): [Date, Date] {
    let start: Date;
    let end: Date;
    if (input.length === 7) {
      start = new Date(input);
      start.setHours(start.getHours() + 5)
      end = structuredClone(start)
      end.setMonth(end.getMonth() + 1)
      end.setDate(1)

    } else if (input.length === 8) {
      // Input is in the format "YYYY-WWW"
      const parts = input.split('-W');
      const year = parseInt(parts[0], 10);
      const weekNumber = Number(parts[1]);
      start = new Date(year, 0, 1 + 7 * (weekNumber - 1));
      end = structuredClone(start)
      end.setDate(end.getDate() + 7)

    }
    else if (input.length === 4) {
      // Year
      start = new Date(input)
      end = structuredClone(start)
      end.setFullYear(end.getFullYear() + 1)

    }
    else {
      // Date
      start = new Date(input);
      start.setHours(start.getHours() + 5)
      end = structuredClone(start)
      end.setDate(end.getDate() + 1)
    }
    return [start, end]
  }

}