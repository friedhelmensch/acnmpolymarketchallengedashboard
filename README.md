# 🏆 ACNM Polymarket Leaderboard

A real-time dashboard tracking the latest performance data for the Polymarket trading challenge hosted by the "Alles Coin Nichts Muss" podcast.

## 🎯 What it does

This project provides a live leaderboard showing PNL (Profit & Loss) performance for all participants in the trading challenge. Users are ranked by their percentage gains/losses, with real-time data fetched directly from Polymarket's APIs.

## 🏗️ Architecture

**Frontend**: Vanilla HTML/CSS/JavaScript with a clean, responsive design  
**Backend**: Node.js serverless functions handling wallet analysis  
**Hosting**: Deployed on Vercel with automatic updates  

## ⚡ Key Features

- **Real-time PNL tracking** - Live data from Polymarket APIs
- **Performance ranking** - Users sorted by percentage returns
- **Mobile responsive** - Works seamlessly on all devices
- **Error handling** - Graceful fallbacks for API issues

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd polymarketdashboard
   ```

2. **Set up environment variables**
   ```bash
   cp example.env .env
   # Edit .env with your user configuration
   ```

3. **Install dependencies**
   ```bash
   cd api
   npm install
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Deploy to Vercel**
   ```bash
   vercel
   ```

## 📊 API Endpoints

- `GET /api/endpoints/ranking` - Returns current leaderboard data with user rankings and PNL statistics

## 🧪 Testing

The project includes comprehensive tests for the core PNL calculation service:

```bash
cd api
npm test
```

## 🔧 Configuration

User configuration is managed through environment variables. See [`example.env`](example.env) for the required format.

## 📱 Live Dashboard

The dashboard automatically refreshes and provides:
- Current rankings by PNL percentage
- Profit/loss status indicators  
- Initial deposit vs current performance
- Mobile-optimized interface

---

Built for the ACNM community 🎙️