import axios from "axios";
import { formatPrice } from "./utils/formatters.js"
import { rangeVisualizer } from "./visualizers/rangeVisualizer.js";
import { calculateIndicators } from "./indicators/indicators.js";
import { getLatestValue } from "./utils/indicatorUtils.js";
import { candleVisualizer } from "./visualizers/candleVisualizer.js";

const TIMEFRAMES_START_DATE_FACTOR = {
  "15min": 26,
  "30min": 52,
  "1hour": 102,
  "4hour": 408,
};

const COLORS = {
  green: "#ADD777",
  red: "#F96D7F"
}

const getKuCoinSymbol = (cryptoId) => {
  return `${cryptoId}-USDT`;
};

export const waybarLazyCrypto = async ({ selectedTimeframe = "1hour", symbol = "BTC", color = false }) => {
  try {
    const kuCoinSymbol = getKuCoinSymbol(symbol);
    const now = Math.floor(Date.now() / 1000);
    const hoursAgo = now - (TIMEFRAMES_START_DATE_FACTOR[selectedTimeframe] || 102) * 60 * 60;

    const klineResponse = await axios.get(
      "https://api.kucoin.com/api/v1/market/candles",
      {
        params: {
          symbol: kuCoinSymbol,
          type: selectedTimeframe,
          startAt: hoursAgo,
          endAt: now,
        },
        timeout: 8000,
      },
    );

    const klineData = klineResponse.data?.data || [];

    if (klineData.length === 0) {
      console.log(color ? '<span color="#ff6b6b">Bitcoin No Data</span>' : 'Bitcoin No Data');
      return;
    }

    const processedData = klineData.map((candle) => {
      const [timestamp, open, close, high, low, volume] = candle;
      const timestampMs = parseInt(timestamp) * 1000;

      return [
        timestampMs,
        parseFloat(open),
        parseFloat(high),
        parseFloat(low),
        parseFloat(close),
        parseFloat(volume),
      ];
    });

    const sortedData = processedData.sort((a, b) => a[0] - b[0]);
    const currentPrice = sortedData[sortedData.length - 1][4];
    const prevPrice = sortedData[sortedData.length - 2][4];

    const priceChange = currentPrice - prevPrice;
    const changePercent = ((priceChange / prevPrice) * 100).toFixed(2);

    const formattedPrice = formatPrice(currentPrice);

    const indicators = calculateIndicators(sortedData)
    const candleChart = candleVisualizer(sortedData, color, COLORS);

    const bbVisualizer = rangeVisualizer(({
      price: currentPrice,
      prevPrice: prevPrice,
      upperBand: getLatestValue(indicators.bb.upper),
      middleBand: getLatestValue(indicators.bb.middle),
      lowerBand: getLatestValue(indicators.bb.lower),
      width: 10,
      tag: "BB "
    }))

    const rsivalue = getLatestValue(indicators.rsi)?.toFixed(0)
    const rsicolor = rsivalue > 70 || rsivalue < 30 ? COLORS.red : COLORS.green
    const RSI = `RSI <span color="${rsicolor}">${rsivalue || ""}</span>`

    if (color) {
      const priceColor = priceChange >= 0 ? COLORS.green : COLORS.red;
      const percentColor = priceChange >= 0 ? COLORS.green : COLORS.red;

      console.log(
        JSON.stringify({
          text: `<span>${symbol}</span> ` +
            `<span color="${priceColor}">${formattedPrice}</span> ` +
            `<span color="${percentColor}">${changePercent}%</span> ` +
            `${candleChart} ` +
            `${RSI}` +
            ` ${bbVisualizer}` +
            ` ${selectedTimeframe}`,
          tooltip: "Candle Chart Legend:\nC = Highest close price\nc = Lowest close price\nh = Highest high price\nl = Lowest low price\nT = Highest close and high\nB = Lowest close and low"
        })
      );
    } else {
      console.log(`${symbol} ${formattedPrice} ${changePercent}% ${candleChart} ${selectedTimeframe}`);
    }

  } catch (error) {
    const errorMessages = {
      'ENOTFOUND': color ? '<span color="#ff6b6b">₿ Connection Error</span>' : '₿ Connection Error',
      'ECONNREFUSED': color ? '<span color="#ff6b6b">₿ Connection Error</span>' : '₿ Connection Error',
      '429': color ? '<span color="#fbbf24">₿ Rate Limited</span>' : '₿ Rate Limited',
      'default': color ? '<span color="#ff6b6b">₿ Error</span>' : '₿ Error'
    };

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log(errorMessages['ENOTFOUND']);
    } else if (error.response?.status === 429) {
      console.log(errorMessages['429']);
    } else {
      console.log(errorMessages['default']);
    }
    process.stderr.write(`Bitcoin error: ${error.message}\n`);
  }
};
