import React, { useState, useCallback } from 'react';
import { ArrowLeft, PanelRightOpen, PanelRightClose, List, Clock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChartWidget from './ChartWidget';
import ChartToolbar from './ChartToolbar';
import DrawingTools from './DrawingTools';
import { symbolInfo } from '../../data/chartData';

const watchlistItems = [
  { symbol: 'AAPL', price: '248.80', change: '-1.62%', isUp: false },
  { symbol: 'MSFT', price: '383.67', change: '-0.87%', isUp: false },
  { symbol: 'GOOGL', price: '167.89', change: '-0.95%', isUp: false },
  { symbol: 'AMZN', price: '199.34', change: '-3.95%', isUp: false },
  { symbol: 'TSLA', price: '271.85', change: '+3.50%', isUp: true },
  { symbol: 'NVDA', price: '113.76', change: '-2.10%', isUp: false },
  { symbol: 'META', price: '596.25', change: '-1.23%', isUp: false },
  { symbol: 'BTCUSD', price: '104,387', change: '+2.17%', isUp: true },
  { symbol: 'ETHUSD', price: '2,645.3', change: '+3.16%', isUp: true },
  { symbol: 'EURUSD', price: '1.08142', change: '+0.09%', isUp: true },
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
    <div className="h-screen w-screen bg-[#131722] flex flex-col overflow-hidden">
      {/* Top header bar */}
      <div className="h-[36px] bg-[#131722] border-b border-[#2A2E39] flex items-center px-3 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1 text-[#787B86] hover:text-white hover:bg-[#1E222D] rounded transition-colors"
            title="Back to Home"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <svg width="24" height="14" viewBox="0 0 36 20" fill="none">
              <path d="M14 0L14 6L20 6L20 0L14 0Z" fill="#2962FF" />
              <path d="M14 7L14 20L20 20L20 7L14 7Z" fill="#2962FF" />
              <path d="M21 4L21 20L27 20L27 4L21 4Z" fill="#2962FF" />
              <path d="M28 0L28 20L34 20L34 0L28 0Z" fill="#2962FF" />
              <path d="M0 10L0 20L6 20L6 10L0 10Z" fill="#2962FF" />
              <path d="M7 6L7 20L13 20L13 6L7 6Z" fill="#2962FF" />
            </svg>
            <span className="text-[13px] font-semibold text-white">TradingView</span>
          </div>
          <div className="w-px h-4 bg-[#2A2E39] mx-1" />
          <span className="text-[12px] text-[#787B86]">{info.name}</span>
          <span className="text-[10px] text-[#787B86] bg-[#1E222D] px-1.5 py-0.5 rounded">{info.exchange}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="p-1.5 text-[#787B86] hover:text-white hover:bg-[#1E222D] rounded transition-colors"
            title={showRightPanel ? 'Hide panel' : 'Show panel'}
          >
            {showRightPanel ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        </div>
      </div>

      {/* Chart toolbar */}
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
        <div className="flex-1 relative">
          {/* OHLC display */}
          {priceData && priceData.open !== undefined && (
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3 text-[11px] pointer-events-none">
              <span className="text-[#787B86]">O</span>
              <span className={priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}>
                {priceData.open?.toFixed(2)}
              </span>
              <span className="text-[#787B86]">H</span>
              <span className={priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}>
                {priceData.high?.toFixed(2)}
              </span>
              <span className="text-[#787B86]">L</span>
              <span className={priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}>
                {priceData.low?.toFixed(2)}
              </span>
              <span className="text-[#787B86]">C</span>
              <span className={priceData.close >= priceData.open ? 'text-[#26A69A]' : 'text-[#EF5350]'}>
                {priceData.close?.toFixed(2)}
              </span>
            </div>
          )}
          <ChartWidget
            symbol={symbol}
            timeframe={timeframe}
            chartType={chartType}
            activeIndicators={activeIndicators}
            onPriceUpdate={handlePriceUpdate}
          />
        </div>

        {/* Right panel - Watchlist */}
        {showRightPanel && (
          <div className="w-[240px] bg-[#131722] border-l border-[#2A2E39] flex flex-col shrink-0">
            {/* Panel tabs */}
            <div className="flex items-center border-b border-[#2A2E39] px-1">
              <button
                onClick={() => setRightTab('watchlist')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-colors ${
                  rightTab === 'watchlist'
                    ? 'border-[#2962FF] text-white'
                    : 'border-transparent text-[#787B86] hover:text-[#D1D4DC]'
                }`}
              >
                <List size={13} />
                Watchlist
              </button>
              <button
                onClick={() => setRightTab('details')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-colors ${
                  rightTab === 'details'
                    ? 'border-[#2962FF] text-white'
                    : 'border-transparent text-[#787B86] hover:text-[#D1D4DC]'
                }`}
              >
                <Clock size={13} />
                Details
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto">
              {rightTab === 'watchlist' ? (
                <div>
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A2E39]">
                    <span className="text-[11px] text-[#787B86] font-medium">My Watchlist</span>
                    <ChevronDown size={12} className="text-[#787B86]" />
                  </div>
                  {watchlistItems.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => setSymbol(item.symbol)}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-[#1E222D] transition-colors ${
                        item.symbol === symbol ? 'bg-[#1E222D]' : ''
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-[12px] font-medium text-white">{item.symbol}</div>
                        <div className="text-[10px] text-[#787B86]">{symbolInfo[item.symbol]?.exchange || ''}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] text-white">{item.price}</div>
                        <div className={`text-[10px] ${item.isUp ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                          {item.change}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  <h4 className="text-[12px] font-semibold text-white">{symbol} Details</h4>
                  {priceData && (
                    <div className="space-y-2">
                      {[
                        { label: 'Open', value: priceData.open?.toFixed(2) },
                        { label: 'High', value: priceData.high?.toFixed(2) },
                        { label: 'Low', value: priceData.low?.toFixed(2) },
                        { label: 'Close', value: priceData.close?.toFixed(2) },
                        { label: 'Exchange', value: info.exchange },
                        { label: 'Type', value: info.type },
                        { label: 'Currency', value: info.currency },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between py-1 border-b border-[#2A2E39]">
                          <span className="text-[11px] text-[#787B86]">{row.label}</span>
                          <span className="text-[11px] text-white">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="h-[24px] bg-[#131722] border-t border-[#2A2E39] flex items-center px-3 justify-between shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-[#787B86]">
          <span>{timeframe.toUpperCase()}</span>
          <span>{info.exchange} : {symbol}</span>
          <span>{info.currency}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#787B86]">
          <button className="hover:text-[#D1D4DC] transition-colors">Auto</button>
          <button className="hover:text-[#D1D4DC] transition-colors">Log</button>
          <span>%</span>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
