import React, { useState, useCallback } from 'react';
import { ArrowLeft, PanelRightOpen, PanelRightClose, List, Clock, ChevronDown, Plus, MoreHorizontal, Grid3X3, Pencil, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChartWidget from './ChartWidget';
import ChartToolbar from './ChartToolbar';
import DrawingTools from './DrawingTools';
import { symbolInfo } from '../../data/chartData';

const watchlistItems = [
  { symbol: 'AAPL', price: '248.80', change: '-4.09', changePct: '-1.62%', isUp: false },
  { symbol: 'TSLA', price: '271.85', change: '+9.18', changePct: '+3.50%', isUp: true },
  { symbol: 'NVDA', price: '113.76', change: '-2.44', changePct: '-2.10%', isUp: false },
  { symbol: 'MSFT', price: '383.67', change: '-3.37', changePct: '-0.87%', isUp: false },
  { symbol: 'AMZN', price: '199.34', change: '-8.20', changePct: '-3.95%', isUp: false },
  { symbol: 'META', price: '596.25', change: '-7.42', changePct: '-1.23%', isUp: false },
  { symbol: 'GOOGL', price: '167.89', change: '-1.61', changePct: '-0.95%', isUp: false },
  { symbol: 'BTCUSD', price: '104,387', change: '+2,216', changePct: '+2.17%', isUp: true },
  { symbol: 'ETHUSD', price: '2,645.3', change: '+80.9', changePct: '+3.16%', isUp: true },
  { symbol: 'EURUSD', price: '1.08142', change: '+0.001', changePct: '+0.09%', isUp: true },
];

// Right panel sidebar icons matching TradingView
const rightSideIcons = [
  { id: 'watchlist', icon: List, label: 'Watchlist' },
  { id: 'details', icon: Clock, label: 'Symbol Info' },
];

const ChartPage = () => {
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1d');
  const [chartType, setChartType] = useState('candle');
  const [activeIndicators, setActiveIndicators] = useState([]);
  const [activeTool, setActiveTool] = useState('cursor');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [rightTab, setRightTab] = useState('watchlist');
  const [priceData, setPriceData] = useState(null);

  const handlePriceUpdate = useCallback((data) => {
    setPriceData(data);
  }, []);

  const toggleIndicator = useCallback((name) => {
    setActiveIndicators(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  }, []);

  const info = symbolInfo[symbol] || { name: symbol, exchange: '' };

  return (
    <div className="h-screen w-screen bg-[#131722] flex flex-col overflow-hidden select-none">
      {/* Chart toolbar - includes top bar and sub-header */}
      <ChartToolbar
        symbol={symbol}
        onSymbolChange={setSymbol}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        chartType={chartType}
        onChartTypeChange={setChartType}
        activeIndicators={activeIndicators}
        onToggleIndicator={toggleIndicator}
        priceData={priceData}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left drawing tools */}
        <DrawingTools activeTool={activeTool} onToolSelect={setActiveTool} />

        {/* Chart area */}
        <div className="flex-1 relative min-w-0">
          <ChartWidget
            symbol={symbol}
            timeframe={timeframe}
            chartType={chartType}
            activeIndicators={activeIndicators}
            onPriceUpdate={handlePriceUpdate}
          />
        </div>

        {/* Right panel */}
        {showRightPanel && (
          <div className="w-[260px] bg-[#131722] border-l border-[#2A2E39] flex flex-col shrink-0">
            {/* Watchlist header */}
            <div className="flex items-center justify-between h-[36px] px-2 border-b border-[#2A2E39]">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-white">Watchlist</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button className="w-[26px] h-[26px] flex items-center justify-center text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#2A2E3960] rounded-[3px] transition-colors">
                  <Plus size={14} />
                </button>
                <button className="w-[26px] h-[26px] flex items-center justify-center text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#2A2E3960] rounded-[3px] transition-colors">
                  <Grid3X3 size={14} />
                </button>
                <button className="w-[26px] h-[26px] flex items-center justify-center text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#2A2E3960] rounded-[3px] transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Column headers */}
            <div className="flex items-center justify-between px-3 py-1 border-b border-[#2A2E39] text-[10px] text-[#787B86]">
              <span>Symbol</span>
              <div className="flex items-center gap-6">
                <span>Last</span>
                <span>Chg</span>
                <span>Chg%</span>
              </div>
            </div>

            {/* Category label */}
            <div className="flex items-center gap-1 px-3 py-1.5 text-[10px] text-[#787B86]">
              <ChevronDown size={10} />
              <span className="uppercase tracking-wider font-medium">Stocks</span>
            </div>

            {/* Watchlist items */}
            <div className="flex-1 overflow-y-auto">
              {watchlistItems.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSymbol(item.symbol)}
                  className={`w-full flex items-center justify-between px-3 py-[6px] transition-colors ${
                    item.symbol === symbol
                      ? 'bg-[#2962FF15] border-l-2 border-[#2962FF]'
                      : 'hover:bg-[#1E222D] border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-[20px] h-[20px] rounded-full bg-[#2A2E39] flex items-center justify-center shrink-0">
                      <span className="text-[7px] font-bold text-[#787B86]">{item.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-[12px] font-medium text-white leading-tight">{item.symbol}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-[12px] text-white w-[60px] text-right">{item.price}</span>
                    <span className={`text-[11px] w-[45px] text-right ${item.isUp ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                      {item.change}
                    </span>
                    <span className={`text-[11px] w-[45px] text-right ${item.isUp ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                      {item.changePct}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Symbol detail panel at bottom */}
            {priceData && (
              <div className="border-t border-[#2A2E39] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#2A2E39] flex items-center justify-center">
                      <span className="text-[8px] font-bold text-[#787B86]">{symbol.slice(0, 2)}</span>
                    </div>
                    <span className="text-[14px] font-semibold text-white">{symbol}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-[22px] h-[22px] flex items-center justify-center text-[#787B86] hover:text-[#D1D4DC] rounded-[3px] transition-colors">
                      <ExternalLink size={12} />
                    </button>
                    <button className="w-[22px] h-[22px] flex items-center justify-center text-[#787B86] hover:text-[#D1D4DC] rounded-[3px] transition-colors">
                      <Pencil size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-[#787B86] mb-2">{info.name} · {info.exchange}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] font-bold text-white">{priceData.close?.toFixed(2)}</span>
                  <span className="text-[11px] text-[#787B86]">{info.currency}</span>
                  <span className={`text-[12px] font-medium ${priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                    {priceData.close >= priceData.open ? '+' : ''}{(priceData.close - priceData.open).toFixed(2)}
                  </span>
                  <span className={`text-[12px] ${priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                    {priceData.open ? `${priceData.close >= priceData.open ? '+' : ''}${(((priceData.close - priceData.open) / priceData.open) * 100).toFixed(2)}%` : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Far right icon strip */}
        <div className="w-[38px] bg-[#131722] border-l border-[#2A2E39] flex flex-col items-center pt-2 gap-1 shrink-0">
          {rightSideIcons.map((item) => {
            const Icon = item.icon;
            const isActive = rightTab === item.id && showRightPanel;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (rightTab === item.id && showRightPanel) {
                    setShowRightPanel(false);
                  } else {
                    setRightTab(item.id);
                    setShowRightPanel(true);
                  }
                }}
                className={`w-[30px] h-[30px] flex items-center justify-center rounded-[4px] transition-colors ${
                  isActive ? 'text-[#2962FF] bg-[#2962FF15]' : 'text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#2A2E3960]'
                }`}
                title={item.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="h-[26px] bg-[#131722] border-t border-[#2A2E39] flex items-center px-2 justify-between shrink-0">
        <div className="flex items-center gap-1">
          {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All'].map((tf) => (
            <button
              key={tf}
              className="px-1.5 py-0.5 text-[10px] text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#2A2E3960] rounded transition-colors"
            >
              {tf}
            </button>
          ))}
          <div className="w-px h-3 bg-[#2A2E39] mx-1" />
          <button className="px-1 py-0.5 text-[10px] text-[#787B86] hover:text-[#D1D4DC] transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="1" width="10" height="10" rx="1" />
              <line x1="1" y1="6" x2="11" y2="6" />
              <line x1="6" y1="1" x2="6" y2="11" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#787B86]">
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} UTC</span>
          <div className="w-px h-3 bg-[#2A2E39]" />
          <button className="hover:text-[#D1D4DC] transition-colors">Auto</button>
          <button className="hover:text-[#D1D4DC] transition-colors">Log</button>
          <button className="hover:text-[#D1D4DC] transition-colors">ADJ</button>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
