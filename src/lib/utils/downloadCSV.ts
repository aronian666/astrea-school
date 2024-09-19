function arrayToCSV(data: any[][]): string {
  let csvContent = "";
  data.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });
  return csvContent;
}

export function downloadCSV(data: any[][], fileName: string): void {
  const csvContent = arrayToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
