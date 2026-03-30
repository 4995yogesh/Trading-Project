import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ChevronDown, CandlestickChart, LineChart, BarChart3, AreaChart,
  Activity, Bell, Settings, Maximize2, Camera, Share2, Undo2, Redo2,
  Layout, Plus, Save, BookOpen, Eye, Clock
} from 'lucide-react';
import { symbolInfo, timeframes, indicators } from '../../data/chartData';

const ChartToolbar = ({
  symbol, onSymbolChange, timeframe, onTimeframeChange,
  chartType, onChartTypeChange, activeIndicators, onToggleIndicator,
  priceData
}) => {
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [showChartTypes, setShowChartTypes] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const chartTypeRef = useRef(null);
  const indicatorsRef = useRef(null);

  const info = symbolInfo[symbol] || { name: symbol, exchange: '', type: '' };
  const lastPrice = priceData?.close || priceData?.value || 0;
  const prevClose = priceData?.open || lastPrice;
  const change = lastPrice - prevClose;
  const changePct = prevClose ? ((change / prevClose) * 100) : 0;
  const isUp = change >= 0;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSymbolSearch(false);
      if (chartTypeRef.current && !chartTypeRef.current.contains(e.target)) setShowChartTypes(false);
      if (indicatorsRef.current && !indicatorsRef.current.contains(e.target)) setShowIndicators(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSymbols = Object.keys(symbolInfo).filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symbolInfo[s].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartTypes = [
    { id: 'candle', label: 'Candles', icon: CandlestickChart },
    { id: 'bar', label: 'Bars', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: LineChart },
    { id: 'area', label: 'Area', icon: AreaChart },
  ];

  const activeChartIcon = chartTypes.find(c => c.id === chartType)?.icon || CandlestickChart;
  const ActiveIcon = activeChartIcon;

  return (
    <div className="h-[40px] bg-[#131722] border-b border-[#2A2E39] flex items-center px-2 gap-1 overflow-x-auto scrollbar-hide">
      {/* Symbol selector */}
      <div className="relative" ref={searchRef}>
        <button
          onClick={() => setShowSymbolSearch(!showSymbolSearch)}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#1E222D] transition-colors"
        >
          <span className="text-[13px] font-semibold text-white">{symbol}</span>
          <ChevronDown size={12} className="text-[#787B86]" />
        </button>

        {showSymbolSearch && (
          <div className="absolute top-full left-0 mt-1 w-[280px] bg-[#1E222D] rounded-lg shadow-2xl border border-[#2A2E39] z-50 overflow-hidden">
            <div className="p-2">
              <div className="flex items-center gap-2 bg-[#131722] rounded px-3 py-2">
                <Search size={14} className="text-[#787B86]" />
                <input
                  type="text"
                  placeholder="Search symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[13px] text-white outline-none flex-1 placeholder-[#787B86]"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredSymbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => { onSymbolChange(sym); setShowSymbolSearch(false); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[#2A2E39] transition-colors ${
                    sym === symbol ? 'bg-[#2962FF15]' : ''
                  }`}
                >
                  <div>
                    <div className="text-[13px] font-medium text-white">{sym}</div>
                    <div className="text-[11px] text-[#787B86]">{symbolInfo[sym].name}</div>
                  </div>
                  <div className="text-[10px] text-[#787B86] bg-[#131722] px-1.5 py-0.5 rounded">
                    {symbolInfo[sym].exchange}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price info */}
      <div className="flex items-center gap-2 px-2 border-r border-[#2A2E39] mr-1">
        <span className="text-[13px] font-semibold text-white">{lastPrice.toFixed(2)}</span>
        <span className={`text-[11px] font-medium ${isUp ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
          {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[#2A2E39]" />

      {/* Timeframe selector */}
      <div className="flex items-center gap-0.5 px-1">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              timeframe === tf.value
                ? 'bg-[#2962FF20] text-[#2962FF]'
                : 'text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D]'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#2A2E39]" />

      {/* Chart type */}
      <div className="relative" ref={chartTypeRef}>
        <button
          onClick={() => setShowChartTypes(!showChartTypes)}
          className="flex items-center gap-1 px-2 py-1 text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D] rounded transition-colors"
        >
          <ActiveIcon size={16} />
          <ChevronDown size={10} />
        </button>

        {showChartTypes && (
          <div className="absolute top-full left-0 mt-1 w-[160px] bg-[#1E222D] rounded-lg shadow-2xl border border-[#2A2E39] z-50 py-1">
            {chartTypes.map((ct) => {
              const CtIcon = ct.icon;
              return (
                <button
                  key={ct.id}
                  onClick={() => { onChartTypeChange(ct.id); setShowChartTypes(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] hover:bg-[#2A2E39] transition-colors ${
                    chartType === ct.id ? 'text-[#2962FF]' : 'text-[#D1D4DC]'
                  }`}
                >
                  <CtIcon size={14} />
                  {ct.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2A2E39]" />

      {/* Indicators */}
      <div className="relative" ref={indicatorsRef}>
        <button
          onClick={() => setShowIndicators(!showIndicators)}
          className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D] rounded transition-colors"
        >
          <Activity size={14} />
          <span>Indicators</span>
          {activeIndicators.length > 0 && (
            <span className="text-[9px] bg-[#2962FF] text-white rounded-full w-4 h-4 flex items-center justify-center">
              {activeIndicators.length}
            </span>
          )}
        </button>

        {showIndicators && (
          <div className="absolute top-full left-0 mt-1 w-[260px] bg-[#1E222D] rounded-lg shadow-2xl border border-[#2A2E39] z-50">
            <div className="p-2 border-b border-[#2A2E39]">
              <div className="flex items-center gap-2 bg-[#131722] rounded px-3 py-2">
                <Search size={14} className="text-[#787B86]" />
                <input
                  type="text"
                  placeholder="Search indicators..."
                  className="bg-transparent text-[12px] text-white outline-none flex-1 placeholder-[#787B86]"
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-1">
              {indicators.map((ind) => {
                const isActive = activeIndicators.includes(ind.name);
                return (
                  <button
                    key={ind.name}
                    onClick={() => onToggleIndicator(ind.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#2A2E39] transition-colors`}
                  >
                    <div>
                      <div className={`text-[12px] font-medium ${isActive ? 'text-[#2962FF]' : 'text-[#D1D4DC]'}`}>
                        {ind.label}
                      </div>
                      <div className="text-[10px] text-[#787B86]">{ind.category}</div>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isActive ? 'bg-[#2962FF] border-[#2962FF]' : 'border-[#787B86]'
                    }`}>
                      {isActive && (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2A2E39]" />

      {/* Action buttons */}
      <div className="flex items-center gap-0.5">
        {[
          { icon: Bell, label: 'Alert' },
          { icon: BookOpen, label: 'Replay' },
        ].map((btn) => {
          const BtnIcon = btn.icon;
          return (
            <button
              key={btn.label}
              className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D] rounded transition-colors"
              title={btn.label}
            >
              <BtnIcon size={14} />
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-0.5">
        {[
          { icon: Undo2, label: 'Undo' },
          { icon: Redo2, label: 'Redo' },
          { icon: Layout, label: 'Layout' },
          { icon: Camera, label: 'Screenshot' },
          { icon: Save, label: 'Save' },
          { icon: Settings, label: 'Settings' },
          { icon: Maximize2, label: 'Fullscreen' },
        ].map((btn) => {
          const BtnIcon = btn.icon;
          return (
            <button
              key={btn.label}
              className="p-1.5 text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D] rounded transition-colors"
              title={btn.label}
            >
              <BtnIcon size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartToolbar;
