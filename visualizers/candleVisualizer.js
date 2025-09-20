export const candleVisualizer = (historicalData, useColor = false, COLORS) => {
  const allCandles = historicalData.slice(-20);
  const closes = allCandles.map(candle => candle[4]);
  const highs = allCandles.map(candle => candle[2]);
  const lows = allCandles.map(candle => candle[3]);

  const highestCloseIndex = closes.indexOf(Math.max(...closes));
  const lowestCloseIndex = closes.indexOf(Math.min(...closes));
  const highestHighIndex = highs.indexOf(Math.max(...highs));
  const lowestLowIndex = lows.indexOf(Math.min(...lows));

  let visualization = "";

  allCandles.forEach((candle, index) => {
    //const open = candle[1];
    const close = candle[4];
    const isHighestClose = index === highestCloseIndex;
    const isLowestClose = index === lowestCloseIndex;
    const isHighestHigh = index === highestHighIndex;
    const isLowestLow = index === lowestLowIndex;

    let indicator = "|";
    let color = "#94a3b8";
    const prevClose = allCandles[index - 1]?.[4];

    if (prevClose && close > prevClose) {
      indicator = "/";
      color = COLORS.green;
    }
    if (prevClose && close < prevClose) {
      indicator = "\\";
      color = COLORS.red;
    }

    if (isHighestClose) {
      indicator = "C";
      color = COLORS.green;
    }
    if (isHighestHigh) {
      indicator = "h";
      color = COLORS.green;
    }
    if (isHighestClose && isHighestHigh) {
      indicator = "T";
      color = COLORS.green;
    }
    if (isLowestClose) {
      indicator = "c";
      color = COLORS.red;
    }
    if (isLowestLow) {
      indicator = "l";
      color = COLORS.red;
    }
    if (isLowestClose && isLowestLow) {
      indicator = "B";
      color = COLORS.red;
    }

    visualization += useColor ? `<span color="${color}">${indicator}</span>` : indicator;
  });

  return visualization;
};
