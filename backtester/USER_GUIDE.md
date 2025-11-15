# Trading Strategy Backtester - User Guide

Welcome to the Trading Strategy Backtester! This guide will help you understand how to use the platform to test and optimize your trading strategies.

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Strategy Library](#strategy-library)
4. [Writing Custom Strategies](#writing-custom-strategies)
5. [Configuration Options](#configuration-options)
6. [Understanding Results](#understanding-results)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

---

## Introduction

### What is Backtesting?

Backtesting is the process of testing a trading strategy using historical data to see how it would have performed. This helps you:

- **Validate Strategy Logic:** Ensure your strategy works as intended
- **Measure Performance:** Get concrete metrics like returns, risk, and drawdowns
- **Optimize Parameters:** Find the best settings for your strategy
- **Build Confidence:** Understand your strategy's behavior before risking real money

### Key Features

✅ **500+ Stocks:** Test across the entire S&P 500 universe
✅ **10+ Years of Data:** Comprehensive historical market data
✅ **Real-Time Streaming:** Watch results as they're computed
✅ **Pre-Built Strategies:** Start with proven strategy templates
✅ **Secure Execution:** Sandboxed code execution for safety
✅ **Export Results:** Download data in CSV or JSON format

---

## Getting Started

### Step 1: Access the Backtester

Navigate to the backtester page in your web browser. You should see:

- **Strategy Code Editor** (left side)
- **Results Panel** (right side)
- **Configuration Options** (below code editor)

### Step 2: Choose a Strategy

You have three options:

1. **Use the Default Strategy** - A simple RSI mean reversion strategy is pre-loaded
2. **Browse Strategy Library** - Click "Browse Library" to see pre-built examples
3. **Write Your Own** - Code a custom strategy from scratch

### Step 3: Configure Parameters

Set your backtest parameters:

- **Start Date:** When to begin testing (e.g., 2014-01-01)
- **End Date:** When to end testing (e.g., 2024-01-01)
- **Initial Capital:** Starting money (e.g., $100,000)
- **Position Size:** How much to invest per trade (0.1 = 10% of capital)

### Step 4: Run the Backtest

Click **"Run Quick Test"** for a fast test on 20 stocks (~30 seconds)
OR
Click **"Run Full Backtest"** to test all 500+ stocks (~2-3 minutes)

### Step 5: Analyze Results

View your results in multiple tabs:

- **Summary Statistics:** Key performance metrics
- **Equity Curve:** Visual representation of portfolio growth
- **Per-Stock Results:** Performance breakdown by ticker
- **Trade List:** Detailed log of all trades

---

## Strategy Library

### Accessing the Library

Click **"Browse Library"** in the strategy code editor section.

### Available Strategies

#### 1. SMA Crossover (Trend Following - Beginner)

**Description:** Buy when fast MA crosses above slow MA, sell when it crosses below

**Parameters:**
- Fast Period: 20 days
- Slow Period: 50 days
- Stop Loss: 2%
- Take Profit: 10%

**Best For:** Trending markets, medium-term trades

---

#### 2. RSI Mean Reversion (Mean Reversion - Beginner)

**Description:** Buy oversold conditions (RSI < 40), sell overbought (RSI > 60)

**Parameters:**
- RSI Period: 14
- Oversold: 40
- Overbought: 60
- Stop Loss: 3%
- Take Profit: 8%

**Best For:** Range-bound markets, short-term trades

---

#### 3. Breakout Strategy (Momentum - Intermediate)

**Description:** Buy when price breaks above 20-day high with ATR-based stops

**Parameters:**
- Lookback Period: 20 days
- ATR Period: 14
- ATR Multiplier: 2x
- Reward:Risk: 2:1

**Best For:** Volatile markets, breakout trades

---

#### 4. Bollinger Bands (Volatility - Beginner)

**Description:** Buy at lower band, sell at upper band

**Parameters:**
- Period: 20 days
- Standard Deviations: 2
- Stop Loss: 3%

**Best For:** Mean-reverting markets, volatility plays

---

#### 5. MACD Crossover (Momentum - Intermediate)

**Description:** Buy when MACD crosses above signal line

**Parameters:**
- Fast Period: 12
- Slow Period: 26
- Signal Period: 9
- Stop Loss: 3%
- Take Profit: 10%

**Best For:** Trending markets, momentum trades

---

### Using Library Strategies

1. Click "Browse Library"
2. Filter by category (Trend Following, Mean Reversion, Momentum, Volatility)
3. Search by name or description
4. Click on a strategy card to load it into the editor
5. Customize parameters if desired
6. Run the backtest

---

## Writing Custom Strategies

### Strategy Function Structure

Every strategy must define a `strategy` function:

```python
def strategy(data, state):
    """
    Your strategy logic here

    Args:
        data: pandas DataFrame with OHLCV columns
        state: dict for persisting variables

    Returns:
        dict with signal and optional parameters
    """
    # Your code here
    return {'signal': 'buy'}  # or 'sell' or None
```

### Available Data

The `data` DataFrame contains:

| Column | Description |
|--------|-------------|
| `open` | Opening price |
| `high` | Highest price of the day |
| `low` | Lowest price of the day |
| `close` | Closing price |
| `volume` | Trading volume |

**Index:** DatetimeIndex with daily dates

### Pre-Loaded Modules

No need to import these - they're already available:

- `pd` / `pandas` - For data manipulation
- `np` / `numpy` - For numerical operations
- `math` - Standard math functions
- `datetime` - Date/time utilities

### Signal Types

Return a dictionary with a `signal` key:

```python
# Buy signal
return {'signal': 'buy'}

# Sell signal
return {'signal': 'sell'}

# No action (hold or wait)
return {'signal': None}

# Flatten position
return {'signal': 'flat'}
```

### Risk Management

Add stop-loss and take-profit levels:

```python
return {
    'signal': 'buy',
    'stop_loss': 0.98,      # Exit if price drops 2% (multiply by 0.98)
    'take_profit': 1.10     # Exit if price rises 10% (multiply by 1.10)
}
```

**Multiplier Format:**
- `0.98` = 2% below entry price
- `1.05` = 5% above entry price

**Absolute Price Format:**
```python
current_price = data['close'].iloc[-1]
return {
    'signal': 'buy',
    'stop_loss': current_price * 0.97,     # 3% stop
    'take_profit': current_price * 1.08    # 8% target
}
```

### Using State

Persist variables between function calls:

```python
def strategy(data, state):
    # Initialize on first call
    if 'previous_close' not in state:
        state['previous_close'] = data['close'].iloc[-1]
        return {'signal': None}

    # Use previous state
    prev = state['previous_close']
    curr = data['close'].iloc[-1]

    # Update state
    state['previous_close'] = curr

    # Generate signal
    if curr > prev * 1.02:  # 2% increase
        return {'signal': 'buy'}

    return {'signal': None}
```

### Example: Simple Moving Average Strategy

```python
def strategy(data, state):
    """
    Buy when price crosses above 50-day SMA
    Sell when it crosses below
    """
    close = data['close'].values

    # Need enough data
    if len(close) < 50:
        return {'signal': None}

    # Calculate SMA
    sma_50 = pd.Series(close).rolling(50).mean().iloc[-1]
    current_price = close[-1]

    # Track previous price for crossover detection
    if 'prev_price' not in state:
        state['prev_price'] = current_price
        state['prev_sma'] = sma_50
        return {'signal': None}

    prev_price = state['prev_price']
    prev_sma = state['prev_sma']

    # Update state
    state['prev_price'] = current_price
    state['prev_sma'] = sma_50

    # Detect crossover
    if prev_price <= prev_sma and current_price > sma_50:
        # Bullish crossover
        return {
            'signal': 'buy',
            'stop_loss': 0.97,
            'take_profit': 1.10
        }
    elif prev_price >= prev_sma and current_price < sma_50:
        # Bearish crossover
        return {'signal': 'sell'}

    return {'signal': None}
```

---

## Configuration Options

### Basic Configuration

#### Start Date / End Date
- **Format:** YYYY-MM-DD (e.g., 2020-01-01)
- **Recommendation:** At least 2-3 years for reliable results
- **Maximum:** ~15 years of historical data available

#### Initial Capital
- **Default:** $100,000
- **Minimum:** $1,000
- **Recommendation:** Use realistic capital amounts ($10,000 - $1,000,000)

#### Position Size
- **Range:** 0.01 to 1.0 (1% to 100% of capital)
- **Default:** 0.1 (10%)
- **Recommendation:**
  - Conservative: 0.05 - 0.10 (5-10%)
  - Moderate: 0.10 - 0.20 (10-20%)
  - Aggressive: 0.20 - 0.50 (20-50%)

### Advanced Configuration

Click **"Advanced Settings"** to reveal:

#### Max Positions
- **Default:** 10
- **Description:** Maximum number of concurrent open positions
- **Recommendation:** 5-20 for diversification

#### Commission
- **Default:** 0.001 (0.1%)
- **Description:** Trading fee per trade
- **Typical Values:**
  - Interactive Brokers: 0.0005 (0.05%)
  - Robinhood: 0 (free)
  - Traditional Broker: 0.005 (0.5%)

#### Slippage
- **Default:** 0.0005 (0.05%)
- **Description:** Expected price movement between signal and execution
- **Recommendation:**
  - Liquid stocks: 0.0001 - 0.0005
  - Illiquid stocks: 0.001 - 0.005

### Quick Test Mode

Enable for faster testing:
- Tests only 20 stocks (vs 500+)
- Completes in ~30 seconds
- Useful for:
  - Initial strategy validation
  - Parameter testing
  - Debugging code

---

## Understanding Results

### Key Performance Metrics

#### Returns

**Total Return**
- Absolute profit/loss in dollars
- Formula: `Final Equity - Initial Capital`

**Total Return %**
- Percentage gain/loss
- Formula: `(Final - Initial) / Initial × 100`

**CAGR (Compound Annual Growth Rate)**
- Annualized return over the entire period
- Better for comparing different time periods
- Formula: `((Final / Initial) ^ (1 / Years)) - 1`

#### Risk-Adjusted Metrics

**Sharpe Ratio**
- Measures return per unit of risk
- Interpretation:
  - < 1.0: Poor
  - 1.0 - 2.0: Good
  - > 2.0: Excellent
- Formula: `(Return - Risk-Free Rate) / Volatility`

**Sortino Ratio**
- Like Sharpe, but only penalizes downside volatility
- Generally higher than Sharpe Ratio
- Interpretation: Same as Sharpe

**Maximum Drawdown**
- Largest peak-to-trough decline
- Shows worst-case scenario
- Example: -25% means portfolio lost 25% from its peak

#### Trade Statistics

**Total Trades**
- Number of round-trip trades executed

**Win Rate**
- Percentage of profitable trades
- Formula: `Winning Trades / Total Trades`
- Good: > 50%, Excellent: > 60%

**Profit Factor**
- Ratio of gross profit to gross loss
- Interpretation:
  - < 1.0: Losing strategy
  - 1.0 - 1.5: Marginal
  - > 1.5: Strong
  - > 2.0: Excellent

**Average Win / Average Loss**
- Average profit per winning trade
- Average loss per losing trade
- Ratio > 1.5 is ideal

### Equity Curve

Visual representation of portfolio value over time:

- **Upward Slope:** Strategy is profitable
- **Smooth Curve:** Consistent performance
- **Volatile Curve:** High risk, unstable returns
- **Drawdown Periods:** Shaded areas showing losses

### Trade List

Detailed log of all trades showing:

- **Ticker:** Stock symbol
- **Entry Date:** When position was opened
- **Entry Price:** Purchase price
- **Exit Date:** When position was closed
- **Exit Price:** Sale price
- **P&L:** Profit/Loss in dollars
- **P&L %:** Profit/Loss percentage
- **Exit Reason:** Why trade closed (signal, stop-loss, take-profit)

### Per-Stock Results

Shows performance by individual stock:

- **Total P&L:** Aggregate profit/loss per ticker
- **Win Rate:** Success rate for that stock
- **Number of Trades:** How many times the stock was traded
- **Best Trade:** Largest winning trade
- **Worst Trade:** Largest losing trade

---

## Best Practices

### Strategy Development

1. **Start Simple**
   - Begin with basic indicators (MA, RSI, MACD)
   - Add complexity gradually
   - Avoid over-optimization

2. **Use Quick Test Mode**
   - Validate logic quickly with 20 stocks
   - Run full backtest only when strategy looks promising

3. **Test Multiple Time Periods**
   - Bull markets: 2013-2020
   - Bear markets: 2008-2009, 2022
   - Mixed markets: 2010-2015

4. **Consider Transaction Costs**
   - Always include realistic commission and slippage
   - High-frequency strategies are more sensitive to costs

5. **Implement Risk Management**
   - Always use stop-losses
   - Limit position sizes (5-20% per trade)
   - Set max concurrent positions

### Interpreting Results

1. **Look Beyond Returns**
   - High returns with high drawdowns = risky
   - Moderate returns with low drawdowns = stable

2. **Check Consistency**
   - Winning trades spread throughout time period
   - Not all profits from one lucky trade
   - Stable month-over-month performance

3. **Validate Assumptions**
   - Are results realistic?
   - Could you actually execute these trades?
   - Does strategy make logical sense?

4. **Beware Over-Fitting**
   - Perfect results often mean over-optimization
   - Strategy might not work in live trading
   - Test on different time periods

### Common Pitfalls

❌ **Curve Fitting:** Optimizing too much for historical data
❌ **Look-Ahead Bias:** Using future information in your strategy
❌ **Survivorship Bias:** Only testing on stocks that survived
❌ **Ignoring Costs:** Not accounting for commissions and slippage
❌ **Unrealistic Assumptions:** Assuming perfect fills at desired prices

---

## Examples

### Example 1: Conservative Buy-and-Hold

```python
def strategy(data, state):
    """
    Buy on first day and hold. Simple benchmark strategy.
    """
    # Buy once at the beginning
    if 'bought' not in state:
        state['bought'] = True
        return {'signal': 'buy'}

    # Hold forever
    return {'signal': None}
```

**Expected Results:**
- Similar to S&P 500 index returns
- Low drawdowns
- Long holding periods

---

### Example 2: Momentum with Volume Confirmation

```python
def strategy(data, state):
    """
    Buy when price is up 5% AND volume is above average
    """
    if len(data) < 30:
        return {'signal': None}

    close = data['close'].values
    volume = data['volume'].values

    # Calculate metrics
    price_change = (close[-1] / close[-2]) - 1
    avg_volume = np.mean(volume[-20:])
    current_volume = volume[-1]

    has_position = state.get('has_position', False)

    if not has_position:
        # Enter on strong momentum with high volume
        if price_change > 0.05 and current_volume > avg_volume * 1.5:
            state['has_position'] = True
            return {
                'signal': 'buy',
                'stop_loss': 0.95,      # 5% stop
                'take_profit': 1.15     # 15% target
            }
    else:
        # Exit on weakness
        if price_change < -0.03:  # 3% drop
            state['has_position'] = False
            return {'signal': 'sell'}

    return {'signal': None}
```

---

### Example 3: Mean Reversion with Dynamic Stops

```python
def strategy(data, state):
    """
    Buy oversold stocks with ATR-based stops
    """
    if len(data) < 30:
        return {'signal': None}

    close = data['close'].values
    high = data['high'].values
    low = data['low'].values

    # RSI calculation
    delta = pd.Series(close).diff()
    gain = delta.where(delta > 0, 0).rolling(14).mean()
    loss = -delta.where(delta < 0, 0).rolling(14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    current_rsi = rsi.iloc[-1]

    # ATR calculation
    high_series = pd.Series(high)
    low_series = pd.Series(low)
    close_series = pd.Series(close)

    tr1 = high_series - low_series
    tr2 = abs(high_series - close_series.shift(1))
    tr3 = abs(low_series - close_series.shift(1))
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(14).mean().iloc[-1]

    current_price = close[-1]
    has_position = state.get('has_position', False)

    if not has_position and current_rsi < 30:
        # Oversold - buy with ATR-based stop
        stop_distance = 2 * atr
        target_distance = 3 * atr  # 1.5:1 reward:risk

        state['has_position'] = True
        return {
            'signal': 'buy',
            'stop_loss': (current_price - stop_distance) / current_price,
            'take_profit': (current_price + target_distance) / current_price
        }
    elif has_position and current_rsi > 65:
        # Exit on overbought
        state['has_position'] = False
        return {'signal': 'sell'}

    return {'signal': None}
```

---

## Export and Analysis

### Exporting Results

After a backtest completes:

1. **Export to CSV**
   - Click "Export CSV" button
   - Downloads trade-level data
   - Open in Excel for further analysis

2. **Export to JSON**
   - Click "Export JSON" button
   - Downloads complete results including metrics
   - Use for programmatic analysis or record-keeping

### External Analysis

Use exported data for:

- Detailed trade analysis in Excel
- Custom visualizations in Python/R
- Portfolio construction
- Strategy comparison
- Risk analysis

---

## Frequently Asked Questions

**Q: How much historical data is available?**
A: Approximately 10-15 years, depending on the stock. Data is sourced from Yahoo Finance.

**Q: Can I test on stocks other than S&P 500?**
A: Currently only S&P 500 is supported. Custom ticker lists may be added in the future.

**Q: Are dividends included?**
A: No, the backtest uses price data only without dividend adjustments.

**Q: Can I short stocks?**
A: Currently only long positions are supported. Short selling may be added later.

**Q: How accurate are the results?**
A: Results are based on historical closing prices with configurable slippage and commission. Real trading results may vary due to execution quality, market impact, and other factors.

**Q: Can I save my strategies?**
A: Currently strategies are not saved automatically. Copy your code to a text file for safekeeping. User accounts with strategy saving may be added in the future.

**Q: What if my strategy doesn't produce any trades?**
A: Check your logic - you might be using conditions that are never met. Try the Quick Test mode to debug faster.

**Q: How do I optimize parameters?**
A: Run multiple backtests with different parameter values and compare results. Look for robust parameters that work well across different time periods.

---

## Next Steps

1. **Try the Examples:** Start with pre-built strategies from the library
2. **Experiment:** Modify parameters and see how results change
3. **Build Your Own:** Create a custom strategy from scratch
4. **Test Thoroughly:** Run on multiple time periods
5. **Paper Trade:** Test live (without real money) before going live
6. **Keep Learning:** Study successful strategies and trading principles

---

*Happy backtesting! Remember: Past performance does not guarantee future results.*

*Last updated: November 2024*
