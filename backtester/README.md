# Trading Strategy Backtester Integration

A professional trading strategy backtesting platform integrated into your personal website. Test trading strategies on S&P 500 stocks with 10+ years of historical data.

## Features

### Core Functionality
- **500+ Stocks:** Test across the entire S&P 500 universe
- **10+ Years of Data:** Comprehensive historical market data from Yahoo Finance
- **Real-Time Streaming:** Watch backtest progress live with per-stock results
- **Professional Metrics:** Sharpe ratio, Sortino ratio, max drawdown, win rate, and 20+ more metrics
- **Secure Sandbox:** Safe code execution with AST validation and timeout protection

### New Enhancements

#### 🎨 Enhanced UI/UX
- **Modern Landing Page:** Feature cards, animated status indicators, smooth scrolling
- **Loading States:** Spinner animations, retry buttons, status checking
- **Backend Health Checks:** Automatic connection testing with setup instructions
- **Mobile Responsive:** Optimized for all screen sizes
- **Interactive Elements:** Hover effects, transitions, and visual feedback

#### 📚 Strategy Library
- **5 Pre-Built Strategies:** SMA Crossover, RSI Mean Reversion, Breakout, Bollinger Bands, MACD
- **Categorized Browse:** Filter by strategy type (Trend Following, Mean Reversion, Momentum, Volatility)
- **Search Functionality:** Find strategies by name or description
- **Difficulty Levels:** Beginner, Intermediate, Advanced tags
- **One-Click Load:** Instantly load any strategy into the editor

#### 💾 Export Functionality
- **CSV Export:** Download trade-level data for Excel analysis
- **JSON Export:** Complete results including all metrics
- **Formatted Downloads:** Timestamped filenames, clean formatting

#### 📖 Comprehensive Documentation
- **Setup Guide:** Step-by-step installation and configuration
- **User Guide:** Complete tutorial with examples and best practices
- **API Documentation:** Backend endpoint reference

## Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm

### Installation

**1. Backend Setup:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

**2. Frontend Setup (New Terminal):**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
npm install
npm run dev
```

**3. Access the Application:**
- Standalone: `http://localhost:3000/backtest`
- Integrated: Open `Final-website/backtester/index.html` in browser

## File Structure

```
Final-website/backtester/
├── index.html              # Enhanced landing page with loading states
├── SETUP.md               # Detailed setup instructions
├── USER_GUIDE.md          # Complete user manual
└── README.md              # This file

backtester/
├── backend/
│   ├── api.py            # Enhanced with strategy library endpoint
│   ├── engine.py         # Core backtesting logic
│   ├── sandbox.py        # Secure code execution
│   ├── data_loader.py    # Market data fetching
│   └── models.py         # API request/response schemas
│
└── frontend/
    ├── pages/
    │   └── backtest.js   # Main backtest interface
    ├── components/
    │   ├── BacktestForm.js          # Enhanced with library integration
    │   ├── ResultsDisplay.js        # Added export buttons
    │   ├── StrategyLibrary.js       # NEW: Browse strategies
    │   ├── EquityChart.js
    │   ├── TradeList.js
    │   └── ProgressBar.js
    └── styles/
        └── globals.css
```

## What's New

### Backend Enhancements

#### New API Endpoint: `/api/strategy/library`
Returns a curated library of pre-built trading strategies:

```json
{
  "strategies": [
    {
      "id": "sma_crossover",
      "name": "SMA Crossover",
      "category": "Trend Following",
      "difficulty": "Beginner",
      "description": "Buy when fast MA crosses above slow MA",
      "code": "def strategy(data, state): ...",
      "parameters": { ... }
    },
    ...
  ],
  "count": 5,
  "categories": ["Trend Following", "Mean Reversion", "Momentum", "Volatility"]
}
```

#### Strategy Library Contents

1. **SMA Crossover** (Beginner)
   - 20/50 period moving averages
   - 2% stop-loss, 10% take-profit
   - Best for trending markets

2. **RSI Mean Reversion** (Beginner)
   - RSI < 40 buy, RSI > 60 sell
   - 3% stop-loss, 8% take-profit
   - Best for range-bound markets

3. **Breakout Strategy** (Intermediate)
   - 20-day high breakout
   - ATR-based dynamic stops
   - 2:1 reward-risk ratio

4. **Bollinger Bands** (Beginner)
   - 20-period, 2 std dev bands
   - Mean reversion at band touches
   - Dynamic profit targets

5. **MACD Crossover** (Intermediate)
   - 12/26/9 MACD parameters
   - Momentum-based entries
   - 3% stop-loss, 10% take-profit

### Frontend Enhancements

#### StrategyLibrary Component
- Search and filter strategies
- Category tabs (All, Trend Following, Mean Reversion, etc.)
- Strategy cards with metadata
- One-click strategy selection
- Responsive grid layout

#### BacktestForm Improvements
- "Browse Library" button
- Strategy library modal
- Template loading
- Improved code editor

#### ResultsDisplay Additions
- Export to CSV button
- Export to JSON button
- Formatted file downloads
- Complete data export

### Landing Page Features

#### Feature Cards
- 500+ Stocks
- Real-Time Streaming
- Secure Sandbox

#### Quick Actions
- Start Testing (smooth scroll)
- Check Status (backend health check)

#### Status Banner
- Auto-checking backend connection
- Success/error/warning states
- Setup instructions on failure
- Auto-hide on success

#### Loading States
- Iframe loading spinner
- Retry button after timeout
- Status messages
- Smooth transitions

## Documentation

### [SETUP.md](./SETUP.md)
Complete installation and configuration guide:
- Prerequisites and system requirements
- Step-by-step backend setup
- Step-by-step frontend setup
- Running in development mode
- Running in production mode
- Troubleshooting common issues
- Environment variables
- Performance optimization

### [USER_GUIDE.md](./USER_GUIDE.md)
Comprehensive user manual:
- Introduction to backtesting
- Getting started tutorial
- Strategy library overview
- Writing custom strategies
- Configuration options
- Understanding results
- Best practices
- Common pitfalls
- Multiple examples
- FAQ section

## Usage Examples

### Using the Strategy Library

```javascript
// Frontend code to fetch strategies
const response = await fetch('http://localhost:8000/api/strategy/library');
const data = await response.json();

// Filter by category
const trendStrategies = data.strategies.filter(s => s.category === 'Trend Following');

// Load strategy into editor
setStrategyCode(data.strategies[0].code);
```

### Exporting Results

```javascript
// Export to CSV
const exportToCSV = () => {
  const headers = ['Ticker', 'Entry Date', 'Entry Price', ...];
  const rows = result.sample_trades.map(trade => [...]);
  const csv = [headers, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backtest-trades-${new Date().toISOString()}.csv`;
  link.click();
};

// Export to JSON
const exportToJSON = () => {
  const dataStr = JSON.stringify(result, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  // ... download logic
};
```

### Backend Health Check

```javascript
// Check if backend is running
const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    console.log('Backend status:', data.status);
  } catch (error) {
    console.error('Backend offline');
  }
};
```

## Performance

### Backtest Execution Times

| Mode | Stocks | Time | Use Case |
|------|--------|------|----------|
| Quick Test | 20 | ~30s | Development, debugging |
| Full Backtest | 500+ | 2-3 min | Final validation |

### Data Caching

- **Ticker List:** Cached for 30 days
- **OHLCV Data:** Cached for 7 days
- **Cache Location:** `backend/data_cache/`
- **First Load:** ~500 MB download
- **Subsequent Loads:** < 1 MB (cache hits)

## Technology Stack

### Backend
- **FastAPI:** Modern, fast Python web framework
- **Uvicorn:** ASGI server
- **pandas:** Data manipulation and analysis
- **numpy:** Numerical computing
- **yfinance:** Market data fetching
- **pydantic:** Data validation

### Frontend
- **Next.js:** React framework
- **React:** UI library
- **Tailwind CSS:** Utility-first styling
- **PostCSS:** CSS processing

### Integration
- **iframe:** Embedded application
- **CORS:** Cross-origin resource sharing
- **SSE:** Server-sent events for streaming

## Security Features

- **AST Validation:** Code analysis before execution
- **Sandbox Execution:** Restricted globals and imports
- **Timeout Protection:** 5-second max execution time
- **Memory Limits:** 500MB max memory usage
- **No File Access:** Strategies cannot access filesystem
- **No Network Access:** Strategies cannot make external requests

## API Endpoints

### GET `/api/strategy/library`
Get the library of pre-built strategies.

**Response:**
```json
{
  "strategies": [...],
  "count": 5,
  "categories": [...]
}
```

### POST `/api/backtest`
Run a backtest (non-streaming).

**Request:**
```json
{
  "strategy_code": "def strategy(data, state): ...",
  "start_date": "2014-01-01",
  "end_date": "2024-01-01",
  "initial_capital": 100000,
  ...
}
```

### POST `/api/backtest/stream`
Run a backtest with real-time progress updates.

**Response:** Server-Sent Events (SSE)

### GET `/api/strategy/template`
Get a blank strategy template with documentation.

### GET `/api/universe/sp500`
Get the list of S&P 500 tickers.

### GET `/health`
Health check endpoint.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **Long Positions Only:** Short selling not supported
2. **Daily Data:** Intraday backtesting not available
3. **S&P 500 Only:** Custom ticker lists not yet supported
4. **No Dividends:** Price data only, no dividend adjustments
5. **Local Only:** Not configured for public deployment

## Future Enhancements

- [ ] User authentication and strategy saving
- [ ] Custom ticker lists
- [ ] Intraday backtesting (1h, 15m, 5m intervals)
- [ ] Short selling support
- [ ] Strategy comparison mode
- [ ] Parameter optimization tool
- [ ] Walk-forward analysis
- [ ] Monte Carlo simulations
- [ ] Portfolio-level backtesting
- [ ] Live paper trading

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is available
netstat -ano | findstr :8000

# Use different port
uvicorn api:app --reload --port 8001
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Update `backend/api.py` CORS configuration:
```python
allow_origins=["http://localhost:3000", "YOUR_DOMAIN"]
```

### No Data Loading
- Check internet connection
- Clear cache: Delete `backend/data_cache/`
- Try force refresh: Add `?force_refresh=true` parameter

## Support

For issues or questions:
1. Check [SETUP.md](./SETUP.md) for installation help
2. Check [USER_GUIDE.md](./USER_GUIDE.md) for usage help
3. Review browser console for error messages
4. Check backend terminal for server errors

## License

This project is part of your personal portfolio website.

## Acknowledgments

- Historical data provided by Yahoo Finance via yfinance
- S&P 500 ticker list from Wikipedia
- Built with FastAPI, Next.js, and Tailwind CSS

---

**Version:** 2.0
**Last Updated:** November 2024
**Status:** Production Ready

