# waybar-lazycrypto

A lightweight cryptocurrency price tracker with ASCII candle charts for Waybar status bar. Get real-time crypto prices and visual trend indicators right in your status bar.

![npm version](https://img.shields.io/npm/v/waybar-lazycrypto)
![license](https://img.shields.io/npm/l/waybar-lazycrypto)

<img width="476" height="43" alt="image" src="https://github.com/user-attachments/assets/dce3918d-a6d8-4134-bffd-ce465ec58edb" />

## Features

- 📊 **ASCII Candle Charts** - Visual price trends using ASCII characters
- 💰 **Real-time Prices** - Live cryptocurrency prices from KuCoin API
- 🎨 **Color Support** - Optional color-coded price changes and indicators
- ⏱️ **Multiple Timeframes** - Support for 1min to 1week intervals
- 🚀 **Lightweight** - Minimal dependencies, fast execution
- 🔧 **Waybar Integration** - Designed specifically for Waybar status bar

## Installation

```bash
npm install -g waybar-lazycrypto
```

Or use directly with npx:

```bash
npx waybar-lazycrypto BTC color 1hour
```

## Usage

### Command Line

```bash
waybar-lazycrypto <symbol> [color] [timeframe]
```

**Parameters:**
- `symbol` - Cryptocurrency symbol (BTC, ETH, ADA, DOT, SOL, etc.)
- `color` - Optional. Add "color" to enable colored output
- `timeframe` - Optional. Default: "1hour"

**Examples:**

```bash
# Basic usage
waybar-lazycrypto BTC

# With color support
waybar-lazycrypto BTC color

# With custom timeframe
waybar-lazycrypto ETH color 4hour

# Without color, custom timeframe
waybar-lazycrypto SOL 15min
```

### Supported Timeframes

- **Minutes:** 1min, 3min, 5min, 15min, 30min
- **Hours:** 1hour, 2hour, 4hour, 6hour, 8hour, 12hour
- **Days/Weeks:** 1day, 1week

## Waybar Configuration

Add this to your Waybar config file (`~/.config/waybar/config`):

```json
"custom/lazycrypto": {
    "exec": "npx waybar-lazycrypto BTC color 1hour",
    "interval": 300,
    "format": "{}",
    "return-type": "json",
    "on-click": "$TERMINAL -e npx lazycrypto-cli",
    "signal": 8,
    "on-click-right": "~/.config/waybar/cycle-timeframe.sh && pkill -RTMIN+8 waybar"
}
```

### Dynamic Timeframe Configuration

For dynamic timeframe switching, you can read from a file:

```json
"exec": "npx waybar-lazycrypto BTC color $(cat ~/.crypto-timeframe 2>/dev/null || echo '1hour')"
```

Create a script to cycle through timeframes (`~/.config/waybar/cycle-timeframe.sh`):

```bash
#!/bin/bash
TIMEFRAMES=("15min" "30min" "1hour" "4hour" "1day")
CURRENT=$(cat ~/.crypto-timeframe 2>/dev/null || echo "1hour")

for i in "${!TIMEFRAMES[@]}"; do
    if [[ "${TIMEFRAMES[$i]}" == "$CURRENT" ]]; then
        NEXT_INDEX=$(( (i + 1) % ${#TIMEFRAMES[@]} ))
        echo "${TIMEFRAMES[$NEXT_INDEX]}" > ~/.crypto-timeframe
        break
    fi
done
```

## Output Format

### Standard Output
```
BTC $45,234 +2.45% /\|C\//\\ 1hour
```

### JSON Output (with color flag)
```json
{
  "text": "<span>BTC</span> <span color=\"#ADD777\">$45,234</span> <span color=\"#ADD777\">+2.45%</span> /\\|C\\//\\\\ 1hour",
  "tooltip": "Candle Chart Legend:\nC = Highest close price\nc = Lowest close price\nh = Highest high price\nl = Lowest low price\nT = Highest close and high\nB = Lowest close and low"
}
```

## Candle Chart Indicators

The ASCII candle visualization shows the last 12 candles with special indicators:

- `/` - Price increased from previous candle
- `\` - Price decreased from previous candle
- `|` - Price unchanged
- `C` - Highest closing price in the window
- `c` - Lowest closing price in the window
- `h` - Highest high price in the window
- `l` - Lowest low price in the window
- `T` - Combined highest close and high (peak)
- `B` - Combined lowest close and low (bottom)

## Color Scheme

When color mode is enabled:
- 🟢 Green (`#ADD777`) - Price increases, highs
- 🔴 Red (`#F96D7F`) - Price decreases, lows
- ⚪ Gray (`#94a3b8`) - Neutral/unchanged

## API

### Programmatic Usage

```javascript
import { waybarLazyCrypto } from 'waybar-lazycrypto';

await waybarLazyCrypto({
  symbol: 'BTC',
  selectedTimeframe: '1hour',
  color: true
});
```

## Error Handling

The package handles various error scenarios gracefully:
- **Connection errors** - Shows "₿ Connection Error"
- **Rate limiting** - Shows "₿ Rate Limited"
- **No data** - Shows "Bitcoin No Data"
- **General errors** - Shows "₿ Error"

## Dependencies

- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

## Requirements

- Node.js >= 14.0.0
- Waybar (for status bar integration)
- Internet connection for real-time data

## Data Source

Price data is fetched from the [KuCoin Public API](https://docs.kucoin.com/). No API key required.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © A1GoKn8t

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/yourusername/waybar-lazycrypto).

## Changelog

### v0.0.2
- Added color support for Waybar JSON output
- Improved candle chart visualization
- Enhanced error handling

### v0.0.1
- Initial release
- Basic price tracking functionality
- ASCII candle charts
