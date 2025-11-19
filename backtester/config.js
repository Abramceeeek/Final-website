const BACKTESTER_CONFIG = {
  API_URL: 'https://backtester-ukxz.onrender.com',
  FRONTEND_URL: 'http://localhost:3000',
  REQUEST_TIMEOUT: 60000,
  BACKTEST_TIMEOUT: 300000,
  ENABLE_SINGLE_STOCK: true,
  ENABLE_FULL_PORTFOLIO: true,
  POPULAR_STOCKS: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'MA', 'UNH', 'HD']
};

if (typeof window !== 'undefined') {
  window.BACKTESTER_CONFIG = BACKTESTER_CONFIG;
}

