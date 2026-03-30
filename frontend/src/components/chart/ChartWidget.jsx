import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, AreaSeries, BarSeries } from 'lightweight-charts';
import generateCandlestickData, { calculateSMA, calculateEMA, calculateBB } from '../../data/chartData';

const ChartWidget = ({ symbol, timeframe, chartType, activeIndicators, onPriceUpdate }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef([]);
  const [chartData, setChartData] = useState(null);

  // Generate data when symbol changes
  useEffect(() => {
    const data = generateCandlestickData(symbol, 300);
    setChartData(data);
  }, [symbol]);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current || !chartData) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      localization: {
        locale: 'en-US',
      },
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
        vertLine: {
          width: 1,
          color: '#787B8650',
          style: 2,
          labelBackgroundColor: '#2962FF',
        },
        horzLine: {
          width: 1,
          color: '#787B8650',
          style: 2,
          labelBackgroundColor: '#2962FF',
        },
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

    // Add main series based on chart type
    let mainSeries;
    if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
      });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(41, 98, 255, 0.3)',
        bottomColor: 'rgba(41, 98, 255, 0.02)',
        lineColor: '#2962FF',
        lineWidth: 2,
      });
      mainSeries.setData(chartData.candleData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'bar') {
      mainSeries = chart.addSeries(BarSeries, {
        upColor: '#26A69A',
        downColor: '#EF5350',
      });
      mainSeries.setData(chartData.candleData);
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26A69A',
        downColor: '#EF5350',
        borderUpColor: '#26A69A',
        borderDownColor: '#EF5350',
        wickUpColor: '#26A69A',
        wickDownColor: '#EF5350',
      });
      mainSeries.setData(chartData.candleData);
    }
    seriesRef.current = mainSeries;

    // Add volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(chartData.volumeData);
    volumeSeriesRef.current = volumeSeries;

    // Add indicators
    indicatorSeriesRef.current = [];

    if (activeIndicators.includes('SMA')) {
      const sma20 = calculateSMA(chartData.candleData, 20);
      const sma50 = calculateSMA(chartData.candleData, 50);
      const sma20Series = chart.addSeries(LineSeries, { color: '#FF9800', lineWidth: 1, title: 'SMA 20' });
      const sma50Series = chart.addSeries(LineSeries, { color: '#E91E63', lineWidth: 1, title: 'SMA 50' });
      sma20Series.setData(sma20);
      sma50Series.setData(sma50);
      indicatorSeriesRef.current.push(sma20Series, sma50Series);
    }

    if (activeIndicators.includes('EMA')) {
      const ema12 = calculateEMA(chartData.candleData, 12);
      const ema26 = calculateEMA(chartData.candleData, 26);
      const ema12Series = chart.addSeries(LineSeries, { color: '#00BCD4', lineWidth: 1, title: 'EMA 12' });
      const ema26Series = chart.addSeries(LineSeries, { color: '#9C27B0', lineWidth: 1, title: 'EMA 26' });
      ema12Series.setData(ema12);
      ema26Series.setData(ema26);
      indicatorSeriesRef.current.push(ema12Series, ema26Series);
    }

    if (activeIndicators.includes('BB')) {
      const bb = calculateBB(chartData.candleData, 20, 2);
      const bbUpper = chart.addSeries(LineSeries, { color: '#787B8660', lineWidth: 1, lineStyle: 2, title: 'BB Upper' });
      const bbMiddle = chart.addSeries(LineSeries, { color: '#787B86', lineWidth: 1, title: 'BB Middle' });
      const bbLower = chart.addSeries(LineSeries, { color: '#787B8660', lineWidth: 1, lineStyle: 2, title: 'BB Lower' });
      bbUpper.setData(bb.upper);
      bbMiddle.setData(bb.middle);
      bbLower.setData(bb.lower);
      indicatorSeriesRef.current.push(bbUpper, bbMiddle, bbLower);
    }

    // Crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time) {
        if (chartData.candleData.length > 0) {
          const last = chartData.candleData[chartData.candleData.length - 1];
          onPriceUpdate?.(last);
        }
        return;
      }
      const data = param.seriesData?.get(mainSeries);
      if (data) {
        onPriceUpdate?.(data);
      }
    });

    chart.timeScale().fitContent();

    // Update last price
    if (chartData.candleData.length > 0) {
      onPriceUpdate?.(chartData.candleData[chartData.candleData.length - 1]);
    }
  }, [chartData, chartType, activeIndicators, onPriceUpdate]);

  useEffect(() => {
    initChart();
  }, [initChart]);

  // Handle resize
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
    const resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={chartContainerRef} className="w-full h-full" />
  );
};

export default ChartWidget;
