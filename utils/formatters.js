export const formatPrice = (price) => {
  return `$${Number(price).toLocaleString("en", {
    maximumFractionDigits: 2
  })}`;
};
