# Quick Start Guide - Single Stock Backtester

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt  # If not already installed
uvicorn api:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Keep this terminal running!**

### Step 2: Open the Single Stock Backtester

Open in your browser:
```
file:///C:/Users/HP/Documents/GitHub/Final-website/backtester/single-stock.html
```

Or if you're serving the website:
```
http://localhost:8080/backtester/single-stock.html
```

### Step 3: Run Your First Backtest

1. **Select a stock** (e.g., AAPL)
2. **Choose dates** (default: 2020-2024)
3. **Set capital** (default: $10,000)
4. **Use the default strategy** (RSI mean reversion) or write your own
5. **Click "Run Backtest"**

Results appear in 5-10 seconds! ⚡

---

## 📝 Writing Your Own Strategy

The strategy function receives:
- `data`: pandas DataFrame with OHLCV columns
- `state`: dict for persisting variables

Return a signal:
```python
return {'signal': 'buy'}   # Buy signal
return {'signal': 'sell'}  # Sell signal
return {'signal': None}    # No action
```

### Example: Simple Moving Average Crossover

```python
def strategy(data, state):
    close = data['close'].values
    
    if len(close) < 50:
        return {'signal': None}
    
    # Calculate moving averages
    sma_20 = pd.Series(close).rolling(20).mean().iloc[-1]
    sma_50 = pd.Series(close).rolling(50).mean().iloc[-1]
    current_price = close[-1]
    
    # Track previous state for crossover detection
    if 'prev_sma_20' not in state:
        state['prev_sma_20'] = sma_20
        state['prev_sma_50'] = sma_50
        return {'signal': None}
    
    prev_sma_20 = state['prev_sma_20']
    prev_sma_50 = state['prev_sma_50']
    
    # Update state
    state['prev_sma_20'] = sma_20
    state['prev_sma_50'] = sma_50
    
    # Detect crossover
    if prev_sma_20 <= prev_sma_50 and sma_20 > sma_50:
        # Bullish crossover - buy
        return {
            'signal': 'buy',
            'stop_loss': 0.97,      # 3% stop loss
            'take_profit': 1.10     # 10% take profit
        }
    elif prev_sma_20 >= prev_sma_50 and sma_20 < sma_50:
        # Bearish crossover - sell
        return {'signal': 'sell'}
    
    return {'signal': None}
```

---

## 🎯 Understanding Results

### Key Metrics

- **Total Return**: Profit/loss in dollars and percentage
- **CAGR**: Annualized return (better for comparing different time periods)
- **Sharpe Ratio**: Risk-adjusted return (higher is better, >1 is good)
- **Max Drawdown**: Worst peak-to-trough decline
- **Win Rate**: Percentage of profitable trades
- **Profit Factor**: Gross profit / Gross loss (>1.5 is good)

### What Makes a Good Strategy?

✅ **Consistent returns** across different time periods
✅ **High Sharpe ratio** (>1.5)
✅ **Low max drawdown** (<20%)
✅ **Good win rate** (>50%) OR high profit factor (>2.0)
✅ **Reasonable number of trades** (not too few, not too many)

---

## 💡 Tips for Small Traders

1. **Start Simple**: Begin with basic indicators (MA, RSI, MACD)
2. **Test Multiple Stocks**: Try your strategy on different stocks
3. **Use Stop Losses**: Always include risk management
4. **Test Different Time Periods**: Bull markets, bear markets, mixed
5. **Keep It Realistic**: High returns with high drawdowns = risky

---

## 🐛 Troubleshooting

### "Error loading stocks"
- **Solution**: Make sure backend is running on port 8000
- Check: `http://localhost:8000/health` should return `{"status": "healthy"}`

### "Failed to run backtest"
- **Check your strategy code**: Make sure it's valid Python
- **Check dates**: End date must be after start date
- **Check browser console**: Look for detailed error messages

### Backtest takes too long
- Single stock should complete in 5-10 seconds
- If it's taking longer, check backend logs
- First run downloads data (may take 30-60 seconds)

---

## 📚 Next Steps

- Try different strategies from the examples
- Test on multiple stocks
- Experiment with different parameters
- Read the full [USER_GUIDE.md](./USER_GUIDE.md) for advanced features

---

**Happy Backtesting!** 🚀

