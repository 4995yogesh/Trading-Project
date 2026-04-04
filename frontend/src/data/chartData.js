// Generate realistic OHLCV candlestick data with timeframe support

const SYMBOL_CONFIG = {
  'AAPL': { basePrice: 180, volatility: 2.5, name: 'Apple Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'MSFT': { basePrice: 380, volatility: 4, name: 'Microsoft Corp', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'GOOGL': { basePrice: 165, volatility: 3, name: 'Alphabet Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'AMZN': { basePrice: 195, volatility: 3.5, name: 'Amazon.com Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'TSLA': { basePrice: 250, volatility: 8, name: 'Tesla Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'NVDA': { basePrice: 110, volatility: 5, name: 'NVIDIA Corp', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'META': { basePrice: 590, volatility: 6, name: 'Meta Platforms', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'BTCUSD': { basePrice: 95000, volatility: 1500, name: 'Bitcoin / USD', exchange: 'Crypto', type: 'Crypto', currency: 'USD' },
  'ETHUSD': { basePrice: 2400, volatility: 80, name: 'Ethereum / USD', exchange: 'Crypto', type: 'Crypto', currency: 'USD' },
  'EURUSD': { basePrice: 1.08, volatility: 0.005, name: 'EUR / USD', exchange: 'Forex', type: 'Forex', currency: 'USD' },
};

// Timeframe config: bars to generate, interval in minutes
const TF_CONFIG = {
  '1m':  { bars: 500, intervalMin: 1, useTimestamp: true },
  '5m':  { bars: 500, intervalMin: 5, useTimestamp: true },
  '15m': { bars: 400, intervalMin: 15, useTimestamp: true },
  '30m': { bars: 350, intervalMin: 30, useTimestamp: true },
  '1h':  { bars: 300, intervalMin: 60, useTimestamp: true },
  '4h':  { bars: 250, intervalMin: 240, useTimestamp: true },
  '1d':  { bars: 300, intervalMin: 1440, useTimestamp: false },
  '1w':  { bars: 200, intervalMin: 10080, useTimestamp: false },
  '1M':  { bars: 120, intervalMin: 43200, useTimestamp: false },
};

function generateCandlestickData(symbol = 'AAPL', days = 300, timeframe = '1d') {
  const config = SYMBOL_CONFIG[symbol] || { basePrice: 100, volatility: 2 };
  const tfConfig = TF_CONFIG[timeframe] || TF_CONFIG['1d'];
  const bars = tfConfig.bars;
  const intervalMin = tfConfig.intervalMin;
  const useTimestamp = tfConfig.useTimestamp;
  const isCrypto = symbol === 'BTCUSD' || symbol === 'ETHUSD';
  const isForex = symbol === 'EURUSD';
  const decimals = isForex ? 5 : 2;

  let { basePrice, volatility } = config;

  // Scale volatility by timeframe
  const tfVolScale = Math.sqrt(intervalMin / 1440);
  volatility = volatility * (tfVolScale || 1);

  const data = [];
  const volumeData = [];
  let currentPrice = basePrice;

  const now = new Date();
  // Calculate start time
  const totalMinutes = bars * intervalMin;
  const startTime = new Date(now.getTime() - totalMinutes * 60000);

  // Trend phases
  const trendPhases = [];
  let remaining = bars;
  while (remaining > 0) {
    const len = Math.min(Math.floor(Math.random() * 40) + 10, remaining);
    const dir = Math.random() > 0.45 ? 1 : -1;
    const str = (Math.random() * 0.3 + 0.1) * dir;
    trendPhases.push({ len, str });
    remaining -= len;
  }

  let phaseIdx = 0, phaseCnt = 0;

  for (let i = 0; i < bars; i++) {
    const barTime = new Date(startTime.getTime() + i * intervalMin * 60000);

    // Skip weekends for non-crypto
    if (!isCrypto && !useTimestamp) {
      const dow = barTime.getDay();
      if (dow === 0 || dow === 6) continue;
    }

    const phase = trendPhases[phaseIdx] || { len: 1, str: 0 };
    phaseCnt++;
    if (phaseCnt >= phase.len && phaseIdx < trendPhases.length - 1) {
      phaseIdx++; phaseCnt = 0;
    }

    const trendBias = phase.str * volatility * 0.15;
    const noise = (Math.random() - 0.5) * volatility * 2;
    const momentum = data.length > 1 ? (data[data.length - 1].close - data[data.length - 1].open) * 0.15 : 0;
    const change = trendBias + noise + momentum;

    const open = currentPrice;
    const close = open + change;
    const highExtra = Math.abs(change) * (Math.random() * 0.8 + 0.2) + volatility * Math.random() * 0.5;
    const lowExtra = Math.abs(change) * (Math.random() * 0.8 + 0.2) + volatility * Math.random() * 0.5;
    const high = Math.max(open, close) + highExtra;
    const low = Math.min(open, close) - lowExtra;

    const baseVolume = isCrypto ? 25000 : 45000000;
    const volMult = 0.5 + Math.random() * 1.5 + Math.abs(change) / volatility * 0.5;
    const volume = Math.floor(baseVolume * volMult * (tfVolScale || 1));

    let time;
    if (useTimestamp) {
      time = Math.floor(barTime.getTime() / 1000);
    } else {
      const y = barTime.getFullYear();
      const m = String(barTime.getMonth() + 1).padStart(2, '0');
      const d = String(barTime.getDate()).padStart(2, '0');
      time = `${y}-${m}-${d}`;
    }

    data.push({
      time,
      open: Number(open.toFixed(decimals)),
      high: Number(high.toFixed(decimals)),
      low: Number(low.toFixed(decimals)),
      close: Number(close.toFixed(decimals)),
    });

    volumeData.push({
      time,
      value: volume,
      color: close >= open ? 'rgba(38,166,154,0.5)' : 'rgba(239,83,80,0.5)',
    });

    currentPrice = close;
  }

  return { candleData: data, volumeData };
}

export const symbolInfo = Object.fromEntries(
  Object.entries(SYMBOL_CONFIG).map(([k, v]) => [k, { name: v.name, exchange: v.exchange, type: v.type, currency: v.currency }])
);

export const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

export const indicators = [
  { name: 'SMA', label: 'Simple Moving Average', category: 'Trend' },
  { name: 'EMA', label: 'Exponential Moving Average', category: 'Trend' },
  { name: 'BB', label: 'Bollinger Bands', category: 'Volatility' },
  { name: 'RSI', label: 'Relative Strength Index', category: 'Oscillator' },
  { name: 'MACD', label: 'MACD', category: 'Oscillator' },
  { name: 'VWAP', label: 'Volume Weighted Avg Price', category: 'Volume' },
  { name: 'ATR', label: 'Average True Range', category: 'Volatility' },
  { name: 'Stoch', label: 'Stochastic', category: 'Oscillator' },
  { name: 'Ichimoku', label: 'Ichimoku Cloud', category: 'Trend' },
  { name: 'PSAR', label: 'Parabolic SAR', category: 'Trend' },
];

export function calculateSMA(data, period) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: Number((sum / period).toFixed(2)) });
  }
  return result;
}

export function calculateEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
  for (let i = period - 1; i < data.length; i++) {
    if (i === period - 1) ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
    else ema = data[i].close * k + ema * (1 - k);
    result.push({ time: data[i].time, value: Number(ema.toFixed(2)) });
  }
  return result;
}

export function calculateBB(data, period = 20, stdDev = 2) {
  const upper = [], middle = [], lower = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((s, d) => s + d.close, 0) / period;
    const variance = slice.reduce((s, d) => s + Math.pow(d.close - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    middle.push({ time: data[i].time, value: Number(mean.toFixed(2)) });
    upper.push({ time: data[i].time, value: Number((mean + stdDev * std).toFixed(2)) });
    lower.push({ time: data[i].time, value: Number((mean - stdDev * std).toFixed(2)) });
  }
  return { upper, middle, lower };
}

export default generateCandlestickData;
