# Trading Strategy Backtester - Setup Guide

This guide will help you set up and run the Trading Strategy Backtester on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16.x or higher** - [Download Node.js](https://nodejs.org/)
- **pip** (Python package manager, usually comes with Python)
- **npm** (Node package manager, comes with Node.js)

### Verify Installations

Open a terminal/command prompt and run:

```bash
# Check Python version
python --version  # or python3 --version on Mac/Linux

# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## Backend Setup

The backend is built with FastAPI and handles strategy execution and data processing.

### Step 1: Navigate to Backend Directory

```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

You should see `(.venv)` prefix in your terminal prompt.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn (ASGI server)
- pandas & numpy (data processing)
- yfinance (market data)
- beautifulsoup4 (web scraping)
- pydantic (data validation)

### Step 4: Verify Backend Installation

```bash
python -c "import fastapi; import uvicorn; import pandas; print('All packages installed successfully!')"
```

---

## Frontend Setup

The frontend is built with Next.js and React with Tailwind CSS.

### Step 1: Navigate to Frontend Directory

Open a **new terminal window** and run:

```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Next.js framework
- React
- Tailwind CSS
- PostCSS

### Step 3: Verify Frontend Installation

```bash
npm list react next tailwindcss
```

---

## Running the Application

You need to run both the backend and frontend simultaneously.

### Terminal 1: Start Backend Server

```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On Mac/Linux

uvicorn api:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using WatchFiles
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Important:** Keep this terminal running!

### Terminal 2: Start Frontend Server

```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

**Important:** Keep this terminal running too!

### Step 3: Access the Backtester

Open your web browser and go to:

```
http://localhost:8000
```

For the integrated website version, navigate to:

```
file:///C:/Users/HP/Documents/GitHub/Final-website/backtester/index.html
```

Or serve the website with a local server:

```bash
cd C:\Users\HP\Documents\GitHub\Final-website
python -m http.server 8080
```

Then visit: `http://localhost:8080/backtester/`

---

## Quick Start Commands

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
.venv\Scripts\activate
uvicorn api:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
npm run dev
```

### Option 2: Production Build

**Backend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
uvicorn api:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
npm run build
npm start
```

---

## Troubleshooting

### Backend Issues

#### Problem: "Command 'uvicorn' not found"
**Solution:** Make sure virtual environment is activated and uvicorn is installed
```bash
pip install uvicorn
```

#### Problem: "Module not found" errors
**Solution:** Reinstall dependencies
```bash
pip install -r requirements.txt --force-reinstall
```

#### Problem: Port 8000 already in use
**Solution:** Use a different port
```bash
uvicorn api:app --reload --port 8001
```
Then update frontend API calls to use port 8001.

#### Problem: "Failed to fetch S&P 500 tickers"
**Solution:** This is usually a temporary network issue. Wait a moment and try again. The app caches ticker data for 30 days.

---

### Frontend Issues

#### Problem: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH. Reinstall Node.js and restart terminal.

#### Problem: Port 3000 already in use
**Solution:** Kill the process or use a different port
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill

# Or use different port
npm run dev -- -p 3001
```

#### Problem: "Module not found" in browser console
**Solution:** Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json  # Mac/Linux
# or manually delete node_modules folder on Windows
npm install
```

---

### CORS Issues

#### Problem: "CORS policy blocked" errors in browser
**Solution:** Make sure backend is running and CORS is enabled. The backend already has CORS middleware configured for `http://localhost:3000`.

If you're running on a different port, update `api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Performance Issues

#### Problem: Backtest takes too long
**Solution:** Use Quick Test mode (20 stocks instead of 500+)
- Enable "Quick Test Mode" checkbox in the form
- Completes in ~30 seconds vs 2-3 minutes

#### Problem: Data loading is slow
**Solution:** First load always takes longer. Subsequent runs use cached data:
- OHLCV data cached for 7 days
- Ticker lists cached for 30 days
- Cache location: `backend/data_cache/`

To force refresh cache, delete the cache directory or use the `force_refresh` parameter.

---

## Environment Variables (Optional)

Create a `.env` file in the backend directory for configuration:

```env
# Backend Configuration
PORT=8000
HOST=0.0.0.0

# Data Configuration
DATA_CACHE_DIR=./data_cache
TICKER_CACHE_DAYS=30
OHLCV_CACHE_DAYS=7

# API Rate Limiting (if needed)
MAX_CONCURRENT_REQUESTS=10
```

---

## System Requirements

### Minimum Requirements
- **CPU:** Dual-core processor
- **RAM:** 4 GB
- **Storage:** 2 GB free space (for data cache)
- **Internet:** Stable connection for market data

### Recommended Requirements
- **CPU:** Quad-core processor or better
- **RAM:** 8 GB or more
- **Storage:** 5 GB free space
- **Internet:** High-speed connection

---

## Data Usage

The backtester downloads historical market data from Yahoo Finance:

- **Initial download:** ~500 MB (all S&P 500 stocks, 10 years)
- **Cache storage:** Data is stored locally to reduce repeated downloads
- **Network usage:** Minimal after initial download (cache refresh every 7 days)

---

## Security Notes

1. **Strategy Code Execution:** All strategy code runs in a secure sandbox with:
   - No file system access
   - No network access
   - 5-second timeout per execution
   - AST-based validation

2. **Local Development:** This setup is for local development only. For production:
   - Use environment variables for sensitive data
   - Enable authentication
   - Use HTTPS
   - Restrict CORS to specific domains

---

## Next Steps

Once everything is running:

1. **Try a Quick Test:** Use the pre-built RSI strategy with Quick Test mode enabled
2. **Explore Strategy Library:** Click "Browse Library" to see example strategies
3. **Read the User Guide:** Check `USER_GUIDE.md` for detailed usage instructions
4. **Customize Strategies:** Modify example strategies or write your own

---

## Getting Help

If you encounter issues not covered here:

1. Check the browser console (F12) for error messages
2. Check backend terminal for server errors
3. Verify all prerequisites are installed correctly
4. Try restarting both servers
5. Clear browser cache and reload

---

## Updating the Application

To get the latest updates:

**Backend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\backend
git pull
pip install -r requirements.txt --upgrade
```

**Frontend:**
```bash
cd C:\Users\HP\Documents\GitHub\backtester\frontend
git pull
npm install
```

---

*Last updated: November 2024*
