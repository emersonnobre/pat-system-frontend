export function formatToLocaleString(str) {
  return new Date(str).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}