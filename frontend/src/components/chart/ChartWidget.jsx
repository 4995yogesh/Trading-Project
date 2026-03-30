import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, AreaSeries, BarSeries } from 'lightweight-charts';
import generateCandlestickData, { calculateSMA, calculateEMA, calculateBB } from '../../data/chartData';

const ChartWidget = forwardRef(({ symbol, timeframe, chartType, activeIndicators, onPriceUpdate, onChartReady }, ref) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef([]);
  const [chartData, setChartData] = useState(null);

  // Expose chart and series via ref
  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    getSeries: () => seriesRef.current,
    getContainer: () => chartContainerRef.current,
  }));

  useEffect(() => {
    const data = generateCandlestickData(symbol, 300);
    setChartData(data);
  }, [symbol]);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current || !chartData) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      localization: { locale: 'en-US' },
      layout: {
        background: { type: 'solid', color: '#131722' },
        textColor: '#787B86',
        fontSize: 11,
        fontFamily: 'Inter, -apple-system, sans-serif',
      },
      grid: {
        vertLines: { color: '#1E222D', style: 1 },
        horzLines: { color: '#1E222D', style: 1 },
      },
      crosshair: {
        mode: 0,
        vertLine: { width: 1, color: '#787B8650', style: 2, labelBackgroundColor: '#2962FF' },
        horzLine: { width: 1, color: '#787B8650', style: 2, labelBackgroundColor: '#2962FF' },
      },
      timeScale: {
        borderColor: '#2A2E39',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 8,
        minBarSpacing: 2,
      },
      rightPriceScale: {
        borderColor: '#2A2E39',
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    let mainSeries;
    if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 2, crosshairMarkerVisible: true, crosshairMarkerRadius: 4 });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, { topColor: 'rgba(41,98,255,0.3)', bottomColor: 'rgba(41,98,255,0.02)', lineColor: '#2962FF', lineWidth: 2 });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'bar') {
      mainSeries = chart.addSeries(BarSeries, { upColor: '#26A69A', downColor: '#EF5350' });
      mainSeries.setData(chartData.candleData);
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26A69A', downColor: '#EF5350',
        borderUpColor: '#26A69A', borderDownColor: '#EF5350',
        wickUpColor: '#26A69A', wickDownColor: '#EF5350',
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
      const data = param.seriesData?.get(mainSeries);
      if (data) onPriceUpdate?.(data);
    });

    chart.timeScale().fitContent();
    if (chartData.candleData.length > 0) onPriceUpdate?.(chartData.candleData[chartData.candleData.length - 1]);

    // Notify parent chart is ready
    onChartReady?.();
  }, [chartData, chartType, activeIndicators, onPriceUpdate, onChartReady]);

  useEffect(() => { initChart(); }, [initChart]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(handleResize);
    if (chartContainerRef.current) ro.observe(chartContainerRef.current);
    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
});

ChartWidget.displayName = 'ChartWidget';
export default ChartWidget;
