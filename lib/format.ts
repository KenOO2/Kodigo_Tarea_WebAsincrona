export function formatPrice(price: string | number) {
  const value = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(value) ? value : 0);
}
