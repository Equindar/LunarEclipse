export function buildConditional(
  condition: string,
  trueExpr: string,
  falseExpr = ""
): string {
  return `${condition} ? ${trueExpr} : ${falseExpr || "null"}`;
}
