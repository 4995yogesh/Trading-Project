// Generate realistic OHLCV candlestick data

function generateCandlestickData(symbol = 'AAPL', days = 300) {
  const data = [];
  const volumeData = [];
  let basePrice;
  let volatility;

  switch (symbol) {
    case 'AAPL': basePrice = 180; volatility = 2.5; break;
    case 'MSFT': basePrice = 380; volatility = 4; break;
    case 'GOOGL': basePrice = 165; volatility = 3; break;
    case 'AMZN': basePrice = 195; volatility = 3.5; break;
    case 'TSLA': basePrice = 250; volatility = 8; break;
    case 'NVDA': basePrice = 110; volatility = 5; break;
    case 'META': basePrice = 590; volatility = 6; break;
    case 'BTCUSD': basePrice = 95000; volatility = 1500; break;
    case 'ETHUSD': basePrice = 2400; volatility = 80; break;
    case 'EURUSD': basePrice = 1.08; volatility = 0.005; break;
    default: basePrice = 100; volatility = 2; break;
  }

  let currentPrice = basePrice;
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  // Create trend phases
  const trendPhases = [];
  let remainingDays = days;
  while (remainingDays > 0) {
    const phaseDays = Math.min(Math.floor(Math.random() * 40) + 15, remainingDays);
    const direction = Math.random() > 0.45 ? 1 : -1;
    const strength = (Math.random() * 0.3 + 0.1) * direction;
    trendPhases.push({ days: phaseDays, strength });
    remainingDays -= phaseDays;
  }

  let dayIndex = 0;
  let phaseIndex = 0;
  let phaseDayCount = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Skip weekends for stocks
    if (symbol !== 'BTCUSD' && symbol !== 'ETHUSD') {
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;
    }

    const phase = trendPhases[phaseIndex] || { days: 1, strength: 0 };
    phaseDayCount++;
    if (phaseDayCount >= phase.days && phaseIndex < trendPhases.length - 1) {
      phaseIndex++;
      phaseDayCount = 0;
    }

    // Price movement with trend bias
    const trendBias = phase.strength * volatility * 0.15;
    const noise = (Math.random() - 0.5) * volatility * 2;
    const momentum = data.length > 1 ? (data[data.length - 1].close - data[data.length - 1].open) * 0.2 : 0;
    const change = trendBias + noise + momentum;

    const open = currentPrice;
    const close = open + change;
    const highExtra = Math.abs(change) * (Math.random() * 0.8 + 0.2) + volatility * Math.random() * 0.5;
    const lowExtra = Math.abs(change) * (Math.random() * 0.8 + 0.2) + volatility * Math.random() * 0.5;
    const high = Math.max(open, close) + highExtra;
    const low = Math.min(open, close) - lowExtra;

    // Volume - higher on trend days, lower on consolidation
    const baseVolume = symbol === 'BTCUSD' ? 25000 : symbol === 'ETHUSD' ? 15000 : 45000000;
    const volumeMultiplier = 0.5 + Math.random() * 1.5 + Math.abs(change) / volatility * 0.5;
    const volume = Math.floor(baseVolume * volumeMultiplier);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timeStr = `${year}-${month}-${day}`;

    data.push({
      time: timeStr,
      open: Number(open.toFixed(symbol === 'EURUSD' ? 5 : 2)),
      high: Number(high.toFixed(symbol === 'EURUSD' ? 5 : 2)),
      low: Number(low.toFixed(symbol === 'EURUSD' ? 5 : 2)),
      close: Number(close.toFixed(symbol === 'EURUSD' ? 5 : 2)),
    });

    volumeData.push({
      time: timeStr,
      value: volume,
      color: close >= open ? 'rgba(38,166,154,0.5)' : 'rgba(239,83,80,0.5)',
    });

    currentPrice = close;
    dayIndex++;
  }

  return { candleData: data, volumeData };
}

export const symbolInfo = {
  'AAPL': { name: 'Apple Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'MSFT': { name: 'Microsoft Corp', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'GOOGL': { name: 'Alphabet Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'AMZN': { name: 'Amazon.com Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'TSLA': { name: 'Tesla Inc', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'NVDA': { name: 'NVIDIA Corp', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'META': { name: 'Meta Platforms', exchange: 'NASDAQ', type: 'Stock', currency: 'USD' },
  'BTCUSD': { name: 'Bitcoin / USD', exchange: 'Crypto', type: 'Crypto', currency: 'USD' },
  'ETHUSD': { name: 'Ethereum / USD', exchange: 'Crypto', type: 'Crypto', currency: 'USD' },
  'EURUSD': { name: 'EUR / USD', exchange: 'Forex', type: 'Forex', currency: 'USD' },
};

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

// Calculate SMA for overlay
export function calculateSMA(data, period) {
  const smaData = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaData.push({
      time: data[i].time,
      value: Number((sum / period).toFixed(2)),
    });
  }
  return smaData;
}

// Calculate EMA
export function calculateEMA(data, period) {
  const emaData = [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((sum, d) => sum + d.close, 0) / period;

  for (let i = period - 1; i < data.length; i++) {
    if (i === period - 1) {
      ema = data.slice(0, period).reduce((sum, d) => sum + d.close, 0) / period;
    } else {
      ema = data[i].close * k + ema * (1 - k);
    }
    emaData.push({
      time: data[i].time,
      value: Number(ema.toFixed(2)),
    });
  }
  return emaData;
}

// Calculate Bollinger Bands
export function calculateBB(data, period = 20, stdDev = 2) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, d) => sum + d.close, 0) / period;
    const variance = slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / period;
    const std = Math.sqrt(variance);

    middle.push({ time: data[i].time, value: Number(mean.toFixed(2)) });
    upper.push({ time: data[i].time, value: Number((mean + stdDev * std).toFixed(2)) });
    lower.push({ time: data[i].time, value: Number((mean - stdDev * std).toFixed(2)) });
  }

  return { upper, middle, lower };
}

export default generateCandlestickData;
