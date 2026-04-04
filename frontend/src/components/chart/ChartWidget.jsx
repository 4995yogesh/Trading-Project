import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, AreaSeries, BarSeries } from 'lightweight-charts';
import generateCandlestickData, { calculateSMA, calculateEMA, calculateBB } from '../../data/chartData';

const ChartWidget = forwardRef(({ symbol, timeframe, chartType, activeIndicators, onPriceUpdate, logScale, chartSettings }, ref) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef([]);
  const [chartData, setChartData] = useState(null);

  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    getSeries: () => seriesRef.current,
    getContainer: () => chartContainerRef.current,
    setVisibleRange: (range) => {
      if (chartRef.current && chartData) {
        try {
          const ts = chartRef.current.timeScale();
          const len = chartData.candleData.length;
          if (range === 'all') { ts.fitContent(); return; }
          const barsMap = { '1D': 1, '5D': 5, '1M': 22, '3M': 66, '6M': 132, 'YTD': 180, '1Y': 252, '5Y': 1260 };
          const barsToShow = barsMap[range] || len;
          const from = Math.max(0, len - barsToShow);
          ts.setVisibleRange({ from: chartData.candleData[from].time, to: chartData.candleData[len - 1].time });
        } catch (e) { console.warn('setVisibleRange error', e); }
      }
    },
    fitContent: () => { chartRef.current?.timeScale().fitContent(); },
  }));

  // Generate data when symbol or timeframe changes
  useEffect(() => {
    const data = generateCandlestickData(symbol, 300, timeframe);
    setChartData(data);
  }, [symbol, timeframe]);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current || !chartData) return;
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }

    const container = chartContainerRef.current;
    const bg = chartSettings?.background || '#131722';
    const gridColor = chartSettings?.showGrid !== false ? (chartSettings?.gridColor || '#1E222D') : 'transparent';
    const crosshairMode = chartSettings?.crosshairMode === 'magnet' ? 1 : 0;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      localization: { locale: 'en-US' },
      layout: {
        background: { type: 'solid', color: bg },
        textColor: '#787B86',
        fontSize: 11,
        fontFamily: 'Inter, -apple-system, sans-serif',
      },
      grid: {
        vertLines: { color: gridColor, style: 1 },
        horzLines: { color: gridColor, style: 1 },
      },
      crosshair: {
        mode: crosshairMode,
        vertLine: { width: 1, color: '#787B8650', style: 2, labelBackgroundColor: '#2962FF' },
        horzLine: { width: 1, color: '#787B8650', style: 2, labelBackgroundColor: '#2962FF' },
      },
      timeScale: {
        borderColor: '#2A2E39',
        timeVisible: ['1m', '5m', '15m', '30m', '1h', '4h'].includes(timeframe),
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 8,
        minBarSpacing: 2,
      },
      rightPriceScale: {
        borderColor: '#2A2E39',
        scaleMargins: { top: 0.1, bottom: 0.25 },
        mode: logScale ? 1 : 0, // 0=Normal, 1=Logarithmic
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    let mainSeries;
    const upColor = chartSettings?.upColor || '#26A69A';
    const downColor = chartSettings?.downColor || '#EF5350';
    const borderUp = chartSettings?.borderUpColor || upColor;
    const borderDown = chartSettings?.borderDownColor || downColor;
    const wickUp = chartSettings?.wickUpColor || upColor;
    const wickDown = chartSettings?.wickDownColor || downColor;

    if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 2, crosshairMarkerVisible: true, crosshairMarkerRadius: 4 });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, { topColor: 'rgba(41,98,255,0.3)', bottomColor: 'rgba(41,98,255,0.02)', lineColor: '#2962FF', lineWidth: 2 });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'bar') {
      mainSeries = chart.addSeries(BarSeries, { upColor, downColor });
      mainSeries.setData(chartData.candleData);
    } else if (chartType === 'hollow') {
      // Hollow candles: up candles transparent body, down candles filled
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: 'transparent', downColor, borderUpColor: borderUp, borderDownColor: borderDown,
        wickUpColor: wickUp, wickDownColor: wickDown,
      });
      mainSeries.setData(chartData.candleData);
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor, downColor, borderUpColor: borderUp, borderDownColor: borderDown,
        wickUpColor: wickUp, wickDownColor: wickDown,
      });
      mainSeries.setData(chartData.candleData);
    }
    seriesRef.current = mainSeries;

    const volumeSeries = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: 'volume' });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    volumeSeries.setData(chartData.volumeData);
    volumeSeriesRef.current = volumeSeries;

    indicatorSeriesRef.current = [];
    if (activeIndicators.includes('SMA')) {
      const s20 = chart.addSeries(LineSeries, { color: '#FF9800', lineWidth: 1, title: 'SMA 20' });
      const s50 = chart.addSeries(LineSeries, { color: '#E91E63', lineWidth: 1, title: 'SMA 50' });
      s20.setData(calculateSMA(chartData.candleData, 20));
      s50.setData(calculateSMA(chartData.candleData, 50));
      indicatorSeriesRef.current.push(s20, s50);
    }
    if (activeIndicators.includes('EMA')) {
      const e12 = chart.addSeries(LineSeries, { color: '#00BCD4', lineWidth: 1, title: 'EMA 12' });
      const e26 = chart.addSeries(LineSeries, { color: '#9C27B0', lineWidth: 1, title: 'EMA 26' });
      e12.setData(calculateEMA(chartData.candleData, 12));
      e26.setData(calculateEMA(chartData.candleData, 26));
      indicatorSeriesRef.current.push(e12, e26);
    }
    if (activeIndicators.includes('BB')) {
      const bb = calculateBB(chartData.candleData, 20, 2);
      const bu = chart.addSeries(LineSeries, { color: '#787B8660', lineWidth: 1, lineStyle: 2 });
      const bm = chart.addSeries(LineSeries, { color: '#787B86', lineWidth: 1 });
      const bl = chart.addSeries(LineSeries, { color: '#787B8660', lineWidth: 1, lineStyle: 2 });
      bu.setData(bb.upper); bm.setData(bb.middle); bl.setData(bb.lower);
      indicatorSeriesRef.current.push(bu, bm, bl);
    }

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time) {
        if (chartData.candleData.length > 0) onPriceUpdate?.(chartData.candleData[chartData.candleData.length - 1]);
        return;
      }
      const d = param.seriesData?.get(mainSeries);
      if (d) onPriceUpdate?.(d);
    });

    chart.timeScale().fitContent();
    if (chartData.candleData.length > 0) onPriceUpdate?.(chartData.candleData[chartData.candleData.length - 1]);
  }, [chartData, chartType, activeIndicators, onPriceUpdate, logScale, chartSettings, timeframe]);

  useEffect(() => { initChart(); }, [initChart]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(handleResize);
    if (chartContainerRef.current) ro.observe(chartContainerRef.current);
    return () => { window.removeEventListener('resize', handleResize); ro.disconnect(); if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; } };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
});

ChartWidget.displayName = 'ChartWidget';
export default ChartWidget;
