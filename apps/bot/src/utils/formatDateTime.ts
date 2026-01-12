export default function formatDateTime(dateInput: Date | string): string {

  if (typeof dateInput === "string" && dateInput == '')
    return '';

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const formatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatter.format(date).replace(",", " -");
}
