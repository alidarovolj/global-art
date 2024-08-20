export function formatCurrency(value) {
    if (typeof value !== "number") {
        return value;
    }
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    });
}
