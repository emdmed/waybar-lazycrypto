#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();
import { fetchPrice } from "./fetchPrice.js";

const parseArgs = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node script.js <symbol> [color] [timeframe]");
    console.error("Example: node script.js BTC color 1hour");
    console.error("         node script.js BTC 1hour (no color)");
    process.exit(1);
  }

  const symbol = args[0];

  const colorIndex = args.indexOf('color');
  const color = colorIndex !== -1;

  const timeframe = args.find(arg => arg !== 'color' && arg !== symbol) || '1hour';

  const validTimeframes = [
    '1min', '3min', '5min', '15min', '30min',
    '1hour', '2hour', '4hour', '6hour', '8hour', '12hour',
    '1day', '1week'
  ];

  if (!validTimeframes.includes(timeframe)) {
    console.error(`Invalid timeframe: ${timeframe}`);
    console.error(`KuCoin supported timeframes: ${validTimeframes.join(', ')}`);
    process.exit(1);
  }

  return {
    symbol: symbol.toUpperCase(),
    color,
    timeframe
  };
};

export const main = async () => {
  const { symbol, color, timeframe } = parseArgs();

  try {
    await fetchPrice({ selectedTimeframe: timeframe, symbol, color });
  } catch (error) {
    console.log(symbol, "Failed");
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  }
};

main();
