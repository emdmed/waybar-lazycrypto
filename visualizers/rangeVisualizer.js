
export const rangeVisualizer = ({
  price,
  upperBand,
  middleBand,
  lowerBand,
  prevPrice,
  width = 30,
  valueColor = "#ff6b6b",
  tag = "Range: ",
  color = true,
}) => {

  const setSymbol = () => {
    if (price > prevPrice) return `/`;
    return `\\`;
  };

  if (!price || !upperBand || !middleBand || !(typeof lowerBand === "number")) {
    return color ? '<span color="#ff6b6b">Missing data</span>' : 'Missing data';
  }

  const range = upperBand - lowerBand;
  if (range <= 0) {
    return color ? '<span color="#ff6b6b">Invalid range</span>' : 'Invalid range';
  }

  const pricePosition = (price - lowerBand) / range;
  const clampedPosition = Math.max(0, Math.min(1, pricePosition));
  const priceIndex = Math.round(clampedPosition * (width - 1));

  const middlePosition = (middleBand - lowerBand) / range;
  const middleIndex = Math.round(middlePosition * (width - 1));

  const visualWidth = width - 1;

  // Build the visualization string with colors
  let visualization = "";

  // Add left boundary
  const leftSymbol = setSymbol();
  const leftColor = price < lowerBand ? valueColor : "#ffffff";
  visualization += color ? `<span color="${leftColor}">${leftSymbol}</span>` : leftSymbol;

  // Add middle section
  for (let index = 0; index < visualWidth; index++) {
    const adjustedIndex = index + 1;
    let symbol = price > prevPrice ? "/" : "\\";
    let symbolColor = "#808080"; // gray

    if (adjustedIndex === priceIndex) {
      symbol = setSymbol();
      symbolColor = valueColor;
    } else if (adjustedIndex === middleIndex) {
      symbol = setSymbol();
      symbolColor = "#ffffff"; // white
    }

    visualization += color ? `<span color="${symbolColor}">${symbol}</span>` : symbol;
  }

  const rightSymbol = setSymbol();
  const rightColor = price > upperBand ? valueColor : "#ffffff";
  visualization += color ? `<span color="${rightColor}">${rightSymbol}</span>` : rightSymbol;

  const tagSpan = color ? `<span>${tag}</span>` : tag;

  const output = `${tagSpan}${visualization}`;

  return output;
};

